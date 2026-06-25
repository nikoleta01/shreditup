"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getProgramByDay, type ProgramItem } from "@/lib/data";
import { useLang } from "@/components/language-provider";
import { DayTabs } from "@/components/day-tabs";
import { WaveChip } from "@/components/wave-chip";
import { ensureAnonymousSession, getSupabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Profile = { first_name: string; last_name: string };

type Modal =
  | { type: "confirm"; activityId: string; activityName: string }
  | { type: "name-form"; activityId: string; activityName: string };

function ProgramCard({
  p,
  registered,
  onRegister,
}: {
  p: ProgramItem;
  registered: boolean;
  onRegister: (activityId: string, activityName: string) => void;
}) {
  return (
    <div className="flex gap-4 py-4">
      <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
        <span
          className="text-sm font-bold tabular-nums text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {p.startTime}
        </span>
        <span
          className="text-xs tabular-nums text-foreground/85"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {p.endTime}
        </span>
      </div>
      <div className="flex-1 space-y-1 pb-1">
        <div>
          <WaveChip className="text-base">{p.title}</WaveChip>
        </div>
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-wide text-foreground/80"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            {p.genre}
          </span>
        </div>
        {p.description && (
          <p className="text-sm text-foreground/85">{p.description}</p>
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
              <button
                onClick={() => onRegister(p.activityId!, p.title)}
                className="border-2 border-foreground bg-foreground px-3 py-1 text-xs font-bold text-background transition-colors hover:bg-transparent hover:text-foreground"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                Zaregistrovať sa
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProgramPage() {
  const { t } = useLang();
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<Modal | null>(null);
  const [nameForm, setNameForm] = useState({ first_name: "", last_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = getSupabase();
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

    if (result?.error) {
      setError("Registrácia zlyhala. Skús znova.");
      setSubmitting(false);
      return;
    }

    setRegisteredIds((prev) => new Set([...prev, activityId]));
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
            <span
              className="text-sm font-bold text-foreground/85"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              kamposlovensku
            </span>
          </div>
        </div>

        <div className="mb-3">
          <DayTabs activeDay={activeDay} onChange={setActiveDay} />
        </div>

        <p
          className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground/80"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.days[activeDay].label}
        </p>

        <div className="divide-y-2 divide-foreground/20">
          {getProgramByDay(activeDay).map((p) => (
            <ProgramCard
              key={p.id}
              p={p}
              registered={!!p.activityId && registeredIds.has(p.activityId)}
              onRegister={handleRegisterTap}
            />
          ))}
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
