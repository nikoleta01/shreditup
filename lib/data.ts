// Semantic event type — drives color coding in the timetable. Keep this
// separate from `genre` (which is overloaded with music genres + reg status).
export type Category = "music" | "workshop" | "registration" | "info";

// Where an item happens. Stored as a key, not a label — the display string is
// resolved per language via `t.locations[key]` in i18n.ts.
export type LocationKey = "mainStage" | "skatepark";

export type ProgramItem = {
  id: string;
  title: string;
  day: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  genre: string;
  category: Category;
  location?: LocationKey;
  description?: string;
  activityId?: string; // Supabase activities.id — only set for registerable items
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
    title: "Registrácia",
    day: 1,
    startTime: "16:00",
    endTime: "22:30",
    genre: "Alternative",
    category: "registration",
    location: "mainStage",
    description: "Kick off the festival weekend with our opening act.",
  },
  {
    id: "d1-1",
    title: "Bubnovačka s Rytmikou",
    day: 1,
    startTime: "19:30",
    endTime: "20:30",
    genre: "Alternative",
    category: "music",
    location: "mainStage",
    description: "Kick off the festival weekend with our opening act.",
  },
  {
    id: "d1-2",
    title: "Open Mic",
    day: 1,
    startTime: "21:00",
    endTime: "22:30",
    genre: "Folk Rock",
    category: "music",
    location: "mainStage",
  },

  // Day 2 — Saturday
  {
    id: "d2-1",
    title: "Jóga s Jankou",
    day: 2,
    startTime: "10:00",
    endTime: "11:00",
    genre: "bez registrácie",
    category: "workshop",
  },
  {
    id: "d2-2",
    title: "Surfskate lekcia 1",
    day: 2,
    startTime: "15:15",
    endTime: "16:30",
    genre: "registrácia",
    category: "workshop",
    location: "skatepark",
    activityId: "bb31bcd4-f772-4834-9ba0-7d04f6e0dc05",
  },
  {
    id: "d2-3",
    title: "Vortex Parade",
    day: 2,
    startTime: "16:45",
    endTime: "18:00",
    genre: "Post-Punk",
    category: "music",
  },
  {
    id: "d2-4",
    title: "The Burning Maps",
    day: 2,
    startTime: "18:30",
    endTime: "20:00",
    genre: "Psychedelic Rock",
    category: "music",
    description: "Extended set with special guests.",
  },
  {
    id: "d2-5",
    title: "MZRI",
    day: 2,
    startTime: "20:30",
    endTime: "22:00",
    genre: "Electronic",
    category: "music",
  },
  {
    id: "d2-6",
    title: "Saturday Headliner",
    day: 2,
    startTime: "22:30",
    endTime: "00:30",
    genre: "Rock",
    category: "music",
    description: "The biggest act of the weekend.",
  },

  // Day 3 — Sunday
  {
    id: "d3-1",
    title: "Morning Tide",
    day: 3,
    startTime: "13:00",
    endTime: "14:00",
    genre: "Ambient",
    category: "music",
  },
  {
    id: "d3-2",
    title: "Copper Fields",
    day: 3,
    startTime: "14:15",
    endTime: "15:30",
    genre: "Country Rock",
    category: "music",
  },
  {
    id: "d3-3",
    title: "Infrared",
    day: 3,
    startTime: "15:45",
    endTime: "17:00",
    genre: "Synth Pop",
    category: "music",
  },
  {
    id: "d3-4",
    title: "Last Call Collective",
    day: 3,
    startTime: "17:30",
    endTime: "19:00",
    genre: "Indie Folk",
    category: "music",
  },
  {
    id: "d3-5",
    title: "Sunday Closer",
    day: 3,
    startTime: "19:30",
    endTime: "21:30",
    genre: "Alternative Rock",
    category: "music",
    description: "Closing the festival with an unforgettable set.",
  },
];

export function getProgramByDay(day: 1 | 2 | 3) {
  return program
    .filter((p) => p.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}
