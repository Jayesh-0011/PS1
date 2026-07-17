-- Stores the exact structured JSON produced by the voice model beside the saved transaction.
alter table public.business_transactions
add column if not exists voice_payload jsonb;
