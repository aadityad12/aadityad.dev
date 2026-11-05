# 09 · VisionAssist beats: `VisionScene` responds to the Reel

**Phase**: C · **Size**: M · **Depends on**: 07 · **Parallel with**: 08, 10, 11

## Goal

Walk the reader through the pipeline in five beats: see, detect, measure, choose, speak.

## Source material

- `app/figures/VisionScene.tsx` (337 lines): a simulated camera frame with draggable
  obstacles, bounding boxes, distance labels, risk colours, a single announcement line,
  and the buttons "Edge-clip fix (not shipped)", "Speak off", "Reset".
- `app/content.ts`: `NOTES.visionassist.beats`.

## Beat → figure state

| beat | what the figure shows |
| --- | --- |
| 0 "See." | The frame with obstacles drawn as plain silhouettes. No boxes, no labels, no announcement. A small "1280×720 · ~5 FPS" tag in the corner. |
| 1 "Detect." | Bounding boxes appear with class names and confidence; one below 0.45 is drawn dashed and labelled "dropped (0.41)" to show the floor. Tag: "YOLOv8n · ≈200 ms". |
| 2 "Measure." | Each box gets its distance label in feet; a dimension line shows box height `h` and the formula `d = H·f / h` with `f = 900 px` beside the frame. |
| 3 "Choose one thing to say." | Boxes recolour by risk tier (existing colours). All but the riskiest-closest fade to 50%; that one gets the `--hot` outline. Zone bands (safe > 9 ft, caution 6 to 9 ft, warning < 6 ft) drawn as faint horizontal bands. |
| 4 "Speak." | The announcement line appears ("Stop. Chair, 5 feet, 2 steps ahead."), with a small speaker glyph and "Piper TTS · earbuds · systemd". Obstacles remain draggable. |
| null | Free mode: today's behaviour with all controls. |

## Spec

- Add `({ beat }: FigureProps)`. Map `beat` to a set of layer flags
  (`boxes`, `distances`, `risk`, `zones`, `announce`, `formula`) with a lookup table.
- Controls ("Edge-clip fix", "Speak off", "Reset") render only in free mode. Dragging is
  allowed in every state; in beats 0 to 3 dragging updates positions but not the hidden
  layers.
- If the figure already synthesises an announcement string from the scene, reuse it for
  beat 4; do not hard-code one. If not, use the example above with a `TODO(aadi):` to
  confirm phrasing. Check "Stop" prefix logic: warning zone (< 6 ft) only.
- Layer transitions: 240 ms opacity, none under reduced motion.
- Keep the "simulated" caption that exists today ("Camera mount, widths and confidences
  are simulated…").

## Files

Modify: `app/figures/VisionScene.tsx`.

## Acceptance criteria

- [ ] `/datasheet/` VisionAssist figure unchanged.
- [ ] Beats reveal layers in the order above; nothing appears early.
- [ ] Beat 1 shows exactly one dashed "dropped" box.
- [ ] Beat 3 highlights exactly one object and it is the one with highest tier then shortest distance.
- [ ] Reduced motion: layers switch instantly.
- [ ] Build and lint pass.
