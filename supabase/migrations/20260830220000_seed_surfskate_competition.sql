-- One-off event, not part of the wave/skatepark lesson groups — group_key null.
insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('88d4ad43-38b2-4127-88e1-2cb585ad511b', 40, null)
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";
