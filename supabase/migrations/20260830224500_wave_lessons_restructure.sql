-- The 11:00–15:30 wave lessons changed shape: 2x30min per hour-long block
-- becomes 3x20min per block (matching the 9:30 block's pattern), so the six
-- old 30-min slots are replaced by nine new 20-min ones. Times live in
-- lib/data.ts; only capacity and group belong here.
--
-- Safe to run twice. Confirmed no real registrations exist yet against the
-- old ids — the delete cascades any that do.

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
