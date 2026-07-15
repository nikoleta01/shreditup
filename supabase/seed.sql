-- Registerable activities: only id + capacity live in the DB. The name, day,
-- time, and description are defined in lib/data.ts and matched by this id.
INSERT INTO public.activities (id, capacity)
VALUES ('bb31bcd4-f772-4834-9ba0-7d04f6e0dc05', 20)
ON CONFLICT (id) DO NOTHING;
