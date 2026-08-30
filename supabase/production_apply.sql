-- =====================================================================
-- Shreditup — apply pending schema to PRODUCTION
-- =====================================================================
-- Covers migrations 20260714010000 .. 20260830224500.
--
-- Preferred route is `supabase login && supabase db push`, which applies these
-- files and records them itself. This script exists for the Supabase SQL editor
-- when the CLI isn't available.
--
-- Safe to run twice, and safe whether or not `slim_activities` already reached
-- production — every step is guarded. It runs in a single transaction: it either
-- all lands or none of it does. It ends by recording the versions in
-- supabase_migrations.schema_migrations so a later `db push` skips them instead
-- of trying to re-apply.
--
-- Destructive step to be aware of: it DELETES activity 'bb31bcd4-…', the
-- placeholder every lesson used to share. Any registrations against it go with
-- it (FK cascade). Confirmed test data.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 20260714010000_slim_activities
-- Display fields live in lib/data.ts. No-op if already applied.
-- ---------------------------------------------------------------------
alter table "public"."activities"
  drop column if exists "name",
  drop column if exists "description",
  drop column if exists "day",
  drop column if exists "start_time";

-- ---------------------------------------------------------------------
-- 20260730120000_activity_groups
-- ---------------------------------------------------------------------
alter table "public"."activities"
  add column if not exists "group_key" text;

alter table "public"."activity_registrations"
  add column if not exists "group_key" text;

-- group_key on a registration is derived, never supplied: a caller-passed NULL
-- would sit outside the partial unique index below and slip past the group rule.
create or replace function "public"."sync_registration_group_key"()
returns trigger language "plpgsql" as $$
begin
  select group_key into new.group_key
  from public.activities
  where id = new.activity_id;
  return new;
end $$;

drop trigger if exists "sync_registration_group_key" on "public"."activity_registrations";
create trigger "sync_registration_group_key"
  before insert or update of "activity_id"
  on "public"."activity_registrations"
  for each row execute function "public"."sync_registration_group_key"();

-- Drop the FK first: it depends on the unique index below, so dropping that one
-- while the FK still references it aborts the whole transaction on a re-run.
alter table "public"."activity_registrations"
  drop constraint if exists "activity_registrations_group_key_fkey";

alter table "public"."activities"
  drop constraint if exists "activities_id_group_key_key";
alter table "public"."activities"
  add constraint "activities_id_group_key_key" unique ("id", "group_key");

alter table "public"."activity_registrations"
  add constraint "activity_registrations_group_key_fkey"
  foreign key ("activity_id", "group_key")
  references "public"."activities" ("id", "group_key")
  on delete cascade;

-- One wave + one skatepark lesson per person, festival-wide. This must be an
-- index, not a check inside register_for_activity(): that function locks only
-- the activity row it was given, which does not stop the same user registering
-- for a sibling slot concurrently.
create unique index if not exists "one_activity_per_group_per_user"
  on "public"."activity_registrations" ("user_id", "group_key")
  where "group_key" is not null;

-- The old "own registrations only" policy was FOR ALL, so any authenticated
-- client could insert straight into activity_registrations and skip the
-- capacity check entirely. Inserts now go through the SECURITY DEFINER function
-- or not at all.
drop policy if exists "own registrations only" on "public"."activity_registrations";
drop policy if exists "read own registrations" on "public"."activity_registrations";
drop policy if exists "delete own registrations" on "public"."activity_registrations";

create policy "read own registrations"
  on "public"."activity_registrations"
  for select to "authenticated"
  using ("user_id" = "auth"."uid"());

create policy "delete own registrations"
  on "public"."activity_registrations"
  for delete to "authenticated"
  using ("user_id" = "auth"."uid"());

create or replace function "public"."register_for_activity"("p_activity_id" "uuid")
returns json
language "plpgsql" security definer
as $$
declare
  v_capacity int;
  v_group_key text;
  v_count int;
  v_constraint text;
begin
  if auth.uid() is null then
    return json_build_object('error', 'not_authenticated');
  end if;

  select capacity, group_key into v_capacity, v_group_key
  from activities
  where id = p_activity_id
  for update;

  if not found then
    return json_build_object('error', 'not_found');
  end if;

  select count(*) into v_count
  from activity_registrations
  where activity_id = p_activity_id;

  if v_count >= v_capacity then
    return json_build_object('error', 'full');
  end if;

  insert into activity_registrations (user_id, activity_id, group_key)
  values (auth.uid(), p_activity_id, v_group_key);

  return json_build_object('success', true);

exception
  when unique_violation then
    get stacked diagnostics v_constraint = constraint_name;
    if v_constraint = 'one_activity_per_group_per_user' then
      return json_build_object('error', 'group_taken', 'group', v_group_key);
    end if;
    return json_build_object('error', 'already_registered');
end;
$$;

-- ---------------------------------------------------------------------
-- 20260730120100_seed_lesson_activities
-- ---------------------------------------------------------------------
delete from "public"."activities"
  where "id" = 'bb31bcd4-f772-4834-9ba0-7d04f6e0dc05';

insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('a5dfa5dd-5ed8-4ad7-afff-a64ffbaf190d', 5,  'wave'),
  ('d1665533-4ca4-4b06-b85b-be64145ee966', 5,  'wave'),
  ('9bc73fdf-a9cb-48b0-8b0e-dfbda73b07d0', 5,  'wave'),
  ('abfa7892-15b3-42ae-8f33-4ba198d536bd', 24, 'skatepark')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";

-- ---------------------------------------------------------------------
-- 20260730140000_activity_capacity_display
-- ---------------------------------------------------------------------
alter table "public"."activities"
  add column if not exists "registrations_count" int not null default 0;

update "public"."activities" a
  set "registrations_count" = (
    select count(*) from "public"."activity_registrations" r
    where r."activity_id" = a."id"
  );

-- SECURITY DEFINER: the writer is an ordinary authenticated user cancelling
-- their own registration, and activities has no update policy.
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

drop trigger if exists "sync_activity_registrations_count" on "public"."activity_registrations";
create trigger "sync_activity_registrations_count"
  after insert or delete or update of "activity_id"
  on "public"."activity_registrations"
  for each row execute function "public"."sync_activity_registrations_count"();

-- Anonymous sign-in is lazy, so scoped to `authenticated` the capacity numbers
-- only appeared AFTER the user tapped the button they were meant to inform.
-- Nothing here is personal: id, capacity, count, group.
drop policy if exists "activities are public" on "public"."activities";

create policy "activities are public"
  on "public"."activities"
  for select to "anon", "authenticated"
  using (true);

-- ---------------------------------------------------------------------
-- 20260730150000_wave_lessons_round_two
-- 2 from 11:00, 2 from 13:00, 2 from 14:30 — 30 min each, capacity 5.
-- Times live in lib/data.ts.
-- ---------------------------------------------------------------------
insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('b40a824c-bd43-4750-b3d7-287f7664bfbd', 5, 'wave'),
  ('12cf30f1-1012-462f-89d9-19b165586a08', 5, 'wave'),
  ('39ae68b5-a728-456c-8a48-acfe61e9548e', 5, 'wave'),
  ('3a66cc94-09a1-48a0-acf2-1e91dd02f41e', 5, 'wave'),
  ('214ec3ec-8a3f-4da0-baef-dc8844f69724', 5, 'wave'),
  ('9979a19b-92b9-4d00-aa73-1206a54876fd', 5, 'wave')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";

-- ---------------------------------------------------------------------
-- 20260830220000_seed_surfskate_competition
-- One-off event, not part of a lesson group — group_key null.
-- ---------------------------------------------------------------------
insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('88d4ad43-38b2-4127-88e1-2cb585ad511b', 40, null)
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";

-- ---------------------------------------------------------------------
-- 20260830223000_seed_skatepark_lessons
-- Four more skatepark lessons: 11:00, 13:00 (cap 24 each), 14:00, 15:30
-- (cap 20 each). Same `skatepark` group as the 9:30 one.
-- ---------------------------------------------------------------------
insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('25e1b01b-0c86-4e18-9d45-f91fa0652a48', 24, 'skatepark'),
  ('cc9b221f-7ce0-4f55-9d27-ad68f9aa6019', 24, 'skatepark'),
  ('62468aa3-4e91-4da2-9d6f-bcd844d19f51', 20, 'skatepark'),
  ('da37bdc5-b9ee-472f-9007-76052c28299e', 20, 'skatepark')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";

-- ---------------------------------------------------------------------
-- 20260830224500_wave_lessons_restructure
-- The 11:00–15:30 wave lessons changed shape: 2x30min per block becomes
-- 3x20min per block. Six old 30-min slots replaced by nine new 20-min ones.
-- Confirmed no real registrations exist yet against the old ids — the
-- delete cascades any that do.
-- ---------------------------------------------------------------------
delete from "public"."activities"
  where "id" in (
    'b40a824c-bd43-4750-b3d7-287f7664bfbd',
    '12cf30f1-1012-462f-89d9-19b165586a08',
    '39ae68b5-a728-456c-8a48-acfe61e9548e',
    '3a66cc94-09a1-48a0-acf2-1e91dd02f41e',
    '214ec3ec-8a3f-4da0-baef-dc8844f69724',
    '9979a19b-92b9-4d00-aa73-1206a54876fd'
  );

insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('0f01ac1d-4cf5-495c-8f80-941913f0d352', 5, 'wave'),
  ('7e537640-87fc-454a-8d08-5126a15cc73b', 5, 'wave'),
  ('3324ce02-efa8-4a79-aaeb-96789dc6b6d0', 5, 'wave'),
  ('6ca2e5bc-6dd3-4d1f-9b43-fd3be086379a', 5, 'wave'),
  ('8f902c2b-3eb0-4028-9c73-7d8ab03b3677', 5, 'wave'),
  ('05b2ab02-0675-452b-bd4a-b8a554b0e7e0', 5, 'wave'),
  ('e3cc3a44-8aae-4719-b09c-6c4c8114c21f', 5, 'wave'),
  ('75b56813-8a8b-473b-af83-b3236f76456e', 5, 'wave'),
  ('1723b5ed-4757-4425-94d7-d629791b4eea', 5, 'wave')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";

-- ---------------------------------------------------------------------
-- Record these versions so a later `supabase db push` skips them.
-- ---------------------------------------------------------------------
insert into "supabase_migrations"."schema_migrations" ("version", "name")
values
  ('20260714010000', 'slim_activities'),
  ('20260730120000', 'activity_groups'),
  ('20260730120100', 'seed_lesson_activities'),
  ('20260730140000', 'activity_capacity_display'),
  ('20260730150000', 'wave_lessons_round_two'),
  ('20260830220000', 'seed_surfskate_competition'),
  ('20260830223000', 'seed_skatepark_lessons'),
  ('20260830224500', 'wave_lessons_restructure')
on conflict ("version") do nothing;

commit;

-- Sanity check after running — expect 19 rows, wave x12 cap 5, skatepark x5
-- (cap 24,24,24,20,20), surfskate competition x1 cap 40:
--   select group_key, count(*), sum(capacity) from public.activities group by group_key;

-- IMPORTANT: production may already have real registrations against the old
-- wave activity ids (b40a824c…, 12cf30f1…, 39ae68b5…, 3a66cc94…, 214ec3ec…,
-- 9979a19b…) if anyone registered before this schedule change. The delete
-- above cascades and silently drops those registrations. Check first:
--   select count(*) from activity_registrations where activity_id in (
--     'b40a824c-bd43-4750-b3d7-287f7664bfbd', '12cf30f1-1012-462f-89d9-19b165586a08',
--     '39ae68b5-a728-456c-8a48-acfe61e9548e', '3a66cc94-09a1-48a0-acf2-1e91dd02f41e',
--     '214ec3ec-8a3f-4da0-baef-dc8844f69724', '9979a19b-92b9-4d00-aa73-1206a54876fd');
