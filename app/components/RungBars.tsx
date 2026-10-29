import { wobRect } from "./ink";

/* Rung's results as drawn bars instead of a data list: each speedup against
   its own baseline, including the one that got slower. Static SVG, no JS. */

const X0 = 108; // bar origin
const SCALE = 230 / 22.64; // px per 1x, so the JIT bar spans the panel

function Bar({ y, name, value, note, tone, seed }: { y: number; name: string; value: number; note: string; tone?: "good" | "bad"; seed: number }) {
  const w = Math.max(6, value * SCALE);
  const cls = tone === "good" ? "ink-good" : tone === "bad" ? "ink-accent" : "";
  const label = `${value}x · ${note}`;
  const inside = w > 90;
  return (
    <g>
      <text x={8} y={y + 13} className="ink-sub ink-name">{name}</text>
      <path className={cls} d={wobRect(X0, y, w, 20, seed)} />
      <text
        x={inside ? X0 + w - 8 : X0 + w + 8}
        y={y + 14}
        textAnchor={inside ? "end" : "start"}
        className={tone === "bad" ? "ink-note ink-accent-t" : "ink-note"}
      >{label}</text>
    </g>
  );
}

export default function RungBars() {
  return (
    <div className="ink-panel">
      <svg viewBox="0 0 364 140" role="img" aria-label="Rung's measured speed-ups: stack VM up to 4.99 times the tree-walker, JIT 22.64 times on loop_sum, NaN-boxing 0.63 times its previous rung">
        <Bar y={14} name="TREE-WALKER" value={1.0} note="baseline" seed={1} />
        <Bar y={46} name="STACK VM" value={4.99} note="vs ref, up to" tone="good" seed={2} />
        <Bar y={78} name="JIT" value={22.64} note="vs ref, loop_sum" tone="good" seed={3} />
        <Bar y={110} name="NAN-BOXING" value={0.63} note="slower — kept in the table" tone="bad" seed={4} />
      </svg>
      <p className="ink-foot mono">MEDIANS ON AN APPLE M1 PRO · ALL FIVE ENGINES PRINT BYTE-IDENTICAL OUTPUT</p>
    </div>
  );
}
