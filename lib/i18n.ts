import type { LocationKey } from "@/lib/data";

export type Lang = "sk" | "en";

export const translations = {
  sk: {
    program: "Program",
    timetable: "Harmonogram",
    myActivities: "Moje aktivity",
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
    } satisfies Record<LocationKey, string>,
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
    },
    notifyBefore: "O 30 minút začína",
    noRegistration: "Bez registrácie",
  },
  en: {
    program: "Program",
    timetable: "Timetable",
    myActivities: "My Activities",
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
    } satisfies Record<LocationKey, string>,
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
    },
    notifyBefore: "Starting in 30 minutes",
    noRegistration: "No registration",
  },
} satisfies Record<Lang, unknown>;

export type Translations = (typeof translations)[Lang];
