import type { LocationKey } from "@/lib/data";

export type ChipTone =
  | "default"
  | "mainStage"
  | "meadow"
  | "skateWave"
  | "skatepark"
  | "volleyball"
  | "football";

// Single source of truth for chip colours. Both the location chips (WaveChip)
// and the timetable blocks read from here, so a location can never end up a
// different colour in the two places.
export const CHIP_TONE: Record<
  ChipTone,
  { backgroundColor: string; color: string }
> = {
  default: { backgroundColor: "var(--chip)", color: "var(--chip-foreground)" },
  mainStage: {
    backgroundColor: "var(--chip-mainstage)",
    color: "var(--chip-mainstage-foreground)",
  },
  meadow: {
    backgroundColor: "var(--chip-meadow)",
    color: "var(--chip-meadow-foreground)",
  },
  skateWave: {
    backgroundColor: "var(--chip-skatewave)",
    color: "var(--chip-skatewave-foreground)",
  },
  skatepark: {
    backgroundColor: "var(--chip-skatepark)",
    color: "var(--chip-skatepark-foreground)",
  },
  volleyball: {
    backgroundColor: "var(--chip-volleyball)",
    color: "var(--chip-volleyball-foreground)",
  },
  football: {
    backgroundColor: "var(--chip-football)",
    color: "var(--chip-football-foreground)",
  },
};

// Locations with their own colour; everything else (incl. mainStage and
// events without a location) falls back to "default".
const LOCATION_TONE: Partial<Record<LocationKey, ChipTone>> = {
  mainStage: "mainStage",
  meadow: "meadow",
  skateWave: "skateWave",
  skatepark: "skatepark",
  volleyball: "volleyball",
  football: "football",
};

export function toneForLocation(location?: LocationKey): ChipTone {
  return (location && LOCATION_TONE[location]) || "default";
}
