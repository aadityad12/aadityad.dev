// Writes a coarse elevation grid (metres, integers) for the direction mockups.
// Reuses the bay-map tile cache. Same bounds as figures/bay-map/build.mjs.
//
//   node lab/heightmap.mjs
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const here = dirname(fileURLToPath(import.meta.url));
const cacheDir = join(here, "../figures/bay-map/.cache");
const BOUNDS = { west: -123.3, east: -121.55, north: 38.0, south: 37.15 };
const ZOOM = 11;
const STEP = 4; // source pixels per output cell (256px tile -> 64 cells)

const lon2x = (lon) => ((lon + 180) / 360) * 2 ** ZOOM;
const lat2y = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** ZOOM;
};

const fx0 = lon2x(BOUNDS.west), fx1 = lon2x(BOUNDS.east);
const fy0 = lat2y(BOUNDS.north), fy1 = lat2y(BOUNDS.south);
const per = 256 / STEP;
const w = Math.round((fx1 - fx0) * per), h = Math.round((fy1 - fy0) * per);
const tiles = new Map();
async function px(tx, ty, i, j) {
  const key = `${tx}-${ty}`;
  if (!tiles.has(key)) tiles.set(key, PNG.sync.read(await readFile(join(cacheDir, `${ZOOM}-${tx}-${ty}.png`))));
  const p = tiles.get(key);
  const k = (j * 256 + i) * 4;
  return p.data[k] * 256 + p.data[k + 1] + p.data[k + 2] / 256 - 32768;
}

const values = [];
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let dy = 0; dy < STEP; dy++) for (let dx = 0; dx < STEP; dx++) {
      const gx = (fx0 + (x + (dx + 0.5) / STEP) / per) * 256, gy = (fy0 + (y + (dy + 0.5) / STEP) / per) * 256;
      const tx = Math.floor(gx / 256), ty = Math.floor(gy / 256);
      sum += await px(tx, ty, Math.floor(gx - tx * 256), Math.floor(gy - ty * 256));
    }
    values.push(Math.round(sum / STEP ** 2));
  }
}
// lon/lat -> grid cell, so mockups can place pins
const toCell = (lon, lat) => [+((lon2x(lon) - fx0) * per).toFixed(1), +((lat2y(lat) - fy0) * per).toFixed(1)];
const places = {
  sjsu: toCell(-121.8811, 37.3352),
  deanza: toCell(-122.0448, 37.3196),
  sunnyvale: toCell(-122.0363, 37.3688),
  scu: toCell(-121.9375, 37.3496),
  berkeley: toCell(-122.2585, 37.8719),
  home: toCell(-121.9552, 37.3541),
};
await writeFile(join(here, "heightmap.json"), JSON.stringify({ w, h, places, values }));
console.log(`heightmap ${w}x${h}`, places);
