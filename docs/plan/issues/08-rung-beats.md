# 08 · Rung beats: `RungLadder` responds to the Reel

**Phase**: C · **Size**: S · **Depends on**: 07 · **Parallel with**: 09, 10, 11

## Goal

Make `RungLadder` switch state with the five Rung beats in `content.ts`, so the figure
"climbs" as the reader scrolls.

## Source material

- `app/figures/RungLadder.tsx` (129 lines): the ladder chart (rungs 01 to 09 plus the
  JIT, bars as speed-up over the tree-walker, a "Climb again" button, outlined bars for
  rungs where the JIT does not compile).
- `app/content.ts`: `NOTES.rung.beats` (five beats, written in issue 02).
- The committed numbers in the figure's data array (already verified in issue 02).

## Beat → figure state

| beat | what the figure shows |
| --- | --- |
| 0 "One language, five engines." | Only rung 01 (tree-walker) drawn at 1.00×; the other rows present but empty (hairline track, no bar). The legend shows "Tree-walker = 1.00×". |
| 1 "Bytecode beats walking the tree." | Rungs 02 (stack VM) and 03 (computed goto) fill in; their ratios appear. Row 02 highlighted. |
| 2 "Fewer instructions, same work." | Rungs 05 (register VM) and 06 (superinstructions) fill in. Row 05 highlighted. (Rung 04 stays empty for now.) |
| 3 "A speed-up that wasn't." | Rung 04 (NaN-boxing) fills in with its `--hot` bar and the "▼ 0.90×" (or whatever the data says) delta label; row 04 highlighted. |
| 4 "Native code, with an exit." | All rungs including 07, 08 and 09 (JIT) fill; JIT row highlighted; the existing "fib: tree-walker → ARM64 JIT = N×" summary line appears. |
| null | Free mode: exactly today's behaviour, including the "Climb again" animation. |

"Highlighted" = the row label and value use `--ink` at weight 600 and a 2px `--accent`
left rule; other filled rows at normal weight.

## Spec

- Add `({ beat }: FigureProps)` to the component. Derive `visible: Set<rungId>` and
  `highlight: rungId | null` from `beat` with a plain lookup table (no effects).
- When `beat` is a number, the "Climb again" button is hidden and the climb animation
  does not run. Bars of newly visible rungs grow from 0 width over 320 ms with
  `transition: width` (CSS), and instantly under reduced motion (`useReducedMotion()`
  from `hooks.ts`; set `transition: none`).
- When `beat` is `null`/`undefined`, behaviour is unchanged (the datasheet keeps using
  the figure with no prop).
- Keep the chart's numbers in one data array; the beat logic only toggles visibility.

## Files

Modify: `app/figures/RungLadder.tsx`.

## Acceptance criteria

- [ ] `/datasheet/` Rung figure is unchanged.
- [ ] On `/work/rung/`, each beat shows the rows in the table above and no others.
- [ ] The NaN-boxing row is only visible from beat 3 on and renders in `--hot`.
- [ ] Reduced motion: bars appear with no transition.
- [ ] No console warnings about hydration mismatches (the server renders beat 0).
- [ ] Build and lint pass.
