import VenueMapEditor from "@/components/venue-map-editor";
import VenueMap from "@/components/venue-map";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <VenueMapEditor />
      <h1
        className="mb-1 text-center text-4xl leading-tight text-foreground"
        style={{ fontFamily: 'var(--font-geoparody)' }}
      >
        Mapa areálu
      </h1>
      <p
        className="mb-6 text-center text-sm text-foreground/60"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        Camping Sereď · Starý Most
      </p>

      <VenueMap />
    </div>
  )
}
