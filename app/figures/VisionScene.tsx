"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import type { FigureProps } from ".";
import { useInView, useReducedMotion } from "./hooks";
import s from "./VisionScene.module.css";

type Tier = "High" | "Medium" | "Low";
type Zone = "WARNING" | "CAUTION" | "SAFE";
type Obj = { id: string; cls: string; H: number; W: number; tier: Tier; conf: number; x: number; y: number };

// Typical-height lookup values (m) from the project; widths are illustrative only.
const START: Obj[] = [
  { id: "chair", cls: "chair", H: 0.9, W: 0.5, tier: "High", conf: 0.91, x: -0.9, y: 4.4 },
  { id: "person", cls: "person", H: 1.7, W: 0.5, tier: "Medium", conf: 0.88, x: 1.7, y: 7.8 },
  { id: "cup", cls: "cup", H: 0.12, W: 0.08, tier: "Low", conf: 0.62, x: 0.7, y: 4.95 },
  { id: "dog", cls: "dog", H: 0.55, W: 0.7, tier: "Medium", conf: 0.79, x: -1.6, y: 11.9 },
];
const FT = 0.3048;
const F = 900;
const FW = 720;
const FH = 1280;
// Simulated mount: camera 1.6 m up, pitched down so the horizon sits at row 100.
// With these numbers the floor leaves the bottom of the frame at about 4 ft.
const HZ = 100;
const CAM = 1.6;
const CLIP_FT = (CAM * F) / (FH - HZ) / FT;
const HALF_FOV = Math.atan(FW / 2 / F);
const RANK: Record<Tier, number> = { High: 0, Medium: 1, Low: 2 };
const TIER_C: Record<Tier, string> = { High: "var(--ink)", Medium: "var(--amber)", Low: "var(--muted)" };

// Reel beats: which layers each beat reveals. Later beats keep what earlier ones showed,
// except `drop` and `formula`, which belong to their own beat only.
type Layers = { boxes: boolean; drop: boolean; distances: boolean; formula: boolean; risk: boolean; zones: boolean; announce: boolean };
const NONE: Layers = { boxes: false, drop: false, distances: false, formula: false, risk: false, zones: false, announce: false };
const LAYERS: Layers[] = [
  NONE,
  { ...NONE, boxes: true, drop: true },
  { ...NONE, boxes: true, drop: true, distances: true, formula: true },
  { ...NONE, boxes: true, distances: true, risk: true, zones: true },
  { ...NONE, boxes: true, distances: true, risk: true, zones: true, announce: true },
];
const TAGS = ["1280×720 · ~5 FPS", "YOLOv8n · ≈200 ms"];
// TODO(aadi): the "dropped (0.41)" box is an illustration of the 0.45 confidence floor, not a real detection; confirm it reads that way.
const DROP = { x: 545, y: 1124, w: 130, h: 116, conf: 0.41 };
// Frame rows where the floor reaches 9 ft and 6 ft (same pinhole model as analyse()).
const rowAt = (ft: number) => HZ + (CAM * F) / (ft * FT);
const BANDS = [
  { id: "SAFE", label: "> 9 FT", from: HZ, to: rowAt(9), c: "var(--ok)" },
  { id: "CAUTION", label: "6–9 FT", from: rowAt(9), to: rowAt(6), c: "var(--amber)" },
  { id: "WARNING", label: "< 6 FT", from: rowAt(6), to: FH, c: "var(--hot)" },
] as const;

const n2 = (v: number) => +v.toFixed(2);
const PX = (x: number) => n2(100 + x * 20);
const PY = (y: number) => n2(280 - y * 20);
const zoneOf = (ft: number): Zone => (ft < 6 ? "WARNING" : ft <= 9 ? "CAUTION" : "SAFE");
const cap = (t: string) => t[0].toUpperCase() + t.slice(1);

function analyse(o: Obj, fix: boolean) {
  const trueFt = Math.hypot(o.x, o.y);
  const dm = trueFt * FT;
  const th = Math.atan2(o.x, o.y);
  const cx = FW / 2 + F * Math.tan(th);
  const w = (o.W * F) / dm;
  const base = HZ + (CAM * F) / dm;
  const top = base - (o.H * F) / dm;
  const vis = Math.min(base, FH) - Math.max(top, 0);
  const detected = cx + w / 2 > 0 && cx - w / 2 < FW && vis > 0;
  const clipped = base > FH || top < 0;
  const estFt = (o.H * F) / vis / FT;
  const suppressed = fix && clipped;
  const zone: Zone = suppressed ? "WARNING" : zoneOf(estFt);
  const speaks = detected && (zone === "WARNING" || (zone === "CAUTION" && o.tier !== "Low"));
  return { o, trueFt, cx, w, base, top, vis, detected, clipped, estFt, suppressed, zone, speaks };
}
type Row = ReturnType<typeof analyse>;

function message(r: Row | undefined) {
  if (!r) return "";
  const stop = r.zone === "WARNING" ? "Stop. " : "";
  if (r.suppressed) return `${stop}${cap(r.o.cls)} ahead.`;
  const steps = Math.max(1, Math.round(r.estFt / 2.5));
  return `${stop}${cap(r.o.cls)}, ${steps} step${steps > 1 ? "s" : ""} ahead.`;
}

function Glyph({ cls }: { cls: string }) {
  if (cls === "chair") return <><rect x="-15" y="-15" width="30" height="30" /><line x1="-15" y1="-11" x2="15" y2="-11" /></>;
  if (cls === "person") return <><ellipse rx="15" ry="7" /><circle r="5.5" /></>;
  if (cls === "dog") return <><ellipse rx="6" ry="13" /><circle cy="-15" r="4.5" /></>;
  return <><circle r="5" /><circle r="2" /></>;
}

const arc = (ft: number) => `M ${PX(-ft)} ${PY(0)} A ${ft * 20} ${ft * 20} 0 0 1 ${PX(ft)} ${PY(0)}`;

function labelPos(r: Row, all: Row[]) {
  const o = r.o;
  const px = PX(o.x);
  const py = PY(o.y);
  const pad = o.cls === "cup" ? 10 : o.cls === "dog" ? 13 : 20;
  const tw = Math.max(o.cls.length * 5.2, r.detected ? 26 : 46);
  const make = (lx: number, y1: number, anchor: "start" | "middle" | "end") => {
    const bx1 = anchor === "start" ? px + lx : anchor === "end" ? px + lx - tw : px + lx - tw / 2;
    return { lx, y1, y2: y1 + 11, anchor, bx1, bx2: bx1 + tw, by1: py + y1 - 8, by2: py + y1 + 13 };
  };
  const right = make(pad, -3, "start");
  const left = make(-pad, -3, "end");
  const below = make(o.cls === "cup" ? -2 : 0, (o.cls === "cup" ? 14 : 25), "middle");
  const above = make(0, -(o.cls === "cup" ? 19 : 29), "middle");
  const leftLow = make(-(pad + 6), 5, "end");
  const rightLow = make(pad + 6, 5, "start");
  const cands = o.x < 0 ? [right, left, leftLow, below, above, rightLow] : [left, right, rightLow, below, above, leftLow];
  const hitsFov = (c: typeof right, sign: -1 | 1) => {
    const ds = [
      c.bx1 - (100 + sign * 0.4 * (280 - c.by1)),
      c.bx2 - (100 + sign * 0.4 * (280 - c.by1)),
      c.bx1 - (100 + sign * 0.4 * (280 - c.by2)),
      c.bx2 - (100 + sign * 0.4 * (280 - c.by2)),
    ];
    return Math.min(...ds) <= 2.5 && Math.max(...ds) >= -2.5;
  };
  const overlaps = (a: [number, number, number, number], b: [number, number, number, number]) =>
    a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  let best = cands[0];
  let bestScore = Infinity;
  cands.forEach((c, idx) => {
    let sc = idx * 0.5;
    if (c.bx1 < 27 || c.bx2 > 173 || c.by1 < 6 || c.by2 > 268) sc += 100;
    if (hitsFov(c, -1)) sc += 60;
    if (hitsFov(c, 1)) sc += 60;
    const box: [number, number, number, number] = [c.bx1, c.by1, c.bx2, c.by2];
    if (overlaps(box, [86, 264, 114, 298]) || overlaps(box, [126, 276, 174, 298])) sc += 80;
    for (const other of all) {
      if (other.o.id === o.id) continue;
      const ox = PX(other.o.x);
      const oy = PY(other.o.y);
      const rad = other.o.cls === "cup" ? 8 : 16;
      if (overlaps(box, [ox - rad, oy - rad, ox + rad, oy + rad])) sc += 80;
    }
    if (sc < bestScore) { bestScore = sc; best = c; }
  });
  return best;
}

export default function VisionScene({ beat }: FigureProps) {
  const bm = typeof beat === "number";
  const L = bm ? LAYERS[Math.min(Math.max(beat, 0), LAYERS.length - 1)] : null;
  const rm = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { plan: `vs-plan-${uid}`, hatch: `vs-hatch-${uid}`, frame: `vs-frame-${uid}`, margin: `vs-margin-${uid}` };
  // Layer fade: 240 ms opacity in beat mode, none under reduced motion.
  const fade = bm && !rm ? "opacity 240ms, stroke 240ms, fill 240ms" : undefined;
  const lay = (on: boolean, children: ReactNode, key?: string) =>
    bm ? <g key={key} style={{ opacity: on ? 1 : 0, transition: fade, pointerEvents: on ? undefined : "none" }} aria-hidden={on ? undefined : true}>{children}</g> : children;
  const k = bm ? 1.5 : 1;
  const [objs, setObjs] = useState(START);
  const [active, setActive] = useState("chair");
  const [focus, setFocus] = useState<string | null>(null);
  const [fix, setFix] = useState(false);
  const [speak, setSpeak] = useState(false);
  const [noTts, setNoTts] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<string | null>(null);
  const last = useRef({ m: "", t: 0 });
  const inView = useInView(root);

  const rows = objs.map((o) => analyse(o, fix));
  const subject = rows
    .filter((r) => r.speaks)
    .sort((a, b) => RANK[a.o.tier] - RANK[b.o.tier] || (a.suppressed ? 0 : a.estFt) - (b.suppressed ? 0 : b.estFt))[0];
  const msg = message(subject);
  const act = rows.find((r) => r.o.id === active) ?? rows[0];

  useEffect(() => {
    if (!speak || !inView || !msg) return;
    const tick = () => {
      const now = performance.now();
      if (msg !== last.current.m || now - last.current.t > 3000) {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
        last.current = { m: msg, t: now };
      }
    };
    tick();
    const id = window.setInterval(tick, 200);
    return () => window.clearInterval(id);
  }, [speak, inView, msg]);

  useEffect(() => () => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); }, []);

  const move = (id: string, x: number, y: number) => {
    const cx = Math.round(Math.min(3.4, Math.max(-3.4, x)) * 20) / 20;
    const cy = Math.round(Math.min(13.4, Math.max(1.2, y)) * 20) / 20;
    setObjs((os) => os.map((o) => (o.id === id ? { ...o, x: cx, y: cy } : o)));
  };
  const toPlan = (e: PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: (p.x - 100) / 20, y: (280 - p.y) / 20 };
  };
  const down = (e: PointerEvent<SVGGElement>, id: string) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = id;
    setActive(id);
  };
  const moveP = (e: PointerEvent<SVGGElement>) => {
    if (!drag.current) return;
    const p = toPlan(e);
    if (p) move(drag.current, p.x, p.y);
  };
  const key = (e: KeyboardEvent, o: Obj) => {
    const st = e.shiftKey ? 1 : 0.25;
    const d: Record<string, [number, number]> = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] };
    if (!d[e.key]) return;
    e.preventDefault();
    setActive(o.id);
    move(o.id, o.x + d[e.key][0], o.y + d[e.key][1]);
  };
  const reset = () => {
    setObjs(START);
    setActive("chair");
    setFix(false);
  };
  const toggleSpeak = () => {
    if (typeof speechSynthesis === "undefined") { setNoTts(true); return; }
    if (speak) speechSynthesis.cancel();
    last.current = { m: "", t: 0 };
    setSpeak(!speak);
  };

  const fov = (sign: number) => `${PX(0)},${PY(0)} ${PX(sign * Math.tan(HALF_FOV) * 16)},${PY(16)}`;
  const visTop = (r: Row) => Math.max(r.top, 0);
  const visBot = (r: Row) => Math.min(r.base, FH);
  const actVis = act.vis;
  const L0 = L ?? { ...NONE, boxes: true, drop: false, distances: true, formula: true, risk: true, zones: true, announce: true };
  const subId = !bm || L0.risk ? subject?.o.id : undefined;

  const readout = (
    <>
      <span className={s.lbl}>d = H · f / h</span>
      {bm && <span className={s.readout}>f = 900 px</span>}
      <span className={s.readout}>
        <b>{act.o.cls}</b> {act.o.H.toFixed(2)} m × 900 px / {act.detected ? `${Math.round(actVis)} px` : "–"} ={" "}
        <b>{!act.detected ? "not in frame" : act.suppressed ? "suppressed (edge clip)" : `${act.estFt.toFixed(1)} ft`}</b>
        {act.detected && act.clipped && (
          <span className={s.warn}> · true {act.trueFt.toFixed(1)} ft ⚠ partial view</span>
        )}
      </span>
    </>
  );
  const msgLine = msg ? `«${msg}»` : "– silent –";

  return (
    <div ref={root} className={`${s.root} ${bm ? s.beat : ""}`}>
      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.head}><span>{bm ? "Top view" : "Top view, hallway"}</span>{!bm && <span>Feet</span>}</div>
          <svg ref={svg} viewBox="0 -8 268 308" className={s.plan} role="img" aria-label="Top-down floor plan with the wearer at the bottom, distance zones, and draggable obstacles">
            <defs>
              <clipPath id={ids.plan}><rect x="20" y="0" width="160" height="300" /></clipPath>
              <pattern id={ids.hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="12" y="0" width="8" height="300" fill={`url(#${ids.hatch})`} opacity="0.35" />
            <rect x="180" y="0" width="6" height="300" fill={`url(#${ids.hatch})`} opacity="0.35" />
            <line x1="20" y1="0" x2="20" y2="300" className={s.wall} />
            <line x1="180" y1="0" x2="180" y2="300" className={s.wall} />
            <g clipPath={`url(#${ids.plan})`}>
              {lay(L0.zones, <>
                <path d={`${arc(9)} Z`} fill="var(--amber)" opacity="0.06" />
                <path d={`${arc(6)} Z`} fill="var(--hot)" opacity="0.07" />
                <path d={arc(9)} className={s.ring} />
                <path d={arc(6)} className={`${s.ring} ${s.ringHot}`} />
              </>, "rings")}
              {!bm && <path d={arc(CLIP_FT)} className={s.clipRing} />}
              <polygon points={`${fov(-1)} ${fov(1).split(" ")[1]}`} fill="var(--accent)" opacity="0.05" />
              <polyline points={fov(-1)} className={s.fov} />
              <polyline points={fov(1)} className={s.fov} />
            </g>
            {lay(L0.zones, <>
              {([["Safe", "> 9 ft", 10.6, ""], ["Caution", "6–9 ft", 7.6, ""], ["Warning", "< 6 ft", 5.1, s.zlHot]] as const).map(([a, b, y, c]) => (
                <text key={a} x="190" y={PY(y)} className={`${s.zl} ${c}`}>
                  <tspan x="190">{a}</tspan>
                  <tspan x="190" dy="13" className={s.zs}>{b}</tspan>
                </text>
              ))}
            </>, "zl")}
            {!bm && (
              <text x="190" y={PY(2.4)} className={s.zl}>
                <tspan x="190">Edge clip</tspan>
                <tspan x="190" dy="13" className={s.zs}>{`≈${CLIP_FT.toFixed(1)} ft`}</tspan>
              </text>
            )}
            {[2, 4, 6, 8, 10, 12, 14].map((f) => (
              <g key={f}>
                <line x1="20" x2="25" y1={PY(f)} y2={PY(f)} className={s.tick} />
                <text x="9" y={PY(f) + 2.5} className={s.zs} textAnchor="middle">{f}</text>
              </g>
            ))}
            {subject && lay(L0.risk, <line x1={PX(0)} y1={PY(0)} x2={PX(subject.o.x)} y2={PY(subject.o.y)} className={s.ray} />, "ray")}
            <g transform={`translate(${PX(0)} ${PY(0)})`} className={s.head0}>
              <ellipse rx="9" ry="10.5" />
              <path d="M -3 -10 L 0 -15 L 3 -10" />
              <rect x="-3.5" y="-12" width="7" height="3" className={s.cam} />
              <text y="16" textAnchor="middle" className={s.zs}>Wearer</text>
            </g>
            {rows.map((r) => {
              const o = r.o;
              const sub = subId === o.id;
              const fadeOut = bm && L0.risk && subject && !sub;
              const lp = labelPos(r, rows);
              return (
                <g
                  key={o.id}
                  transform={`translate(${PX(o.x)} ${PY(o.y)})`}
                  className={`${s.obj} ${r.detected ? "" : s.out} ${sub ? s.sub : ""}`}
                  style={{ stroke: !bm || L0.risk ? TIER_C[o.tier] : "var(--ink)", ...(bm ? { opacity: fadeOut ? 0.5 : undefined, transition: fade } : null) }}
                  tabIndex={0}
                  role="button"
                  data-keys
                  aria-label={`${o.cls}, ${r.trueFt.toFixed(1)} feet away. Drag, or use arrow keys to move.`}
                  onPointerDown={(e) => down(e, o.id)}
                  onPointerMove={moveP}
                  onPointerUp={() => { drag.current = null; }}
                  onPointerCancel={() => { drag.current = null; }}
                  onKeyDown={(e) => key(e, o)}
                  onFocus={() => { setFocus(o.id); setActive(o.id); }}
                  onBlur={() => setFocus(null)}
                >
                  <circle r="20" className={s.hit} />
                  {(focus === o.id || sub) && <rect x="-21" y="-21" width="42" height="42" className={focus === o.id ? s.focus : s.subBox} />}
                  <Glyph cls={o.cls} />
                  {lay(L0.boxes, <text x={lp.lx} y={lp.y1} textAnchor={lp.anchor} className={s.ol}>{o.cls[0].toUpperCase() + o.cls.slice(1)}</text>, "ol")}
                  {lay(L0.distances, <text x={lp.lx} y={lp.y2} textAnchor={lp.anchor} className={s.zs}>{r.detected ? `${r.trueFt.toFixed(1)} ft` : "out of view"}</text>, "ft")}
                </g>
              );
            })}
            <g transform="translate(130 292)" className={s.scale}>
              <line x1="0" x2="40" y1="0" y2="0" />
              {[0, 20, 40].map((x) => <line key={x} x1={x} x2={x} y1="-3" y2="0" />)}
              <text x="20" y="-6" textAnchor="middle" className={s.zs}>2 ft</text>
            </g>
          </svg>
        </div>

        <div className={s.panel}>
          <div className={s.head}><span>Camera frame</span>{!bm && <span>720×1280</span>}</div>
          <svg viewBox={bm ? "-30 -60 900 1560" : "-30 -60 780 1560"} className={s.frame} role="img" aria-label="Simulated portrait camera frame with bounding boxes. Boxes that run off the frame edge are clipped.">
            <defs>
              <clipPath id={ids.frame}><rect x="0" y="0" width={FW} height={FH} /></clipPath>
              <clipPath id={ids.margin}><rect x="-30" y="-60" width="780" height="1560" /></clipPath>
            </defs>
            <rect x="0" y="0" width={FW} height={FH} className={s.fr} />
            {bm && lay(L0.zones, <>
              {BANDS.map((b) => (
                <g key={b.id}>
                  <rect x="0" y={n2(b.from)} width={FW} height={n2(b.to - b.from)} fill={b.c} opacity="0.09" />
                  <text x={FW + 10} y={n2(b.to - 14)} className={s.ft} style={{ fontSize: 26 * k }}>{b.label}</text>
                </g>
              ))}
            </>, "bands")}
            <line x1="0" x2={FW} y1={HZ} y2={HZ} className={s.hz} />
            <text x="12" y={HZ - 12} className={s.ft}>Horizon</text>
            <g clipPath={`url(#${ids.margin})`}>
              {rows.filter((r) => r.detected && r.clipped).map((r) => (
                <g key={r.o.id}>
                  {lay(L0.boxes, <rect x={n2(r.cx - r.w / 2)} y={n2(r.top)} width={n2(r.w)} height={n2(r.base - r.top)} className={s.ghost} />)}
                </g>
              ))}
            </g>
            <g clipPath={`url(#${ids.frame})`}>
              {rows.filter((r) => r.detected).map((r) => {
                const sub = subId === r.o.id;
                const c = bm ? (L0.risk ? (sub ? "var(--red)" : TIER_C[r.o.tier]) : "var(--ink)") : sub ? "var(--red)" : TIER_C[r.o.tier];
                const boxLeft = n2(Math.max(2, r.cx - r.w / 2));
                const tagW = (r.o.cls.length * 18 + 98) * k;
                const tagX = n2(Math.max(2, Math.min(FW - tagW - 4, boxLeft)));
                const estX = n2(Math.max(6, Math.min(FW - 110 * k, boxLeft + 8)));
                const t = n2(visTop(r));
                const tagH = 44 * k;
                const tagY = t > tagH + 2 ? t - tagH : t;
                const fadeOut = bm && L0.risk && subject && !sub;
                return (
                  <g key={r.o.id} style={bm ? { opacity: fadeOut ? 0.5 : 1, transition: fade } : undefined}>
                    {bm && <rect x={n2(r.cx - r.w / 2)} y={t} width={n2(r.w)} height={n2(visBot(r) - visTop(r))} fill="var(--ink)" opacity="0.14" />}
                    {lay(L0.boxes, <>
                      <rect x={n2(r.cx - r.w / 2)} y={t} width={n2(r.w)} height={n2(visBot(r) - visTop(r))} fill="none" style={{ stroke: c, transition: fade }} strokeWidth={sub ? 7 : 5} />
                      <rect x={tagX} y={n2(tagY)} width={tagW} height={tagH} style={{ fill: c, transition: fade }} />
                      <text x={tagX + 8} y={n2(tagY + 32 * k)} className={s.tag} style={{ fontSize: 29 * k }}>{r.o.cls} {r.o.conf.toFixed(2)}</text>
                    </>, "box")}
                    {lay(L0.distances, <text x={estX} y={n2(tagY + 80 * k)} className={s.est} style={{ fill: c, fontSize: 29 * k, transition: fade }}>
                      {r.suppressed ? "dist. –" : `${r.estFt.toFixed(1)} ft`}
                    </text>, "dist")}
                  </g>
                );
              })}
              {bm && lay(L0.drop, <>
                <rect x={DROP.x} y={DROP.y} width={DROP.w} height={DROP.h} className={s.drop} />
                <text x={DROP.x + DROP.w} y={DROP.y - 22} textAnchor="end" className={s.est} style={{ fill: "var(--muted)", fontSize: 27 * k }}>dropped ({DROP.conf.toFixed(2)})</text>
              </>, "drop")}
              {bm && lay(L0.formula && act.detected && !act.suppressed, (() => {
                const onRight = act.cx + act.w / 2 + 86 <= FW;
                const dx = n2(onRight ? act.cx + act.w / 2 + 22 : Math.max(56, act.cx - act.w / 2 - 22));
                const tx = onRight ? dx + 42 : dx - 14;
                const y1 = n2(visTop(act));
                const y2 = n2(visBot(act));
                return (
                  <g className={s.dim}>
                    <line x1={dx} x2={dx} y1={y1} y2={y2} />
                    <line x1={dx - 12} x2={dx + 12} y1={y1} y2={y1} />
                    <line x1={dx - 12} x2={dx + 12} y1={y2} y2={y2} />
                    <text transform={`translate(${tx} ${n2((y1 + y2) / 2)}) rotate(-90)`} textAnchor="middle" style={{ fontSize: 27 * k }}>h = {Math.round(actVis)} px</text>
                  </g>
                );
              })(), "dim")}
            </g>
            {rows.filter((r) => r.detected && r.base > FH).map((r) => (
              <line key={r.o.id} x1={n2(Math.max(0, r.cx - r.w / 2))} x2={n2(Math.min(FW, r.cx + r.w / 2))} y1={FH} y2={FH} className={s.edge} />
            ))}
            {rows.filter((r) => r.detected && r.top < 0).map((r) => (
              <line key={r.o.id} x1={n2(Math.max(0, r.cx - r.w / 2))} x2={n2(Math.min(FW, r.cx + r.w / 2))} y1="0" y2="0" className={s.edge} />
            ))}
          </svg>
          {!bm && <p className={s.cap}>YOLOv8n · ≈200 ms/frame · conf ≥ 0.45<br /><span className={s.warn}>- - -</span> true extent, off-frame</p>}
        </div>
      </div>

      {bm ? (
        <div className={s.info}>
          {beat === 2 ? (
            <div className={s.formula}>{readout}</div>
          ) : beat === 4 ? (
            <div className={s.sayBm}>
              <output className={`${s.msg} ${subject?.zone === "WARNING" ? s.msgHot : ""}`}>
                <svg viewBox="0 0 16 16" className={s.spk} aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" /><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13.5 3.5a6.5 6.5 0 0 1 0 9" /></svg>
                {msgLine}
              </output>
              <span className={s.tagChip}>Piper TTS · earbuds · systemd</span>
            </div>
          ) : beat === 3 ? (
            <span className={s.tagChip}>Rank by tier, then distance</span>
          ) : (
            <span className={s.tagChip}>{TAGS[beat] ?? TAGS[0]}</span>
          )}

        </div>
      ) : (
        <div className={s.formula} aria-live="polite">{readout}</div>
      )}

      {!bm && (
        <table className={s.tbl}>
          <thead><tr><th>Object</th><th>Tier</th><th>Est. distance</th><th>Zone</th></tr></thead>
          <tbody>
            {[...rows].sort((a, b) => RANK[a.o.tier] - RANK[b.o.tier] || a.estFt - b.estFt).map((r) => (
              <tr key={r.o.id} className={subject?.o.id === r.o.id ? s.subRow : ""}>
                <td><i className={s.sw} style={{ borderColor: TIER_C[r.o.tier] }} />{r.o.cls}{subject?.o.id === r.o.id && <b className={s.subTag}> ◀ subject</b>}</td>
                <td>{r.o.tier}</td>
                <td>
                  {!r.detected ? <span className={s.dim}>not in frame</span> : r.suppressed ? <span className={s.warn}>partial view, distance suppressed</span> : (
                    <>
                      {r.estFt.toFixed(1)} ft
                      {r.clipped && <span className={s.warn}> · true {r.trueFt.toFixed(1)} ft ⚠ partial view</span>}
                    </>
                  )}
                </td>
                <td className={r.detected ? s[r.zone] : s.dim}>
                  {r.detected ? (r.zone === "WARNING" ? "Warning" : r.zone === "CAUTION" ? "Caution" : "Safe") : "–"}
                  {r.detected && !r.speaks && r.zone !== "SAFE" && <span className={s.dim}> · low risk, silent</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!bm && (
        <div className={s.say}>
          <span className={s.lbl}>One announcement per frame</span>
          <output className={`${s.msg} ${subject?.zone === "WARNING" ? s.msgHot : ""}`} aria-live="polite">
            {msgLine}
          </output>
          <span className={s.note}>Rank by tier, then distance. 2.5 ft per step. Repeats only when the message changes or after a 3 s cooldown.</span>
        </div>
      )}

      {!bm && (
        <div className={s.ctl}>
          <button className={s.btn} aria-pressed={fix} onClick={() => setFix(!fix)}>Edge-clip fix</button>
          <button className={s.btn} aria-pressed={speak} onClick={toggleSpeak}>Speak {speak ? "on" : "off"}</button>
          <button className={s.btn} onClick={reset}>Reset</button>
          {noTts && <span className={s.lbl}>Speech is not available in this browser.</span>}
        </div>
      )}
      <p className={`${s.note} ${bm ? s.noteBm : ""}`}>Drag an obstacle inside {CLIP_FT.toFixed(0)} ft: its box runs off the frame, the visible part is shorter, and the estimate goes up.</p>
    </div>
  );
}
