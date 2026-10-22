# lab: the test area

Prototypes for the aadityad.dev redesign live here, outside the Next.js app. Nothing in `lab/` is built
or deployed: GitHub Pages only publishes the app's `out/` folder. Changes are tried here first and moved
into `app/` once they are agreed.

## Run it

```sh
python3 scripts/lab-server.py     # serves the repo root on :4173, with caching off
```

| Page | What it is |
|---|---|
| http://127.0.0.1:4173/lab/arena.html | The arena: the whole 3D Bay, full screen, for testing the map, landmarks and Pathfinder |
| http://127.0.0.1:4173/lab/site.html | The site mockup: an explorable Bay Area hero, followed by an uninterrupted project portfolio |
| http://127.0.0.1:4173/lab/specimens.html | Single landmarks on turntables, for modelling |

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

## Files

- `bay.js`: the map engine (`createBay(el, opts)`): terrain, landmarks, Caltrain, gulls, pins, Pathfinder.
  The arena and the site mockup both use it, so what you test in the arena is what the site shows.
- `landmarks3d.js`: one builder per landmark, modelled from reference photos.
- `whale-habitat.js`: shoreline-safe spawn sampling and irregular whale encounter scheduling.
- `ink3d.js`: the ink style: toon shading, hatching, boiling outlines, trees, birds, planes.
- `stamps.js`: postage stamps for the project postcards (a landmark still, or a ridgeline map of the place).
- `shared.js`: Pathfinder's paths, the heightmap loader, and the project pins.
- `heightmap.json`: elevation grid, written by `node lab/heightmap.mjs` from the cached terrain tiles.

## Screenshots

```sh
node scripts/shoot.mjs "http://127.0.0.1:4173/lab/site.html" lab/shots/site --scroll 0,1400 --settle 7000
```

`--frames n --every ms` captures a sequence; `--eval "<js>"` runs an expression first (for example, clicking
a pin). `lab/shots/` is not committed.
