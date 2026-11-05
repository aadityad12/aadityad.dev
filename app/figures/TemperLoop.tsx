"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";
import s from "./TemperLoop.module.css";

type Sign = "dn" | "eq" | "up" | "st";

const STEPS = [
  { name: "Bundle", actors: ["CLIENT"], msg: "The client collects system_prompt.md, skills/*.md and tools/*.json into one bundle and validates it against Draft 7 JSON Schemas." },
  { name: "Evaluate", actors: ["SERVICE", "HARNESS", "BARE", "JUDGE"], msg: "The service generates questions. The harness under test and a bare DeepSeek baseline answer the same ones, and Gemini scores each answer pair." },
  { name: "Deltas", actors: ["SERVICE"], msg: "Same question, same base model. A ▼ means the harness itself made the answer worse: four dimensions regress." },
  { name: "Patch", actors: ["SERVICE", "CLIENT"], msg: "The service returns complete replacement files for the failing dimensions, and the client applies them." },
  { name: "Re-evaluate", actors: ["CLIENT", "SERVICE", "HARNESS", "BARE", "JUDGE"], msg: "A dimension-scoped re-evaluation re-runs only the affected dimensions and renders before and after. Error recovery stays flagged." },
];

const ACTORS: [string, string][] = [
  ["CLIENT", "local"],
  ["SERVICE", "FastAPI"],
  ["HARNESS", "under test"],
  ["BARE", "DeepSeek"],
  ["JUDGE", "Gemini"],
];

const FILES = [
  { path: "system_prompt.md", depth: 1, glyph: "├─", patched: true },
  { path: "skills/", depth: 1, glyph: "├─", dir: true },
  { path: "refunds.md", depth: 2, glyph: "└─", patched: true },
  { path: "tools/", depth: 1, glyph: "└─", dir: true },
  { path: "lookup_order.json", depth: 2, glyph: "└─", patched: true },
];

const DIMS: { name: string; before: Sign; after?: Sign; file?: string }[] = [
  { name: "Instruction adherence", before: "dn", after: "up", file: "system_prompt.md" },
  { name: "Tool accuracy", before: "dn", after: "up", file: "lookup_order.json" },
  { name: "Output format", before: "dn", after: "eq", file: "system_prompt.md" },
  { name: "Skill triggering", before: "dn", after: "up", file: "skills/refunds.md" },
  { name: "Latency delta", before: "eq" },
  { name: "Error recovery", before: "st" },
];

const GLYPH: Record<Sign, string> = { dn: "▼", eq: "=", up: "▲", st: "–" };
const SIGN_WORD: Record<Sign, string> = { dn: "worse", eq: "same", up: "better", st: "not inferred" };
const LEVEL: Record<Sign, number> = { dn: 1, eq: 2, up: 3, st: 0 };

function Mark({ level, label }: { level: number; label: string }) {
  if (level === 0) return <span className={`${s.mark} ${s.na}`} aria-label={label} role="img" />;
  return (
    <span className={s.mark} role="img" aria-label={label}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= level ? s.fill : ""} />)}
    </span>
  );
}

export default function TemperLoop() {
  const [step, setStep] = useState(3);
  const [auto, setAuto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const playing = auto && inView && !reduced;

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((n) => (n % 5) + 1), step === 5 ? 3200 : 2200);
    return () => clearTimeout(t);
  }, [playing, step]);

  const go = (n: number) => { setAuto(false); setStep(Math.min(5, Math.max(1, n))); };
  const cur = STEPS[step - 1];

  return (
    <div ref={ref} className={s.root}>
      <div className={s.top}>
        <span className={s.badge}>fixture: villain agent · deterministic · offline</span>
        <span className="lbl">make test-integration</span>
      </div>

      <ol className={s.rail} aria-label="Protocol steps">
        {STEPS.map((st, i) => (
          <li key={st.name}>
            <button
              className={`${s.stepBtn} ${i + 1 === step ? s.on : ""} ${i + 1 < step ? s.done : ""}`}
              aria-current={i + 1 === step ? "step" : undefined}
              onClick={() => go(i + 1)}
            >
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{st.name}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className={s.actors} aria-hidden="true">
        {ACTORS.map(([a, sub]) => (
          <span key={a} className={cur.actors.includes(a) ? s.act : ""}>
            {a}<small>{sub}</small>
          </span>
        ))}
      </div>
      <p className={s.msg} aria-live="polite">
        <b>Step {step} · {cur.name}.</b> {cur.msg}
      </p>

      <div className={s.body}>
        <div className={`${s.tree} ${step === 1 ? s.treeOn : ""}`}>
          <div className={s.head}>Bundle</div>
          <ul>
            <li className={s.dir}>bundle/</li>
            {FILES.map((f) => (
              <li key={f.path} className={f.dir ? s.dir : ""} style={{ paddingLeft: f.depth === 2 ? 16 : 0 }}>
                <span className={s.glyph}>{f.glyph}</span>
                <span className={step >= 4 && f.patched ? s.pf : ""}>{f.path}</span>
                {step >= 4 && f.patched && <em className={s.patched}>patched</em>}
              </li>
            ))}
          </ul>
          <div className={`${s.schema} ${step === 1 ? s.schemaOn : ""}`}>schema ✓ Draft 7</div>
          <div className={`lbl ${s.ill}`}>file names illustrative</div>
          {step >= 4 && <div className={s.repl}>complete replacement files, applied by the client</div>}
        </div>

        <div className={s.table} role="table" aria-label="Harness versus bare baseline by dimension">
          <div className={s.row + " " + s.hrow} role="row">
            <span role="columnheader">Dimension</span>
            <span role="columnheader">Harness</span>
            <span role="columnheader">Bare</span>
            <span role="columnheader">Δ</span>
          </div>
          {DIMS.map((d) => {
            const patchedRow = !!d.after;
            const sign: Sign = step === 5 && d.after ? d.after : d.before;
            const scored = step >= 2;
            const signed = step >= 3;
            let tag = "queued", tc = "";
            if (step === 2) tag = d.before === "st" ? "classified" : "scored";
            if (signed) {
              if (d.before === "st") { tag = "structural limitation"; tc = s.tAmber; }
              else if (step === 5) { tag = patchedRow ? "re-run" : "skipped · unchanged"; tc = patchedRow ? s.tAccent : s.tMuted; }
              else if (step === 4 && patchedRow) { tag = `patch → ${d.file}`; tc = s.tAccent; }
              else if (d.before === "dn") { tag = "harness-caused"; tc = s.tHot; }
              else { tag = "no regression"; tc = s.tMuted; }
            }
            const rowCls = signed && sign === "dn" ? s.bad : signed && d.before === "st" ? s.warn : step === 5 && patchedRow ? s.fixed : "";
            return (
              <div key={d.name} className={`${s.row} ${rowCls}`} role="row">
                <span role="cell" className={s.name}>
                  {d.name}
                  <em className={`${s.tag} ${tc}`}>{tag}</em>
                </span>
                <span role="cell">{scored ? <Mark level={LEVEL[sign]} label={`harness ${d.before === "st" ? "not scored" : "mark"}`} /> : <span className={s.pend} />}</span>
                <span role="cell">{scored ? <Mark level={d.before === "st" ? 0 : 2} label="bare mark" /> : <span className={s.pend} />}</span>
                <span role="cell" className={`${s.delta} ${signed ? s[sign] : ""}`} aria-label={signed ? SIGN_WORD[sign] : "pending"}>
                  {signed ? (
                    step === 5 && patchedRow ? <><del className={s.was}>▼</del><span className={s.arr}>→</span>{GLYPH[sign]}</> : GLYPH[sign]
                  ) : "·"}
                </span>
              </div>
            );
          })}
          <div className={s.legend}>
            <span>▲ better</span><span>▼ worse</span><span>= same</span>
            <span>marks qualitative · illustrative</span>
          </div>
        </div>
      </div>

      <div className="ctl">
        <button className="btn" onClick={() => go(step - 1)} disabled={step === 1}>◀ Back</button>
        <button className="btn go" onClick={() => go(step === 5 ? 1 : step + 1)}>{step === 5 ? "Restart ↺" : "Step ▶"}</button>
        <button
          className="btn"
          aria-pressed={auto}
          disabled={reduced}
          title={reduced ? "Disabled: reduced motion is on" : undefined}
          onClick={() => setAuto((a) => !a)}
        >
          {auto ? "Stop auto-play" : "Auto-play"}
        </button>
        <button className="btn" onClick={() => go(1)}>Reset</button>
        <span className={s.spacer} />
        <span className="lbl">Step {step} / 5</span>
      </div>
    </div>
  );
}
