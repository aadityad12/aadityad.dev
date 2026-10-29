"use client";

import { useState } from "react";

type Block = { name: string; tokens: number; stale: boolean };

const BLOCKS: Block[] = [
  { name: "System instructions", tokens: 8, stale: false },
  { name: "Terminal history", tokens: 11, stale: true },
  { name: "Earlier source reads", tokens: 15, stale: true },
  { name: "Tool results (resolved)", tokens: 12, stale: true },
  { name: "Current plan", tokens: 10, stale: false },
  { name: "Recent conversation", tokens: 25, stale: false },
  { name: "Active file context", tokens: 19, stale: false },
];

const BUDGET = 100;

type Mode = "accordion" | "naive";

export default function AccordionDemo() {
  const [folded, setFolded] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<Mode>("accordion");

  const toggle = (i: number) => {
    setFolded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const foldStale = () => setFolded(new Set(BLOCKS.map((b, i) => (b.stale ? i : -1)).filter((i) => i >= 0)));
  const reset = () => setFolded(new Set());

  const active = BLOCKS.reduce((sum, b, i) => (folded.has(i) ? sum : sum + b.tokens), 0);
  const stored = BUDGET - active;
  const naive = mode === "naive";

  return (
    <div className="demo" role="region" aria-label="Accordion context-folding demo">
      <div className="demo-head">
        <span className="dot" aria-hidden="true" />
        Fig. 1 — Context window explorer
        <span className="demo-tag">
          mode: <b>{naive ? "naive compaction" : "accordion"}</b>
        </span>
      </div>
      <div className="demo-body">
        <div className="acc-gauge">
          <span className="val">
            ACTIVE <b className={active / BUDGET > 0.9 ? "hot" : undefined}>{active}K</b> / {BUDGET}K
          </span>
          <span className="bar" aria-hidden="true">
            <i className={active / BUDGET > 0.9 ? "hot" : undefined} style={{ transform: `scaleX(${active / BUDGET})` }} />
          </span>
          <span className="val" style={{ color: "var(--panel-amber)" }}>
            {stored > 0 ? (naive ? `${stored}K DELETED` : `${stored}K STORED`) : "FULL"}
          </span>
        </div>

        <div className="acc-blocks">
          {BLOCKS.map((b, i) => {
            const isFolded = folded.has(i);
            const cls = naive && isFolded ? "gone" : isFolded ? "folded" : b.stale ? "stale" : "";
            return (
              <button
                key={b.name}
                type="button"
                className={`acc-block ${cls}`}
                onClick={() => toggle(i)}
                aria-pressed={isFolded}
                aria-label={`${b.name}, ${b.tokens}K tokens, ${isFolded ? (naive ? "deleted" : "folded") : "active"} — activate to ${isFolded ? "restore" : "fold"}`}
              >
                <span className="ab-row">
                  <span className="ab-ic" aria-hidden="true">
                    {isFolded ? (naive ? "✕" : "+") : "−"}
                  </span>
                  <span className="ab-name">{b.name}</span>
                  <span className="ab-tokens">
                    {b.tokens}K{isFolded ? (naive ? " · GONE" : " · STORED") : ""}
                  </span>
                </span>
                <span
                  className="ab-fill"
                  aria-hidden="true"
                  style={{ display: "block", transform: `scaleX(${isFolded && naive ? 0 : b.tokens / 25})` }}
                />
              </button>
            );
          })}
        </div>

        <div className="acc-actions">
          <button type="button" className="go" onClick={foldStale}>
            ▸ Fold stale automatically
          </button>
          <button
            type="button"
            className={naive ? "armed" : ""}
            onClick={() => setMode(naive ? "accordion" : "naive")}
          >
            {naive ? "◼ Naive compaction" : "◻ Compare: naive compaction"}
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
        <p className="acc-verdict" style={{ marginTop: 12, marginBottom: 0 }}>
          {naive ? (
            <>
              Deleted context is <b className="bad">gone for good</b> — naive compaction scored 33.3% (2/6) on
              SlopCodeBench.
            </>
          ) : (
            <>
              Folded context is <b>recoverable in one click</b> — Accordion scored 83.3% (5/6) at the same 100K
              budget.
            </>
          )}
        </p>

        <table className="mini">
          <thead>
            <tr>
              <th>SlopCodeBench @ 100K</th>
              <th>Score</th>
              <th>Checkpoints</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Accordion</td>
              <td className="win">83.3%</td>
              <td className="win">5 / 6</td>
            </tr>
            <tr>
              <td>Naive compaction</td>
              <td className="lose">33.3%</td>
              <td className="lose">2 / 6</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="demo-foot">
        <span>Click a block to fold / restore</span>
        <span>DeepSeek V4 Pro · same interleaved session</span>
      </div>
    </div>
  );
}
