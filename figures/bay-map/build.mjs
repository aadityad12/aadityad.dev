// Builds the hero backdrop: a topographic contour map of the South Bay.
// Source: AWS Terrain Tiles (terrarium encoding, public, includes bathymetry).
// Output: public/maps/bay-contours.svg. Deterministic for a given tile cache.
//
//   node figures/bay-map/build.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import { contours } from "d3-contour";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const cacheDir = join(here, ".cache");
const outFile = join(root, "public/maps/bay-contours.svg");

// view: open Pacific on the left (calm area behind the hero copy), the Bay
// and the Diablo Range on the right
const BOUNDS = { west: -123.3, east: -121.55, north: 38.0, south: 37.15 };
const ZOOM = 11;
const DOWNSAMPLE = 2; // 256px tiles -> 128 samples per tile
const LAND_STEP = 100; // metres between contour lines on land
const INDEX_EVERY = 500; // heavier line every N metres
// the Bay is very shallow (-2 m mid-channel) and salt ponds and marsh read a
// few metres above zero; flat 0 also marks no-data ocean. Treat <= SHORE as water.
const SHORE = 2.5;
// offshore bathymetry is skipped: deep-ocean tiles are flat no-data and draw
// tile-shaped boxes, and the ocean behind the copy should stay quiet

const lon2x = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};

async function tile(z, x, y) {
  const file = join(cacheDir, `${z}-${x}-${y}.png`);
  if (!existsSync(file)) {
    const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`);
    if (!res.ok) throw new Error(`tile ${z}/${x}/${y}: ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return PNG.sync.read(await readFile(file));
}

async function main() {
  await mkdir(cacheDir, { recursive: true });
  await mkdir(dirname(outFile), { recursive: true });

  // fractional tile coords of the view, then the whole tiles covering it
  const fx0 = lon2x(BOUNDS.west, ZOOM), fx1 = lon2x(BOUNDS.east, ZOOM);
  const fy0 = lat2y(BOUNDS.north, ZOOM), fy1 = lat2y(BOUNDS.south, ZOOM);
  const tx0 = Math.floor(fx0), tx1 = Math.floor(fx1);
  const ty0 = Math.floor(fy0), ty1 = Math.floor(fy1);

  const per = 256 / DOWNSAMPLE;
  const gw = (tx1 - tx0 + 1) * per, gh = (ty1 - ty0 + 1) * per;
  const grid = new Float64Array(gw * gh);

  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      const png = await tile(ZOOM, tx, ty);
      for (let j = 0; j < per; j++) {
        for (let i = 0; i < per; i++) {
          // average a DOWNSAMPLE x DOWNSAMPLE block to smooth tile noise
          let sum = 0;
          for (let dj = 0; dj < DOWNSAMPLE; dj++) {
            for (let di = 0; di < DOWNSAMPLE; di++) {
              const k = ((j * DOWNSAMPLE + dj) * 256 + i * DOWNSAMPLE + di) * 4;
              sum += png.data[k] * 256 + png.data[k + 1] + png.data[k + 2] / 256 - 32768;
            }
          }
          const gx = (tx - tx0) * per + i, gy = (ty - ty0) * per + j;
          grid[gy * gw + gx] = sum / DOWNSAMPLE ** 2;
        }
      }
    }
  }

  // crop the grid to the requested bounds
  const cx = Math.round((fx0 - tx0) * per), cy = Math.round((fy0 - ty0) * per);
  const w = Math.round((fx1 - fx0) * per), h = Math.round((fy1 - fy0) * per);
  const values = new Float64Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) values[y * w + x] = grid[(y + cy) * gw + x + cx];

  const max = values.reduce((m, v) => Math.max(m, v), -Infinity);
  const landLevels = [];
  for (let t = LAND_STEP; t < max; t += LAND_STEP) landLevels.push(t);

  const gen = contours().size([w, h]).smooth(true);
  const fmt = (n) => Math.round(n);
  const toPath = (geom) =>
    geom.coordinates
      .flatMap((poly) =>
        poly.map((ring) => {
          // integer coords at hero scale; drop points that round onto the previous one
          const pts = [];
          for (const [x, y] of ring) {
            const p = `${fmt(x)} ${fmt(y)}`;
            if (p !== pts[pts.length - 1]) pts.push(p);
          }
          return "M" + pts.join("L") + "Z";
        }),
      )
      .join("");
  // drop specks: rings with fewer points than this are noise at hero scale
  const prune = (geom, minPts) => ({
    ...geom,
    coordinates: geom.coordinates
      .map((poly) => poly.filter((ring) => ring.length >= minPts))
      .filter((poly) => poly.length),
  });

  const shore = prune(gen.contour(values, SHORE), 16);
  const land = landLevels.map((t) => ({ t, g: prune(gen.contour(values, t), 14) }));

  const parts = [];
  // inset the viewBox: contours close along the grid edge, which would draw a frame
  const pad = 3;
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${pad} ${pad} ${w - 2 * pad} ${h - 2 * pad}" preserveAspectRatio="xMidYMid slice">`);
  parts.push(`<path class="land" d="${toPath(shore)}"/>`);
  for (const { t, g } of land) {
    const d = toPath(g);
    if (d) parts.push(`<path class="${t % INDEX_EVERY === 0 ? "c ci" : "c"}" data-m="${t}" d="${d}"/>`);
  }
  parts.push(`<path class="shore" d="${toPath(shore)}"/>`);
  parts.push("</svg>");
  const svg = parts.join("\n");
  await writeFile(outFile, svg);
  console.log(`grid ${w}x${h}, max ${Math.round(max)} m, ${landLevels.length} land levels, ${(svg.length / 1024).toFixed(0)} KB -> ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
