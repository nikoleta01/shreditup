-- Every registerable lesson gets its own activities row (previously they all
-- shared one id, so one registration marked all of them taken and they drew
-- from a single pool). Alongside that: `group_key` caps a user at one lesson
-- per group for the whole festival, so as many distinct people as possible get
-- a slot.

alter table "public"."activities"
  add column if not exists "group_key" text;

alter table "public"."activity_registrations"
  add column if not exists "group_key" text;

-- activity_registrations.group_key is a copy of the activity's, and it is
-- derived, never supplied: the trigger overwrites whatever the caller passed.
-- Trusting the caller here would be a silent hole — a NULL group_key sits
-- outside the partial unique index below, so a row inserted with one bypasses
-- the group rule entirely. Nothing can insert one now.
create or replace function "public"."sync_registration_group_key"()
returns trigger language "plpgsql" as $$
begin
  select group_key into new.group_key
  from public.activities
  where id = new.activity_id;
  return new;
end $$;

create trigger "sync_registration_group_key"
  before insert or update of "activity_id"
  on "public"."activity_registrations"
  for each row execute function "public"."sync_registration_group_key"();

-- Belt to the trigger's braces: once a registration exists, this stops
-- activities.group_key being edited out from under it, which would leave the
-- copies stale. Regrouping an activity means clearing its registrations first.
alter table "public"."activities"
  add constraint "activities_id_group_key_key" unique ("id", "group_key");

alter table "public"."activity_registrations"
  add constraint "activity_registrations_group_key_fkey"
  foreign key ("activity_id", "group_key")
  references "public"."activities" ("id", "group_key")
  on delete cascade;

-- The actual "one wave + one skatepark lesson per person" rule. It has to be an
-- index, not a check inside the function: register_for_activity() locks only
-- the activity row it was handed, which does nothing to stop the same user
-- registering for a *sibling* slot concurrently. Two taps on two different wave
-- lessons would both pass a SELECT-based check. Partial, so the many activities
-- with no group are unaffected.
create unique index "one_activity_per_group_per_user"
  on "public"."activity_registrations" ("user_id", "group_key")
  where "group_key" is not null;

-- Capacity enforcement only held because the app was polite enough to call this
-- function. The old "own registrations only" policy was FOR ALL, so any client
-- could insert straight into activity_registrations and skip it entirely — same
-- for the group rule above. Reads and cancellations stay client-side; inserts
-- now go through the SECURITY DEFINER function or not at all.
drop policy if exists "own registrations only" on "public"."activity_registrations";

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

  -- Lock this activity row so concurrent registrations queue up
  select capacity, group_key into v_capacity, v_group_key
  from activities
  where id = p_activity_id
  for update;

  if not found then
    return json_build_object('error', 'not_found');
  end if;

  -- Count registrations inside the lock — this number is now accurate
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
    -- Two indexes can raise here and they mean different things to the user:
    -- the same lesson twice, or a different lesson in a group they already hold.
    get stacked diagnostics v_constraint = constraint_name;
    if v_constraint = 'one_activity_per_group_per_user' then
      return json_build_object('error', 'group_taken', 'group', v_group_key);
    end if;
    return json_build_object('error', 'already_registered');
end;
$$;
