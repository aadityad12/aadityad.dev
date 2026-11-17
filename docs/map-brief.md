# Hero map backdrop: working brief

Running notes for the large Bay Area map behind the hero. Read this first in a new session.

## Direction

- Inspired by afig.dev's Bay Area backdrop, but clearly our own. afig.dev is an isometric, landmark-heavy
  illustration; ours is a **topographic contour map** (elevation lines, shoreline, quiet ocean). Never
  copy afig.dev's code, data, or assets.
- Readability comes first. The copy sits over open Pacific, with a paper-coloured glow behind it.
- The mascot, **Pathfinder**, stays on the page and should feel at home on the map (see open questions).

## What exists (spike, Oct 20 2026)

- `figures/bay-map/build.mjs`: a deterministic build. It reads AWS Terrain Tiles (terrarium PNG, public,
  no key, includes bathymetry), stitches zoom-11 tiles, contours them with `d3-contour`, and writes
  `public/maps/bay-contours.svg`. Tiles are cached in `figures/bay-map/.cache/` (gitignored). No GDAL is
  needed.
- `figures/bay-map/preview.html`: a standalone mock of the hero over the map. Open it with
  `--allow-file-access-from-files`, or serve the repo root.
- Findings:
  - The Bay is about -2 m and salt ponds read a few metres above zero, so the shoreline threshold is
    2.5 m.
  - Deep-ocean tiles are flat no-data and draw tile-shaped boxes, so offshore bathymetry is skipped.
  - The contours close along the grid edge, so the viewBox is inset by 3 px.

## Budgets (not met yet)

| | now | target |
|---|---|---|
| SVG size | 1058 KB raw / 270 KB gzip | ≤ 150 KB gzip |
| First paint | not wired in | map loads after the hero text, never blocks it |
| Text contrast | glow behind copy | WCAG AA for every hero line, checked with screenshots |
| Motion | none | none by default; anything animated pauses offscreen and respects reduced motion |
| Mobile | `slice` crop shows the Bay centre | own crop, checked at 390 px wide |

## Next steps

1. Simplify the lines (Visvalingam, or mapshaper as a dev dependency) to hit the size budget.
2. Wire the map in as a `HeroBackdrop` component: `aria-hidden`, loaded after first paint, behind
   `.hero` only.
3. Decide what goes on the map (open questions below), then add it as a separate layer.
4. Screenshot loop at 1440, 1024, and 390 px wide after every change.

## Open questions for Aadi

- **Places:** should the map mark the places the work happened? For example SJSU, De Anza and Infineon
  in Cupertino, Qualcomm Sunnyvale (GazeBoard), Santa Clara University (Echo), and UC Berkeley
  (Accordion). Each marker could link to its card.
- **Pathfinder:** should it walk a route between those places as the page scrolls, or sit at
  "you are here" (Santa Clara)?
- **Palette:** keep the current paper and orange, or tune the map colours separately?
