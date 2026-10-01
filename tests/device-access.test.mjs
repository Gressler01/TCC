// Dependência temporária: npm install --prefix dist/sql-validation --no-save --package-lock=false @electric-sql/pglite
// Executar: node --test tests/device-access.test.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PGlite } from '../dist/sql-validation/node_modules/@electric-sql/pglite/dist/index.js';

test('RLS protege registros, autorizações e revogação sem apagar dados', async () => {
  const db = new PGlite();
  const approved = '10000000-0000-4000-8000-000000000001';
  const pending = '10000000-0000-4000-8000-000000000002';
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('${approved}'), ('${pending}');
    `);
    const schema = (await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8'))
      .replace('create extension if not exists pgcrypto;', '');
    const migration = await readFile(new URL('../supabase/activate-devices.sql', import.meta.url), 'utf8');
    await db.exec(schema);
    await db.exec(`
      insert into public.authorized_devices (user_id, label) values ('${approved}', 'Teste');
      insert into public.harvests (harvest_date, quantity_grams) values (current_date, 1000);
      insert into public.expenses (description, expense_date, amount_cents) values ('Teste', current_date, 100);
      insert into public.sales (client, sale_type, quantity, total_cents) values ('Teste', 'tray', 1, 100);
      create policy "Legacy public access" on public.sales for all to public using (true) with check (true);
    `);
    await db.exec(migration);
    await db.exec(migration); // Reexecução segura, preserva dados e aprovações.
    const asRole = async (role, id = '') => {
      await db.exec('reset role');
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
      await db.exec(`set role ${role}`);
    };
    const inserts = {
      harvests: "insert into public.harvests (harvest_date, quantity_grams) values (current_date, 2000)",
      expenses: "insert into public.expenses (description, expense_date, amount_cents) values ('Permitido', current_date, 200)",
      sales: "insert into public.sales (client, sale_type, quantity, total_cents) values ('Permitido', 'tray', 2, 200)",
    };
    const denied = async (sql) => assert.rejects(db.exec(sql), (error) => error.code === '42501');
    await asRole('anon');
    for (const [table, insert] of Object.entries(inserts)) {
      await denied(`select * from public.${table}`);
      await denied(insert);
    }
    await asRole('authenticated', pending);
    assert.equal((await db.query('select * from public.authorized_devices')).rows.length, 0);
    await denied(`insert into public.authorized_devices (user_id, label) values ('${pending}', 'Autoaprovação')`);
    for (const [table, insert] of Object.entries(inserts)) {
      assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
      await denied(insert);
    }
    await asRole('authenticated', approved);
    assert.equal((await db.query('select * from public.authorized_devices')).rows.length, 1);
    await denied('update public.authorized_devices set active = true');
    await denied('delete from public.authorized_devices');
    for (const [table, insert] of Object.entries(inserts)) {
      assert.equal((await db.query(`select * from public.${table}`)).rows.length, 1);
      await db.exec(insert);
      await denied(`delete from public.${table}`);
      await denied(`update public.${table} set created_at = now()`);
    }
    await asRole('postgres');
    await db.exec(`update public.authorized_devices set active = false where user_id = '${approved}'`);
    await asRole('authenticated', approved);
    for (const [table, insert] of Object.entries(inserts)) {
      assert.equal((await db.query(`select * from public.${table}`)).rows.length, 0);
      await denied(insert);
    }
    await asRole('postgres');
    for (const table of Object.keys(inserts)) {
      assert.equal((await db.query(`select * from public.${table}`)).rows.length, 2);
    }
  } finally {
    await db.close();
  }
});
