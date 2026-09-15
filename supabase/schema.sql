-- Execute este arquivo uma vez no SQL Editor do Supabase.
-- O aplicativo não possui autenticação. Por isso, as políticas permitem que o
-- papel público anon leia e altere os registros usando a publishable key.

create extension if not exists pgcrypto;

create table if not exists public.harvests (
  id uuid primary key default gen_random_uuid(),
  harvest_date date not null,
  quantity_grams bigint not null check (quantity_grams > 0),
  notes text check (notes is null or char_length(notes) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null check (char_length(trim(description)) between 1 and 100),
  expense_date date not null,
  amount_cents bigint not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  client text not null check (char_length(trim(client)) between 1 and 120),
  sale_date date not null default current_date,
  sale_type text not null check (sale_type in ('tray', 'kilogram')),
  quantity numeric(12, 3) not null check (quantity > 0),
  total_cents bigint not null check (total_cents > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_tray_quantity_is_integer check (
    sale_type <> 'tray' or quantity = trunc(quantity)
  )
);

create index if not exists harvests_date_idx on public.harvests (harvest_date desc);
create index if not exists expenses_date_idx on public.expenses (expense_date desc);
create index if not exists sales_date_idx on public.sales (sale_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists harvests_set_updated_at on public.harvests;
create trigger harvests_set_updated_at
before update on public.harvests
for each row execute function public.set_updated_at();

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

drop trigger if exists sales_set_updated_at on public.sales;
create trigger sales_set_updated_at
before update on public.sales
for each row execute function public.set_updated_at();

alter table public.harvests enable row level security;
alter table public.expenses enable row level security;
alter table public.sales enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.harvests to anon, authenticated;
grant select, insert, update, delete on public.expenses to anon, authenticated;
grant select, insert, update, delete on public.sales to anon, authenticated;

drop policy if exists "Public access to harvests" on public.harvests;
create policy "Public access to harvests"
on public.harvests for all to anon, authenticated
using (true) with check (true);

drop policy if exists "Public access to expenses" on public.expenses;
create policy "Public access to expenses"
on public.expenses for all to anon, authenticated
using (true) with check (true);

drop policy if exists "Public access to sales" on public.sales;
create policy "Public access to sales"
on public.sales for all to anon, authenticated
using (true) with check (true);

-- Dados iniciais para teste. Os UUIDs fixos evitam duplicação ao executar
-- este arquivo mais de uma vez.
insert into public.harvests (id, harvest_date, quantity_grams, notes)
values
  ('10000000-0000-4000-8000-000000000001', '2025-05-20', 45000, 'Morangos maduros, boa qualidade.'),
  ('10000000-0000-4000-8000-000000000002', '2025-05-15', 32500, null),
  ('10000000-0000-4000-8000-000000000003', '2025-05-10', 28000, 'Colheita pela manhã.'),
  ('10000000-0000-4000-8000-000000000004', '2025-05-05', 19000, null),
  ('10000000-0000-4000-8000-000000000005', '2025-04-28', 42300, null)
on conflict (id) do nothing;

insert into public.expenses (id, description, expense_date, amount_cents)
values
  ('20000000-0000-4000-8000-000000000001', 'Mudas', '2025-05-05', 120000),
  ('20000000-0000-4000-8000-000000000002', 'Fertilizantes', '2025-05-07', 65000),
  ('20000000-0000-4000-8000-000000000003', 'Defensivos', '2025-05-10', 32000),
  ('20000000-0000-4000-8000-000000000004', 'Mão de obra', '2025-05-15', 100000),
  ('20000000-0000-4000-8000-000000000005', 'Embalagens', '2025-05-18', 21000)
on conflict (id) do nothing;

insert into public.sales (id, client, sale_date, sale_type, quantity, total_cents)
values
  ('30000000-0000-4000-8000-000000000001', 'Comércio Local', '2025-05-05', 'kilogram', 45, 215000),
  ('30000000-0000-4000-8000-000000000002', 'Mercado Central', '2025-05-10', 'kilogram', 80, 380000),
  ('30000000-0000-4000-8000-000000000003', 'Supermercado Bom Preço', '2025-05-15', 'kilogram', 60, 290000),
  ('30000000-0000-4000-8000-000000000004', 'Feira Municipal', '2025-05-20', 'kilogram', 28, 160000),
  ('30000000-0000-4000-8000-000000000005', 'Cliente de Bandejas', '2025-05-22', 'tray', 20, 50000)
on conflict (id) do nothing;
