-- Show remaining spots in the program. The browser cannot count registrations
-- itself — RLS narrows activity_registrations to the caller's own rows — so the
-- count has to live on activities, which is world-readable.

alter table "public"."activities"
  add column if not exists "registrations_count" int not null default 0;

update "public"."activities" a
  set "registrations_count" = (
    select count(*) from "public"."activity_registrations" r
    where r."activity_id" = a."id"
  );

-- SECURITY DEFINER because the writer is an ordinary authenticated user
-- cancelling their own registration, and activities has no update policy.
create or replace function "public"."sync_activity_registrations_count"()
returns trigger language "plpgsql" security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.activities
      set registrations_count = registrations_count + 1
      where id = new.activity_id;
  elsif tg_op = 'DELETE' then
    update public.activities
      set registrations_count = registrations_count - 1
      where id = old.activity_id;
  elsif new.activity_id is distinct from old.activity_id then
    update public.activities
      set registrations_count = registrations_count - 1
      where id = old.activity_id;
    update public.activities
      set registrations_count = registrations_count + 1
      where id = new.activity_id;
  end if;
  return null;
end $$;

create trigger "sync_activity_registrations_count"
  after insert or delete or update of "activity_id"
  on "public"."activity_registrations"
  for each row execute function "public"."sync_activity_registrations_count"();

-- The program page shows capacity before anyone has a session: the anonymous
-- sign-in is lazy, fired on the first register tap. Scoped to `authenticated`,
-- the numbers only appeared *after* you had tapped the button they were meant
-- to inform — and returning visitors kept a session, so some people saw them
-- and some didn't. Nothing here is personal: id, capacity, count, group.
drop policy if exists "activities are public" on "public"."activities";

create policy "activities are public"
  on "public"."activities"
  for select to "anon", "authenticated"
  using (true);

-- register_for_activity() deliberately keeps counting rows rather than reading
-- registrations_count. The count is for display; the enforcement stays on the
-- authoritative count taken inside the row lock.
