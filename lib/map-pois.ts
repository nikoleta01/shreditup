import type { LocationKey } from "@/lib/data";
import { translations } from "@/lib/i18n";
import { CHIP_TONE, type ChipTone } from "@/lib/location-chip";

// A pin that is also a program location takes its colour and its label from the
// chip tokens and i18n, so a location can't be one colour on the timetable and
// another on the map.
function fromProgram(location: LocationKey & ChipTone) {
  return {
    color: CHIP_TONE[location].backgroundColor,
    sk: translations.sk.locations[location],
    en: translations.en.locations[location],
  };
}

// POI = Point Of Interest
export type PoiTypeId =
  | "registration"
  | "mainStage"
  | "skateWave"
  | "tents"
  | "vandrak"
  | "meadow"
  | "chillZone"
  | "restaurant"
  | "foodTruck"
  | "toilets"
  | "showers"
  | "volleyball"
  | "football"
  | "parkingP2"
  | "parkingLong";

export type PoiType = {
  id: PoiTypeId;
  emoji: string;
  sk: string;
  en: string;
  color: string;
  /** Multiplies the whole map pin — circle and emoji together. 1 = default. */
  scale?: number;
};

export const POI_TYPES: PoiType[] = [
  {
    id: "registration",
    emoji: "🎟️",
    sk: "Registrácia",
    en: "Registration",
    color: "#2b2117",
  },
  { id: "mainStage", emoji: "🎤", scale: 1.25, ...fromProgram("mainStage") },
  { id: "skateWave", emoji: "🛹", scale: 1.25, ...fromProgram("skateWave") },
  {
    id: "tents",
    emoji: "⛺",
    sk: "Stanové mestečko",
    en: "Tent area",
    color: "#0891b2",
  },
  // Same emoji as "tents", so the colour has to carry the difference.
  { id: "vandrak", emoji: "⛺", sk: "Vandrák", en: "Vandrák", color: "#b91c1c" },
  { id: "meadow", emoji: "🧘", ...fromProgram("meadow") },
  {
    id: "chillZone",
    emoji: "😎",
    sk: "Chill zóna",
    en: "Chill zone",
    color: "#1d4ed8",
    scale: 1.25,
  },
  {
    id: "restaurant",
    emoji: "🍽️",
    sk: "Reštaurácia",
    en: "Restaurant",
    color: "#ea580c",
  },
  {
    id: "foodTruck",
    emoji: "🍟",
    sk: "Food trucky",
    en: "Food trucks",
    color: "#d97706",
    scale: 1.25,
  },
  {
    id: "toilets",
    emoji: "🚻",
    sk: "Toalety",
    en: "Toilets",
    color: "#475569",
  },
  { id: "showers", emoji: "🚿", sk: "Sprchy", en: "Showers", color: "#94a3b8" },
  { id: "volleyball", emoji: "🏐", ...fromProgram("volleyball") },
  { id: "football", emoji: "⚽", ...fromProgram("football") },
  {
    id: "parkingP2",
    emoji: "🅿️",
    sk: "Parkovisko P2",
    en: "Parking P2",
    color: "#ca8a04",
  },
  {
    id: "parkingLong",
    emoji: "🅿️",
    sk: "Pozdĺžne parkovanie",
    en: "Longitudinal parking",
    color: "#65a30d",
  },
];

export const POI_TYPE_BY_ID: Record<PoiTypeId, PoiType> = Object.fromEntries(
  POI_TYPES.map((t) => [t.id, t]),
) as Record<PoiTypeId, PoiType>;

export type MapPoi = {
  type: PoiTypeId;
  x: number;
  y: number;
};

export const MAP_POIS: MapPoi[] = [
  { type: "registration", x: 62.05, y: 73.42 },
  { type: "mainStage", x: 22, y: 53 },
  { type: "skateWave", x: 45.76, y: 53.06 },
  { type: "tents", x: 28.57, y: 80.2 },
  { type: "tents", x: 34.82, y: 79.89 },
  { type: "tents", x: 24.55, y: 87.3 },
  { type: "tents", x: 30.58, y: 86.99 },
  { type: "meadow", x: 33.48, y: 62 },
  { type: "restaurant", x: 53.79, y: 17.27 },
  { type: "foodTruck", x: 24.44, y: 39.02 },
  { type: "toilets", x: 43.08, y: 13.57 },
  { type: "showers", x: 37.28, y: 14.5 },
  { type: "volleyball", x: 53.57, y: 86.06 },
  { type: "parkingP2", x: 57.8, y: 4.2 },
  { type: "parkingLong", x: 70.98, y: 52.75 },
  { type: "toilets", x: 44.2, y: 84.83 },
  { type: "parkingLong", x: 70.76, y: 40.41 },
  { type: "chillZone", x: 47.1, y: 39.79 },
  { type: "football", x: 20.98, y: 22.83 },
  { type: "vandrak", x: 34.6, y: 33.31 },
];
