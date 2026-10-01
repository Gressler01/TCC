-- Execute no SQL Editor como postgres. Não apaga registros da granja.
-- Substitui as políticas das quatro tabelas por autorização de instalações.
begin;

create table if not exists public.authorized_devices (
  user_id uuid primary key references auth.users(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 1 and 120),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.authorized_devices enable row level security;
alter table public.harvests enable row level security;
alter table public.expenses enable row level security;
alter table public.sales enable row level security;

-- Políticas permissivas são combinadas com OR. Remover as anteriores evita
-- que uma permissão pública antiga contorne a autorização.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('authorized_devices', 'harvests', 'expenses', 'sales')
  loop
    execute format('drop policy %I on %I.%I',
      existing_policy.policyname, existing_policy.schemaname, existing_policy.tablename);
  end loop;
end;
$$;

revoke all on public.authorized_devices, public.harvests,
  public.expenses, public.sales from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on public.authorized_devices to authenticated;
grant select, insert, update, delete on public.harvests, public.expenses, public.sales to authenticated;

-- Cada sessão consulta apenas sua aprovação. O app não pode aprovar,
-- alterar nem excluir instalações; isso é feito pelo administrador no painel.
create policy "Read own device authorization"
on public.authorized_devices for select to authenticated
using (user_id = (select auth.uid()));

create policy "Authorized devices read harvests"
on public.harvests for select to authenticated
using (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));
create policy "Authorized devices insert harvests"
on public.harvests for insert to authenticated
with check (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));

create policy "Authorized devices read expenses"
on public.expenses for select to authenticated
using (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));
create policy "Authorized devices insert expenses"
on public.expenses for insert to authenticated
with check (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));

create policy "Authorized devices read sales"
on public.sales for select to authenticated
using (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));
create policy "Authorized devices insert sales"
on public.sales for insert to authenticated
with check (exists (
  select 1 from public.authorized_devices
  where user_id = (select auth.uid()) and active
));

drop policy if exists "Authorized devices update harvests" on public.harvests;
create policy "Authorized devices update harvests"
on public.harvests for update to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active))
with check (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

drop policy if exists "Authorized devices delete harvests" on public.harvests;
create policy "Authorized devices delete harvests"
on public.harvests for delete to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

drop policy if exists "Authorized devices update expenses" on public.expenses;
create policy "Authorized devices update expenses"
on public.expenses for update to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active))
with check (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

drop policy if exists "Authorized devices delete expenses" on public.expenses;
create policy "Authorized devices delete expenses"
on public.expenses for delete to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

drop policy if exists "Authorized devices update sales" on public.sales;
create policy "Authorized devices update sales"
on public.sales for update to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active))
with check (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

drop policy if exists "Authorized devices delete sales" on public.sales;
create policy "Authorized devices delete sales"
on public.sales for delete to authenticated
using (exists (select 1 from public.authorized_devices where user_id = (select auth.uid()) and active));

commit;

