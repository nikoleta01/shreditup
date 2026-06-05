"use client";

import { FESTIVAL_NAME } from "@/lib/data";
import { NotificationButton } from "@/components/notification-button";
import { useLang } from "@/components/language-provider";
import { ChainBorder } from "@/components/chain-border";

export function Header() {
  const { lang, t, setLang } = useLang();

  return (
    <header className="sticky top-0 z-40">
      <div className="flex flex-col bg-card px-4 pt-2 pb-1.5">
        {/* Top row: festival name | controls */}
        <div className="flex items-center justify-between">
          <span
            className="text-xl leading-none text-card-foreground"
            style={{ fontFamily: "var(--font-alfa)" }}
          >
            {FESTIVAL_NAME}
          </span>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="text-xs font-semibold text-card-foreground/50"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {t.festivalDates}
            </span>
            <button
              onClick={() => setLang(lang === "sk" ? "en" : "sk")}
              className="rounded border-2 border-card-foreground/40 px-1.5 py-0.5 text-xs font-bold text-card-foreground transition-colors hover:border-card-foreground hover:bg-card-foreground hover:text-card"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
              aria-label="Switch language"
            >
              {lang === "sk" ? "EN" : "SK"}
            </button>
            <NotificationButton />
          </div>
        </div>
      </div>

      {/* Wave border: card (blue) → background (orange) */}
      <ChainBorder />
    </header>
  );
}
