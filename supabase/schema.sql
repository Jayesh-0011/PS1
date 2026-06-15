create extension if not exists "pgcrypto";

create table if not exists public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text not null,
  phone text not null unique,
  upi_id text not null,
  business_health_index integer not null check (
    business_health_index between 0 and 100
  ),
  aadhaar_status text not null default 'pending',
  pan_status text not null default 'pending',
  bank_status text not null default 'pending',
  shop_address_status text not null default 'pending',
  aadhaar_masked text,
  pan_masked text,
  bank_masked text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.khata_entries (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  customer_name text not null,
  customer_upi text,
  note text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  entry_type text not null check (entry_type in ('money_in', 'money_out')),
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.business_transactions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  transaction_type text not null check (transaction_type in ('sale', 'expense')),
  amount numeric(12, 2) not null check (amount > 0),
  note text not null default '',
  transaction_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  item_name text not null,
  quantity numeric(12, 2) not null default 0,
  unit text not null default 'Kg',
  restock_level numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.loan_offers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric(12, 2) not null,
  tenure_days integer not null,
  monthly_rate numeric(5, 2) not null,
  min_business_health_index integer not null check (
    min_business_health_index between 0 and 100
  )
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  status text not null default 'open' check (status in ('open', 'done')),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.profile_actions (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendor_profiles(id) on delete cascade,
  action_type text not null check (
    action_type in ('gstr_report', 'bank_business_status')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'sent', 'failed')
  ),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.vendor_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.business_transactions enable row level security;
alter table public.khata_entries enable row level security;
alter table public.inventory_items enable row level security;
alter table public.loan_offers enable row level security;
alter table public.reminders enable row level security;
alter table public.profile_actions enable row level security;

create policy "Anon read vendor demo data"
on public.vendor_profiles for select
to anon
using (true);

create policy "Anon create vendor by phone"
on public.vendor_profiles for insert
to anon
with check (true);

create policy "Anon read customers demo data"
on public.customers for select
to anon
using (true);

create policy "Anon read khata demo data"
on public.khata_entries for select
to anon
using (true);

create policy "Anon insert khata entries"
on public.khata_entries for insert
to anon
with check (true);

create policy "Anon read business transactions"
on public.business_transactions for select
to anon
using (true);

create policy "Anon insert business transactions"
on public.business_transactions for insert
to anon
with check (true);

create policy "Anon read inventory demo data"
on public.inventory_items for select
to anon
using (true);

create policy "Anon update inventory demo data"
on public.inventory_items for update
to anon
using (true)
with check (true);

create policy "Anon read loan offers"
on public.loan_offers for select
to anon
using (true);

create policy "Anon read reminders demo data"
on public.reminders for select
to anon
using (true);

create policy "Anon insert profile actions"
on public.profile_actions for insert
to anon
with check (true);

create policy "Anon read profile actions"
on public.profile_actions for select
to anon
using (true);

insert into public.vendor_profiles (
  id,
  name,
  business_type,
  phone,
  upi_id,
  business_health_index,
  aadhaar_status,
  pan_status,
  bank_status,
  shop_address_status,
  aadhaar_masked,
  pan_masked,
  bank_masked
) values (
  '11111111-1111-1111-1111-111111111111',
  'Ramesh Kumar',
  'Street Food Vendor',
  '9876543210',
  'ramesh@oksbi',
  0,
  'completed',
  'completed',
  'completed',
  'pending',
  'XXXX XXXX 2481',
  'ABCDE1234F',
  'SBI ending 0924'
) on conflict (id) do nothing;

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
    0
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
    0
  )
on conflict (vendor_id, name) do nothing;

insert into public.inventory_items (
  vendor_id,
  item_name,
  quantity,
  unit,
  restock_level
) values
  ('11111111-1111-1111-1111-111111111111', 'Tomatoes', 0, 'Kg', 20),
  ('11111111-1111-1111-1111-111111111111', 'Onions', 0, 'Kg', 25),
  ('11111111-1111-1111-1111-111111111111', 'Potatoes', 0, 'Kg', 20);

insert into public.loan_offers (
  name,
  amount,
  tenure_days,
  monthly_rate,
  min_business_health_index
) values
  ('Daily Working Capital', 15000, 45, 1.20, 70),
  ('Inventory Booster', 25000, 90, 1.50, 80),
  ('Festival Stock Loan', 40000, 120, 1.80, 85);
