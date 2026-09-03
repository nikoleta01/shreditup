"use client";

import { useEffect, useState } from "react";
import { getLiveSession, getSupabase } from "@/lib/supabase";
import { useLang } from "@/components/language-provider";
import { getRegisterableActivity, type ProgramItem } from "@/lib/data";

type Profile = {
  first_name: string;
  last_name: string;
};

export default function RegistrationPage() {
  const { t, tr } = useLang();
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unregistering, setUnregistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { supabase, session } = await getLiveSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);

      const [{ data: prof }, { data: regs }] = await Promise.all([
        supabase.from("profiles").select("first_name, last_name").eq("id", session.user.id).maybeSingle(),
        supabase.from("activity_registrations").select("activity_id").eq("user_id", session.user.id),
      ]);

      setProfile(prof ?? null);
      setRegisteredIds(new Set((regs ?? []).map((r: { activity_id: string }) => r.activity_id)));
      setLoading(false);
    }
    load();
  }, []);

  async function handleUnregister(activityId: string) {
    if (!userId) return;
    setUnregistering(activityId);
    setError(null);
    const supabase = getSupabase();
    const { error: err } = await supabase
      .from("activity_registrations")
      .delete()
      .eq("user_id", userId)
      .eq("activity_id", activityId);

    if (err) {
      setError(t.myActivitiesPage.unregisterFailed);
    } else {
      setRegisteredIds((prev) => {
        const next = new Set(prev);
        next.delete(activityId);
        return next;
      });
    }
    setUnregistering(null);
  }

  const dayLabel = (day: number) =>
    day === 1 ? t.days[1].label : day === 2 ? t.days[2].label : t.days[3].label;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-sm text-foreground/50" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {t.loading}
        </span>
      </div>
    );
  }

  // Registrations only store the activity id; every display field (title, day,
  // time, description) is resolved from lib/data.ts — the single source of truth.
  const myActivities = [...registeredIds]
    .map((id) => ({ id, item: getRegisterableActivity(id) }))
    .filter((x): x is { id: string; item: ProgramItem } => !!x.item)
    .sort((a, b) => a.item.day - b.item.day || a.item.startTime.localeCompare(b.item.startTime));

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <h1
        className="mb-1 text-center text-4xl leading-tight text-foreground"
        style={{ fontFamily: "var(--font-geoparody)" }}
      >
        {t.myActivitiesPage.title}
      </h1>
      <p
        className="mb-6 text-center text-sm text-foreground/60"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {profile
          ? `${profile.first_name} ${profile.last_name}`
          : t.myActivitiesPage.subtitle}
      </p>

      {error && (
        <p className="mb-4 text-sm font-bold text-red-500" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {error}
        </p>
      )}

      {myActivities.length === 0 ? (
        <div className="border-2 border-foreground/20 p-6 text-center">
          <p className="text-sm text-foreground/50" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
            {t.myActivitiesPage.empty}
          </p>
          <p className="mt-1 text-xs text-foreground/30" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
            {t.myActivitiesPage.emptyHint}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myActivities.map(({ id, item }) => (
            <div key={id} className="border-2 border-foreground bg-card p-4">
              <h3
                className="mb-2 text-xl leading-tight text-foreground"
                style={{ fontFamily: "var(--font-geoparody)" }}
              >
                {tr(item.title)}
              </h3>
              <div
                className="mb-4 flex gap-3 text-xs text-foreground/60"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                <span>{dayLabel(item.day)}</span>
                <span>{item.startTime}</span>
                {item.location && (
                  <span className="text-foreground">{t.locations[item.location]}</span>
                )}
              </div>
              <button
                disabled={unregistering === id}
                onClick={() => handleUnregister(id)}
                className="border-2 border-foreground px-4 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                {unregistering === id
                  ? t.myActivitiesPage.unregistering
                  : t.myActivitiesPage.unregister}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
