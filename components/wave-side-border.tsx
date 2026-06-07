'use client'

const STRIP_WIDTH = 32
const HALF = STRIP_WIDTH / 2
const FADE = '80px'

export function WaveSideBorder({ side }: { side: 'left' | 'right' }) {
  const rotation = side === 'left' ? '-90deg' : '90deg'

  return (
    <div
      className="pointer-events-none fixed top-0 h-screen overflow-hidden"
      style={{
        width: STRIP_WIDTH,
        [side]: 0,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${FADE}, black calc(100% - ${FADE}), transparent 100%)`,
        maskImage: `linear-gradient(to bottom, transparent 0px, black ${FADE}, black calc(100% - ${FADE}), transparent 100%)`,
      }}
      aria-hidden
    >
      <div
        style={{
          position: 'absolute',
          backgroundImage: "url('/wave.jpeg')",
          backgroundSize: `auto ${STRIP_WIDTH}px`,
          backgroundRepeat: 'repeat-x',
          width: '100vh',
          height: STRIP_WIDTH,
          top: `calc(50vh - ${HALF}px)`,
          left: `calc(${HALF}px - 50vh)`,
          transform: `rotate(${rotation})`,
        }}
      />
    </div>
  )
}
