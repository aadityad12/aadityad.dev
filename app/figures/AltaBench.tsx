"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Status from "../components/Status";
import { ALTA } from "../content";
import type { FigureProps } from ".";
import { commas, mulberry32, useInView, useReducedMotion } from "./hooks";
import s from "./AltaBench.module.css";

type P = "y" | "b";
type Probe = { row: number | null; counted: boolean; n: number };
type St = { step: number; y: Probe; b: Probe; wire: boolean };
type Rd = "parked" | "nc" | { mean: number; min: number; max: number; float: boolean };
type Line = { who: "Student" | "Alta" | "Bench"; t: string };
type Step = { lines: Line[]; level: number; ask?: { p: P; row: number }; mark?: { row: number; label: string }; reply?: string; plug?: boolean };

const VW = 440;
const VH = 372;
const ROWS = Array.from({ length: 17 }, (_, i) => i + 8);
const X = (r: number) => 44 + (r - 8) * 22;
const TOP_Y = [78, 100, 122, 144, 166];
const LOW_Y = [206, 228, 250, 272, 294];
const PLUS = 33;
const MINUS = 51;
const POD = 342;
const EXIT: Record<P | "g" | "w", number> = { y: 96, b: 136, g: 176, w: 216 };
const COLOR = { y: "#e2b100", b: "#2f7fc1", g: "#2e9e5b", w: "#f4f3ee" };
const NAME = { y: "Yellow", b: "Blue" };
const EXPECT: Record<P, { row: number; lo: number; hi: number; txt: string; from: number }> = {
  y: { row: 15, lo: 1.8, hi: 2.2, txt: "expect ≈2 V", from: 0 },
  b: { row: 20, lo: 0, hi: 0.15, txt: "expect 0 V", from: 1 },
};
const LEVELS = ["Nudge", "Question", "Point", "Fix"];

const STEPS: Step[] = [
  { level: 0, ask: { p: "y", row: 15 }, lines: [{ who: "Student", t: "Hi, my LED is not lighting up." }, { who: "Alta", t: "Let's find where the power stops. Put the yellow probe in row 15, where the resistor meets the LED. What do you expect it to read?" }] },
  { level: 0, ask: { p: "b", row: 20 }, lines: [{ who: "Bench", t: "The student plugs it in. Nobody presses anything." }, { who: "Alta", t: "Row 15 reads almost 5 volts, so no current is flowing through the resistor. Now put the blue probe in row 20, on the LED's other side." }] },
  { level: 1, reply: "Um.", lines: [{ who: "Alta", t: "Row 20 should be at zero volts, but the blue probe is jumping around between about 4 and 5 volts. What do you think a jumpy reading like that usually means?" }] },
  { level: 2, reply: "Oh, the ground wire is not connected, right?", mark: { row: 20, label: "Row 20 · to ground?" }, lines: [{ who: "Student", t: "Um." }, { who: "Alta", t: "That's okay, a jumpy reading usually means the spot isn't connected to anything solid, so it's floating. Follow row 20 on your board: what should connect it to ground?" }] },
  { level: 3, plug: true, mark: { row: 20, label: "20a → minus rail" }, lines: [{ who: "Student", t: "Oh, the ground wire is not connected, right?" }, { who: "Alta", t: "You're right... Plug a black wire from hole 20a into the minus rail next to column a." }] },
  { level: 4, lines: [{ who: "Bench", t: "The student plugs it in." }, { who: "Alta", t: "You fixed it: row 20 is at zero volts now, and row 15 dropped from 5 volts to about 2 volts. Adding the ground wire closed the loop, so current is flowing through the resistor and the LED." }, { who: "Bench", t: "Found and fixed by the student. Alta never gave the answer." }] },
];

const INIT: St = { step: 0, y: { row: null, counted: false, n: 0 }, b: { row: null, counted: false, n: 0 }, wire: false };

function advance(st: St): St {
  const a = STEPS[st.step].ask;
  if (a && st[a.p].counted && st[a.p].row === a.row) return advance({ ...st, step: st.step + 1 });
  return st;
}

function reading(row: number | null, wire: boolean, tick: number, salt: number): Rd {
  if (row === null) return "parked";
  const r = mulberry32(tick * 97 + salt * 13 + row);
  const n = (a: number) => Math.round((r() * 2 - 1) * a);
  const steady = (base: number, noise: number, spread: number) => {
    const m = base + n(noise);
    return { mean: m, min: Math.max(0, m - spread - n(2)), max: m + spread + n(2), float: false };
  };
  if (row === 10) return steady(5004, 4, 9);
  if (row === 15) return wire ? steady(2012, 5, 7) : steady(4981, 4, 9);
  if (row === 20) {
    if (wire) return steady(3, 2, 2);
    return { mean: Math.round(4250 + r() * 600), min: Math.round(4000 + r() * 160), max: Math.round(4840 + r() * 160), float: true };
  }
  return "nc";
}
const vcc = (tick: number) => 5012 + Math.round((mulberry32(tick * 7 + 3)() * 2 - 1) * 3);
const json = (rd: Rd) => (typeof rd === "object" ? `{"mean":${rd.mean},"min":${rd.min},"max":${rd.max}}` : "null");
const pct = (v: number) => `${Math.min(100, Math.max(0, (v / 5.5) * 100)).toFixed(2)}%`;
const tipY = (st: St, p: P, row: number) => (p === "b" && st.y.row === row ? TOP_Y[1] : TOP_Y[4]);

/* ---- Reel beats (beat is a number): a compact, non-interactive view of the same bench ---- */
const BOARD_LABEL = "Breadboard section, rows 8 to 24: a 5 volt jumper into row 10, a 220 ohm resistor from row 10 to row 15, a red LED from row 15 to row 20, and a missing ground wire from hole 20a to the minus rail";
const BEAT_LABEL = [
  "Breadboard with the probe pod in its dock. The yellow probe hovers below row 15, marked as the place to put it.",
  "Breadboard with the yellow probe in row 15, the probe pod sampling it.",
  `Breadboard with the yellow probe in row 15, the probe pod streaming one line every ${ALTA.reportMs} milliseconds.`,
  "Breadboard with the yellow probe in row 15 and the ground wire from hole 20a to the minus rail missing, then plugged in so the LED lights.",
];
const BEAT_VIEW = ["0 0 440 372", "0 4 440 200", "0 4 440 200", "0 4 440 200"];
const SOAK_TOTAL = (ALTA.soak.seconds * 1000) / ALTA.reportMs;
// Mean of the yellow probe in row 15 before and after the ground wire, and the sample trace's spread (mV).
const BEAT_MV = { open: 5010, fixed: 2012 };
const SPREAD = 9;
const sampleMv = (i: number) => 4981 + Math.round((mulberry32(i * 31 + 7)() * 2 - 1) * SPREAD);
const mvText = (mv: number) => (mv / 1000).toFixed(2);
// The real pod line (Alta docs/CONTRACTS.md): seq, t, mv/lo/hi for Y B G W, vcc, btn. Values simulated.
const podLine = (seq: number) => {
  const y = reading(15, false, seq, 1) as { mean: number; min: number; max: number };
  const idle = [2, 3, 4].map((salt) => {
    const m = Math.round(mulberry32(seq * 17 + salt)() * 5);
    return { mean: m, min: Math.max(0, m - 2), max: m + 3 };
  });
  const all = [y, ...idle];
  const f = (k: "mean" | "min" | "max") => `[${all.map((c) => c[k]).join(",")}]`;
  return `{"seq":${seq},"t":${seq * ALTA.reportMs},"mv":${f("mean")},"lo":${f("min")},"hi":${f("max")},"vcc":${vcc(seq)},"btn":0}`;
};

/** Elapsed ms on a requestAnimationFrame clock. Stops (and keeps its last frame) when run goes false. */
function useClock(run: boolean) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function loop(t) {
      setMs(t - t0);
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return ms;
}

function Scope({ run }: { run: boolean }) {
  const ms = useClock(run);
  const W = ALTA.sampleHz; // samples in the 1 s window
  const head = W + Math.floor((ms * ALTA.sampleHz) / 1000);
  const pts: string[] = [];
  for (let k = 0; k < W; k++) pts.push(`${((k / (W - 1)) * 400).toFixed(1)},${(32 - ((sampleMv(head - W + k) - 4981) / SPREAD) * 26).toFixed(1)}`);
  return (
    <div className={s.bp}>
      <div className={s.bpHead}>
        <span>ATmega328P · ADC ISR · ≈{commas(ALTA.sampleHz)} Hz/probe</span>
        <Status s="Stated" />
      </div>
      <div role="img" aria-label="Simulated oscilloscope strip: raw ADC samples from the yellow probe in row 15, last 1 second, a flat line about 5 volts with small noise">
        <svg viewBox="0 0 400 64" preserveAspectRatio="none" className={s.scope} aria-hidden="true">
          {[16, 32, 48].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} className={s.grid} />)}
          {[100, 200, 300].map((x) => <line key={x} y1="0" y2="64" x1={x} x2={x} className={s.grid} />)}
          <polyline points={pts.join(" ")} className={s.trace} />
        </svg>
      </div>
      <div className={s.bpFoot}>Yellow, row 15 · last 1 s · samples simulated</div>
    </div>
  );
}

function Console({ run }: { run: boolean }) {
  const ms = useClock(run);
  const newest = 812 + Math.floor(ms / ALTA.reportMs);
  return (
    <div className={s.bp}>
      <div className={s.bpHead}>
        <span>Pod stream · 1 line / {ALTA.reportMs} ms</span>
        <Status s="Repo" />
      </div>
      <div className={s.con} role="img" aria-label={`Simulated console: the pod sends one JSON line every ${ALTA.reportMs} milliseconds with mean, min and max millivolts per probe, the supply voltage and the button state`}>
        {[2, 1, 0].map((d) => <code key={newest - d} aria-hidden="true">{podLine(newest - d)}</code>)}
      </div>
      <div className={s.bpHead}>
        <span className={s.count}>{commas(ALTA.soak.samples)} / {commas(SOAK_TOTAL)} lines · {ALTA.soak.bad} bad</span>
        {/* TODO(aadi): soak count not recorded in the repo; confirm */}
        <Status s="Stated" />
        <span className={s.bpFoot}>{ALTA.soak.seconds} s soak · line values simulated</span>
      </div>
    </div>
  );
}

export default function AltaBench({ beat }: FigureProps) {
  const bm = typeof beat === "number";
  const glow = `alta-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [fixed, setFixed] = useState(false);
  const [st, setSt] = useState<St>(INIT);
  const [sel, setSel] = useState<P>("y");
  const [cursor, setCursor] = useState(15);
  const [drag, setDrag] = useState<{ p: P; row: number | null } | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLDivElement>(null);
  const hold = useRef<Partial<Record<P, number>>>({});
  const inView = useInView(ref);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (bm || !inView || reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, [bm, inView, reduced]);

  // Beat 3: the student plugs the ground wire a moment after the beat comes into view; leaving resets it.
  useEffect(() => {
    if (beat !== 3 || !inView || reduced) return;
    const id = window.setTimeout(() => setFixed(true), 1600);
    return () => {
      clearTimeout(id);
      setFixed(false);
    };
  }, [beat, inView, reduced]);

  useEffect(() => {
    const h = hold.current;
    return () => Object.values(h).forEach((t) => clearTimeout(t));
  }, []);

  useEffect(() => {
    const el = chat.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [st.step]);

  const place = (p: P, row: number | null) => {
    clearTimeout(hold.current[p]);
    setSt((v) => ({ ...v, [p]: { row, counted: false, n: v[p].n + 1 } }));
    if (row === null) return;
    hold.current[p] = window.setTimeout(() => {
      setSt((v) => (v[p].row === row ? advance({ ...v, [p]: { ...v[p], counted: true } }) : v));
    }, 500);
  };
  const plug = () => setSt((v) => (STEPS[v.step].plug ? { ...v, wire: true, step: v.step + 1 } : v));
  const reply = () => setSt((v) => (STEPS[v.step].reply ? { ...v, step: v.step + 1 } : v));
  const restart = () => {
    Object.values(hold.current).forEach((t) => clearTimeout(t));
    hold.current = {};
    setSt(INIT);
    setSel("y");
    setCursor(15);
  };

  const toSvg = (e: PointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * VW, y: ((e.clientY - b.top) / b.height) * VH };
  };
  const rowAt = (x: number, y: number) => (y > 316 ? null : Math.min(24, Math.max(8, Math.round((x - 44) / 22) + 8)));
  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    const t = e.target as Element;
    if (t.closest("[data-ghost]")) { plug(); return; }
    const pr = t.closest("[data-probe]")?.getAttribute("data-probe") as P | undefined;
    const { x, y } = toSvg(e);
    if (!pr && y > 316) return;
    const p = pr ?? sel;
    setSel(p);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ p, row: rowAt(x, y) });
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const { x, y } = toSvg(e);
    const r = rowAt(x, y);
    if (drag) { if (r !== drag.row) setDrag({ ...drag, row: r }); } else if (r !== hover) setHover(r);
  };
  const onUp = () => {
    if (!drag) return;
    place(drag.p, drag.row);
    if (drag.row !== null) setCursor(drag.row);
    setDrag(null);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (k === "ArrowLeft" || k === "ArrowDown") setCursor((c) => Math.max(8, c - 1));
    else if (k === "ArrowRight" || k === "ArrowUp") setCursor((c) => Math.min(24, c + 1));
    else if (k === "Enter" || k === " ") place(sel, cursor);
    else if (k === "Escape" || k === "Backspace") place(sel, null);
    else if (k === "y" || k === "b") setSel(k);
    else return;
    e.preventDefault();
  };

  const step = STEPS[st.step];
  const wireOn = bm ? beat === 3 && (fixed || reduced) : st.wire;
  const lit = wireOn;
  const rowOf = (p: P) => (bm ? (p === "y" && beat !== 0 ? 15 : null) : drag?.p === p ? drag.row : st[p].row);
  const mark = bm ? (beat === 0 ? { row: 15, label: "Put the probe here" } : undefined) : step.ask ? { row: step.ask.row, label: `${NAME[step.ask.p]} probe here` } : step.mark;
  const lines = STEPS.slice(0, st.step + 1).flatMap((x) => x.lines);
  const serial = [3, 2, 1, 0].map((d) => {
    const k = tick - d;
    return `{"y":${json(reading(st.y.row, st.wire, k, 1))},"b":${json(reading(st.b.row, st.wire, k, 2))},"vcc":${vcc(k)},"btn":0}`;
  });

  const lead = (p: P | "g" | "w", x: number, y: number, key: string, probe?: P) => (
    <g key={key} data-probe={probe} className={probe ? s.probe : undefined}>
      <path d={`M${EXIT[p]} ${POD} C${EXIT[p]} ${(y + POD) / 2 + 20} ${x} ${y + 70} ${x} ${y + 6}`} className={s.leadOut} />
      <path d={`M${EXIT[p]} ${POD} C${EXIT[p]} ${(y + POD) / 2 + 20} ${x} ${y + 70} ${x} ${y + 6}`} stroke={COLOR[p]} className={s.lead} />
      <rect x={x - 3} y={y + 2} width="6" height="9" fill={COLOR[p]} className={s.collar} />
      <rect x={x - 1.25} y={y - 4} width="2.5" height="7" className={s.pin} />
      {probe && <rect x={x - 12} y={y - 8} width="24" height="28" fill="transparent" />}
    </g>
  );

  const gauge = (p: P) => {
    const row = st[p].row;
    const rd = reading(row, st.wire, tick, p === "y" ? 1 : 2);
    const ex = EXPECT[p];
    const showEx = row === ex.row && st.step >= ex.from;
    const v = typeof rd === "object" ? rd.mean / 1000 : 0;
    const inBand = typeof rd === "object" && !rd.float && v >= ex.lo && v <= ex.hi;
    const big = rd === "parked" ? "—" : rd === "nc" ? "no contact" : rd.float && reduced ? "4.0–5.0 V" : `${v.toFixed(2)} V`;
    const sub = rd === "parked" ? "parked" : rd === "nc" ? "row not in the circuit" : rd.float && reduced ? "floating · jumps between 4 and 5 V" : `${rd.float ? "floating · " : ""}min ${(rd.min / 1000).toFixed(2)} · max ${(rd.max / 1000).toFixed(2)}`;
    return (
      <div className={`${s.gauge} ${sel === p ? s.gSel : ""}`} key={p}>
        <div className={s.gHead}>
          <i style={{ background: COLOR[p] }} />
          <span>{NAME[p]}</span>
          <span className={s.gRow}>{row === null ? "off board" : `row ${row}`}</span>
        </div>
        <div className={`${s.big} ${typeof rd === "object" && rd.float ? s.hotTxt : ""} ${typeof rd !== "object" ? s.dimTxt : ""}`}>{big}</div>
        <div className={s.sub}>{sub}</div>
        <div className={s.scale} aria-hidden="true">
          {showEx && <span className={s.band} style={{ left: pct(ex.lo), width: `${(((ex.hi - ex.lo) / 5.5) * 100 + 1.2).toFixed(2)}%` }} />}
          {typeof rd === "object" && (
            <>
              <span className={`${s.span} ${rd.float ? s.spanHot : ""}`} style={{ left: pct(rd.float && reduced ? 4 : rd.min / 1000), width: `${(((rd.float && reduced ? 1 : (rd.max - rd.min) / 1000) / 5.5) * 100).toFixed(2)}%` }} />
              {!(rd.float && reduced) && <span className={s.needle} style={{ left: pct(v) }} />}
            </>
          )}
          {[0, 1, 2, 3, 4, 5].map((t) => <b key={t} style={{ left: pct(t) }}>{t}</b>)}
        </div>
        <div className={s.gFoot}>
          <span className={s.hold}>
            <span className={s.holdBar}><i key={st[p].n} className={st[p].counted ? s.full : row !== null ? s.filling : ""} /></span>
            {st[p].counted ? "counted" : "steady 500 ms"}
          </span>
          {showEx ? <span className={st[p].counted ? (inBand ? s.okTxt : s.hotTxt) : ""}>{ex.txt}{st[p].counted ? (inBand ? " ✓" : " ✕") : ""}</span> : <span className={s.dimTxt}>no expectation set</span>}
        </div>
      </div>
    );
  };

  const boardSvg = (
          <svg viewBox={bm ? BEAT_VIEW[beat] : `0 0 ${VW} ${VH}`} role="img" aria-label={bm ? BEAT_LABEL[beat] : BOARD_LABEL} {...(bm ? {} : { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: () => setDrag(null), onPointerLeave: () => setHover(null) })}>
            <defs>
              <radialGradient id={glow}>
                <stop offset="0" stopColor="#ff3b1f" stopOpacity="0.55" />
                <stop offset="1" stopColor="#ff3b1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d={`M16 4H426V308${Array.from({ length: 21 }, (_, i) => `L${(426 - (i + 1) * 19.5).toFixed(2)} ${i % 2 ? 308 : 313}`).join("")}Z`} className={s.pcb} />
            <line x1="36" x2="412" y1="24" y2="24" className={s.railP} />
            <line x1="36" x2="412" y1="60" y2="60" className={s.railN} />
            <text x="24" y={PLUS + 4} className={`${s.t} ${s.plus}`}>+</text>
            <text x="24" y={MINUS + 4} className={`${s.t} ${s.minus}`}>−</text>
            <rect x="36" y="177" width="376" height="18" className={s.channel} />
            {ROWS.map((r) => (
              <g key={r}>
                {hover === r && !drag && <rect x={X(r) - 10} y="68" width="20" height="236" className={s.hover} />}
                <text x={X(r)} y="16" className={`${s.t} ${s.num} ${r % 5 === 0 ? s.numKey : ""}`}>{r}</text>
                {[PLUS, MINUS, ...TOP_Y, ...LOW_Y].map((y) => <rect key={y} x={X(r) - 2.5} y={y - 2.5} width="5" height="5" className={s.hole} />)}
              </g>
            ))}
            {"abcde".split("").map((c, i) => <text key={c} x="24" y={TOP_Y[i] + 4} className={`${s.t} ${s.letter}`}>{c}</text>)}
            {"fghij".split("").map((c, i) => <text key={c} x="24" y={LOW_Y[i] + 4} className={`${s.t} ${s.letter}`}>{c}</text>)}
            {!bm && <rect x={X(cursor) - 11} y="68" width="22" height="106" className={s.cursor} />}


            <path d={`M${X(9)} ${PLUS} C${X(9)} 66 ${X(10)} 56 ${X(10)} ${TOP_Y[0]}`} className={s.halo} />
            <path d={`M${X(9)} ${PLUS} C${X(9)} 66 ${X(10)} 56 ${X(10)} ${TOP_Y[0]}`} className={s.wireRed} />
            <text x={X(9) - 7} y="46" className={`${s.t} ${s.tag} ${s.end}`}>+5 V</text>

            <line x1={X(10)} x2={X(15)} y1={TOP_Y[2]} y2={TOP_Y[2]} className={s.leg} />
            <rect x={(X(10) + X(15)) / 2 - 20} y={TOP_Y[2] - 7} width="40" height="14" rx="4" className={s.res} />
            {["#c62828", "#c62828", "#6d4c2f", "#b8962e"].map((c, i) => <rect key={i} x={(X(10) + X(15)) / 2 - 14 + i * 7 + (i === 3 ? 5 : 0)} y={TOP_Y[2] - 7} width="3.5" height="14" fill={c} />)}
            <text x={(X(10) + X(15)) / 2} y={TOP_Y[2] - 11} className={`${s.t} ${s.tag}`}>220 Ω</text>

            {lit && <circle cx={(X(15) + X(20)) / 2} cy={TOP_Y[3]} r="38" fill={`url(#${glow})`} />}
            <line x1={X(15)} x2={X(20)} y1={TOP_Y[3]} y2={TOP_Y[3]} className={s.leg} />
            <path d={`M${(X(15) + X(20)) / 2 + 8} ${TOP_Y[3] - 6.6}A10 10 0 1 0 ${(X(15) + X(20)) / 2 + 8} ${TOP_Y[3] + 6.6}Z`} className={`${s.led} ${lit ? s.ledOn : ""}`} />
            <text x={(X(15) + X(20)) / 2} y={TOP_Y[3] - 14} className={`${s.t} ${s.tag}`}>LED</text>

            {wireOn ? (
              <>
                <path d={`M${X(20)} ${TOP_Y[0]} C${X(20)} 64 ${X(19)} 64 ${X(19)} ${MINUS}`} pathLength={bm ? 1 : undefined} className={`${s.halo} ${bm ? s.wireIn : ""}`} />
                <path d={`M${X(20)} ${TOP_Y[0]} C${X(20)} 64 ${X(19)} 64 ${X(19)} ${MINUS}`} pathLength={bm ? 1 : undefined} className={`${s.wireBlk} ${bm ? s.wireIn : ""}`} />
              </>
            ) : (
              <g data-ghost={step.plug ? "" : undefined} className={`${s.ghost} ${step.plug ? s.ghostGo : ""}`}>
                <path d={`M${X(20)} ${TOP_Y[0]} C${X(20)} 64 ${X(19)} 64 ${X(19)} ${MINUS}`} />
                <rect x={X(19) - 12} y={MINUS - 8} width={X(20) - X(19) + 24} height={TOP_Y[0] - MINUS + 16} fill="transparent" stroke="none" />
                <rect x={X(19) - 132} y="37" width="124" height="11" className={s.ghostBg} />
                <text x={X(19) - 10} y="46" className={`${s.t} ${s.ghostTxt}`}>{step.plug ? "click: plug GND wire →" : "GND wire missing →"}</text>
              </g>
            )}

            <rect x="56" y={POD} width="358" height="24" className={s.pod} />
            <text x="404" y={POD + 16} className={`${s.t} ${s.podTxt}`}>PROBE POD · ATMEGA328P</text>
            {lead("g", EXIT.g, 320, "g")}
            {lead("w", EXIT.w, 320, "w")}
            <text x={EXIT.w + 10} y="334" className={`${s.t} ${s.tag} ${s.start}`}>G, W unused in lab 1</text>
            {(["b", "y"] as P[]).map((p) => {
              const r = rowOf(p);
              if (bm && beat === 0 && p === "y") return lead(p, X(15), 206, p);
              return lead(p, r === null ? EXIT[p] : X(r), r === null ? 320 : tipY(st, p, r), p, bm ? undefined : p);
            })}
            {mark && (
              <g className={s.mark}>
                <rect x={X(mark.row) - 11} y="68" width="22" height="106" />
                <rect x={(Math.min(Math.max(X(mark.row) - 74, 38), 262)).toFixed(2)} y="178" width="148" height="16" className={s.markTag} />
                <text x={(Math.min(Math.max(X(mark.row), 112), 336)).toFixed(2)} y="190" className={s.markTxt}>↑ {mark.label}</text>
              </g>
            )}
          </svg>
  );

  if (bm) {
    return (
      <div ref={ref} className={s.root}>
        <div className={`${s.boardStatic} ${beat === 0 ? s.boardFull : s.boardShort}`}>{boardSvg}</div>
        {beat === 1 && <Scope run={inView && !reduced} />}
        {beat === 2 && <Console run={inView && !reduced} />}
        {beat === 3 && (
          <div className={s.bp}>
            <div className={`${s.chat} ${s.chatBeat}`}>
              <p className={s.Alta}><b>Alta</b><span>Yellow reads {mvText(BEAT_MV.open)} V. You expected about 2. What&apos;s between the rail and this row?</span></p>
              {lit && <p className={s.Bench}><b>·</b><span>The student plugs it in.</span></p>}
            </div>
            <div className={s.bpHead}>
              <i className={s.sw} style={{ background: COLOR.y }} />
              <span>Yellow · row 15</span>
              <span className={`${s.beatBig} ${lit ? s.okTxt : s.hotTxt}`}>{mvText(lit ? BEAT_MV.fixed : BEAT_MV.open)} V</span>
              {lit && (
                <>
                  <span>{ALTA.trials.passed} of {ALTA.trials.of} trials</span>
                  <Status s="Measured" />
                </>
              )}
              <span className={s.bpFoot}>readings simulated</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={s.root}>
      <div className="ctl" role="group" aria-label="Probe controls">
        <span className="lbl">Probe</span>
        {(["y", "b"] as P[]).map((p) => (
          <button key={p} className="btn" aria-pressed={sel === p} onClick={() => setSel(p)}>
            <i className={s.sw} style={{ background: COLOR[p] }} />{NAME[p]}
          </button>
        ))}
        <button className="btn" onClick={() => place(sel, null)} disabled={st[sel].row === null}>Park</button>
        <span className={s.spacer} />
        <button className="btn" onClick={restart}>Restart lab</button>
      </div>

      <div className={s.top}>
        <div
          className={s.board}
          tabIndex={0}
          role="slider"
          aria-valuemin={8}
          aria-valuemax={24}
          aria-valuenow={cursor}
          aria-valuetext={`Row ${cursor}`}
          data-keys
          onKeyDown={onKey}
          aria-label={`Breadboard. ${NAME[sel]} probe selected, cursor on row ${cursor}. Left and right arrows move the cursor, Enter places the probe, Y or B selects a probe, Escape parks it.`}
        >
          {boardSvg}
        </div>

        <div className={s.side}>
          {gauge("y")}
          {gauge("b")}
          <div className={s.ladderBox}>
            <span className="lbl">Hint ladder</span>
            <ol className={s.ladder} aria-label={`Hint level: ${LEVELS[Math.min(step.level, 3)]}`}>
              {LEVELS.map((l, i) => (
                <li key={l} className={i < step.level ? s.done : i === step.level ? s.cur : ""}>{l}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className={s.chat} ref={chat} aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={s[l.who]}>
            <b>{l.who === "Bench" ? "·" : l.who}</b>
            <span>{l.t}</span>
          </p>
        ))}
        {step.reply && <button className="btn" onClick={reply}>Student replies: “{step.reply}”</button>}
        {step.plug && <button className="btn go" onClick={plug}>Plug in the ground wire</button>}
        {!step.reply && !step.plug && st.step < 5 && (
          <p className={s.Bench}><b>·</b><span>Waiting for the {NAME[step.ask!.p].toLowerCase()} probe in row {step.ask!.row}. Click the row or drag the probe tip.</span></p>
        )}
      </div>

      <div className={s.serial} aria-hidden="true">
        <span className="lbl">pod stream · 1 line / 50 ms · field names illustrative</span>
        {serial.map((l, i) => <code key={i}>{l}</code>)}
      </div>
      <p className={`lbl ${s.note}`}>Scripted from a real session on the demo board · readings simulated from that session</p>
    </div>
  );
}
