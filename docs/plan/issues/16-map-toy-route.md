# 16 · `/map/`: the Bay Area map as an optional toy

**Phase**: E (optional) · **Size**: L · **Depends on**: 13, 14 · **Do last before 17**

## Goal

Keep the thing Aadi loves without paying for it on every visit. The three.js Bay Area
map from `Opus-Map` becomes its own route. three.js and the heightmap load only there.
The footer on `/` links to it with the Pathfinder robot.

## Source material (all on branch `Opus-Map`; read with `git show Opus-Map:<path>`)

- `lab/bay.js` (38 KB), `lab/ink3d.js`, `lab/landmarks3d.js` (82 KB), `lab/stamps.js`,
  `lab/shared.js` (`PINS`, `PATHFINDER` path data), `lab/heightmap.json` (892 KB),
  `lab/whale-habitat.js`.
- `app/components/site-interactions.js` lines ~300 to 370: how the map is created
  (`createBay`), the explorer dialog, and the pause button.
- `app/page.tsx` on that branch: the `#map`, `.map-caption`, `#map-explorer` dialog markup.
- `app/globals.css` on that branch: `.hero-scene`, `.map-*`, `.explorer-*`, `.pathfinder` rules.
- `package.json` on that branch: `three ^0.170.0`, `d3-contour ^4.0.2` (dev; used to
  build the heightmap, probably not needed at runtime; check `heightmap.mjs`).

## Spec

1. Add `three` as a dependency (the version from `Opus-Map`). Nothing else.
2. Create `lab/` in this branch with only the files the map needs at runtime (`bay.js`,
   `ink3d.js`, `landmarks3d.js`, `stamps.js`, `shared.js`, `heightmap.json`,
   `whale-habitat.js` if `bay.js` imports it). Add `"@/*": ["./*"]` to `tsconfig.json`
   paths if not already there (Opus-Map used `@/lab/...`).
3. `app/map/page.tsx` (server): masthead (brief variant with a crumb "Map"), `<h1>Where
   I've built things.</h1>`, one paragraph: "Every pin is a project. Pick one, or let
   Pathfinder show you around. Built from real elevation data, drawn as ink ridgelines.",
   then `<MapStage />`, then a plain `<ul>` of the pins as links to `/work/<slug>/` (the
   no-JS and screen-reader equivalent), then a "Back to the front page" link.
4. `app/components/map/MapStage.tsx` (client): on mount, `await import("@/lab/bay.js")`
   and create the map into a `<div id="map">`; show "Drawing the Bay…" (mono, `--muted`)
   until the first frame; show a Pause button (respect reduced motion: start paused).
   Port only the full-screen explorer if it ports cleanly in under a day; otherwise ship
   the hero-size map alone and open an issue for the explorer.
5. Pin click → `location.href = "/work/<slug>/"`. Pin hover → the project title in a
   caption under the map.
6. Footer link on `/` (issue 05 left a slot): `<a href="/map/" className="pf-link">` with
   the Pathfinder SVG (`PATHFINDER` from `lab/shared.js`, inline, 48 px) and the text
   "The map ↗". Also add `/map/` to the sitemap (issue 15).
7. `scripts/check-budget.mjs`: `/map/` is exempt from the JS budget but every other route
   must still fail if it references `three` or `heightmap` (issue 14 already does this).

## Files

Create: `app/map/page.tsx`, `app/components/map/MapStage.tsx`, `lab/*` (runtime files only).
Modify: `package.json`, `tsconfig.json`, `app/components/brief/Contact.tsx` (footer link),
`app/sitemap.ts`, `app/globals.css`.

## Acceptance criteria

- [ ] `npm run budget` still passes for `/`, `/work/rung/`, `/datasheet/`; none of their HTML references a chunk containing three.js or `heightmap`.
- [ ] `/map/` renders the map; clicking the Rung pin navigates to `/work/rung/`.
- [ ] With JavaScript disabled, `/map/` shows the heading, paragraph and the list of pins.
- [ ] With reduced motion, the map starts paused.
- [ ] The footer of `/` shows Pathfinder and "The map ↗".
- [ ] Build and lint pass.
