export default function MapPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <h1
        className="mb-1 text-4xl leading-tight text-foreground"
        style={{ fontFamily: 'var(--font-alfa)' }}
      >
        Mapa areálu
      </h1>
      <p
        className="mb-6 text-sm text-foreground/60"
        style={{ fontFamily: 'var(--font-barlow-condensed)' }}
      >
        Camping Sereď · Starý Most
      </p>

      <div className="border-2 border-foreground">
        <VenueMap />
      </div>

      <Legend />
    </div>
  )
}

function VenueMap() {
  return (
    <svg
      viewBox="0 0 300 420"
      className="w-full"
      aria-label="Mapa areálu festivalu"
    >
      <defs>
        <pattern id="tents" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
        </pattern>
      </defs>

      {/* River Váh */}
      <rect x="262" y="0" width="38" height="420" fill="currentColor" fillOpacity="0.08" />
      <text
        x="281" y="210"
        textAnchor="middle"
        fontSize="9"
        fill="currentColor"
        fillOpacity="0.4"
        fontFamily="var(--font-barlow-condensed)"
        fontWeight="600"
        letterSpacing="2"
        transform="rotate(90, 281, 210)"
      >
        VÁHOVSKÝ KANÁL
      </text>

      {/* Road — Starý Most */}
      <rect x="244" y="0" width="16" height="420" fill="currentColor" fillOpacity="0.12" />
      <text
        x="252" y="340"
        textAnchor="middle"
        fontSize="8"
        fill="currentColor"
        fillOpacity="0.5"
        fontFamily="var(--font-barlow-condensed)"
        fontWeight="700"
        letterSpacing="1.5"
        transform="rotate(90, 252, 340)"
      >
        STARÝ MOST
      </text>

      {/* Venue outer boundary */}
      <polygon
        points="18,38 210,28 238,110 238,268 195,308 18,308"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.6"
      />

      {/* ── BUILDINGS ZONE (upper) ── */}

      {/* Main hall — kovová hala / stage */}
      <rect x="28" y="48" width="148" height="90" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
      <text x="102" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.5">HLAVNÝ STAGE</text>
      <text x="102" y="100" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6" fontFamily="var(--font-barlow-condensed)">(kovová hala)</text>

      {/* Restaurant */}
      <rect x="182" y="48" width="52" height="38" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <text x="208" y="64" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">REŠTAU-</text>
      <text x="208" y="75" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">RÁCIA</text>

      {/* Showers + Toilets block */}
      <rect x="182" y="92" width="52" height="46" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <text x="208" y="108" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">SPRCHY</text>
      <text x="208" y="120" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.7" fontFamily="var(--font-barlow-condensed)">+ WC</text>

      {/* Skatepark area */}
      <rect x="28" y="146" width="100" height="50" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="78" y="166" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">SKATEPARK</text>
      <text x="78" y="178" textAnchor="middle" fontSize="8" fill="currentColor" fillOpacity="0.5" fontFamily="var(--font-barlow-condensed)">+ workshopy</text>

      {/* ── TENT AREA (lower) ── */}
      <rect x="22" y="206" width="200" height="90" fill="url(#tents)" stroke="currentColor" strokeWidth="2" />
      <text x="122" y="245" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.5">STANOVÉ</text>
      <text x="122" y="259" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)" letterSpacing="0.5">MESTEČKO</text>

      {/* Extra WC on meadow */}
      <rect x="158" y="274" width="30" height="18" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <text x="173" y="286" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">WC</text>

      {/* Entrance marker */}
      <circle cx="238" cy="260" r="7" fill="currentColor" fillOpacity="0.9" />
      <text x="222" y="248" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="var(--font-barlow-condensed)">VSTUP</text>
      <line x1="228" y1="254" x2="232" y2="258" stroke="currentColor" strokeWidth="1.5" />

      {/* P1 — main parking (bottom) */}
      <circle cx="50" cy="375" r="22" fill="#16a34a" />
      <text x="50" y="370" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="var(--font-barlow-condensed)">P1</text>
      <text x="50" y="382" textAnchor="middle" fontSize="7" fill="white" fontFamily="var(--font-barlow-condensed)">HLAVNÉ</text>

      {/* P2 — secondary parking (top, along road) */}
      <circle cx="252" cy="38" r="18" fill="#ca8a04" />
      <text x="252" y="34" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="var(--font-barlow-condensed)">P2</text>
      <text x="252" y="45" textAnchor="middle" fontSize="7" fill="white" fontFamily="var(--font-barlow-condensed)">POZDĹŽ.</text>
    </svg>
  )
}

function Legend() {
  const items = [
    { color: 'bg-foreground/10 border-2 border-foreground/60', label: 'Budovy' },
    { color: 'bg-foreground/5 border-2 border-foreground/60 border-dashed', label: 'Aktivity' },
    { pattern: true, label: 'Stanové mestečko' },
    { color: 'bg-[#16a34a]', label: 'P1 – hlavné parkovisko' },
    { color: 'bg-[#ca8a04]', label: 'P2 – pozdĺžne parkovanie' },
  ]

  return (
    <div className="mt-4 space-y-2 pb-4" style={{ fontFamily: 'var(--font-barlow-condensed)' }}>
      {items.map(({ color, pattern, label }) => (
        <div key={label} className="flex items-center gap-3">
          {pattern ? (
            <div className="h-4 w-6 shrink-0 border border-foreground/40" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)',
              backgroundSize: '6px 6px',
              opacity: 0.4,
            }} />
          ) : (
            <div className={`h-4 w-6 shrink-0 ${color}`} />
          )}
          <span className="text-xs text-foreground/70">{label}</span>
        </div>
      ))}
    </div>
  )
}
