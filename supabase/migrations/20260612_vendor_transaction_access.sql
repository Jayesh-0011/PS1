alter table public.business_transactions enable row level security;
alter table public.khata_entries enable row level security;

drop policy if exists "Anon read business transactions" on public.business_transactions;
create policy "Anon read business transactions"
on public.business_transactions for select
to anon
using (true);

drop policy if exists "Anon insert business transactions" on public.business_transactions;
create policy "Anon insert business transactions"
on public.business_transactions for insert
to anon
with check (true);

drop policy if exists "Anon read khata demo data" on public.khata_entries;
create policy "Anon read khata demo data"
on public.khata_entries for select
to anon
using (true);

drop policy if exists "Anon insert khata entries" on public.khata_entries;
create policy "Anon insert khata entries"
on public.khata_entries for insert
to anon
with check (true);

grant select, insert on public.business_transactions to anon;
grant select, insert on public.khata_entries to anon;

notify pgrst, 'reload schema';
