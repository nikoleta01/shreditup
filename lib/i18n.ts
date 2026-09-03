import type { LocationKey } from "@/lib/data";

export type Lang = "sk" | "en";

// Slovak is the source of truth: `en` is typed as `typeof sk`, so a key added
// here and not there fails the build instead of silently rendering Slovak.
const sk = {
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
    skateWave: "Kokopeli vlna",
    volleyball: "Volejbalové ihrisko",
    football: "Futbalové ihrisko",
  } satisfies Record<LocationKey, string>,
  mapNote: "15:00–16:30 je futbalové ihrisko obsadené mimo akcie Shreditup.",
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
    denied:
      "Notifikácie sú zablokované. Povoľ ich v Nastavenia → Notifikácie → Shreditup.",
  },
  notifyBefore: "O 30 minút začína",
  full: "PLNÉ",
  info: "Info",
  infoPage: {
    emergency: "Núdzové kontakty",
    registrationNote: "Pre registráciu po 19:00 volaj",
  },
  loading: "Načítavam...",
  mapPage: {
    title: "Mapa areálu",
    subtitle: "Camping Sereď · Starý Most",
    imageAlt: "Mapa areálu festivalu",
  },
  myActivitiesPage: {
    title: "Moje aktivity",
    subtitle: "Tvoje registrácie na festivale",
    empty: "Zatiaľ nie si prihlásený/á na žiadnu aktivitu.",
    emptyHint: "Registráciu nájdeš v sekcii Program.",
    unregister: "Odhlásiť sa",
    unregistering: "Odhlasujem...",
    unregisterFailed: "Odhlásenie zlyhalo. Skús znova.",
  },
  register: {
    cta: "Zaregistrovať sa",
    registered: "Prihlásený/á",
    heading: "Registrácia",
    headingFor: "Registrácia na",
    whoAreYou: "Kto si?",
    nameNote: "Tvoje meno bude použité pri registrácii na workshopy a lekcie.",
    deviceWarningTitle: "Pozor",
    deviceWarning:
      "Rezervácia sa uloží len do tohto prehliadača, neprenáša sa na iné zariadenie. Registruj sa na telefóne, ktorý budeš mať na festivale, aby si nezabral miesto ostatným.",
    firstName: "Meno",
    lastName: "Priezvisko",
    confirm: "Potvrdiť",
    submitting: "Registrujem...",
    cancel: "Zrušiť",
    groups: {
      wave: "lekciu na vlne",
      skatepark: "lekciu v skateparku",
      fallback: "takúto lekciu",
    },
    errors: {
      session: "Relácia sa nepodarila. Skús znova.",
      unexpected: "Chyba",
      profile: "Niečo sa pokazilo. Skús znova.",
      failed: "Registrácia zlyhala. Skús znova.",
      full: "Tento workshop je už plný. Ak sa niekto odhlási, budeme ťa informovať.",
      alreadyRegistered: "Na túto aktivitu si už zaregistrovaný/á.",
      // {group} is one of register.groups, already in the right case.
      groupTaken:
        "Už si prihlásený/á na {group}. Aby sa dostalo na čo najviac ľudí, môžeš mať iba jednu — najprv sa odhlás v Aktivitách.",
    },
  },
};

const en: typeof sk = {
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
    skateWave: "Kokopeli Wave",
    volleyball: "Volleyball",
    football: "Football pitch",
  },
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
    denied:
      "Notifications are blocked. Enable them in Settings → Notifications → Shreditup.",
  },
  notifyBefore: "Starting in 30 minutes",
  full: "FULL",
  info: "Info",
  infoPage: {
    emergency: "Emergency contacts",
    registrationNote: "For registration after 19:00 call",
  },
  loading: "Loading...",
  mapPage: {
    title: "Venue map",
    subtitle: "Camping Sereď · Starý Most",
    imageAlt: "Map of the festival venue",
  },
  myActivitiesPage: {
    title: "My activities",
    subtitle: "Your festival registrations",
    empty: "You're not signed up for any activity yet.",
    emptyHint: "You can sign up in the Program section.",
    unregister: "Cancel registration",
    unregistering: "Cancelling...",
    unregisterFailed: "Cancelling failed. Try again.",
  },
  register: {
    cta: "Register",
    registered: "Registered",
    heading: "Registration",
    headingFor: "Registration for",
    whoAreYou: "Who are you?",
    nameNote:
      "Your name will be used when registering for workshops and lessons.",
    deviceWarningTitle: "Heads up",
    deviceWarning:
      "This booking is saved only to this browser, you won't see it on another device. Register on the phone you'll have at the festival, so you don't take up multiple spots.",
    firstName: "First name",
    lastName: "Last name",
    confirm: "Confirm",
    submitting: "Registering...",
    cancel: "Cancel",
    groups: {
      wave: "a wave lesson",
      skatepark: "a skatepark lesson",
      fallback: "a lesson like this",
    },
    errors: {
      session: "Could not start a session. Try again.",
      unexpected: "Error",
      profile: "Something went wrong. Try again.",
      failed: "Registration failed. Try again.",
      full: "This workshop is already full. If someone cancels, we'll let you know.",
      alreadyRegistered: "You're already registered for this activity.",
      groupTaken:
        "You're already signed up for {group}. So that as many people as possible get a turn, you can only have one — cancel it in Activities first.",
    },
  },
};

export const translations: Record<Lang, typeof sk> = { sk, en };

export type Translations = (typeof translations)[Lang];

// Slovak counts in three forms — 1 miesto, 2-4 miesta, 5+ miest — so this can't
// be a plain string in the table above.
export function spotsLeft(n: number, lang: Lang): string {
  if (lang === "en") return n === 1 ? "1 spot left" : `${n} spots left`;
  if (n === 1) return "1 voľné miesto";
  if (n < 5) return `${n} voľné miesta`;
  return `${n} voľných miest`;
}
