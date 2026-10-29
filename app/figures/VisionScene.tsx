"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useInView } from "./hooks";
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

export default function VisionScene() {
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

  return (
    <div ref={root} className={s.root}>
      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.head}><span>A · Top view, hallway</span><span>ft</span></div>
          <svg ref={svg} viewBox="0 0 232 300" className={s.plan} role="img" aria-label="Top-down floor plan with the wearer at the bottom, distance zones, and draggable obstacles">
            <defs>
              <clipPath id="vs-plan"><rect x="20" y="0" width="160" height="300" /></clipPath>
              <pattern id="vs-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ink)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="12" y="0" width="8" height="300" fill="url(#vs-hatch)" opacity="0.35" />
            <rect x="180" y="0" width="6" height="300" fill="url(#vs-hatch)" opacity="0.35" />
            <line x1="20" y1="0" x2="20" y2="300" className={s.wall} />
            <line x1="180" y1="0" x2="180" y2="300" className={s.wall} />
            <g clipPath="url(#vs-plan)">
              <path d={`${arc(9)} Z`} fill="var(--amber)" opacity="0.06" />
              <path d={`${arc(6)} Z`} fill="var(--hot)" opacity="0.07" />
              <path d={arc(9)} className={s.ring} />
              <path d={arc(6)} className={`${s.ring} ${s.ringHot}`} />
              <path d={arc(CLIP_FT)} className={s.clipRing} />
              <polygon points={`${fov(-1)} ${fov(1).split(" ")[1]}`} fill="var(--accent)" opacity="0.05" />
              <polyline points={fov(-1)} className={s.fov} />
              <polyline points={fov(1)} className={s.fov} />
            </g>
            {([["SAFE", "> 9 FT", 10.2, ""], ["CAUTION", "6–9 FT", 7.2, ""], ["WARNING", "< 6 FT", 5.2, s.zlHot], ["EDGE CLIP", `≈${CLIP_FT.toFixed(1)} FT`, 2.6, ""]] as const).map(([a, b, y, c]) => (
              <text key={a} x="190" y={PY(y)} className={`${s.zl} ${c}`}>
                <tspan x="190">{a}</tspan>
                <tspan x="190" dy="8" className={s.zs}>{b}</tspan>
              </text>
            ))}
            {[2, 4, 6, 8, 10, 12, 14].map((f) => (
              <g key={f}>
                <line x1="20" x2="25" y1={PY(f)} y2={PY(f)} className={s.tick} />
                <text x="9" y={PY(f) + 2.5} className={s.zs} textAnchor="middle">{f}</text>
              </g>
            ))}
            {subject && <line x1={PX(0)} y1={PY(0)} x2={PX(subject.o.x)} y2={PY(subject.o.y)} className={s.ray} />}
            <g transform={`translate(${PX(0)} ${PY(0)})`} className={s.head0}>
              <ellipse rx="9" ry="10.5" />
              <path d="M -3 -10 L 0 -15 L 3 -10" />
              <rect x="-3.5" y="-12" width="7" height="3" className={s.cam} />
              <text y="22" textAnchor="middle" className={s.zs}>WEARER</text>
            </g>
            {rows.map((r) => {
              const o = r.o;
              const sub = subject?.o.id === o.id;
              const left = o.x < 0 ? o.x > -2.2 : o.x > 2.2;
              const lx = (o.cls === "cup" ? 10 : 22) * (left ? -1 : 1);
              return (
                <g
                  key={o.id}
                  transform={`translate(${PX(o.x)} ${PY(o.y)})`}
                  className={`${s.obj} ${r.detected ? "" : s.out} ${sub ? s.sub : ""}`}
                  style={{ stroke: TIER_C[o.tier] }}
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
                  <text x={lx} y="-3" textAnchor={left ? "end" : "start"} className={s.ol}>{o.cls.toUpperCase()}</text>
                  <text x={lx} y="7" textAnchor={left ? "end" : "start"} className={s.zs}>{r.detected ? `${r.trueFt.toFixed(1)} ft` : "out of view"}</text>
                </g>
              );
            })}
            <g transform="translate(130 292)" className={s.scale}>
              <line x1="0" x2="40" y1="0" y2="0" />
              {[0, 20, 40].map((x) => <line key={x} x1={x} x2={x} y1="-3" y2="0" />)}
              <text x="20" y="-5" textAnchor="middle" className={s.zs}>2 FT</text>
            </g>
          </svg>
        </div>

        <div className={s.panel}>
          <div className={s.head}><span>B · Camera frame</span><span>720×1280 · simulated</span></div>
          <svg viewBox="-30 -60 780 1560" className={s.frame} role="img" aria-label="Simulated portrait camera frame with bounding boxes. Boxes that run off the frame edge are clipped.">
            <defs>
              <clipPath id="vs-frame"><rect x="0" y="0" width={FW} height={FH} /></clipPath>
              <clipPath id="vs-margin"><rect x="-30" y="-60" width="780" height="1560" /></clipPath>
            </defs>
            <rect x="0" y="0" width={FW} height={FH} className={s.fr} />
            <line x1="0" x2={FW} y1={HZ} y2={HZ} className={s.hz} />
            <text x="10" y={HZ - 10} className={s.ft}>HORIZON</text>
            <g clipPath="url(#vs-margin)">
              {rows.filter((r) => r.detected && r.clipped).map((r) => (
                <rect key={r.o.id} x={n2(r.cx - r.w / 2)} y={n2(r.top)} width={n2(r.w)} height={n2(r.base - r.top)} className={s.ghost} />
              ))}
            </g>
            <g clipPath="url(#vs-frame)">
              {rows.filter((r) => r.detected).map((r) => {
                const sub = subject?.o.id === r.o.id;
                const c = sub ? "var(--accent)" : TIER_C[r.o.tier];
                const x = n2(Math.max(2, r.cx - r.w / 2));
                const t = n2(visTop(r));
                const tagY = t > 46 ? t - 44 : t;
                return (
                  <g key={r.o.id}>
                    <rect x={n2(r.cx - r.w / 2)} y={t} width={n2(r.w)} height={n2(visBot(r) - visTop(r))} fill="none" stroke={c} strokeWidth={sub ? 7 : 5} />
                    <rect x={x} y={n2(tagY)} width={r.o.cls.length * 19 + 104} height="44" fill={c} />
                    <text x={x + 8} y={n2(tagY + 32)} className={s.tag}>{r.o.cls} {r.o.conf.toFixed(2)}</text>
                    <text x={x + 8} y={n2(tagY + 80)} className={s.est} fill={c}>
                      {r.suppressed ? "dist. —" : `${r.estFt.toFixed(1)} ft`}
                    </text>
                  </g>
                );
              })}
            </g>
            {rows.filter((r) => r.detected && r.base > FH).map((r) => (
              <line key={r.o.id} x1={n2(Math.max(0, r.cx - r.w / 2))} x2={n2(Math.min(FW, r.cx + r.w / 2))} y1={FH} y2={FH} className={s.edge} />
            ))}
            {rows.filter((r) => r.detected && r.top < 0).map((r) => (
              <line key={r.o.id} x1={n2(Math.max(0, r.cx - r.w / 2))} x2={n2(Math.min(FW, r.cx + r.w / 2))} y1="0" y2="0" className={s.edge} />
            ))}
          </svg>
          <p className={s.cap}>YOLOv8n · ≈200 ms/frame · conf ≥ 0.45<br /><span className={s.warn}>- - -</span> true extent, off-frame</p>
        </div>
      </div>

      <div className={s.formula} aria-live="polite">
        <span className="lbl">d = H · f / h</span>
        <span className="readout">
          <b>{act.o.cls}</b> {act.o.H.toFixed(2)} m × 900 px / {act.detected ? `${Math.round(actVis)} px` : "—"} ={" "}
          <b>{!act.detected ? "not in frame" : act.suppressed ? "suppressed (edge clip)" : `${act.estFt.toFixed(1)} ft`}</b>
          {act.detected && act.clipped && (
            <span className={s.warn}> · true {act.trueFt.toFixed(1)} ft ⚠ partial view</span>
          )}
        </span>
      </div>

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
                {r.detected ? r.zone : "—"}
                {r.detected && !r.speaks && r.zone !== "SAFE" && <span className={s.dim}> · low risk, silent</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={s.say}>
        <span className="lbl">Announcement · one per frame · wording illustrative</span>
        <output className={`${s.msg} ${subject?.zone === "WARNING" ? s.msgHot : ""}`} aria-live="polite">
          {msg ? `«${msg}»` : "— silent —"}
        </output>
        <span className={s.note}>Rank by tier, then distance. 2.5 ft per step. Repeats only when the message changes or after a 3 s cooldown.</span>
      </div>

      <div className="ctl">
        <button className="btn" aria-pressed={fix} onClick={() => setFix(!fix)}>Edge-clip fix (not shipped)</button>
        <button className="btn" aria-pressed={speak} onClick={toggleSpeak}>Speak {speak ? "on" : "off"}</button>
        <button className="btn" onClick={reset}>Reset</button>
        {noTts && <span className="lbl">Speech is not available in this browser.</span>}
      </div>
      <p className={s.note}>Drag an obstacle inside {CLIP_FT.toFixed(0)} ft: its box runs off the frame, the visible part is shorter, and the estimate goes up. Camera mount, widths and confidences are simulated; heights are the project&apos;s typical-height lookup.</p>
    </div>
  );
}
