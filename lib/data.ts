// Semantic event type — drives color coding in the timetable. Keep this
export type Category = "music" | "workshop" | "registration" | "info";

// Where an item happens. Stored as a key, not a label — the display string is
// resolved per language via `t.locations[key]` in i18n.ts.
export type LocationKey = "mainStage" | "skatepark" | "bonfire";

export type ProgramItem = {
  id: string;
  title: string;
  day: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  category?: Category;
  location?: LocationKey;
  description?: string;
  activityId?: string; // Supabase activities.id — only set for registerable items
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
    title: "Registrácia a stavanie stanov",
    day: 1,
    startTime: "17:00",
    endTime: "19:00",
    description: "Otvárame festivalové brány.",
  },
  {
    id: "d1-1",
    title: "Otvorenie festivalu a bubnovačka s Rytmikou",
    day: 1,
    startTime: "19:30",
    endTime: "20:30",
    category: "music",
    location: "mainStage",
    description:
      "Festival otvoríme spolu s Rytmikou, na konci môžete bubnovať spolu s nami.",
    link: "https://rytmika.sk/",
  },
  {
    id: "d1-2",
    title: "Open Mic a Karaoke",
    day: 1,
    startTime: "21:00",
    endTime: "23:00",
    location: "mainStage",
  },
  {
    id: "d1-3",
    title: "Vatra",
    day: 1,
    startTime: "21:00",
    endTime: "22:30",
    category: "music",
    location: "bonfire",
  },
  {
    id: "d1-4",
    title: "DJ Robson",
    day: 1,
    startTime: "23:30",
    endTime: "03:00",
    category: "music",
    location: "mainStage",
  },

  // Day 2 — Saturday
  {
    id: "d2-1",
    title: "Jóga s Jankou - začiatočníci",
    day: 2,
    startTime: "09:00",
    endTime: "10:00",
    category: "workshop",
  },
  {
    id: "d2-2",
    title: "Jóga s Jankou - mierne pokročilí",
    day: 2,
    startTime: "10:00",
    endTime: "11:00",
    category: "workshop",
  },
  {
    id: "d2-3",
    title: "Surfskate lekcia 1",
    day: 2,
    startTime: "15:15",
    endTime: "16:30",
    category: "workshop",
    location: "skatepark",
    activityId: "bb31bcd4-f772-4834-9ba0-7d04f6e0dc05",
  },
  {
    id: "d2-4",
    title: "Animal Flow",
    day: 2,
    startTime: "17:00",
    endTime: "19:00",
    category: "music",
    description: "The biggest act of the weekend.",
  },

  // Day 3 — Sunday
  {
    id: "d3-1",
    title: "Vítanie Slnka",
    day: 3,
    startTime: "5:00",
    endTime: "6:00",
    category: "workshop",
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

// Registerable activities are the subset of the program carrying an `activityId`
// (their capacity + registrations live in the DB `activities` table, keyed by
// that id). Everything displayable about them — title, day, time, description —
// is resolved here from the program: the single source of truth.
export function getRegisterableActivity(
  activityId: string,
): ProgramItem | undefined {
  return program.find((p) => p.activityId === activityId);
}
