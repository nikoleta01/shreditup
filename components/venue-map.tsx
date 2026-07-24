"use client";

import { useState } from "react";
import { useLang } from "@/components/language-provider";
import { MAP_POIS, POI_TYPE_BY_ID, type PoiTypeId } from "@/lib/map-pois";

const BASE_IMAGE = "/map.jpeg";

const PARKING_SHORT: Partial<Record<PoiTypeId, string>> = {
  parkingP2: "P2",
  parkingLong: "P",
};

export default function VenueMap() {
  const { lang } = useLang();
  const [selected, setSelected] = useState<PoiTypeId | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-barlow-condensed)" }}>
      <div
        className="relative w-full select-none border-2 border-foreground"
        onClick={() => setSelected(null)}
      >
        <img
          src={BASE_IMAGE}
          alt="Mapa areálu festivalu"
          className="block w-full"
          draggable={false}
        />

        {MAP_POIS.map((p, i) => {
          const t = POI_TYPE_BY_ID[p.type];
          if (!t) return null;
          const short = PARKING_SHORT[p.type];
          const isSel = selected === p.type;
          return (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(isSel ? null : p.type);
              }}
              className="absolute flex items-center justify-center rounded-full border-2 border-white text-center leading-none shadow-md transition-transform"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: 26 * (t.scale ?? 1),
                height: 26 * (t.scale ?? 1),
                background: t.color,
                transform: `translate(-50%, -50%) scale(${isSel ? 1.25 : 1})`,
                zIndex: isSel ? 30 : 10,
                fontSize: (short ? 11 : 14) * (t.scale ?? 1),
                fontWeight: 700,
                color: "white",
              }}
              aria-label={lang === "en" ? t.en : t.sk}
            >
              {short ?? t.emoji}

              {isSel && (
                <span
                  className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[11px] font-bold text-background shadow"
                  style={{ zIndex: 40 }}
                >
                  {lang === "en" ? t.en : t.sk}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 pb-4">
        {[...new Set(MAP_POIS.map((p) => p.type))].map((type) => {
          const t = POI_TYPE_BY_ID[type];
          if (!t) return null;
          const short = PARKING_SHORT[type];
          const isSel = selected === type;
          return (
            <li key={type}>
              <button
                onClick={() => setSelected(isSel ? null : type)}
                className="flex w-full items-center gap-2 text-left"
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white text-center text-[11px] leading-none"
                  style={{ background: t.color, color: "white", fontWeight: 700 }}
                >
                  {short ?? t.emoji}
                </span>
                <span
                  className="truncate text-sm"
                  style={{
                    color: isSel ? "var(--foreground)" : "color-mix(in srgb, var(--foreground) 70%, transparent)",
                    fontWeight: isSel ? 700 : 500,
                  }}
                >
                  {lang === "en" ? t.en : t.sk}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
