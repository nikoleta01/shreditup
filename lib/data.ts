// Where an item happens. Stored as a key, not a label — the display string is
// resolved per language via `t.locations[key]` in i18n.ts.
export type LocationKey =
  | "volleyball"
  | "mainStage"
  | "skatepark"
  | "campfire"
  | "meadow"
  | "skateWave";

// Lessons that repeat: a dozen near-identical slots of the same thing. Listing
// them as a dozen program rows drowns everything else on the day, so the program
// renders one card per group with a slot picker inside. Matches
// `activities.group_key` in the DB, which also caps a person at one slot per
// group — the picker is that rule made visible instead of an error.
export type SlotGroupKey = "wave" | "skatepark";

export type SlotGroup = {
  key: SlotGroupKey;
  title: { sk: string; en: string };
  description: { sk: string; en: string };
  location: LocationKey;
  // How many distinct slots in this group one person may hold at once.
  // Mirrors the cap enforced in register_for_activity() in Supabase.
  maxPerUser: number;
};

export const SLOT_GROUPS: Record<SlotGroupKey, SlotGroup> = {
  wave: {
    key: "wave",
    title: { sk: "Lekcie na vlne", en: "Skate Wave Lessons" },
    description: {
      sk: "Kapacita lekcií na vlne je 4. Môžeš absolvovať dve lekcie na vlne a jednu v skateparku.",
      en: "Each skate wave lesson fits 4 people. You can book two wave lessons and one skatepark lesson.",
    },
    location: "skateWave",
    maxPerUser: 2,
  },
  skatepark: {
    key: "skatepark",
    title: { sk: "Surfskate lekcie", en: "Surfskate Lessons" },
    description: {
      sk: "Vyber si jeden čas - aby sa ušlo každému, môžeš mať iba jednu lekciu v skateparku a dve na vlne.",
      en: "Pick one time — so that everyone gets a turn, you can book only one skatepark lesson and two wave lessons.",
    },
    location: "skatepark",
    maxPerUser: 1,
  },
};

export type ProgramItem = {
  id: string;
  title: { sk: string; en: string };
  day: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  location?: LocationKey;
  description?: { sk: string; en: string };
  // Supabase activities.id — only set for registerable items, and unique per
  // item: two lessons sharing one id would share one capacity pool.
  activityId?: string;
  // Folds this item into a SLOT_GROUPS card instead of giving it its own row.
  slotGroup?: SlotGroupKey;
  link?: string;
};

export const FESTIVAL_NAME = "Shreditup";

export const FESTIVAL_DAYS: Record<
  1 | 2 | 3,
  { date: Date; label: string; short: string }
> = {
  1: {
    date: new Date("2026-09-04"),
    label: "Piatok / Friday",
    short: "Pia 4.9.",
  },
  2: {
    date: new Date("2026-09-05"),
    label: "Sobota / Saturday",
    short: "Sob 5.9.",
  },
  3: {
    date: new Date("2026-09-06"),
    label: "Nedeľa / Sunday",
    short: "Ned 6.9.",
  },
};

export const STAGE_NAME = "Main Stage";

export const program: ProgramItem[] = [
  // Day 1 — Friday
  {
    id: "registration",
    title: {
      sk: "Registrácia a stavanie stanov",
      en: "Registration & tent setup",
    },
    day: 1,
    startTime: "17:00",
    endTime: "19:00",
    description: {
      sk: "Otvárame festivalové brány.",
      en: "We're opening the festival gates.",
    },
  },
  {
    id: "rytmika",
    title: {
      sk: "Otvorenie festivalu a bubnovačka s Rytmikou",
      en: "Festival opening & drumming with Rytmika",
    },
    day: 1,
    startTime: "19:30",
    endTime: "20:30",
    location: "mainStage",
    description: {
      sk: "Festival odštartujeme spolu s Rytmikou, na konci môžete bubnovať spolu s nami.",
      en: "We'll open the festival together with Rytmika — at the end you can drum along with us.",
    },
    link: "https://rytmika.sk/",
  },
  {
    id: "open-mic",
    title: { sk: "Open Mic a Karaoke", en: "Open Mic & Karaoke" },
    day: 1,
    startTime: "21:00",
    endTime: "23:00",
    location: "mainStage",
  },
  {
    id: "campfire",
    title: { sk: "Vatra", en: "Bonfire" },
    day: 1,
    startTime: "21:00",
    endTime: "22:30",
    location: "campfire",
  },
  {
    id: "robson",
    title: { sk: "DJ Robson", en: "DJ Robson" },
    day: 1,
    startTime: "23:30",
    endTime: "03:00",
    location: "mainStage",
    link: "https://www.instagram.com/robson.pov/",
  },

  // Day 2 — Saturday
  {
    id: "yoga-beginners",
    title: {
      sk: "Jóga s Jankou - začiatočníci",
      en: "Yoga with Janka - Beginners",
    },
    day: 2,
    startTime: "09:00",
    endTime: "10:00",
    location: "meadow",
    link: "https://www.instagram.com/jana_siskova/",
    description: {
      sk: "Janku už môžete poznať z našich Level Trevel hodín jógy v Sade Janka Kráľa. Pripravili sme pre Vás 2 varianty, pre začiatočníkov, neskôr pre mierne pokročilých. Kapacita neobmedzená, dones si len podložku.",
      en: "Maybe Janka is already familiar to you from our Bratislava summer yoga sessions. This time, we prepared 2 version - for beginners and intermediates. Capacity is unlimited, just bring your mat.",
    },
  },
  {
    id: "kamposvk",
    title: {
      sk: "Diskusia s Maťom (Kamposlovensku)",
      en: "Discussion with Maťo (Kamposlovensku)",
    },
    description: {
      sk: "Diskusia k rannej výberovej kávičke so zakladateľom komunity kamposlovensku Maťom Železníkom.",
      en: "Discussion with the founder of kamposlovenku community.",
    },
    day: 2,
    startTime: "09:30",
    endTime: "10:30",
    location: "mainStage",
    link: "https://www.instagram.com/kamposlovensku/",
  },
  {
    id: "d2-2",
    title: {
      sk: "Jóga s Jankou - mierne pokročilí",
      en: "Yoga with Janka - Intermediates",
    },
    day: 2,
    startTime: "10:00",
    endTime: "11:00",
    location: "meadow",
  },
  {
    id: "south-korea",
    title: {
      sk: "Prednáška Južná Kórea",
      en: "South Korea",
    },
    day: 2,
    startTime: "15:30",
    endTime: "16:30",
    location: "mainStage",
    link: "https://www.instagram.com/ervinthestagram",
  },
  {
    id: "wave-1",
    title: { sk: "Lekcia na vlne 1", en: "Skate Wave Lesson 1" },
    day: 2,
    startTime: "09:30",
    endTime: "09:45",
    location: "skateWave",
    activityId: "1b9fd50d-3c66-49e8-a3a8-5c6604dcaecb",
    slotGroup: "wave",
  },
  {
    id: "wave-2",
    title: { sk: "Lekcia na vlne 2", en: "Skate Wave Lesson 2" },
    day: 2,
    startTime: "09:45",
    endTime: "10:00",
    location: "skateWave",
    activityId: "533fe899-35e6-4c10-9073-61b2447413ef",
    slotGroup: "wave",
  },
  {
    id: "wave-3",
    title: { sk: "Lekcia na vlne 3", en: "Skate Wave Lesson 3" },
    day: 2,
    startTime: "10:00",
    endTime: "10:15",
    location: "skateWave",
    activityId: "daa1a327-8109-49a9-99f1-3c54fd14a02f",
    slotGroup: "wave",
  },
  {
    id: "wave-4",
    title: { sk: "Lekcia na vlne 4", en: "Skate Wave Lesson 4" },
    day: 2,
    startTime: "10:15",
    endTime: "10:30",
    location: "skateWave",
    activityId: "8dc9d003-27c0-47cf-ae1e-5f2ad2d8faa9",
    slotGroup: "wave",
  },
  {
    id: "wave-5",
    title: { sk: "Lekcia na vlne 5", en: "Skate Wave Lesson 5" },
    day: 2,
    startTime: "11:00",
    endTime: "11:15",
    location: "skateWave",
    activityId: "0bc795ad-b297-4d41-b605-90403879fcf8",
    slotGroup: "wave",
  },
  {
    id: "wave-6",
    title: { sk: "Lekcia na vlne 6", en: "Skate Wave Lesson 6" },
    day: 2,
    startTime: "11:15",
    endTime: "11:30",
    location: "skateWave",
    activityId: "5d15301e-2d7d-44cc-9a9e-71e597414e71",
    slotGroup: "wave",
  },
  {
    id: "wave-7",
    title: { sk: "Lekcia na vlne 7", en: "Skate Wave Lesson 7" },
    day: 2,
    startTime: "11:30",
    endTime: "11:45",
    location: "skateWave",
    activityId: "eaad49e2-b44f-4b8e-8b87-65cb932a976f",
    slotGroup: "wave",
  },
  {
    id: "wave-8",
    title: { sk: "Lekcia na vlne 8", en: "Skate Wave Lesson 8" },
    day: 2,
    startTime: "11:45",
    endTime: "12:00",
    location: "skateWave",
    activityId: "59339517-4468-47ad-bd98-9431d379c867",
    slotGroup: "wave",
  },
  {
    id: "wave-9",
    title: { sk: "Lekcia na vlne 9", en: "Skate Wave Lesson 9" },
    day: 2,
    startTime: "13:00",
    endTime: "13:15",
    location: "skateWave",
    activityId: "261c754a-e546-4e94-bdc8-f6f9c4423dad",
    slotGroup: "wave",
  },
  {
    id: "wave-10",
    title: { sk: "Lekcia na vlne 10", en: "Skate Wave Lesson 10" },
    day: 2,
    startTime: "13:15",
    endTime: "13:30",
    location: "skateWave",
    activityId: "da8d889b-d5c3-43fc-8c88-83b09dd3f6e7",
    slotGroup: "wave",
  },
  {
    id: "wave-11",
    title: { sk: "Lekcia na vlne 11", en: "Skate Wave Lesson 11" },
    day: 2,
    startTime: "13:30",
    endTime: "13:45",
    location: "skateWave",
    activityId: "bbca85dd-0130-4149-bed8-a54d73e30c39",
    slotGroup: "wave",
  },
  {
    id: "wave-12",
    title: { sk: "Lekcia na vlne 12", en: "Skate Wave Lesson 12" },
    day: 2,
    startTime: "13:45",
    endTime: "14:00",
    location: "skateWave",
    activityId: "11f7f3f5-b07a-433a-b565-b3a2e9672688",
    slotGroup: "wave",
  },
  {
    id: "wave-13",
    title: { sk: "Lekcia na vlne 13", en: "Skate Wave Lesson 13" },
    day: 2,
    startTime: "14:30",
    endTime: "14:45",
    location: "skateWave",
    activityId: "d1693fb1-93ea-42fa-a17f-6cd6970120b7",
    slotGroup: "wave",
  },
  {
    id: "wave-14",
    title: { sk: "Lekcia na vlne 14", en: "Skate Wave Lesson 14" },
    day: 2,
    startTime: "14:45",
    endTime: "15:00",
    location: "skateWave",
    activityId: "177ea05d-55ef-4a82-9fac-526c40d4e0e5",
    slotGroup: "wave",
  },
  {
    id: "wave-15",
    title: { sk: "Lekcia na vlne 15", en: "Skate Wave Lesson 15" },
    day: 2,
    startTime: "15:00",
    endTime: "15:15",
    location: "skateWave",
    activityId: "693c683a-e2b7-40e9-b520-fa144c8fb3d0",
    slotGroup: "wave",
  },
  {
    id: "wave-16",
    title: { sk: "Lekcia na vlne 16", en: "Skate Wave Lesson 16" },
    day: 2,
    startTime: "15:15",
    endTime: "15:30",
    location: "skateWave",
    activityId: "90e540b2-da23-4240-b6d5-1e5840f32710",
    slotGroup: "wave",
  },
  {
    id: "d2-3",
    title: { sk: "Surfskate lekcia 1", en: "Surfskate Lesson 1" },
    day: 2,
    startTime: "09:30",
    endTime: "10:30",
    location: "skatepark",
    activityId: "abfa7892-15b3-42ae-8f33-4ba198d536bd",
    slotGroup: "skatepark",
  },
  {
    id: "d2-3b",
    title: { sk: "Surfskate lekcia 2", en: "Surfskate Lesson 2" },
    day: 2,
    startTime: "11:00",
    endTime: "12:00",
    location: "skatepark",
    activityId: "25e1b01b-0c86-4e18-9d45-f91fa0652a48",
    slotGroup: "skatepark",
  },
  {
    id: "d2-3c",
    title: { sk: "Surfskate lekcia 3", en: "Surfskate Lesson 3" },
    day: 2,
    startTime: "13:00",
    endTime: "14:00",
    location: "skatepark",
    activityId: "cc9b221f-7ce0-4f55-9d27-ad68f9aa6019",
    slotGroup: "skatepark",
  },
  {
    id: "d2-3d",
    title: { sk: "Surfskate lekcia 4", en: "Surfskate Lesson 4" },
    day: 2,
    startTime: "14:00",
    endTime: "15:00",
    location: "skatepark",
    activityId: "62468aa3-4e91-4da2-9d6f-bcd844d19f51",
    slotGroup: "skatepark",
  },
  {
    id: "skatepark-5",
    title: { sk: "Surfskate lekcia 5", en: "Surfskate Lesson 5" },
    day: 2,
    startTime: "15:30",
    endTime: "16:30",
    location: "skatepark",
    activityId: "da37bdc5-b9ee-472f-9007-76052c28299e",
    slotGroup: "skatepark",
  },
  {
    id: "headstands",
    title: {
      sk: "Headstand workshop s Dominikom",
      en: "Headstand Workshop with Dominik",
    },
    day: 2,
    startTime: "10:00",
    endTime: "12:00",
    location: "meadow",
    link: "https://www.instagram.com/dominik_raa/",
    description: {
      sk: "Dominik žije parkourom, lezením a pohybom. Prejdeš si vranu, stojku na hlave aj stojku na vystretých rukách s variáciami. Ešte si to neskúšal? Si na správnom mieste. Kapacita je 20 ľudí.",
      en: "",
    },
  },
  {
    id: "frisbee-1",
    title: {
      sk: "Frisbee workshop Sky Up 1",
      en: "Frisbee Workshop Sky Up 1",
    },
    day: 2,
    startTime: "11:00",
    endTime: "12:00",
    location: "meadow",
    link: "https://www.instagram.com/skyup.kosice/",
    description: {
      sk: "Chalani z košického klubu Sky Up ti ukážu základy frisbee hodov aj pár kúskov, ktoré vyzerajú nemožne.",
      en: "",
    },
  },
  {
    id: "frisbee-2",
    title: {
      sk: "Frisbee workshop od Sky Up 2",
      en: "Frisbee Workshop Sky Up 2",
    },
    day: 2,
    startTime: "14:00",
    endTime: "15:00",
    location: "meadow",
    link: "https://www.instagram.com/skyup.kosice/",
  },
  {
    id: "volleyball",
    title: {
      sk: "Volejbalový turnaj",
      en: "Volleyball tournament",
    },
    day: 2,
    startTime: "14:00",
    endTime: "17:00",
    location: "volleyball",
  },
  {
    id: "d2-4",
    title: { sk: "Animal Flow", en: "Animal Flow" },
    day: 2,
    startTime: "17:00",
    endTime: "19:30",
    location: "meadow",
  },
  {
    id: "quiz",
    title: { sk: "Level Trevel Kvíz", en: "Level Trevel Quiz" },
    day: 2,
    startTime: "11:00",
    endTime: "12:00",
    location: "mainStage",
  },
  {
    id: "creative-workshop",
    title: { sk: "Tvorivé dielne", en: "Creative Workshop" },
    day: 2,
    startTime: "12:00",
    endTime: "15:00",
    location: "mainStage",
    description: {
      sk: "Štyri stanovištia: linotlač od @zuzajda_liska (dones si tričko alebo čokoľvek, čo chceš upgradnúť, zvyšok máme), upcyklácia oblečenia od @dorota.cicatko, korálkovanie od @zuz_anna.k náramky od @agallovaa a výroba náramkov háčikovaním pod vedením @martin_zbojan z @recykloo a výroba keramiky z rýchlotvrdnúcej hliny.",
      en: "",
    },
  },
  {
    id: "surfskate-competition",
    title: { sk: "Surfskate súťaž", en: "Surfskate Competition" },
    day: 2,
    startTime: "17:00",
    endTime: "18:30",
    location: "skateWave",
    activityId: "88d4ad43-38b2-4127-88e1-2cb585ad511b",
  },
  {
    id: "wrablova",
    title: {
      sk: "Diskusia Zuzana Vráblová",
      en: "Discussion with Zuzana Vrablova",
    },
    day: 2,
    startTime: "18:30",
    endTime: "19:30",
    location: "mainStage",
    link: "https://www.instagram.com/zuzanavrablova/",
  },
  {
    id: "baca",
    title: {
      sk: "Diskusia Miroslav Bača",
      en: "Discussion with Miroslav Bača",
    },
    day: 2,
    startTime: "20:00",
    endTime: "21:00",
    location: "mainStage",
    link: "https://www.instagram.com/thebacis/",
  },
  {
    id: "alergy",
    title: { sk: "DJ Alergy", en: "DJ Alergy" },
    day: 2,
    startTime: "21:00",
    endTime: "22:30",
    location: "mainStage",
  },
  {
    id: "kazy",
    title: { sk: "DJ Kazy", en: "DJ Kazy" },
    day: 2,
    startTime: "22:30",
    endTime: "00:00",
    location: "mainStage",
  },
];

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Times are hand-typed, so "9:45" and "09:45" both occur. The program's time
// column is left-aligned against the page padding, where an unpadded hour would
// leave a ragged edge — so pad at render instead of trusting every entry.
export function formatTime(time: string) {
  const [h, m] = time.split(":");
  return `${h.padStart(2, "0")}:${m}`;
}

export function getProgramByDay(day: 1 | 2 | 3) {
  return program
    .filter((p) => p.day === day)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

// A day's program as rendered: standalone items, plus one entry per slot group
// collapsing all its slots. A group takes the chronological position of its
// earliest slot and spans to its latest end, so the day still reads top-to-bottom.
export type ProgramEntry =
  | { kind: "item"; key: string; item: ProgramItem }
  | {
      kind: "group";
      key: string;
      group: SlotGroup;
      slots: ProgramItem[];
      startTime: string;
      endTime: string;
    };

export function getProgramEntriesByDay(day: 1 | 2 | 3): ProgramEntry[] {
  const entries: ProgramEntry[] = [];
  const groupAt = new Map<SlotGroupKey, number>();

  for (const item of getProgramByDay(day)) {
    if (!item.slotGroup) {
      entries.push({ kind: "item", key: item.id, item });
      continue;
    }

    const at = groupAt.get(item.slotGroup);
    if (at === undefined) {
      groupAt.set(item.slotGroup, entries.length);
      entries.push({
        kind: "group",
        key: `d${day}-${item.slotGroup}`,
        group: SLOT_GROUPS[item.slotGroup],
        slots: [item],
        startTime: item.startTime,
        endTime: item.endTime,
      });
      continue;
    }

    const entry = entries[at];
    if (entry.kind !== "group") continue;
    entry.slots.push(item);
    if (toMinutes(item.endTime) > toMinutes(entry.endTime)) {
      entry.endTime = item.endTime;
    }
  }

  return entries;
}

// The timetable draws one block per contiguous run of a group's slots rather
// than one per slot — nine stacked 20-minute blocks are unreadable at 60px/hour,
// and the overlap stagger caps out at three levels anyway.
export function getTimetableItemsByDay(day: 1 | 2 | 3): ProgramItem[] {
  return getProgramEntriesByDay(day).flatMap((e) =>
    e.kind === "item"
      ? [e.item]
      : contiguousRuns(e.slots).map((run, i) => ({
          id: `${e.key}-run${i}`,
          title: e.group.title,
          day,
          startTime: run[0].startTime,
          endTime: run[run.length - 1].endTime,
          location: e.group.location,
        })),
  );
}

// Slots that touch end-to-end become one block; a gap starts a new one. Drawing
// a group as a single block from its first start to its last end would claim the
// lunch break as lesson time — the wave runs 09:30-10:30, 11:00-12:00,
// 13:00-14:00, 14:30-15:30, not six solid hours.
function contiguousRuns(slots: ProgramItem[]): ProgramItem[][] {
  const sorted = [...slots].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );
  const runs: ProgramItem[][] = [];

  for (const slot of sorted) {
    const run = runs[runs.length - 1];
    const prevEnd = run && toMinutes(run[run.length - 1].endTime);
    if (run && prevEnd !== undefined && toMinutes(slot.startTime) <= prevEnd) {
      run.push(slot);
    } else {
      runs.push([slot]);
    }
  }

  return runs;
}

// Registerable activities are the subset of the program carrying an `activityId`
// (their capacity + registrations live in the DB `activities` table, keyed by
// that id). Everything displayable about them — title, day, time, description —
// is resolved here from the program: the single source of truth.
export function getRegisterableActivity(
  activityId: string,
): ProgramItem | undefined {
  return program.find((p) => p.activityId === activityId);
}
