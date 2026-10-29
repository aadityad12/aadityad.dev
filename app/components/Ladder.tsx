"use client";

import { useState, type KeyboardEvent } from "react";

type Bench = "fib" | "sieve";
type Mode = "marginal" | "cumulative";

type Row = {
  id: string;
  name: string;
  marginal: number;
  cumulative: number;
  note: string;
  fallback?: boolean;
};

const ROWS: Record<Bench, Row[]> = {
  fib: [
    { id: "stack", name: "Stack VM", marginal: 3.8, cumulative: 3.8, note: "Bytecode and tagged values. 3.80× the tree-walker on fib." },
    { id: "goto", name: "Computed goto", marginal: 1.19, cumulative: 4.53, note: "A smaller step on fib: 1.19× the stack VM." },
    { id: "nanbox", name: "NaN-boxing", marginal: 0.9, cumulative: 4.06, note: "Smaller values, slower fib. 0.90× the previous rung. It stays in the table." },
    { id: "register", name: "Register VM", marginal: 1.41, cumulative: 5.71, note: "Locals live in registers, the way Lua 5.0 does. 1.41× on fib." },
    { id: "super", name: "Superinstructions", marginal: 1.01, cumulative: 5.76, note: "Almost flat on fib: 1.01×." },
    { id: "ic", name: "Inline caches", marginal: 1.46, cumulative: 8.41, note: "Inline caches for globals. 1.46× on fib." },
    { id: "fold", name: "Constant folding", marginal: 1.02, cumulative: 8.55, note: "Constant folding. 1.02× on fib." },
    { id: "jit", name: "ARM64 JIT", marginal: 4.54, cumulative: 38.84, note: "Handwritten ARM64. 4.54× the register VM on fib, 13.37 ms to 2.94 ms, one session." },
  ],
  sieve: [
    { id: "stack", name: "Stack VM", marginal: 4.99, cumulative: 4.99, note: "The biggest single step on sieve: 4.99× the tree-walker." },
    { id: "goto", name: "Computed goto", marginal: 1.81, cumulative: 9.04, note: "Computed goto pays more here than on fib: 1.81×." },
    { id: "nanbox", name: "NaN-boxing", marginal: 0.63, cumulative: 5.72, note: "The worst cell in the ladder. 0.63× the previous rung on sieve." },
    { id: "register", name: "Register VM", marginal: 2.36, cumulative: 13.51, note: "Register bytecode recovers the loss: 2.36× on sieve." },
    { id: "super", name: "Superinstructions", marginal: 1.24, cumulative: 16.81, note: "Superinstructions help sieve: 1.24×." },
    { id: "ic", name: "Inline caches", marginal: 1, cumulative: 16.84, note: "No measurable gain on sieve: 1.00×." },
    { id: "fold", name: "Constant folding", marginal: 0.98, cumulative: 16.52, note: "A small step backward: 0.98×." },
    { id: "jit", name: "ARM64 JIT", marginal: 0.98, cumulative: 16.15, fallback: true, note: "The JIT compiled no function in sieve. This row is the register VM plus hotness counting, not machine code." },
  ],
};

const GAIN_MAX = 4.6;
const LOSS_MAX = 0.45;
const BASE = 26;

function format(value: number) {
  return `${value.toFixed(2)}×`;
}

export function Ladder() {
  const [bench, setBench] = useState<Bench>("fib");
  const [mode, setMode] = useState<Mode>("marginal");
  const [selected, setSelected] = useState("nanbox");
  const rows = ROWS[bench];
  const current = rows.find((row) => row.id === selected) ?? rows[0];
  const cumulativeMax = Math.max(...rows.map((row) => row.cumulative));

  function geometry(row: Row) {
    if (mode === "cumulative") {
      return { left: 0, width: (row.cumulative / cumulativeMax) * 100 };
    }
    if (row.marginal >= 1) {
      const width = ((row.marginal - 1) / (GAIN_MAX - 1)) * (100 - BASE);
      return { left: BASE, width: Math.max(width, row.marginal === 1 ? 0 : 1.5) };
    }
    const width = ((1 - row.marginal) / LOSS_MAX) * BASE;
    return { left: BASE - width, width };
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const index = rows.findIndex((row) => row.id === (event.currentTarget.dataset.rung ?? selected));
    const next = rows[(index + (event.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length];
    setSelected(next.id);
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-rung="${next.id}"]`)?.focus();
  }

  return (
    <div className="ladder">
      <div className="segmented" role="group" aria-label="Benchmark">
        {(["fib", "sieve"] as Bench[]).map((item) => (
          <button key={item} type="button" className={bench === item ? "seg is-on" : "seg"} aria-pressed={bench === item} onClick={() => setBench(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="segmented" role="group" aria-label="Comparison">
        <button type="button" className={mode === "marginal" ? "seg is-on" : "seg"} aria-pressed={mode === "marginal"} onClick={() => setMode("marginal")}>
          Versus previous rung
        </button>
        <button type="button" className={mode === "cumulative" ? "seg is-on" : "seg"} aria-pressed={mode === "cumulative"} onClick={() => setMode("cumulative")}>
          Versus tree-walker
        </button>
      </div>
      <div className="rungs" role="group" aria-label={`${bench} results`}>
        {rows.map((row) => {
          const bar = geometry(row);
          const slower = row.marginal < 1;
          const on = row.id === selected;
          return (
            <button
              key={row.id}
              id={`rung-${row.id}`}
              type="button"
              aria-pressed={on}
              data-rung={row.id}
              className={on ? "rung is-on" : "rung"}
              onClick={() => setSelected(row.id)}
              onKeyDown={onKeyDown}
            >
              <span className="rung-name">
                {row.name}
                {slower ? <em className="regress"> slower</em> : null}
                {row.fallback ? <em> VM fallback</em> : null}
              </span>
              <span className="rung-track" aria-hidden="true">
                {mode === "marginal" ? <span className="rung-base" style={{ left: `${BASE}%` }} /> : null}
                <span
                  className={slower ? "rung-bar is-down" : row.fallback ? "rung-bar is-fallback" : "rung-bar"}
                  style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
                />
              </span>
              <span className={slower ? "rung-value regress" : "rung-value"}>
                {format(mode === "marginal" ? row.marginal : row.cumulative)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="hint" role="status">{current.note}</p>
      <p className="hint">Marginal shows the step. Versus the tree-walker can hide a step that went backwards. Median process time, divided by calls.</p>
    </div>
  );
}
