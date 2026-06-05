"use client";

import { FESTIVAL_NAME } from "@/lib/data";
import { NotificationButton } from "@/components/notification-button";
import { useLang } from "@/components/language-provider";

export function Header() {
  const { lang, t, setLang } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground">
      <div className="relative overflow-hidden flex flex-col bg-card px-4 pt-2 pb-1.5">
        {/* Wave background at reduced opacity so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: "url('/wave.jpeg')",
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'repeat-x',
            opacity: 0.82,
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-between">
          <span
            className="text-xl leading-none text-foreground"
            style={{ fontFamily: "var(--font-alfa)" }}
          >
            {FESTIVAL_NAME}
          </span>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className="text-xs font-bold text-foreground/70"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              {t.festivalDates}
            </span>
            <button
              onClick={() => setLang(lang === "sk" ? "en" : "sk")}
              className="rounded border-2 border-foreground bg-foreground px-1.5 py-0.5 text-xs font-bold text-background transition-colors hover:bg-transparent hover:text-foreground"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
              aria-label="Switch language"
            >
              {lang === "sk" ? "EN" : "SK"}
            </button>
            <NotificationButton />
          </div>
        </div>
      </div>
    </header>
  );
}
