@AGENTS.md

## Infrastructure notes

- **Scheduled push (`/api/cron`)** is triggered by an **external scheduler (cron-job.org)**, not Vercel Cron. `vercel.json` has no `crons` entry on purpose — do NOT add one (would double-trigger). The external job must send `Authorization: Bearer <CRON_SECRET>`, and `CRON_SECRET` must match in Vercel Production. The route only notifies performances starting 28–33 min out, so it needs a ~5-min cadence. Health is verified via the cron-job.org execution history (200 = OK, 401 = missing/mismatched secret) — not yet confirmed in-repo.
- **Admin broadcast push (`/api/admin/broadcast`)** is a separate, manual, admin-only sender. It is independent of the cron job; they only share the `push_subscriptions` table and VAPID keys.

Do not push to remote without asking first.
After finishing your task, check if you finished a bullet point from ROADMAP.md, and update itaccordingly.
DO not make claude co-author.

1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

    State your assumptions explicitly. If uncertain, ask.
    If multiple interpretations exist, present them - don't pick silently.
    If a simpler approach exists, say so. Push back when warranted.
    If something is unclear, stop. Name what's confusing. Ask.

Please, do not write comments. Only write them when necessary as a real cynical programmer would.
