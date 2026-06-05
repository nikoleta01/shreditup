"use client";

import { useLang } from "@/components/language-provider";

interface DayTabsProps {
  activeDay: 1 | 2 | 3;
  onChange: (day: 1 | 2 | 3) => void;
}

export function DayTabs({ activeDay, onChange }: DayTabsProps) {
  const { t } = useLang();

  return (
    <div className="grid grid-cols-3 gap-1 border-2 border-foreground bg-card p-1">
      {([1, 2, 3] as const).map((day) => (
        <button
          key={day}
          onClick={() => onChange(day)}
          className="relative py-1.5 text-xs font-bold transition-all"
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            color: "var(--card-foreground)",
            ...(activeDay === day
              ? { transform: "translate(-1px, -1px)", zIndex: 1 }
              : {}),
          }}
        >
          {activeDay === day && (
            <span
              aria-hidden
              className="absolute inset-x-0"
              style={{
                height: "39px",
                top: "50%",
                transform: "translateY(-34%)",
                backgroundColor: "var(--secondary)",
                zIndex: -1,
              }}
            />
          )}
          <span className="relative">{t.days[day].short}</span>
        </button>
      ))}
    </div>
  );
}
