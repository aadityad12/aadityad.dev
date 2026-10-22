// The Bay in 3D: ridgeline terrain, ink landmarks, the Caltrain, gulls and Pathfinder.
// One module drives both the arena (lab/arena.html) and the site mockup (lab/site.html),
// so whatever is tested in the arena is what the site shows.
//
//   const bay = await createBay(el, { pins, onPin, wheel: "modifier", touch: "page", insetLeft: 420 });
import { THREE, boil, setInkWidth, bird, setBirds } from "./ink3d.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { goldenGate, ferryBuilding, campanile, towerHall, salesforce, sanJose, bayBridge, haywardBridge, sfo, sjc, stanford, alcatraz, hangarOne, oaklandPort, humpback } from "./landmarks3d.js";
import { PATHFINDER, heightmap } from "./shared.js";

const CSS = `
.bay{overflow:hidden}
.bay>canvas{display:block;position:absolute;inset:0;width:100%;height:100%;cursor:grab}
.bay>canvas:active{cursor:grabbing}
.bay-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.bay-pin{position:absolute;transform:translate(-50%,-100%);pointer-events:auto;padding:4px;cursor:pointer;display:block}
.bay-pin svg{display:block;transition:transform .2s;transform-origin:50% 100%;animation:baypinbob 2.4s ease-in-out infinite}
.bay-pin:hover svg,.bay-pin:focus-visible svg{transform:scale(1.25)}
@keyframes baypinbob{50%{translate:0 -2px}}
.bay-pin .lab{position:absolute;bottom:100%;left:50%;transform:translate(-50%,4px);width:max-content;background:#211946;color:#EEECF7;padding:3px 9px 4px;border-radius:7px;line-height:1.25;opacity:0;pointer-events:none;transition:opacity .18s,transform .18s}
.bay-pin:hover .lab,.bay-pin:focus-visible .lab,.bay-pin.on .lab{opacity:1;transform:translate(-50%,-2px)}
.bay-pin .lab b{display:block;font:500 11px "DM Mono",monospace;letter-spacing:.07em;text-transform:uppercase}
.bay-pin .lab span{display:block;font:500 12.5px Manrope,sans-serif;color:#CFC9EC}
.bay-pin .lab i{display:block;font:500 10.5px "DM Mono",monospace;letter-spacing:.07em;text-transform:uppercase;font-style:normal;color:#FF8A7B;margin-top:2px}
.bay-lm{position:absolute;transform:translate(-50%,-100%);font:500 10.5px "DM Mono",monospace;letter-spacing:.07em;text-transform:uppercase;white-space:nowrap;background:#EEECF7;border:1px solid #C9C3E6;color:#211946;padding:1px 6px;border-radius:4px;opacity:0;transition:opacity .25s}
.bay-lm.on{opacity:1}
.bay-pf{position:absolute;transform:translate(-50%,-100%);pointer-events:auto;cursor:pointer}
.bay-pf svg{display:block;overflow:visible}
.bay-hint{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(33,25,70,.82);color:#EEECF7;font:500 14px Manrope,sans-serif;padding:9px 16px;border-radius:999px;opacity:0;transition:opacity .3s;pointer-events:none;white-space:nowrap}
.bay-hint.on{opacity:1}
`;

const BG = "#EEECF7", INK = new THREE.Color("#211946"), PAPER = new THREE.Color(BG), WATER = new THREE.Color("#D6D1EE"), WLINE = new THREE.Color("#C2BBE3");
const pinSVG = `<svg width="16" height="21" viewBox="0 0 15 20" aria-hidden="true"><path d="M7.5 19 C5 14 1 11 1 7 A6.5 6.5 0 0 1 14 7 C14 11 10 14 7.5 19 Z" fill="#FF5A47" stroke="#211946" stroke-width="1.4"/><circle cx="7.5" cy="7" r="2.3" fill="#F7F5FC"/></svg>`;

export async function createBay(el, opts = {}) {
  const { pins: PIN_DEFS = [], onPin = null, wheel = "always", touch = "map", labels = true, debug = false, insetLeft = 0, offsetY = 0, fit = 0.53, pinCta = "" } = opts;
  if (!document.getElementById("bay-css")) { const s = document.createElement("style"); s.id = "bay-css"; s.textContent = CSS; document.head.appendChild(s); }
  el.classList.add("bay"); if (getComputedStyle(el).position === "static") el.style.position = "relative";
  const hm = await heightmap();

  // ---------- the grid and the tourist-map stretch ----------
  const H0 = Float32Array.from(hm.values, (v) => Math.max(0, v)), HB = new Float32Array(H0.length);
  for (let y = 0; y < hm.h; y++) for (let x = 0; x < hm.w; x++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < hm.w && yy < hm.h) { s += H0[yy * hm.w + xx]; n++; } }
    HB[y * hm.w + x] = H0[y * hm.w + x] < 1 ? 0 : s / n;
  }
  // signed depth, lightly blurred, decides land and water; the shore no longer drowns
  const SG = new Float32Array(H0.length);
  for (let y = 0; y < hm.h; y++) for (let x = 0; x < hm.w; x++) {
    let s = 0, n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < hm.w && yy < hm.h) { s += Math.max(-6, Math.min(6, hm.values[yy * hm.w + xx])); n++; } }
    SG[y * hm.w + x] = s / n;
  }
  const waterCell = (x, y) => {
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, g = (a, b) => SG[b * hm.w + a] ?? 0;
    return (g(x0, y0) * (1 - fx) + g(x0 + 1, y0) * fx) * (1 - fy) + (g(x0, y0 + 1) * (1 - fx) + g(x0 + 1, y0 + 1) * fx) * fy < 0.4;
  };
  const elevCell = (x, y) => {
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, at = (a, b) => HB[b * hm.w + a] || 0;
    return (at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx) * (1 - fy) + (at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx) * fy;
  };
  const Z = 2 ** 11, PER = 64;
  const lon2x = (lon) => ((lon + 180) / 360) * Z;
  const lat2y = (lat) => { const r = (lat * Math.PI) / 180; return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * Z; };
  const cell = (lon, lat) => [(lon2x(lon) - lon2x(-123.3)) * PER, (lat2y(lat) - lat2y(38.0)) * PER];
  const XK = [[268, 0], [282, 0.03], [364, 0.47], [402, 0.55], [450, 0.64], [528, 0.88], [637, 1]];
  const YK = [[30, 0], [70, 0.1], [126, 0.43], [200, 0.56], [255, 0.66], [342, 1]];
  const lerpK = (K, v, a = 0, b = 1) => { for (let i = 1; i < K.length; i++) if (v <= K[i][a] || i === K.length - 1) { const [p, q] = [K[i - 1], K[i]]; return p[b] + ((q[b] - p[b]) * (v - p[a])) / (q[a] - p[a]); } };
  const WX = 1700, WZ = 1050, EX = 0.13;
  const toWorld = (cx, cy) => new THREE.Vector3((lerpK(XK, cx) - 0.5) * WX, elevCell(cx, cy) * EX, (lerpK(YK, cy) - 0.5) * WZ);
  const at = (lon, lat) => toWorld(...cell(lon, lat));
  const isWater = (lon, lat) => waterCell(...cell(lon, lat));
  const toCellW = (x, z) => [lerpK(XK, x / WX + 0.5, 1, 0), lerpK(YK, z / WZ + 0.5, 1, 0)];
  const groundAt = (x, z) => { const c = toCellW(x, z); return waterCell(...c) ? 0 : elevCell(...c) * EX; };
  const onLand = (x, z) => !waterCell(...toCellW(x, z));

  // ---------- renderer, camera, light ----------
  const size = { w: el.clientWidth || 1, h: el.clientHeight || 1 };
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setClearColor(BG);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(renderer.domElement);
  const layer = document.createElement("div"); layer.className = "bay-layer"; el.appendChild(layer);
  const scene = new THREE.Scene(); scene.fog = new THREE.Fog(BG, 2300, 4600);
  const cam = new THREE.PerspectiveCamera(30, 1, 5, 6000);
  scene.add(new THREE.AmbientLight("#FFFFFF", 0.42 * Math.PI));
  const sun = new THREE.DirectionalLight("#FFFFFF", 0.62 * Math.PI);
  sun.position.set(-700, 900, 420); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0008;
  Object.assign(sun.shadow.camera, { left: -950, right: 950, top: 700, bottom: -700, near: 10, far: 3000 }); sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target);

  // ---------- ridgelines: rows of line over a curtain that hides what is behind ----------
  let terrainLine;
  {
    const ROWS = 270, COLS = 960, pos = [], col = [], cpos = [], ccol = [], idx = [];
    const sm = (a, b, v) => { const k = Math.min(1, Math.max(0, (v - a) / (b - a))); return k * k * (3 - 2 * k); };
    for (let r = 0; r <= ROWS; r++) {
      const t = r / ROWS, cy = lerpK(YK, t, 1, 0), z = (t - 0.5) * WZ, fade = 0.45 + 0.55 * t;
      let prev = null;
      for (let c = 0; c <= COLS; c++) {
        const u = c / COLS, cx = lerpK(XK, u, 1, 0), h = elevCell(cx, cy), x = (u - 0.5) * WX, water = waterCell(cx, cy), y = water ? 0 : h * EX;
        const edge = sm(0, 0.1, u) * sm(1, 0.92, u) * sm(1, 0.94, t) * sm(0, 0.04, t);
        const lc = (water ? WLINE : INK.clone().lerp(PAPER, 1 - fade)).clone().lerp(PAPER, 1 - edge), cc = (water ? WATER : PAPER).clone().lerp(PAPER, 1 - edge);
        const base = cpos.length / 3;
        cpos.push(x, y, z, x, -260, z); ccol.push(cc.r, cc.g, cc.b, cc.r, cc.g, cc.b);
        if (c > 0) { idx.push(base - 2, base - 1, base, base - 1, base + 1, base); if (!(water && c % 3 === 1)) { pos.push(prev[0], prev[1], z, x, y, z); col.push(lc.r, lc.g, lc.b, lc.r, lc.g, lc.b); } }
        prev = [x, y];
      }
    }
    const cg = new THREE.BufferGeometry(); cg.setAttribute("position", new THREE.Float32BufferAttribute(cpos, 3)); cg.setAttribute("color", new THREE.Float32BufferAttribute(ccol, 3)); cg.setIndex(idx);
    scene.add(new THREE.Mesh(cg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })));
    const lg = new LineSegmentsGeometry(); lg.setPositions(pos); lg.setColors(col);
    terrainLine = new LineMaterial({ vertexColors: true, linewidth: 1.1, fog: true });
    scene.add(new LineSegments2(lg, terrainLine));
  }

  // ---------- landmarks ----------
  const ground = (root) => root.traverse((o) => {
    for (let q = o; q; q = q.parent) if (q.userData.keep) return;
    if (o.isMesh && o.geometry.type === "BoxGeometry" && o.geometry.parameters.width >= 300 && o.geometry.parameters.height <= 1) o.visible = false;
    if (o.isMesh && o.geometry.type === "BoxGeometry" && o.geometry.parameters.depth >= 150 && o.geometry.parameters.height <= 4) o.visible = false;
    if (o.isMesh && o.userData.headland) o.visible = false;
    if (o.isMesh && o.userData.hill) o.material = o.material.clone(), o.material.color.set("#E7E4F2");
    if (o.isLineSegments && !o.isLineSegments2) { o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox; if (b.max.x - b.min.x > 350 && b.max.y - b.min.y < 1) o.visible = false; }
  });
  const LMS = [], LM = {};
  const add = (key, name, lm) => { scene.add(lm.root); const e = { key, name, ...lm }; LMS.push(e); LM[key] = e; return e; };
  setBirds(false);
  // boost: how much bigger a landmark draws when the camera is far out, like a tourist map;
  // up close it shrinks back to its true size
  function place(key, name, build, lon, lat, { scale, rot = 0, water = false, lift = 0, boost = 1, spread = null }) {
    const lm = build(); ground(lm.root);
    const p = at(lon, lat); if (water) p.y = 0;
    lm.root.position.set(p.x, p.y + lift, p.z); lm.root.rotation.y = rot; lm.root.scale.setScalar(scale);
    const e = add(key, name, lm); e.boost = boost; e.spread = spread; return e;
  }
  // a bridge stretched between two real end points; x0/x1 are the model's ends
  function span(key, name, build, A, B, x0, x1) {
    const lm = build(), a = at(...A), b = at(...B); a.y = b.y = 0; ground(lm.root);
    const len = a.distanceTo(b), s = len / (x1 - x0), th = Math.atan2(-(b.z - a.z), b.x - a.x);
    lm.root.scale.set(s, Math.min(s, 0.36), Math.min(s, 0.36)); lm.root.rotation.y = th;
    const mid = a.clone().add(b).multiplyScalar(0.5), off = new THREE.Vector3(((x0 + x1) / 2) * s, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), th);
    lm.root.position.copy(mid.sub(off)); return add(key, name, lm);
  }
  // a bridge end that lands in water walks outward along the bridge until it reaches the shore
  const landEnd = (E, O) => { for (let f = 0.5; f < 2.5; f += 0.005) { const p = [O[0] + (E[0] - O[0]) * f, O[1] + (E[1] - O[1]) * f]; if (!isWater(...p)) return [O[0] + (E[0] - O[0]) * (f + 0.02), O[1] + (E[1] - O[1]) * (f + 0.02)]; } return E; };
  const bridge = (key, name, build, A, B, x0, x1) => {
    const a = landEnd(A, B), b = landEnd(B, A);
    if (debug) for (const e of [a, b]) { const m = new THREE.Mesh(new THREE.SphereGeometry(4), new THREE.MeshBasicMaterial({ color: "red" })); m.position.copy(at(...e)).setY(6); scene.add(m); }
    return span(key, name, build, a, b, x0, x1);
  };
  // models whose long axis follows a real bearing (runways); +x points from A to B
  const along2 = (key, name, build, A, B, scale, o = {}) => {
    const a = at(...A), b = at(...B), rot = Math.atan2(-(b.z - a.z), b.x - a.x);
    return place(key, name, build, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2, { scale, rot, ...o });
  };
  // the Golden Gate runs north-south, which the map's south-facing camera only sees end-on,
  // so it crosses the strait on a diagonal; both ends still land on the real headlands
  {
    const c = at(-122.4783, 37.8199), th = 0.3, dir = new THREE.Vector3(Math.sin(th), 0, -Math.cos(th));
    const shore = (sgn) => { for (let d = 4; d < 110; d += 0.5) { const w = c.clone().addScaledVector(dir, sgn * d); if (!waterCell(...toCellW(w.x, w.z))) return w.addScaledVector(dir, sgn * 2); } return c.clone().addScaledVector(dir, sgn * 110); };
    const a = shore(-1), b = shore(1), lm = goldenGate({ headlands: false }); ground(lm.root); a.y = b.y = 0;
    const len = a.distanceTo(b), sc = len / 252, ang = Math.atan2(-(b.z - a.z), b.x - a.x);
    lm.root.scale.set(sc, 0.22, 0.22); lm.root.rotation.y = ang;
    lm.root.position.copy(a.clone().add(b).multiplyScalar(0.5)); add("goldenGate", "Golden Gate Bridge", lm);
  }
  bridge("bayBridge", "Bay Bridge", bayBridge, [-122.3890, 37.7870], [-122.3030, 37.8240], -244, 276);
  bridge("hayward", "San Mateo–Hayward Bridge", haywardBridge, [-122.16, 37.610], [-122.225, 37.592], -294, 250);
  place("ferryBuilding", "Ferry Building", ferryBuilding, -122.3937, 37.7955, { scale: 0.16, water: true, rot: -0.3, boost: 2.3 });
  place("salesforce", "Salesforce Tower", salesforce, -122.4035, 37.7880, { scale: 0.17, boost: 1.9 });
  setBirds(true); // the Campanile keeps its bell birds
  place("campanile", "Sather Tower, UC Berkeley", campanile, -122.2578, 37.8721, { scale: 0.3, boost: 2 });
  setBirds(false);
  place("sanJose", "Downtown San José · City Hall", () => sanJose({ jets: false }), -121.901, 37.3445, { scale: 0.14, rot: 0.1, boost: 1.6, spread: [-4, -12] });
  along2("sfo", "SFO · San Francisco International", sfo, [-122.393, 37.6135], [-122.358, 37.6225], 0.16, { boost: 1.4 });
  along2("sjc", "SJC · San José Mineta International", sjc, [-121.9445, 37.3735], [-121.9135, 37.3505], 0.12, { boost: 1.35, spread: [-34, -14] });
  place("stanford", "Stanford · Hoover Tower and Memorial Church", stanford, -122.1697, 37.4275, { scale: 0.17, boost: 2 });
  place("alcatraz", "Alcatraz", alcatraz, -122.4229, 37.8267, { scale: 0.17, water: true, boost: 1.8 });
  along2("hangarOne", "Hangar One · Moffett Field", hangarOne, [-122.0575, 37.4245], [-122.0435, 37.4095], 0.16, { boost: 1.6 });
  place("towerHall", "Tower Hall, SJSU", towerHall, -121.8815, 37.3352, { scale: 0.21, boost: 2.3, spread: [26, 16] });
  // the Outer Harbor wharf faces west; the booms reach out over the water
  along2("port", "Port of Oakland", oaklandPort, [-122.3215, 37.8125], [-122.3085, 37.7985], 0.26, { water: true, boost: 1.9 });
  // a humpback in the open Bay, surfacing somewhere new each cycle
  const whale = place("whale", "Humpback whale", humpback, -122.32, 37.735, { scale: 2, water: true, boost: 2.2 });
  whale.noLabel = true;
  const whaleSpot = () => {
    for (let k = 0; k < 40; k++) {
      const lon = -122.355 + Math.random() * 0.08, lat = 37.715 + Math.random() * 0.045;
      if ([[0, 0], [0.012, 0], [-0.012, 0], [0, 0.008], [0, -0.008]].every(([a, b]) => isWater(lon + a, lat + b))) { const p = at(lon, lat); whale.root.position.set(p.x, 0, p.z); whale.root.rotation.y = 0.4 + Math.random() * 0.9; return; }
    }
  };
  whaleSpot();
  whale.update = (T) => { if (whale.act(T)) whaleSpot(); };
  setInkWidth(1.05);
  scene.updateMatrixWorld(true);
  for (const l of LMS) { l.box = new THREE.Box3().setFromObject(l.root, true); l.box0 = l.box.clone(); l.base = l.root.scale.clone(); l.home = l.root.position.clone(); l.k = 1; }
  const sstep = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  function boostAll() {
    for (const l of LMS) {
      if (!(l.boost > 1)) continue;
      const f = sstep(230, 1300, cam.position.distanceTo(l.home)), k = 1 + (l.boost - 1) * f;
      if (Math.abs(k - l.k) < 0.002) continue;
      l.k = k; l.root.scale.copy(l.base).multiplyScalar(k);
      // far out, crowded neighbours also step apart a little, the way a tourist map cheats
      if (l.spread) l.root.position.set(l.home.x + l.spread[0] * f, l.root.position.y, l.home.z + l.spread[1] * f);
      const c = l.root.position, h = l.home;
      l.box.min.copy(l.box0.min).sub(h).multiplyScalar(k).add(c); l.box.max.copy(l.box0.max).sub(h).multiplyScalar(k).add(c);
    }
  }

  // ---------- life on the map: Caltrain, gulls ----------
  const CALTRAIN = [[-122.3947, 37.7766], [-122.3866, 37.6003], [-122.3237, 37.5679], [-122.2316, 37.4854], [-122.1645, 37.443], [-122.0764, 37.3943], [-122.0307, 37.3784], [-121.9366, 37.3532], [-121.9025, 37.3297]];
  const route = []; for (let i = 1; i < CALTRAIN.length; i++) for (let j = 0; j < 20; j++) { const f = j / 20, [a, b] = [CALTRAIN[i - 1], CALTRAIN[i]]; const p = at(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f); p.y = Math.min(p.y, 4) + 2.2; route.push(p); }
  route.push(at(...CALTRAIN.at(-1)).setY(2.2));
  const dist = [0]; for (let i = 1; i < route.length; i++) dist.push(dist[i - 1] + route[i].distanceTo(route[i - 1]));
  const along = (d) => { d = Math.max(0, Math.min(dist.at(-1), d)); let i = 1; while (i < route.length - 1 && dist[i] < d) i++; const f = (d - dist[i - 1]) / (dist[i] - dist[i - 1] || 1); return route[i - 1].clone().lerp(route[i], f); };
  const train = Array.from({ length: 5 }, (_, i) => {
    const g = new THREE.Group(); scene.add(g);
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.2, 9.4), new THREE.MeshToonMaterial({ color: "#E3E5EC" })); body.castShadow = true; g.add(body);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.5, 9.5), new THREE.MeshBasicMaterial({ color: "#C8323A" })); stripe.position.y = -0.6; g.add(stripe);
    if (i === 0) { const nose = new THREE.Mesh(new THREE.BoxGeometry(2.9, 3.3, 1.4), new THREE.MeshToonMaterial({ color: "#C8323A" })); nose.position.z = 4.4; g.add(nose); }
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry), new THREE.LineBasicMaterial({ color: "#211946" })));
    return g;
  });
  setBirds(true);
  const gulls = Array.from({ length: 5 }, () => bird(scene, 2.2));

  // ---------- camera ----------
  const v3 = new THREE.Vector3(), project = (p) => { v3.copy(p).project(cam); return [(v3.x * 0.5 + 0.5) * size.w, (-v3.y * 0.5 + 0.5) * size.h, v3.z]; };
  const controls = new MapControls(cam, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.09, minDistance: 28, maxDistance: 2800, maxPolarAngle: 1.22, minAzimuthAngle: -0.9, maxAzimuthAngle: 0.9, screenSpacePanning: false, zoomToCursor: true, zoomSpeed: 1.2 });
  if (touch === "page") { controls.touches = { ONE: null, TWO: THREE.TOUCH.DOLLY_PAN }; renderer.domElement.style.touchAction = "pan-y"; }
  const HOME = { pos: new THREE.Vector3(), tgt: new THREE.Vector3(30, 0, 95) };
  const F = { inset: 0, drop: 0, fit, tInset: null, tDrop: null, tFit: fit };
  const fitHome = () => { const d = (WX * F.tFit) / (Math.tan((cam.fov * Math.PI) / 360) * ((size.w - inset()) / size.h)); HOME.pos.set(30, d * 0.62, 40 + d * 0.78); };
  // room kept clear on the left for page copy: the scene is drawn shifted right by half of it
  let insetFn = insetLeft, dropFn = offsetY;
  const inset = () => (typeof insetFn === "function" ? insetFn(size.w) : insetFn) || 0;
  const drop = () => (typeof dropFn === "function" ? dropFn(size.w, size.h) : dropFn) || 0;
  const applyOffset = () => { if (F.inset || F.drop) cam.setViewOffset(size.w, size.h, -F.inset / 2, -F.drop, size.w, size.h); else cam.clearViewOffset(); cam.updateProjectionMatrix(); };
  let fly = null;
  const view = (p, d) => ({ tgt: new THREE.Vector3(p.x, 0, p.z), pos: new THREE.Vector3(p.x, d * 0.55, p.z + d * 0.84) });
  const flyTo = (v, dur = 1500) => { fly = { t0: performance.now(), dur, fromP: cam.position.clone(), fromT: controls.target.clone(), pos: v.pos, tgt: v.tgt }; };
  const goHome = () => flyTo({ pos: HOME.pos.clone(), tgt: HOME.tgt.clone() });

  // ---------- pins, landmark labels ----------
  const topOf = (lm) => { const b = new THREE.Box3().setFromObject(lm.root, true), c = b.getCenter(new THREE.Vector3()); return new THREE.Vector3(c.x, b.max.y + 4, c.z); };
  const anchorPos = (a) => {
    if (a.lm) return [topOf(LM[a.lm]), true, LM[a.lm]];
    const v = a.place ? toWorld(...hm.places[a.place]) : at(...a.lonlat); v.y += 3; return [v, false];
  };
  const PINS = PIN_DEFS.map((d) => { const [pos, onBuilding, lm] = anchorPos(d.anchor); return { ...d, pos, onBuilding, lm, h0: lm ? pos.y - 4 - lm.root.position.y : 0, ox: lm ? pos.x - lm.root.position.x : 0, oz: lm ? pos.z - lm.root.position.z : 0 }; });
  for (const p of PINS) {
    p.el = document.createElement("a"); p.el.className = "bay-pin"; p.el.href = p.href || "#"; p.el.setAttribute("aria-label", `${p.name}: ${p.what}`);
    p.el.innerHTML = pinSVG + `<span class="lab"><b>${p.name}</b><span>${p.what}</span>${pinCta ? `<i>${pinCta}</i>` : ""}</span>`;
    p.el.addEventListener("click", (e) => {
      e.preventDefault(); PINS.forEach((q) => q.el.classList.toggle("on", q === p));
      if (onPin && onPin(p, e) === false) return;
      travel(p.id);
    });
    layer.appendChild(p.el);
  }
  if (labels) for (const l of LMS.filter((l) => !l.noLabel)) { l.label = document.createElement("div"); l.label.className = "bay-lm"; l.label.textContent = l.name; layer.appendChild(l.label); }
  const hint = document.createElement("div"); hint.className = "bay-hint"; hint.textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? "Hold ⌘ and scroll to zoom the map" : "Hold Ctrl and scroll to zoom the map"; layer.appendChild(hint);
  let hintTimer = 0;

  // ---------- Pathfinder ----------
  const pf = document.createElement("div"); pf.className = "bay-pf";
  pf.innerHTML = `<svg viewBox="40 30 160 195" aria-label="Pathfinder"><g data-k="flip"><g data-k="body">
    <g fill="none" stroke="#211946" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <g data-k="legL"><path d="${PATHFINDER[4]}"/></g><g data-k="legR"><path d="${PATHFINDER[5]}"/></g>
      <path d="${PATHFINDER[0]}" fill="#F7F5FC"/><path d="${PATHFINDER[1]}"/><path d="${PATHFINDER[8]}"/>
      <g data-k="armL"><path d="${PATHFINDER[6]}"/></g><g data-k="armR"><path d="${PATHFINDER[7]}"/></g>
      <g data-k="ant"><path d="${PATHFINDER[2]}"/><path d="${PATHFINDER[3]}" fill="#F7F5FC"/></g>
    </g>
    <ellipse data-k="eye" cx="122" cy="130" rx="7" ry="7" fill="#FF5A47"/><circle data-k="led" cx="120" cy="165" r="4" fill="#FF5A47"/>
  </g></g></svg>`;
  layer.appendChild(pf);
  const PFel = Object.fromEntries([...pf.querySelectorAll("[data-k]")].map((n) => [n.dataset.k, n]));
  const home = toWorld(...hm.places.home); home.y = groundAt(home.x, home.z);
  const PF = { p: home.clone(), anchor: home.clone(), face: 1, queue: [], cur: null, ph: 0, sq: 0, nextWander: 3500, nextBlink: 2500, blink: 0, follow: false, finalView: null, mode: "idle" };

  // the Caltrain is a little state machine, so it can come and pick Pathfinder up
  const L = dist.at(-1), vShuttle = L / 26;
  const TR = { head: 0, dir: 1, mode: "shuttle", target: 0, wait: 0, arrived: false };
  function trainStep(dt) {
    if (TR.wait > 0) { TR.wait -= dt; return; }
    if (TR.mode === "shuttle") {
      TR.head += (TR.dir * vShuttle * dt) / 1000;
      if (TR.head >= L) { TR.head = L; TR.dir = -1; TR.wait = 2500; } else if (TR.head <= 0) { TR.head = 0; TR.dir = 1; TR.wait = 2500; }
    } else {
      const d = TR.target - TR.head, v = (Math.max(vShuttle * 4, 240) * dt) / 1000;
      if (Math.abs(d) <= v) { TR.head = TR.target; TR.arrived = true; } else { TR.head += Math.sign(d) * v; TR.dir = Math.sign(d); TR.arrived = false; }
    }
  }
  const nearestD = (x, z) => { let best = 0, bd = Infinity; for (let i = 0; i < route.length; i++) { const r = route[i], d = (r.x - x) ** 2 + (r.z - z) ** 2; if (d < bd) { bd = d; best = dist[i]; } } return [best, Math.sqrt(bd)]; };
  const onTrain = () => along(TR.head).add(new THREE.Vector3(0, 3.6, 0));

  // plan a trip: walk if it is close, ride the Caltrain if both ends are near the line, otherwise hop
  function sendPF(dest, finalView) {
    const d = Math.hypot(dest.x - PF.p.x, dest.z - PF.p.z);
    PF.queue = []; PF.cur = null; PF.anchor = dest.clone(); PF.finalView = finalView; PF.follow = false;
    if (TR.mode === "express") TR.mode = "shuttle";
    const [d0, r0] = nearestD(PF.p.x, PF.p.z), [d1, r1] = nearestD(dest.x, dest.z);
    if (d < 110) { PF.queue.push({ type: "walk", to: dest, speed: Math.max(9, d / 2.5) }); return false; }
    if (r0 < 220 && r1 < 220 && Math.abs(d1 - d0) > 150) {
      // get to the line (walk if it is near, hop if not), ride, then get off and go the last bit
      const a = along(d0), b = along(d1); a.y = groundAt(a.x, a.z); b.y = groundAt(b.x, b.z);
      const reach = (to, r) => (r < 40 ? { type: "walk", to, speed: Math.max(10, r / 2) } : { type: "hop", to, dur: 1100, h: Math.min(90, r * 0.4) });
      PF.queue.push(reach(a, r0), { type: "call", d: d0 }, { type: "board" }, { type: "ride", d: d1 });
      if (r1 < 40) { const off = b.clone().add(new THREE.Vector3(6, 0, 6)); off.y = groundAt(off.x, off.z); PF.queue.push({ type: "hop", to: off, dur: 520, h: 7 }, { type: "walk", to: dest, speed: Math.max(10, r1 / 2.4) }); }
      else PF.queue.push({ type: "hop", to: dest, dur: 1100, h: Math.min(90, r1 * 0.4) });
      PF.queue.push({ type: "settle" });
      PF.follow = true; fly = null; return true;
    }
    PF.queue.push({ type: "hop", to: dest, dur: 1700, h: Math.min(260, d * 0.35) });
    return false;
  }
  function travel(id) {
    const p = PINS.find((q) => q.id === id); if (!p) return;
    const dest = p.pos.clone().add(new THREE.Vector3(0, 0, p.onBuilding ? 15 : 5)); dest.y = groundAt(dest.x, dest.z);
    const d = p.onBuilding ? Math.max(150, (p.pos.y - p.lm.root.position.y) * 3.2) : 150;
    if (!sendPF(dest, view(p.pos, d))) flyTo(view(p.pos, d));
  }
  function pfStep(T, dt) {
    const s = dt / 1000;
    if (!PF.cur && PF.queue.length) { PF.cur = PF.queue.shift(); PF.cur.t = 0; PF.cur.from = PF.p.clone(); }
    const c = PF.cur; PF.mode = c ? c.type : "idle";
    if (c) {
      c.t += dt;
      if (c.type === "walk") {
        const dx = c.to.x - PF.p.x, dz = c.to.z - PF.p.z, d = Math.hypot(dx, dz), step = Math.min(d, c.speed * s);
        if (d < 0.3) PF.cur = null; else { PF.p.x += (dx / d) * step; PF.p.z += (dz / d) * step; PF.p.y = groundAt(PF.p.x, PF.p.z); PF.ph += step * (2.6 / Math.max(3, c.speed * 0.25)); }
      } else if (c.type === "call") {
        if (TR.mode !== "express" || TR.target !== c.d) { TR.mode = "express"; TR.target = c.d; TR.wait = 0; TR.arrived = false; }
        if (TR.arrived) PF.cur = null;
      } else if (c.type === "board" || c.type === "hop") {
        const dur = c.dur ?? 420, f = Math.min(1, c.t / dur), to = c.type === "board" ? onTrain() : c.to, h = c.h ?? 6;
        PF.p.lerpVectors(c.from, to, f); PF.p.y = c.from.y + (to.y - c.from.y) * f + 4 * h * f * (1 - f);
        if (f >= 1) { PF.cur = null; PF.sq = 1; }
      } else if (c.type === "ride") {
        if (TR.target !== c.d) { TR.target = c.d; TR.arrived = false; }
        PF.p.copy(onTrain());
        if (TR.arrived) { PF.cur = null; TR.mode = "shuttle"; TR.wait = 2200; }
      } else if (c.type === "settle") {
        if (PF.follow && PF.finalView) flyTo(PF.finalView); PF.follow = false; PF.cur = null;
      }
    } else if (T > PF.nextWander) {
      // potter about near where it was sent
      for (let k = 0; k < 8; k++) {
        const a = Math.random() * Math.PI * 2, r = 6 + Math.random() * 18, x = PF.anchor.x + Math.cos(a) * r, z = PF.anchor.z + Math.sin(a) * r;
        if (onLand(x, z)) { PF.queue.push({ type: "walk", to: new THREE.Vector3(x, groundAt(x, z), z), speed: 5 + Math.random() * 3 }); break; }
      }
      PF.nextWander = T + 4000 + Math.random() * 5000;
    }
    PF.sq *= Math.exp(-dt / 140);
    if (T > PF.nextBlink) { PF.blink = 140; PF.nextBlink = T + 2500 + Math.random() * 3000; }
    PF.blink = Math.max(0, PF.blink - dt);
  }
  pf.addEventListener("click", () => { if (!PF.cur) PF.queue.unshift({ type: "hop", to: PF.p.clone(), dur: 380, h: 4 }); PF.sq = 1; });
  let mouse = null, pfX = 0;
  function pfDraw(T) {
    const up = PF.p.clone().add(new THREE.Vector3(0, 6, 0)), [x, y, z] = project(PF.p), [, y2] = project(up);
    const hpx = Math.max(30, Math.min(110, Math.abs(y - y2) * 1.25)), wpx = (hpx * 160) / 195;
    pf.style.left = `${x}px`; pf.style.top = `${y}px`; pf.style.display = z < 1 ? "" : "none";
    const svg = pf.firstChild; svg.setAttribute("width", wpx); svg.setAttribute("height", hpx);
    if (Math.abs(x - pfX) > 0.25 && PF.mode !== "call") PF.face = x > pfX ? 1 : -1;
    pfX = x;
    PFel.flip.setAttribute("transform", PF.face > 0 ? "" : "translate(240,0) scale(-1,1)");
    const m = PF.mode, walk = m === "walk", air = m === "hop" || m === "board", ride = m === "ride";
    const sw = walk ? Math.sin(PF.ph) : 0, bob = walk ? -Math.abs(Math.cos(PF.ph)) * 6 : ride ? Math.sin(T / 90) * 1.5 : Math.sin(T / 700) * 1.2;
    const sx = 1 + 0.22 * PF.sq, sy = 1 - 0.22 * PF.sq;
    PFel.body.setAttribute("transform", `translate(0,${bob}) translate(120,214) scale(${sx},${sy}) translate(-120,-214)`);
    PFel.legL.setAttribute("transform", `rotate(${air ? 18 : sw * 24} 97 177)`); PFel.legR.setAttribute("transform", `rotate(${air ? -18 : -sw * 24} 143 177)`);
    const wave = Math.sin(T / 120) * 18;
    PFel.armL.setAttribute("transform", `rotate(${ride ? 120 + wave : air ? 60 : -sw * 20 + Math.sin(T / 900) * 4} 72 130)`);
    PFel.armR.setAttribute("transform", `rotate(${ride ? -120 - wave : air ? -60 : sw * 20 - Math.sin(T / 900) * 4} 168 132)`);
    PFel.ant.setAttribute("transform", `rotate(${Math.sin(T / (walk || ride ? 110 : 600)) * (walk || ride ? 10 : 4)} 120 80)`);
    // the eye looks where it is going, at the train it is waiting for, or at the cursor
    let ex = walk || air || ride ? 6 : 0, ey = 0;
    if (m === "call") { const [tx] = project(along(TR.head)); ex = Math.sign(tx - x) * 7 * PF.face; }
    else if (!PF.cur && mouse) { const dx = mouse[0] - x, dy = mouse[1] - (y - hpx * 0.55), d = Math.hypot(dx, dy); if (d < 400) { ex = (dx / Math.max(d, 1)) * 7 * PF.face; ey = (dy / Math.max(d, 1)) * 6; } }
    PFel.eye.setAttribute("cx", 122 + ex); PFel.eye.setAttribute("cy", 130 + ey); PFel.eye.setAttribute("ry", PF.blink > 0 ? 1.2 : 7);
    PFel.led.setAttribute("fill", m !== "idle" && Math.sin(T / 120) > 0 ? "#FFD25A" : "#FF5A47");
  }

  // ---------- input ----------
  const local = (e) => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const cv = renderer.domElement;
  cv.addEventListener("pointerdown", () => { fly = null; PF.follow = false; });
  // on a page, a plain scroll wheel scrolls the page; ⌘/Ctrl + wheel (and trackpad pinch) zooms the map
  el.addEventListener("wheel", (e) => {
    const zoom = wheel === "always" || e.ctrlKey || e.metaKey;
    controls.enableZoom = zoom;
    if (zoom) { fly = null; PF.follow = false; }
    else { hint.classList.add("on"); clearTimeout(hintTimer); hintTimer = setTimeout(() => hint.classList.remove("on"), 1100); }
  }, { capture: true, passive: true });
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  cv.addEventListener("dblclick", (e) => {
    const [mx, my] = local(e);
    ray.setFromCamera(new THREE.Vector2((mx / size.w) * 2 - 1, -(my / size.h) * 2 + 1), cam);
    const hit = ray.ray.intersectPlane(plane, new THREE.Vector3()); if (!hit) return;
    flyTo(view(hit, Math.max(90, cam.position.distanceTo(controls.target) * 0.45)));
  });
  cv.addEventListener("pointermove", (e) => (mouse = local(e)));
  cv.addEventListener("pointerleave", () => (mouse = null));
  function screenBox(b) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < 8; i++) { const [x, y] = project(new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z)); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return [x0, y0, x1, y1];
  }
  function resize() {
    size.w = el.clientWidth || 1; size.h = el.clientHeight || 1;
    renderer.setSize(size.w, size.h, false); cam.aspect = size.w / size.h;
    F.tInset = inset(); F.tDrop = drop(); if (!F.ready) { F.inset = F.tInset; F.drop = F.tDrop; F.ready = true; }
    applyOffset(); terrainLine.resolution.set(size.w, size.h); fitHome();
  }
  new ResizeObserver(resize).observe(el); resize();
  cam.position.copy(HOME.pos); controls.target.copy(HOME.tgt);

  // ---------- frame loop; it sleeps while the map is off screen or covered ----------
  let visible = true, active = true, lastT = 0, raf = 0;
  const running = () => visible && active;
  const wake = () => { if (running() && !raf) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); }).observe(el);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function frame(T) {
    raf = 0; if (!running()) return;
    // ease the framing (room for page copy) toward its target
    if (Math.abs(F.inset - F.tInset) > 0.5 || Math.abs(F.drop - F.tDrop) > 0.5) { F.inset += (F.tInset - F.inset) * 0.08; F.drop += (F.tDrop - F.drop) * 0.08; applyOffset(); }
    const now = new Date();
    if (fly) {
      const k = Math.min(1, (performance.now() - fly.t0) / fly.dur), e = ease(k);
      cam.position.lerpVectors(fly.fromP, fly.pos, e); controls.target.lerpVectors(fly.fromT, fly.tgt, e); if (k >= 1) fly = null;
    }
    controls.target.x = Math.max(-WX * 0.5, Math.min(WX * 0.5, controls.target.x)); controls.target.z = Math.max(-WZ * 0.5, Math.min(WZ * 0.5, controls.target.z)); controls.target.y = 0;
    controls.update();
    boostAll();
    for (const l of LMS) l.update(T, now, cam);
    const dt = Math.min(64, T - (lastT || T)); lastT = T;
    trainStep(dt); pfStep(T, dt);
    train.forEach((g, i) => { const p = along(TR.head - TR.dir * i * 10.4), q = along(TR.head - TR.dir * i * 10.4 + TR.dir * 2); g.position.copy(p); g.lookAt(q); });
    // while Pathfinder rides, the camera rides along
    if (PF.follow) { const v = view(PF.p, 210); cam.position.lerp(v.pos, 0.12); controls.target.lerp(v.tgt, 0.12); }
    gulls.forEach((b, i) => { const q = ((T / 70000) + i * 0.025) % 1; b(T, i).position.set(-380 + q * 520, 60 + Math.sin(T / 1800 + i) * 6 + (i % 3) * 6, -170 + q * 160 + (i % 2) * 12); });
    boil(T, size.w, size.h);
    renderer.render(scene, cam);
    for (const p of PINS) { if (p.lm) { const r = p.lm.root.position, k = p.lm.k; p.pos.set(r.x + p.ox * k, r.y + p.h0 * k + 4, r.z + p.oz * k); } const [x, y, z] = project(p.pos); p.el.style.left = `${x}px`; p.el.style.top = `${y}px`; p.el.style.display = z < 1 ? "" : "none"; }
    pfDraw(T);
    if (labels) {
      let best = null;
      for (const l of LMS) {
        if (l.noLabel) continue;
        const [x0, y0, x1, y1] = (l.sb = screenBox(l.box));
        if (mouse && mouse[0] > x0 && mouse[0] < x1 && mouse[1] > y0 && mouse[1] < y1) { const area = (x1 - x0) * (y1 - y0); if (!best || area < best.area) best = { l, area }; }
      }
      for (const l of LMS) { if (l.noLabel) continue; const on = best && best.l === l; l.label.classList.toggle("on", !!on); if (on) { l.label.style.left = `${(l.sb[0] + l.sb[2]) / 2}px`; l.label.style.top = `${l.sb[1] - 4}px`; } }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    THREE, scene, cam, controls, at, view, flyTo, goHome, travel, PF, PINS, LM,
    flyToLonLat: (lon, lat, d) => flyTo(view(at(lon, lat), d)),
    elev: (lon, lat) => elevCell(...cell(lon, lat)),
    jumpTo: (lon, lat, d) => { const v = view(at(lon, lat), d); cam.position.copy(v.pos); controls.target.copy(v.tgt); },
    clearPins: () => PINS.forEach((q) => q.el.classList.remove("on")),
    highlight: (id) => PINS.forEach((q) => q.el.classList.toggle("on", q.id === id)),
    // the page can move the room it keeps clear for copy, and the whole-Bay fit
    setFrame: ({ insetLeft: il = insetFn, offsetY: oy = dropFn, fit: f = F.tFit } = {}) => { insetFn = il; dropFn = oy; F.tFit = f; F.tInset = inset(); F.tDrop = drop(); fitHome(); },
    setActive: (on) => { active = on; wake(); },
  };
}
