update public.vendor_profiles
set phone = right(regexp_replace(phone, '[^0-9]', '', 'g'), 10);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.vendor_profiles'::regclass
      and contype = 'u'
      and conname = 'vendor_profiles_phone_key'
  ) then
    alter table public.vendor_profiles
    add constraint vendor_profiles_phone_key unique (phone);
  end if;
end
$$;

drop policy if exists "Anon create vendor by phone" on public.vendor_profiles;
create policy "Anon create vendor by phone"
on public.vendor_profiles for insert
to anon
with check (true);
