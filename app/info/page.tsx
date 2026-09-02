"use client";

import { useLang } from "@/components/language-provider";

const EMERGENCY_CONTACTS = [
  { name: "Naďka", phone: "+421 914 214 706" },
  { name: "Roman", phone: "+421 904 036 074" },
  { name: "Rasťo", phone: "+421 950 384 269" },
];

const REGISTRATION_CONTACTS = [
  { name: "Karin", phone: "+421 917 514 892" },
  { name: "Nikči", phone: "+421 944 687 311" },
];

export default function InfoPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <h1
        className="mb-6 text-center text-4xl leading-tight text-foreground"
        style={{ fontFamily: "var(--font-geoparody)" }}
      >
        {t.info}
      </h1>

      <section className="mb-8 border-2 border-foreground bg-card p-4">
        <h2
          className="mb-3 text-lg font-bold text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.infoPage.emergency}
        </h2>

        <ul className="space-y-2">
          {EMERGENCY_CONTACTS.map(({ name, phone }) => (
            <li
              key={name}
              className="flex items-center justify-between text-sm"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              <span className="text-foreground">{name}</span>
              <a
                href={phone !== "—" ? `tel:${phone}` : undefined}
                className="text-foreground/70"
              >
                {phone}
              </a>
            </li>
          ))}
        </ul>

        <p
          className="mb-2 mt-4 text-xs font-bold text-foreground"
          style={{ fontFamily: "var(--font-barlow-condensed)" }}
        >
          {t.infoPage.registrationNote}
        </p>

        <ul className="space-y-2">
          {REGISTRATION_CONTACTS.map(({ name, phone }) => (
            <li
              key={name}
              className="flex items-center justify-between text-sm"
              style={{ fontFamily: "var(--font-barlow-condensed)" }}
            >
              <span className="text-foreground">{name}</span>
              <a
                href={phone !== "—" ? `tel:${phone}` : undefined}
                className="text-foreground/70"
              >
                {phone}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
