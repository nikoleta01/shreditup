-- Six more wave lessons: 2 from 11:00, 2 from 13:00, 2 from 14:30. Capacity 5
-- each, same `wave` group as the morning three — one wave lesson per person for
-- the whole festival, so 9 slots x 5 = 45 people can ride.
-- Times and durations (these run 30 min, the morning ones 20) live in
-- lib/data.ts; only capacity and group belong here.

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
