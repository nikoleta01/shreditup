"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import {
  formatTime,
  getProgramEntriesByDay,
  type ProgramEntry,
  type ProgramItem,
} from "@/lib/data";
import { useLang } from "@/components/language-provider";
import { spotsLeft } from "@/lib/i18n";
import { DayTabs } from "@/components/day-tabs";
import { WaveChip } from "@/components/wave-chip";
import { toneForLocation } from "@/lib/location-chip";
import { ProgramTitle } from "@/components/program-title";
import {
  ensureAnonymousSession,
  getLiveSession,
  getSupabase,
  reauthenticateAnonymously,
} from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const SKATE_WAVE_URL = "https://www.kokopeli.sk/";
const LEVEL_TREVEL_URL = "https://www.leveltrevel.sk/";
const KAMPOSLOVENSKU_URL = "https://www.instagram.com/kamposlovensku/";

type Profile = { first_name: string; last_name: string };

type ActivityRow = {
  id: string;
  capacity: number;
  registrations_count: number;
};

// How full each registerable activity is, keyed by activityId. Counts come from
// activities.registrations_count (a trigger-maintained column) because RLS stops
// the browser counting activity_registrations itself.
type Availability = Map<string, { capacity: number; count: number }>;

type Modal =
  | { type: "confirm"; activityId: string; activityName: string }
  | { type: "name-form"; activityId: string; activityName: string };

// Mirrors activities.group_key in the DB. One registration per group per person
// for the whole festival, so the slots spread across as many people as possible.

// Instagram allows letters, digits, underscores and inner dots. The tail is
// deliberately not a dot, so a handle ending a sentence doesn't swallow the
// full stop.
const IG_HANDLE = /@([A-Za-z0-9_](?:[A-Za-z0-9_.]*[A-Za-z0-9_])?)/g;

// @handles in descriptions are Instagram accounts. Linked here rather than
// stored as markup in lib/data.ts, so the copy stays plain translatable text.
function Description({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const m of text.matchAll(IG_HANDLE)) {
    const at = m.index ?? 0;
    if (at > cursor) parts.push(text.slice(cursor, at));
    parts.push(
      <a
        key={at}
        href={`https://www.instagram.com/${m[1]}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-foreground/40 underline-offset-2"
      >
        {m[0]}
      </a>,
    );
    cursor = at + m[0].length;
  }
  parts.push(text.slice(cursor));

  return <p className={className}>{parts}</p>;
}

function TimeColumn({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  return (
    // items-start, not items-end: right-aligning inside this 56px box left a
    // ragged ~18px gap before the time, so the page looked inset further on the
    // left than the 16px it has on the right.
    <div className="flex w-14 shrink-0 flex-col items-start">
      <span
        className="text-lg font-bold leading-tight tabular-nums text-black"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
        }}
      >
        {formatTime(startTime)}
      </span>
      <span
        className="text-base tabular-nums text-black"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
        }}
      >
        {formatTime(endTime)}
      </span>
    </div>
  );
}

function ProgramCard({
  p,
  registered,
  availability,
  onRegister,
}: {
  p: ProgramItem;
  registered: boolean;
  availability: Availability;
  onRegister: (activityId: string, activityName: string) => void;
}) {
  const { t, tr, lang } = useLang();
  const title = tr(p.title);
  const seat = p.activityId ? availability.get(p.activityId) : undefined;
  const left = seat ? Math.max(seat.capacity - seat.count, 0) : null;
  const isFull = left === 0 && !registered;
  return (
    <div className="flex gap-4 py-4">
      <TimeColumn startTime={p.startTime} endTime={p.endTime} />
      <div className="flex-1 space-y-1 pb-1">
        <div>
          <h3
            className="text-lg font-bold leading-tight text-foreground"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            <ProgramTitle p={p} />
          </h3>
          {p.location && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <WaveChip
                className="text-xs"
                tone={toneForLocation(p.location)}
                href={p.location === "skateWave" ? SKATE_WAVE_URL : undefined}
              >
                {t.locations[p.location]}
              </WaveChip>
            </div>
          )}
        </div>
        {p.description && (
          <Description
            text={tr(p.description)}
            className="whitespace-pre-line text-sm text-foreground/85"
          />
        )}
        {p.activityId && (
          <div className="pt-1">
            {registered ? (
              <span
                className="text-xs font-bold text-foreground/85"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                {t.register.registered} ✓
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isFull}
                  onClick={() => onRegister(p.activityId!, title)}
                  className="border-2 border-foreground bg-foreground px-3 py-1 text-xs font-bold text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-foreground disabled:hover:text-background"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.cta}
                </button>
                {left !== null && (
                  <span
                    className="text-xs font-bold uppercase tracking-wide text-foreground/60"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    {isFull ? t.full : spotsLeft(left, lang)}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// One card for a whole lesson series. The slots become time chips rather than
// rows: eighteen program points on Saturday is unreadable, and the eight wave
// slots are one offering with eight openings, not eight things to attend.
// Booking one dims the rest, which is the one-per-group rule shown rather than
// explained — the DB still rejects it either way.
function LessonGroupCard({
  entry,
  registeredIds,
  availability,
  onRegister,
}: {
  entry: Extract<ProgramEntry, { kind: "group" }>;
  registeredIds: Set<string>;
  availability: Availability;
  onRegister: (activityId: string, activityName: string) => void;
}) {
  const { t, tr, lang } = useLang();
  const { group, slots, startTime, endTime } = entry;
  const bookedSlots = slots.filter(
    (s) => s.activityId && registeredIds.has(s.activityId),
  );
  const atMax = bookedSlots.length >= group.maxPerUser;

  return (
    <div className="flex gap-4 py-4">
      <TimeColumn startTime={startTime} endTime={endTime} />
      <div className="flex-1 space-y-1 pb-1">
        <h3
          className="text-lg font-bold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {tr(group.title)}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <WaveChip
            className="text-xs"
            tone={toneForLocation(group.location)}
            href={group.location === "skateWave" ? SKATE_WAVE_URL : undefined}
          >
            {t.locations[group.location]}
          </WaveChip>
        </div>
        <Description
          text={tr(group.description)}
          className="text-sm text-foreground/85"
        />

        <div className="flex flex-wrap gap-2 pt-2">
          {slots.map((slot) => {
            if (!slot.activityId) return null;
            const isBooked = bookedSlots.some((b) => b.id === slot.id);
            const seat = availability.get(slot.activityId);
            const left = seat ? Math.max(seat.capacity - seat.count, 0) : null;
            const isFull = left === 0 && !isBooked;
            // Hitting the group's max blocks the remaining siblings — the
            // DB rejects going over it, so don't offer the tap.
            const blocked = (atMax && !isBooked) || isFull;
            return (
              <button
                key={slot.id}
                disabled={blocked}
                aria-pressed={isBooked}
                onClick={() => onRegister(slot.activityId!, tr(slot.title))}
                className={`flex w-24 flex-col items-center whitespace-nowrap border-2 border-foreground px-2.5 py-1 transition-colors ${
                  isBooked
                    ? "bg-foreground text-background"
                    : blocked
                      ? "cursor-not-allowed text-foreground/40 opacity-50"
                      : "text-foreground hover:bg-foreground hover:text-background"
                }`}
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                <span className="text-xs font-bold tabular-nums">
                  {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                  {isBooked && " ✓"}
                </span>
                {left !== null && !isBooked && (
                  <span className="text-[10px] font-bold uppercase tracking-wide opacity-75">
                    {isFull ? t.full : spotsLeft(left, lang)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {bookedSlots.length > 0 && (
          <p
            className="pt-1 text-xs font-bold text-foreground/85"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {t.register.registered} ·{" "}
            {bookedSlots
              .map((s) => `${s.startTime}–${s.endTime}`)
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

// Only shown outside the installed PWA. The notice is about *this browser*
// holding the booking, which is precisely what a home-screen install avoids —
// so showing it inside the installed app would be noise. Defaults to hidden so
// it never flashes for PWA users, and a failed detection errs towards showing
// a harmless warning rather than hiding a needed one.
const STANDALONE_QUERY = "(display-mode: standalone)";

function subscribeToDisplayMode(onChange: () => void) {
  const mq = window.matchMedia(STANDALONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function isStandalone() {
  return (
    window.matchMedia(STANDALONE_QUERY).matches ||
    // iOS Safari predates display-mode and reports its own flag.
    ("standalone" in navigator && navigator.standalone === true)
  );
}

function DeviceWarning() {
  const { t } = useLang();
  // The server snapshot claims "installed" so the prerendered HTML carries no
  // warning; the real value arrives on hydration.
  const standalone = useSyncExternalStore(
    subscribeToDisplayMode,
    isStandalone,
    () => true,
  );

  if (standalone) return null;

  return (
    <div className="mb-4 border-2 border-foreground bg-warning p-3">
      <p
        className="mb-0.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-foreground"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        <TriangleAlert className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
        {t.register.deviceWarningTitle}
      </p>
      <p
        className="text-sm leading-snug text-foreground"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {t.register.deviceWarning}
      </p>
    </div>
  );
}

const FK_VIOLATION = "23503";

type RegisterResult = { error?: string; group?: string };

type WriteOutcome =
  | { kind: "ok" }
  | { kind: "dead-user" }
  | { kind: "profile-failed" }
  | { kind: "rpc-failed" }
  | { kind: "rejected"; result: RegisterResult };

async function writeRegistration(
  userId: string,
  needsProfile: boolean,
  activityId: string,
  profileData: Profile,
): Promise<WriteOutcome> {
  const supabase = getSupabase();

  if (needsProfile) {
    const { error } = await supabase
      .from("profiles")
      .insert({ id: userId, ...profileData });
    if (error) {
      return { kind: error.code === FK_VIOLATION ? "dead-user" : "profile-failed" };
    }
  }

  const { data: result, error } = await supabase.rpc("register_for_activity", {
    p_activity_id: activityId,
  });

  // register_for_activity() only traps unique_violation, so a missing profile
  // row surfaces here as the raw SQLSTATE rather than a handled result.error.
  if (error) {
    return { kind: error.code === FK_VIOLATION ? "dead-user" : "rpc-failed" };
  }

  return result?.error ? { kind: "rejected", result } : { kind: "ok" };
}

export default function ProgramPage() {
  const { t } = useLang();
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Availability>(new Map());
  const [modal, setModal] = useState<Modal | null>(null);
  const [nameForm, setNameForm] = useState({ first_name: "", last_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = getSupabase();

      // Before the session check: capacity is readable by `anon` too, and the
      // numbers have to be on screen before the tap that creates a session.
      const { data: acts } = await supabase
        .from("activities")
        .select("id, capacity, registrations_count");
      setAvailability(
        new Map(
          (acts ?? []).map((a: ActivityRow) => [
            a.id,
            { capacity: a.capacity, count: a.registrations_count },
          ]),
        ),
      );

      const { session } = await getLiveSession();
      if (!session) return; // no session yet — wait until register tap
      setUser(session.user);

      const [{ data: prof }, { data: regs }] = await Promise.all([
        supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .maybeSingle(),
        supabase
          .from("activity_registrations")
          .select("activity_id")
          .eq("user_id", session.user.id),
      ]);

      setProfile(prof ?? null);
      setRegisteredIds(
        new Set(
          (regs ?? []).map((r: { activity_id: string }) => r.activity_id),
        ),
      );
    }
    init();
  }, []);

  // Deliberately synchronous. Signing in here meant the sheet only appeared
  // after a network round trip, with nothing on screen to say why — and if the
  // sign-in failed we set an error that renders *inside* the modal we never
  // opened, so the button silently did nothing. The session is only needed to
  // write, so it is established in submitRegistration instead, behind the
  // spinner the user gets by pressing the button.
  function handleRegisterTap(activityId: string, activityName: string) {
    setError(null);
    setModal({
      type: profile ? "confirm" : "name-form",
      activityId,
      activityName,
    });
  }

  async function submitRegistration(activityId: string, profileData: Profile) {
    setSubmitting(true);
    setError(null);

    let currentUser = user;
    if (!currentUser) {
      try {
        const supabase = await ensureAnonymousSession();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setError(t.register.errors.session);
          setSubmitting(false);
          return;
        }
        setUser(session.user);
        currentUser = session.user;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(`${t.register.errors.unexpected}: ${msg}`);
        setSubmitting(false);
        return;
      }
    }

    let outcome = await writeRegistration(currentUser.id, !profile, activityId, profileData);

    // Both writes hang off the profiles → auth.users FK, so a violation means
    // this session's user no longer exists: the account was wiped, or the tab
    // sat open across a wipe. Sign in again and redo the pair — a fresh
    // anonymous account has no profile row, so that one goes in too.
    if (outcome.kind === "dead-user") {
      const fresh = await reauthenticateAnonymously().catch(() => null);
      if (!fresh) {
        setError(t.register.errors.session);
        setSubmitting(false);
        return;
      }
      setUser(fresh);
      setProfile(null);
      setRegisteredIds(new Set());
      outcome = await writeRegistration(fresh.id, true, activityId, profileData);
    }

    if (outcome.kind === "profile-failed" || outcome.kind === "dead-user") {
      setError(t.register.errors.profile);
      setSubmitting(false);
      return;
    }

    // Past the profile stage the row exists whatever the registration did, so
    // remember it — otherwise a second tap after a rejected registration would
    // show the name form again and re-insert.
    setProfile(profileData);

    const result = outcome.kind === "rejected" ? outcome.result : null;

    if (outcome.kind === "rpc-failed") {
      setError(t.register.errors.failed);
      setSubmitting(false);
      return;
    }

    if (result?.error === "full") {
      setError(t.register.errors.full);
      setSubmitting(false);
      return;
    }

    if (result?.error === "already_registered") {
      setError(t.register.errors.alreadyRegistered);
      setSubmitting(false);
      return;
    }

    if (result?.error === "group_taken") {
      const groups = t.register.groups;
      const group =
        result.group === "wave" || result.group === "skatepark"
          ? groups[result.group as "wave" | "skatepark"]
          : groups.fallback;
      setError(t.register.errors.groupTaken.replace("{group}", group));
      setSubmitting(false);
      return;
    }

    if (result?.error) {
      setError(t.register.errors.failed);
      setSubmitting(false);
      return;
    }

    setRegisteredIds((prev) => new Set([...prev, activityId]));
    setAvailability((prev) => {
      const seat = prev.get(activityId);
      if (!seat) return prev;
      const next = new Map(prev);
      next.set(activityId, { ...seat, count: seat.count + 1 });
      return next;
    });
    setModal(null);
    setSubmitting(false);
  }

  return (
    <>
      <div className="mx-auto max-w-md px-4 pt-4">
        {/* Brand band */}
        <div className="mb-6 text-center">
          <h1
            className="mb-3 text-4xl leading-tight"
            style={{
              fontFamily: "var(--font-geoparody)",
              color: "#452113",
              WebkitTextStroke: "1px var(--orange)",
              textWrap: "balance",
            }}
          >
            Meet your people
          </h1>
          <div className="flex items-center justify-center gap-2">
            <a
              href={LEVEL_TREVEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Image
                src="/dino_black.svg"
                alt="Level Trevel"
                width={32}
                height={19}
              />
            </a>
            <span className="select-none text-sm text-foreground/80">×</span>
            <a
              href={KAMPOSLOVENSKU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Image
                src="/kamposlovensku.png"
                alt="KamPoSlovensku"
                width={44}
                height={45}
              />
            </a>
          </div>
        </div>

        <div className="mb-3">
          <DayTabs activeDay={activeDay} onChange={setActiveDay} />
        </div>

        <div className="divide-y-2 divide-foreground/20">
          {getProgramEntriesByDay(activeDay).map((entry) =>
            entry.kind === "group" ? (
              <LessonGroupCard
                key={entry.key}
                entry={entry}
                registeredIds={registeredIds}
                availability={availability}
                onRegister={handleRegisterTap}
              />
            ) : (
              <ProgramCard
                key={entry.key}
                p={entry.item}
                registered={
                  !!entry.item.activityId &&
                  registeredIds.has(entry.item.activityId)
                }
                availability={availability}
                onRegister={handleRegisterTap}
              />
            ),
          )}
        </div>
      </div>

      {/* Modal. z-[60], not z-50: BottomNav is also z-50 and renders after
          <main>, so an equal z-index let it paint over the sheet and swallow
          taps on the bottom of the register button. */}
      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          onClick={() => setModal(null)}
        >
          <div
            className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto border-2 border-foreground bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === "confirm" && profile ? (
              <>
                <p
                  className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground/85"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.heading}
                </p>
                <h3
                  className="mb-1 text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-alfa)" }}
                >
                  {modal.activityName}
                </h3>
                <p
                  className="mb-4 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {profile.first_name} {profile.last_name}
                </p>
                {error && (
                  <p
                    className="mb-3 text-sm font-bold text-red-500"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    {error}
                  </p>
                )}
                <DeviceWarning />
                <button
                  disabled={submitting}
                  onClick={() => submitRegistration(modal.activityId, profile)}
                  className="w-full border-2 border-foreground bg-foreground py-2.5 text-sm font-bold text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {submitting ? t.register.submitting : t.register.confirm}
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="mt-2 w-full py-2 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.cancel}
                </button>
              </>
            ) : (
              <>
                <p
                  className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground/85"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.headingFor} {modal.activityName}
                </p>
                <h3
                  className="mb-1 text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-alfa)" }}
                >
                  {t.register.whoAreYou}
                </h3>
                <p
                  className="mb-4 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.nameNote}
                </p>
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={nameForm.first_name}
                    onChange={(e) =>
                      setNameForm((f) => ({ ...f, first_name: e.target.value }))
                    }
                    placeholder={t.register.firstName}
                    className="w-full border-2 border-foreground bg-transparent px-3 py-2 text-foreground outline-none focus:bg-background"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  />
                  <input
                    type="text"
                    value={nameForm.last_name}
                    onChange={(e) =>
                      setNameForm((f) => ({ ...f, last_name: e.target.value }))
                    }
                    placeholder={t.register.lastName}
                    className="w-full border-2 border-foreground bg-transparent px-3 py-2 text-foreground outline-none focus:bg-background"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  />
                </div>
                {error && (
                  <p
                    className="mb-2 text-sm text-red-500"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  >
                    {error}
                  </p>
                )}
                <DeviceWarning />
                <button
                  disabled={
                    !nameForm.first_name.trim() ||
                    !nameForm.last_name.trim() ||
                    submitting
                  }
                  onClick={() => submitRegistration(modal.activityId, nameForm)}
                  className="w-full border-2 border-foreground bg-foreground py-2.5 text-sm font-bold text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {submitting ? t.register.submitting : t.register.cta}
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="mt-2 w-full py-2 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.register.cancel}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
