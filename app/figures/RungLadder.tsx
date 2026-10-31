"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";
import type { FigureProps } from "./index";
import s from "./RungLadder.module.css";

// From the repo's generated results tables (median process total ÷ calls, Apple M1 Pro).
const RUNGS = [
  { id: "01_tree", name: "Tree-walker" },
  { id: "02_stack", name: "Stack VM" },
  { id: "03_goto", name: "+ computed goto" },
  { id: "04_nanbox", name: "+ NaN-boxing" },
  { id: "05_register", name: "Register VM" },
  { id: "06_super", name: "+ superinstructions" },
  { id: "07_ic", name: "+ inline caches" },
  { id: "08_fold", name: "+ constant folding" },
  { id: "09_jit", name: "+ ARM64 JIT" },
];

const DATA: Record<string, { v: number[]; fallback: boolean }> = {
  fib: { v: [1, 3.8, 4.53, 4.06, 5.71, 5.76, 8.41, 8.55, 38.84], fallback: false },
  loop_sum: { v: [1, 3.8, 5.22, 3.89, 6.82, 10.22, 7.03, 9.9, 22.38], fallback: false },
  sieve: { v: [1, 4.99, 9.04, 5.72, 13.51, 16.81, 16.84, 16.52, 16.15], fallback: true },
  nbody: { v: [1, 4.7, 6.17, 4.8, 6.67, 6.95, 6.96, 6.89, 6.87], fallback: true },
  strcat: { v: [1, 1.3, 1.33, 1.31, 1.35, 1.35, 1.35, 1.38, 1.39], fallback: true },
  closures: { v: [1, 4.04, 4.66, 4.25, 5.11, 5.34, 5.21, 5.39, 5.29], fallback: true },
};
const BENCHES = Object.keys(DATA);
const MAX = 50;
const TICKS = [1, 2, 5, 10, 20, 40];

// Reel beat -> what the chart shows. Only visibility changes; every number stays in DATA.
const BEAT_STATE: { show: string[]; hl: string | null }[] = [
  { show: ["01_tree"], hl: null },
  { show: ["01_tree", "02_stack", "03_goto"], hl: "02_stack" },
  { show: ["01_tree", "02_stack", "03_goto", "05_register", "06_super"], hl: "05_register" },
  { show: ["01_tree", "02_stack", "03_goto", "04_nanbox", "05_register", "06_super"], hl: "04_nanbox" },
  { show: RUNGS.map((r) => r.id), hl: "09_jit" },
];

const pct = (v: number) => +((Math.log(v) / Math.log(MAX)) * 100).toFixed(2);

export default function RungLadder({ beat }: FigureProps) {
  const isBeat = typeof beat === "number";
  const state = isBeat ? BEAT_STATE[Math.min(Math.max(beat, 0), BEAT_STATE.length - 1)] : null;
  const [benchPick, setBench] = useState("fib");
  const bench = isBeat ? "fib" : benchPick;
  const [viewPick, setView] = useState<"chart" | "term">("chart");
  const view = isBeat ? "chart" : viewPick;
  const [climb, setClimb] = useState(RUNGS.length);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const played = useRef(false);

  const runClimb = () => {
    if (reduced) { setClimb(RUNGS.length); return; }
    setClimb(0);
  };

  useEffect(() => {
    if (inView && !played.current && !reduced && !isBeat) {
      played.current = true;
      setClimb(0);
    }
  }, [inView, reduced, isBeat]);

  useEffect(() => {
    if (climb >= RUNGS.length) return;
    const t = setTimeout(() => setClimb((c) => c + 1), climb === 0 ? 250 : 260);
    return () => clearTimeout(t);
  }, [climb]);

  const d = DATA[bench];
  const top = d.v[d.v.length - 1];

  return (
    <div ref={ref} className={`${s.root} ${isBeat ? s.beat : ""} ${reduced ? s.still : ""}`}>
      {!isBeat && <div className="ctl" role="group" aria-label="Benchmark">
        {BENCHES.map((b) => (
          <button key={b} className="btn" aria-pressed={bench === b && view === "chart"} onClick={() => { setBench(b); setView("chart"); runClimb(); }}>
            {b}
          </button>
        ))}
        <span className={s.spacer} />
        <button className="btn" aria-pressed={view === "term"} onClick={() => setView(view === "term" ? "chart" : "term")}>
          {view === "term" ? "Chart" : "Watch it run"}
        </button>
      </div>}

      {view === "chart" ? (
        <div className={s.chart} aria-label={`Speedup over the tree-walker on ${bench}`}>
          <div className={s.axis} aria-hidden="true">
            {TICKS.map((t) => (
              <span key={t} style={{ left: `${pct(t)}%` }}>{t}×</span>
            ))}
          </div>
          <ol className={s.ladder}>
            {RUNGS.map((r, i) => {
              const v = d.v[i];
              const prev = i ? d.v[i - 1] : v;
              const marg = v / prev;
              const loss = i > 0 && marg < 0.995;
              const fb = i === RUNGS.length - 1 && d.fallback;
              const shown = state ? state.show.includes(r.id) : i < climb;
              const hl = state?.hl === r.id;
              return (
                <li key={r.id} className={`${s.rung} ${shown ? s.on : ""} ${!state && i === climb - 1 ? s.cur : ""} ${hl ? s.hl : ""}`}>
                  <span className={s.id}>{r.id.slice(0, 2)}</span>
                  <span className={s.name}>{r.name}</span>
                  <span className={s.track}>
                    {TICKS.map((t) => <i key={t} style={{ left: `${pct(t)}%` }} />)}
                    <span
                      className={`${s.bar} ${loss ? s.loss : ""} ${fb ? s.fb : ""} ${i === RUNGS.length - 1 && !fb ? s.jit : ""}`}
                      style={{ width: shown ? `max(3px, ${pct(v)}%)` : "0%" }}
                    />
                  </span>
                  <span className={s.val}>{v.toFixed(2)}×{fb ? " ‡" : ""}</span>
                  <span className={`${s.marg} ${loss ? s.down : ""}`}>{i === 0 ? "base" : `${loss ? "▼ " : ""}${marg.toFixed(2)}×`}</span>
                </li>
              );
            })}
          </ol>
          <div className={s.read}>
            {(!isBeat || beat >= 4) && (
              <span className="readout">
                <b>{bench}</b>: tree-walker → {d.fallback ? "JIT build" : "ARM64 JIT"} = <b>{top.toFixed(2)}×</b>
              </span>
            )}
            <span className={s.legend}>
              {isBeat && <>Tree-walker = {d.v[0].toFixed(2)}×</>}
              {(!isBeat || beat >= 4) && (d.fallback ? <><i className={s.kfb} /> ‡ JIT declined; the VM ran it</> : <><i className={s.kjit} /> native ARM64</>)}
              {(!isBeat || beat >= 3) && <><i className={s.kloss} /> slower than the rung below</>}
            </span>
          </div>
          {!isBeat && <button className="btn" onClick={runClimb} style={{ marginTop: 10 }}>Climb again ↑</button>}
        </div>
      ) : (
        <div className={s.term}>
          <Image src="/projects/rung-jit.gif" alt="Terminal: Rung compiles a hot function to ARM64, then a float fails the integer type guard and the VM finishes the call" width={1000} height={550} unoptimized />
          <p className="lbl" style={{ marginTop: 8 }}>Real command output from the repo, paced for reading.</p>
        </div>
      )}
    </div>
  );
}
