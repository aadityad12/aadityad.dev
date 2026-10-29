# lab: the test area

Prototypes for aadityad.dev live here. The live site imports the shared modules from this folder
(`bay.js`, `stamps.js`, `project-reels.js` and the `*-artifact.js` panels) through
`app/components/site-interactions.js`, so the arena and the site run the same code. The HTML pages
in `lab/` are not deployed. Try changes here first.

## Run it

```sh
python3 scripts/lab-server.py     # serves the repo root on :4173, with caching off
```

| Page | What it is |
|---|---|
| http://127.0.0.1:4173/lab/arena.html | The arena: the whole 3D Bay, full screen, for testing the map, landmarks and Pathfinder |
| http://127.0.0.1:4173/lab/site.html | The site mockup: an explorable Bay Area hero, followed by an uninterrupted project portfolio |
| http://127.0.0.1:4173/lab/specimens.html | Single landmarks on turntables, for modelling |
| http://127.0.0.1:4173/lab/artifacts.html | GazeBoard predictive-spelling portrait, with letter-group selection and local word candidates |
| http://127.0.0.1:4173/lab/visionassist.html | VisionAssist passive portrait: the scene becomes one prioritized spoken warning |
| http://127.0.0.1:4173/lab/visionassist-directions.html | Three unapplied VisionAssist alternatives: attention field, physical object, and quiet warning episode |

Arena URL switches: `#sf #sj #eb #pen #sc #gg` open on a close-up; `?go=<pin id>` clicks that pin after
1.2 s (`?go=temper` rides the Caltrain); `?debug` marks where the bridges land.

## Hero-first experiment

The `experiment/map-hero-first` worktree keeps the map inside the hero. Click the scene or
**Explore the map** to open an optional full-screen explorer; ordinary scrolling never changes the camera.
Pins open artifact previews in a side panel (a bottom sheet on mobile). **View full project** closes
the map and focuses the corresponding article; **Back to site** or Escape restores the previous
scroll position and focus. Home has three project choices, and the SJSU pin previews experience.
The project index also provides keyboard-accessible alternatives to finding pins visually.
Below the hero, a compact
text index and closely spaced postcards replace the location boards and travel intervals. Stamps
are decorative rather than another navigation system. On small screens the map has its own space
below the introduction, not behind its links. The map sleeps offscreen and can be paused; reduced
motion starts it paused. Pausing freezes ambient animation without disabling exploration controls.
The hero and explorer reuse one map canvas; the explorer supports dragging and ordinary wheel zoom,
while the hero remains a click-to-expand preview that does not capture page scrolling.

Run this worktree with `python3 scripts/lab-server.py 4174`, then visit
http://127.0.0.1:4174/lab/site.html. The original `redesign-lab` checkout can keep running on 4173 for
comparison. This experiment does not modify the original checkout. Shared engine changes in this
worktree also apply to its arena, and
nothing here is published or committed automatically.

### Whale encounters

`whale-habitat.js` samples open-water positions in three Bay regions using the engine's actual
stretched terrain coordinates. A 64-unit water-clearance envelope covers the entire fixed-scale
animation, including movement and splash rings, with additional shoreline space. The whale no
longer receives camera-dependent landmark boosting, so zooming cannot reset its location or
enlarge it into shore. There is no unsafe spawn fallback when a region has insufficient water.
Encounters last 26 seconds, followed by a random 28–58 second quiet interval; the initial delay
is 8–18 seconds. Each encounter chooses a different region when available, and location changes
only happen while the whale is hidden. Scheduling uses active animation time, so pausing or
leaving the map offscreen does not skip forward into the middle of an encounter.

### Project artifacts: portrait study

The anatomical-eye study was too unsettling and understated the spelling capability. The
current portrait puts typography first: four curved letter groups surround an abstract gaze
focus, and the selected pattern resolves into candidate words. It starts with the example
T–Z / A–G / T–Z, yielding water, wet, and watch. Reset tries another pattern; undo reverses
the last group. The ambiguous prefix uses the first candidate's letters, not a claim that
the app knows exactly which individual letter was intended. No confidence scores,
sentence-context prediction, or language-model behavior are implied.

`gazeboard-words.js` copies the ordered 378-word asset from
https://github.com/aadityad12/GazeBoard/blob/main/app/src/main/assets/words.txt (reviewed October 24,
2026). `predictWords` mirrors its four-group prefix matching and presents the first three matches,
as the Android spelling interface does. This is an artistic interpretation, not an app replica
or a claim of target-device validation. Other projects retain their baseline artifacts,
including Accordion's actual recording.

Native targets support tapping and keyboard selection immediately, or a one-second pointer
dwell. Optional browser speech only runs after **Speak word**; the waveform follows speech
lifecycle events but is not an audio visualization. No camera, gaze model, or NPU is used.
Dwell and speech stop offscreen or when hidden. Reduced motion keeps the gaze cue and decorative
animation static without disabling selection. The map uses a compact instance of the portrait.

## Project reels

Cards with more than one good visual show them as a reel (`project-reels.js` / `.css`): the copy stays
fixed and only the picture changes. Each view advances after about seven seconds, but only while the
reel is on screen, the tab is visible, motion is allowed (the site's pause button and reduced motion
both stop it), and nobody is hovering or focused inside it. Choosing a view, swiping, or using the
arrow keys hands control to the visitor for the rest of the visit. Videos play only while their view
is showing. Single-visual cards stay static. The map preview shows a reel's first view.

The slide lists live in `REELS` in `site.html`:

- VisionAssist: the Attention and Quiet studies, the mount CAD from the Vision-Assist repo, the device photo.
  The passive room portrait is no longer used on the site.
- Rung: the README's `jit.gif` (real output), its speed-up chart, and the results table.
- Accordion: the demo video, and the context-map screenshot cropped to the map.
- ApexTracker: dashboard, study session, daily insights (the screen-time screenshot is left out).
- Echo: the alert, and the home feed.

Rung's numbers follow its README after the recursive JIT landed on Oct 19, 2026 (fib 38.84x,
loop_sum 22.38x, background JIT warmup p99 0.89 to 0.28 ms).

## Files

### VisionAssist portrait

The next study deliberately asks for less interaction: an illustrated indoor scene highlights
a chair while a farther person stays secondary. The warning is readable without waiting or
clicking. It follows the source's high-risk-first sorting and warning thresholds: an illustrative
five-foot estimate maps to two steps and produces “stop, chair, 2 steps ahead.” These numbers
are scenario values, not measured accuracy, live inference, or a safety claim. No camera,
speech synthesis, or model runs in this portrait. Subtle emphasis repeats on a ten-second loop,
stops offscreen or when hidden, and respects the existing pause/reduced-motion settings.
The real hardware photograph remains behind **See the real prototype** in the full project;
the map uses a compact portrait. GazeBoard's artifact and its dedicated study are unchanged.

The room and chair now use a consistent eye-level perspective. The construction-line floor
fan is removed; the floor stays quiet, with contact shadows grounding the chair, standing
figure, and plant. The plant's pot and shadow are fully inside the floor boundary. Chair
geometry determines its detection frame, so the brackets stay tied to the actual object.

### Prototype files

The VisionAssist room remains the site placeholder. `visionassist-directions.html` is a separate
art-direction comparison, not a new selected design. Its three passive studies test prioritization,
the real DIY hardware as an illustrated object, and restraint over time. The hardware study is
based on `public/projects/visionassist-device.jpg`, not a newly invented wearable enclosure.
The quiet study shows an illustrative safe → warning → safe episode, not a recorded inference
or speech trace. It does not imply the actual three-second warning cooldown is a one-shot event.
No alternative is integrated into the map or project cards. The studies respect reduced motion,
have one shared pause control outside the artifacts, and stop their decorative motion offscreen.

- `bay.js`: the map engine (`createBay(el, opts)`): terrain, landmarks, Caltrain, gulls, pins, Pathfinder.
  The arena and the site mockup both use it, so what you test in the arena is what the site shows.
- `landmarks3d.js`: one builder per landmark, modelled from reference photos.
- `whale-habitat.js`: shoreline-safe spawn sampling and irregular whale encounter scheduling.
- `ink3d.js`: the ink style: toon shading, hatching, boiling outlines, trees, birds, planes.
- `stamps.js`: postage stamps for the project postcards (a landmark still, or a ridgeline map of the place).
- `project-reels.js` / `project-reels.css`: rotating views inside one project card.
- `project-artifacts.js` / `project-artifacts.css`: the GazeBoard gaze-to-voice portrait and its interaction lifecycle.
- `gazeboard-words.js`: the app's ordered spelling dictionary, used for local candidate matching.
- `visionassist-artifact.js` / `visionassist-artifact.css`: the passive priority-warning portrait and its motion lifecycle.
- `visionassist-directions.html` / `.js` / `.css`: independent alternative-art-direction studies; leave the main placeholder intact.
- `visionassist.html`: focused review page for the quieter VisionAssist study.
- `alta-artifact.js` / `.css`, `alta.html`: Alta's probe-to-voice story (breadboard, pod serial stream, spoken hint).
- `artifacts.html`: focused review page for the portrait direction.
- `shared.js`: Pathfinder's paths, the heightmap loader, and the project pins.
- `heightmap.json`: elevation grid, written by `node lab/heightmap.mjs` from the cached terrain tiles.

## Screenshots

```sh
node scripts/shoot.mjs "http://127.0.0.1:4173/lab/site.html" lab/shots/site --scroll 0,1400 --settle 7000
```

`--frames n --every ms` captures a sequence; `--eval "<js>"` runs an expression first (for example, clicking
a pin). `lab/shots/` is not committed.
