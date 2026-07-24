"use client";

import { useEffect, useRef, useState } from "react";
import { POI_TYPES, POI_TYPE_BY_ID, type MapPoi, type PoiTypeId } from "@/lib/map-pois";

const BASE_IMAGE = "/map.jpeg";

export default function VenueMapEditor() {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<PoiTypeId>(POI_TYPES[0].id);
  const [pins, setPins] = useState<MapPoi[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL read after mount, avoids hydration mismatch
    setActive(new URLSearchParams(window.location.search).has("place"));
  }, []);

  if (!active) return null;

  function place(e: React.MouseEvent<HTMLDivElement>) {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = +(((e.clientX - r.left) / r.width) * 100).toFixed(2);
    const y = +(((e.clientY - r.top) / r.height) * 100).toFixed(2);
    setPins((p) => [...p, { type: selected, x, y }]);
  }

  const json = JSON.stringify(pins, null, 2);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background p-3"
      style={{ fontFamily: "var(--font-barlow-condensed)" }}
    >
      <div className="mx-auto max-w-md">
        <p className="mb-2 text-sm font-bold text-foreground">
          Placement mode — tap the map to drop the selected pin
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {POI_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className="rounded border px-2 py-1 text-xs"
              style={{
                borderColor: t.color,
                background: selected === t.id ? t.color : "transparent",
                color: selected === t.id ? "white" : "var(--foreground)",
              }}
            >
              {t.emoji} {t.sk}
            </button>
          ))}
        </div>

        <div ref={wrapRef} onClick={place} className="relative w-full cursor-crosshair border-2 border-foreground">
          <img src={BASE_IMAGE} alt="" className="block w-full select-none" draggable={false} />
          {pins.map((p, i) => {
            const t = POI_TYPE_BY_ID[p.type];
            return (
              <span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-center text-sm leading-none shadow"
                style={{ left: `${p.x}%`, top: `${p.y}%`, background: t.color, width: 24, height: 24, lineHeight: "20px" }}
                title={t.sk}
              >
                {t.emoji}
              </span>
            );
          })}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setPins((p) => p.slice(0, -1))}
            className="rounded border border-foreground px-3 py-1.5 text-sm"
          >
            Undo last
          </button>
          <button
            onClick={() => setPins([])}
            className="rounded border border-foreground px-3 py-1.5 text-sm"
          >
            Clear all
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(json)}
            className="rounded bg-foreground px-3 py-1.5 text-sm text-background"
          >
            Copy JSON
          </button>
        </div>

        <ol className="mt-3 space-y-1 text-xs text-foreground/70">
          {pins.map((p, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span>
                {POI_TYPE_BY_ID[p.type].emoji} {POI_TYPE_BY_ID[p.type].sk} — {p.x}%, {p.y}%
              </span>
              <button
                onClick={() => setPins((prev) => prev.filter((_, j) => j !== i))}
                className="text-foreground/40"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>

        <textarea
          readOnly
          value={json}
          className="mt-3 h-40 w-full rounded border border-foreground/30 bg-transparent p-2 font-mono text-xs text-foreground"
        />
      </div>
    </div>
  );
}
