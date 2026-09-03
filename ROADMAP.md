# Shreditup App — Roadmap

## ✅ Done

- PWA setup (installable, offline-ready, push notifications)
- Push notifications fixed in production (2026-07-14) — VAPID keys were missing from Vercel and the `push_subscriptions` table didn't exist in prod; both added. Subscribe/unsubscribe/cron now use the service-role client (RLS on), and the bell surfaces errors on-screen for iOS debugging
- Program page with day tabs
- Timetable page
- Anonymous auth (Supabase) — silent sign-in on first register tap
- Activity registration with capacity enforcement at DB level (Postgres function with row lock — prevents race conditions even with 200 simultaneous users)
- "Moje aktivity" nav item (was: Registrácia na aktivity)
- Wave chip component for artist names
- Admin view — password-protected `/admin` page showing registrations per activity, with per-activity CSV export (`admin_auth` cookie + `ADMIN_PASSWORD`)
- Per-lesson activity ids + group limit (2026-07-30) — every bookable lesson had been copy-pasted the same `activityId`, so all four shared one capacity pool, one registration marked them all taken, and "Moje aktivity" showed the wrong lesson. Each now has its own UUID and capacity (wave lessons 5, surfskate 24), fixed in `lib/data.ts` and migration `20260730120100_seed_lesson_activities.sql`. New `activities.group_key` (`wave` / `skatepark`) caps a user at one lesson per group for the whole festival, enforced by a partial unique index on `activity_registrations (user_id, group_key)` — not a check inside the function, which the row lock cannot make safe against two concurrent taps on sibling slots. `register_for_activity()` returns a new `group_taken` error. The registration's `group_key` is set by trigger from the activity, never by the caller: a caller-supplied NULL would sit outside the partial index and slip past the rule.
- Registration RLS hardened (2026-07-30) — the `own registrations only` policy was `FOR ALL`, so any authenticated client could `insert` straight into `activity_registrations` and skip the capacity check entirely. Split into read-own + delete-own; inserts now only go through the `SECURITY DEFINER` function. Verified: direct insert, full-lesson insert and slot-swapping update are all rejected for the `authenticated` role, while read/unregister/RPC still work.
- Grouped lesson cards in the program (2026-07-30) — repeating lessons no longer get one row each. `slotGroup` on a `ProgramItem` folds it into a `SLOT_GROUPS` card (`lib/data.ts`), and `getProgramEntriesByDay()` returns items and groups interleaved in time order. Saturday went from 7 rows to 5 and stays at 5 as the remaining ~13 lessons are added — the card just grows chips. Booking one chip dims its siblings, which is the `group_key` rule made visible instead of surfacing as an error. The timetable renders one block per series via `getTimetableItemsByDay()`, which also keeps concurrent slots from each needing their own lane.
- Wave lessons, full Saturday schedule (2026-07-30) — 9 slots: three 20-minute ones from 09:30, then pairs of 30-minute ones from 11:00, 13:00 and 14:30. Capacity 5 each, all in the `wave` group → 45 people can ride, one lesson per person. Durations differ per slot and live in `lib/data.ts`; only capacity + group are in the DB (`20260730150000_wave_lessons_round_two.sql`). The timetable splits a group into **contiguous runs** rather than one block: with gaps at 12:00–13:00 and 14:00–14:30, a single block would have claimed six solid hours. Falls out as four clean 1-hour blocks — computed from the slots, not hardcoded, so a future 40-minute or 90-minute run stays honest.
- Remaining-spots display (2026-07-30) — `activities.registrations_count`, maintained by an `after insert/delete/update` trigger and backfilled on migration. Chips show `3 voľné miesta` / `PLNÉ` and full slots are disabled. Two things worth remembering: (1) the browser **cannot** count `activity_registrations` itself — RLS narrows it to the caller's own rows — so the count has to be denormalised onto `activities`; (2) the `activities are public` policy was `TO authenticated`, and since anonymous sign-in is lazy, capacity was invisible until *after* the user tapped the button it was meant to inform. Policy now covers `anon` too. Verified anon reads capacity but still sees zero rows of `activity_registrations` and `profiles`. `register_for_activity()` deliberately still counts rows under the lock — the column is display only, never enforcement.
- Timetable lanes, readable on a 320px screen (2026-08-21) — overlapping blocks used to stack with each level inset 16% from the left (`STAGGER`/`MAX_LEVELS`), and the left edge is exactly where the title sits, so the block underneath was cut to "Open M" / "Hlavný s". Overlaps now take **side-by-side lanes**, so no block covers another's text. Lane count is per *cluster* of transitively-overlapping events, not per day — Saturday's four-deep 09:00–10:30 must not shrink the lone 17:00 block to a quarter width. Text: title wraps to 2 lines instead of truncating, words are never broken mid-glyph ("Surfska te…" reads worse than a clip), and vertical space goes to the title first — the subtitle repeats what the block colour already says, so it only appears on hour-long blocks (≥56px). Verified in headless Chromium at 320px and 390px across all three days. Colour coding itself was already shared via `CHIP_TONE` (`lib/location-chip.ts`) as of `8a2c1a3` — chips and blocks cannot diverge.
- Venue map (2026-07-23) — replaced the hand-drawn SVG schematic with a real satellite base (`public/map.jpeg`, ~380 KB) and 17 tappable POI pins (entrance, main stage, skate wave, tents ×4, yoga, restaurant, food truck, toilets, showers, campfire, volleyball, P1/P2/pozdĺžne parking). Pins are percentage coords in `lib/map-pois.ts`; tap-to-place tool at `/map?place=1` (`components/venue-map-editor.tsx`) captures new coords. SK/EN legend, deduped by type. (An illustrated SVG variant + view toggle were prototyped and then dropped — satellite-only by choice.) Map container reserves the image aspect ratio (1671×1205) so pins no longer collapse into one line before the JPEG decodes; skeleton pulse + fade-in while loading.

- Survives a user wipe (2026-09-03) — clearing test accounts means `delete from auth.users` (profiles → activity_registrations cascade from there; deleting `profiles` instead orphans every anonymous account). Two things made that unsafe to run once people were using the app: `getSession()` reads localStorage and never asks the server, and a JWT whose user was deleted still verifies by signature — so a wiped device looked signed in for the rest of the token's hour while every write died on the `profiles` → `auth.users` FK, surfacing as a bare "profile error". Reads now go through `getLiveSession()` (a `getUser()` round trip; signs out locally **only** on `user_not_found` / `session_not_found` / `session_expired` / `refresh_token_*` / `bad_jwt` — offline, gateway 5xx and captive portals must never log anyone out on festival wifi), and writes recover on their own: `23503` from either the profile insert or `register_for_activity()` means the account is gone, so `submitRegistration` re-signs-in anonymously and redoes the pair once. Covers the case load-time validation can't — a PWA tab left open for hours across a wipe. Note `push_subscriptions` has no `user_id` and deliberately survives a wipe (cron notifications are lineup-wide, not per-user), and `truncate activity_registrations` would leave `registrations_count` stale because `truncate` doesn't fire the row trigger — always `delete`.

---

## 🔧 In Progress / Next Up

### Switch slots / unregister from the program page

**Status correction:** unregistering already works — `app/registration/page.tsx` has the "Odhlásiť sa" button and deletes from `activity_registrations`, and the count trigger decrements correctly. What's missing is doing it from the **program page**, which the one-per-group rule made important:

- A user who books 09:30 and then wants 10:10 gets `group_taken` and has to go to Aktivity, unregister, come back, re-book. Four steps to change their mind — and changing your mind is more common than hitting a full lesson.
- Fix: tapping a different chip in a group you already hold opens a "Prepnúť na 10:10?" confirm that unregisters and re-registers in one go, instead of the current dead disabled state.
- Race safety: the delete is always safe, but the re-register can fail (someone took the spot in between). Don't drop the original booking until the new one succeeds, or the user ends up with neither.
- Also add plain "Odhlásiť sa" to the program card so the two pages agree.

### Finish i18n coverage — my follow-ups after the title-translation ticket

**Context:** program _titles_ are bilingual (`title: { sk, en }` in `lib/data.ts`, resolved in the `/program` list and `/timetable` grid). These were the follow-ups; only the push-notification one is left.

- ✅ **Program descriptions** — `description` is `{ sk, en }` and resolved through `tr()`, which handles the optional case. Slot-group descriptions in `SLOT_GROUPS` follow the same shape.
- ✅ **"Moje aktivity" activity names** — no longer reads `activities.name` (that column was dropped in `20260714010000_slim_activities.sql`). The page resolves everything through `getRegisterableActivity(activityId)` and `tr(item.title)`, so translations reach it. No `name_en` column needed.
- ⬜ **Push notifications (cron)** — still open. `app/api/cron/route.ts:41` sends `item.title.sk` verbatim. The body is already bilingual (`O 30 minút začína · Starting in 30 min · HH:MM`), so only the title is single-language. Push has no per-user language — either keep SK, mirror the body's dual-language style, or store a lang preference per subscription.
- ✅ **Registration error copy** — the `full` / `already_registered` / `group_taken` / generic messages moved to `t.register.errors` in `lib/i18n.ts`; `GROUP_LABEL` became `t.register.groups` and `groupTaken` interpolates it via a `{group}` placeholder (the SK labels are accusative, so the case lives with the label, not the sentence). Register/confirm/cancel buttons, the name-form modal, `/registration` and the `/map` heading went the same way. `en` is now typed `typeof sk`, so a key added to Slovak and not English fails the build.

---

## 📋 Planned

### Waitlist with push notification when a spot frees up

**Context:** When a lesson is full, users should be able to join a waitlist. When someone cancels, the next person in line gets a push notification: "Uvoľnilo sa miesto na [activity] — registruj sa kým môžeš!"

This got more valuable, and it now has somewhere to live. The wave lessons hold **5 people each — 15 spots across the three slots for the whole festival**, and the group rule means one booking per person, so most attendees will find them full with nothing else to try. The chips already render a disabled `PLNÉ` state; a waitlist button belongs exactly there, turning a dead end into an action. (Surfskate at 24 is far less likely to need it.)

**What's needed:**

- `waitlist` table: `id`, `user_id`, `activity_id`, `position`, `created_at`
- Respect `group_key`: a person already holding a wave lesson shouldn't waitlist another one, and being promoted must not break the one-per-group rule
- DB trigger on DELETE from `activity_registrations` → check if waitlist has entries for that activity → send push notification to the first person in line
- Push notification already has infrastructure (VAPID keys, service worker, subscribe/unsubscribe endpoints) — just needs to be wired to the trigger
- Race condition still applies: if 3 people are notified and only 1 spot is free, the Postgres `register_for_activity` function already handles this — first one in wins, others get "full" error
- RLS policy: users can only see their own waitlist entry
- UI: "Pridať na čakaciu listinu" button when workshop is full, "Si na čakacej listine" state

### Real-time capacity display — _live sync only; the numbers themselves are done_

Counts, "PLNÉ", and disabled full buttons shipped 2026-07-30 (see Done). What's left is only the **live** part — a count changing on your screen because someone else registered on their phone:

- Enable Supabase Realtime on `activities` (`alter publication supabase_realtime add table activities`)
- Client subscribes to the `activities` channel and updates the `availability` map in `app/program/page.tsx` on change
- Today the count is correct on every page load and after your own registration (updated locally); it goes stale only if you sit on the page while others book
- Worth it mainly for the wave lessons, where 5 spots across 3 slots can empty during the time someone spends deciding

### "Moje aktivity" page — personal schedule

**Status correction:** the old note said "`/registration` currently shows all activities" — it doesn't, and hasn't since the slim-activities migration. The page already fetches only the user's own registrations, resolves title/day/time from `lib/data.ts` via `getRegisterableActivity()`, sorts by day then start time, and has an empty state. Effectively done.

Remaining polish, if wanted:

- Visually group by day with headers rather than only sorting by it
- Show `endTime` alongside `startTime` (only the start is displayed today), which matters now that wave slots are 20 minutes long
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
- **Resize on upload** — downscale to ~1600px long edge (~400 KB) in the upload API route with `sharp` _before_ storing. This is the main storage/egress lever (5–10× more photos per GB). Do NOT use Supabase's built-in image transformation (Pro-only, paid) — resize ourselves.
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
