INSERT INTO public.activities (id, name, description, day, start_time, capacity)
VALUES (
  'bb31bcd4-f772-4834-9ba0-7d04f6e0dc05',
  'Surfskate lekcia 1',
  NULL,
  2,
  '15:15:00',
  20
)
ON CONFLICT (id) DO NOTHING;
