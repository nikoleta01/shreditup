-- One row per bookable lesson, ids fixed here and mirrored in lib/data.ts
-- (`activityId`). Only id + capacity + group_key live in the DB; title, day and
-- time come from lib/data.ts.

-- The placeholder row every lesson used to point at. Confirmed test data only;
-- the cascade takes its registrations with it.
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
