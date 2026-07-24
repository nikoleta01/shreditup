// POI = Point Of Interest
export type PoiTypeId =
  | "registration"
  | "mainStage"
  | "skateWave"
  | "tents"
  | "yoga"
  | "restaurant"
  | "foodTruck"
  | "toilets"
  | "showers"
  | "bonfire"
  | "volleyball"
  | "paddle"
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
    color: "#fbf9f9",
  },
  {
    id: "mainStage",
    emoji: "🎤",
    sk: "Hlavný stage",
    en: "Main stage",
    color: "#7c3aed",
    scale: 1.25,
  },
  {
    id: "skateWave",
    emoji: "🛹",
    sk: "Skate vlna",
    en: "Skate wave",
    color: "#0ea5e9",
    scale: 1.25,
  },
  {
    id: "tents",
    emoji: "⛺",
    sk: "Stanové mestečko",
    en: "Tent area",
    color: "#0891b2",
  },
  { id: "yoga", emoji: "🧘", sk: "Joga", en: "Yoga", color: "#db2777" },
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
    sk: "Food truck",
    en: "Food truck",
    color: "#d97706",
  },
  {
    id: "toilets",
    emoji: "🚻",
    sk: "Toalety",
    en: "Toilets",
    color: "#475569",
  },
  { id: "showers", emoji: "🚿", sk: "Sprchy", en: "Showers", color: "#0d9488" },
  {
    id: "bonfire",
    emoji: "🔥",
    sk: "Ohnisko",
    en: "Bonfire",
    color: "#e11d48",
  },
  {
    id: "volleyball",
    emoji: "🏐",
    sk: "Volejbal",
    en: "Volleyball",
    color: "#ca8a04",
  },
  {
    id: "paddle",
    emoji: "🏄",
    sk: "Súťaž v pádlovaní",
    en: "Paddling",
    color: "#2563eb",
  },
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
  { type: "mainStage", x: 20.98, y: 50.59 },
  { type: "skateWave", x: 45.76, y: 53.06 },
  { type: "tents", x: 28.57, y: 80.2 },
  { type: "tents", x: 34.82, y: 79.89 },
  { type: "tents", x: 24.55, y: 87.3 },
  { type: "tents", x: 30.58, y: 86.99 },
  { type: "yoga", x: 33.48, y: 62 },
  { type: "restaurant", x: 53.79, y: 17.27 },
  { type: "foodTruck", x: 45.98, y: 33.01 },
  { type: "toilets", x: 43.08, y: 13.57 },
  { type: "showers", x: 37.28, y: 14.5 },
  { type: "bonfire", x: 20.54, y: 38.56 },
  { type: "volleyball", x: 53.57, y: 86.06 },
  { type: "paddle", x: 93, y: 50 },
  { type: "parkingP2", x: 55.8, y: 2.16 },
  { type: "parkingLong", x: 70.98, y: 52.75 },
];
