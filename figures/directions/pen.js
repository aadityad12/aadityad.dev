// A hand-drawn pen for the landmark drawings. Every stroke wobbles a little and
// re-draws a few times a second (the same "boil" as Pathfinder's line art), so the
// buildings feel drawn rather than printed. Coordinates are local: (0,0) is the
// ground under the landmark, negative y is up.
export const C = {
  ink: "#211946", paper: "#F7F5FC", shade: "#D6CFEE", water: "#D8D3EF", coral: "#FF5A47",
  orange: "#E8573C", orangeD: "#B8412C", terra: "#DA6B4E", terraD: "#AE4F39",
  leaf: "#B9D3BE", leafD: "#8DB197", gold: "#F2C65B",
};
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
export const rnd = hash;

export class Pen {
  constructor(ctx, s, T, { boil = 0.5, seed = 0, ink = C.ink } = {}) {
    Object.assign(this, { c: ctx, s, T, boil, ink, frame: Math.floor(T / 130) % 4, k: seed * 997 });
  }
  path(pts, close, id) {
    const { c, s, frame: f } = this, amp = this.boil / s, r = (n) => hash(id * 7.31 + n * 1.97 + f * 13.7);
    const p1 = r(1) * 6, p2 = r(2) * 6, ox = r(3) * amp * 0.5, oy = r(4) * amp * 0.5;
    const P = close ? [...pts, pts[0]] : pts;
    c.beginPath();
    let dist = 0;
    for (let i = 1; i < P.length; i++) {
      const [ax, ay] = P[i - 1], [bx, by] = P[i], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-6;
      const nx = -dy / len, ny = dx / len, n = Math.max(1, Math.ceil((len * s) / 5));
      for (let j = i === 1 ? 0 : 1; j <= n; j++) {
        const t = j / n, sp = (dist + len * t) * s;
        const w = amp * (0.65 * Math.sin(sp * 0.07 + p1) + 0.35 * Math.sin(sp * 0.17 + p2));
        const x = ax + dx * t + nx * w + ox, y = ay + dy * t + ny * w + oy;
        i === 1 && j === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      dist += len;
    }
    if (close) c.closePath();
  }
  // fill, optional diagonal hatching for shadowed faces, then the ink line
  shape(pts, { close = true, fill = null, stroke = this.ink, w = 1, hatch = 0, alpha = 1 } = {}) {
    const c = this.c, id = this.k++;
    c.globalAlpha = alpha;
    if (fill || hatch) {
      this.path(pts, close, id);
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (hatch) { c.save(); c.clip(); this.hatch(pts, hatch); c.restore(); }
    }
    if (stroke) {
      this.path(pts, close, id);
      c.lineWidth = (w * 1.25) / this.s; c.strokeStyle = stroke; c.lineJoin = c.lineCap = "round"; c.stroke();
    }
    c.globalAlpha = 1;
  }
  line(pts, o = {}) { this.shape(pts, { ...o, close: false }); }
  hatch(pts, strength) {
    const c = this.c, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), gap = 2.8 / this.s;
    c.beginPath();
    for (let d = x0 - (y1 - y0); d < x1; d += gap) { c.moveTo(d, y1); c.lineTo(d + (y1 - y0), y0); }
    c.globalAlpha = 0.32 * strength; c.lineWidth = 0.7 / this.s; c.strokeStyle = this.ink; c.stroke(); c.globalAlpha = 1;
  }
  // a face with a shaded strip down its right side, the way the light falls everywhere
  box(x, y, w, h, { fill = C.paper, shade = 0.28, hatch = 0 } = {}) {
    this.shape(rect(x, y, w, h), { fill, stroke: null });
    if (shade) this.shape(rect(x + w * (1 - shade), y, w * shade, h), { fill: C.shade, stroke: null, hatch });
    this.shape(rect(x, y, w, h));
  }
  dot(x, y, r, col, a = 1) { const c = this.c; c.globalAlpha = a; c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.globalAlpha = 1; }
}

export const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export const arcPts = (cx, cy, rx, ry, a0, a1, n = 12) =>
  Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
export const quadPts = ([x0, y0], [cx, cy], [x1, y1], n = 16) =>
  Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; });
export const quadAt = (x0, y0, cx, cy, x1, y1, x) => { const t = (x - x0) / (x1 - x0); return (1 - t) ** 2 * y0 + 2 * t * (1 - t) * cy + t * t * y1; };
// an arched opening standing on y, w wide and h tall
export const arch = (x, y, w, h) => [[x - w / 2, y], [x - w / 2, y - h + w / 2], ...arcPts(x, y - h + w / 2, w / 2, w / 2, Math.PI, 2 * Math.PI, 8).slice(1, -1), [x + w / 2, y - h + w / 2], [x + w / 2, y]];

// ---------- small life ----------
export function clock(p, x, y, r, now = new Date()) {
  p.shape(arcPts(x, y, r, r, 0, 2 * Math.PI, 20), { fill: "#FFFDF6" });
  for (let i = 0; i < 12; i += 3) { const a = (i / 12) * 2 * Math.PI; p.dot(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78, r * 0.08, C.ink); }
  const m = now.getMinutes() + now.getSeconds() / 60, h = (now.getHours() % 12) + m / 60, c = p.c;
  c.strokeStyle = C.ink; c.lineCap = "round";
  for (const [a, len, w] of [[(h / 12) * 2 * Math.PI, 0.5, 1.4], [(m / 60) * 2 * Math.PI, 0.78, 0.9]]) {
    c.lineWidth = w / p.s; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(a) * r * len, y - Math.cos(a) * r * len); c.stroke();
  }
}
export function flag(p, x, y, T, w = 11, h = 7, col = C.coral) {
  const top = [], bot = [];
  for (let i = 0; i <= 6; i++) {
    const f = i / 6, wv = Math.sin(T / 170 - i * 0.9) * 1.3 * f;
    top.push([x + f * w, y + wv]); bot.unshift([x + f * w, y + h + wv * 0.8 - f * 0.6]);
  }
  p.shape([...top, ...bot], { fill: col, w: 0.7 });
}
export function palm(p, x, y, h, T, seed = 0) {
  // tapered trunk with growth rings, leaning a touch
  const lean = h * 0.12, top = [x + lean, y - h];
  const L = quadPts([x - h * 0.035, y], [x + lean * 1.4 - h * 0.025, y - h * 0.5], [top[0] - h * 0.018, top[1]], 10);
  const R = quadPts([top[0] + h * 0.018, top[1]], [x + lean * 1.4 + h * 0.025, y - h * 0.5], [x + h * 0.035, y], 10);
  p.shape([...L, ...R], { fill: "#E9DCC9" });
  for (let i = 1; i < 9; i++) { const [lx, ly] = L[i], [rx, ry] = R[10 - i]; p.line([[lx, ly], [rx, ry - 0.8]], { w: 0.45, alpha: 0.55 }); }
  const sway = Math.sin(T / 1300 + seed) * 0.07;
  const fronds = [-3.05, -2.7, -2.35, -2.0, -1.62, -1.28, -0.95, -0.6, -0.25, 0.05];
  for (const [i, a0] of fronds.entries()) {
    const a = a0 + sway * (1 + (i % 3) * 0.3), len = h * (0.3 + 0.07 * Math.abs(Math.sin(i * 1.7 + seed)));
    const droop = len * (0.25 + 0.3 * Math.abs(Math.cos(a)));
    const tip = [top[0] + Math.cos(a) * len, top[1] + Math.sin(a) * len * 0.8 + droop];
    const mid = [top[0] + Math.cos(a) * len * 0.55, top[1] + Math.sin(a) * len * 0.55 - len * 0.1];
    const wd = len * 0.12, n = [-Math.sin(a) * wd, Math.cos(a) * wd];
    p.shape([...quadPts(top, [mid[0] + n[0], mid[1] + n[1]], tip, 9), ...quadPts(tip, [mid[0] - n[0], mid[1] - n[1]], top, 9).slice(1)],
      { fill: i % 2 ? C.leafD : C.leaf, w: 0.7 });
    p.line(quadPts(top, mid, tip, 8), { w: 0.45, alpha: 0.6 });
  }
  p.dot(top[0], top[1] + 1, h * 0.03, "#B79C77");
}
export function tree(p, x, y, r, T, seed = 0) {
  p.shape([[x - r * 0.08, y], [x - r * 0.05, y - r * 1.2], [x + r * 0.05, y - r * 1.2], [x + r * 0.1, y]], { fill: "#E9DCC9", w: 0.9 });
  const sway = Math.sin(T / 1700 + seed) * r * 0.05;
  // three overlapping lobes, darker underneath
  for (const [dx, dy, k, col] of [[-0.45, -1.35, 0.72, C.leafD], [0.5, -1.4, 0.7, C.leafD], [0, -1.85, 0.85, C.leaf]]) {
    const cx = x + dx * r + sway, cy = y + dy * r, rr = r * k;
    const pts = Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * 2 * Math.PI, q = rr * (1 + 0.1 * Math.sin(i * 2.7 + seed + dx) + 0.05 * Math.sin(i * 5.3 + seed));
      return [cx + Math.cos(a) * q, cy + Math.sin(a) * q * 0.82];
    });
    p.shape(pts, { fill: col });
  }
  p.shape(arcPts(x + sway + r * 0.2, y - r * 1.75, r * 0.45, r * 0.35, -0.3, 1.8, 6), { close: false, w: 0.55, alpha: 0.5 });
}
// people strolling between x0 and x1; tiny, but they make a place feel lived in
export function walkers(p, T, n, x0, x1, y, seed = 0) {
  const c = p.c, span = x1 - x0, cols = [C.coral, C.ink, "#7E74B8", C.leafD, C.gold];
  for (let i = 0; i < n; i++) {
    const v = 0.0035 + 0.0025 * Math.abs(hash(i + seed)), dir = i % 2 ? 1 : -1;
    let x = (((T * v * dir + i * (span / n) + seed * 13) % span) + span) % span + x0;
    const sw = Math.sin(T / 120 + i * 2) * 1.1, lw = 0.8 / p.s;
    c.lineCap = "round"; c.strokeStyle = C.ink; c.lineWidth = lw;
    c.beginPath(); c.moveTo(x, y - 2.2); c.lineTo(x - sw, y); c.moveTo(x, y - 2.2); c.lineTo(x + sw, y); c.stroke();
    c.strokeStyle = cols[(i + seed) % cols.length]; c.lineWidth = 1.8 / Math.max(p.s, 1) + lw; c.beginPath(); c.moveTo(x, y - 2.4); c.lineTo(x, y - 4.6); c.stroke();
    p.dot(x, y - 5.7, 0.95, C.ink);
  }
}
export function bird(p, x, y, T, seed = 0, size = 1) {
  const f = Math.sin(T / 85 + seed * 3), c = p.c;
  c.strokeStyle = p.ink; c.lineWidth = 0.9 / p.s; c.lineCap = "round"; c.beginPath();
  c.moveTo(x - 3.2 * size, y - 1.6 * size * f); c.quadraticCurveTo(x - 1.4 * size, y - 1.8 * size, x, y);
  c.quadraticCurveTo(x + 1.4 * size, y - 1.8 * size, x + 3.2 * size, y - 1.6 * size * f); c.stroke();
}
// a soft fog bank that drifts and breathes
export function fog(c, T, { x0, x1, y0, y1, n = 16, breathe = 11000, seed = 0 }) {
  const span = x1 - x0, front = x0 + span * (0.5 + 0.35 * Math.sin(T / breathe + seed));
  for (let i = 0; i < n; i++) {
    const v = 0.0035 + 0.002 * Math.abs(hash(i + seed)), x = x0 + ((T * v + (i * span) / n) % span);
    const y = y0 + (y1 - y0) * (0.5 + 0.5 * hash(i * 3 + seed)), r = 13 + 11 * Math.abs(hash(i * 5 + seed));
    const edge = Math.sin(((x - x0) / span) * Math.PI), a = 0.92 * edge * Math.min(1, Math.max(0, (front - x) / 26 + 0.5));
    if (a < 0.02) continue;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.55, `rgba(255,255,255,${a * 0.75})`); g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  }
}
