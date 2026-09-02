"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAP_POIS,
  POI_TYPES,
  POI_TYPE_BY_ID,
  type MapPoi,
  type PoiTypeId,
} from "@/lib/map-pois";

const BASE_IMAGE = "/map.jpeg";

export default function VenueMapEditor() {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<PoiTypeId>(POI_TYPES[0].id);
  const [pins, setPins] = useState<MapPoi[]>(MAP_POIS);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // A drag ends in a click on the wrapper, which would drop an unwanted pin.
  const draggedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only URL read after mount, avoids hydration mismatch
    setActive(new URLSearchParams(window.location.search).has("place"));
  }, []);

  if (!active) return null;

  function pointAt(e: { clientX: number; clientY: number }) {
    const el = wrapRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +(((e.clientX - r.left) / r.width) * 100).toFixed(2),
      y: +(((e.clientY - r.top) / r.height) * 100).toFixed(2),
    };
  }

  function place(e: React.MouseEvent<HTMLDivElement>) {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    const pt = pointAt(e);
    if (!pt) return;
    setPins((p) => [...p, { type: selected, ...pt }]);
  }

  // Matches the MAP_POIS literal in lib/map-pois.ts so it pastes straight in.
  const snippet = pins
    .map((p) => `  { type: "${p.type}", x: ${p.x}, y: ${p.y} },`)
    .join("\n");

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background p-3"
      style={{ fontFamily: "var(--font-barlow-condensed)" }}
    >
      <div className="mx-auto max-w-md">
        <p className="mb-2 text-sm font-bold text-foreground">
          Placement mode — drag a pin to move it, tap the map to drop the selected one
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
            if (!t) return null;
            return (
              <span
                key={i}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDragIndex(i);
                }}
                onPointerMove={(e) => {
                  if (dragIndex !== i) return;
                  const pt = pointAt(e);
                  if (!pt) return;
                  draggedRef.current = true;
                  setPins((prev) => prev.map((q, j) => (j === i ? { ...q, ...pt } : q)));
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  setDragIndex(null);
                }}
                onClick={(e) => e.stopPropagation()}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white text-center text-sm leading-none shadow"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  background: t.color,
                  width: 24,
                  height: 24,
                  lineHeight: "20px",
                  touchAction: "none",
                  zIndex: dragIndex === i ? 20 : 10,
                  outline: dragIndex === i ? "2px solid var(--foreground)" : undefined,
                }}
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
            onClick={() => setPins(MAP_POIS)}
            className="rounded border border-foreground px-3 py-1.5 text-sm"
          >
            Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(snippet);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded bg-foreground px-3 py-1.5 text-sm text-background"
          >
            {copied ? "Copied" : "Copy MAP_POIS"}
          </button>
        </div>

        <ol className="mt-3 space-y-1 text-xs text-foreground/70">
          {pins.map((p, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span>
                {POI_TYPE_BY_ID[p.type]?.emoji} {POI_TYPE_BY_ID[p.type]?.sk} — {p.x}%, {p.y}%
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
          value={snippet}
          className="mt-3 h-40 w-full rounded border border-foreground/30 bg-transparent p-2 font-mono text-xs text-foreground"
        />
      </div>
    </div>
  );
}
