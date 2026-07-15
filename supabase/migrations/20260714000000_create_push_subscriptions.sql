-- Push subscriptions for Web Push (VAPID).
-- Read/written ONLY via the service_role key in the API routes:
--   /api/push/subscribe, /api/push/unsubscribe, /api/cron, /api/admin/broadcast.
-- RLS is enabled with no anon/authenticated policies, so the public anon key
-- cannot read or modify subscriptions (a push endpoint is a capability URL —
-- anyone holding it could send the user notifications).

create table if not exists "public"."push_subscriptions" (
  "id" uuid primary key default gen_random_uuid(),
  "endpoint" text not null unique,
  "p256dh" text not null,
  "auth" text not null,
  "created_at" timestamptz not null default now()
);

alter table "public"."push_subscriptions" enable row level security;
