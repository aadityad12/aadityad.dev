# 03 · Front page: hero and the chip as index

**Phase**: B (front page) · **Size**: L · **Depends on**: 02 · **Unblocks**: 05, 13, 15

## Goal

The first screen a recruiter sees. Name, one sentence, availability, four actions, the
proof strip, and the chip. The chip stops being decoration: hovering a pin highlights the
projects that use that skill in the table below (issue 04), clicking a pin filters the
table to them.

## Source material

- `app/components/Chip.tsx` (this branch): the SVG chip, pin placement, hover tooltip.
- `app/content.ts`: `HERO`, `PROOF`, `PINS`, `NOTES[].skills`, `PIN_USES`.
- `git show Opus-Map:app/page.tsx` lines for `.hero`, `.avail-pill`, `.proof`: the
  layout this is modelled on (read for structure, restyle in Factory tokens).
- `git show Opus-Map:app/globals.css`: `.avail-pill`, `.proof` rules for reference.

## Layout (1440 px)

```
[masthead: issue 13; until then, the existing Masthead]

shell (max-width 1180px)
┌────────────────────────────────────────────────┬──────────────────────┐
│ ● Available for Summer 2027 internships ·      │                      │
│   May to August 2027                   (pill)  │                      │
│ COMPUTER ENGINEERING · SJSU · CLASS OF 2028    │        CHIP          │
│ Aaditya Desai                      (h1, 72px)  │   (interactive)      │
│ I build from the metal up: ...   (lead, 26px)  │                      │
│ I led the software for VisionAssist ... (17px) │  Hover a pin to see  │
│ [Résumé PDF ↓] [Email] [GitHub ↗] [LinkedIn ↗] │  where I used it.    │
│                                                │  Click to filter.    │
├────────────────────────────────────────────────┴──────────────────────┤
│ Infineon        Winner            38.8× [Measured]       3.8 GPA      │
│ Research intern Sponsor Track,    my ARM64 JIT vs.       Dean's       │
│ and tech lead   UC Berkeley AI…   the interpreter        Scholar      │
└───────────────────────────────────────────────────────────────────────┘
```

At 768 px: chip below the copy, 320 px wide, centred. At 390 px: chip 280 px, the four
actions wrap to two rows, proof strip is a 2×2 grid.

## Spec

### Hero (server component, `app/components/brief/Hero.tsx`)

- Availability pill first: `<p className="avail"><i aria-hidden /> {HERO.avail}</p>`.
  Green dot (`--ok`), hairline border, mono 12px uppercase. This is the first element
  in the DOM after the masthead, on purpose.
- Eyebrow: `HERO.eyebrow`, mono, `--muted`.
- `<h1>` "Aaditya Desai", Archivo at `font-stretch: 112%`, weight 800, `clamp(44px, 7vw, 76px)`,
  letter-spacing -0.03em, line-height 0.95.
- Lead: `HERO.lead`, 26px at 1440 / 21px at 390, weight 500. The phrase "from the metal
  up" wrapped in `<em>` styled `--accent`, not italic.
- Intro: `HERO.intro`, 17px, `--ink-2`, max-width 56ch.
- Actions: four `.button` elements (reuse the datasheet's `.button` and `.button.primary`
  styles). Résumé is primary. Order: Résumé PDF ↓, Email, GitHub ↗, LinkedIn ↗.
- Right column: `<ChipIndex />` (below).
- Under the chip, mono 12px: "Fig. 0 · 28 pins, one per skill. Hover to see where I used
  it; click to filter the projects." Hidden under 768 px (touch has no hover) and replaced
  with "Tap a pin to filter the projects."

### Proof strip (`app/components/brief/Proof.tsx`)

- `<ul className="proof">` with four `<li><a href>`: `<b>{big}</b><span>{small}</span>` and
  a `<Status s />` after `big` when `status` is set.
- Hairline top and bottom rules, four equal columns at ≥ 900 px, 2×2 under.

### Chip as index (`app/components/brief/ChipIndex.tsx`, client)

Extend `Chip.tsx` rather than copy it. Add props:

```ts
type ChipProps = {
  activePin?: string | null;                     // pin name currently hovered or selected
  selectedPin?: string | null;                   // pin name clicked (sticky filter)
  onHoverPin?: (name: string | null) => void;
  onSelectPin?: (name: string | null) => void;   // same pin again clears
};
```

Behaviour:
- Pins are `<g role="button" tabIndex={0} aria-pressed={selected}>`. Enter or Space
  toggles selection. Arrow keys move focus to the next or previous pin. Escape clears.
- Hover (pointer, non-touch) sets `activePin`; leaving clears it unless a pin is selected.
- The tooltip (already exists) shows pin name, `desc`, and "Used in: VisionAssist, Rung"
  using `PIN_USES(name)` mapped to titles. Keep its current styling.
- The lit state: pin lead and label use `--accent`; the chip body shows the pin name in
  the small "AADITYA DESAI" line area (replace the second line of the chip's silkscreen
  text with the active pin's name while active).
- Pins with zero projects (`PIN_USES(name).length === 0`, e.g. x86) still show the
  tooltip ("Used in: teaching") but are not selectable (no `aria-pressed`, cursor default).

State lives in a tiny store so the table (issue 04) can read it without prop drilling:

```ts
// app/components/brief/pinStore.ts
import { useSyncExternalStore } from "react";
type S = { active: string | null; selected: string | null };
let state: S = { active: null, selected: null };
const subs = new Set<() => void>();
export const pinStore = {
  get: () => state,
  set: (patch: Partial<S>) => { state = { ...state, ...patch }; subs.forEach((f) => f()); },
  subscribe: (f: () => void) => { subs.add(f); return () => subs.delete(f); },
};
export const usePins = () => useSyncExternalStore(pinStore.subscribe, pinStore.get, () => ({ active: null, selected: null }));
```

`ChipIndex` writes to `pinStore`; the table's filter (issue 04) reads it. The URL hash
`#skill=C++` mirrors `selected` (set on select, removed on clear, read once on mount) so
a filtered view is linkable. Do not use Next's router for this; `history.replaceState`.

### Reduced motion and no-JS

- Chip tilt-on-pointer (exists) is already gated by reduced motion; keep.
- Without JS the chip renders as a static SVG with a visible `<title>` and the pin table
  on `/datasheet/` is the text equivalent; link to it in the caption: "Pin table ↗".

### Styles

New rules in `app/globals.css` under a `/* ---- brief ---- */` banner. Prefix classes
with `.brief-` or scope under `main.brief`. Do not change existing datasheet rules.

## Files

Create: `app/components/brief/Hero.tsx`, `app/components/brief/Proof.tsx`,
`app/components/brief/ChipIndex.tsx`, `app/components/brief/pinStore.ts`.
Modify: `app/components/Chip.tsx` (add props; default behaviour unchanged for the
datasheet), `app/page.tsx` (render `<Hero />` and `<Proof />` inside `<main className="brief">`),
`app/globals.css`.

## Acceptance criteria

- [ ] At 1440 px, with the masthead, the whole hero including the proof strip fits in 900 px of height.
- [ ] At 390 px, name, lead, availability and the Résumé button are visible without scrolling.
- [ ] Hovering the C++ pin shows the tooltip with "Used in: Rung"; `pinStore.get().active === "C++"`.
- [ ] Clicking C++ sets `selected`, the URL becomes `/#skill=C%2B%2B`, clicking again clears both.
- [ ] Keyboard: Tab reaches the first pin, arrows move between pins, Enter selects, Escape clears.
- [ ] `/datasheet/` chip is unchanged in look and behaviour.
- [ ] Lighthouse accessibility ≥ 95 on `/` (run `npx lighthouse http://localhost:3000 --only-categories=accessibility --quiet --chrome-flags="--headless"` against `npx serve out -l 3000`).
- [ ] No-JS: all hero text visible; chip visible as static SVG.
- [ ] Build and lint pass.

## Out of scope

The project table (04). Masthead redesign (13). OG image (15).
