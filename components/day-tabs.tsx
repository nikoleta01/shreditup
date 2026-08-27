"use client";

import { useLang } from "@/components/language-provider";

interface DayTabsProps {
  activeDay: 1 | 2 | 3;
  onChange: (day: 1 | 2 | 3) => void;
}

export function DayTabs({ activeDay, onChange }: DayTabsProps) {
  const { t } = useLang();

  return (
    // Full-bleed to the screen edge on mobile (cancels the parent's px-4);
    // sits inside the content column from `sm` up.
    <div className="-mx-4 sm:mx-0">
      <div className="grid grid-cols-2 rounded-t-sm border-2 border-foreground bg-card">
        {([1, 2] as const).map((day) => (
          <button
            key={day}
            onClick={() => onChange(day)}
            className="relative py-1.5 text-xs transition-all"
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              color: "var(--card-foreground)",
              ...(activeDay === day ? { zIndex: 1 } : {}),
            }}
          >
            {activeDay === day && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-t-xs"
                style={{
                  backgroundColor: "var(--orange)",
                  zIndex: -1,
                }}
              />
            )}
            <span
              className="relative text-white"
              style={{
                fontWeight: activeDay === day ? "700" : "500",
                color: activeDay === day ? "white" : "black",
              }}
            >
              {t.days[day].short}
            </span>
          </button>
        ))}
      </div>

      {/* Poster stripe band — frames the picker like the poster's bottom edge */}
      <div className="stripe-divider border-foreground" aria-hidden />
    </div>
  );
}
