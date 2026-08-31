-- Wave lessons change shape again: 3x20min per hour-block becomes 4x15min
-- per block (4 lessons/hour instead of 3), capacity drops 5 -> 4. The twelve
-- old slots are replaced by sixteen new ones. Times live in lib/data.ts; only
-- capacity and group belong here.
--
-- Safe to run twice. Confirmed no real registrations exist yet against the
-- old ids — the delete cascades any that do.

delete from "public"."activities"
  where "id" in (
    'a5dfa5dd-5ed8-4ad7-afff-a64ffbaf190d',
    'd1665533-4ca4-4b06-b85b-be64145ee966',
    '9bc73fdf-a9cb-48b0-8b0e-dfbda73b07d0',
    '0f01ac1d-4cf5-495c-8f80-941913f0d352',
    '7e537640-87fc-454a-8d08-5126a15cc73b',
    '3324ce02-efa8-4a79-aaeb-96789dc6b6d0',
    '6ca2e5bc-6dd3-4d1f-9b43-fd3be086379a',
    '8f902c2b-3eb0-4028-9c73-7d8ab03b3677',
    '05b2ab02-0675-452b-bd4a-b8a554b0e7e0',
    'e3cc3a44-8aae-4719-b09c-6c4c8114c21f',
    '75b56813-8a8b-473b-af83-b3236f76456e',
    '1723b5ed-4757-4425-94d7-d629791b4eea'
  );

insert into "public"."activities" ("id", "capacity", "group_key")
values
  ('1b9fd50d-3c66-49e8-a3a8-5c6604dcaecb', 4, 'wave'),
  ('533fe899-35e6-4c10-9073-61b2447413ef', 4, 'wave'),
  ('daa1a327-8109-49a9-99f1-3c54fd14a02f', 4, 'wave'),
  ('8dc9d003-27c0-47cf-ae1e-5f2ad2d8faa9', 4, 'wave'),
  ('0bc795ad-b297-4d41-b605-90403879fcf8', 4, 'wave'),
  ('5d15301e-2d7d-44cc-9a9e-71e597414e71', 4, 'wave'),
  ('eaad49e2-b44f-4b8e-8b87-65cb932a976f', 4, 'wave'),
  ('59339517-4468-47ad-bd98-9431d379c867', 4, 'wave'),
  ('261c754a-e546-4e94-bdc8-f6f9c4423dad', 4, 'wave'),
  ('da8d889b-d5c3-43fc-8c88-83b09dd3f6e7', 4, 'wave'),
  ('bbca85dd-0130-4149-bed8-a54d73e30c39', 4, 'wave'),
  ('11f7f3f5-b07a-433a-b565-b3a2e9672688', 4, 'wave'),
  ('d1693fb1-93ea-42fa-a17f-6cd6970120b7', 4, 'wave'),
  ('177ea05d-55ef-4a82-9fac-526c40d4e0e5', 4, 'wave'),
  ('693c683a-e2b7-40e9-b520-fa144c8fb3d0', 4, 'wave'),
  ('90e540b2-da23-4240-b6d5-1e5840f32710', 4, 'wave')
on conflict ("id") do update
  set "capacity" = excluded."capacity",
      "group_key" = excluded."group_key";
