-- Run once in Supabase SQL Editor to remove demo sales/expense and reminder rows.

delete from public.business_transactions
where vendor_id = '11111111-1111-1111-1111-111111111111';

delete from public.reminders
where vendor_id = '11111111-1111-1111-1111-111111111111';
