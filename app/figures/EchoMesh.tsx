"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { commas, mulberry32, useInView, useReducedMotion } from "./hooks";
import s from "./EchoMesh.module.css";

const W = 440;
const H = 300;
const R = 74;
const CHUNKS = 6;
const CHUNK_MS = 260;
const TOWER = { x: 388, y: 58 };
const SIZES = { json: 2431, gz: 1014 };

type Ph = { x: number; y: number };

function makePhones(): Ph[] {
  const r = mulberry32(9);
  const pts: Ph[] = [{ x: 150, y: 160 }];
  const ok = (x: number, y: number, d: number) => pts.every((p) => Math.hypot(p.x - x, p.y - y) >= d) && Math.hypot(x - TOWER.x, y - TOWER.y) > 48;
  let g = 0;
  // A chained cluster (every phone within R of an earlier one), then isolated phones beyond R of everyone.
  while (pts.length < 14 && g++ < 4000) {
    const b = pts[Math.floor(r() * pts.length)];
    const a = r() * Math.PI * 2;
    const d = 36 + r() * (R - 40);
    const x = b.x + Math.cos(a) * d;
    const y = b.y + Math.sin(a) * d;
    if (x < 26 || x > 300 || y < 28 || y > H - 28 || !ok(x, y, 32)) continue;
    pts.push({ x, y });
  }
  while (pts.length < 18 && g++ < 40000) {
    const x = 20 + r() * (W - 40);
    const y = 24 + r() * (H - 48);
    if (ok(x, y, R + 6)) pts.push({ x, y });
  }
  return pts.map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
}
const PHONES = makePhones();
const N = PHONES.length;
const NB = PHONES.map((p, i) => PHONES.map((_, j) => j).filter((j) => j !== i && Math.hypot(PHONES[j].x - p.x, PHONES[j].y - p.y) <= R));
const pid = (i: number) => `P${String(i + 1).padStart(2, "0")}`;

type Plan = { T: number[]; start: number[]; par: number[]; hop: number[]; dup: number[]; adEnd: number[]; end: number };

function plan(src: number): Plan {
  const r = mulberry32(400 + src * 13);
  const T = Array<number>(N).fill(Infinity);
  const start = Array<number>(N).fill(Infinity);
  const par = Array<number>(N).fill(-1);
  const hop = Array<number>(N).fill(0);
  const done = Array<boolean>(N).fill(false);
  T[src] = 0;
  for (;;) {
    let i = -1;
    for (let k = 0; k < N; k++) if (!done[k] && T[k] < Infinity && (i < 0 || T[k] < T[i])) i = k;
    if (i < 0) break;
    done[i] = true;
    for (const j of NB[i]) {
      if (done[j]) continue;
      const st = T[i] + 350 + Math.floor(r() * 650);
      if (st + CHUNKS * CHUNK_MS < T[j]) { T[j] = st + CHUNKS * CHUNK_MS; start[j] = st; par[j] = i; hop[j] = hop[i] + 1; }
    }
  }
  const dup = T.map((tj, j) => {
    if (tj === Infinity) return Infinity;
    const later = NB[j].filter((k) => k !== par[j] && par[k] !== j && T[k] >= tj && T[k] < Infinity).map((k) => T[k] + 300);
    return later.length ? Math.min(...later) : Infinity;
  });
  const adEnd = T.map((ti, i) => (ti === Infinity ? -1 : Math.max(ti + 1800, ...T.filter((_, j) => par[j] === i))));
  const end = Math.max(...T.filter((x) => x < Infinity), ...dup.filter((x) => x < Infinity).map((x) => x + 900), ...adEnd);
  return { T, start, par, hop, dup, adEnd, end };
}

export default function EchoMesh() {
  const [src, setSrc] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const p = useMemo(() => (src === null ? null : plan(src)), [src]);
  const finished = p !== null && t >= p.end;

  useEffect(() => {
    if (!p || reduced || !inView || finished) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setT((v) => Math.min(p.end, v + dt * speed));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [p, reduced, inView, finished, speed]);

  const start = (i: number) => {
    if (src !== null) return;
    setSrc(i);
    setT(reduced ? plan(i).end : 0);
  };
  const restart = () => { setSrc(null); setT(0); };
  const key = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(i); }
  };

  const has = (i: number) => p !== null && p.T[i] <= t;
  const reached = p ? p.T.filter((x) => x <= t).length : 0;
  const maxHop = p ? Math.max(0, ...p.hop.filter((_, i) => has(i))) : 0;
  const unreachable = p ? p.T.filter((x) => x === Infinity).length : 0;
  const inflight = new Set<number>();
  const links = p
    ? PHONES.flatMap((ph, j) => {
        const i = p.par[j];
        if (i < 0 || p.T[i] > t || p.T[j] <= t) return [];
        const a = PHONES[i];
        if (t < p.start[j]) return [{ j, a, b: ph, k: -1, f: 0 }];
        const e = t - p.start[j];
        const k = Math.min(CHUNKS - 1, Math.floor(e / CHUNK_MS));
        inflight.add(k);
        return [{ j, a, b: ph, k, f: (e % CHUNK_MS) / CHUNK_MS }];
      })
    : [];

  return (
    <div ref={ref} className={s.root}>
      <div className={s.head}>
        <span className="readout"><b>Alert 7f3a</b> · Severe Thunderstorm Warning · {CHUNKS} chunks <span className={s.dim}>(sizes illustrative)</span></span>
        <span className={`readout ${s.live}`} aria-live="polite">
          {src === null ? <span className={s.hint}>Click a phone to give it the alert</span> : <>Reached <b>{reached} / {N}</b> phones · max <b>{maxHop}</b> {maxHop === 1 ? "hop" : "hops"} · <b>0</b> bytes over the internet</>}
        </span>
      </div>

      <div className={s.map}>
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Neighbourhood map with phones; the cell tower is offline">
          <rect x="0.5" y="0.5" width={W - 1} height={H - 1} className={s.ground} />
          {[40, 110, 180, 250, 320, 400].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2={H} className={x === 180 ? s.ave : s.street} />)}
          {[46, 118, 190, 262].map((y) => <line key={`h${y}`} x1="0" x2={W} y1={y} y2={y} className={y === 118 ? s.ave : s.street} />)}

          <g className={s.tower} aria-hidden="true">
            <path d={`M${TOWER.x - 11} ${TOWER.y + 24}L${TOWER.x} ${TOWER.y - 12}L${TOWER.x + 11} ${TOWER.y + 24}M${TOWER.x - 7} ${TOWER.y + 12}H${TOWER.x + 7}M${TOWER.x - 4} ${TOWER.y}H${TOWER.x + 4}M${TOWER.x - 7} ${TOWER.y + 12}L${TOWER.x + 4} ${TOWER.y}M${TOWER.x - 11} ${TOWER.y + 24}L${TOWER.x + 7} ${TOWER.y + 12}`} />
            <path d={`M${TOWER.x - 10} ${TOWER.y - 20}A14 14 0 0 1 ${TOWER.x + 10} ${TOWER.y - 20}`} className={s.dead} />
            <rect x={TOWER.x - 30} y={TOWER.y + 29} width="60" height="14" className={s.badge} />
            <text x={TOWER.x} y={TOWER.y + 39.5} className={s.badgeTxt}>✕ OFFLINE</text>
          </g>

          {p && PHONES.map((ph, j) => (p.par[j] >= 0 && p.T[j] <= t ? <line key={`t${j}`} x1={PHONES[p.par[j]].x} y1={PHONES[p.par[j]].y} x2={ph.x} y2={ph.y} className={s.tree} /> : null))}
          {p && PHONES.map((ph, i) => (p.T[i] <= t && t < p.adEnd[i] ? <circle key={`r${i}`} cx={ph.x} cy={ph.y} r={R} className={s.range} /> : null))}
          {links.map((l) => (
            <g key={`l${l.j}`}>
              <line x1={l.a.x} y1={l.a.y} x2={l.b.x} y2={l.b.y} className={l.k < 0 ? s.scan : s.link} />
              {l.k >= 0 && (
                <g transform={`translate(${(l.a.x + (l.b.x - l.a.x) * l.f).toFixed(2)} ${(l.a.y + (l.b.y - l.a.y) * l.f).toFixed(2)})`}>
                  <rect x="-3.5" y="-3.5" width="7" height="7" className={s.pkt} />
                  <text y="-6" className={s.pktTxt}>{l.k}/{CHUNKS}</text>
                </g>
              )}
            </g>
          ))}

          {PHONES.map((ph, i) => {
            const got = has(i);
            const rx = p && !got && p.start[i] <= t ? Math.min(CHUNKS, Math.floor((t - p.start[i]) / CHUNK_MS)) : -1;
            const dup = p && p.dup[i] <= t && t < p.dup[i] + 900;
            const lost = finished && p && p.T[i] === Infinity;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                className={`${s.phone} ${got ? s.got : ""} ${src === i ? s.src : ""} ${src === null ? s.idle : ""}`}
                aria-label={`Phone ${pid(i)}${got ? `, has the alert, hop ${p!.hop[i]}` : lost ? ", out of range" : src === null ? ", give it the alert" : ""}`}
                aria-disabled={src !== null}
                onClick={() => start(i)}
                onKeyDown={key(i)}
              >
                <rect x={ph.x - 12} y={ph.y - 14} width="24" height="28" className={s.hit} />
                <g className={s.glyph}>
                  <rect x={ph.x - 6} y={ph.y - 10} width="12" height="20" rx="2" className={s.body} />
                  <rect x={ph.x - 4} y={ph.y - 7} width="8" height="12" className={s.screen} />
                </g>
                {rx >= 0 && Array.from({ length: CHUNKS }, (_, k) => <rect key={k} x={ph.x - 12 + k * 4} y={ph.y + 13} width="3.4" height="5" className={k < rx ? s.segOn : s.seg} />)}
                {got && <text x={ph.x + 9} y={ph.y - 2} className={s.hop}>{src === i ? "src" : `h=${p!.hop[i]}`}</text>}
                {got && <rect x={ph.x + 9} y={ph.y + 3} width="5" height="5" className={s.db} />}
                {got && t < p!.T[i] + 1400 && <text x={ph.x + 17} y={ph.y + 8} className={s.stored}>stored</text>}
                {dup && <text x={ph.x} y={ph.y - 14} className={s.dup}>dup ✓</text>}
                {lost && <text x={Math.min(Math.max(ph.x, 42), W - 42)} y={ph.y - 15} className={s.lost}>out of range</text>}
              </g>
            );
          })}

          <g aria-hidden="true">
            <line x1="12" x2={12 + R} y1={H - 12} y2={H - 12} className={s.scale} />
            <line x1="12" x2="12" y1={H - 16} y2={H - 8} className={s.scale} />
            <line x1={12 + R} x2={12 + R} y1={H - 16} y2={H - 8} className={s.scale} />
            <text x={18 + R} y={H - 9} className={s.scaleTxt}>R · BLE range (illustrative)</text>
            <rect x={W - 118} y={H - 16} width="5" height="5" className={s.db} />
            <text x={W - 108} y={H - 11} className={s.scaleTxt}>stored in SQLite</text>
          </g>
        </svg>
      </div>

      <div className={s.wire} aria-label="Wire format">
        <span className={s.box}>alert JSON · {commas(SIZES.json)} B</span>
        <span className={s.arr}>→ gzip →</span>
        <span className={s.box}>{commas(SIZES.gz)} B</span>
        <span className={s.arr}>→</span>
        <span className={s.chunks}>
          {Array.from({ length: CHUNKS }, (_, k) => (
            <span key={k} className={`${s.chunk} ${inflight.has(k) ? s.fly : ""}`}>c{k}</span>
          ))}
        </span>
      </div>
      <p className={`lbl ${s.note}`}>GATT: write a chunk index, read that chunk · ≈{Math.round(SIZES.gz / CHUNKS)} B each · intended relay path · simulated</p>

      <div className="ctl">
        <button className="btn go" onClick={() => start(0)} disabled={src !== null}>Start ▶</button>
        <button className="btn" onClick={restart} disabled={src === null}>Restart</button>
        <span className={s.speed} role="group" aria-label="Speed">
          {[1, 3].map((v) => <button key={v} className="btn" aria-pressed={speed === v} onClick={() => setSpeed(v)}>{v}×</button>)}
        </span>
        <span className={`readout ${s.status}`}>
          {src === null
            ? "Tower down · 0 phones have the alert"
            : finished
              ? `${unreachable} phones out of everyone's range never receive it`
              : `${pid(src)} received it before the network dropped · t = ${(t / 1000).toFixed(1)} s`}
        </span>
      </div>
    </div>
  );
}
