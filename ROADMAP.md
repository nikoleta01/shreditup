# Shreditup App — Roadmap

## ✅ Done

- PWA setup (installable, offline-ready, push notifications)
- Program page with day tabs
- Timetable page
- Anonymous auth (Supabase) — silent sign-in on first register tap
- Activity registration with capacity enforcement at DB level (Postgres function with row lock — prevents race conditions even with 200 simultaneous users)
- "Moje aktivity" nav item (was: Registrácia na aktivity)
- Wave chip component for artist names
- Admin view — password-protected `/admin` page showing registrations per activity, with per-activity CSV export (`admin_auth` cookie + `ADMIN_PASSWORD`)

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

### Photo wall — community photos projected at the festival
**Context:** A projector (pointed at a bedsheet/screen at the venue) displays a live slideshow of photos contributed by attendees. Attendees upload via a QR code on a physical poster — **the upload page is intentionally NOT in the app menu**, to keep the app's everyday face minimal (program, quick glance, done) and avoid pulling people onto their phones. Every photo is moderated before it appears: nothing goes public without admin approval. Admin (Nikoleta) approves from the registration desk during the festival.

**Design principles (do not violate):**
- **No engagement mechanics** — no likes, no comments, no "your photo is live" notifications. Upload-and-forget, one-way street. This is deliberate: the feature must reinforce "be present," not become an attention loop.
- **Default-private** — `status = 'pending'` on upload, private bucket. Public requires an explicit admin approve. The DB default is the safety guarantee.
- **Wall is a look-up experience** — its home is the projector, not anyone's phone. Hidden from the menu.

**What's needed:**
- **DB:** `photos` table — `id`, `user_id` (→ `profiles`, for attribution; name only, no email), `storage_path`, `status` (`pending`|`approved`|`rejected`), `is_seed` (bool), `created_at`, `approved_at`. RLS: only service-role (admin) reads pending photos.
- **Storage:** private Supabase Storage bucket `photos`. Free tier is sufficient (1 GB ≈ 2,500 resized photos; 5 GB/mo egress easily covers one projector). Optionally upgrade to Pro ($25) for the festival month only — removes the 1-week inactivity pause risk and adds headroom; cancel after.
- **Resize on upload** — downscale to ~1600px long edge (~400 KB) in the upload API route with `sharp` *before* storing. This is the main storage/egress lever (5–10× more photos per GB). Do NOT use Supabase's built-in image transformation (Pro-only, paid) — resize ourselves.
- **Upload page** (`/upload` or similar, unlinked): logged-in profile (reuse lazy anonymous auth) → pick photo → resize → upload to private bucket → insert `pending` row tied to `user_id`.
- **Admin approval:** new block on `/admin` (reuse existing `admin_auth` cookie / `ADMIN_PASSWORD`, same per-route pattern as the CSV export). Thumbnails of `pending` photos with Approve / Reject. Approve → `status = 'approved'` + `approved_at`. Reject → delete file + row.
- **Wall page** (`/wall`, NOT in menu, bookmarked on the projector laptop): full-screen auto-advancing slideshow with cross-fade. Polls an API every ~5s for `approved` photos (polling chosen over Realtime — survives flaky festival wifi, "appears within 5s" reads as real-time to a crowd). Protect with a `?key=` token so a random person can't pull up the feed.
- **Egress gotcha to get right:** photo URLs served to the wall must be **stable/cacheable** so the projector's browser caches each image and doesn't re-download it every poll cycle. Use a long-lived signed URL (valid for the whole festival) or serve approved photos from a public bucket. Regenerating signed URLs every poll would burn egress.
- **Seed photos:** ~20 curated images pre-loaded as `status = 'approved'`, `is_seed = true` before the festival, so the wall looks alive from minute one (an empty wall on day one looks broken). The wall doesn't distinguish their origin.
- **Lifecycle:** no expiry during the event — the wall only grows richer over the weekend, and disappearing photos feel arbitrary to contributors. Wipe the bucket manually after the festival. `is_seed` exempts curated photos from cleanup and doubles as a manual "remove this one" lever.

---

## 💡 Ideas (not committed)

- **QR code per activity** — scan at the activity entrance to confirm attendance
- **Cancellation deadline** — prevent cancellation within X hours of the activity start (to avoid last-minute no-shows gaming the waitlist)
