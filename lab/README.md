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
| http://127.0.0.1:4173/lab/site.html | The site mockup: the map stays behind the page; scrolling through the project postcards sends Pathfinder to each place |
| http://127.0.0.1:4173/lab/specimens.html | Single landmarks on turntables, for modelling |

Arena URL switches: `#sf #sj #eb #pen #sc #gg` open on a close-up; `?go=<pin id>` clicks that pin after
1.2 s (`?go=temper` rides the Caltrain); `?debug` marks where the bridges land.

## Files

- `bay.js`: the map engine (`createBay(el, opts)`): terrain, landmarks, Caltrain, gulls, pins, Pathfinder.
  The arena and the site mockup both use it, so what you test in the arena is what the site shows.
- `landmarks3d.js`: one builder per landmark, modelled from reference photos.
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
