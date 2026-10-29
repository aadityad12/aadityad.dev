// "Ink in 3D": real geometry and light, drawn like the rest of the site.
// Toon shading in three tones, pen hatching wherever a surface falls into shade
// (including cast shadows), and outlines that boil a few times a second the
// way Pathfinder's line art does.
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

export { THREE };
export const PAL = {
  ink: "#211946", wall: "#F6F3FB", stone: "#E4DFEF", roof: "#CBC4E3", shade: "#B9B0DA", water: "#D3CDEE", ground: "#E9E6F4",
  coral: "#FF5A47", orange: "#E2502F", orangeD: "#A93A22", terra: "#D8664A", leaf: "#9FC8A9", leafL: "#C7E0CC", trunk: "#E2CFB3", gold: "#F2C14E",
};
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
export const rnd = hash;

const ramp = new THREE.DataTexture(new Uint8Array([80, 165, 255]), 3, 1, THREE.RedFormat);
ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;

const mats = new Map();
export function mat(color, { hatch = true, flat = false, side = THREE.FrontSide } = {}) {
  const key = [color, hatch, flat, side].join();
  if (mats.has(key)) return mats.get(key);
  const m = new THREE.MeshToonMaterial({ color, gradientMap: ramp, side, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  if (hatch) m.onBeforeCompile = (sh) => {
    sh.uniforms.inkCol = { value: new THREE.Color(PAL.ink) };
    sh.uniforms.dpr = { value: Math.min(devicePixelRatio || 1, 2) };
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 inkCol; uniform float dpr;")
      .replace("#include <opaque_fragment>", `#include <opaque_fragment>
        float lum = dot(outgoingLight, vec3(1.0)) / max(dot(diffuseColor.rgb, vec3(1.0)), 0.001);
        vec2 fc = gl_FragCoord.xy / dpr;
        if (lum < 0.8 && mod(fc.x + fc.y, 5.0) < 1.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, inkCol, 0.32);
        if (lum < 0.56 && mod(fc.x - fc.y, 5.0) < 1.0) gl_FragColor.rgb = mix(gl_FragColor.rgb, inkCol, 0.3);`);
  };
  mats.set(key, m); return m;
}
const flatMats = new Map();
export const basic = (color, o = {}) => {
  const key = color + JSON.stringify(o);
  if (!flatMats.has(key)) flatMats.set(key, new THREE.MeshBasicMaterial({ color, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1, ...o }));
  return flatMats.get(key);
};

// ---------- geometry helpers (y is up, the front faces +z) ----------
export function mesh(parent, geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
}
export const box = (p, w, h, d, x, y, z, color, o) => mesh(p, new THREE.BoxGeometry(w, h, d), mat(color, o), x, y + h / 2, z);
export function hipGeo(w, d, h) {
  const r = Math.max(0, (w - d) / 2);
  const A = [-w / 2, 0, -d / 2], B = [w / 2, 0, -d / 2], C = [w / 2, 0, d / 2], D = [-w / 2, 0, d / 2], R1 = [-r, h, 0], R2 = [r, h, 0];
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([D, C, R2, D, R2, R1, B, A, R1, B, R1, R2, A, D, R1, C, B, R2].flat(), 3));
  g.computeVertexNormals(); return g;
}
export const hip = (p, w, d, h, x, y, z, color) => mesh(p, hipGeo(w, d, h), mat(color), x, y, z);
export function archGeo(w, h) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
  return new THREE.ShapeGeometry(s, 8);
}
// a group sitting on one face of a box, so details can be laid out in 2D on it
export function face(p, cx, cz, hx, hz, i, e = 0.08) {
  const g = new THREE.Group();
  const at = [[cx, cz + hz + e, 0], [cx + hx + e, cz, Math.PI / 2], [cx, cz - hz - e, Math.PI], [cx - hx - e, cz, -Math.PI / 2]][i];
  g.position.set(at[0], 0, at[1]); g.rotation.y = at[2]; p.add(g); return g;
}
export const decal = (p, geo, color, x, y, { ink = true } = {}) => { const m = mesh(p, geo, basic(color), x, y, 0); m.castShadow = false; m.userData.noInk = !ink; return m; };
export const opening = (p, x, y, w, h, color = PAL.shade, o) => decal(p, archGeo(w, h), color, x, y, o);
export const pane = (p, x, y, w, h, color = PAL.shade, o) => decal(p, new THREE.PlaneGeometry(w, h).translate(0, h / 2, 0), color, x, y, o);

// ---------- ink outlines that boil ----------
const inks = [];
export function inkify(root, { amp = 0.22, width = 1.5, threshold = 28 } = {}) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert(), pos = [];
  root.traverse((o) => {
    if (!o.isMesh || o.userData.noInk) return;
    for (let q = o.parent; q && q !== root; q = q.parent) if (q.userData.noInk || q.userData.ownInk) return;
    const e = new THREE.EdgesGeometry(o.geometry, threshold);
    e.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld));
    pos.push(...e.attributes.position.array);
  });
  const geo = new LineSegmentsGeometry(); geo.setPositions(pos);
  const material = new LineMaterial({ color: PAL.ink, linewidth: width, fog: true });
  const obj = new LineSegments2(geo, material); obj.userData.noInk = true; root.add(obj);
  const ink = { base: Float32Array.from(pos), geo, material, amp, width, frame: -1 }; inks.push(ink); return ink;
}
export function boil(T, w, h) {
  const f = Math.floor(T / 130) % 4;
  for (const k of inks) {
    k.material.resolution.set(w, h);
    if (k.frame === f) continue;
    k.frame = f; const out = new Float32Array(k.base.length);
    for (let i = 0; i < out.length; i++) out[i] = k.base[i] + k.amp * hash(i * 0.37 + f * 17.3);
    k.geo.setPositions(out);
  }
}

// ---------- life ----------
export function clockOn(faceGroup, y, r) {
  decal(faceGroup, new THREE.CircleGeometry(r, 24), "#FFFDF4", 0, y);
  const hands = [[r * 0.5, 0.75], [r * 0.8, 0.45]].map(([len, w]) => {
    const m = mesh(faceGroup, new THREE.BoxGeometry(w, len, 0.15).translate(0, len / 2, 0), basic(PAL.ink), 0, y, 0.12); m.castShadow = false; m.userData.noInk = true; return m;
  });
  return (now) => {
    const m = now.getMinutes() + now.getSeconds() / 60, h = (now.getHours() % 12) + m / 60;
    hands[0].rotation.z = -(h / 12) * 2 * Math.PI; hands[1].rotation.z = -(m / 60) * 2 * Math.PI;
  };
}
export function flag(p, x, y, z, color = PAL.coral, w = 11, h = 6.5) {
  mesh(p, new THREE.CylinderGeometry(0.35, 0.35, 13, 6), mat(PAL.ink, { hatch: false }), x, y + 6.5, z).userData.noInk = true;
  const geo = new THREE.PlaneGeometry(w, h, 10, 2).translate(w / 2, -h / 2, 0), base = Float32Array.from(geo.attributes.position.array);
  const m = mesh(p, geo, mat(color, { side: THREE.DoubleSide, hatch: false }), x, y + 13, z); m.userData.noInk = true;
  return (T) => {
    const a = geo.attributes.position;
    for (let i = 0; i < a.count; i++) { const bx = base[i * 3]; a.setZ(i, Math.sin(T / 170 - bx * 0.55) * bx * 0.13); a.setY(i, base[i * 3 + 1] - bx * 0.04); }
    a.needsUpdate = true; geo.computeVertexNormals();
  };
}
// crown and trunk are fractions of h; a tall Washingtonia is palm(.., { crown: 0.14, trunk: 0.013, lean: 0.03 })
export function palm(p, x, z, h, seed = 0, { crown: CR = 0.32, trunk: TR = 0.032, lean = 0.1 } = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.noInk = true; p.add(g);
  const top = V(h * lean, h, 0);
  mesh(g, new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V(0, 0, 0), V(h * lean * 1.7, h * 0.5, 0), top), 16, h * TR, 7), mat(PAL.trunk));
  if (CR < 0.2) mesh(g, new THREE.SphereGeometry(h * CR * 0.17, 8, 6).scale(1, 2.6, 1), mat("#C9B48F"), top.x, top.y - h * CR * 0.35, 0);
  const crown = new THREE.Group(); crown.position.copy(top); g.add(crown);
  for (let i = 0; i < 11; i++) {
    const L = h * (CR + 0.08 * (CR / 0.32) * Math.abs(hash(i + seed))), W = L * 0.24;
    const geo = new THREE.PlaneGeometry(L, W, 10, 1).rotateX(-Math.PI / 2).translate(L / 2, 0, 0), a = geo.attributes.position;
    for (let k = 0; k < a.count; k++) { const t = a.getX(k) / L; a.setZ(k, a.getZ(k) * (1 - t * 0.9)); a.setY(k, L * (0.22 * t - 0.55 * t * t)); }
    geo.computeVertexNormals();
    const f = mesh(crown, geo, mat(i % 2 ? PAL.leaf : PAL.leafL, { side: THREE.DoubleSide })); f.rotation.y = (i / 11) * 2 * Math.PI + seed;
  }
  return (T) => { crown.rotation.z = Math.sin(T / 1300 + seed) * 0.06; crown.rotation.x = Math.sin(T / 1700 + seed) * 0.04; };
}
export function tree(p, x, z, r, seed = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.noInk = true; p.add(g);
  mesh(g, new THREE.CylinderGeometry(r * 0.09, r * 0.13, r * 1.3, 6), mat(PAL.trunk), 0, r * 0.65, 0);
  const crown = new THREE.Group(); crown.position.y = r * 1.3; g.add(crown);
  for (const [dx, dy, dz, k] of [[-0.45, 0.35, 0.1, 0.72], [0.5, 0.3, -0.15, 0.7], [0, 0.85, 0, 0.85], [0.1, 0.4, 0.5, 0.6]])
    mesh(crown, new THREE.IcosahedronGeometry(r * k, 1), mat(PAL.leaf, { flat: true }), dx * r, dy * r, dz * r);
  return (T) => { crown.rotation.z = Math.sin(T / 1700 + seed) * 0.04; };
}
// people strolling back and forth along x
export function walkers(p, n, x0, x1, z0, z1, seed = 0) {
  const cols = [PAL.coral, PAL.ink, "#7E74B8", PAL.leaf, PAL.gold], ppl = [];
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group(); g.userData.noInk = true; p.add(g);
    mesh(g, new THREE.CapsuleGeometry(0.85, 2.2, 2, 8), mat(cols[(i + seed) % cols.length], { hatch: false }), 0, 2.1, 0);
    mesh(g, new THREE.SphereGeometry(0.8, 10, 8), mat("#3A2F63", { hatch: false }), 0, 4.4, 0);
    ppl.push({ g, v: 0.004 + 0.003 * Math.abs(hash(i + seed)), dir: i % 2 ? 1 : -1, off: Math.abs(hash(i * 3 + seed)), z: z0 + (z1 - z0) * Math.abs(hash(i * 7 + seed)) });
  }
  const span = x1 - x0;
  return (T) => {
    for (const q of ppl) {
      const x = ((((T * q.v * q.dir) + q.off * span) % span) + span) % span + x0;
      q.g.position.set(x, Math.abs(Math.sin(T / 140 + q.off * 9)) * 0.35, q.z); q.g.rotation.y = q.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
  };
}
// birds can be switched off while building, so the map keeps one flock instead of one per model
let birdsOn = true;
export const setBirds = (on) => (birdsOn = on);
export function bird(p, size = 1) {
  const g = new THREE.Group(); g.userData.noInk = true; g.visible = birdsOn; p.add(g);
  const wing = (s) => { const w = new THREE.Group(); g.add(w); const m = mesh(w, new THREE.BoxGeometry(3 * size, 0.25, 1.1 * size).translate(s * 1.5 * size, 0, 0), basic(PAL.ink)); m.castShadow = true; return w; };
  const L = wing(-1), R = wing(1);
  return (T, seed = 0) => { const f = Math.sin(T / 85 + seed * 3) * 0.6; L.rotation.z = -f; R.rotation.z = f; return g; };
}
let fogTex;
export function fogPuff(p) {
  if (!fogTex) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
    const gr = x.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.5, "rgba(255,255,255,.75)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128); fogTex = new THREE.CanvasTexture(c);
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: fogTex, transparent: true, depthWrite: false, fog: false })); p.add(s); return s;
}

// tall Italian cypress and a stacked-cone pine
export function cypress(p, x, z, h, seed = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.noInk = true; p.add(g);
  mesh(g, new THREE.IcosahedronGeometry(1, 2).scale(h * 0.11, h * 0.5, h * 0.11), mat("#5E8C6B", { flat: true }), 0, h * 0.5, 0);
  return (T) => { g.rotation.z = Math.sin(T / 1900 + seed) * 0.012; };
}
export function pine(p, x, z, h, seed = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.noInk = true; p.add(g);
  mesh(g, new THREE.CylinderGeometry(h * 0.02, h * 0.035, h * 0.4, 6), mat(PAL.trunk), 0, h * 0.2, 0);
  for (let i = 0; i < 4; i++) mesh(g, new THREE.ConeGeometry(h * (0.26 - i * 0.045), h * 0.34, 7), mat(i % 2 ? "#5E8C6B" : "#6F9D79", { flat: true }), 0, h * (0.36 + i * 0.17), 0);
  return (T) => { g.rotation.z = Math.sin(T / 2100 + seed) * 0.015; };
}
export function shrub(p, x, z, r, color = PAL.leaf) {
  const m = mesh(p, new THREE.IcosahedronGeometry(r, 1).scale(1.4, 0.8, 1), mat(color, { flat: true }), x, r * 0.6, z); m.userData.noInk = true; return m;
}
// faint hand lines (stone coursing, facade fins, window grids)
export function hairlines(p, segs, opacity = 0.2, color = PAL.ink) {
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
  const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity })); l.userData.noInk = true; p.add(l); return l;
}
// horizontal courses and window rows on the four faces of a box
export function courses(p, cx, cz, w, d, y0, y1, step, opacity = 0.18) {
  const s = [], hx = w / 2 + 0.06, hz = d / 2 + 0.06;
  for (let y = y0 + step; y < y1; y += step) s.push(cx - hx, y, cz + hz, cx + hx, y, cz + hz, cx + hx, y, cz + hz, cx + hx, y, cz - hz, cx + hx, y, cz - hz, cx - hx, y, cz - hz, cx - hx, y, cz - hz, cx - hx, y, cz + hz);
  return hairlines(p, s, opacity);
}
// a small generic airliner, nose along +x
export function airliner(p, tail = PAL.coral) {
  const g = new THREE.Group(); g.userData.noInk = true; p.add(g);
  const W = "#FBFAFE";
  mesh(g, new THREE.CapsuleGeometry(2.4, 26, 4, 12).rotateZ(Math.PI / 2), mat(W));
  const wing = new THREE.Shape(); wing.moveTo(-4, 0); wing.lineTo(4, 0); wing.lineTo(-3, 16); wing.lineTo(-6, 16); wing.lineTo(-4, 0);
  for (const s of [1, -1]) {
    const wm = mesh(g, new THREE.ExtrudeGeometry(wing, { depth: 0.5, bevelEnabled: false }).rotateX(Math.PI / 2).scale(1, 1, s), mat(W), 0, -0.6, 0);
    mesh(g, new THREE.CylinderGeometry(1.1, 1.1, 4.4, 10).rotateZ(Math.PI / 2), mat("#C9C4DE"), 0.6, -1.9, s * 6.5);
    const st = new THREE.Shape(); st.moveTo(0, 0); st.lineTo(3, 0); st.lineTo(0.5, 6); st.lineTo(-1.2, 6); st.lineTo(0, 0);
    mesh(g, new THREE.ExtrudeGeometry(st, { depth: 0.4, bevelEnabled: false }).rotateX(Math.PI / 2).scale(1, 1, s), mat(W), -14.5, 0.6, 0);
    mesh(g, new THREE.BoxGeometry(1, 2.2, 1), mat(PAL.ink), 1, -3.6, s * 2.8);
  }
  const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(5, 0); fin.lineTo(0.5, 8); fin.lineTo(-1.5, 8); fin.lineTo(0, 0);
  mesh(g, new THREE.ExtrudeGeometry(fin, { depth: 0.5, bevelEnabled: false }).translate(0, 0, -0.25), mat(tail), -15, 1.4, 0);
  mesh(g, new THREE.BoxGeometry(5, 0.9, 0.9), mat(PAL.ink, { hatch: false }), 9.2, 0.9, 0);
  mesh(g, new THREE.BoxGeometry(1.2, 2.4, 0.6), mat(PAL.ink), 11, -3.4, 0);
  const beacon = mesh(g, new THREE.SphereGeometry(0.7, 8, 6), basic("#FF3B30", { transparent: true }), 0, -2.6, 0);
  const lamp = mesh(g, new THREE.SphereGeometry(0.8, 8, 6), basic("#FFF6C8"), 12.6, -0.8, 0);
  inkify(g, { amp: 0.12, width: 1.2 });
  return { g, update: (T) => { beacon.material.opacity = Math.sin(T / 160) > 0.6 ? 1 : 0.15; } };
}

// ---------- round three: richer building parts ----------
// a square frustum (wider at the bottom), e.g. a flared tower base or a corbel
export const frustumGeo = (wb, wt, h) => new THREE.CylinderGeometry(wt / Math.SQRT2, wb / Math.SQRT2, h, 4, 1).rotateY(Math.PI / 4);
export const frustum = (p, wb, wt, h, x, y, z, color) => mesh(p, frustumGeo(wb, wt, h), mat(color), x, y + h / 2, z);
// a gable: triangle w wide and h tall, extruded d deep along z, ridge along z
export function prismGeo(w, h, d) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
  return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }).translate(0, 0, -d / 2);
}
export const prism = (p, w, h, d, x, y, z, color) => mesh(p, prismGeo(w, h, d), mat(color), x, y, z);
// tiled roof slabs over a gable (ridge along z), with tile courses
export function gableRoof(p, w, h, d, x, y, z, color, over = 1.6) {
  const L = Math.hypot(w / 2, h) + over, ang = Math.atan2(h, w / 2), segs = [];
  for (const s of [-1, 1]) {
    const m = mesh(p, new THREE.BoxGeometry(L, 1.2, d + over * 2), mat(color), x + s * (w / 4 + Math.cos(ang) * over / 2), y + h / 2 - Math.sin(ang) * over / 2 + 0.7, z);
    m.rotation.z = s * -ang;
    for (let k = 1; k < 7; k++) {
      const f = k / 7, px = x + s * (w / 2 + over * Math.cos(ang)) * (1 - f), py = y + (h + 0.6) * f + 1.35 - over * Math.sin(ang) * (1 - f);
      segs.push(px, py, z - d / 2 - over, px, py, z + d / 2 + over);
    }
  }
  hairlines(p, segs, 0.35, "#7A2E1C");
}
// a canted bay window: three faces, h tall, w wide, sticking out dd from a wall
export function bayGeo(w, dd, h) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2 + dd, -dd); s.lineTo(w / 2 - dd, -dd); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
  return new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false }).rotateX(-Math.PI / 2);
}
export function texMat(map, { hatch = true, side = THREE.FrontSide, transparent = false, alphaTest = 0 } = {}) {
  const m = mat("#FFFFFF", { hatch, side }).clone(); m.map = map; m.transparent = transparent; m.alphaTest = alphaTest;
  m.onBeforeCompile = mat("#FFFFFF", { hatch, side }).onBeforeCompile; m.needsUpdate = true; return m;
}
export function canvasTex(w, h, draw, repeat = true) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; return t;
}
// facade of windows: one tile is one bay wide and one floor tall
const facades = new Map();
export function facadeTex(wall, glass, { mull = null, band = null, tall = 0.62, wide = 0.7 } = {}) {
  const key = [wall, glass, mull, band, tall, wide].join();
  if (!facades.has(key)) facades.set(key, canvasTex(64, 64, (x) => {
    x.fillStyle = wall; x.fillRect(0, 0, 64, 64);
    const gw = 64 * wide, gh = 64 * tall; x.fillStyle = glass; x.fillRect((64 - gw) / 2, (64 - gh) / 2, gw, gh);
    if (mull) { x.fillStyle = mull; x.fillRect(31, (64 - gh) / 2, 2, gh); }
    if (band) { x.fillStyle = band; x.fillRect(0, 0, 64, 4); }
  }));
  return facades.get(key);
}
// a box whose sides tile a facade texture: bay and floor are world sizes of one tile
export function facadeBox(p, w, h, d, x, y, z, tex, { bay = 5, floor = 4.2, roof = "#E7E3F0" } = {}) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  const sz = [[d, h], [d, h], [0, 0], [0, 0], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * (sz[f][0] / bay), uv.getY(i) * (sz[f][1] / floor)); }
  const m = new THREE.Mesh(g, [texMat(tex), texMat(tex), mat(roof), mat(roof), texMat(tex), texMat(tex)]);
  m.position.set(x, y + h / 2, z); m.castShadow = m.receiveShadow = true; p.add(m); return m;
}
// a lattice transmission pylon with two cross-arms; returns the arm tips for wires
export function pylon(p, x, z, h, color = "#8D88A8") {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.userData.noInk = true; p.add(g);
  const b = h * 0.16, t = h * 0.035, segs = [];
  const legs = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const at = (s, y) => { const k = b + (t - b) * (y / h); return [s[0] * k, y, s[1] * k]; };
  for (const s of legs) segs.push(...at(s, 0), ...at(s, h));
  for (let y = 0; y < h; y += h / 9) for (let i = 0; i < 4; i++) {
    const a = legs[i], c = legs[(i + 1) % 4];
    segs.push(...at(a, y), ...at(c, y + h / 9), ...at(c, y), ...at(a, y + h / 9), ...at(a, y), ...at(c, y));
  }
  const tips = [];
  for (const [y, w] of [[h * 0.72, h * 0.34], [h * 0.9, h * 0.24]]) {
    segs.push(-w, y, 0, w, y, 0, -w, y, 0, 0, y + h * 0.06, 0, w, y, 0, 0, y + h * 0.06, 0);
    tips.push([x - w, y, z], [x + w, y, z]);
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));
  g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color })));
  return tips;
}
// thinner outlines when models are shown small (the map)
// scales every outline; a model inked thinner than the default 1.5 stays proportionally thinner
export function setInkWidth(w) { for (const k of inks) k.material.linewidth = (w * k.width) / 1.5; }
