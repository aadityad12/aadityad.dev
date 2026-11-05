"use client";

import { useEffect, useRef, useState } from "react";
import { mulberry32, useInView, useReducedMotion } from "./hooks";
import s from "./DispatchTiming.module.css";

const TH = 10; // SURGE_THRESHOLD default
const WINDOW = 60;
const SAMPLE = 5;
const MIN_SURGE = 120;
const HOLD_S = 60;
const SPAN = 240;
const SPEED = 10;
const MEAN_GAP = 12;
const HEAVY = ["air_tanker", "heavy_rescue", "hazmat"];
// Exponential inter-arrival gaps, precomputed so server and client agree.
const GAPS = (() => {
  const r = mulberry32(127);
  return Array.from({ length: 1024 }, () => +(-Math.log(1 - r()) * MEAN_GAP).toFixed(2));
})();

type Call = { t: number; k: 0 | 1 | 2 };
type Hold = { unit: string; t0: number; t1: number | null; end: "" | "CONF" | "CANC" | "T/O" };
type Ev = { t: number; type: string; info: string; n: number };
type Sim = {
  t: number; bgIdx: number; nextBg: number; nextSample: number; surgeAt: number | null; hid: number;
  calls: Call[]; samples: { t: number; n: number }[]; modes: { t: number; on: boolean }[]; holds: Hold[]; log: Ev[];
};

const r1 = (n: number) => +n.toFixed(1);
const fx = (n: number) => n.toFixed(2);

function log(m: Sim, t: number, type: string, info: string) {
  const last = m.log[m.log.length - 1];
  if (type === "CALL_RECEIVED" && last && last.type === type && last.info === info) { last.n++; last.t = t; }
  else m.log.push({ t, type, info, n: 1 });
  if (m.log.length > 7) m.log.shift();
}

function sample(m: Sim, t: number) {
  const n = m.calls.filter((c) => c.t > t - WINDOW && c.t <= t).length;
  m.samples.push({ t, n });
  if (m.surgeAt === null && n > TH) {
    m.surgeAt = t;
    m.modes.push({ t, on: true });
    log(m, t, "MODE_CHANGED", `ASSISTED → SURGE · ${n} > ${TH}`);
  } else if (m.surgeAt !== null && n <= TH && t - m.surgeAt > MIN_SURGE) {
    log(m, t, "MODE_CHANGED", `SURGE → ASSISTED · ${n} ≤ ${TH} · +${t - m.surgeAt} s`);
    m.surgeAt = null;
    m.modes.push({ t, on: false });
  }
}

function advance(m: Sim, to: number) {
  for (;;) {
    const hold = m.holds.find((h) => h.t1 === null);
    const tH = hold ? hold.t0 + HOLD_S : Infinity;
    const next = Math.min(m.nextBg, m.nextSample, tH);
    if (next > to) break;
    m.t = next;
    if (hold && next === tH) {
      hold.t1 = next; hold.end = "T/O";
      log(m, next, "HOLD_TIMEOUT", `${hold.unit} returned to pool`);
    } else if (next === m.nextBg) {
      m.calls.push({ t: next, k: 0 });
      log(m, next, "CALL_RECEIVED", "background");
      m.nextBg = r1(next + GAPS[m.bgIdx++ % GAPS.length]);
    } else {
      sample(m, next);
      m.nextSample += SAMPLE;
    }
  }
  m.t = to;
  const cut = to - SPAN - WINDOW;
  m.calls = m.calls.filter((c) => c.t > cut);
  m.samples = m.samples.filter((p) => p.t > cut);
  const keep = m.modes.findLastIndex((x) => x.t <= to - SPAN - MIN_SURGE);
  if (keep > 0) m.modes = m.modes.slice(keep);
  m.holds = m.holds.filter((h) => h.t1 === null || h.t1 > to - SPAN);
}

const lastSample = (m: Sim) => m.nextSample - SAMPLE;

function burst(m: Sim, n: number) {
  const from = Math.max(lastSample(m) + 0.1, m.t - 3);
  for (let i = 0; i < n; i++) m.calls.push({ t: r1(from + ((m.t - from) * (i + 1)) / n), k: 1 });
  m.log.push({ t: m.t, type: "CALL_RECEIVED", info: "injected", n });
  if (m.log.length > 7) m.log.shift();
}

function heavy(m: Sim) {
  if (m.holds.some((h) => h.t1 === null)) return;
  const unit = HEAVY[m.hid++ % HEAVY.length];
  m.calls.push({ t: m.t, k: 2 });
  m.holds.push({ unit, t0: m.t, t1: null, end: "" });
  log(m, m.t, "CALL_RECEIVED", "heavy asset");
  log(m, m.t, "HOLD_REQUIRED", `${unit} reserved · 60 s`);
}

function resolve(m: Sim, ok: boolean) {
  const h = m.holds.find((x) => x.t1 === null);
  if (!h) return;
  h.t1 = m.t; h.end = ok ? "CONF" : "CANC";
  if (ok) log(m, m.t, "UNIT_DISPATCHED", `${h.unit} · confirmed`);
  else log(m, m.t, "HOLD_CANCELLED", `${h.unit} returned to pool`);
}

// A recent surge and a confirmed heavy-asset hold, so the diagram reads before anyone touches it.
function initial(): Sim {
  const m: Sim = { t: 0, bgIdx: 1, nextBg: GAPS[0], nextSample: SAMPLE, surgeAt: null, hid: 0, calls: [], samples: [], modes: [{ t: 0, on: false }], holds: [], log: [] };
  advance(m, 201); burst(m, 8);
  advance(m, 206); burst(m, 3);
  advance(m, 262); heavy(m);
  advance(m, 281); resolve(m, true);
  advance(m, 400);
  return m;
}
const INITIAL = initial();
const clone = (m: Sim): Sim => structuredClone(m);

export default function DispatchTiming() {
  const [sim, setSim] = useState<Sim>(INITIAL);
  const [playing, setPlaying] = useState(true);
  const [W, setW] = useState(620);
  const ref = useRef<HTMLDivElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const running = playing && inView && !reduced;

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(300, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setSim((p) => { const m = clone(p); advance(m, p.t + dt * SPEED); return m; });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const act = (fn: (m: Sim) => void) => setSim((p) => { const m = clone(p); fn(m); return m; });

  // Geometry, in CSS pixels (the viewBox tracks the measured width so text stays 1:1).
  const L = W < 420 ? 70 : 84, R = 8;
  const pw = W - L - R;
  const t0 = sim.t - SPAN;
  const x = (t: number) => L + (Math.max(t0, Math.min(sim.t, t)) - t0) / SPAN * pw;
  const Y = { calls: 10, win: 50, mode: 150, hold: 214, axis: 248 };
  const CH = 24, WH = 76, MH = 30, HH = 20, H = 268;
  const yN = (n: number) => Y.win + WH - (Math.min(n, 16) / 16) * WH;

  const ticks: number[] = [];
  for (let t = Math.ceil(t0 / 30) * 30; t <= sim.t; t += 30) ticks.push(t);

  const samples = sim.samples.filter((p) => p.t >= t0 - SAMPLE);
  let win = "";
  samples.forEach((p, i) => { win += i === 0 ? `M${fx(x(p.t))} ${fx(yN(p.n))}` : `H${fx(x(p.t))}V${fx(yN(p.n))}`; });
  if (samples.length) win += `H${fx(x(sim.t))}`;

  const segs: { a: number; b: number; on: boolean; at: number }[] = [];
  sim.modes.forEach((md, i) => {
    const end = i + 1 < sim.modes.length ? sim.modes[i + 1].t : sim.t;
    if (end > t0) segs.push({ a: Math.max(md.t, t0), b: end, on: md.on, at: md.t });
  });
  const yHi = Y.mode, yLo = Y.mode + MH;
  let mode = "";
  segs.forEach((g, i) => { const y = g.on ? yHi : yLo; mode += i === 0 ? `M${fx(x(g.a))} ${y}` : `L${fx(x(g.a) + 2)} ${y}`; mode += `H${fx(x(g.b))}`; });

  const holds = sim.holds.filter((h) => (h.t1 ?? sim.t) > t0);
  const pend = sim.holds.find((h) => h.t1 === null);
  const lastN = sim.samples.length ? sim.samples[sim.samples.length - 1].n : 0;
  const surge = sim.surgeAt !== null;
  const age = surge ? Math.round(lastSample(sim) - (sim.surgeAt as number)) : null;
  const evClass: Record<string, string> = { MODE_CHANGED: s.eMode, HOLD_REQUIRED: s.eHold, UNIT_DISPATCHED: s.eOk, HOLD_CANCELLED: s.eHot, HOLD_TIMEOUT: s.eHot };

  return (
    <div ref={ref} className={s.root}>
      <div className={s.read} aria-live="polite" aria-atomic="true">
        <span className={`${s.mode} ${surge ? s.surge : ""}`}>MODE <b>{surge ? "SURGE" : "ASSISTED"}</b></span>
        <span>WINDOW_60s <b>{lastN}</b> calls {lastN > TH ? "> 10" : "≤ 10"}</span>
        <span>SINCE SURGE <b>{age === null ? "–" : `${age} s`}</b>{age !== null && age <= MIN_SURGE ? " · min 120" : ""}</span>
      </div>

      <div ref={plotRef} className={s.plot}>
        <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={`Timing diagram of the last ${SPAN} simulated seconds: incoming calls, the 60 second window count against the threshold of 10, the MONITOR mode, and heavy-asset holds.`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={fx(x(t))} x2={fx(x(t))} y1={4} y2={Y.axis} className={s.grid} />
              <line x1={fx(x(t))} x2={fx(x(t))} y1={Y.axis} y2={Y.axis + 4} className={s.ink} />
              <text x={fx(x(t))} y={Y.axis + 15} textAnchor="middle" className={s.tick}>{t}</text>
            </g>
          ))}
          <line x1={L} x2={W - R} y1={Y.axis} y2={Y.axis} className={s.ink} />
          <text x={4} y={Y.axis + 15} className={s.tick}>t (sim s)</text>

          <text x={4} y={Y.calls + CH - 4} className={s.row}>CALLS</text>
          <line x1={L} x2={W - R} y1={Y.calls + CH} y2={Y.calls + CH} className={s.base} />
          {sim.calls.filter((c) => c.t >= t0).map((c, i) => (
            <line key={i} x1={fx(x(c.t))} x2={fx(x(c.t))} y1={Y.calls + CH} y2={Y.calls + (c.k === 2 ? 0 : 8)} className={c.k === 0 ? s.ink : c.k === 1 ? s.inj : s.hv} />
          ))}

          <text x={4} y={Y.win + 12} className={s.row}>WINDOW_60s</text>
          <text x={L - 6} y={fx(yN(0) + 3)} textAnchor="end" className={s.tick}>0</text>
          <text x={L - 6} y={fx(yN(TH) + 3)} textAnchor="end" className={s.tick}>10</text>
          <line x1={L} x2={W - R} y1={Y.win + WH} y2={Y.win + WH} className={s.base} />
          <line x1={L} x2={W - R} y1={fx(yN(TH))} y2={fx(yN(TH))} className={s.th} />
          <text x={W - R - 2} y={fx(yN(TH) - 4)} textAnchor="end" className={s.thl}>{"> 10 → SURGE"}</text>
          <path d={win} className={s.step} />
          {samples.filter((p) => p.t >= t0).map((p) => (
            <circle key={p.t} cx={fx(x(p.t))} cy={fx(yN(p.n))} r={2.2} className={p.n > TH ? s.dotHot : s.dot} />
          ))}

          <text x={4} y={Y.mode + 20} className={s.row}>MODE</text>
          {segs.filter((g) => g.on).map((g) => <rect key={g.at} x={fx(x(g.a))} y={yHi} width={fx(x(g.b) - x(g.a))} height={MH} className={s.surgeFill} />)}
          <path d={mode} className={s.wave} />
          {segs.map((g) => x(g.b) - x(g.a) > 70 && (
            <text key={`l${g.at}`} x={fx(x(g.a) + 6)} y={g.on ? yHi + 13 : yLo - 5} className={g.on ? s.stHot : s.st}>{g.on ? "SURGE" : "ASSISTED"}</text>
          ))}
          {sim.modes.filter((md) => md.on && md.t + MIN_SURGE > t0).map((md) => {
            const a = x(md.t), b = x(md.t + MIN_SURGE), yb = yLo + 12, done = sim.t >= md.t + MIN_SURGE;
            return (
              <g key={`b${md.t}`} className={s.dim}>
                <path d={`M${fx(a)} ${yb - 4}V${yb + 4}M${fx(a)} ${yb}H${fx(b)}${done ? `M${fx(b)} ${yb - 4}V${yb + 4}` : ""}`} />
                {b - a > 70 && <text x={fx((a + b) / 2)} y={yb + 13} textAnchor="middle">{done ? "120 s min surge" : "min 120 s …"}</text>}
              </g>
            );
          })}

          <text x={4} y={Y.hold + HH - 4} className={s.row}>HOLD</text>
          <line x1={L} x2={W - R} y1={Y.hold + HH} y2={Y.hold + HH} className={s.base} />
          {holds.map((h) => {
            const a = x(h.t0), b = x(h.t1 ?? sim.t);
            return (
              <g key={h.t0}>
                <path d={`M${fx(a)} ${Y.hold + HH}V${Y.hold}H${fx(b)}${h.t1 !== null ? `V${Y.hold + HH}` : ""}`} className={h.t1 === null ? s.holdOn : s.holdW} />
                {h.end && <text x={fx(b + 4)} y={Y.hold + 9} className={h.end === "CONF" ? s.endOk : s.endHot}>{h.end}</text>}
              </g>
            );
          })}

          <line x1={W - R} x2={W - R} y1={4} y2={Y.axis} className={s.now} />
        </svg>
      </div>

      <div className="ctl">
        <button className="btn go" onClick={() => act((m) => burst(m, 1))}>Inject call</button>
        <button className="btn go" onClick={() => act((m) => burst(m, 8))}>Inject burst ×8</button>
        <button className="btn" onClick={() => act(heavy)} disabled={!!pend}>Heavy-asset call</button>
        <span className={s.spacer} />
        {reduced ? (
          <button className="btn" onClick={() => act((m) => advance(m, m.t + 5))}>+5 s</button>
        ) : (
          <button className="btn" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
        )}
        {!reduced && !playing && <button className="btn" onClick={() => act((m) => advance(m, m.t + 5))}>+5 s</button>}
        <button className="btn" onClick={() => setSim(INITIAL)}>Reset</button>
      </div>

      <div className={s.lower}>
        <div className={s.log}>
          <div className={s.head}>Event log <span>names illustrative, except HOLD_REQUIRED</span></div>
          <ol>
            {sim.log.slice().reverse().map((e, i) => (
              <li key={`${e.t}-${e.type}-${i}`}>
                <span className={s.lt}>{e.t.toFixed(1)}</span>
                <b className={evClass[e.type] ?? ""}>{e.type}</b>
                <span className={s.li}>{e.n > 1 ? `×${e.n} ` : ""}{e.info}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className={`${s.card} ${pend ? s.cardOn : ""}`}>
          {pend ? (
            <>
              <div className={s.head}>HOLD_REQUIRED <span className={s.unit}>{pend.unit} · 60 s</span></div>
              <p>RESOURCE has reserved the unit. It will not move without a dispatcher.</p>
              <div className={s.count}><b>{Math.max(0, Math.ceil(pend.t0 + HOLD_S - sim.t))} s</b> left (sim time)</div>
              <div className={s.bar}><i style={{ width: `${fx(Math.max(0, 100 - ((sim.t - pend.t0) / HOLD_S) * 100))}%` }} /></div>
              <div className="ctl">
                <button className="btn go" onClick={() => act((m) => resolve(m, true))}>Confirm</button>
                <button className="btn" onClick={() => act((m) => resolve(m, false))}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div className={s.head}>Dispatcher <span>no hold pending</span></div>
              <p>Heavy assets (air_tanker, heavy_rescue, hazmat) are reserved and wait up to 60 s for explicit confirmation. A cancel or timeout returns the unit to the pool.</p>
            </>
          )}
        </div>
      </div>
      <p className="lbl">Simulated clock, {SPEED}× real time. Background calls: seeded exponential arrivals. MONITOR samples every 5 s.</p>
    </div>
  );
}
