"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Status from "../components/Status";
import { commas, mulberry32, useReducedMotion } from "./hooks";
import type { FigureProps } from ".";
import s from "./AccordionMap.module.css";

type Kind = "user" | "think" | "call" | "result" | "reply";
type Block = { id: number; kind: Kind; tokens: number; label: string; rel: number; code: string };

const KIND_NAME: Record<Kind, string> = { user: "User message", think: "Thinking", call: "Tool call", result: "Tool result", reply: "Assistant reply" };
const BUDGET = 100_000;
const TAIL = 20_000;
const DIGEST = 100;

const FILES = ["parser.ts", "lexer.ts", "routes/api.ts", "db/schema.sql", "auth.ts", "README.md", "tests/parse.test.ts", "config.json", "server.py", "utils/date.ts"];
const USER = ["Fix the failing parse test", "Add pagination to /items", "Why is login slow?", "Refactor the date helpers", "Write a migration for tags", "Run the suite again"];

function makeSession(): Block[] {
  const r = mulberry32(2028);
  const out: Block[] = [];
  let id = 0;
  const push = (kind: Kind, tokens: number, label: string) => {
    out.push({ id, kind, tokens: Math.round(tokens), label, rel: 0, code: (0x1a2b3c + id * 7919).toString(16).slice(-6) });
    id++;
  };
  for (let turn = 0; turn < 12; turn++) {
    push("user", 200 + r() * 900, USER[turn % USER.length]);
    push("think", 400 + r() * 2200, "Plans the next step");
    const calls = 1 + Math.floor(r() * 3);
    for (let c = 0; c < calls; c++) {
      const f = FILES[Math.floor(r() * FILES.length)];
      const kind = r();
      push("call", 80 + r() * 260, kind < 0.6 ? `read("${f}")` : kind < 0.85 ? `grep("TODO", "${f}")` : "run_tests()");
      push("result", r() < 0.25 ? 6000 + r() * 6000 : 600 + r() * 3600, kind < 0.6 ? `${f}, ${Math.round(80 + r() * 300)} lines` : kind < 0.85 ? `${Math.round(2 + r() * 20)} matches in ${f}` : `${Math.round(40 + r() * 80)} passed, ${Math.round(r() * 4)} failed`);
    }
    push("reply", 250 + r() * 1400, "Explains the change");
  }
  // relevance: recent and user-authored context matters more; big stale tool output least
  const n = out.length;
  out.forEach((b, i) => {
    const recency = i / n;
    const kindW = b.kind === "user" ? 0.35 : b.kind === "reply" ? 0.15 : b.kind === "think" ? 0.05 : b.kind === "call" ? 0.1 : 0;
    b.rel = Math.min(0.99, 0.08 + recency * 0.55 + kindW + r() * 0.18);
  });
  return out;
}

const dice = (t: number) => (t <= 400 ? 1 : t <= 900 ? 2 : t <= 1800 ? 3 : t <= 3500 ? 4 : t <= 7000 ? 5 : 6);
const PIPS: Record<number, [number, number][]> = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [3, 1], [1, 3], [3, 3]],
  5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]],
  6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]],
};
const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

type Mode = "live" | "compact";

// What the Reel shows. The folded set is the conductor's rule (lowest relevance first, stop at the
// target) run once on the seeded session, so every load folds the same blocks.
const BEAT_TARGET = BUDGET * 0.72;
const SHORTLIST = 3;
const BEAT_TEXT = [
  "A long session fills the window and goes over budget. Every block is shown at full size.",
  "Stale blocks fold into thin slivers in place. The newest blocks sit in a protected tail that never folds. The budget bar drops under the limit.",
  "One folded block is chosen from a shortlist of three, ranked by cross-encoder rerank score, and unfolds.",
  "A health strip reports whether folding helped. Its values are illustrative.",
];

function planBeats(blocks: Block[], tailStart: number) {
  const order = blocks.slice(0, tailStart).sort((a, b) => a.rel - b.rel);
  let cur = blocks.reduce((a, b) => a + b.tokens, 0);
  const folded: Block[] = [];
  for (const b of order) {
    if (cur <= BEAT_TARGET) break;
    folded.push(b);
    cur -= b.tokens - DIGEST;
  }
  const shortlist = [...folded].sort((a, b) => b.rel - a.rel).slice(0, SHORTLIST);
  return { folded: new Set(folded.map((b) => b.id)), shortlist };
}

function Legend({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {(Object.keys(KIND_NAME) as Kind[]).map((kk) => (
        <span key={kk}><i className={`${s.sw} ${s[kk]}`} />{KIND_NAME[kk]}</span>
      ))}
    </div>
  );
}

export default function AccordionMap({ beat }: FigureProps = {}) {
  const blocks = useMemo(() => makeSession(), []);
  const tailStart = useMemo(() => {
    let sum = 0;
    for (let i = blocks.length - 1; i >= 0; i--) {
      sum += blocks[i].tokens;
      if (sum >= TAIL) return i;
    }
    return 0;
  }, [blocks]);
  const plan = useMemo(() => planBeats(blocks, tailStart), [blocks, tailStart]);
  const inBeat = typeof beat === "number";
  const [folded, setFolded] = useState<Set<number>>(() => new Set());
  const [mode, setMode] = useState<Mode>("live");
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [hover, setHover] = useState<Block | null>(null);
  const [nudge, setNudge] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const history = blocks.slice(0, tailStart);
  const tail = blocks.slice(tailStart);
  const total = blocks.reduce((a, b) => a + b.tokens, 0);
  const histTokens = history.reduce((a, b) => a + b.tokens, 0);
  const tailTokens = total - histTokens;
  // In a beat the folded set comes from the plan; the chosen block is back by beat 2.
  const chosen = plan.shortlist[0]?.id;
  const beatFolded = useMemo(() => {
    if (!inBeat || beat === 0) return new Set<number>();
    const f = new Set(plan.folded);
    if (beat >= 2 && chosen !== undefined) f.delete(chosen);
    return f;
  }, [inBeat, beat, plan, chosen]);
  const shown = inBeat ? beatFolded : folded;
  const inView =
    mode === "compact" && !inBeat ? tailTokens + 1800 : blocks.reduce((a, b) => a + (shown.has(b.id) ? DIGEST : b.tokens), 0);
  const over = inView > BUDGET;
  const recoverable = mode === "compact" ? 0 : history.length;

  const toggle = (b: Block) => {
    if (running || mode === "compact") return;
    if (b.id >= tailStart) {
      setNudge(b.id);
      timers.current.push(window.setTimeout(() => setNudge(null), 500));
      return;
    }
    setFolded((f) => {
      const n = new Set(f);
      if (n.has(b.id)) n.delete(b.id);
      else n.add(b.id);
      return n;
    });
  };

  const conduct = () => {
    if (running) return;
    setMode("live");
    setRunning(true);
    const target = BUDGET * 0.85;
    const order = [...history].sort((a, b) => a.rel - b.rel);
    const plan: number[] = [];
    let cur = blocks.reduce((a, b) => a + (folded.has(b.id) ? DIGEST : b.tokens), 0);
    for (const b of order) {
      if (cur <= target) break;
      if (folded.has(b.id)) continue;
      plan.push(b.id);
      cur -= b.tokens - DIGEST;
    }
    const step = reduced ? 0 : 340;
    [0, 1, 2].forEach((st) => timers.current.push(window.setTimeout(() => setStage(st), st * step)));
    const t0 = step * 3;
    plan.forEach((id, i) =>
      timers.current.push(window.setTimeout(() => setFolded((f) => new Set(f).add(id)), t0 + i * (reduced ? 0 : 55))),
    );
    timers.current.push(
      window.setTimeout(() => { setRunning(false); setStage(3); }, t0 + plan.length * (reduced ? 0 : 55) + 50),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(false);
    setFolded(new Set());
    setMode("live");
    setStage(-1);
  };

  const cell = (b: Block) => {
    const f = mode === "live" && folded.has(b.id);
    const d = dice(b.tokens);
    return (
      <button
        key={b.id}
        type="button"
        className={`${s.blk} ${s[b.kind]} ${f ? s.folded : ""} ${nudge === b.id ? s.nudge : ""}`}
        onClick={() => toggle(b)}
        onPointerEnter={() => setHover(b)}
        onFocus={() => setHover(b)}
        aria-label={`${KIND_NAME[b.kind]}, ${k(b.tokens)} tokens${f ? ", folded" : ""}`}
        aria-pressed={f}
      >
        <svg viewBox="0 0 4 4" aria-hidden="true">
          {PIPS[d].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.42" />)}
        </svg>
      </button>
    );
  };

  // Beat mode: plain, non-interactive squares. A folded block shrinks to a sliver inside its cell.
  const beatCell = (b: Block) => {
    const f = beatFolded.has(b.id);
    const pulse = beat === 2 && b.id === chosen;
    return (
      <span key={b.id} className={s.cellW} aria-hidden="true">
        <span className={`${s.blk} ${s.flat} ${s[b.kind]} ${f ? s.sliver : ""} ${pulse ? s.pulse : ""}`}>
          <svg viewBox="0 0 4 4">
            {PIPS[dice(b.tokens)].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.42" />)}
          </svg>
        </span>
      </span>
    );
  };

  if (inBeat) {
    const b = Math.min(Math.max(beat, 0), BEAT_TEXT.length - 1);
    return (
      <div className={`${s.root} ${s.beatRoot}`} data-beat={b}>
        <p className="visually-hidden">{BEAT_TEXT[b]}</p>
        <div className={s.meter}>
          <div className={s.meterTop}>
            <span className="lbl">Tokens the agent sees</span>
            <span className={`readout ${over ? s.overTxt : ""}`}>
              <b>{commas(inView)}</b> / {commas(BUDGET)} budget
              <span className={s.state}>{over ? " · over" : " · within"}</span>
            </span>
          </div>
          <div className={s.bar}>
            <span className={`${s.fill} ${over ? s.over : ""}`} style={{ width: `${Math.min(100, (inView / (BUDGET * 1.5)) * 100).toFixed(2)}%` }} />
            <span className={s.budget} style={{ left: `${(100 / 1.5).toFixed(2)}%` }} />
          </div>
        </div>

        <div className={s.grid} aria-hidden="true">{history.map(beatCell)}</div>
        <div className={s.tailBracket} aria-hidden="true">
          <span className={s.tailLbl2}>Protected tail · never folded</span>
          <div className={s.grid}>{tail.map(beatCell)}</div>
        </div>

        <div className={s.slot}>
          {b === 0 && <Legend className={`${s.legend} ${s.legendNarrow}`} />}
          {b === 2 && (
            <div className={s.short} aria-hidden="true">
              <span className="lbl">Unfold shortlist · cross-encoder rerank · simulated scores</span>
              <ol>
                {plan.shortlist.map((c, i) => (
                  <li key={c.id} className={i === 0 ? s.pick : ""}>
                    <i className={`${s.sw} ${s[c.kind]}`} />
                    <span>{KIND_NAME[c.kind]}</span>
                    <span className={s.dim}>{c.label}</span>
                    <b>{c.rel.toFixed(2)}</b>
                    {i === 0 && <em>unfolded</em>}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {b === 3 && (
            <div className={s.health}>
              <span className="lbl">Health · illustrative</span>
              {/* TODO(aadi): illustrative values in the beat 3 health strip; replace with real numbers or confirm */}
              <ul>
                <li><span>Health: OK</span><Status s="Stated" /></li>
                <li><span>Needed-fold rate 0.18</span><Status s="Stated" /></li>
                <li><span>vs. naive compaction: +2 facts retained</span><Status s="Stated" /></li>
              </ul>
            </div>
          )}
        </div>
        <Legend className={`${s.legend} ${s.legendWide}`} />
      </div>
    );
  }

  const hb = hover;
  const hFolded = hb && folded.has(hb.id) && mode === "live";

  return (
    <div className={s.root}>
      <div className={s.meter}>
        <div className={s.meterTop}>
          <span className="lbl">Tokens the agent sees</span>
          <span className={`readout ${over ? s.overTxt : ""}`}>
            <b>{commas(inView)}</b> / {commas(BUDGET)} budget
          </span>
        </div>
        <div className={s.bar}>
          <span className={`${s.fill} ${over ? s.over : ""}`} style={{ width: `${Math.min(100, (inView / (BUDGET * 1.4)) * 100).toFixed(2)}%` }} />
          <span className={s.budget} style={{ left: "71.43%" }} />
        </div>
      </div>

      <div className={s.grid} role="group" aria-label="Context history">
        {mode === "compact" ? (
          <div className={s.summary}>
            <b>/compact summary</b>
            <span>{history.length} blocks flattened into one lossy paragraph. 0 recoverable.</span>
          </div>
        ) : (
          history.map(cell)
        )}
      </div>
      <div className={s.tailLbl}><span>Protected working tail · newest ≈{k(tailTokens)} tokens · never folded</span></div>
      <div className={`${s.grid} ${s.tail}`} role="group" aria-label="Protected tail">{tail.map(cell)}</div>

      <div className={s.inspect} aria-live="polite">
        {hb ? (
          <>
            <span className={`${s.sw} ${s[hb.kind]}`} />
            <b>{KIND_NAME[hb.kind]}</b>
            <span>{hFolded ? `{#${hb.code} FOLDED} · ${DIGEST} tokens` : `${k(hb.tokens)} tokens`}</span>
            <span className={s.dim}>{hb.label}</span>
            <span className={s.dim}>relevance {hb.rel.toFixed(2)}</span>
          </>
        ) : (
          <span className={s.dim}>Hover a block to inspect it. Click to fold or unfold. Folding keeps the full block on disk.</span>
        )}
      </div>

      <div className="ctl">
        <button className="btn go" onClick={conduct} disabled={running}>Run conductor ▶</button>
        <button className="btn" aria-pressed={mode === "compact"} onClick={() => { reset(); setMode("compact"); }}>/compact</button>
        <button className="btn" onClick={reset}>Reset</button>
        <span className={s.stages} aria-label="Relevance pipeline">
          {["keyword", "bi-encoder", "cross-encoder"].map((n, i) => (
            <span key={n} className={stage >= i ? s.stOn : ""}>{i + 1} {n}</span>
          ))}
        </span>
      </div>

      <div className={s.foot}>
        <span className="readout">Recoverable: <b>{recoverable}</b> / {history.length} old blocks</span>
        <span className={s.legend}>
          {(Object.keys(KIND_NAME) as Kind[]).map((kk) => (
            <span key={kk}><i className={`${s.sw} ${s[kk]}`} />{KIND_NAME[kk]}</span>
          ))}
          <span><i className={s.dieKey}>⚅</i>pips = size</span>
        </span>
      </div>

      <div className={s.bench}>
        <span className="lbl">SlopCodeBench @ 100K tokens</span>
        <div className={s.benchRow}>
          <span>Accordion</span>
          <span className={s.pips}>{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className={i < 5 ? s.pass : ""} />)}</span>
          <b>5 / 6</b>
        </div>
        <div className={s.benchRow}>
          <span>Naive compaction</span>
          <span className={s.pips}>{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className={i < 2 ? s.pass : ""} />)}</span>
          <b>2 / 6</b>
        </div>
      </div>
    </div>
  );
}
