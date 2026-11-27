"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./hooks";
import s from "./ScoutInterlock.module.css";

type P = [number, number];
type Box = { id: string; ref: string; name: string; sub: string; x: number; y: number; w: number; h: number };
type Layout = {
  key: "wide" | "narrow"; vb: string; boxes: Box[]; gh: { x: number; y: number; w: number; h: number };
  night: P[][]; pre: P[]; post: P[]; junction: P; diode: string; xMark: P; guardLbl: { x: number; y: number; anchor: "start" | "middle" | "end" };
  sw: string; swHit: [number, number, number, number]; swLbl: P; swAnchor: "middle" | "start";
  feed: P[]; live: P[]; out: P[]; flow: P[]; secret: { stub: P[]; g: P; lbl: P };
};

const WB = (id: string, ref: string, name: string, sub: string, x: number, w = 82): Box => ({ id, ref, name, sub, x, y: 34, w, h: 42 });
const NB = (id: string, ref: string, name: string, sub: string, y: number): Box => ({ id, ref, name, sub, x: 16, y, w: 120, h: 40 });

const WIDE: Layout = {
  key: "wide", vb: "0 0 720 218",
  boxes: [
    WB("u1", "U1", "Scan", "9 pm · GHA", 10, 82),
    WB("u2", "U2", "Routine", "Claude", 116, 82),
    WB("u3", "U3", "Data repo", "Private", 222, 84),
    WB("u4", "U4", "Worker", "+ CF Access", 330, 84),
    { id: "u5", ref: "U5", name: "act.yml", sub: "Only writer", x: 516, y: 34, w: 84, h: 42 },
  ],
  gh: { x: 644, y: 22, w: 66, h: 174 },
  night: [[[92, 55], [116, 55]], [[198, 55], [222, 55]], [[306, 55], [330, 55]]],
  junction: [210, 55], pre: [[210, 55], [210, 164], [374, 164]], post: [[406, 164], [644, 164]],
  diode: "translate(374 164)", xMark: [390, 164], guardLbl: { x: 390, y: 186, anchor: "middle" },
  sw: "translate(442 55)", swHit: [430, 8, 72, 74], swLbl: [466, 94], swAnchor: "middle",
  feed: [[414, 55], [442, 55]], live: [[490, 55], [516, 55]], out: [[600, 55], [644, 55]], flow: [[414, 55], [644, 55]],
  secret: { stub: [[558, 76], [558, 98]], g: [558, 98], lbl: [558, 126] },
};
const NARROW: Layout = {
  key: "narrow", vb: "0 0 360 540",
  boxes: [
    NB("u1", "U1", "Scan", "9 pm · GH Actions", 20),
    NB("u2", "U2", "Routine", "Claude · drafts", 88),
    NB("u3", "U3", "Data repo", "Private", 156),
    NB("u4", "U4", "Worker", "+ CF Access", 224),
    { id: "u5", ref: "U5", name: "act.yml", sub: "Only writer", x: 16, y: 368, w: 120, h: 40 },
  ],
  gh: { x: 16, y: 472, w: 328, h: 52 },
  night: [[[76, 60], [76, 88]], [[76, 128], [76, 156]], [[76, 196], [76, 224]]],
  junction: [76, 142], pre: [[76, 142], [322, 142], [322, 206]], post: [[322, 238], [322, 472]],
  diode: "translate(322 206) rotate(90)", xMark: [322, 222], guardLbl: { x: 306, y: 210, anchor: "end" },
  sw: "translate(76 292) rotate(90)", swHit: [36, 274, 114, 84], swLbl: [118, 314], swAnchor: "start",
  feed: [[76, 264], [76, 292]], live: [[76, 340], [76, 368]], out: [[76, 408], [76, 472]], flow: [[76, 264], [76, 472]],
  secret: { stub: [[136, 388], [164, 388], [164, 402]], g: [164, 402], lbl: [154, 430] },
};

const pts = (p: P[]) => p.map(([x, y]) => `${x},${y}`).join(" ");
const ATTEMPTS = ["gh pr create", "gh issue comment", "gh pr merge", "gh api -X POST", "git push upstream", "curl -X POST"];
type Line = { t: string; who: string; msg: string; kind?: "ok" | "bad" | "wait" };
const NIGHT: Line[] = [
  { t: "21:00", who: "U1", msg: "scan starts on GitHub Actions, plain Python, no AI" },
  { t: "21:06", who: "U1", msg: "issues ranked by how each project treats outside contributors" },
  { t: "21:14", who: "U2", msg: "1 ready item, 2 briefings, reply drafted, nothing posted" },
  { t: "21:15", who: "U2", msg: "git push → oss-scout-data (the one allowed branch)" },
  { t: "08:00", who: "--", msg: "digest email sent" },
  { t: "08:00", who: "S1", msg: "open · draft waiting for your tap", kind: "wait" },
];

function Schematic({ L, pressed, attempt, merged }: { L: Layout; pressed: boolean; attempt: "idle" | "flow" | "blocked"; merged: boolean }) {
  const { gh } = L;
  const tok = L.secret;
  return (
    <svg viewBox={L.vb} className={`${s.svg} ${s[L.key]}`} role="img"
      aria-label="Schematic. Scan, routine, data repo and worker run in series to a normally open switch S1, your tap, then act.yml, then GitHub. A second path from the routine to GitHub passes through guard.py, which blocks it.">
      {L.night.map((w, i) => <polyline key={i} points={pts(w)} className={s.wire} />)}
      <polyline points={pts(L.feed)} className={s.wire} />
      <polyline points={pts(L.live)} className={`${s.wire} ${pressed ? "" : s.dead}`} />
      <polyline points={pts(L.out)} className={`${s.wire} ${pressed ? "" : s.dead}`} />
      <polyline points={pts(L.pre)} className={`${s.wire} ${attempt === "blocked" ? s.hotWire : ""}`} />
      <polyline points={pts(L.post)} className={`${s.wire} ${s.dead}`} />
      {pressed && <polyline points={pts(L.flow)} className={s.flow} />}
      {attempt === "flow" && <polyline points={pts(L.pre)} className={s.flowHot} />}
      <circle cx={L.junction[0]} cy={L.junction[1]} r="3.2" className={s.dot} />

      {L.boxes.map((b) => (
        <g key={b.id}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} className={s.box} />
          <text x={b.x + 2} y={b.y - 5} className={s.ref}>{b.ref}</text>
          <text x={b.x + b.w / 2} y={b.y + b.h / 2 - 2} className={s.name}>{b.name}</text>
          <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 11} className={s.sub}>{b.sub}</text>
        </g>
      ))}

      <rect x={gh.x} y={gh.y} width={gh.w} height={gh.h} className={`${s.box} ${merged ? s.okBox : ""}`} />
      <text x={gh.x + 2} y={gh.y - 5} className={s.ref}>J1</text>
      <text x={gh.x + gh.w / 2} y={L.key === "wide" ? gh.y + 84 : gh.y + 23} className={s.name}>GitHub</text>
      {merged && L.key === "wide" ? (
        <text x={gh.x + gh.w / 2} y={gh.y + 102} className={s.okTxt}>PR<tspan x={gh.x + gh.w / 2} dy="14">opened</tspan></text>
      ) : (
        <text x={gh.x + gh.w / 2} y={L.key === "wide" ? gh.y + 100 : gh.y + 38} className={merged ? s.okTxt : s.sub}>{merged ? "PR opened" : "Public"}</text>
      )}

      <g transform={L.diode} className={attempt === "blocked" ? s.hotSym : ""}>
        <polyline points="0,0 8,0" className={s.wire} />
        <polyline points="24,0 32,0" className={s.wire} />
        <polygon points="24,-9 24,9 8,0" className={s.sym} />
        <line x1="8" y1="-9" x2="8" y2="9" className={s.sym} />
      </g>
      <text x={L.guardLbl.x} y={L.guardLbl.y} textAnchor={L.guardLbl.anchor} className={s.ref}>D1 Guard</text>
      <text x={L.guardLbl.x} y={L.guardLbl.y + 13} textAnchor={L.guardLbl.anchor} className={s.sub2}>guard.py · PreToolUse</text>
      <text x={L.guardLbl.x} y={L.guardLbl.y + 25} textAnchor={L.guardLbl.anchor} className={s.sub2}>37 tests · blocks writes</text>
      {attempt === "blocked" && (
        <g className={s.xmark} transform={`translate(${L.xMark[0]} ${L.xMark[1]})`}>
          <rect x="-11" y="-11" width="22" height="22" />
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" />
        </g>
      )}

      <g transform={L.sw} className={pressed ? s.closed : ""}>
        <circle cx="0" cy="0" r="3" className={s.contact} />
        <circle cx="48" cy="0" r="3" className={s.contact} />
        <g className={s.plunger}>
          <line x1="-4" y1="-14" x2="52" y2="-14" className={s.sym} />
          <line x1="24" y1="-14" x2="24" y2="-30" className={s.sym} />
          <line x1="15" y1="-30" x2="33" y2="-30" className={s.sym} />
        </g>
      </g>
      <text x={L.swLbl[0]} y={L.swLbl[1]} textAnchor={L.swAnchor} className={s.swRef}>Your tap</text>
      <text x={L.swLbl[0]} y={L.swLbl[1] + 14} textAnchor={L.swAnchor} className={s.sub2}>{pressed ? "Closed" : "Normally open"}</text>

      <polyline points={pts(tok.stub)} className={s.wire} />
      <g transform={`translate(${tok.g[0]} ${tok.g[1]})`} className={s.sym}>
        <line x1="-11" y1="0" x2="11" y2="0" /><line x1="-7" y1="5" x2="7" y2="5" /><line x1="-3" y1="10" x2="3" y2="10" />
      </g>
      <text x={tok.lbl[0]} y={tok.lbl[1]} textAnchor={L.key === "wide" ? "middle" : "start"} className={s.ref}>SUBMIT_TOKEN</text>
      <text x={tok.lbl[0]} y={tok.lbl[1] + 12} textAnchor={L.key === "wide" ? "middle" : "start"} className={s.sub2}>data-repo secret only</text>
    </svg>
  );
}

export default function ScoutInterlock() {
  const [pressed, setPressed] = useState(false);
  const [attempt, setAttempt] = useState<"idle" | "flow" | "blocked">("idle");
  const [merged, setMerged] = useState(false);
  const [log, setLog] = useState<Line[]>(NIGHT);
  const [status, setStatus] = useState("Switch open. A drafted fix is waiting for your tap.");
  const minute = useRef(12);
  const tries = useRef(0);
  const downAt = useRef(0);
  const timers = useRef<number[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };
  const add = (who: string, msg: string, kind?: Line["kind"]) => {
    const t = `08:${String(Math.min(59, minute.current++)).padStart(2, "0")}`;
    setLog((l) => [...l.filter((x) => x.kind !== "wait"), { t, who, msg, kind }].slice(-7));
  };

  const tryPost = () => {
    if (attempt === "flow") return;
    const cmd = ATTEMPTS[tries.current++ % ATTEMPTS.length];
    const block = () => {
      setAttempt("blocked");
      add("D1", `BLOCKED  ${cmd}  · guard.py`, "bad");
      setStatus(`Blocked: the routine tried ${cmd} and guard.py stopped it.`);
      later(() => setAttempt((a) => (a === "blocked" ? "idle" : a)), 2600);
    };
    if (reduced) block();
    else { setAttempt("flow"); later(block, 900); }
  };

  const press = () => {
    if (pressed) return;
    downAt.current = performance.now();
    setPressed(true);
    setMerged(true);
    add("U5", "S1 closed → act.yml: fork, branch, PR opened, as you", "ok");
    setStatus("Switch closed. act.yml opened the pull request on GitHub, as you.");
  };
  const release = () => {
    if (!pressed) return;
    const held = performance.now() - downAt.current;
    later(() => setPressed(false), Math.max(0, 500 - held));
  };

  return (
    <div className={s.root}>
      <ol className={s.night} aria-label="Timeline, not to scale">
        <li><b>9 PM</b> scan</li>
        <li><b>then</b> drafts</li>
        <li><b>8 AM</b> email</li>
        <li className={pressed || merged ? s.nowOn : ""}><b>you</b> tap</li>
      </ol>

      <div className={s.board}>
        {[WIDE, NARROW].map((L) => (
          <div key={L.key} className={`${s.wrap} ${s[L.key]}`}>
            <Schematic L={L} pressed={pressed} attempt={attempt} merged={merged} />
            <span aria-hidden="true" className={s.hit}
              style={{ left: `${((L.swHit[0] / +L.vb.split(" ")[2]) * 100).toFixed(2)}%`, top: `${((L.swHit[1] / +L.vb.split(" ")[3]) * 100).toFixed(2)}%`, width: `${((L.swHit[2] / +L.vb.split(" ")[2]) * 100).toFixed(2)}%`, height: `${((L.swHit[3] / +L.vb.split(" ")[3]) * 100).toFixed(2)}%` }}
              onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(); }}
              onPointerUp={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()} />
          </div>
        ))}
      </div>

      <div className={s.ctl}>
        <button className={s.btn} onClick={tryPost} disabled={attempt === "flow"}>Agent tries to post</button>
        <button className={`${s.btn} ${s.tap}`} data-keys aria-pressed={pressed}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); press(); }}
          onPointerUp={release} onPointerCancel={release} onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!e.repeat) press(); } }}
          onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); release(); } }}
          onBlur={release}
          onClick={(e) => { if (e.detail === 0 && !pressed) { press(); later(() => setPressed(false), 500); } }}>
          Hold S1 · your tap
        </button>
        <button className={s.btn} onClick={() => { timers.current.forEach(clearTimeout); timers.current = []; setPressed(false); setAttempt("idle"); setMerged(false); setLog(NIGHT); minute.current = 12; tries.current = 0; setStatus("Reset. Switch open."); }}>Reset</button>
      </div>

      <div className={s.log} role="log" aria-label="Run log">
        {log.map((l, i) => (
          <div key={`${l.t}-${i}`} className={l.kind ? s[l.kind] : ""}><span>{l.t}</span><span>{l.who}</span><span>{l.msg}</span></div>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">{status}</p>

      <div className={s.chips}>
        <span><b>1</b> write path</span>
        <span><b>≈280</b> tests</span>
        <span>merged upstream: <b>Soup</b> 9.8k★ · <b>fusioncore</b> 380★</span>
      </div>
    </div>
  );
}
