// Landmarks as small 3D models in the ink style. Each builder returns
// { root, update(T, now, camera), ground } with the front facing +z.
import { THREE, PAL, mat, basic, mesh, box, hip, face, opening, pane, decal, inkify, clockOn, flag, palm, tree, walkers, bird, fogPuff, rnd,
  cypress, pine, shrub, hairlines, courses, airliner, frustum, frustumGeo, prism, prismGeo, gableRoof, bayGeo, texMat, canvasTex, facadeTex, facadeBox, pylon } from "./ink3d.js";

const quad = (a, c, b, t) => (1 - t) ** 2 * a + 2 * t * (1 - t) * c + t * t * b;

export function goldenGate({ headlands = true } = {}) {
  const root = new THREE.Group(), ups = [];
  const O = PAL.orange, OD = PAL.orangeD;
  // headlands either side, so the bridge lands on something
  if (headlands) for (const [x, s, h] of [[-150, 1, 20], [150, 1.25, 34]]) {
    const m = mesh(root, new THREE.SphereGeometry(40 * s, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(PAL.leafL, { flat: true }), x, 0, -6);
    m.userData.headland = true;
    m.scale.set(1, h / (40 * s), 0.8);
  }
  for (const s of [-1, 1]) {
    box(root, 14, 27, 20, s * 104, 0, 0, PAL.stone);
    for (const x of [s * 116, s * 126]) box(root, 3, 27, 10, x, 0, 0, PAL.stone);
    box(root, 30, 2.4, 13, s * 120, 27, 0, O);
  }
  for (const x0 of [-50, 50]) {
    box(root, 22, 8, 26, x0, 0, 0, PAL.stone);
    for (const z of [-8.5, 8.5]) {
      box(root, 7.4, 40, 4.6, x0, 8, z, O);
      box(root, 6.4, 22, 4.2, x0, 48, z, O);
      box(root, 5.6, 14, 3.8, x0, 70, z, O);
    }
    for (const y of [32, 46, 60, 74]) box(root, 6, 2.6, 13, x0, y, 0, O);
    box(root, 7.6, 3, 22, x0, 84, 0, O);
  }
  box(root, 224, 4.5, 15, 0, 25, 0, O);
  box(root, 224, 3, 13, 0, 22, 0, OD);
  // main cables and suspenders on both sides
  const segs = [[-104, 28, -78, 46, -50, 84], [-50, 84, 0, -26, 50, 84], [50, 84, 78, 46, 104, 28]];
  const sus = [];
  for (const z of [-8.5, 8.5]) {
    for (const [x0, y0, cx, cy, x1, y1] of segs) {
      const pts = Array.from({ length: 21 }, (_, i) => new THREE.Vector3(quad(x0, cx, x1, i / 20), quad(y0, cy, y1, i / 20), z));
      const m = mesh(root, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.8, 6), mat(OD)); m.userData.noInk = true;
      for (let x = x0 + 3.5; x < x1 - 1; x += 3.5) { const t = (x - x0) / (x1 - x0); sus.push(x, quad(y0, cy, y1, t), z, x, 29.5, z); }
    }
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sus, 3));
  root.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: OD })));
  inkify(root, { amp: 0.28 });
  // tower lights
  const lights = [-50, 50].map((x) => mesh(root, new THREE.SphereGeometry(1.2, 8, 6), basic(PAL.coral, { transparent: true }), x, 88, 0));
  // traffic both ways
  const cols = ["#FFFFFF", PAL.ink, PAL.gold, "#7E74B8", PAL.leaf];
  const cars = Array.from({ length: 16 }, (_, i) => {
    const m = mesh(root, new THREE.BoxGeometry(4, 1.8, 2.2), mat(cols[i % 5], { hatch: false }), 0, 30.4, i % 2 ? 3.5 : -3.5); m.userData.noInk = true; return m;
  });
  // fog: rolls in from the ocean side, through the towers, and pulls back
  const puffs = Array.from({ length: 30 }, () => fogPuff(root));
  const birds = [0, 1, 2].map(() => bird(root, 1.3));
  ups.push((T) => {
    lights.forEach((l, i) => (l.material.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(T / 300 + i * 2))));
    cars.forEach((c, i) => { const v = i % 2 ? 0.016 : -0.02; c.position.x = ((((T * v + i * 31) % 228) + 228) % 228) - 114; });
    const front = -40 + 70 * Math.sin(T / 11000);
    puffs.forEach((s, i) => {
      const x = -230 + ((T * (0.004 + 0.002 * Math.abs(rnd(i))) + i * 9.5) % 290), r = 26 + 18 * Math.abs(rnd(i * 5));
      s.position.set(x, 6 + 26 * Math.abs(rnd(i * 3)), -18 + 36 * Math.abs(rnd(i * 7)));
      s.scale.set(r, r * 0.7, 1);
      s.material.opacity = 0.95 * Math.sin(((x + 230) / 290) * Math.PI) * Math.min(1, Math.max(0, (front - x) / 30 + 0.5));
    });
    birds.forEach((b, i) => b(T, i).position.set(-30 + i * 10 + 40 * Math.sin(T / 5200 + i), 104 + i * 3 + 4 * Math.sin(T / 900 + i), 10 - i * 6));
  });
  return { root, update: (T, now) => ups.forEach((u) => u(T, now)), water: true, look: { y: 46, w: 300, h: 120 } };
}

export function ferryBuilding() {
  const root = new THREE.Group(), ups = [];
  // the Embarcadero in front, the Bay behind
  mesh(root, new THREE.BoxGeometry(250, 1.2, 46), mat(PAL.ground), 0, 0.6 - 0.01, 12).userData.noInk = true;
  box(root, 128, 24, 22, 0, 0, 0, PAL.wall);
  hip(root, 132, 26, 6, 0, 24, 0, PAL.roof);
  const f = face(root, 0, 0, 64, 11, 0);
  for (let x = -55.2; x <= 55.2; x += 9.2) if (Math.abs(x) > 14) { opening(f, x, 0, 5.4, 10.5); pane(f, x, 14, 4, 5.5, PAL.shade, { ink: false }); }
  for (const s of [-1, 1]) {
    box(root, 15, 31, 26, s * 60, 0, 0, PAL.wall); hip(root, 17, 28, 7, s * 60, 31, 0, PAL.roof);
    opening(face(root, s * 60, 0, 7.5, 13, 0), 0, 0, 6, 14);
  }
  box(root, 27, 40, 27, 0, 0, 0, PAL.wall);
  opening(face(root, 0, 0, 13.5, 13.5, 0), 0, 0, 10, 18);
  box(root, 29, 2, 29, 0, 40, 0, PAL.stone);
  box(root, 15, 46, 15, 0, 42, 0, PAL.wall);
  const tf = face(root, 0, 0, 7.5, 7.5, 0);
  for (const y of [48, 58, 68, 78]) pane(tf, 0, y, 2.4, 5, PAL.ink, { ink: false });
  box(root, 21, 2, 21, 0, 86, 0, PAL.stone);
  box(root, 19, 15, 19, 0, 87, 0, PAL.wall);
  const clocks = [0, 1, 2, 3].map((i) => clockOn(face(root, 0, 0, 9.5, 9.5, i), 94.5, 5.2));
  box(root, 21, 2, 21, 0, 101, 0, PAL.stone);
  box(root, 15, 13, 15, 0, 102, 0, PAL.wall);
  for (let i = 0; i < 4; i++) { const bf = face(root, 0, 0, 7.5, 7.5, i); for (const x of [-4, 0, 4]) opening(bf, x, 104, 2.6, 8.5, PAL.ink); }
  box(root, 18, 1.6, 18, 0, 115, 0, PAL.stone);
  hip(root, 17, 17, 15, 0, 116.6, 0, PAL.roof);
  inkify(root);
  ups.push(flag(root, 0, 131.6, 0));
  // market stalls, palms, people, and pigeons on the roof
  [-100, -90, -80].forEach((x, i) => {
    const g = new THREE.Group(); g.position.set(x, 0, 24); root.add(g);
    box(g, 7, 4, 6, 0, 0, 0, PAL.wall); hip(g, 9, 8, 4, 0, 6, 0, i === 1 ? PAL.gold : PAL.coral);
    for (const [a, b] of [[-3.5, -3], [3.5, -3], [-3.5, 3], [3.5, 3]]) mesh(g, new THREE.CylinderGeometry(0.25, 0.25, 6, 4), mat(PAL.ink), a, 3, b);
    inkify(g, { amp: 0.15 });
  });
  ups.push(palm(root, 76, 18, 40, 1), palm(root, 90, 24, 33, 2), palm(root, -116, 22, 36, 3));
  ups.push(walkers(root, 12, -112, 110, 16, 32, 3));
  const pigeons = Array.from({ length: 6 }, () => bird(root, 0.8));
  ups.push((T) => {
    const ph = (T % 12000) / 12000;
    pigeons.forEach((b, i) => {
      const g = b(T, i), hx = -44 + i * 17;
      if (ph > 0.55 && ph < 0.85) { const q = (ph - 0.55) / 0.3, a = q * Math.PI * 2 + i; g.position.set(hx + Math.sin(a) * 26, 30 + Math.sin(q * Math.PI) * 36, Math.cos(a) * 20); }
      else { g.position.set(hx, 27.5, 10); b(0, 0); }
    });
  });
  ups.push((T, now) => clocks.forEach((c) => c(now)));
  return { root, update: (T, now) => ups.forEach((u) => u(T, now)), water: true, look: { y: 62, w: 250, h: 165 } };
}

// a round strut between two points
function strut(p, a, b, r, color) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
  const m = mesh(p, new THREE.CylinderGeometry(r, r, len, 6), mat(color), (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); return m;
}
const flatPath = (p, x, z, w, d, color = PAL.wall) => { const m = mesh(p, new THREE.BoxGeometry(w, 0.4, d), mat(color, { hatch: false }), x, 0.9, z); m.userData.noInk = true; m.castShadow = false; };
// expanding rings that always face the camera (bells, dings)
function ringer(p, n, color = PAL.coral) {
  return Array.from({ length: n }, () => {
    const m = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40), new THREE.MeshBasicMaterial({ color, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    m.userData.noInk = true; p.add(m); return m;
  });
}

// Sather Tower: a slender granite shaft with stone coursing, big clocks, an open
// belfry of three arches a side, corner pinnacles and a verdigris spire.
export function campanile() {
  const root = new THREE.Group(), ups = [];
  const ST = "#E9E5EE", TEAL = "#5FAEA6";
  mesh(root, new THREE.CylinderGeometry(100, 100, 0.8, 56), mat(PAL.leafL), 0, 0.4, 0).userData.noInk = true;
  flatPath(root, 0, 50, 9, 80); flatPath(root, 0, 34, 150, 7);
  box(root, 40, 3, 40, 0, 0, 0, ST);
  for (const s of [-1, 1]) { box(root, 40, 2.2, 1, 0, 3, s * 19.5, ST); box(root, 1, 2.2, 40, s * 19.5, 3, 0, ST); }
  box(root, 25, 9, 25, 0, 3, 0, ST);
  box(root, 20, 110, 20, 0, 12, 0, ST);
  courses(root, 0, 0, 20, 20, 12, 122, 4.4, 0.16);
  const clocks = [];
  for (let i = 0; i < 4; i++) {
    const f = face(root, 0, 0, 10, 10, i);
    for (let y = 24; y < 104; y += 10) pane(f, 0, y, 1.5, 3.4, PAL.ink, { ink: false });
    decal(face(root, 0, 0, 10, 10, i, 0.1), new THREE.CircleGeometry(7.6, 28), "#8C86A8", 0, 112.5);
    clocks.push(clockOn(face(root, 0, 0, 10, 10, i, 0.2), 112.5, 6.6));
  }
  box(root, 23, 2.4, 23, 0, 122, 0, ST);
  box(root, 21.4, 2.6, 21.4, 0, 124.4, 0, ST);
  // belfry: a stone plate with three arched openings on each face, a dark core behind
  box(root, 13, 24, 13, 0, 127, 0, "#3A2F63", { hatch: false });
  const plate = new THREE.Shape(); plate.moveTo(-10, 0); plate.lineTo(10, 0); plate.lineTo(10, 24); plate.lineTo(-10, 24); plate.lineTo(-10, 0);
  for (const x of [-6, 0, 6]) {
    const h = new THREE.Path(), w = 4.4; h.moveTo(x - w / 2, 3); h.lineTo(x + w / 2, 3); h.lineTo(x + w / 2, 21 - w / 2); h.absarc(x, 21 - w / 2, w / 2, 0, Math.PI, false); h.lineTo(x - w / 2, 3);
    plate.holes.push(h);
  }
  const plateGeo = new THREE.ShapeGeometry(plate, 10);
  for (let i = 0; i < 4; i++) {
    const f = face(root, 0, 0, 10, 10, i, 0.02);
    mesh(f, plateGeo, mat(ST, { side: THREE.DoubleSide }), 0, 127, 0);
    mesh(f, new THREE.BoxGeometry(19, 2, 1), mat(ST), 0, 128.5, -0.8);
  }
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(root, 2.6, 24, 2.6, x * 9.9, 127, z * 9.9, ST);
  box(root, 22, 3, 22, 0, 151, 0, ST);
  box(root, 25, 2.2, 25, 0, 154, 0, ST);
  box(root, 19, 2, 19, 0, 156.2, 0, ST);
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { box(root, 2.6, 5, 2.6, x * 11, 156.2, z * 11, ST); hip(root, 2.8, 2.8, 5, x * 11, 161.2, z * 11, ST); }
  hip(root, 18, 18, 42, 0, 158.2, 0, TEAL);
  box(root, 3.6, 5, 3.6, 0, 200, 0, TEAL); hip(root, 4.4, 4.4, 3, 0, 205, 0, TEAL);
  mesh(root, new THREE.CylinderGeometry(0.35, 0.35, 7, 6), mat(PAL.ink), 0, 211.5, 0);
  mesh(root, new THREE.SphereGeometry(0.9, 8, 6), mat(PAL.gold), 0, 215.5, 0);
  // campus behind: red-tile halls
  box(root, 74, 28, 30, -82, 0, -64, "#EFE8D8"); hip(root, 78, 34, 9, -82, 28, -64, PAL.terra);
  box(root, 52, 22, 26, 80, 0, -72, ST); hip(root, 56, 30, 8, 80, 22, -72, PAL.terra);
  inkify(root);
  const bellGeo = new THREE.LatheGeometry([[0, 0], [2.3, 0.2], [2, 1.2], [1.3, 3], [1, 4.3], [0, 4.5]].map(([x, y]) => new THREE.Vector2(x, y)), 14).translate(0, -4.5, 0);
  const bells = [-6, 0, 6].map((x) => { const m = mesh(root, bellGeo, mat(PAL.gold), x, 145, 8.6); m.userData.noInk = true; return m; });
  const rings = ringer(root, 4);
  const birds = [0, 1, 2].map(() => bird(root, 1));
  ups.push(pine(root, -28, 28, 92, 1), pine(root, 26, -30, 84, 2), pine(root, 34, 30, 64, 3));
  for (const [x, z, r, s] of [[-62, 16, 15, 1], [56, 40, 16, 2], [68, -6, 12, 3], [-54, -32, 13, 4], [-30, 70, 11, 5], [36, 72, 10, 6]]) ups.push(tree(root, x, z, r, s));
  ups.push(walkers(root, 10, -70, 70, 30, 40, 2));
  ups.push((T, now, cam) => {
    clocks.forEach((c) => c(now));
    const ring = (T % 9000) / 9000, swing = ring < 0.32 ? Math.sin(ring * 60) * 0.55 * (1 - ring / 0.32) : 0;
    bells.forEach((b, i) => (b.rotation.x = swing * (i === 1 ? 1 : -0.8)));
    rings.forEach((m, k) => {
      const q = (ring * 2.5 + k * 0.25) % 1; m.visible = ring < 0.4; m.position.set(0, 139, 0);
      m.scale.setScalar(13 + q * 36); m.material.opacity = (1 - q) * 0.75; if (cam) m.quaternion.copy(cam.quaternion);
    });
    birds.forEach((b, i) => {
      const g = b(T, i);
      if (ring < 0.45) { const q = ring / 0.45; g.position.set((i - 1) * 7 + (i - 1) * q * 60, 157 + q * 34 + i * 4, 12 + q * 20); }
      else { b(0, 0); g.position.set((i - 1) * 7, 156.6, 12.6); }
    });
  });
  return { root, update: (T, now, cam) => ups.forEach((u) => u(T, now, cam)), look: { y: 105, w: 170, h: 240 } };
}

// Bay Bridge: the silver west span (two suspension spans meeting at a centre
// anchorage) with the Bay Lights on its cables, Yerba Buena Island, and the white
// single-tower east span.
export function bayBridge() {
  const root = new THREE.Group(), ups = [];
  const SL = "#C4C3D7", WH = "#F4F2F9";
  box(root, 18, 40, 30, -244, 0, 0, PAL.stone); box(root, 20, 60, 30, -118, 0, 0, PAL.stone);
  for (const x of [-200, -155, -81, -36]) {
    box(root, 16, 6, 28, x, 0, 0, PAL.stone);
    for (const z of [-9, 9]) box(root, 4.4, 92, 5, x, 6, z, SL);
    for (const y of [40, 66, 96]) box(root, 3.6, 2.4, 18, x, y, 0, SL);
    for (const [y0, y1] of [[42, 66], [66, 96]]) { strut(root, [x, y0, -9], [x, y1, 9], 0.6, SL); strut(root, [x, y0, 9], [x, y1, -9], 0.6, SL); }
  }
  box(root, 238, 2.2, 22, -125, 34, 0, SL); box(root, 238, 2, 20, -125, 23, 0, SL);
  const tr = []; for (let i = 0, x = -244; x < -6; x += 5, i++) for (const z of [-10.5, 10.5]) tr.push(x, i % 2 ? 24 : 36, z, x + 5, i % 2 ? 36 : 24, z, x, 24, z, x + 5, 24, z, x, 36, z, x + 5, 36, z);
  hairlines(root, tr, 0.55);
  const segs = [[-244, 40, -222, 58, -200, 98], [-200, 98, -177.5, 8, -155, 98], [-155, 98, -136, 66, -118, 60], [-118, 60, -100, 66, -81, 98], [-81, 98, -58.5, 8, -36, 98], [-36, 98, -20, 60, -6, 38]];
  const sus = [], led = [];
  for (const z of [-9.5, 9.5]) for (const [x0, y0, cx, cy, x1, y1] of segs) {
    const pts = Array.from({ length: 17 }, (_, i) => new THREE.Vector3(quad(x0, cx, x1, i / 16), quad(y0, cy, y1, i / 16), z));
    mesh(root, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.75, 6), mat(SL)).userData.noInk = true;
    for (let x = x0 + 3; x < x1 - 1; x += 3) { const y = quad(y0, cy, y1, (x - x0) / (x1 - x0)); if (y < 38) continue; sus.push(x, y, z, x, 36, z); for (let k = 0; k < 5; k++) led.push(x, 36 + ((y - 36) * (k + 0.5)) / 5, z); }
  }
  hairlines(root, sus, 0.35, "#8F8BAE");
  // Yerba Buena Island
  const isl = mesh(root, new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(PAL.leaf, { flat: true }), 26, 0, 0); isl.scale.set(38, 18, 34); isl.userData.noInk = true;
  for (const [x, z, h] of [[14, -6, 34], [26, 4, 40], [36, -12, 30], [44, 8, 26]]) ups.push(pine(root, x, z, h, x));
  // east span: twin white decks, one tower, the cable over its top
  for (const z of [-7.5, 7.5]) box(root, 140, 3, 11, 128, 19, z, WH);
  box(root, 80, 3, 26, 236, 12, 0, WH);
  for (let x = 66; x < 276; x += 16) if (Math.abs(x - 90) > 6) box(root, 3, x > 196 ? 12 : 19, 20, x, 0, 0, PAL.stone);
  for (const [dx, dz] of [[-2.6, -3.2], [2.6, -3.2], [-2.6, 3.2], [2.6, 3.2]]) box(root, 3, 124, 3, 90 + dx, 0, dz, WH);
  for (let y = 30; y < 124; y += 16) box(root, 8, 1.4, 9, 90, y, 0, WH);
  const ecab = [];
  for (const z of [-8, 8]) {
    const pts = [[58, 22], [74, 70], [90, 124], [120, 88], [150, 58], [180, 36], [198, 22]].map(([x, y]) => new THREE.Vector3(x, y, z * (x === 90 ? 0.3 : 1)));
    const curve = new THREE.CatmullRomCurve3(pts);
    mesh(root, new THREE.TubeGeometry(curve, 48, 0.8, 6), mat(WH)).userData.noInk = true;
    for (let i = 1; i < 40; i++) { const p = curve.getPoint(i / 40); if (p.y > 26) ecab.push(p.x, p.y, p.z, p.x, 22, z); }
  }
  hairlines(root, ecab, 0.35, "#8F8BAE");
  inkify(root, { amp: 0.3 });
  // the Bay Lights: thousands of LEDs that ripple along the west span
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(led, 3));
  const lc = new Float32Array(led.length); lg.setAttribute("color", new THREE.BufferAttribute(lc, 3));
  const lights = new THREE.Points(lg, new THREE.PointsMaterial({ size: 3.2, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false })); lights.userData.noInk = true; root.add(lights);
  const cols = [PAL.ink, "#211946", "#2B2160", PAL.gold, PAL.coral, "#5FAEA6", "#FFFFFF", "#A9A2CC"].map((c) => new THREE.Color(c));
  const cars = Array.from({ length: 26 }, (_, i) => { const m = mesh(root, new THREE.BoxGeometry(4, 1.8, 2.2), mat(["#FFFFFF", PAL.ink, PAL.gold, "#7E74B8", PAL.leaf][i % 5], { hatch: false }), 0, 0, 0); m.userData.noInk = true; return m; });
  ups.push((T) => {
    for (let i = 0; i < led.length / 3; i++) {
      const x = led[i * 3], y = led[i * 3 + 1], w = Math.sin(x * 0.045 - T / 700) * Math.sin(y * 0.18 + T / 1100) + Math.sin(x * 0.11 + T / 450) * 0.4;
      const c = w > 0.6 ? cols[3] : w > 0.15 ? cols[6] : cols[7];
      lc[i * 3] = c.r; lc[i * 3 + 1] = c.g; lc[i * 3 + 2] = c.b;
    }
    lg.attributes.color.needsUpdate = true;
    cars.forEach((c, i) => {
      const lane = i % 4, v = lane < 2 ? -0.03 : 0.024, x = ((((T * v + i * 41) % 520) + 520) % 520) - 250;
      const onWest = x < -8, y = onWest ? (lane < 2 ? 36.1 : 25) : x < 60 ? -99 : x > 198 ? 15 - ((x - 198) / 80) * 5 : 22.9;
      c.position.set(x, y + 0.9, onWest ? (lane % 2 ? 4 : -4) : (lane < 2 ? -7.5 : 7.5) + (lane % 2 ? 2 : -2)); c.visible = y > 0;
    });
  });
  return { root, update: (T) => ups.forEach((u) => u(T)), water: true, look: { y: 52, w: 560, h: 150 } };
}


// ---------- round three ----------
const diamond = (f, x, y, s, color) => decal(f, new THREE.PlaneGeometry(s, s).rotateZ(Math.PI / 4), color, x, y, { ink: false });
// a clump of short, bushy fan palms like the ones around Tower Hall
function fanBush(p, x, z, h, seed) {
  const us = [0, 1, 2, 3].map((i) => palm(p, x + rnd(seed + i) * 4, z + rnd(seed * 3 + i) * 4, h * (0.7 + 0.3 * Math.abs(rnd(i + seed))), seed + i, { crown: 0.55, trunk: 0.05, lean: rnd(seed + i * 7) * 0.18 }));
  return (T) => us.forEach((u) => u(T));
}
function umbrellaTree(p, x, z, y0, r, seed = 0) {
  const g = new THREE.Group(); g.position.set(x, y0, z); g.userData.noInk = true; p.add(g);
  mesh(g, new THREE.CylinderGeometry(r * 0.08, r * 0.12, r * 1.1, 6), mat(PAL.trunk), 0, r * 0.55, 0);
  const c = new THREE.Group(); c.position.y = r * 1.25; g.add(c);
  for (const [dx, dz, k] of [[0, 0, 1], [-0.5, 0.2, 0.7], [0.5, -0.1, 0.72], [0.1, 0.5, 0.6]]) mesh(c, new THREE.IcosahedronGeometry(r * k, 1).scale(1, 0.62, 1), mat("#7FA97F", { flat: true }), dx * r, 0, dz * r);
  return (T) => { c.rotation.z = Math.sin(T / 1800 + seed) * 0.03; };
}

// Tower Hall, from the photos: a grey stucco tower with a flared base, corner
// pilasters that rise past the eaves as posts, a steep tiled gable roof, red brick
// trim with diamonds, a corbelled balcony under paired arched windows, and three
// tall windows between brick piers at the bottom. The hall beside it is a cluster:
// a low link, the auditorium with its gable end, arched windows and great arched
// door, a small belvedere, and one more wing.
export function towerHall() {
  const root = new THREE.Group(), ups = [];
  const ST = "#C7C5B2", HL = "#D3CFBD", BR = "#A9472F", TL = "#D3623E", GL = "#3E3A56", CRM = "#EDE6D3";
  mesh(root, new THREE.CylinderGeometry(160, 160, 0.8, 64), mat(PAL.leafL), 0, 0.4, 40).userData.noInk = true;
  flatPath(root, -50, 70, 8, 80); flatPath(root, 0, 30, 220, 6);
  const TX = -50;
  box(root, 33, 2.6, 33, TX, 0, 0, BR);
  box(root, 32, 16, 32, TX, 2.6, 0, ST);
  box(root, 32.6, 3, 32.6, TX, 18.6, 0, BR);
  frustum(root, 32, 26, 7, TX, 21.6, 0, ST);
  box(root, 26, 66, 26, TX, 28.6, 0, ST);
  box(root, 26.8, 2.4, 26.8, TX, 66, 0, BR);
  box(root, 28, 2, 28, TX, 94.6, 0, ST);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const x = TX + sx * 12.4, z = sz * 12.4;
    box(root, 5, 86, 5, x, 21.6, z, ST); frustum(root, 5, 2.2, 5, x, 107.6, z, ST);
  }
  prism(root, 26, 30, 26, TX, 96.6, 0, ST);
  gableRoof(root, 26, 30, 26, TX, 96.6, 0, TL, 1.8);
  for (const i of [0, 3]) {
    const fb = face(root, TX, 0, 16, 16, i, 0.08), fw = face(root, TX, 0, 16, 16, i, 0.18);
    pane(fb, 0, 2.6, 20, 15.4, BR, { ink: false });
    for (const x of [-6.4, 0, 6.4]) pane(fw, x, 3.6, 3.8, 13, GL);
    const fd = face(root, TX, 0, 16.3, 16.3, i, 0.08); for (let x = -13.5; x <= 13.5; x += 4.5) diamond(fd, x, 20.1, 1.5, CRM);
    const fu = face(root, TX, 0, 13, 13, i, 0.08), fu2 = face(root, TX, 0, 13, 13, i, 0.18);
    pane(fu, 0, 74, 12, 17, BR, { ink: false });
    opening(fu2, -2.7, 77, 3.4, 12, GL); opening(fu2, 2.7, 77, 3.4, 12, GL);
    mesh(fu, new THREE.BoxGeometry(13, 3, 4.4), mat(ST), 0, 72.5, 2.2);
    mesh(fu, frustumGeo(5, 13, 4).scale(1, 1, 0.34), mat(ST), 0, 69, 2.2);
    mesh(fu, new THREE.BoxGeometry(13.3, 1, 4.6), mat(BR), 0, 74.3, 2.2);
    const fdd = face(root, TX, 0, 13.4, 13.4, i, 0.08); for (let x = -9; x <= 9; x += 4.5) diamond(fdd, x, 67.2, 1.3, CRM);
  }
  const fg = face(root, TX, 0, 13, 13, 0, 0.12);
  for (const x of [-4.2, 0, 4.2]) opening(fg, x, 100, 2.6, 8, GL);
  mesh(fg, new THREE.BoxGeometry(15, 1, 2.6), mat(TL), 0, 109, 1.3);
  // wall dormers on the roof slopes
  for (const s of [-1, 1]) {
    box(root, 6, 15, 12, TX + s * 10, 94.6, 0, ST); hip(root, 7.4, 14, 5, TX + s * 10, 109.6, 0, TL);
    const fdo = face(root, TX + s * 10, 0, 3, 6, s < 0 ? 3 : 1, 0.12); pane(fdo, 0, 97, 9, 11, BR, { ink: false });
    const fdo2 = face(root, TX + s * 10, 0, 3, 6, s < 0 ? 3 : 1, 0.2); opening(fdo2, -2.2, 98, 2.8, 9, GL); opening(fdo2, 2.2, 98, 2.8, 9, GL);
  }
  // the hall: link wing, auditorium, belvedere, east wing
  box(root, 22, 2.4, 24.4, -26, 0, -4, BR); box(root, 22, 24, 24, -26, 0, -4, HL); hip(root, 25, 27, 7, -26, 24, -4, TL);
  const fa = face(root, -26, -4, 11, 12, 0, 0.12); opening(fa, -4.5, 8, 3.6, 11, GL); opening(fa, 4.5, 8, 3.6, 11, GL);
  box(root, 50.4, 2.6, 46.4, 10, 0, -4, BR); box(root, 50, 32, 46, 10, 0, -4, HL);
  prism(root, 50, 13, 46, 10, 32, -4, HL); gableRoof(root, 50, 13, 46, 10, 32, -4, TL, 1.8);
  const fB = face(root, 10, -4, 25, 23, 0, 0.08), fB2 = face(root, 10, -4, 25, 23, 0, 0.16), fB3 = face(root, 10, -4, 25, 23, 0, 0.24);
  opening(fB, 0, 0, 19, 22, BR); opening(fB2, 0, 0, 15, 19.5, "#4A3E6E"); pane(fB3, 0, 0, 8, 8, "#E8C15A", { ink: false });
  for (const x of [-16, -8, 0, 8, 16]) { opening(fB, x, 22, 5.6, 10, BR); opening(fB2, x, 22.6, 4, 8.6, GL); }
  decal(fB2, new THREE.CircleGeometry(2.2, 16), GL, 0, 38);
  for (let x = -22; x <= 22; x += 4.4) diamond(face(root, 10, -4, 25.2, 23.2, 0, 0.08), x, 1.3, 1.3, CRM);
  box(root, 13, 48, 13, 41, 0, -14, HL); hip(root, 16, 16, 7, 41, 48, -14, TL);
  const fc = face(root, 41, -14, 6.5, 6.5, 0, 0.08), fc2 = face(root, 41, -14, 6.5, 6.5, 0, 0.16);
  pane(fc, 0, 36, 9, 10, BR, { ink: false }); opening(fc2, -2.1, 37, 2.8, 8, GL); opening(fc2, 2.1, 37, 2.8, 8, GL);
  box(root, 32.4, 2.4, 30.4, 54, 0, -2, BR); box(root, 32, 28, 30, 54, 0, -2, HL); hip(root, 35, 33, 8, 54, 28, -2, TL);
  const fD = face(root, 54, -2, 16, 15, 0, 0.08), fD2 = face(root, 54, -2, 16, 15, 0, 0.16);
  for (const x of [-10, -3.4, 3.4, 10]) { opening(fD, x, 16, 5, 9, BR); opening(fD2, x, 16.6, 3.6, 7.8, GL); pane(fD2, x, 5, 3, 5, GL, { ink: false }); }
  mesh(fD, new THREE.BoxGeometry(22, 1, 3.4), mat(BR), 0, 15.4, 1.7);
  const rails = []; for (let x = -11; x <= 11; x += 1.4) rails.push(54 + x, 16, 15 + 3.3, 54 + x, 18.6, 15 + 3.3); rails.push(43, 18.6, 18.3, 65, 18.6, 18.3); hairlines(root, rails, 0.9, BR);
  inkify(root);
  const tall = { crown: 0.15, trunk: 0.011, lean: 0.02 };
  ups.push(palm(root, TX - 30, 30, 150, 4, tall), palm(root, 76, 16, 160, 5, tall), palm(root, -10, -46, 120, 6, tall));
  ups.push(cypress(root, 70, 22, 94, 2), pine(root, -104, -4, 92, 3), tree(root, 96, -24, 15, 7));
  for (const [x, z, h, s] of [[-28, 22, 24, 1], [-12, 26, 20, 2], [24, 26, 26, 3], [36, 24, 18, 4], [-72, 22, 22, 5], [-34, 14, 16, 6]]) ups.push(fanBush(root, x, z, h, s * 11));
  for (let x = -88; x < 72; x += 5) if (Math.abs(x + 50) > 18 || x < -68) shrub(root, x, 21 + (x % 2), 2.6, (x / 5) % 3 === 0 ? "#F2EFF6" : PAL.leaf);
  ups.push(walkers(root, 14, -110, 110, 40, 90, 1));
  return { root, update: (T, now) => ups.forEach((u) => u(T, now)), look: { y: 70, w: 250, h: 190 } };
}

// Salesforce Tower: a rounded obelisk of pale blue glass, banded floor by floor in
// white, swelling slightly before it tapers into an open white lattice crown.
// Millennium Tower and 181 Fremont beside it, the Transit Center park at its feet.
export function salesforce() {
  const root = new THREE.Group(), ups = [];
  mesh(root, new THREE.BoxGeometry(380, 1, 260), mat(PAL.ground), 0, -0.5, 0).userData.noInk = true;
  const rr = (w, r) => { const s = new THREE.Shape(), h = w / 2; s.moveTo(-h + r, -h); s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r); s.lineTo(h, h - r); s.quadraticCurveTo(h, h, h - r, h); s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r); s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h); return s; };
  const H = 236, CR = 204, B = 38, kf = (t) => 1 + 0.03 * Math.sin(t * Math.PI * 0.9) - 0.06 * t - 0.42 * Math.pow(t, 4);
  const body = (y0, y1, scale, steps) => {
    const g = new THREE.ExtrudeGeometry(rr(B * scale, 11 * scale), { depth: y1 - y0, steps, bevelEnabled: false, curveSegments: 6 }).rotateX(-Math.PI / 2).translate(0, y0, 0);
    const a = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < a.count; i++) {
      const k = kf(a.getY(i) / H); a.setX(i, a.getX(i) * k); a.setZ(i, a.getZ(i) * k);
      uv.setXY(i, (Math.atan2(a.getZ(i), a.getX(i)) / (2 * Math.PI) + 0.5) * 36, (a.getY(i) - y0) / (y1 - y0));
    }
    g.computeVertexNormals(); return g;
  };
  const floors = 64;
  const glass = canvasTex(32, 1024, (x, w, h) => {
    const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#D3E2F1"); gr.addColorStop(0.5, "#AFC7E0"); gr.addColorStop(1, "#97B3D2");
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    for (let i = 0; i < floors; i++) { const y = (i / floors) * h; x.fillStyle = "#F7F9FC"; x.fillRect(0, y, w, 4.5); x.fillStyle = "rgba(255,255,255,.35)"; x.fillRect(0, y + 4.5, w, 2); }
    x.fillStyle = "rgba(120,150,190,.5)"; x.fillRect(0, 0, 1.5, h);
  });
  glass.wrapT = THREE.ClampToEdgeWrapping; glass.repeat.set(1, -1); glass.offset.set(0, 1);
  mesh(root, body(0, CR, 1, 64), texMat(glass));
  // crown: open lattice outside, a softly lit core inside, an open rim on top
  const lattice = canvasTex(64, 64, (x) => { x.clearRect(0, 0, 64, 64); x.fillStyle = "#FBFBFE"; x.fillRect(0, 0, 64, 12); x.fillRect(0, 0, 14, 64); });
  lattice.repeat.set(1, 9);
  mesh(root, body(CR, H, 1, 16), texMat(lattice, { side: THREE.DoubleSide, alphaTest: 0.5 })).userData.noInk = true;
  const tex = document.createElement("canvas"); tex.width = 256; tex.height = 96; const tx = tex.getContext("2d"), map = new THREE.CanvasTexture(tex); map.colorSpace = THREE.SRGBColorSpace;
  const core = mesh(root, body(CR, H - 5, 0.78, 8), new THREE.MeshBasicMaterial({ map })); core.userData.noInk = true;
  const kt = kf(1) * B;
  mesh(root, new THREE.CylinderGeometry(kt * 0.42, kt * 0.42, 1.2, 32), mat("#B9B4D2"), 0, H - 4, 0).userData.noInk = true;
  mesh(root, body(0, 12, 1.015, 2), mat("#7E93B3"));
  // neighbours
  const mill = facadeTex("#A9BED6", "#8DA6C4", { mull: "#D3DEEB", tall: 0.92, wide: 0.86 });
  facadeBox(root, 26, 150, 24, 66, 0, -24, mill, { bay: 3.2, floor: 3.4 }); facadeBox(root, 22, 10, 20, 66, 150, -24, mill, { bay: 3.2, floor: 3.4 }); facadeBox(root, 16, 8, 14, 66, 160, -24, mill, { bay: 3.2, floor: 3.4 });
  const fre = facadeTex("#DADDE6", "#9DAEC4", { tall: 0.86, wide: 0.8 });
  facadeBox(root, 20, 160, 20, -56, 0, -34, fre, { bay: 3, floor: 3.2 });
  const xb = []; for (let y = 0; y < 160; y += 40) for (const [ax, az, bx, bz] of [[-10, 10.15, 10, 10.15], [10.15, 10, 10.15, -10]]) {
    xb.push(-56 + ax, y, -34 + az, -56 + bx, y + 40, -34 + bz, -56 + bx, y, -34 + bz, -56 + ax, y + 40, -34 + az);
  }
  hairlines(root, xb, 0.95, "#FFFFFF");
  const wedge = new THREE.Shape(); wedge.moveTo(-10, 0); wedge.lineTo(10, 0); wedge.lineTo(10, 6); wedge.lineTo(-10, 22); wedge.lineTo(-10, 0);
  mesh(root, new THREE.ExtrudeGeometry(wedge, { depth: 20, bevelEnabled: false }), mat("#E6E8EF"), -56, 160, -44);
  mesh(root, new THREE.CylinderGeometry(0.4, 0.6, 26, 6), mat("#E6E8EF"), -64, 195, -34);
  for (const [x, z, w, h, d, wall, win] of [[-112, 6, 34, 64, 30, "#E6DCC6", "#6F6A86"], [112, 22, 30, 74, 28, "#D7CEC1", "#5E5A78"], [-96, -66, 36, 96, 30, "#DCD8E5", "#7C86A4"],
    [104, -70, 32, 112, 28, "#E9E3D4", "#6F6A86"], [30, -88, 40, 80, 30, "#C98D72", "#5D4A52"]]) facadeBox(root, w, h, d, x, 0, z, facadeTex(wall, win, { tall: 0.55, wide: 0.5 }), { bay: 4.5, floor: 4.2 });
  // Transit Center: perforated white skin, a park on the roof
  const skin = canvasTex(64, 64, (x) => { x.fillStyle = "#F8F7FB"; x.fillRect(0, 0, 64, 64); x.fillStyle = "#D9D5E6"; for (let i = 0; i < 64; i += 8) for (let j = 0; j < 64; j += 8) { x.beginPath(); x.arc(i + ((j / 8) % 2) * 4, j + 4 + 2 * Math.sin(i / 10), 1.6, 0, 7); x.fill(); } });
  facadeBox(root, 190, 16, 30, -6, 0, 56, skin, { bay: 12, floor: 8, roof: PAL.leafL });
  for (let x = -92; x < 84; x += 13) ups.push(tree(root, x, 52 + ((x / 13) % 2 ? 5 : -4), 4.5, x));
  inkify(root);
  root.children.filter((c) => c.isGroup && c.userData.noInk).slice(-14).forEach((g) => (g.position.y = 16));
  const rig = mesh(root, new THREE.BoxGeometry(7, 2, 2), mat(PAL.coral, { hatch: false }), 0, 150, 0); rig.userData.noInk = true;
  const puffs = Array.from({ length: 16 }, () => fogPuff(root)), birds = [0, 1].map(() => bird(root, 1.3));
  ups.push((T) => {
    const t = T / 1000;
    tx.fillStyle = "#E7E1F2"; tx.fillRect(0, 0, 256, 96);
    for (let i = 0; i < 8; i++) {
      const x = (i * 37 + t * 8) % 300 - 22, y = 48 + Math.sin(t * 0.5 + i) * 24, r = 30 + 10 * Math.sin(t * 0.4 + i * 2);
      const g = tx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, ["rgba(255,184,120,.9)", "rgba(255,255,255,.95)", "rgba(126,116,184,.6)"][i % 3]); g.addColorStop(1, "rgba(255,255,255,0)");
      tx.fillStyle = g; tx.fillRect(0, 0, 256, 96);
    }
    map.needsUpdate = true;
    const q = (T % 30000) / 30000, y = 170 - q * 150; rig.position.set(-5, y, (B / 2) * kf(y / H) + 1.4);
    puffs.forEach((s, i) => {
      const x = -190 + ((T * (0.005 + 0.002 * Math.abs(rnd(i))) + i * 26) % 380), r = 34 + 16 * Math.abs(rnd(i * 5));
      s.position.set(x, 150 + 70 * Math.abs(rnd(i * 3)), -40 + 70 * Math.abs(rnd(i * 7))); s.scale.set(r, r * 0.5, 1);
      s.material.opacity = 0.85 * Math.sin(((x + 190) / 380) * Math.PI) * (0.55 + 0.45 * Math.sin(T / 9000));
    });
    birds.forEach((b, i) => b(T, i).position.set(-70 + 140 * ((T / 16000 + i * 0.1) % 1), 120 + i * 6, 50));
  });
  return { root, update: (T, now) => ups.forEach((u) => u(T, now)), look: { y: 118, w: 270, h: 262 } };
}

// Downtown San José with City Hall: the white drum and the great louvred glass
// dome of the rotunda, the white office tower, the plaza fountains, the old Bank
// of Italy tower with its cupola, and jets on final approach to SJC.
export function sanJose({ jets: withJets = true } = {}) {
  const root = new THREE.Group(), ups = [];
  mesh(root, new THREE.BoxGeometry(420, 1, 280), mat(PAL.ground), 0, -0.5, 0).userData.noInk = true;
  const st = []; for (let x = -190; x <= 190; x += 48) st.push(x, 0.1, -130, x, 0.1, 130); for (let z = -110; z <= 120; z += 56) st.push(-200, 0.1, z, 200, 0.1, z);
  hairlines(root, st, 0.18);
  for (const [x, z, w, h, d, wall, win] of [[-118, -46, 26, 58, 24, "#E6E1EF", "#7D86A6"], [-74, -70, 24, 84, 22, "#DAD4EA", "#6F7896"], [-30, -60, 30, 74, 26, "#EFEBF6", "#8B95B4"],
    [98, -70, 24, 88, 24, "#E4DCCB", "#6F6A86"], [134, -34, 26, 52, 24, "#DDD7EB", "#7C86A4"], [-150, -12, 24, 40, 22, "#E8E0CF", "#6F6A86"], [12, -96, 34, 64, 26, "#E2DFEC", "#8B95B4"]])
    facadeBox(root, w, h, d, x, 0, z, facadeTex(wall, win, { tall: 0.58, wide: 0.62 }), { bay: 4, floor: 4 });
  // Bank of Italy building with its cupola
  facadeBox(root, 16, 54, 16, -96, 0, 6, facadeTex("#EADFC4", "#6F6A86", { tall: 0.6, wide: 0.5 }), { bay: 3.2, floor: 4 });
  box(root, 12, 8, 12, -96, 54, 6, "#EADFC4"); mesh(root, new THREE.CylinderGeometry(4, 4, 5, 12), mat("#EADFC4"), -96, 64.5, 6);
  mesh(root, new THREE.SphereGeometry(4.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat("#C9B98F"), -96, 67, 6); mesh(root, new THREE.CylinderGeometry(0.3, 0.3, 8, 5), mat(PAL.ink), -96, 75, 6);
  // City Hall office tower and council wing
  facadeBox(root, 44, 96, 22, 56, 0, -2, facadeTex("#F5F5F9", "#A9BBCE", { band: "#FFFFFF", tall: 0.4, wide: 0.96 }), { bay: 4, floor: 3.4 });
  facadeBox(root, 40, 26, 30, -50, 0, 34, facadeTex("#F5F5F9", "#9FB3C8", { tall: 0.5, wide: 0.9 }), { bay: 4, floor: 4 });
  // the rotunda
  const RX = 4, RZ = 46, R = 22;
  mesh(root, new THREE.CylinderGeometry(R, R, 24, 56), mat("#EEF0F5"), RX, 12, RZ);
  const front = mesh(root, new THREE.CylinderGeometry(R + 0.12, R + 0.12, 7, 40, 1, true, -Math.PI * 0.35, Math.PI * 0.7), basic("#6F9EA9", { side: THREE.DoubleSide }), RX, 3.5, RZ); front.userData.noInk = true;
  const pl = []; for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2; pl.push(RX + Math.cos(a) * (R + 0.15), 7, RZ + Math.sin(a) * (R + 0.15), RX + Math.cos(a) * (R + 0.15), 24, RZ + Math.sin(a) * (R + 0.15)); }
  for (const y of [13, 18.5]) for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2, b = ((i + 1) / 48) * Math.PI * 2; pl.push(RX + Math.cos(a) * (R + 0.15), y, RZ + Math.sin(a) * (R + 0.15), RX + Math.cos(b) * (R + 0.15), y, RZ + Math.sin(b) * (R + 0.15)); }
  hairlines(root, pl, 0.22);
  mesh(root, new THREE.CylinderGeometry(R + 3, R + 3, 1, 48, 1, false, -Math.PI * 0.4, Math.PI * 0.8), mat("#F4F5F9"), RX, 9, RZ);
  mesh(root, new THREE.CylinderGeometry(R + 0.2, R + 0.2, 3, 48), basic("#79ADB3"), RX, 25.5, RZ).userData.noInk = true;
  const DH = 30, ell = (th) => [R * Math.cos(th), 27 + DH * Math.sin(th)];
  mesh(root, new THREE.LatheGeometry(Array.from({ length: 17 }, (_, i) => { const [r, y] = ell((i / 16) * (Math.PI / 2)); return new THREE.Vector2(Math.max(r - 0.6, 0.01), y - 0.2); }), 48), mat("#8FC1C4", { side: THREE.DoubleSide }), RX, 0, RZ).userData.noInk = true;
  for (let i = 0; i < 18; i++) {
    const t0 = 0.04 + i * 0.052, [r0, y0] = ell(t0 * (Math.PI / 2)), [r1, y1] = ell((t0 + 0.022) * (Math.PI / 2));
    const m = mesh(root, new THREE.CylinderGeometry(r1 + 0.3, r0 + 0.3, y1 - y0, 56, 1, true), mat("#F3F4F8", { side: THREE.DoubleSide }), RX, (y0 + y1) / 2, RZ); m.userData.noInk = true;
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, pts = Array.from({ length: 13 }, (_, k) => { const [r, y] = ell((k / 12) * (Math.PI / 2)); return new THREE.Vector3(RX + Math.cos(a) * (r + 0.5), y, RZ + Math.sin(a) * (r + 0.5)); });
    mesh(root, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.35, 5), mat("#F7F7FA")).userData.noInk = true;
  }
  mesh(root, new THREE.TorusGeometry(3, 0.5, 6, 20).rotateX(Math.PI / 2), mat("#F7F7FA"), RX, 27 + DH, RZ);
  // plaza and its grid of fountains
  box(root, 120, 1, 50, 10, 0, 88, "#F6F4FA");
  inkify(root);
  const jets = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { const m = mesh(root, new THREE.CylinderGeometry(0.25, 0.4, 1, 6).translate(0, 0.5, 0), basic("#FFFFFF", { transparent: true, opacity: 0.85 }), 40 + i * 6, 1, 80 + j * 6); m.userData.noInk = true; m.castShadow = false; jets.push(m); }
  ups.push((T) => jets.forEach((m, k) => (m.scale.y = 1 + 7 * Math.max(0, Math.sin(T / 700 - k * 0.6)))));
  for (let x = -170; x <= 170; x += 34) if (Math.abs(x - 40) > 30) ups.push(palm(root, x, 118, 34, x));
  ups.push(walkers(root, 14, -40, 90, 76, 108, 4));
  const jetsAir = withJets ? [airliner(root), airliner(root, "#7E74B8")] : [];
  ups.push((T) => jetsAir.forEach((j, i) => {
    const q = ((T / 12000) + i * 0.5) % 1, x = -320 + q * 640, z = -80 + q * 120, y = 176 - q * 100;
    j.g.position.set(x, y, z); j.g.rotation.set(0, -Math.atan2(120, 640), 0.06); j.update(T);
  }));
  return { root, update: (T, now) => ups.forEach((u) => u(T, now)), look: { y: 66, w: 330, h: 190 } };
}

// San Mateo-Hayward Bridge, from the photos: two long low trestles side by side,
// then the high-rise: tall white column pairs on round caissons, a deck that
// arches between them, a rust-red fascia, and a long row of curved lamp posts.
// Power lines march across the water beside it on lattice pylons.
export function haywardBridge() {
  const root = new THREE.Group(), ups = [];
  const W = "#EFEEF4", RED = "#B4533A", DK = "#7B7695";
  const prof = (x) => (x < 20 || x > 250 ? 8 : 8 + 50 * Math.pow(Math.sin((Math.PI * (x - 20)) / 230), 1.1));
  for (const [x, w] of [[-320, 50], [282, 50]]) { const m = mesh(root, new THREE.BoxGeometry(w, 3, 160), mat(PAL.leafL), x, 0, 0); m.userData.noInk = true; }
  // the older low trestle, to the south
  box(root, 560, 1.2, 10, -18, 4, -18, W); box(root, 560, 0.9, 0.4, -18, 4.6, -12.8, RED);
  for (let x = -294; x < 258; x += 7) { for (const z of [-21.5, -18, -14.5]) box(root, 0.8, 4, 0.8, x, 0, z, "#B3AEC7"); }
  // the main trestle
  box(root, 316, 1.6, 15, -136, 8, 0, W);
  for (const z of [-7.6, 7.6]) box(root, 316, 1.4, 0.5, -136, 8.2, z, RED);
  for (let x = -290; x < 20; x += 11) { for (const z of [-5, 5]) box(root, 1.6, 8, 1.6, x, 0, z, "#C9C5D8"); box(root, 1.8, 1.2, 15, x, 6.8, 0, "#C9C5D8"); }
  // the high-rise: deck arching between column pairs on caissons
  const P = []; for (let x = 20; x <= 250; x += 23) P.push(x);
  for (let i = 0; i < P.length - 1; i++) {
    const x0 = P[i], x1 = P[i + 1], s = new THREE.Shape(), n = 10;
    for (let k = 0; k <= n; k++) { const x = x0 + ((x1 - x0) * k) / n; k ? s.lineTo(x, prof(x) + 1.6) : s.moveTo(x, prof(x) + 1.6); }
    for (let k = n; k >= 0; k--) { const x = x0 + ((x1 - x0) * k) / n, f = k / n, haunch = 1.6 + 6.5 * Math.pow(Math.abs(2 * f - 1), 2.2); s.lineTo(x, prof(x) - haunch); }
    mesh(root, new THREE.ExtrudeGeometry(s, { depth: 15, bevelEnabled: false, curveSegments: 2 }), mat(W), 0, 0, -7.5);
    const a = Math.atan2(prof(x1) - prof(x0), x1 - x0), L = Math.hypot(x1 - x0, prof(x1) - prof(x0));
    for (const z of [-7.8, 7.8]) { const f = box(root, L + 0.3, 1.5, 0.5, (x0 + x1) / 2, (prof(x0) + prof(x1)) / 2 + 0.4, z, RED); f.rotation.z = a; }
  }
  for (const x of P) {
    const top = prof(x) - 7.4;
    for (const z of [-5, 5]) { mesh(root, new THREE.CylinderGeometry(3, 3, 6, 16), mat(DK), x, 1, z); box(root, 3.4, Math.max(1, top - 4), 3.4, x, 4, z, W); }
    box(root, 4, 2, 15, x, top - 0.5, 0, W);
  }
  // curved lamp posts along both edges
  const lampGeo = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 11, 0), new THREE.Vector3(0, 10, 3.2)), 10, 0.22, 5);
  for (let x = -280; x < 250; x += x > 20 ? 11.5 : 22) for (const s of [-1, 1]) {
    const m = mesh(root, lampGeo, mat("#E4E2EC"), x, prof(x) + 1.6, s * 7.8); m.rotation.y = s > 0 ? Math.PI : 0; m.userData.noInk = true;
  }
  const rail = []; for (let x = -290; x < 250; x += 3) for (const z of [-7.4, 7.4]) rail.push(x, prof(x) + 2.6, z, x + 3, prof(x + 3) + 2.6, z);
  hairlines(root, rail, 0.55);
  inkify(root, { amp: 0.22, threshold: 35 });
  // power lines on lattice pylons, out on the water
  const tips = []; for (let x = -260; x <= 260; x += 104) tips.push(pylon(root, x, 70, 50));
  const wires = [];
  for (let i = 0; i < tips.length - 1; i++) for (let k = 0; k < 4; k++) {
    const [ax, ay, az] = tips[i][k], [bx, by, bz] = tips[i + 1][k];
    for (let j = 0; j < 16; j++) { const f0 = j / 16, f1 = (j + 1) / 16, sag = (f) => 7 * 4 * f * (1 - f); wires.push(ax + (bx - ax) * f0, ay - sag(f0), az, ax + (bx - ax) * f1, ay - sag(f1), az); }
  }
  hairlines(root, wires, 0.5);
  const cars = Array.from({ length: 34 }, (_, i) => { const m = mesh(root, new THREE.BoxGeometry(4, 1.8, 2.2), mat(["#FFFFFF", PAL.ink, PAL.gold, "#7E74B8", PAL.coral][i % 5], { hatch: false })); m.userData.noInk = true; return m; });
  const pel = Array.from({ length: 5 }, () => bird(root, 2.8));
  ups.push((T) => {
    cars.forEach((c, i) => {
      const dir = i % 2 ? 1 : -1, x = ((((T * 0.03 * dir + i * 33) % 540) + 540) % 540) - 290;
      c.position.set(x, prof(x) + 2.5, dir > 0 ? 3.6 : -3.6); c.rotation.z = Math.atan2(prof(x + 0.5) - prof(x - 0.5), 1);
    });
    pel.forEach((b, i) => { const g = b(T * 0.55, i); g.position.set(-220 + ((T / 60) % 440) - i * 11, 9 + Math.sin(T / 1600 + i) * 1.5, 30 + i * 3); });
  });
  return { root, update: (T) => ups.forEach((u) => u(T)), water: true, look: { y: 28, w: 520, h: 120 } };
}

// Alamo Square's Painted Ladies with a Powell Street cable car. Each house has a
// raised garage level, stairs up to a columned porch, a two-storey canted bay, a
// front gable with an attic window, and its own paint scheme. Umbrella street trees.
export function cableCar() {
  const root = new THREE.Group(), ups = [], a = 0.17, Y = (x) => 30 + x * Math.tan(a);
  const hill = new THREE.Shape(); hill.moveTo(-170, 0); hill.lineTo(170, 0); hill.lineTo(170, Y(170)); hill.lineTo(-170, Y(-170)); hill.lineTo(-170, 0);
  const hm = mesh(root, new THREE.ExtrudeGeometry(hill, { depth: 150, bevelEnabled: false }), mat("#BFDDC5"), 0, 0, -130); hm.userData.noInk = true; hm.userData.hill = true;
  const strip = (w, z, color, lift = 0.3) => { const m = mesh(root, new THREE.BoxGeometry(340, 0.6, w), mat(color, { hatch: false }), 0, Y(0) + lift, z); m.rotation.z = a; m.userData.noInk = true; };
  strip(18, 7, "#B3ACCB"); strip(5, -2.5, "#F2EFF7", 0.5); strip(4, 18, "#F2EFF7", 0.5);
  const rails = []; for (const z of [2.6, 4.4, 9.6, 11.4]) rails.push(-160, Y(-160) + 0.7, z, 160, Y(160) + 0.7, z); hairlines(root, rails, 0.6);
  const slot = []; for (const z of [3.5, 10.5]) slot.push(-160, Y(-160) + 0.7, z, 160, Y(160) + 0.7, z); hairlines(root, slot, 0.9);
  const GL = "#4D4672", ROOF = "#6A6478";
  const schemes = [["#4F5E8A", "#F2EEE4", "#C9A24A"], ["#A9B98F", "#F4EFE2", "#B4473A"], ["#E7CF7E", "#FBF7EC", "#4E8C8A"], ["#EFE2C6", "#7A5A4A", "#5E7FB0"],
    ["#9FB7D2", "#FBF8F1", "#D2A847"], ["#E9B9AE", "#FBF4E8", "#6E9C7A"], ["#F1EEE6", "#9A8CB8", "#C55B4D"]];
  schemes.forEach(([main, trim, acc], i) => {
    const cx = -78 + i * 26, y0 = Y(cx), yb = Y(cx - 13) - 1, z = -27, fz = -13;
    box(root, 25, y0 + 8 - yb, 28, cx, yb, z, "#EEE8DA");
    box(root, 25, 24, 28, cx, y0 + 8, z, main);
    box(root, 26, 1.6, 29, cx, y0 + 32, z, trim); box(root, 25.4, 1, 28.4, cx, y0 + 20, z, trim);
    const f = face(root, cx, z, 12.5, 14, 0, 0.1), f2 = face(root, cx, z, 12.5, 14, 0, 0.2);
    pane(f, -5, y0 + 0.5 - yb + yb, 9, 6.4, "#8F88A8", { ink: true });
    opening(f, 6.5, y0 + 8.4, 7, 10.5, trim); opening(f2, 6.5, y0 + 8.4, 5, 9, acc);
    pane(f, 6.5, y0 + 21.5, 5.4, 8.4, trim, { ink: false }); pane(f2, 6.5, y0 + 22.2, 4, 7, GL);
    for (const x of [3, 10]) mesh(root, new THREE.CylinderGeometry(0.45, 0.45, 10, 8), mat(trim), cx + x, y0 + 13, fz + 1.4);
    // canted bay over both floors
    mesh(root, bayGeo(11, 3.2, 23), mat(main), cx - 5, y0 + 8.6, fz);
    box(root, 12, 1.2, 4.4, cx - 5, y0 + 19.6, fz + 1.6, trim); box(root, 12.4, 1.4, 4.8, cx - 5, y0 + 31.4, fz + 1.8, trim);
    for (const fy of [y0 + 11, y0 + 22]) {
      const gfront = new THREE.Group(); gfront.position.set(cx - 5, 0, fz + 3.3); root.add(gfront); pane(gfront, 0, fy, 3.2, 7, GL);
      for (const s of [-1, 1]) { const g = new THREE.Group(); g.position.set(cx - 5 + s * 4.1, 0, fz + 1.65); g.rotation.y = s * Math.PI / 4; root.add(g); pane(g, 0, fy, 2.2, 7, GL); }
    }
    // stairs up to the porch
    const top = y0 + 8.4, bot = Y(cx + 6.5), n = 7;
    for (let k = 0; k < n; k++) box(root, 6, Math.max(0.6, bot + ((top - bot) * (k + 1)) / n - Y(cx + 6.5) + 1), 1.4, cx + 6.5, Y(cx + 6.5) - 1, -0.6 - k * 1.7, trim);
    // front gable with attic window and a main roof behind
    prism(root, 25, 13, 6, cx, y0 + 33.6, fz - 3, main); gableRoof(root, 25, 13, 6, cx, y0 + 33.6, fz - 3, trim, 0.9);
    const gf = face(root, cx, fz - 3, 12.5, 3, 0, 0.12); pane(gf, 0, y0 + 36.2, 4, 4.6, GL); decal(gf, new THREE.CircleGeometry(3.4, 16, 0, Math.PI), acc, 0, y0 + 41.4);
    hip(root, 25.4, 24, 10, cx, y0 + 33.6, z - 4, ROOF);
    if (i === 0) {
      mesh(root, new THREE.CylinderGeometry(5.2, 5.2, 30, 8), mat(main), cx - 9, y0 + 23, fz + 1);
      mesh(root, new THREE.ConeGeometry(6.2, 11, 8), mat(ROOF), cx - 9, y0 + 43.5, fz + 1);
    }
    if (i < schemes.length - 1) ups.push(umbrellaTree(root, cx + 13, 0.5, Y(cx + 13) + 0.6, 6.5, i));
  });
  inkify(root, { amp: 0.25 });
  // two cars: one climbing, one coming down the other track
  const MAR = "#7C2333", CRM = "#F1E5C7", WOOD = "#B5895B";
  const makeCar = () => {
    const car = new THREE.Group(); root.add(car);
    box(car, 23, 1.2, 7, 0, 0.4, 0, "#3A2F45");
    for (const x of [-7, 7]) for (const z of [-3.2, 3.2]) mesh(car, new THREE.CylinderGeometry(1, 1, 0.6, 12).rotateX(Math.PI / 2), mat("#3A2F45"), x, 0.6, z);
    box(car, 24, 3.4, 8, 0, 1.6, 0, MAR);
    box(car, 24.4, 0.6, 9.6, 0, 4.4, 0, WOOD);
    box(car, 12, 7.4, 8, 0, 5, 0, CRM); box(car, 12.2, 2.4, 8.2, 0, 5, 0, MAR);
    for (const i of [0, 2]) { const w = face(car, 0, 0, 6, 4, i, 0.08); for (const x of [-3.8, 0, 3.8]) pane(w, x, 8, 3, 3.6, GL, { ink: false }); }
    for (const i of [1, 3]) { const w = face(car, 0, 0, 6, 4, i, 0.08); pane(w, 0, 8, 4.4, 3.6, GL, { ink: false }); }
    for (const s of [-1, 1]) {
      box(car, 9.4, 2.6, 1, s * 11.4, 5, 0, WOOD); box(car, 9.4, 0.8, 7.6, s * 11.4, 7.4, 0, WOOD);
      for (const x of [6.6, 9.4, 12.2]) for (const z of [-3.9, 3.9]) mesh(car, new THREE.CylinderGeometry(0.22, 0.22, 7.6, 5), mat(CRM), s * x, 8.6, z);
      box(car, 0.5, 3.2, 8, s * 12.1, 1.6, 0, CRM);
    }
    const roof = new THREE.Shape(); roof.moveTo(-13.6, 0); roof.quadraticCurveTo(-13.4, 1.6, -11.5, 1.8); roof.lineTo(11.5, 1.8); roof.quadraticCurveTo(13.4, 1.6, 13.6, 0); roof.lineTo(-13.6, 0);
    mesh(car, new THREE.ExtrudeGeometry(roof, { depth: 9.6, bevelEnabled: false }), mat(MAR), 0, 12.4, -4.8);
    box(car, 14, 1.4, 4.6, 0, 14.2, 0, CRM);
    const trim = []; for (const z of [-4.05, 4.05]) trim.push(-12, 3.6, z, 12, 3.6, z, -12, 12.5, z * 1.2, 12, 12.5, z * 1.2); hairlines(car, trim, 0.9, PAL.gold);
    mesh(car, new THREE.SphereGeometry(0.75, 10, 8), basic("#FFF3B8"), 12.5, 3.6, 0);
    const bell = mesh(car, new THREE.SphereGeometry(0.9, 10, 8), mat(PAL.gold), 7, 15.6, 0);
    const riders = [[-12, 5.1, "#FF5A47"], [-9.4, 5.1, "#7E74B8"], [9.4, 5.1, "#F2C14E"], [12, 5.1, "#9FC8A9"], [-11, -5.1, "#211946"], [11.2, -5.1, "#5FAEA6"], [7.4, 0, "#3A2F63"]];
    const ppl = riders.map(([x, z, c]) => {
      const g = new THREE.Group(); g.position.set(x, 4.8, z); car.add(g);
      mesh(g, new THREE.CapsuleGeometry(0.85, 2.4, 2, 8), mat(c, { hatch: false }), 0, 2.3, 0); mesh(g, new THREE.SphereGeometry(0.78, 10, 8), mat("#3A2F63", { hatch: false }), 0, 4.7, 0); return g;
    });
    car.userData.ownInk = true; inkify(car, { amp: 0.12, width: 1.3 });
    return { car, bell, ppl, rings: ringer(root, 3, PAL.gold) };
  };
  const cars = [makeCar(), makeCar()];
  ups.push((T, now, cam) => cars.forEach((c, i) => {
    const per = 18000, q = ((T / per) + i * 0.5) % 1, go = q < 0.42 ? q / 0.42 : q < 0.5 ? 1 : q < 0.92 ? 1 - (q - 0.5) / 0.42 : 0;
    const e = go * go * (3 - 2 * go), s = i ? 95 - e * 190 : -95 + e * 190;
    c.car.position.set(s, Y(s) + 0.9, i ? 10.5 : 3.5); c.car.rotation.set(0, i ? Math.PI : 0, i ? -a : a);
    c.ppl.forEach((p, k) => (p.rotation.z = Math.sin(T / 300 + k) * 0.05));
    const ding = q > 0.42 && q < 0.5 ? (q - 0.42) / 0.08 : q > 0.92 ? (q - 0.92) / 0.08 : -1;
    const bp = new THREE.Vector3(); c.bell.getWorldPosition(bp); root.worldToLocal(bp);
    c.rings.forEach((m, k) => {
      const r = ding < 0 ? 0 : (ding * 2 + k * 0.33) % 1; m.visible = ding >= 0; m.position.copy(bp);
      m.scale.setScalar(2 + r * 12); m.material.opacity = (1 - r) * 0.9; if (cam) m.quaternion.copy(cam.quaternion);
    });
  }));
  return { root, update: (T, now, cam) => ups.forEach((u) => u(T, now, cam)), look: { y: 50, w: 175, h: 105 } };
}

// ---------- round four: airports, Stanford, Alcatraz, Hangar One ----------
// a runway: dark strip, dashed centre line, threshold bars, numbers left out on purpose
function runway(p, len, w, x, z, rot = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot; g.userData.keep = true; g.userData.noInk = true; p.add(g);
  const strip = mesh(g, new THREE.BoxGeometry(len, 0.5, w), mat("#9D97B8", { hatch: false }), 0, 0.25, 0); strip.castShadow = false; strip.userData.keep = true;
  const seg = [];
  for (let s = -len / 2 + 14; s < len / 2 - 14; s += 9) seg.push(s, 0.56, 0, s + 4.5, 0.56, 0);
  for (const e of [-1, 1]) for (let k = -w / 2 + 1; k <= w / 2 - 1; k += 1.4) seg.push(e * (len / 2 - 2), 0.56, k, e * (len / 2 - 7), 0.56, k);
  const l = hairlines(g, seg, 0.95, "#FFFFFF"); l.userData.keep = true;
  return g;
}
function taxiway(p, pts, w = 4) {
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1], [bx, bz] = pts[i], len = Math.hypot(bx - ax, bz - az);
    const m = mesh(p, new THREE.BoxGeometry(len + w, 0.4, w), mat("#B4AFCB", { hatch: false }), (ax + bx) / 2, 0.2, (az + bz) / 2);
    m.rotation.y = -Math.atan2(bz - az, bx - ax); m.castShadow = false; m.userData.noInk = true; m.userData.keep = true;
  }
}
// fly a plane through key frames [t, x, y, z]; heading follows the motion
function flight(plane, keys, T, period, off = 0) {
  const q = ((T / period) + off) % 1;
  let i = 1; while (i < keys.length - 1 && keys[i][0] < q) i++;
  const a = keys[i - 1], b = keys[i], f = Math.min(1, Math.max(0, (q - a[0]) / (b[0] - a[0] || 1))), e = f * f * (3 - 2 * f);
  const k = a[4] === "lin" ? f : e, x = a[1] + (b[1] - a[1]) * k, y = a[2] + (b[2] - a[2]) * k, z = a[3] + (b[3] - a[3]) * k;
  const dx = b[1] - a[1], dz = b[3] - a[3], dy = b[2] - a[2], len = Math.hypot(dx, dz) || 1;
  plane.g.position.set(x, y, z); plane.g.rotation.set(0, -Math.atan2(dz, dx), Math.atan2(dy, len) * 0.9);
  plane.g.visible = q > 0.001 && (keys.at(-1)[5] !== "hide" || q < keys.at(-1)[0] - 0.001) && q <= keys.at(-1)[0];
  plane.update(T);
}

// SFO: the International Terminal's three gull-wing roofs, the boarding piers, the
// domestic horseshoe around the garage, the AirTrain loop, and the torch-shaped tower
// with its blue glass seam. Two jets land side by side on 28L and 28R, one departs on 1R.
export function sfo() {
  const root = new THREE.Group(), ups = [];
  mesh(root, new THREE.BoxGeometry(520, 1, 260), mat(PAL.ground), 0, -0.5, 0).userData.noInk = true;
  runway(root, 300, 9, 70, -40, 0.17); runway(root, 300, 9, 66, -18, 0.17);
  runway(root, 230, 9, -6, -100, Math.PI / 2 - 0.28); runway(root, 230, 9, 14, -96, Math.PI / 2 - 0.28);
  taxiway(root, [[-70, 4], [80, -4], [210, -30]]); taxiway(root, [[-70, 4], [-40, -60], [-10, -150]]);
  // International Terminal: glass hall under three gull-wing roofs
  const IX = -120, IZ = 6;
  facadeBox(root, 120, 16, 28, IX, 0, IZ, facadeTex("#DDE6EF", "#9EB6CC", { mull: "#F4F6FA", tall: 0.9, wide: 0.92 }), { bay: 4, floor: 5.4 });
  const wing = new THREE.Shape(); wing.moveTo(-62, 0);
  for (let i = 0; i < 3; i++) { const x0 = -62 + i * 41.3; wing.lineTo(x0, 2); wing.quadraticCurveTo(x0 + 20.6, 15, x0 + 41.3, 2); }
  wing.lineTo(62, 0); wing.lineTo(-62, 0);
  mesh(root, new THREE.ExtrudeGeometry(wing, { depth: 34, bevelEnabled: false, curveSegments: 10 }), mat("#F4F3F8"), IX, 16, IZ - 17);
  const tr = []; for (let i = 0; i < 3; i++) for (let k = 1; k < 8; k++) { const x0 = IX - 62 + i * 41.3, x = x0 + (k / 8) * 41.3, t = k / 8, y = 16 + 2 + 13 * 4 * t * (1 - t) * 0.98; tr.push(x, 16.2, IZ + 17.4, x, y, IZ + 17.4); }
  hairlines(root, tr, 0.5);
  for (const [x, len] of [[-170, 80], [-72, 70]]) { box(root, 12, 9, len, x, 0, IZ - 14 - len / 2, "#ECEAF3"); box(root, 13, 1.4, len + 1, x, 9, IZ - 14 - len / 2, "#D6D2E6"); }
  // domestic terminals in a horseshoe around the garage
  for (const [a, w] of [[-0.5, 46], [0.55, 40], [1.6, 46]]) {
    const r = 62, x = -110 + Math.sin(a) * r, z = 70 + Math.cos(a) * r * 0.6;
    const m = facadeBox(root, w, 12, 18, x, 0, z, facadeTex("#E9E6F0", "#9FB3C8", { tall: 0.7, wide: 0.86 }), { bay: 4, floor: 4 }); m.rotation.y = a;
  }
  facadeBox(root, 70, 18, 40, -110, 0, 74, facadeTex("#DCD8E6", "#8E88A8", { tall: 0.35, wide: 0.9 }), { bay: 5, floor: 4.5 });
  // the tower
  const prof = [[7, 0], [6.4, 6], [4.9, 18], [4.4, 28], [4.9, 40], [6.2, 52], [7.4, 61], [7.6, 63]].map(([r, y]) => new THREE.Vector2(r, y));
  const TX = -58, TZ = 34;
  mesh(root, new THREE.LatheGeometry(prof, 28), mat("#DADCE6"), TX, 0, TZ);
  const seam = new THREE.CatmullRomCurve3(prof.map((v) => new THREE.Vector3(TX + v.x * 0.72 + 0.2, v.y, TZ + v.x * 0.72 + 0.2)));
  mesh(root, new THREE.TubeGeometry(seam, 30, 1.1, 6), basic("#5B9BD8")).userData.noInk = true;
  for (let i = 0; i < 3; i++) { const m = mesh(root, new THREE.BoxGeometry(0.8, 6, 0.5), basic("#3E3A56"), TX - 3 + i * 2.6, 50, TZ + 6.3); m.rotation.z = 0.35; m.userData.noInk = true; }
  mesh(root, new THREE.CylinderGeometry(5.6, 5.4, 6, 24), mat("#3B4A68", { hatch: false }), TX, 66, TZ);
  mesh(root, new THREE.CylinderGeometry(7.2, 7.2, 0.8, 24), mat("#EEF0F5"), TX, 69.4, TZ);
  mesh(root, new THREE.CylinderGeometry(4.6, 5.6, 3, 24), mat("#EEF0F5"), TX, 71.3, TZ);
  for (const a of [0, 1.3, 2.6, 4, 5.2]) mesh(root, new THREE.CylinderGeometry(0.15, 0.15, 5, 4), mat(PAL.ink), TX + Math.cos(a) * 3.4, 75, TZ + Math.sin(a) * 3.4);
  const beacon = mesh(root, new THREE.SphereGeometry(0.8, 8, 6), basic("#FF3B30", { transparent: true }), TX, 77.6, TZ);
  // AirTrain loop on its guideway
  const loop = new THREE.CatmullRomCurve3([[-190, 30], [-150, 52], [-100, 30], [-40, 30], [0, 70], [-60, 130], [-160, 120], [-210, 80]].map(([x, z]) => new THREE.Vector3(x, 10, z)), true);
  mesh(root, new THREE.TubeGeometry(loop, 120, 1.3, 5, true), mat("#E4E2EC")).userData.noInk = true;
  for (let i = 0; i < 30; i++) { const p = loop.getPoint(i / 30); box(root, 1.4, 9, 1.4, p.x, 0, p.z, "#CFCBDF"); }
  inkify(root);
  const atrain = new THREE.Group(); root.add(atrain);
  box(atrain, 14, 3, 3.2, 0, 0, 0, "#F4F3F8"); box(atrain, 14.2, 0.8, 3.3, 0, 1.4, 0, "#2F6DB5");
  // parked jets at the piers, and the moving ones
  for (const [x, z, r] of [[-155, -30, 0], [-155, -58, 0], [-86, -36, Math.PI], [-86, -62, Math.PI], [-60, 50, 0.6]]) { const a = airliner(root, ["#2F6DB5", PAL.coral, "#7E74B8"][Math.abs(Math.round(x + z)) % 3]); a.g.position.set(x, 3.4, z); a.g.rotation.y = r; a.g.scale.setScalar(0.42); }
  const land = [airliner(root, "#2F6DB5"), airliner(root, PAL.coral)], dep = airliner(root, "#7E74B8");
  for (const a of [...land, dep]) a.g.scale.setScalar(0.5);
  const c = Math.cos(0.17), s = Math.sin(0.17), R = (u, v, z0) => [70 + u * c, 70 - 0, z0 - u * s];
  const arr = (z0) => { const A = R(520, 0, z0), B = R(140, 0, z0), C = R(-40, 0, z0), D = R(-110, 0, z0); return [[0, A[0], 90, A[2]], [0.55, B[0], 3.4, B[2]], [0.8, C[0], 3.4, C[2]], [0.9, D[0], 3.4, D[2], 0, "hide"]]; };
  const k1 = arr(-40), k2 = arr(-18);
  const dc = Math.cos(Math.PI / 2 - 0.28), ds = Math.sin(Math.PI / 2 - 0.28), D = (u) => [14 + u * dc, -96 - u * ds];
  const kd = [[0, ...[D(110)[0], 3.4, D(110)[1]]], [0.15, D(100)[0], 3.4, D(100)[1]], [0.45, D(-60)[0], 3.4, D(-60)[1]], [0.75, D(-300)[0], 70, D(-300)[1]], [0.9, D(-480)[0], 130, D(-480)[1], 0, "hide"]];
  kd[0] = [0, D(118)[0], 3.4, D(118)[1]];
  ups.push((T) => {
    beacon.material.opacity = Math.sin(T / 400) > 0.2 ? 1 : 0.15;
    const p = loop.getPointAt((T / 26000) % 1), q = loop.getPointAt((T / 26000 + 0.004) % 1);
    atrain.position.set(p.x, 12, p.z); atrain.lookAt(q.x, 12, q.z); atrain.rotateY(Math.PI / 2);
    flight(land[0], k1, T, 16000, 0); flight(land[1], k2, T, 16000, 0.94); flight(dep, kd, T, 14000, 0.4);
  });
  return { root, update: (T) => ups.forEach((u) => u(T)), look: { y: 30, w: 420, h: 150 } };
}

// SJC: two parallel runways, Terminal B's long ribbed silver wave, Terminal A, the
// garage. Planes land over downtown (from +x) and depart to the north-west (-x).
export function sjc() {
  const root = new THREE.Group(), ups = [];
  mesh(root, new THREE.BoxGeometry(420, 1, 200), mat(PAL.ground), 0, -0.5, 0).userData.noInk = true;
  runway(root, 300, 8, 0, -20); runway(root, 300, 8, 0, -4);
  taxiway(root, [[-150, 8], [150, 8]]);
  // Terminal B: a long silver wave, ribbed, curling over at the top
  const w = new THREE.Shape(); w.moveTo(0, 0); w.lineTo(22, 0); w.lineTo(22, 6); w.quadraticCurveTo(20, 17, 9, 21); w.quadraticCurveTo(2, 22, -2, 19); w.quadraticCurveTo(1, 16, 4, 13); w.quadraticCurveTo(2, 6, 0, 0);
  const tb = mesh(root, new THREE.ExtrudeGeometry(w, { depth: 110, bevelEnabled: false, curveSegments: 10 }).rotateY(Math.PI / 2), mat("#D9DCE6"), -70, 0, 34);
  const ribs = []; for (let k = 1; k < 16; k++) { const pt = w.getPoint(0.3 + (k / 16) * 0.45); ribs.push(-70, pt.y + 0.1, 34 - pt.x, 40, pt.y + 0.1, 34 - pt.x); }
  hairlines(root, ribs, 0.4);
  facadeBox(root, 110, 10, 3, -15, 0, 22, facadeTex("#CFE0EA", "#8FB0C8", { mull: "#F4F6FA", tall: 0.9, wide: 0.94 }), { bay: 3, floor: 5 });
  // Terminal A and the garage
  facadeBox(root, 56, 13, 22, 82, 0, 32, facadeTex("#EEEBF3", "#9FB3C8", { tall: 0.62, wide: 0.86 }), { bay: 4, floor: 4.3 });
  hip(root, 58, 24, 4, 82, 13, 32, "#C8C3DA");
  facadeBox(root, 44, 16, 30, 120, 0, 72, facadeTex("#DCD8E6", "#8E88A8", { tall: 0.35, wide: 0.9 }), { bay: 5, floor: 4 });
  box(root, 6, 26, 6, 40, 0, 56, "#E6E4EE"); mesh(root, new THREE.CylinderGeometry(4.6, 3.6, 5, 8), mat("#3B4A68", { hatch: false }), 40, 28.5, 56); hip(root, 9, 9, 2.4, 40, 31, 56, "#EEF0F5");
  inkify(root);
  for (const [x, z] of [[-60, 18], [-40, 18], [-20, 18], [0, 18], [20, 18], [74, 18], [94, 18]]) { const a = airliner(root, x % 40 ? "#304CB2" : "#E3A93A"); a.g.position.set(x, 3.4, z); a.g.rotation.y = -Math.PI / 2; a.g.scale.setScalar(0.4); }
  for (let x = -150; x <= 150; x += 44) ups.push(palm(root, x, -44, 26, x));
  // arrivals come in low over downtown San José, departures climb out to the north-west
  const arr = airliner(root, "#304CB2"), dep = airliner(root, "#E3A93A");
  arr.g.scale.setScalar(0.5); dep.g.scale.setScalar(0.5);
  const ka = [[0, 1100, 150, -4], [0.6, 150, 3.4, -4], [0.82, -60, 3.4, -4], [0.9, -100, 3.4, -4, 0, "hide"]];
  const kd = [[0, 140, 3.4, -20], [0.12, 130, 3.4, -20], [0.42, -60, 3.4, -20], [0.7, -360, 80, -40], [0.9, -700, 170, -70, 0, "hide"]];
  ups.push((T) => { flight(arr, ka, T, 15000, 0.1); flight(dep, kd, T, 15000, 0.55); });
  return { root, update: (T) => ups.forEach((u) => u(T)), look: { y: 26, w: 270, h: 110 } };
}

// Stanford: Palm Drive leading to the Main Quad, its sandstone arcades and red tile
// roofs, Memorial Church's gold mosaic gable, and Hoover Tower with its red dome.
export function stanford() {
  const root = new THREE.Group(), ups = [];
  const SS = "#E2C79C", SD = "#C9A97A", TILE = "#C8603F";
  mesh(root, new THREE.CylinderGeometry(150, 150, 0.8, 56), mat(PAL.leafL), 0, 0.4, 20).userData.noInk = true;
  flatPath(root, 0, 110, 16, 150, "#EDE6D6");
  // the Oval in front
  const oval = mesh(root, new THREE.CylinderGeometry(26, 26, 1, 40), mat("#B8D8BC"), 0, 0.6, 62); oval.scale.z = 0.6; oval.userData.noInk = true;
  // Main Quad: four arcaded ranges around a court, an opening in the front range
  const Q = { x: 0, z: -24, w: 130, d: 96, t: 16, h: 13 };
  const range = (cx, cz, w, d, front) => {
    box(root, w, Q.h, d, cx, 0, cz, SS); hip(root, w + 2, d + 2, 5, cx, Q.h, cz, TILE);
    if (front) { const f = face(root, cx, cz, w / 2, d / 2, 0, 0.1); for (let x = -w / 2 + 4; x <= w / 2 - 4; x += 5.4) opening(f, x, 0, 3.8, 8.4, "#9C7A55"); }
  };
  range(-38, Q.z + Q.d / 2, 54, Q.t, true); range(38, Q.z + Q.d / 2, 54, Q.t, true);
  range(Q.x, Q.z - Q.d / 2, Q.w, Q.t, false);
  range(-Q.w / 2 + Q.t / 2, Q.z, Q.t, Q.d - Q.t, false); range(Q.w / 2 - Q.t / 2, Q.z, Q.t, Q.d - Q.t, false);
  box(root, 26, 18, 18, 0, 0, Q.z + Q.d / 2, SS); hip(root, 28, 20, 6, 0, 18, Q.z + Q.d / 2, TILE);
  opening(face(root, 0, Q.z + Q.d / 2, 13, 9, 0, 0.1), 0, 0, 12, 15, "#8C6B48");
  // Memorial Church, facing the court
  const CZ = -40;
  box(root, 40, 26, 50, 0, 0, CZ, SS);
  prism(root, 40, 20, 50, 0, 26, CZ, SS); gableRoof(root, 40, 20, 50, 0, 26, CZ, TILE, 1.4);
  for (const s of [-1, 1]) { box(root, 12, 16, 40, s * 26, 0, CZ - 4, SS); hip(root, 14, 42, 5, s * 26, 16, CZ - 4, TILE); }
  const mosaic = canvasTex(256, 160, (x, W, H) => {
    x.fillStyle = "#E3B65A"; x.fillRect(0, 0, W, H);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(255,240,190,.5)"); g.addColorStop(1, "rgba(160,100,40,.25)"); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { const px = 20 + (i * 37) % 220, py = 60 + ((i * 53) % 90); x.fillStyle = ["#7A4B8C", "#3E6FA8", "#B2443A", "#F5E6C0", "#4C8A6A"][i % 5]; x.beginPath(); x.ellipse(px, py, 5, 13, 0, 0, 7); x.fill(); x.fillStyle = "#F2D9B6"; x.beginPath(); x.arc(px, py - 15, 4, 0, 7); x.fill(); }
    x.fillStyle = "#FFF4D0"; x.beginPath(); x.arc(W / 2, 46, 18, 0, 7); x.fill();
  }, false);
  const gtri = new THREE.Shape(); gtri.moveTo(-19.6, 0); gtri.lineTo(19.6, 0); gtri.lineTo(0, 19.6); gtri.lineTo(-19.6, 0);
  const gg = new THREE.ShapeGeometry(gtri); const uv = gg.attributes.uv, ps = gg.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, ps.getX(i) / 39.2 + 0.5, ps.getY(i) / 19.6);
  const gm = mesh(root, gg, texMat(mosaic, { hatch: false }), 0, 26.2, CZ + 25.12); gm.userData.noInk = true; gm.castShadow = false;
  const cf = face(root, 0, CZ, 20, 25, 0, 0.14);
  pane(cf, 0, 15, 36, 9, "#E8BE68", { ink: false });
  decal(cf, new THREE.CircleGeometry(4.2, 24), "#3E3A56", 0, 30); decal(face(root, 0, CZ, 20, 25, 0, 0.2), new THREE.RingGeometry(3.4, 4.2, 24), "#E3C9A0", 0, 30);
  for (const x of [-13, -9.5, 9.5, 13]) opening(cf, x, 18.5, 2.4, 6, "#3E3A56");
  for (const x of [-11, 0, 11]) opening(face(root, 0, CZ, 20, 25, 0, 0.2), x, 0, 7.2, 12, "#5A4430");
  mesh(root, new THREE.BoxGeometry(0.6, 5, 0.6), mat(PAL.gold), 0, 48.6, CZ + 25); mesh(root, new THREE.BoxGeometry(3, 0.6, 0.6), mat(PAL.gold), 0, 49.6, CZ + 25);
  // Hoover Tower
  const HX = 92, HZ = -6;
  box(root, 30, 16, 26, HX, 0, HZ, SS); hip(root, 32, 28, 4, HX, 16, HZ, TILE);
  opening(face(root, HX, HZ, 15, 13, 0, 0.1), 0, 0, 9, 13, "#8C6B48");
  frustum(root, 22, 18, 66, HX, 16, HZ, SS);
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(root, 3.4, 60, 3.4, HX + sx * 9.6, 16, HZ + sz * 9.6, SD);
  const hf = face(root, HX, HZ, 9.6, 9.6, 0, 0.12); for (const y of [30, 42, 54, 66]) for (const x of [-3, 0, 3]) pane(hf, x, y, 1, 5, "#7A5E43", { ink: false });
  box(root, 19, 3, 19, HX, 82, HZ, SD);
  box(root, 16, 11, 16, HX, 85, HZ, SS);
  for (let i = 0; i < 4; i++) { const f = face(root, HX, HZ, 8, 8, i, 0.1); for (const x of [-4.2, 0, 4.2]) opening(f, x, 86.5, 2.6, 7.4, "#3E3A56"); }
  box(root, 18, 1.6, 18, HX, 96, HZ, SD);
  mesh(root, new THREE.CylinderGeometry(7.4, 7.6, 3, 24), mat(SS), HX, 99.1, HZ);
  mesh(root, new THREE.SphereGeometry(7.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.9, 1), mat(TILE), HX, 100.6, HZ);
  mesh(root, new THREE.CylinderGeometry(1.4, 1.6, 4, 10), mat(SS), HX, 109.3, HZ); mesh(root, new THREE.ConeGeometry(1.6, 3, 10), mat(TILE), HX, 112.8, HZ);
  inkify(root);
  // Palm Drive, oaks, students and bikes
  for (let z = 90; z <= 180; z += 13) for (const s of [-1, 1]) ups.push(palm(root, s * 13, z, 30, z + s, { crown: 0.3, trunk: 0.03, lean: 0.03 }));
  for (const [x, z, r, sd] of [[-90, 50, 13, 1], [-110, 10, 15, 2], [-96, -60, 14, 3], [70, 50, 12, 4], [130, 30, 14, 5], [126, -50, 13, 6], [-50, 80, 11, 7], [50, 84, 11, 8]]) ups.push(tree(root, x, z, r, sd));
  ups.push(walkers(root, 14, -60, 60, 40, 76, 3), walkers(root, 6, -8, 8, 80, 170, 5));
  const rings = ringer(root, 3, PAL.gold);
  ups.push((T, now, cam) => {
    const ring = (T % 12000) / 12000;
    rings.forEach((m, k) => { const q = (ring * 3 + k * 0.33) % 1; m.visible = ring < 0.3; m.position.set(HX, 90, HZ); m.scale.setScalar(10 + q * 30); m.material.opacity = (1 - q) * 0.7; if (cam) m.quaternion.copy(cam.quaternion); });
  });
  return { root, update: (T, now, cam) => ups.forEach((u) => u(T, now, cam)), look: { y: 40, w: 300, h: 160 } };
}

// Alcatraz: a rocky island, the long cellhouse, the tall tapering lighthouse with its
// sweeping beam, the water tower, and the roofless ruin of the warden's house.
export function alcatraz() {
  const root = new THREE.Group(), ups = [];
  const outline = [[-62, 6], [-52, -10], [-30, -18], [-4, -20], [24, -22], [48, -14], [62, -2], [58, 12], [34, 20], [6, 22], [-24, 20], [-48, 16]];
  const isl = new THREE.Shape(); outline.forEach(([x, z], i) => (i ? isl.lineTo(x, -z) : isl.moveTo(x, -z)));
  const tier = (k, y0, h, color) => mesh(root, new THREE.ExtrudeGeometry(isl, { depth: h, bevelEnabled: true, bevelThickness: 2.5, bevelSize: 3, bevelSegments: 1, curveSegments: 4 }).rotateX(-Math.PI / 2).scale(k, 1, k * 0.95), mat(color, { flat: true }), 0, y0, 0);
  tier(1, -2, 4, "#BFAE92"); tier(0.86, 3, 4, "#C8B89D"); tier(0.7, 7, 3, "#AFC6A0");
  box(root, 64, 2, 22, 6, 11, -4, "#D8CCB3");
  // cellhouse
  facadeBox(root, 56, 14, 18, 6, 13, -4, facadeTex("#EDE5D2", "#5E5A70", { tall: 0.62, wide: 0.42 }), { bay: 3, floor: 4.6 });
  box(root, 58, 1.4, 19, 6, 27, -4, "#D9CFB8");
  for (let x = -16; x <= 28; x += 8) box(root, 4, 1.4, 6, x, 28.4, -4, "#BFB6A1");
  // lighthouse
  mesh(root, new THREE.CylinderGeometry(2.3, 3.6, 34, 8), mat("#C9C2B3"), -30, 13 + 17, 2);
  mesh(root, new THREE.CylinderGeometry(3.8, 3.8, 0.8, 8), mat("#5E5A70"), -30, 47.4, 2);
  mesh(root, new THREE.CylinderGeometry(2.2, 2.2, 3.6, 12), mat("#3B4A68", { hatch: false }), -30, 49.6, 2);
  mesh(root, new THREE.ConeGeometry(2.6, 2.4, 12), mat("#5E5A70"), -30, 52.6, 2);
  // water tower on legs, warden's house ruin, dock
  for (const [dx, dz] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) box(root, 0.8, 16, 0.8, 44 + dx, 11, -8 + dz, "#8E88A8");
  mesh(root, new THREE.CylinderGeometry(5, 5, 7, 16), mat("#F1EEE6"), 44, 30.5, -8); mesh(root, new THREE.ConeGeometry(5.2, 2.4, 16), mat("#C9C2B3"), 44, 35.2, -8);
  for (const [w, d, x, z] of [[16, 1, -42, -4], [16, 1, -42, 8], [1, 12, -50, 2], [1, 12, -34, 2]]) box(root, w, 9, d, x, 12, z, "#E4D6BE");
  box(root, 2, 13, 2, -46, 12, 8, "#B9AB93");
  box(root, 22, 6, 8, 40, 0, 20, "#E9E1CD"); box(root, 24, 1, 6, 40, 1, 27, "#B9AB93");
  inkify(root);
  for (const [x, z] of [[-20, 12], [24, 10], [52, 4], [-54, 4]]) ups.push(tree(root, x, z, 3.6, x));
  root.children.slice(-4).forEach((g) => (g.position.y = 11.6));
  // the beam: a soft cone that turns around the lantern
  const beamG = new THREE.Group(); beamG.position.set(-30, 49.6, 2); root.add(beamG);
  const beam = new THREE.Mesh(new THREE.ConeGeometry(7, 90, 24, 1, true).translate(0, -45, 0).rotateZ(Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#FFE9A8", transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide }));
  beam.userData.noInk = true; beamG.add(beam);
  const lamp = mesh(root, new THREE.SphereGeometry(1.6, 10, 8), basic("#FFF3B8", { transparent: true }), -30, 49.6, 2);
  ups.push((T) => { beamG.rotation.y = T / 1600; beam.material.opacity = 0.16 + 0.14 * Math.max(0, Math.cos(beamG.rotation.y - Math.PI * 1.5)); lamp.material.opacity = 0.6 + 0.4 * Math.sin(T / 300); });
  return { root, update: (T) => ups.forEach((u) => u(T)), water: true, look: { y: 22, w: 160, h: 80 } };
}

// Hangar One at Moffett Field: the giant airship hangar with rounded clamshell ends,
// white walls with rows of dark windows and a dark ribbed roof; an airship drifts by.
export function hangarOne() {
  const root = new THREE.Group(), ups = [];
  mesh(root, new THREE.BoxGeometry(420, 1, 220), mat(PAL.ground), 0, -0.5, 0).userData.noInk = true;
  runway(root, 300, 9, 0, -64, 0.03); runway(root, 300, 9, 6, -84, 0.03);
  box(root, 220, 0.6, 90, 0, 0, 0, "#DEDBE8").userData.noInk = true;
  const W = 32, H = 42, BODY = 100, split = 0.52;
  const prof = (a, b) => Array.from({ length: 17 }, (_, i) => { const t = a + ((b - a) * i) / 16; return new THREE.Vector2(Math.max(0.01, W * Math.pow(Math.cos(t), 0.8)), H * Math.sin(t)); });
  const lower = prof(0, Math.asin(split)), upper = prof(Math.asin(split), Math.PI / 2);
  const section = (pts) => { const s = new THREE.Shape(); s.moveTo(pts[0].x, pts[0].y); pts.forEach((p) => s.lineTo(p.x, p.y)); [...pts].reverse().forEach((p) => s.lineTo(-p.x, p.y)); return s; };
  const shell = (pts, color) => {
    const band = new THREE.Shape(); const outer = pts, inner = pts.map((p) => new THREE.Vector2(p.x * 0.96, p.y * 0.985));
    band.moveTo(outer[0].x, outer[0].y); outer.forEach((p) => band.lineTo(p.x, p.y)); [...outer].reverse().forEach((p) => band.lineTo(-p.x, p.y)); inner.forEach((p) => band.lineTo(-p.x, p.y)); [...inner].reverse().forEach((p) => band.lineTo(p.x, p.y));
    mesh(root, new THREE.ExtrudeGeometry(section(pts), { depth: BODY, bevelEnabled: false, curveSegments: 4 }).rotateY(Math.PI / 2).translate(-BODY / 2, 0, 0), mat(color));
    for (const s of [-1, 1]) { const cap = mesh(root, new THREE.LatheGeometry(pts, 24, 0, Math.PI), mat(color, { side: THREE.DoubleSide }), s * BODY / 2, 0, 0); cap.rotation.y = s > 0 ? 0 : Math.PI; }
  };
  shell(lower, "#F1F0F5"); shell(upper, "#6E6577");
  // window rows and roof ribs along the long sides
  const segs = [];
  for (const s of [-1, 1]) for (let x = -BODY / 2 + 3; x < BODY / 2; x += 4.2) for (const y of [8, 16]) { const t = Math.asin(y / H), z = W * Math.pow(Math.cos(t), 0.8) + 0.25; segs.push(x, y, s * z, x, y + 4.5, s * z); }
  hairlines(root, segs, 0.85, "#3E3A56");
  const rib = []; for (let x = -BODY / 2; x <= BODY / 2; x += 6.25) for (let i = 0; i < upper.length - 1; i++) for (const s of [-1, 1]) rib.push(x, upper[i].y + 0.3, s * (upper[i].x + 0.3), x, upper[i + 1].y + 0.3, s * (upper[i + 1].x + 0.3));
  hairlines(root, rib, 0.35, "#E6E3EE");
  inkify(root, { threshold: 40 });
  // the airship
  const ship = new THREE.Group(); root.add(ship);
  mesh(ship, new THREE.SphereGeometry(1, 24, 14).scale(26, 7, 7), mat("#F4F3F8"));
  mesh(ship, new THREE.CylinderGeometry(7.05, 7.05, 2.4, 24, 1, true).rotateZ(Math.PI / 2), basic(PAL.coral, { side: THREE.DoubleSide }), 4, 0, 0).userData.noInk = true;
  box(ship, 7, 2.6, 3, 2, -8.6, 0, "#DCD8E6");
  for (const [rx, ry] of [[0, 0], [Math.PI / 2, 0]]) { const f = mesh(ship, new THREE.BoxGeometry(6, 0.5, 15), mat("#E6E4EE"), -22, 0, 0); f.rotation.x = rx; }
  ship.userData.ownInk = true; inkify(ship, { amp: 0.12, width: 1.2 });
  ups.push((T) => {
    const a = T / 14000;
    ship.position.set(Math.cos(a) * 120, 74 + Math.sin(T / 2600) * 3, Math.sin(a) * 50 + 10);
    ship.rotation.y = -a - Math.PI / 2; ship.rotation.z = Math.sin(T / 2600) * 0.03;
  });
  return { root, update: (T) => ups.forEach((u) => u(T)), look: { y: 34, w: 300, h: 120 } };
}

// Port of Oakland: a row of white container cranes on the Outer Harbor wharf (the ones said to
// have inspired the AT-AT walkers). Idle booms are raised; two cranes work a ship at the berth,
// their trolleys carrying boxes ashore. Container stacks fill the yard behind. Water is +z.
export function oaklandPort() {
  const root = new THREE.Group(), ups = [];
  const WH = "#F4F2F8", STAY = "#9C97B5";
  const CC = ["#C8473A", "#4C6FA8", "#8A3B4A", "#3E8C88", "#E2A33B", "#6E6577", "#F0EDE6", "#2F6E9E"];
  box(root, 210, 2, 34, 0, 0, -8, "#DEDBE8");
  // the yard: stacks of 40-foot boxes in rows
  for (let r = 0; r < 4; r++) for (let x = -92; x <= 92; x += 13.5) {
    if (rnd(x * 3 + r) > 0.75) continue;
    const n = 1 + Math.floor((rnd(x + r * 7) * 0.5 + 0.5) * 4);
    box(root, 12.4, 2.6 * n, 2.5, x, 2, -30 - r * 3.2, CC[Math.abs(Math.floor(rnd(x * 1.7 + r) * 40)) % CC.length]);
  }
  for (let r = 0; r < 3; r++) for (let x = -92; x <= 92; x += 13.5) {
    if (rnd(x * 5 + r + 9) > 0.6) continue;
    const n = 1 + Math.floor((rnd(x * 2 + r * 3) * 0.5 + 0.5) * 3);
    box(root, 12.4, 2.6 * n, 2.5, x, 2, -46 - r * 3.2, CC[Math.abs(Math.floor(rnd(x * 2.3 + r * 5) * 40)) % CC.length]);
  }
  // the ship at the berth: dark hull with a red boot top, boxes on deck, bridge aft
  const ship = new THREE.Group(); ship.position.set(4, 0, 22); root.add(ship);
  box(ship, 128, 9, 17, 0, -3, 0, "#2F2B52");
  box(ship, 128.4, 1.6, 17.4, 0, -2.2, 0, "#B5453A");
  const bow = mesh(ship, new THREE.CylinderGeometry(8.5, 8.5, 9, 3, 1), mat("#2F2B52"), 64, 1.5, 0); bow.rotation.y = Math.PI; bow.scale.set(1.2, 1, 1);
  box(ship, 12, 13, 15, -52, 6, 0, WH); box(ship, 5, 1.4, 20, -48, 18, 0, WH); box(ship, 4, 6, 4, -58, 19, 0, PAL.coral);
  for (let x = -38; x <= 52; x += 13) for (let c = -2; c <= 2; c++) {
    const n = 2 + Math.floor((rnd(x * 0.7 + c * 3) * 0.5 + 0.5) * 3);
    box(ship, 12.4, 2.5 * n, 2.9, x, 6, c * 3.1, CC[Math.abs(Math.floor(rnd(x + c * 11) * 50)) % CC.length]);
  }
  // cranes
  const crane = (x, working) => {
    const g = new THREE.Group(); g.position.set(x, 2, 0); root.add(g);
    for (const lx of [-6, 6]) for (const lz of [-9, 9]) box(g, 1.6, 24, 1.6, lx, 0, lz, WH);
    for (const lz of [-9, 9]) { box(g, 14, 1.6, 1.6, 0, 22, lz, WH); box(g, 13, 1.1, 1.1, 0, 11, lz, WH); }
    for (const lx of [-6, 6]) box(g, 1.6, 1.6, 20, lx, 22, 0, WH);
    for (const lx of [-3, 3]) { box(g, 1.2, 2, 30, lx, 25, -6, WH); box(g, 1, 2, 1, lx, 23.6, -9, WH); box(g, 1, 2, 1, lx, 23.6, 9, WH); }
    box(g, 9, 5, 10, 0, 27, -16, WH); box(g, 9.4, 0.6, 10.4, 0, 32, -16, "#C9C3E6");
    const apex = [0, 50, 3];
    for (const lx of [-3.5, 3.5]) { strut(g, [lx, 27, 9], [lx * 0.5, apex[1], apex[2]], 0.75, WH); strut(g, [lx, 27, -13], [lx * 0.5, apex[1], apex[2]], 0.75, WH); }
    box(g, 4, 2, 2, 0, 49, 3, WH);
    // the boom hinges at the seaside legs; idle booms stand raised
    const piv = new THREE.Group(); piv.position.set(0, 26, 9); g.add(piv); piv.userData.ownInk = true;
    for (const lx of [-3, 3]) box(piv, 1.1, 1.8, 34, lx, -0.9, 17, WH);
    for (let z = 5; z < 34; z += 7) box(piv, 7, 0.6, 0.6, 0, 0.2, z, WH);
    piv.rotation.x = working ? 0 : -1.15;
    piv.updateMatrixWorld(true);
    const tip = new THREE.Vector3(0, 0.6, 33); piv.localToWorld(tip); g.worldToLocal(tip);
    const s1 = strut(g, apex, [tip.x, tip.y, tip.z], 0.22, STAY); s1.userData.noInk = true;
    const s2 = strut(g, apex, [0, 27, -21], 0.22, STAY); s2.userData.noInk = true;
    inkify(piv, { amp: 0.18, width: 1 });
    if (!working) return;
    // trolley, cab and spreader; it carries a box from the ship to the apron and goes back
    const tr = new THREE.Group(); tr.userData.noInk = true; g.add(tr);
    box(tr, 5, 2, 4, 0, 27, 0, "#E4E0F0"); box(tr, 2.4, 2.2, 2.4, 2.2, 24.8, 0, "#6E6577");
    const cable = mesh(tr, new THREE.CylinderGeometry(0.15, 0.15, 1, 4), mat(STAY, { hatch: false }), 0, 0, 0); cable.castShadow = false;
    const spreader = box(tr, 12.4, 0.6, 2.6, 0, 0, 0, "#E2A33B");
    const load = box(tr, 12.4, 2.5, 2.6, 0, 0, 0, CC[(x / 27 + 8) % CC.length | 0]);
    const off = x * 37;
    ups.push((T) => {
      // 0 out over the ship, 1 lower, 2 lift, 3 ashore, 4 lower, 5 lift, back
      const P = 14000, t = (((T + off) % P) + P) % P / P, seg = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
      const sea = 30, land = -3, deck = 9, hi = 22, ground = 3;
      let z, y, carrying;
      if (t < 0.15) { z = land + (sea - land) * seg(0, 0.15); y = hi; carrying = false; }
      else if (t < 0.3) { z = sea; y = hi + (deck - hi) * Math.sin(seg(0.15, 0.3) * Math.PI); carrying = t > 0.22; }
      else if (t < 0.5) { z = sea + (land - sea) * seg(0.3, 0.5); y = hi; carrying = true; }
      else if (t < 0.65) { z = land; y = hi + (ground - hi) * Math.sin(seg(0.5, 0.65) * Math.PI); carrying = t < 0.57; }
      else { z = land; y = hi; carrying = false; }
      tr.position.z = z;
      spreader.position.y = y; load.position.y = y - 2.5; load.visible = carrying;
      cable.position.y = (y + 24) / 2; cable.scale.y = Math.max(0.1, 24 - y);
    });
  };
  [[-84, 0], [-44, 1], [-4, 0], [36, 1], [76, 0]].forEach(([x, w]) => crane(x, w));
  inkify(root, { amp: 0.2, width: 1 });
  return { root, update: (T) => ups.forEach((u) => u(T)), water: true, look: { y: 26, w: 230, h: 90 } };
}

// A humpback whale: dark back, white belly, the long white pectoral fins and a white-bellied fluke.
// act(T) plays a slow cycle at its own spot: two rolls with a blow, a fluke-up dive, then a breach.
export function humpback() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const L = 14, R = 1.75, DARK = "#3E3A5C";
  // t = 0 is the head (+x), t = 1 the tail stock; listed tail first so the lathe faces outward
  const prof = Array.from({ length: 25 }, (_, i) => { const t = 1 - i / 24; return new THREE.Vector2(Math.max(0.02, R * Math.pow(Math.sin(Math.PI * Math.pow(t * 0.96 + 0.04, 0.62)), 0.9) * (1 - 0.6 * t * t)), (0.5 - t) * L); });
  const half = (a, color) => { const g = new THREE.LatheGeometry(prof, 18, a, Math.PI).rotateZ(-Math.PI / 2).scale(1, 0.82, 1); return mesh(body, g, mat(color)); };
  half(0, "#EDEAF4"); half(Math.PI, DARK);
  // throat grooves
  const gr = []; for (let k = -3; k <= 3; k++) gr.push(L * 0.4, -0.75, k * 0.18, L * 0.08, -1.2, k * 0.36);
  const gg = new THREE.BufferGeometry(); gg.setAttribute("position", new THREE.Float32BufferAttribute(gr, 3)); body.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: "#A59DD0" })));
  // pectoral fins: about a third of the body, white, swept back
  for (const s of [-1, 1]) {
    const f = mesh(body, new THREE.SphereGeometry(1, 10, 6).scale(2.7, 0.16, 0.5), mat("#F2F0F8"), L * 0.24 - 1.9, -0.95, s * 3.1);
    f.rotation.set(s * 0.35, s * 0.8, 0);
  }
  mesh(body, new THREE.ConeGeometry(0.5, 1, 6), mat(DARK), -L * 0.22, 1.05, 0).rotation.z = 0.6;
  for (let i = 0; i < 6; i++) mesh(body, new THREE.SphereGeometry(0.16, 6, 4), mat("#2F2B4A"), L * 0.3 + (i % 3) * 0.55, 0.85 - (i % 3) * 0.12, (i % 2 ? 1 : -1) * 0.3);
  // the fluke, dark above and white below
  const fl = new THREE.Shape(); fl.moveTo(0, 0); fl.bezierCurveTo(-1.4, 1.2, -2.4, 3.4, -1.6, 4.4); fl.bezierCurveTo(-1.2, 3.2, -0.6, 1.4, 0, 0.6); fl.bezierCurveTo(-0.6, -1.4, -1.2, -3.2, -1.6, -4.4); fl.bezierCurveTo(-2.4, -3.4, -1.4, -1.2, 0, 0);
  const fluke = new THREE.Group(); fluke.position.x = -L * 0.5 + 0.2; body.add(fluke);
  mesh(fluke, new THREE.ShapeGeometry(fl).rotateX(Math.PI / 2), mat(DARK, { side: THREE.DoubleSide }), 0, 0.06, 0);
  mesh(fluke, new THREE.ShapeGeometry(fl).rotateX(-Math.PI / 2), mat("#F2F0F8"), 0, -0.06, 0);
  body.userData.ownInk = true; inkify(body, { amp: 0.06, threshold: 40 });
  // blow and splash
  const puffs = Array.from({ length: 7 }, () => fogPuff(root));
  const rings = Array.from({ length: 3 }, () => { const c = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 40 }, (_, i) => new THREE.Vector3(Math.cos((i / 40) * Math.PI * 2), 0.15, Math.sin((i / 40) * Math.PI * 2)))), new THREE.LineBasicMaterial({ color: "#FFFFFF", transparent: true })); root.add(c); return c; });
  const ease = (t) => t * t * (3 - 2 * t);
  let last = -1;
  function act(T, P = 30000) {
    const t = (T % P) / P, sec = t * (P / 1000), seg = (a, b) => Math.min(1, Math.max(0, (sec - a) / (b - a)));
    let x = 0, y = -12, pitch = 0, roll = 0, vis = false, blow = -1, splash = -1;
    const roll1 = (a) => { const k = seg(a, a + 3.2); if (k > 0 && k < 1) { vis = true; x = -6 + 12 * k; y = -1.9 + 1.4 * Math.sin(k * Math.PI); pitch = 0.35 - 0.7 * k; blow = sec - a; } };
    roll1(2); roll1(6.5);
    { const k = seg(11, 15); if (k > 0 && k < 1) { vis = true; x = 6 * k; pitch = -0.3 - 1.05 * ease(k); y = -1.6 - 1.2 * k + 4.5 * Math.sin(k * Math.PI) * (k > 0.4 ? 1 : k / 0.4) * 0.6; } }
    { const k = seg(19, 22.5); if (k > 0 && k < 1) { vis = true; const up = Math.sin(k * Math.PI); x = 4 * k; y = -7 + 8.5 * up; pitch = 1.25 - 1.9 * ease(k); roll = 1.6 * ease(k); splash = k > 0.75 ? (sec - 22.1) : -1; } }
    if (sec > 22.1 && sec < 25) splash = sec - 22.1;
    body.visible = vis; body.position.set(x, y, 0); body.rotation.set(roll, 0, pitch);
    fluke.rotation.z = vis ? Math.sin(T / 300) * 0.15 : 0;
    puffs.forEach((p, i) => {
      if (blow >= 0 && blow < 2.2) { const k = blow / 2.2; p.visible = true; p.position.set(x + L * 0.3 + (i - 3) * 0.25, 1 + k * 7 + i * 0.5, (i % 3 - 1) * 0.4); p.scale.setScalar(1.2 + k * 3 + i * 0.2); p.material.opacity = (1 - k) * 0.85; }
      else if (splash >= 0 && splash < 2.6) { const k = splash / 2.6; p.visible = true; p.position.set(2 + Math.cos(i) * (3 + k * 4), 1.5 + 4 * Math.sin(k * Math.PI) + i * 0.3, Math.sin(i * 2) * (3 + k * 4)); p.scale.setScalar(3 + k * 4); p.material.opacity = (1 - k) * 0.9; }
      else p.visible = false;
    });
    const rk = splash >= 0 ? splash : sec > 15 && sec < 18 ? sec - 15 : -1;
    rings.forEach((r, i) => { const k = rk - i * 0.45; r.visible = k > 0 && k < 2.6; if (r.visible) { r.scale.setScalar(2 + k * 5); r.material.opacity = 0.9 * (1 - k / 2.6); r.position.x = splash >= 0 ? 3 : 6; } });
    const cycle = Math.floor(T / P); const moved = cycle !== last; last = cycle; return moved;
  }
  return { root, act, update: (T) => act(T), water: true, look: { y: 4, w: 40, h: 22 } };
}
