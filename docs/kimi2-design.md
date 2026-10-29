# Kimi2: the preliminary datasheet

A standalone portfolio direction on branch `Kimi2`. The deployed site still targets `main`.

## Concept

Every project in this portfolio exists because of a hard constraint — no network, a
200 ms frame budget on a Pi 5 CPU, an 8 ms NPU inference target, a 100K-token context
window, a 60-second surge window. The document that native speakers of that language
write is a **datasheet**. So the site is one: part number AD-2027, Rev A, marked
PRELIMINARY (he is a student; specifications subject to change), with features,
operating constraints, application notes, errata, ordering information, and a
revision history.

The mapping is honest, which is what makes it work:

- **Features** → the bullet list a recruiter scans in the first 15 seconds.
- **Operating constraints** → the through-line of the whole portfolio, as a spec table.
- **Application notes (§3)** → the four headline projects, each with a *live* figure.
- **Errata (§4)** → documented limitations. The master reference calls these an asset;
  datasheets have had errata sections forever. This is the section no other portfolio has.
- **Ordering information (§7)** → availability, MOQ 1, lead time < 24 h.

## Live figures

All four run locally in the browser, no network, no dependencies beyond React. All are
labeled as simulations or recordings. All content is visible without JavaScript; motion
is additive only; `prefers-reduced-motion` disables the flourishes.

- **Fig. 1 — Accordion:** fold/restore token blocks against a 100K gauge, then flip to
  naive-compaction mode to watch the same context get deleted instead. Benchmark table
  alongside (5/6 vs 2/6 at 100K, DeepSeek V4 Pro). The shipped demo video sits below.
- **Fig. 2 — GazeBoard:** pointer-as-gaze with the real interaction parameters: EMA
  smoothing (α=0.18), 1000 ms dwell, 500 ms cooldown. Tiles are buttons, so click and
  keyboard work too.
- **Fig. 3 — Clear Dispatch:** a live synthetic-traffic console. Calls spawn, the
  sliding-window monitor flips ASSISTED/SURGE, units route nearest-first, and structure
  fires raise HOLD_REQUIRED — the visitor approves or denies the air tanker. Pauses
  when offscreen or when the tab hides.
- **Fig. 4 — VisionAssist:** the frame loop, slowed to 900 ms so a human can follow,
  with the true 200 ms inference budget drawn per frame, tier-ranked detections, and
  the one-event-per-frame TTS output in steps, not feet.

## Voice and claims

Copy follows the master reference (REPO/STATED/CONFLICT discipline):

- GazeBoard: no "478-point face mesh" — that claim is permanently barred. The 8 ms /
  15+ FPS figure is presented as a dated first-hand observation and footnoted as such.
- Accordion: contribution scoped to the hackathon pipeline; the team's later
  conductors are acknowledged. The 5/6 result carries its "signal, not guarantee"
  caveat in §4.
- Temper: the barred fixture numbers (31→79 etc.) do not appear; the deterministic
  offline evaluate→patch→re-evaluate loop is the claim.
- VisionAssist: role worded "research intern & technical lead," matching LinkedIn.

## Visual system

Desk + sheet + crop marks. IBM Plex Sans / Plex Sans Condensed / Plex Mono. One
redline accent (#d92b1c) used only for emphasis and markup. Demos live in dark
"instrument" panels so the document stays a document. Signature artifacts: QUALIFIED
stamp, barcode, an animated FIG. 0 timing diagram, and a revision-history footer.

## References (principles, not layouts)

Rauno Freiberg (interaction as evidence), Emil Kowalski (restraint), and the classic
TI/Infineon datasheet format itself.
