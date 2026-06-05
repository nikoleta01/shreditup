"use client";

import { useState } from "react";
import Image from "next/image";
import { getPerformancesByDay, type Performance } from "@/lib/data";
import { useLang } from "@/components/language-provider";
import { DayTabs } from "@/components/day-tabs";

function PerformanceCard({ p }: { p: Performance }) {
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
          className="text-xs tabular-nums text-foreground/50"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {p.endTime}
        </span>
      </div>
      <div className="flex-1 space-y-1 pb-1">
        <p
          className="text-base font-bold leading-tight text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {p.artist}
        </p>
        <span
          className="inline-block rounded-sm border-2 border-foreground bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {p.genre}
        </span>
        {p.description && (
          <p className="text-sm text-foreground/70">{p.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ProgramPage() {
  const { t } = useLang();
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
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
            width={48}
            height={28}
            aria-hidden
          />
          <span className="text-sm text-foreground/40 select-none">×</span>
          <span
            className="text-sm font-bold text-foreground/70"
            style={{ fontFamily: "var(--font-barlow-condensed)" }}
          >
            kamposlovensku
          </span>
        </div>
      </div>

      <div className="mb-3">
        <DayTabs activeDay={activeDay} onChange={setActiveDay} />
      </div>

      {/* Day label */}
      <p
        className="mb-3 text-sm font-semibold uppercase tracking-widest text-foreground/60"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {t.days[activeDay].label}
      </p>

      {/* Performance list */}
      <div className="divide-y-2 divide-foreground/20">
        {getPerformancesByDay(activeDay).map((p) => (
          <PerformanceCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
