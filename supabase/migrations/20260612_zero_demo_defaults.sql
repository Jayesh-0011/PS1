update public.vendor_profiles
set business_health_index = 0
where id = '11111111-1111-1111-1111-111111111111';

update public.customers
set opening_balance = 0
where vendor_id = '11111111-1111-1111-1111-111111111111';

update public.inventory_items
set quantity = 0,
    updated_at = now()
where vendor_id = '11111111-1111-1111-1111-111111111111';

delete from public.khata_entries
where vendor_id = '11111111-1111-1111-1111-111111111111';

delete from public.business_transactions
where vendor_id = '11111111-1111-1111-1111-111111111111';
