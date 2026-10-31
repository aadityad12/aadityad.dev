# 11 · Alta beats: `AltaBench` responds to the Reel

**Phase**: C · **Size**: M · **Depends on**: 07 · **Parallel with**: 08, 09, 10

## Goal

Four beats: probe the row, sample fast on the metal, one line every 50 ms, teach don't tell.

## Source material

- `app/figures/AltaBench.tsx` (348 lines): a breadboard with a missing ground wire, a
  yellow probe you move, a voltage readout, and Alta's spoken guidance.
- `app/content.ts`: `NOTES.alta.beats`. Numbers here were verified in issue 02; use the
  values in `content.ts`, not the ones in this file.

## Beat → figure state

| beat | what the figure shows |
| --- | --- |
| 0 "Probe the row." | The board, the probe pod in its dock, the probe hovering over a row with a "put the probe here" marker. No readout yet. |
| 1 "Sample fast, on the metal." | A small oscilloscope-style strip under the board shows raw ADC samples streaming at the content's sample rate (drawn as a sparkline, 1 s window). Label: "ATmega328P · ADC ISR · ≈1,200 Hz/probe". |
| 2 "One line every 50 ms." | A monospaced console shows JSON lines arriving (`{"y":{"mean":5.01,"min":4.98,"max":5.03},"vcc":4.97}` style, matching the real line format if the repo README shows it; otherwise `TODO(aadi): confirm JSON line format`). A counter "1,199 / 1,200 lines · 0 bad" matches the soak-test figure in `content.ts`. |
| 3 "Teach, don't tell." | Alta's text appears ("Yellow reads 5.01 V. You expected about 2. What's between the rail and this row?"), the student fixes the wire (animate the ground wire into place), the readout drops to ~2 V, and a "3 of 3 trials" tag appears. |
| null | Free mode: today's behaviour. |

## Spec

- Add `({ beat }: FigureProps)`. Sparkline and console use a seeded generator
  (`mulberry32`) and `requestAnimationFrame` only while in view (`useInView`), paused
  under reduced motion (show a static frame instead).
- In beats, the probe is not draggable; in free mode it is (as today).
- The spoken text in beat 3 must not claim anything not in `content.ts`; use the phrasing
  above or the figure's existing guidance strings.

## Files

Modify: `app/figures/AltaBench.tsx`.

## Acceptance criteria

- [ ] `/datasheet/` Alta figure unchanged.
- [ ] Beat 1's label and beat 2's counter use the numbers from `content.ts` (grep them, do not retype).
- [ ] Animation stops when the figure is offscreen and under reduced motion.
- [ ] No hydration warnings.
- [ ] Build and lint pass.
