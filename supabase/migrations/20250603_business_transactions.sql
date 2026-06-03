-- Run this in Supabase SQL Editor if you already applied schema.sql earlier.

create table if not exists public.business_transactions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('sale', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  note text not null default '',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.business_transactions enable row level security;

create policy "Anon read business transactions"
on public.business_transactions for select
to anon
using (true);

create policy "Anon insert business transactions"
on public.business_transactions for insert
to anon
with check (true);

create policy "Anon update inventory demo data"
on public.inventory_items for update
to anon
using (true)
with check (true);
