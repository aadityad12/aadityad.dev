// Postage stamps for the project postcards. A stamp is either a still of one of the 3D ink
// landmarks, or, where a place has no landmark yet, a small ridgeline map of the spot with a pin.
// Both are drawn once into an <img>, so the page holds no extra live WebGL scenes.
import { THREE, PAL, boil, mat, mesh, setBirds } from "./ink3d.js";
import { heightmap } from "./shared.js";

let R = null, hmP = null;

export function landmarkStamp(build, { w = 200, h = 250, bg = "#DCD7F0", yaw = 0.45, pitch = 0.16, zoom = 1, dy = 0 } = {}) {
  R ??= new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  R.setPixelRatio(1); R.setSize(w, h, false); R.setClearColor(bg);
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  setBirds(false);
  const lm = build(), scene = new THREE.Scene(); scene.add(lm.root);
  const { y, w: lw, h: lh } = lm.look, fov = 26, cam = new THREE.PerspectiveCamera(fov, w / h, 1, 4000);
  const dist = (Math.max(lw / cam.aspect, lh) * 1.04) / (2 * Math.tan((fov * Math.PI) / 360)) / zoom;
  scene.fog = new THREE.Fog(bg, dist * 1.1, dist * 2.4);
  scene.add(new THREE.AmbientLight("#FFFFFF", 0.42 * Math.PI));
  const sun = new THREE.DirectionalLight("#FFFFFF", 0.62 * Math.PI); sun.castShadow = true;
  sun.position.set(-0.7 * dist, 0.75 * dist, 0.45 * dist); sun.target.position.set(0, y, 0); scene.add(sun.target);
  const ext = Math.max(lw, lh) * 0.75; Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: dist * 3 });
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; scene.add(sun);
  const g = mesh(scene, new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), mat(lm.water ? PAL.water : PAL.ground), 0, -0.05, 0); g.castShadow = false;
  const cy = y + dy;
  cam.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, cy + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist); cam.lookAt(0, cy, 0);
  lm.update(1000, new Date(), cam);
  boil(0, w, h);
  R.render(scene, cam);
  return R.domElement.toDataURL("image/png");
}

// a joy-plot of the heightmap around a place, drawn back (north) to front (south)
export async function ridgeStamp(place, { w = 200, h = 250, bg = "#DCD7F0", span = 120, rows = 30, lift = 0.42 } = {}) {
  const hm = await (hmP ??= heightmap());
  const [cx, cy] = hm.places[place], c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d"); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  const deep = span * (h / w) * 0.9, x0 = cx - span / 2, y0 = cy - deep * 0.6;
  const val = (x, y) => { const xi = Math.max(0, Math.min(hm.w - 2, x)), yi = Math.max(0, Math.min(hm.h - 2, y)), a = Math.floor(xi), b = Math.floor(yi), fx = xi - a, fy = yi - b, v = (p, q) => hm.values[q * hm.w + p];
    return (v(a, b) * (1 - fx) + v(a + 1, b) * fx) * (1 - fy) + (v(a, b + 1) * (1 - fx) + v(a + 1, b + 1) * fx) * fy; };
  let top = 1; for (let r = 0; r <= rows; r++) for (let px = 0; px <= w; px += 3) top = Math.max(top, val(x0 + (px / w) * span, y0 + (r / rows) * deep));
  const k = (h * lift) / Math.max(top, 300), base = (r) => h * 0.2 + (r / rows) * h * 0.72;
  const fade = g.createLinearGradient(0, 0, w, 0); fade.addColorStop(0, bg); fade.addColorStop(0.12, "#211946"); fade.addColorStop(0.88, "#211946"); fade.addColorStop(1, bg);
  const wfade = g.createLinearGradient(0, 0, w, 0); wfade.addColorStop(0, bg); wfade.addColorStop(0.12, "#A59DD0"); wfade.addColorStop(0.88, "#A59DD0"); wfade.addColorStop(1, bg);
  for (let r = 0; r <= rows; r++) {
    const yy = y0 + (r / rows) * deep, pts = [];
    for (let px = -2; px <= w + 2; px += 2) { const v = val(x0 + (px / w) * span, yy); pts.push([px, base(r) - Math.max(0, v) * k, v < 0.4]); }
    g.beginPath(); g.moveTo(-2, h); pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(w + 2, h); g.closePath(); g.fillStyle = bg; g.fill();
    g.lineWidth = 1.1; g.globalAlpha = 0.45 + 0.55 * (r / rows);
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay, aw] = pts[i - 1], [bx, by] = pts[i];
      if (aw && i % 3 === 0) continue;
      g.strokeStyle = aw ? wfade : fade; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    }
    g.globalAlpha = 1;
  }
  // the pin, standing on the ground at the place
  const r0 = ((cy - y0) / deep) * rows, px = w / 2, py = base(r0) - Math.max(0, val(cx, cy)) * k;
  g.save(); g.translate(px, py); g.scale(1.5, 1.5); g.translate(-7.5, -19);
  g.fillStyle = "#FF5A47"; g.strokeStyle = "#211946"; g.lineWidth = 1.4;
  const p = new Path2D("M7.5 19 C5 14 1 11 1 7 A6.5 6.5 0 0 1 14 7 C14 11 10 14 7.5 19 Z"); g.fill(p); g.stroke(p);
  g.fillStyle = "#F7F5FC"; g.beginPath(); g.arc(7.5, 7, 2.3, 0, Math.PI * 2); g.fill();
  g.restore();
  return c.toDataURL("image/png");
}
