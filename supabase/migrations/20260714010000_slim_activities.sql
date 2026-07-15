-- Drop the display columns from activities. Title, day, time, and description
-- now live only in lib/data.ts (the single source of truth), matched by the
-- program item's `activityId`. The table keeps id + capacity (+ created_at) —
-- a pure capacity registry that the register_for_activity() function locks and
-- counts against. Dropping these is safe: name/day/start_time are duplicated in
-- lib/data.ts and description was always NULL.
alter table "public"."activities"
  drop column if exists "name",
  drop column if exists "description",
  drop column if exists "day",
  drop column if exists "start_time";
