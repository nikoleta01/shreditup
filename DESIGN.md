# Design System — Shred It Up

## Color Palette

Extracted directly from the official festival poster. All values in OKLCH. **Strategy: "Light Sky" — full palette on a calm field.** The four poster colors are each used deliberately as *panels* (header/nav, badges, active states); a pale, cool sky pulled from the poster's own blue carries the surface. Dark-brown ink is the body text everywhere.

> **Why not the orange drench?** The launch design made orange the full-screen surface (drenched strategy). Festival-goers reported it was tiring and hard to read outdoors in bright September sun — dark ink on the hot vermilion sits at only ~4.3:1 and the red vibrates against text. Principle 2 ("Legible in the wild") outranks the drench, so the surface moved to a pale field where ink hits ~11:1. Poster fidelity is preserved by keeping every poster color present and deliberate — the poster itself is only ~⅓ orange; its bottom third is this same blue. Orange is demoted from "the wall" to "the stamp" (a first-class accent for highlights and active states). *To trial "Poster Paper" (warm off-white) instead, `--surface` is a one-line swap documented in `app/globals.css`.*

```css
/* Poster-faithful palette — fixed */
--orange:  #da452c;                 /* vermilion — accent / stamp (header alt, highlights) */
--blue:    oklch(0.58 0.13 231);    /* cerulean sky — header, bottom nav, day-tab rail, cards */
--pink:    oklch(0.70 0.12 352);    /* warm pink — active day tab, timetable blocks */
--olive:   #7b7834;                 /* dusty olive-gold — genre badges, primary fills */
--ink:     oklch(0.19 0.04 42);     /* near-black warm brown — all body type & borders */

/* Surface */
--surface:      oklch(0.945 0.028 226);  /* #daf1fb — pale cool sky (the body background) */
--surface-tint: oklch(0.90 0.03 226);    /* subtle panel / hover / input fill */

/* Functional roles */
--background:   var(--surface);     /* the pale field */
--foreground:   var(--ink);         /* dark brown for text */
--card:         var(--blue);        /* blue panels — header, nav, tab rail */
--primary:      var(--olive);       /* olive fills — badges, buttons */
--secondary:    var(--pink);        /* pink — active states */
--accent:       var(--pink);        /* pink highlights */
--muted:        var(--surface-tint);/* subtle surface panel */
--border:       var(--ink);         /* dark-brown hairlines & 2px outlines */
```

**Text on color fills rule**: Use `--ink` (dark brown) as text on the pale surface and on every poster-palette panel. Avoid white text — the poster uses dark brown on every background. This is the brand's contrast move. (The one place ink flips to a light tone is if the dark "Deep Dusk" surface variant is ever adopted.)

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
- Pure-white or neutral-gray backgrounds — the surface is a poster-derived pale *sky* (`--surface`, tinted toward the brand's own blue), never `#fff` and never a shadcn gray. Warmth/coolness is carried by the tint, not by a default neutral.
