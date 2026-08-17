"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
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
import { ensureAnonymousSession, getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

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
const GROUP_LABEL: Record<string, string> = {
  wave: "lekciu na vlne",
  skatepark: "lekciu v skateparku",
};

function TimeColumn({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  return (
    <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
      <span
        className="text-sm font-bold tabular-nums text-black"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
        }}
      >
        {startTime}
      </span>
      <span
        className="text-xs tabular-nums text-black"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          textShadow: "0 1px 3px rgba(255, 255, 255, 0.8)",
        }}
      >
        {endTime}
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
            className="text-base font-bold leading-tight text-foreground"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            <ProgramTitle p={p} />
          </h3>
          {(p.location || (!p.activityId && p.category === "workshop")) && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {p.location && (
                <WaveChip
                  className="text-xs"
                  tone={toneForLocation(p.location)}
                >
                  {t.locations[p.location]}
                </WaveChip>
              )}
              {!p.activityId && p.category === "workshop" && (
                <span
                  className="text-xs font-bold text-foreground/60"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {t.noRegistration}
                </span>
              )}
            </div>
          )}
        </div>
        {p.description && (
          <p className="text-sm text-foreground/85">{tr(p.description)}</p>
        )}
        {p.activityId && (
          <div className="pt-1">
            {registered ? (
              <span
                className="text-xs font-bold text-foreground/85"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                Prihlásený/á ✓
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={isFull}
                  onClick={() => onRegister(p.activityId!, title)}
                  className="border-2 border-foreground bg-foreground px-3 py-1 text-xs font-bold text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-foreground disabled:hover:text-background"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Zaregistrovať sa
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
  const booked = slots.find(
    (s) => s.activityId && registeredIds.has(s.activityId),
  );

  return (
    <div className="flex gap-4 py-4">
      <TimeColumn startTime={startTime} endTime={endTime} />
      <div className="flex-1 space-y-1 pb-1">
        <h3
          className="text-base font-bold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {tr(group.title)}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <WaveChip className="text-xs" tone={toneForLocation(group.location)}>
            {t.locations[group.location]}
          </WaveChip>
        </div>
        <p className="text-sm text-foreground/85">{tr(group.description)}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {slots.map((slot) => {
            if (!slot.activityId) return null;
            const isBooked = booked?.id === slot.id;
            const seat = availability.get(slot.activityId);
            const left = seat ? Math.max(seat.capacity - seat.count, 0) : null;
            const isFull = left === 0 && !isBooked;
            // Already holding a slot in this group blocks the siblings — the
            // DB rejects a second one, so don't offer the tap.
            const blocked = (!!booked && !isBooked) || isFull;
            return (
              <button
                key={slot.id}
                disabled={blocked}
                aria-pressed={isBooked}
                onClick={() => onRegister(slot.activityId!, tr(slot.title))}
                className={`flex flex-col items-center border-2 border-foreground px-2.5 py-1 transition-colors ${
                  isBooked
                    ? "bg-foreground text-background"
                    : blocked
                      ? "cursor-not-allowed text-foreground/40 opacity-50"
                      : "text-foreground hover:bg-foreground hover:text-background"
                }`}
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                <span className="text-xs font-bold tabular-nums">
                  {slot.startTime}–{slot.endTime}
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

        {booked && (
          <p
            className="pt-1 text-xs font-bold text-foreground/85"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            Prihlásený/á · {booked.startTime}–{booked.endTime}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProgramPage() {
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

      const {
        data: { session },
      } = await supabase.auth.getSession();
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

  async function handleRegisterTap(activityId: string, activityName: string) {
    let currentUser = user;
    if (!currentUser) {
      try {
        const supabase = await ensureAnonymousSession();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("[register] session:", session);
        if (!session?.user) {
          setError("Relácia sa nepodarila. Skús znova.");
          return;
        }
        setUser(session.user);
        currentUser = session.user;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[register] session error:", e);
        setError(`Chyba: ${msg}`);
        return;
      }
    }
    if (profile) {
      setModal({ type: "confirm", activityId, activityName });
    } else {
      setModal({ type: "name-form", activityId, activityName });
    }
  }

  async function submitRegistration(activityId: string, profileData: Profile) {
    setSubmitting(true);
    setError(null);
    const supabase = getSupabase();

    if (!profile) {
      const { error: pe } = await supabase
        .from("profiles")
        .insert({ id: user!.id, ...profileData });
      if (pe) {
        setError("Niečo sa pokazilo. Skús znova.");
        setSubmitting(false);
        return;
      }
      setProfile(profileData);
    }

    const { data: result, error: rpcError } = await supabase.rpc(
      "register_for_activity",
      { p_activity_id: activityId },
    );

    if (rpcError) {
      setError("Registrácia zlyhala. Skús znova.");
      setSubmitting(false);
      return;
    }

    if (result?.error === "full") {
      setError(
        "Tento workshop je už plný. Ak sa niekto odhlási, budeme ťa informovať.",
      );
      setSubmitting(false);
      return;
    }

    if (result?.error === "already_registered") {
      setError("Na túto aktivitu si už zaregistrovaný/á.");
      setSubmitting(false);
      return;
    }

    if (result?.error === "group_taken") {
      setError(
        `Už si prihlásený/á na ${GROUP_LABEL[result.group] ?? "takúto lekciu"}. Aby sa dostalo na čo najviac ľudí, môžeš mať iba jednu — najprv sa odhlás v Aktivitách.`,
      );
      setSubmitting(false);
      return;
    }

    if (result?.error) {
      setError("Registrácia zlyhala. Skús znova.");
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
            className="mb-3 text-4xl leading-tight text-foreground"
            style={{ fontFamily: "var(--font-alfa)", textWrap: "balance" }}
          >
            Meet your people
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/dino_black.svg"
              alt="Level Trevel"
              width={32}
              height={19}
              aria-hidden
            />
            <span className="select-none text-sm text-foreground/80">×</span>
            <Image
              src="/kamposlovensku.png"
              alt="KamPoSlovensku"
              width={44}
              height={45}
            />
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

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-md border-2 border-foreground bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === "confirm" && profile ? (
              <>
                <p
                  className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground/85"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Registrácia
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
                <button
                  disabled={submitting}
                  onClick={() => submitRegistration(modal.activityId, profile)}
                  className="w-full border-2 border-foreground bg-foreground py-2.5 text-sm font-bold text-background transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  {submitting ? "Registrujem..." : "Potvrdiť"}
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="mt-2 w-full py-2 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Zrušiť
                </button>
              </>
            ) : (
              <>
                <p
                  className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground/85"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Registrácia na {modal.activityName}
                </p>
                <h3
                  className="mb-1 text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-alfa)" }}
                >
                  Kto si?
                </h3>
                <p
                  className="mb-4 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Tvoje meno bude použité pri registrácii na workshopy a lekcie.
                </p>
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={nameForm.first_name}
                    onChange={(e) =>
                      setNameForm((f) => ({ ...f, first_name: e.target.value }))
                    }
                    placeholder="Meno"
                    className="w-full border-2 border-foreground bg-transparent px-3 py-2 text-foreground outline-none focus:bg-background"
                    style={{ fontFamily: "var(--font-barlow-condensed)" }}
                  />
                  <input
                    type="text"
                    value={nameForm.last_name}
                    onChange={(e) =>
                      setNameForm((f) => ({ ...f, last_name: e.target.value }))
                    }
                    placeholder="Priezvisko"
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
                  {submitting ? "Registrujem..." : "Zaregistrovať sa"}
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="mt-2 w-full py-2 text-sm text-foreground/80"
                  style={{ fontFamily: "var(--font-barlow-condensed)" }}
                >
                  Zrušiť
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
