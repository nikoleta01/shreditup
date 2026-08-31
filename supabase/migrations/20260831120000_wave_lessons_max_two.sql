-- Wave now allows 2 lessons per person instead of 1 (skatepark stays at 1).
-- A plain unique index can only express "at most one", so the group cap moves
-- inside the function, guarded by an advisory lock on (user_id, group_key) —
-- without it, two concurrent taps on two different wave lessons could both
-- pass a stale count check and let a third slot slip through.

drop index if exists "public"."one_activity_per_group_per_user";

create or replace function "public"."register_for_activity"("p_activity_id" "uuid")
returns json
language "plpgsql" security definer
as $$
declare
  v_capacity int;
  v_group_key text;
  v_count int;
  v_group_count int;
  v_max_per_user int;
begin
  if auth.uid() is null then
    return json_build_object('error', 'not_authenticated');
  end if;

  -- Lock this activity row so concurrent registrations for this slot queue up
  select capacity, group_key into v_capacity, v_group_key
  from activities
  where id = p_activity_id
  for update;

  if not found then
    return json_build_object('error', 'not_found');
  end if;

  if v_group_key is not null then
    -- Serializes concurrent registrations by the *same* user in the *same*
    -- group. The activity row lock above only covers this one slot, which
    -- does nothing to stop two taps on two different sibling slots racing.
    perform pg_advisory_xact_lock(
      hashtextextended(auth.uid()::text || ':' || v_group_key, 0)
    );

    v_max_per_user := case v_group_key when 'wave' then 2 else 1 end;

    select count(*) into v_group_count
    from activity_registrations
    where user_id = auth.uid() and group_key = v_group_key;

    if v_group_count >= v_max_per_user then
      return json_build_object('error', 'group_taken', 'group', v_group_key);
    end if;
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
    -- Only unique_user_activity can raise here now — the group cap above is
    -- checked explicitly rather than relying on a unique index.
    return json_build_object('error', 'already_registered');
end;
$$;
