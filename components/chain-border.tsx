const HEIGHT = 18;
const CENTER = HEIGHT / 2;
const AMPLITUDE = 5;
const HALF_PERIOD = 36;
const TOTAL = 1800;

function buildWave() {
  const curves: string[] = [];
  for (let x = 0; x < TOTAL; x += HALF_PERIOD) {
    const goUp = Math.floor(x / HALF_PERIOD) % 2 === 0;
    const peak = goUp ? CENTER - AMPLITUDE : CENTER + AMPLITUDE;
    const cp1x = x + HALF_PERIOD * 0.25;
    const cp2x = x + HALF_PERIOD * 0.75;
    const endX = x + HALF_PERIOD;
    curves.push(`C ${cp1x} ${peak} ${cp2x} ${peak} ${endX} ${CENTER}`);
  }
  return curves.join(" ");
}

const curves = buildWave();
const topFill = `M 0 0 L 0 ${CENTER} ${curves} L ${TOTAL} 0 Z`;
const botFill = `M 0 ${CENTER} ${curves} L ${TOTAL} ${HEIGHT} L 0 ${HEIGHT} Z`;
const waveLine = `M 0 ${CENTER} ${curves}`;

export function ChainBorder({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="100%"
      height={HEIGHT}
      viewBox={`0 0 ${TOTAL} ${HEIGHT}`}
      preserveAspectRatio="xMinYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={
        flip
          ? { transform: "scaleY(-1)", display: "block" }
          : { display: "block" }
      }
    >
      {/* top fill = card (blue), bottom fill = background, or inverse when flipped */}
      <path d={topFill} style={{ fill: "var(--card)" }} />
      <path d={botFill} style={{ fill: "transparent" }} />
      <path
        d={waveLine}
        fill="none"
        style={{ stroke: "var(--foreground)" }}
        strokeWidth={1.5}
      />
    </svg>
  );
}
