# Design System — Shred It Up

## Color Palette

Extracted directly from the official festival poster. All values in OKLCH. **Full palette strategy** — four named color roles each used deliberately; no single neutral dominates.

```css
/* Poster-faithful palette */
--color-orange:   oklch(0.60 0.19 32);    /* terracotta-orange — dominant brand surface */
--color-blue:     oklch(0.58 0.13 231);   /* cerulean sky — accent surface and border pattern */
--color-pink:     oklch(0.70 0.13 352);   /* warm pink — title balloon, stripe accent */
--color-olive:    oklch(0.56 0.09 107);   /* dusty olive-gold — borders, secondary fills */
--color-ink:      oklch(0.19 0.04 42);    /* near-black warm brown — all body type */

/* Functional roles */
--background:     oklch(0.60 0.19 32);    /* orange IS the surface (drenched strategy) */
--foreground:     oklch(0.19 0.04 42);    /* dark brown for text */
--surface:        oklch(0.56 0.09 107);   /* olive-gold panels */
--surface-alt:    oklch(0.58 0.13 231);   /* blue panels */
--accent:         oklch(0.70 0.13 352);   /* pink highlights */
--muted:          oklch(0.30 0.05 42);    /* dark brown at 60% — secondary text */
```

**Text on color fills rule**: Use `--color-ink` (dark brown) on all poster-palette fills. Avoid white text — the poster uses dark brown on every background. This is the brand's contrast move.

## Typography

### Primary typeface

**No display font loaded yet** — the poster uses a custom hand-lettered psychedelic type that is unavailable as a web font. Use the closest available alternative:

- **Display/headings**: `"Alfa Slab One"` (Google Fonts) — heavy slab serif with enough mass to evoke 60s poster lettering at small sizes
- **Body / UI**: `"DM Sans"` — modern humanist, clean at small sizes, diacritics well-supported (critical for Slovak: ě, š, ž, č, ď, ť, ľ)
- **Mono**: `"DM Mono"` — for times/tabular data

### Scale (base 16px)

| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-display` | clamp(2rem, 8vw, 4rem) | 900 | Festival name hero |
| `text-heading` | 1.5rem / 1.25rem | 700 | Page sections |
| `text-label` | 0.875rem | 600 | Artist name, day tabs |
| `text-body` | 0.875rem | 400 | Descriptions, secondary |
| `text-caption` | 0.75rem | 400 | Times, metadata |

Letter-spacing: display heads at -0.02em; UI labels at 0.

## Components

### Header

Sticky top bar. Background: `--color-orange`. Text: `--color-ink`. Border-bottom: 2px solid `--color-ink`. The festival name should feel like a poster stamp, not a SaaS nav.

### Bottom Navigation

Fixed bottom bar. Background: `--color-olive`. Active item: `--color-ink` at full opacity with underline or filled pip. Inactive: `--color-ink` at 50% opacity. No backdrop blur needed — use a solid olive fill.

### Day Tabs (Program / Timetable)

Tab rail: `--color-blue` background. Active tab: `--color-pink` fill with `--color-ink` text. Inactive: `--color-blue` fill with `--color-ink` at 60%.

### Performance Card (Program list)

No card border or shadow. Use a horizontal divider line (1px, `--color-ink` at 20%). Time column: `--color-ink`, bold, tabular nums. Genre badge: `--color-olive` background, `--color-ink` text, rounded-full pill. Artist name: bold, `--color-ink`.

### Timetable Performance Block

Background: `--color-pink`. Text: `--color-ink`. Rounded corners (0.375rem). No opacity — solid fills only.

### Install Prompt Banner

Background: `--color-blue`. Border: 2px solid `--color-ink`. Text: `--color-ink`. Button: `--color-ink` fill, `--color-orange` or white text.

### Notification Button

Icon button. Active state: `--color-pink` fill. Inactive: transparent with `--color-ink` icon.

## Layout

- Max content width: 448px (`max-w-md`), centered
- Page padding: `px-4` (16px sides)
- Timetable allows full-width on wider screens
- Bottom nav height: 64px (accounts for iOS home indicator safe area)
- Header height: 56px
- Content pad-bottom: `pb-20` to clear fixed bottom nav

## Motion

Festival-appropriate: warm and loose, not corporate-tight.

- Tab transitions: 150ms ease-out crossfade on content
- Install prompt: slide-down from top on mount (200ms)
- Performance blocks in timetable: no animation (they're reference objects, not interactive)
- Reduced-motion: instant transitions, no sliding

## Iconography

Lucide icons are acceptable but should feel slightly heavier than their default weight. Use `stroke-width={2}` as baseline; active states bump to `stroke-width={2.5}`.

## Poster elements to reference

The poster is the canonical design document. Key elements to echo:

- **The eye motif**: consider using it as a decorative mark or loading state
- **The stripe pattern**: alternating blue/pink vertical stripes appear in background panels — use sparingly as a texture
- **The zigzag/chain border**: appears as a repeating pattern along edges — can be used as a section divider
- **The frogs/figures**: silhouette imagery that suggests outdoor movement and the surfskate community
- **Overall**: bold outlines, flat color fills, no gradients, no shadows — everything is solid and poster-printed

## Anti-patterns (banned)

- Gradients of any kind — poster uses flat fills only
- Box shadows — poster is flat; UI should be too
- Gray neutrals as primary surfaces — no shadcn defaults
- Blue/pink as text colors — they are fill colors only; text is always `--color-ink`
- White backgrounds — this is a drenched palette; the orange IS the bg
