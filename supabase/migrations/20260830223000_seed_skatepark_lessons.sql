-- Four more skatepark lessons: 11:00, 13:00, 14:00, 15:30. Same `skatepark`
-- group as the 9:30 one — one skatepark lesson per person for the whole
-- festival. Capacity 24 for the first two, 20 for the last two.
-- Times live in lib/data.ts; only capacity and group belong here.

insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('25e1b01b-0c86-4e18-9d45-f91fa0652a48', 24, 'skatepark'),
  ('cc9b221f-7ce0-4f55-9d27-ad68f9aa6019', 24, 'skatepark'),
  ('62468aa3-4e91-4da2-9d6f-bcd844d19f51', 20, 'skatepark'),
  ('da37bdc5-b9ee-472f-9007-76052c28299e', 20, 'skatepark')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";
