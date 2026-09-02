"use client";

import VenueMapEditor from "@/components/venue-map-editor";
import VenueMap from "@/components/venue-map";
import { useLang } from "@/components/language-provider";

export default function MapPage() {
  const { t } = useLang();

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      {/* Pin-placing tool at /map?place — inlined as false in prod builds, so
          the editor never reaches the client bundle. */}
      {process.env.NODE_ENV !== "production" && <VenueMapEditor />}
      <h1
        className="mb-1 text-center text-4xl leading-tight text-foreground"
        style={{ fontFamily: 'var(--font-geoparody)' }}
      >
        {t.mapPage.title}
      </h1>
      <p
        className="mb-6 text-center text-sm text-foreground/60"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        {t.mapPage.subtitle}
      </p>

      <VenueMap />
    </div>
  )
}
