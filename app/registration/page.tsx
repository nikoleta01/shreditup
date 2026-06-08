"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useLang } from "@/components/language-provider";
import { WaveChip } from "@/components/wave-chip";

type Activity = {
  id: string;
  name: string;
  description: string | null;
  day: number;
  start_time: string;
  capacity: number;
};

type Profile = {
  first_name: string;
  last_name: string;
};

export default function RegistrationPage() {
  const { t } = useLang();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unregistering, setUnregistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);

      const [{ data: acts }, { data: prof }, { data: regs }] = await Promise.all([
        supabase.from("activities").select("*").order("day").order("start_time"),
        supabase.from("profiles").select("first_name, last_name").eq("id", session.user.id).maybeSingle(),
        supabase.from("activity_registrations").select("activity_id").eq("user_id", session.user.id),
      ]);

      setActivities(acts ?? []);
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
      setError("Odhlásenie zlyhalo. Skús znova.");
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
          Načítavam...
        </span>
      </div>
    );
  }

  const myActivities = activities.filter((a) => registeredIds.has(a.id));

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <h1
        className="mb-1 text-4xl leading-tight text-foreground"
        style={{ fontFamily: "var(--font-alfa)" }}
      >
        Moje aktivity
      </h1>
      <p
        className="mb-6 text-sm text-foreground/60"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {profile ? `${profile.first_name} ${profile.last_name}` : "Tvoje registrácie na festivale"}
      </p>

      {error && (
        <p className="mb-4 text-sm font-bold text-red-500" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
          {error}
        </p>
      )}

      {myActivities.length === 0 ? (
        <div className="border-2 border-foreground/20 p-6 text-center">
          <p className="text-sm text-foreground/50" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
            Zatiaľ nie si prihlásený/á na žiadnu aktivitu.
          </p>
          <p className="mt-1 text-xs text-foreground/30" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
            Registráciu nájdeš v sekcii Program.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myActivities.map((activity) => (
            <div key={activity.id} className="border-2 border-foreground bg-card p-4">
              <div className="mb-2">
                <WaveChip className="text-sm">{activity.name}</WaveChip>
              </div>
              <div
                className="mb-4 flex gap-3 text-xs text-foreground/60"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                <span>{dayLabel(activity.day)}</span>
                <span>{activity.start_time}</span>
              </div>
              {activity.description && (
                <p className="mb-4 text-sm text-foreground/70" style={{ fontFamily: "var(--font-barlow-condensed)" }}>
                  {activity.description}
                </p>
              )}
              <button
                disabled={unregistering === activity.id}
                onClick={() => handleUnregister(activity.id)}
                className="border-2 border-foreground px-4 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-40"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                {unregistering === activity.id ? "Odhlasujem..." : "Odhlásiť sa"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
