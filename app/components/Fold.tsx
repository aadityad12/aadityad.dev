"use client";

import { useMemo, useState } from "react";

type Kind = "User" | "Assistant" | "Tool" | "Result";

type Block = {
  id: string;
  kind: Kind;
  title: string;
  tokens: number;
  protect: boolean;
};

const BLOCKS: Block[] = [
  { id: "u1", kind: "User", title: "Why did NaN-boxing get slower?", tokens: 14, protect: false },
  { id: "a1", kind: "Assistant", title: "Tracing the value representation.", tokens: 22, protect: false },
  { id: "t1", kind: "Tool", title: "read src/value.hpp", tokens: 18, protect: false },
  { id: "r1", kind: "Result", title: "NaN-box layout, 86 lines", tokens: 36, protect: false },
  { id: "u2", kind: "User", title: "Keep the slow row in the table.", tokens: 12, protect: true },
  { id: "a2", kind: "Assistant", title: "Leaving 0.63× on sieve.", tokens: 10, protect: true },
];

const STORED = BLOCKS.reduce((sum, block) => sum + block.tokens, 0);
const PROTECTED = BLOCKS.filter((block) => block.protect).reduce((sum, block) => sum + block.tokens, 0);
const SUMMARY = 16;

type Mode = "full" | "folded" | "compacted";

export function Fold() {
  const [mode, setMode] = useState<Mode>("full");

  const visible = mode === "full" ? STORED : mode === "folded" ? PROTECTED : PROTECTED + SUMMARY;
  const stored = mode === "compacted" ? PROTECTED + SUMMARY : STORED;
  const cold = BLOCKS.filter((block) => !block.protect);
  const tail = BLOCKS.filter((block) => block.protect);

  const status = useMemo(() => {
    if (mode === "folded") return "Cold blocks are folded. The 86-line result is still stored, and can come back whole.";
    if (mode === "compacted") return "Compaction replaced the cold blocks with a summary. The 86-line result is gone.";
    return "The model can see the whole session. The tail is protected either way.";
  }, [mode]);

  const cells = Array.from({ length: 72 }, (_, index) => ({
    index,
    kind: index % 4,
    protect: index >= 56,
  }));

  return (
    <div className={`fold is-${mode}`}>
      <div className="token-map" aria-hidden="true">
        {mode === "compacted" ? <span className="token-summary">Summary replaced the cold blocks</span> : null}
        {cells.map((cell) => (
          <span
            key={cell.index}
            className={cell.protect ? "token is-protect" : mode === "folded" ? "token is-cold" : mode === "compacted" ? "token is-gone" : "token"}
            data-kind={cell.kind}
          />
        ))}
      </div>
      <div className="meter-read">
        <span>Model sees <strong className="measure">{visible}</strong></span>
        <span>Stored <strong>{stored}</strong></span>
      </div>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${(visible / STORED) * 100}%` }} />
      </div>
      <p className="hint" role="status">{status}</p>
      <ol className="blocks">
        {mode === "compacted" ? (
          <li className="block is-summary" data-kind="Summary">
            <span className="block-kind">Summary</span>
            <span className="block-title">Discussed a regression. Original text discarded.</span>
            <span className="block-tokens">{SUMMARY}</span>
          </li>
        ) : (
          cold.map((block) => (
            <li key={block.id} className={mode === "folded" ? "block is-folded" : "block"} data-kind={block.kind}>
              <span className="block-kind">{block.kind}</span>
              <span className="block-title">
                {block.title}
                {mode === "folded" ? <em> Folded · still stored</em> : null}
              </span>
              <span className="block-tokens">{block.tokens}</span>
            </li>
          ))
        )}
        <li className="tail-label">Protected tail</li>
        {tail.map((block) => (
          <li key={block.id} className="block is-protected" data-kind={block.kind}>
            <span className="block-kind">{block.kind}</span>
            <span className="block-title">{block.title}</span>
            <span className="block-tokens">{block.tokens}</span>
          </li>
        ))}
      </ol>
      <div className="exhibit-actions">
        <button type="button" className="btn btn-primary" onClick={() => setMode("folded")} disabled={mode !== "full"}>
          Fold cold blocks
        </button>
        <button type="button" className="btn" onClick={() => setMode("compacted")} disabled={mode !== "full"}>
          Compact instead
        </button>
        <button type="button" className="btn" onClick={() => setMode("full")} disabled={mode === "full"}>
          {mode === "compacted" ? "Start over" : "Unfold"}
        </button>
      </div>
      <p className="hint">Folding can be undone. Compaction can’t.</p>
    </div>
  );
}
