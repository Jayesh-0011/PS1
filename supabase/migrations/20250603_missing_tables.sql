-- Run this entire file in Supabase Dashboard → SQL Editor → Run
-- Fixes 404 on: customers, business_transactions

-- ---------------------------------------------------------------------------
-- customers
-- ---------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  name text not null,
  upi_id text,
  phone text,
  opening_balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (vendor_id, name)
);

alter table public.customers enable row level security;

drop policy if exists "Anon read customers demo data" on public.customers;
create policy "Anon read customers demo data"
on public.customers for select
to anon
using (true);

insert into public.customers (
  vendor_id,
  name,
  upi_id,
  phone,
  opening_balance
) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Rajesh Kumar',
    'rajesh@oksbi',
    'UPI: rajesh@oksbi',
    3470
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Meena Stores',
    'meenastore@upi',
    'UPI: meenastore@upi',
    0
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Amit Tea Stall',
    'amitstall@paytm',
    'UPI: amitstall@paytm',
    500
  )
on conflict (vendor_id, name) do nothing;

-- ---------------------------------------------------------------------------
-- business_transactions (sales & expenses on Home screen)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- inventory updates (if not applied yet)
-- ---------------------------------------------------------------------------
drop policy if exists "Anon update inventory demo data" on public.inventory_items;
create policy "Anon update inventory demo data"
on public.inventory_items for update
to anon
using (true)
with check (true);

-- Reload PostgREST schema cache (Supabase usually picks this up within seconds)
notify pgrst, 'reload schema';
