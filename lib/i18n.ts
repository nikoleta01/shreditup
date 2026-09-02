import type { LocationKey } from "@/lib/data";

export type Lang = "sk" | "en";

export const translations = {
  sk: {
    program: "Program",
    timetable: "Harmonogram",
    myActivities: "Aktivity",
    map: "Mapa",
    festivalDates: "4–6 Sep 2026",
    days: {
      1: { label: "Piatok", short: "Pia 4.9." },
      2: { label: "Sobota", short: "Sob 5.9." },
      3: { label: "Nedeľa", short: "Ned 6.9." },
    },
    mainStage: "Hlavný stage",
    locations: {
      mainStage: "Hlavný stage",
      skatepark: "Skatepark",
      meadow: "Festivalová lúka",
      skateWave: "Skate vlna",
      volleyball: "Volejbalové ihrisko",
      football: "Futbalové ihrisko",
    } satisfies Record<LocationKey, string>,
    mapNote: "15:00–16:30 je futbalové ihrisko obsadené.",
    install: {
      title: "Pridaj na plochu",
      desc: "Rýchly prístup k programu festivalu bez prehliadača.",
      button: "Nainštalovať",
      iosHint: "V prehliadači klikni na",
      iosThen: 'Zdieľať, potom "Pridať na plochu".',
      iosChromeHint: "Klikni na",
      iosChromeThen: '••• dole vpravo, potom "Pridať na plochu".',
      close: "Zavrieť",
      notify: "Nezabudni kliknúť na zvonček hore, aby ti nič neuniklo.",
    },
    notifications: {
      enable: "Zapnúť notifikácie",
      disable: "Vypnúť notifikácie",
      notSupported: "Notifikácie nie sú podporované.",
      denied: "Notifikácie sú zablokované. Povoľ ich v Nastavenia → Notifikácie → Shreditup.",
    },
    notifyBefore: "O 30 minút začína",
    full: "PLNÉ",
    info: "Info",
    infoPage: {
      emergency: "Núdzové kontakty",
      registrationNote: "Pre registráciu po 19:00 volaj",
    },
  },
  en: {
    program: "Program",
    timetable: "Timetable",
    myActivities: "Activities",
    map: "Map",
    festivalDates: "4–6 Sep 2026",
    days: {
      1: { label: "Friday", short: "Fri 4/9" },
      2: { label: "Saturday", short: "Sat 5/9" },
      3: { label: "Sunday", short: "Sun 6/9" },
    },
    mainStage: "Main Stage",
    locations: {
      mainStage: "Main Stage",
      skatepark: "Skatepark",
      meadow: "Festival Meadow",
      skateWave: "Skate Wave",
      volleyball: "Volleyball",
      football: "Football pitch",
    } satisfies Record<LocationKey, string>,
    mapNote: "The football pitch is occupied 15:00–16:30.",
    install: {
      title: "Add to Home Screen",
      desc: "Quick access to the festival program without a browser.",
      button: "Install",
      iosHint: "Tap the",
      iosThen: 'Share button, then "Add to Home Screen".',
      iosChromeHint: "Tap",
      iosChromeThen: '••• (bottom right), then "Add to Home Screen".',
      close: "Close",
      notify: "Don't forget to tap the bell above so you don't miss anything.",
    },
    notifications: {
      enable: "Enable notifications",
      disable: "Disable notifications",
      notSupported: "Notifications not supported.",
      denied: "Notifications are blocked. Enable them in Settings → Notifications → Shreditup.",
    },
    notifyBefore: "Starting in 30 minutes",
    full: "FULL",
    info: "Info",
    infoPage: {
      emergency: "Emergency contacts",
      registrationNote: "For registration after 19:00 call",
    },
  },
} satisfies Record<Lang, unknown>;

export type Translations = (typeof translations)[Lang];

// Slovak counts in three forms — 1 miesto, 2-4 miesta, 5+ miest — so this can't
// be a plain string in the table above.
export function spotsLeft(n: number, lang: Lang): string {
  if (lang === "en") return n === 1 ? "1 spot left" : `${n} spots left`;
  if (n === 1) return "1 voľné miesto";
  if (n < 5) return `${n} voľné miesta`;
  return `${n} voľných miest`;
}
