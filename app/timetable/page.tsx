"use client";

import { useState } from "react";
import { getProgramByDay, type Category, type ProgramItem } from "@/lib/data";
import { useLang } from "@/components/language-provider";
import { DayTabs } from "@/components/day-tabs";

const SLOT_HEIGHT = 60;

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// The visible time window is derived per day from its own events: starting one
// hour *before* the earliest event (breathing room at the top) down to the hour
// of the latest end. So Friday opens in the evening, Saturday in the morning.
function dayWindow(items: ProgramItem[]) {
  const startHour =
    Math.floor(Math.min(...items.map((p) => timeToMinutes(p.startTime))) / 60) -
    1;
  const endHour = Math.ceil(Math.max(...items.map(endMinutes)) / 60);
  return { startHour, endHour };
}

// Each event type maps to a token from the poster palette. These three colors
// are designed to coexist, so categories stay distinguishable at a glance.
const CATEGORY_COLOR: Record<Category, string> = {
  music: "var(--secondary)", // pink
  workshop: "var(--card)", // blue
  registration: "var(--primary)", // olive
  info: "var(--muted)",
};

function endMinutes(p: ProgramItem) {
  const s = timeToMinutes(p.startTime);
  let e = timeToMinutes(p.endTime);
  if (e < s) e += 24 * 60; // event runs past midnight
  return e;
}

// A performance with its horizontal placement resolved. Overlapping events
// don't get separate lanes — they stack on top of each other, each one a bit
// narrower and nudged right, so you can see the wider blocks peeking behind.
type LaidOut = ProgramItem & { left: number; width: number; z: number };

const STAGGER = 0.16; // each overlap level insets this fraction from the left
const MAX_LEVELS = 3; // cap so deeply-overlapped events don't shrink to nothing

function layoutDay(items: ProgramItem[]): LaidOut[] {
  const evs = items.map((p) => ({
    p,
    s: timeToMinutes(p.startTime),
    e: endMinutes(p),
  }));
  // Stacking order: earlier events first; ties broken so the longer (container)
  // event sits underneath.
  const order = [...evs].sort((a, b) => a.s - b.s || b.e - a.e);

  // Greedy interval-graph coloring: each event takes the lowest level not used
  // by an already-placed event it overlaps. Two overlapping events therefore
  // always get different levels, so neither can fully hide the other.
  const placed: { s: number; e: number; level: number }[] = [];

  return order.map((ev) => {
    const taken = new Set(
      placed.filter((o) => o.s < ev.e && ev.s < o.e).map((o) => o.level),
    );
    let level = 0;
    while (taken.has(level)) level++;
    placed.push({ s: ev.s, e: ev.e, level });

    const inset = Math.min(level, MAX_LEVELS) * STAGGER;
    return { ...ev.p, left: inset, width: 1 - inset, z: 10 + level };
  });
}

function ProgramBlock({ p, startHour }: { p: LaidOut; startHour: number }) {
  const { t, tr } = useLang();
  const top =
    ((timeToMinutes(p.startTime) - startHour * 60) / 60) * SLOT_HEIGHT;
  const height = Math.max(
    ((endMinutes(p) - timeToMinutes(p.startTime)) / 60) * SLOT_HEIGHT - 4,
    24,
  );

  // Time is already obvious from the block's position on the grid, so prefer
  // showing the location. Fall back to the time for items without one.
  const subtitle = p.location
    ? t.locations[p.location]
    : `${p.startTime}–${p.endTime}`;

  return (
    <div
      className="absolute overflow-hidden rounded-sm border-2 border-foreground px-2 py-1"
      style={{
        top,
        height,
        left: `calc(${p.left * 100}% + 2px)`,
        width: `calc(${p.width * 100}% - 4px)`,
        zIndex: p.z,
        backgroundColor: p.category
          ? CATEGORY_COLOR[p.category]
          : "var(--muted)",
      }}
    >
      <p
        className="truncate text-xs font-bold leading-tight text-foreground"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {tr(p.title)}
      </p>
      <p
        className="truncate text-[10px] text-foreground/60"
        style={{ fontFamily: "var(--font-barlow-condensed)" }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function DayTimetable({
  day,
  stageName,
}: {
  day: 1 | 2 | 3;
  stageName: string;
}) {
  const laid = layoutDay(getProgramByDay(day));
  const { startHour, endHour } = dayWindow(laid);
  const gridHeight = (endHour - startHour) * SLOT_HEIGHT;
  const labels = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => (startHour + i) % 24,
  );

  return (
    <div className="flex overflow-x-auto pb-4 pt-3">
      <div
        className="relative mr-2 w-10 shrink-0"
        style={{ height: gridHeight }}
      >
        {labels.map((h, i) => (
          <div
            key={h}
            className="absolute right-0 -translate-y-2 text-right tabular-nums text-foreground/60"
            style={{
              top: i * SLOT_HEIGHT,
              fontSize: 10,
              fontFamily: "var(--font-barlow-condensed)",
            }}
          >
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* <div
          className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-foreground/70"
          style={{ fontFamily: 'var(--font-barlow-condensed)' }}
        >
          {stageName}
        </div> */}
        <div className="relative" style={{ height: gridHeight }}>
          {labels.map((h, i) => (
            <div
              key={h}
              className="absolute left-0 right-0 border-t border-foreground/20"
              style={{ top: i * SLOT_HEIGHT }}
            />
          ))}
          {laid.map((p) => (
            <ProgramBlock key={p.id} p={p} startHour={startHour} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const { t } = useLang();
  const [activeDay, setActiveDay] = useState<1 | 2 | 3>(1);

  return (
    <div className="px-4 pt-4">
      <div className="mx-auto max-w-lg">
        <div className="mb-4">
          <DayTabs activeDay={activeDay} onChange={setActiveDay} />
        </div>

        <DayTimetable day={activeDay} stageName={t.mainStage} />
      </div>
    </div>
  );
}
