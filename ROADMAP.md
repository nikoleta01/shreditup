# Shreditup App — Roadmap

## ✅ Done

- PWA setup (installable, offline-ready, push notifications)
- Program page with day tabs
- Timetable page
- Anonymous auth (Supabase) — silent sign-in on first register tap
- Activity registration with capacity enforcement at DB level (Postgres function with row lock — prevents race conditions even with 200 simultaneous users)
- "Moje aktivity" nav item (was: Registrácia na aktivity)
- Wave chip component for artist names

---

## 🔧 In Progress / Next Up

### Unregister from activity
Allow users to cancel their registration for a workshop or lesson.
- Add "Odhlásiť sa" button on the program card (when registered)
- Delete row from `activity_registrations`
- Same race condition safety is not needed for unregister (deleting is always safe)

---

## 📋 Planned

### Waitlist with push notification when a spot frees up
**Context:** When a workshop (e.g. Surfskate lekcia, capacity 20) is full, users should be able to join a waitlist. When someone cancels their registration, the next person in the waitlist gets a push notification: "Uvoľnilo sa miesto na [activity] — registruj sa kým môžeš!"

**What's needed:**
- `waitlist` table: `id`, `user_id`, `activity_id`, `position`, `created_at`
- DB trigger on DELETE from `activity_registrations` → check if waitlist has entries for that activity → send push notification to the first person in line
- Push notification already has infrastructure (VAPID keys, service worker, subscribe/unsubscribe endpoints) — just needs to be wired to the trigger
- Race condition still applies: if 3 people are notified and only 1 spot is free, the Postgres `register_for_activity` function already handles this — first one in wins, others get "full" error
- RLS policy: users can only see their own waitlist entry
- UI: "Pridať na čakaciu listinu" button when workshop is full, "Si na čakacej listine" state

### Real-time capacity display
**Context:** Show remaining spots per activity (e.g. "7 miest zostáva") that updates live as people register/cancel — even across different devices.

**What's needed:**
- `registrations_count` column on `activities` table (maintained by DB trigger on INSERT/DELETE to `activity_registrations`)
- Enable Supabase Realtime on `activities` table
- Client subscribes to `activities` Realtime channel and updates displayed count on change
- Disable "Zaregistrovať sa" button when `registrations_count >= capacity`
- Note: enforcement is already bulletproof at DB level regardless of whether this is built

### "Moje aktivity" page — personal schedule
**Context:** The `/registration` page currently shows all activities. Long-term vision: show the user's own registrations as a personal schedule/harmonogram. Useful reminder during the festival ("what did I sign up for and when?").

**What's needed:**
- Fetch only the user's registrations from `activity_registrations`
- Join with `activities` table to show name, day, time
- Simple list grouped by day
- Empty state: "Zatiaľ nie si prihlásený/á na žiadnu aktivitu"

---

## 💡 Ideas (not committed)

- **QR code per activity** — scan at the activity entrance to confirm attendance
- **Admin view** — simple password-protected page showing registrations per activity (useful for workshop organisers)
- **Cancellation deadline** — prevent cancellation within X hours of the activity start (to avoid last-minute no-shows gaming the waitlist)
