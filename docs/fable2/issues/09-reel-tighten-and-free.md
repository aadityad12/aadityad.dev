# 09 · The reel: closer beats, and a figure that frees itself

**Phase**: D · **Size**: M · **Depends on**: nothing (can start on day one)

## Goal

On desktop the highlights reel spaces its beats so far apart that the Rung page is five
screens of mostly empty paper, and the figure is then repeated below the reel as
"Figure 1". Fable2 tightens the beats and, at desktop widths, drops the repeat: after the
last beat the reel figure becomes free to play with in place. Phones keep the second,
full-size figure because the sticky preview strip there is cropped to 44 vh and is not a
usable play surface.

## Source material

- `app/components/work/Reel.tsx`, `app/globals.css` lines 656 to 680.
- `app/work/[slug]/page.tsx` lines 79 to 94 (the `data-slot="reel"` block).
- `app/figures/index.tsx`: `FigureProps.beat`, where `null` means free mode.
- `docs/plan/issues/07-reel-component.md`: the original contract. `data-active-beat` and
  `aria-current="step"` stay.

## Spec

### Spacing (`globals.css`, ≥ 900 px)

- `.beat { min-height: 52vh }` becomes `.beat { min-height: 30vh; padding: 4vh 0; }`
  (`display: flex; flex-direction: column; justify-content: center` so the text sits in
  the middle of its band).
- `.beat:last-child { margin-bottom: 20vh }` becomes `margin-bottom: 6vh`.
- Under 900 px the current `gap: 28px` list stays.

The trigger line stays at 40 % (`TRIGGER_LINE`). With contiguous 30 vh beats exactly one
beat crosses that line at a time.

### Free mode after the last beat (`Reel.tsx`)

- Add a sentinel `<li className="reel-end" aria-hidden="true" />` as the last child of
  `.reel-beats` (height 1 px, no margin) and observe it with the same observer. When the
  sentinel intersects the trigger line, `setActive(null)`; when the last beat intersects
  again (scrolling back up), its handler sets the index as today.
- `data-active-beat` already reports `"free"` for `null`. Keep it.
- The "Play with the figure ↓" button now scrolls so the sentinel reaches the trigger
  line (`scrollIntoView({ block: "center" })` on the sentinel is close enough), which
  frees the figure, then focuses the figure frame (`tabIndex={-1}` on `.reel-figure .fig`).
  Rename the button text to "Play with the figure" and show it only at ≥ 900 px (under
  900 the full figure below serves that purpose).
- Add a figcaption to the reel figure, visible at ≥ 900 px only, under `.fig-body`:
  `<figcaption className="reel-cap">Figure 1. {caption}</figcaption>` using the existing
  `caption` prop (`note.figure`, which is the instruction line, for example "Click a block
  to fold it, or run the conductor against the budget."). The `fig-bar` left label becomes
  "Figure 1" and the right label stays the title.
- While a beat is active the figure is in beat mode and may ignore pointer input, as
  today; in free mode it accepts it. Add `data-mode={active === null ? "free" : "beat"}`
  on `.reel-figure` so CSS can show a mono "Live" hint (`.reel-figure[data-mode="free"]
  .fig-bar::after { content: "Live" }`) in `--ok`.

### The repeat (`page.tsx`)

- Wrap the existing `<Fig num="1" ...>` block (the one rendered when `hasReel`) in a
  `<div className="work-fig-mobile">` and hide it at ≥ 900 px (`display: none`). Its
  `id="figure"` moves to the reel's `.reel-figure` wrapper so existing anchors still
  land on a figure. Under 900 px the behaviour is as today.
- When there is no reel (fewer than three beats), nothing changes: the single `Fig`
  renders at every width.

### Reduced motion

`scrollIntoView` with `behavior: "auto"` under reduced motion (the existing check). No
other motion is added.

## Files

Modify: `app/components/work/Reel.tsx`, `app/work/[slug]/page.tsx`, `app/globals.css`.

## Acceptance criteria

- [ ] `/work/rung/` at 1440 x 900: total page height drops by at least 1,200 px compared with `Fable2` before this PR (report both numbers).
- [ ] Scrolling through the five Rung beats changes the figure at each; after the last, `data-active-beat` becomes `"free"`, the bar shows "Live", and clicking a rung in the ladder works. Scrolling back up re-enters beat mode.
- [ ] At 1440 only one figure is on the page (`document.querySelectorAll(".fig").length === 1` inside `main.work`); at 390 there are two, as before.
- [ ] "Play with the figure" frees the figure and moves focus to it; it is not rendered under 900 px.
- [ ] `/work/gazeboard/` (no reel) is unchanged.
- [ ] Reduced motion: no smooth scroll. No-JS: beats and figure visible, figure in its default state.
- [ ] Lint, build, budget pass; `/work/rung/` stays under 180 KB.

## Out of scope

Beat copy. Figure internals. Wayfinding (08).
