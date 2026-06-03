# Supabase Setup

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard.
2. Create a new project.
3. Open **Project Settings > API**.
4. Copy:
   - Project URL
   - anon public key

## 2. Add environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Use `.env.example` as the template.

## 3. Create tables

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Open `supabase/schema.sql` from this project.
4. Paste the whole file into Supabase SQL Editor.
5. Click **Run**.

This creates:

- `vendor_profiles`
- `customers`
- `business_transactions` (sales and expenses for the home dashboard)
- `khata_entries`
- `inventory_items`
- `loan_offers`
- `reminders`
- `profile_actions`

It also inserts demo data for Ramesh Kumar.

## 4. Tables overview

### `vendor_profiles`

Stores vendor profile, eKYC status, UPI ID, and business health index.

### `customers`

Stores customer accounts linked to a vendor, including opening balances used to compute current dues.

### `business_transactions`

Stores **sales** and **expenses** shown on the Home screen (separate from customer khata).

### `khata_entries`

Stores customer ledger entries for money in and money out.

### `inventory_items`

Stores current stock and restock levels.

### `loan_offers`

Stores available loan products and minimum business health index needed.

### `reminders`

Stores reminders for restock, khata collection, loan eligibility, GST, and payments.

### `profile_actions`

Stores frontend action requests such as:

- GSTR report submission
- Sharing business status with bank

## 5. Use in frontend code

The frontend loads all vendor data through:

```txt
src/hooks/useVendorApp.ts
src/lib/supabaseRest.ts
src/lib/mappers.ts
```

When `.env` is configured, the app reads profile, customers, khata entries, business transactions, inventory, loans, and reminders from Supabase.

Writes:

- **Add Sale / Update Expense** → `business_transactions`
- **Add Khata Entry** → `khata_entries`
- **Tap inventory item** → updates `inventory_items`
- Profile actions → `profile_actions`

If you see **404** errors for `customers` or `business_transactions` in the browser console, run **`supabase/migrations/20250603_missing_tables.sql`** in the SQL Editor (creates those tables + policies + demo rows).

## 6. PWA

PWA files added:

- `public/manifest.webmanifest`
- `public/sw.js`

The service worker is registered in:

```txt
src/main.tsx
```

After running the app, browsers can install it as a standalone app.
