"use client";

import { useState } from "react";
import { getTimetableItemsByDay, type ProgramItem } from "@/lib/data";
import { useLang } from "@/components/language-provider";
import { DayTabs } from "@/components/day-tabs";
import { CHIP_TONE, toneForLocation } from "@/lib/location-chip";

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

function endMinutes(p: ProgramItem) {
  const s = timeToMinutes(p.startTime);
  let e = timeToMinutes(p.endTime);
  if (e < s) e += 24 * 60; // event runs past midnight
  return e;
}

// A performance with its horizontal placement resolved. Overlapping events get
// their own side-by-side lane. The old layout insets each overlap level from
// the left and stacked them — but the left edge is exactly where the title
// sits, so on a 320px screen the block underneath was cut down to "Open M" /
// "Hlavný s". Lanes cost width but never cover another block's text.
type LaidOut = ProgramItem & { left: number; width: number };

function layoutDay(items: ProgramItem[]): LaidOut[] {
  const evs = items
    .map((p) => ({ p, s: timeToMinutes(p.startTime), e: endMinutes(p) }))
    // Earlier events first; ties broken so the longer event takes the left lane.
    .sort((a, b) => a.s - b.s || b.e - a.e);

  const out: LaidOut[] = [];
  let cluster: { p: ProgramItem; s: number; e: number; level: number }[] = [];
  let clusterEnd = -Infinity;

  // Lane count is per *cluster* of transitively-overlapping events, not per
  // day: three-deep Saturday mornings must not shrink the lone evening block
  // to a third of the width.
  function flush() {
    if (!cluster.length) return;
    const lanes = Math.max(...cluster.map((c) => c.level)) + 1;
    for (const c of cluster) {
      out.push({ ...c.p, left: c.level / lanes, width: 1 / lanes });
    }
    cluster = [];
  }

  for (const ev of evs) {
    if (ev.s >= clusterEnd) flush();
    // Greedy interval-graph colouring: lowest lane not held by an overlapping
    // event already in this cluster.
    const taken = new Set(
      cluster.filter((o) => o.s < ev.e && ev.s < o.e).map((o) => o.level),
    );
    let level = 0;
    while (taken.has(level)) level++;
    cluster.push({ ...ev, level });
    clusterEnd = Math.max(clusterEnd, ev.e);
  }
  flush();

  return out;
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

  // Vertical space goes to the title first. The block is already colour-coded
  // by location, so the subtitle repeats what the colour says — it only earns
  // its line once a full hour block (56px) leaves room for both. Below 40px
  // (a 30-min lesson) there is one line, and it belongs to the title.
  const titleLines = height >= 40 ? 2 : 1;
  const showSubtitle = height >= 56;

  // Colour the block by its location, matching the location chips exactly.
  const colors = CHIP_TONE[toneForLocation(p.location)];

  return (
    <div
      className="absolute overflow-hidden rounded-sm border-2 border-foreground px-2 py-1"
      style={{
        top,
        height,
        left: `calc(${p.left * 100}% + 2px)`,
        width: `calc(${p.width * 100}% - 4px)`,
        backgroundColor: colors.backgroundColor,
        color: colors.color,
      }}
    >
      <p
        className="text-xs font-bold leading-tight"
        style={{
          fontFamily: "var(--font-barlow-condensed)",
          // Wrap rather than truncate: in a four-lane cluster at 320px a lane
          // is ~80px, and "Jóga s Jankou" clipped to "Jóga s" names nothing.
          // Breaking inside words is worse than clipping ("Surfska te…"), so
          // long words are left to overflow into the hidden area instead.
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: titleLines,
          overflow: "hidden",
        }}
      >
        {tr(p.title)}
      </p>
      {showSubtitle && (
        <p
          className="truncate text-[10px] opacity-75"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {subtitle}
        </p>
      )}
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
  const laid = layoutDay(getTimetableItemsByDay(day));
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
              fontSize: 12,
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
