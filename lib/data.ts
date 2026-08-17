// Semantic event type — drives color coding in the timetable. Keep this
export type Category = "music" | "workshop" | "registration" | "info";

// Where an item happens. Stored as a key, not a label — the display string is
// resolved per language via `t.locations[key]` in i18n.ts.
export type LocationKey =
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
};

export const SLOT_GROUPS: Record<SlotGroupKey, SlotGroup> = {
  wave: {
    key: "wave",
    title: { sk: "Lekcie na vlne", en: "Skate Wave Lessons" },
    description: {
      sk: "Kapacita lekcie je 5 ľudí. Vyber si jeden čas - aby sa ušlo každému, môžeš mať iba jednu lekciu na vlne a jednu v skateparku.",
      en: "Each lesson fits 5 people. Pick one time — so that everyone gets a turn, you can book only one wave lesson and one skatepark lesson.",
    },
    location: "skateWave",
  },
  skatepark: {
    key: "skatepark",
    title: { sk: "Surfskate lekcie", en: "Surfskate Lessons" },
    description: {
      sk: "Kapacita lekcie je 24 ľudí. Vyber si jeden čas - aby sa ušlo každému, môžeš mať iba jednu lekciu na vlne a jednu v skateparku.",
      en: "Each lesson fits 24 people. Pick one time — so that everyone gets a turn, you can book only one wave lesson and one skatepark lesson.",
    },
    location: "skatepark",
  },
};

export type ProgramItem = {
  id: string;
  title: { sk: string; en: string };
  day: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  category?: Category;
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
    id: "d1-0",
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
    id: "d1-1",
    title: {
      sk: "Otvorenie festivalu a bubnovačka s Rytmikou",
      en: "Festival opening & drumming with Rytmika",
    },
    day: 1,
    startTime: "19:30",
    endTime: "20:30",
    category: "music",
    location: "mainStage",
    description: {
      sk: "Festival otvoríme spolu s Rytmikou, na konci môžete bubnovať spolu s nami.",
      en: "We'll open the festival together with Rytmika — at the end you can drum along with us.",
    },
    link: "https://rytmika.sk/",
  },
  {
    id: "d1-2",
    title: { sk: "Open Mic a Karaoke", en: "Open Mic & Karaoke" },
    day: 1,
    startTime: "21:00",
    endTime: "23:00",
    location: "mainStage",
  },
  {
    id: "d1-3",
    title: { sk: "Vatra", en: "Bonfire" },
    day: 1,
    startTime: "21:00",
    endTime: "22:30",
    category: "music",
    location: "campfire",
  },
  {
    id: "d1-4",
    title: { sk: "DJ Robson", en: "DJ Robson" },
    day: 1,
    startTime: "23:30",
    endTime: "03:00",
    category: "music",
    location: "mainStage",
  },

  // Day 2 — Saturday
  {
    id: "d2-1",
    title: {
      sk: "Jóga s Jankou - začiatočníci",
      en: "Yoga with Janka - Beginners",
    },
    day: 2,
    startTime: "09:00",
    endTime: "9:45",
    category: "workshop",
    location: "meadow",
    description: {
      sk: "Janku už môžete poznať z našich Level Trevel hodín jógy v Sade Janka Kráľa. Tentokrát máme pre Vás pripravené 2 verzie, pre začiatočníkov aj mierne pokročilých.",
      en: "Preparing translation.",
    },
  },
  {
    id: "d2-2",
    title: {
      sk: "Jóga s Jankou - mierne pokročilí",
      en: "Yoga with Janka - Intermediate",
    },
    day: 2,
    startTime: "10:00",
    endTime: "10:45",
    category: "workshop",
    location: "meadow",
  },
  {
    id: "d2-37",
    title: { sk: "Lekcia na vlne 1", en: "Skate Wave Lesson 1" },
    day: 2,
    startTime: "09:30",
    endTime: "09:50",
    category: "workshop",
    location: "skateWave",
    activityId: "a5dfa5dd-5ed8-4ad7-afff-a64ffbaf190d",
    slotGroup: "wave",
  },
  {
    id: "d2-370",
    title: { sk: "Lekcia na vlne 2", en: "Skate Wave Lesson 2" },
    day: 2,
    startTime: "09:50",
    endTime: "10:10",
    category: "workshop",
    location: "skateWave",
    activityId: "d1665533-4ca4-4b06-b85b-be64145ee966",
    slotGroup: "wave",
  },
  {
    id: "d2-3709",
    title: { sk: "Lekcia na vlne 3", en: "Skate Wave Lesson 3" },
    day: 2,
    startTime: "10:10",
    endTime: "10:30",
    category: "workshop",
    location: "skateWave",
    activityId: "9bc73fdf-a9cb-48b0-8b0e-dfbda73b07d0",
    slotGroup: "wave",
  },
  // Second round onwards run 30 minutes, unlike the 20-minute morning slots.
  {
    id: "d2-38",
    title: { sk: "Lekcia na vlne 4", en: "Skate Wave Lesson 4" },
    day: 2,
    startTime: "11:00",
    endTime: "11:30",
    category: "workshop",
    location: "skateWave",
    activityId: "b40a824c-bd43-4750-b3d7-287f7664bfbd",
    slotGroup: "wave",
  },
  {
    id: "d2-39",
    title: { sk: "Lekcia na vlne 5", en: "Skate Wave Lesson 5" },
    day: 2,
    startTime: "11:30",
    endTime: "12:00",
    category: "workshop",
    location: "skateWave",
    activityId: "12cf30f1-1012-462f-89d9-19b165586a08",
    slotGroup: "wave",
  },
  {
    id: "d2-40",
    title: { sk: "Lekcia na vlne 6", en: "Skate Wave Lesson 6" },
    day: 2,
    startTime: "13:00",
    endTime: "13:30",
    category: "workshop",
    location: "skateWave",
    activityId: "39ae68b5-a728-456c-8a48-acfe61e9548e",
    slotGroup: "wave",
  },
  {
    id: "d2-41",
    title: { sk: "Lekcia na vlne 7", en: "Skate Wave Lesson 7" },
    day: 2,
    startTime: "13:30",
    endTime: "14:00",
    category: "workshop",
    location: "skateWave",
    activityId: "3a66cc94-09a1-48a0-acf2-1e91dd02f41e",
    slotGroup: "wave",
  },
  {
    id: "d2-42",
    title: { sk: "Lekcia na vlne 8", en: "Skate Wave Lesson 8" },
    day: 2,
    startTime: "14:30",
    endTime: "15:00",
    category: "workshop",
    location: "skateWave",
    activityId: "214ec3ec-8a3f-4da0-baef-dc8844f69724",
    slotGroup: "wave",
  },
  {
    id: "d2-43",
    title: { sk: "Lekcia na vlne 9", en: "Skate Wave Lesson 9" },
    day: 2,
    startTime: "15:00",
    endTime: "15:30",
    category: "workshop",
    location: "skateWave",
    activityId: "9979a19b-92b9-4d00-aa73-1206a54876fd",
    slotGroup: "wave",
  },
  {
    id: "d2-3",
    title: { sk: "Surfskate lekcia 1", en: "Surfskate Lesson 1" },
    day: 2,
    startTime: "09:00",
    endTime: "10:00",
    category: "workshop",
    location: "skatepark",
    activityId: "abfa7892-15b3-42ae-8f33-4ba198d536bd",
    slotGroup: "skatepark",
  },
  {
    id: "d2-4",
    title: { sk: "Animal Flow", en: "Animal Flow" },
    day: 2,
    startTime: "17:00",
    endTime: "19:00",
    category: "workshop",
    location: "meadow",
  },
  {
    id: "kviz",
    title: { sk: "Level Trevel Kvíz", en: "Level Trevel Quiz" },
    day: 2,
    startTime: "11:30",
    endTime: "13:00",
    location: "mainStage",
  },
  {
    id: "creative-workshop",
    title: { sk: "Tvorivé dielne", en: "Creative Workshop" },
    day: 2,
    startTime: "13:00",
    endTime: "15:30",
    location: "mainStage",
  },
  {
    id: "south-korea",
    title: { sk: "Prednáška Južná Kórea", en: "South Korea Talk" },
    day: 2,
    startTime: "15:30",
    endTime: "16:30",
    location: "mainStage",
  },

  // Day 3 — Sunday
  {
    id: "d3-1",
    title: { sk: "Vítanie Slnka", en: "Sun Salutation" },
    day: 3,
    startTime: "5:00",
    endTime: "6:00",
    location: "meadow",
  },
];

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
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
          category: "workshop" as const,
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
