-- Execute no SQL Editor depois de activate-devices.sql.
-- Preserva os registros e permite editar/excluir somente em aparelhos autorizados.
begin;
grant update, delete on public.harvests, public.expenses, public.sales to authenticated;

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
