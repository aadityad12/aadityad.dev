# 07 · The Reel: a restrained Apple-style highlights sequence

**Phase**: C · **Size**: L · **Depends on**: 06 · **Unblocks**: 08, 09, 10, 11

## Goal

The one place the Apple product-page idea belongs: a figure that holds in place while
three to five short text beats scroll past, each beat switching the figure to a new
state. The reference is apple.com/macbook-pro (the "highlights" section): a pinned visual,
short copy, state changes on scroll. We take the structure and leave out the parts that
break on the web: no scroll-jacking, no scroll-position interpolation, no content hidden
until scrolled, no autoplay video.

## How it works

```
≥ 900 px                                          < 900 px
┌──────────────────────┬──────────────────────┐   ┌──────────────────────┐
│                      │ 1  One language,     │   │ figure (sticky, top) │
│   figure (sticky,    │    five engines.     │   │ max-height 44vh      │
│   top: mast + 24px)  │    32-bit ints…      │   ├──────────────────────┤
│                      │                      │   │ 1  One language…     │
│   switches state     │ 2  Bytecode beats    │   │ 2  Bytecode beats…   │
│   when the active    │    walking the tree. │   │ 3  …                 │
│   beat changes       │    …                 │   └──────────────────────┘
│                      │ 3  …                 │
└──────────────────────┴──────────────────────┘
```

The active beat is the one whose box crosses a horizontal line 40% down the viewport.
That is computed with one `IntersectionObserver` (`rootMargin: "-40% 0px -60% 0px"`),
not with scroll math. CSS `position: sticky` pins the figure; no JS positions anything.

## Spec

### Contract for figures (all four in 08 to 11 adopt it)

```ts
export type FigureProps = { beat?: number | null };   // 0-based; null or undefined = free interactive mode
```

`FIGURES` in `app/figures/index.tsx` becomes `Record<string, ComponentType<FigureProps>>`.
Figures that don't yet accept `beat` ignore it (TypeScript allows the extra prop since
they take no props; add the type to the record anyway).

### `app/components/work/Reel.tsx` (client)

```ts
type ReelProps = {
  beats: Beat[];                      // from note.beats
  figure: ComponentType<FigureProps>;
  title: string;                      // note.title, for aria labels
  caption: string;                    // note.figure
};
```

- Renders `<section className="reel" aria-label={`${title} highlights`}>` with
  `<div className="reel-figure">` (sticky) and `<ol className="reel-beats">`.
- Each beat: `<li className="beat" data-i={i} aria-current={active === i ? "step" : undefined}>
  <span className="beat-n">{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></li>`.
  **All beats are rendered and visible at all times.** The active one is `--ink`; the
  others `--muted`. That is the only visual difference; opacity never goes below 0.55.
- Figure receives `beat={active}`. On mount `active = 0`. After the last beat scrolls past
  the line, `active` stays at the last index (the figure rests in its final state).
- Below the beats, a `<p className="reel-free">` with a `<button>` "Play with the figure
  ↓" that scrolls to the Fig block below and sets `active = null` so the figure returns to
  interactive mode. (The Fig block from issue 06 still renders under the Reel, so the user
  always has the free-play version. The Reel is an introduction, not a replacement.)
- Reduced motion: figures must not animate between states (they switch instantly; see the
  per-figure issues). The Reel itself has no animation to disable.
- No-JS: `active` is `0` server-side, so the figure renders beat 0 and all beats are
  readable. Nothing is hidden.
- Mobile: `.reel-figure` is `position: sticky; top: var(--mast-h)`, `max-height: 44vh`,
  figure scaled to fit (`.reel-figure > *` gets `max-height: 100%` and the figure's own
  `viewBox` handles scaling; if a figure doesn't scale, wrap it in a fixed-aspect box).

### Mounting

In `app/work/[slug]/page.tsx`, when `note.beats?.length >= 3` and `FIGURES[note.id]`
exists, render `<Reel … />` inside the `data-slot="reel"` wrapper **above** the existing
`<Fig>` block, and give the `<Fig>` an `id="figure"` so the "Play with the figure" button
can target it. When there are no beats, render exactly what issue 06 renders.

### Styles

`/* ---- reel ---- */` in `globals.css`. Grid `minmax(0, 1.1fr) minmax(0, 0.9fr)` at ≥ 900
px, gap 48px. Each `.beat` has `min-height: 52vh` on desktop so one beat at a time sits at
the trigger line, and `min-height: auto` with 28px gaps on mobile. The last beat gets
`margin-bottom: 20vh` so it can become active before the section ends.

### Testing hook

Add `data-active-beat={active}` on `<section className="reel">` so a browser check can
read the state.

## Files

Create: `app/components/work/Reel.tsx`.
Modify: `app/figures/index.tsx` (type), `app/work/[slug]/page.tsx` (mount), `app/globals.css`.

## Acceptance criteria

- [ ] On `/work/rung/` (after issue 08) at 1440 px: scrolling moves `data-active-beat` 0 → 1 → … → 4 and the figure visibly changes each time; scrolling back reverses it.
- [ ] At 390 px the figure stays visible at the top while beats scroll beneath it.
- [ ] With JavaScript disabled, all beats and the figure are visible; nothing is blank.
- [ ] With reduced motion on, state changes are instant and nothing else moves.
- [ ] The Fig block under the Reel still works in free mode after "Play with the figure".
- [ ] A project without `beats` (e.g. Temper) renders exactly as in issue 06.
- [ ] Lighthouse performance ≥ 90 on `/work/rung/` (`npx lighthouse … --only-categories=performance`); no layout shift from the Reel (CLS < 0.05).
- [ ] Build and lint pass.

## Out of scope

The per-figure beat states (08 to 11). Video. Any autoplaying motion.
