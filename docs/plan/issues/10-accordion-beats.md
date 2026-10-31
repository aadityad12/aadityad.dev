# 10 · Accordion beats: `AccordionMap` responds to the Reel

**Phase**: C · **Size**: M · **Depends on**: 07 · **Parallel with**: 08, 09, 11

## Goal

Four beats: a session fills up, fold instead of delete, decide what to bring back,
measure whether it helped.

## Source material

- `app/figures/AccordionMap.tsx` (243 lines): a simulated session drawn as blocks sized by
  token weight and coloured by kind; click to fold; "run the conductor against the budget".
- `app/content.ts`: `NOTES.accordion.beats` (four beats).

## Beat → figure state

| beat | what the figure shows |
| --- | --- |
| 0 "A session fills up." | All blocks unfolded. A budget bar at the top at ~104% (over budget, `--hot`). Legend of block kinds visible. |
| 1 "Fold, don't delete." | The conductor folds a deterministic set of stale blocks (same seed every time; use `mulberry32` from `hooks.ts`). Folded blocks collapse to thin slivers but stay in place. The last N blocks are drawn inside a "protected tail" bracket and never fold. Budget bar drops to ~72%, `--ok`. |
| 2 "Decide what to bring back." | One folded block pulses once and unfolds; a small side list "unfold shortlist" shows three candidates with rerank scores, the chosen one on top, labelled "cross-encoder rerank". |
| 3 "Measure whether it helped." | A compact health strip appears under the map: "Health: OK · needed-fold rate 0.18 · vs. naive compaction: +2 facts retained" with every value tagged `Stated` via `<Status />` **unless** the figure already has real numbers from the repo; it does not, so tag `Stated` and keep the strip clearly labelled "illustrative". |
| null | Free mode: today's behaviour. |

## Spec

- Add `({ beat }: FigureProps)`. Precompute the folded set once (seeded) so SSR and client
  agree. Derive layers from `beat` with a lookup table.
- Click-to-fold stays enabled in free mode only. In beats, pointer events on blocks are
  disabled (`pointer-events: none`) so the story isn't disturbed; a hint "Play with the
  map below" is not needed (the Reel already offers it).
- The protected tail bracket and the shortlist panel are new SVG/HTML; keep them in the
  figure's existing colour set.
- Animations: fold/unfold 260 ms height, none under reduced motion.

## Files

Modify: `app/figures/AccordionMap.tsx`.

## Acceptance criteria

- [ ] `/datasheet/` Accordion figure unchanged.
- [ ] Beat 1 folds the same blocks on every load (deterministic).
- [ ] The protected tail never folds in any beat.
- [ ] Beat 3's health strip shows `Stated` tags and the word "illustrative".
- [ ] No hydration warnings.
- [ ] Build and lint pass.
