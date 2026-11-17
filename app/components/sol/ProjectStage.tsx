"use client";

import Image from "next/image";
import type { ProjectId } from "../../lib/portfolio";
import AltaStage from "./AltaStage";
import { Beats, Count, Waves, useBeats, useSteps } from "./stageKit";

type Css = React.CSSProperties;

/* ---------------------------------------------------------------------
   01 Accordion. The session is one long strip of paper. The agent can
   only hold so much of it. Accordion pleats the parts it isn't using,
   and any pleat can be pulled flat again.
---------------------------------------------------------------------- */
const session = [
  { id: "tests", kind: "TOOL OUTPUT", name: "Test run, 3 failing", k: 30 },
  { id: "parser", kind: "FILE READ", name: "parser.ts", k: 22 },
  { id: "lexer", kind: "FILE READ", name: "lexer.ts", k: 16 },
  { id: "search", kind: "TOOL OUTPUT", name: "Search results", k: 10 },
  { id: "plan", kind: "PINNED", name: "plan.md", k: 14, keep: true },
  { id: "tail", kind: "NEWEST, ALWAYS KEPT", name: "The latest turns", k: 34, keep: true },
];
const LIMIT = 100, PLEAT = 73;
type Segment = { key: string; block: (typeof session)[number]; part: "whole" | "upper" | "lower"; k: number; angle: number; order: number; back: boolean };

function Strip({ segments, index = 0 }: { segments: Segment[]; index?: number }) {
  const segment = segments[index];
  if (!segment) return null;
  const { block, part } = segment;
  const previous = index ? segments[index - 1].angle : 0;
  return <div className={`acc-seg is-${part} acc-${block.id} ${segment.angle ? "is-pleated" : ""} ${segment.back ? "is-back" : ""}`} style={{ height: `calc(var(--u) * ${segment.k})`, transform: `rotateX(${segment.angle - previous}deg)`, "--n": segment.order } as Css}>
    <div className="acc-face">
      {part !== "lower" && <span className="acc-kind">{block.kind}</span>}
      <span className="acc-name"><b>{block.name}</b><i>{block.k}k</i></span>
    </div>
    <Strip segments={segments} index={index + 1} />
  </div>;
}

const accordionBeats = [5, 5, 5.5];
function Accordion() {
  const [host, state] = useBeats(accordionBeats);
  const { beat } = state;
  const folded = (id: string, keep?: boolean) => !keep && beat > 0 && !(beat === 2 && id === "parser");
  const segments = session.flatMap((block, order): Segment[] => block.keep
    ? [{ key: block.id, block, part: "whole" as const, k: block.k, angle: 0, order, back: false }]
    : (["upper", "lower"] as const).map(part => ({ key: block.id + part, block, part, k: block.k / 2, angle: folded(block.id) ? (part === "upper" ? PLEAT : -PLEAT) : 0, order, back: beat === 2 && block.id === "parser" })));
  const seen = session.reduce((sum, block) => sum + (folded(block.id, block.keep) ? 0 : block.k), 0);
  const total = session.reduce((sum, block) => sum + block.k, 0);
  const length = session.reduce((sum, block) => sum + block.k * (folded(block.id, block.keep) ? .3 : 1), 0);
  const line = ["A long coding session outgrows what an AI agent can hold.", "Accordion folds away the parts it isn’t using.", "Nothing is deleted. Any fold opens again, word for word."][beat];
  return <div ref={host} className={`stage stage-accordion beat-${beat}`} data-scene>
    <div className="stage-caption"><span>01 / ACCORDION</span><span>LESS CONTEXT. SAME MEMORY.</span></div>
    <div className="acc-hud" aria-live="polite">
      <span className="stage-label">WHAT THE AGENT IS HOLDING</span>
      <b className={seen > LIMIT ? "is-over" : ""}><Count value={seen} />k</b>
      <span className="acc-of">of the {LIMIT}k it has room for</span>
      <div className="acc-meter"><i style={{ width: `${(seen / 140 * 100).toFixed(2)}%` }} /><em style={{ left: `${(LIMIT / 140 * 100).toFixed(2)}%` }} /></div>
      <span className="acc-verdict">{["Too much. Something has to give.", "It fits, with room to keep working.", "parser.ts is back, exactly as it was."][beat]}</span>
      <span className="acc-disk">KEPT ON DISK {total}K <span>/</span> DELETED 0</span>
    </div>
    <div className="acc-scene" aria-hidden="true"><div className="acc-table" style={{ "--len": length } as Css}>
      <div className="acc-shadow" />
      <div className="acc-limit"><span>THE AGENT’S LIMIT, {LIMIT}K</span></div>
      <div className="acc-strip"><Strip segments={segments} /></div>
    </div></div>
    <div className="stage-bottom"><p>{line}<small>A context manager for AI coding agents. Illustrative session.</small></p><Beats state={state} labels={["The problem", "Fold", "Unfold"]} /></div>
  </div>;
}

/* ---------------------------------------------------------------------
   02 Rung. One function, run by four engines. Each beat shows what that
   engine actually executes, and how much faster it gets.
---------------------------------------------------------------------- */
const engines = [
  { name: "Tree walker", speed: 1, label: "IT WALKS A TREE", code: ["return", "└─ +", "   ├─ a", "   └─ b"], note: "Re-reads the shape of the program on every single call.", line: "Engine one reads the program like a diagram, every time it runs." },
  { name: "Stack VM", speed: 3.8, label: "IT RUNS BYTECODE", code: ["GET_LOCAL  1", "GET_LOCAL  2", "ADD", "RETURN"], note: "Translated once into four small steps.", line: "Engine two translates it once, into simple steps." },
  { name: "Register VM", speed: 5.71, label: "IT RUNS LEANER BYTECODE", code: ["ADD     r2 r0 r1", "RETURN  r2"], note: "Two steps. The values are named directly.", line: "Engine three does the same work in fewer steps." },
  { name: "ARM64 JIT", speed: 38.84, label: "IT RUNS MACHINE CODE", code: ["add  w2, w0, w1", "02 00 01 0b"], note: "The processor’s own instruction, written out byte by byte.", line: "Engine four hands the processor its own language." },
];
const rungBeats = [4.5, 4.5, 4.5, 6];
function Rung() {
  const [host, state] = useBeats(rungBeats);
  const engine = engines[state.beat];
  const reach = Math.log(engine.speed) / Math.log(38.84);
  return <div ref={host} className={`stage stage-rung engine-${state.beat}`} data-scene>
    <div className="stage-caption"><span>02 / RUNG</span><span>FROM A THOUGHT TO MACHINE CODE</span></div>
    <div className="rung-flow">
      <div className="rung-source"><span className="stage-label">ONE SMALL FUNCTION</span><code><i>fn</i> add(a, b) {"{"}<br />&nbsp;&nbsp;<i>return</i> a + b;<br />{"}"}</code></div>
      <span className="rung-arrow" aria-hidden="true">↓</span>
      <div className="rung-runs" key={state.beat} aria-live="polite"><span className="stage-label">{engine.label}</span><code>{engine.code.map((row, i) => <span key={row} style={{ "--i": i } as Css}>{row}</span>)}</code><p>{engine.note}</p></div>
    </div>
    <div className="rung-machine">
      <div className="processor" aria-hidden="true"><div className="processor-pins" /><div className="processor-chip"><span>RUNG / ENGINE {state.beat + 1} OF 4</span><b>{engine.name}</b><svg viewBox="0 0 120 56"><path d="M4 28h18l10-20 16 40L64 8l15 40 12-20h25" /></svg><small>SAME ANSWER. DIFFERENT PATH.</small></div></div>
      <div className="rung-speed"><b>{engine.speed === 1 ? "1×" : `${engine.speed}×`}</b><span>{engine.speed === 1 ? "the starting point" : "faster than the tree walker"}</span><div className="rung-track" aria-hidden="true"><i style={{ width: `${Math.max(2, reach * 100).toFixed(2)}%` }} />{engines.map((item, i) => <em key={item.name} className={i <= state.beat ? "is-passed" : ""} style={{ left: `${(Math.log(item.speed) / Math.log(38.84) * 100).toFixed(2)}%` }} />)}</div></div>
    </div>
    <div className="stage-bottom"><p>{engine.line}<small>One small language, built again and again to measure what each speed-up is worth. Timed on fib, Apple M1 Pro.</small></p><Beats state={state} labels={engines.map(item => item.name)} /></div>
    <div className="instruction-stream" aria-hidden="true"><span>LOAD → ADD → GUARD → COMPILE → EXECUTE → </span><span>LOAD → ADD → GUARD → COMPILE → EXECUTE → </span></div>
  </div>;
}

/* ---------------------------------------------------------------------
   03 GazeBoard. The phone, the four big tiles, and where the eyes are
   resting. Look, hold for a second, and it speaks. Three glances spell.
---------------------------------------------------------------------- */
const home = [["Yes"], ["No"], ["Help"], ["More", "SPELL"]];
const groups = [["A B C D", "E F G"], ["H I J K", "L M"], ["N O P Q", "R S"], ["T U V W", "X Y Z"]];
const choices = [["mom"], ["home"], ["inhaler"], ["Back", "SPELL MODE"]];
const script = [
  { tiles: home, moments: [500], looks: [2], counts: [], says: null as string | null },
  { tiles: home, moments: [1500], looks: [2], counts: [], says: "Help." },
  { tiles: groups, moments: [200, 1900, 3600, 5300], looks: [1, 2, 1], counts: [378, 72, 24, 3], says: null },
  { tiles: choices, moments: [500, 2000], looks: [1], counts: [3], says: "Home." },
];
const gazeBeats = [3.4, 4.6, 6.8, 5.2];

function GazePhone({ beat }: { beat: number }) {
  const scene = script[beat];
  const step = useSteps(scene.moments);
  // Beat 2 is three glances in a row; the others rest on a single tile.
  const glance = beat === 2 ? Math.min(step, 3) - 1 : beat === 1 || step > 0 ? 0 : -1;
  const looking = glance >= 0 && glance < scene.looks.length ? scene.looks[glance] : -1;
  const done = beat === 1 ? step >= 1 : beat === 3 ? step >= 2 : beat === 2 && step >= 4;
  const spoken = done && scene.says;
  const picked = beat === 2 ? scene.looks.slice(0, Math.max(0, step - 1)) : beat === 3 ? script[2].looks : [];
  const count = scene.counts[Math.min(scene.counts.length - 1, Math.max(0, step - 1))];
  return <>
    <div className="gz-phone"><div className="gz-screen">
      <div className="gz-top"><i />{beat < 2 ? "QUICK PHRASES" : <>{picked.length ? picked.map((group, i) => <b key={i}>{groups[group][0][0]}–{groups[group][1].slice(-1)}</b>) : "SPELL"}{count !== undefined && <em><Count value={count} /> {count === 1 ? "word" : "words"}</em>}</>}</div>
      <div className="gz-grid">
        {scene.tiles.map((tile, i) => <div key={tile[0]} className={`gz-tile ${looking === i ? "is-looked" : ""} ${looking === i && beat > 0 && !done ? "is-dwelling" : ""} ${looking === i && done && beat !== 2 ? "is-chosen" : ""}`}><b>{tile[0]}</b>{tile[1] && <span>{tile[1]}</span>}<i /></div>)}
        <span className={`gz-look ${looking < 0 ? "is-resting" : ""}`} style={looking < 0 ? undefined : { left: `${looking % 2 ? 75 : 25}%`, top: `${looking > 1 ? 75 : 25}%` }} />
      </div>
    </div></div>
    <div className={`said gz-said ${spoken ? "is-on" : ""}`} aria-live="polite"><Waves /><b>{spoken ? `“${spoken}”` : "…"}</b><span>SPOKEN ALOUD BY THE PHONE</span></div>
  </>;
}

function Gaze() {
  const [host, state] = useBeats(gazeBeats);
  const line = ["Look at one of the four corners.", "Hold your gaze for a second. The phone says it for you.", "Need another word? Three glances narrow 378 words to three.", "One more look, and it’s said."][state.beat];
  return <div ref={host} className={`stage stage-gaze beat-${state.beat}`} data-scene>
    <div className="stage-caption"><span>03 / GAZEBOARD</span><span>A GLANCE. A VOICE.</span></div>
    <GazePhone key={state.beat} beat={state.beat} />
    <div className="gz-statement" aria-hidden="true">A glance<br />can be<br /><span>a voice.</span></div>
    <div className="stage-bottom"><p>{line}<small>For someone who can’t speak or use their hands. Everything stays on the phone.</small></p><Beats state={state} labels={["Look", "Hold", "Spell", "Say it"]} /></div>
  </div>;
}

/* ---------------------------------------------------------------------
   04 VisionAssist. A small room in perspective: what the camera sees,
   how far each thing is, and the one sentence the wearer hears.
---------------------------------------------------------------------- */
const things = [
  { id: "chair", name: "chair", sure: ".91", x: -1.3, y: 4.5, w: 1.95, h: 3.05, feet: "4.5 ft", zone: "warn" },
  { id: "person", name: "person", sure: ".88", x: 2.3, y: 8, w: 2.1, h: 5.6, feet: "8 ft", zone: "care" },
  { id: "dog", name: "dog", sure: ".79", x: -2.7, y: 11.5, w: 2.95, h: 1.9, feet: "11.5 ft", zone: "safe" },
];
const shapes: Record<string, React.ReactNode> = {
  chair: <svg viewBox="0 0 64 100"><path d="M8 6a5 5 0 0 1 10 0v44h32a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5v34a3 3 0 0 1-6 0V62H18v34a3 3 0 0 1-6 0V62a5 5 0 0 1-4-5Z" /></svg>,
  person: <svg viewBox="0 0 60 160"><circle cx="30" cy="16" r="13" /><path d="M10 50a16 16 0 0 1 16-16h8a16 16 0 0 1 16 16v38a5 5 0 0 1-9 2V62h-2v90a6 6 0 0 1-8 2 6 6 0 0 1-2-4v-52h-2v52a6 6 0 0 1-10 2V62h-2v28a5 5 0 0 1-9-2Z" /></svg>,
  dog: <svg viewBox="0 0 124 80"><path d="M6 20c8 0 12 6 18 6h52c8 0 10-4 14-12 2-5 4-10 9-10l3 8 12 4c5 2 5 8 0 9l-10 2c-2 8-6 12-12 14v32a4 4 0 0 1-8 0V52H44v21a4 4 0 0 1-8 0V52c-8-2-13-8-14-17-4-3-10-4-16-15Z" /></svg>,
};
const visionBeats = [4.5, 4.5, 6];
function Vision() {
  const [host, state] = useBeats(visionBeats);
  const { beat } = state;
  const line = ["A camera on the headset spots what’s ahead.", "It works out how far away each thing is.", "Then it says the one that matters most, out loud."][beat];
  return <div ref={host} className={`stage stage-vision beat-${beat}`} data-scene>
    <div className="stage-caption"><span>05 / VISIONASSIST</span><span>SMALL DEVICE. REAL WORLD.</span></div>
    <div className="va-side">
      <figure className="va-photo"><Image src="/projects/visionassist-device.jpg" alt="The VisionAssist prototype: a Raspberry Pi 5 in a red case with a small camera module" fill sizes="(max-width: 650px) 45vw, 300px" /><figcaption>THE ACTUAL PROTOTYPE / PI 5 + CAMERA</figcaption></figure>
      <div className={`said va-said ${beat === 2 ? "is-on" : ""}`} aria-live="polite"><Waves /><b>{beat === 2 ? "“Stop. Chair, 2 steps ahead.”" : "…"}</b><span>WHAT THE WEARER HEARS</span></div>
    </div>
    <div className="va-scene" aria-hidden="true"><div className="va-floor">
      <div className="va-ground"><div className="va-cone" /><div className="va-ring is-near" /><div className="va-ring is-far" /><div className="va-you" /></div>
      <div className="va-mark is-near"><span>UNDER 6 FT, IT WARNS</span></div><div className="va-mark is-far"><span>9 FT</span></div>
      {things.map(thing => <div key={thing.id} className={`va-thing is-${thing.zone}`} style={{ left: `calc(50% + var(--ft) * ${thing.x})`, top: `calc(100% - var(--ft) * ${thing.y})` }}>
        <i className="va-shade" style={{ width: `calc(var(--ft) * ${(thing.w * 1.15).toFixed(2)})` }} />
        <div className="va-stand" style={{ width: `calc(var(--ft) * ${thing.w})`, height: `calc(var(--ft) * ${thing.h})`, marginLeft: `calc(var(--ft) * ${-thing.w / 2})` }}>{shapes[thing.id]}<div className="va-tag"><b>{thing.name}</b><span>{beat === 0 ? thing.sure : thing.feet}</span></div></div>
      </div>)}
    </div></div>
    <div className="stage-bottom"><p>{line}<small>All of it runs on a Raspberry Pi 5. No phone, no cloud. Simulated scene.</small></p><Beats state={state} labels={["See", "Measure", "Speak"]} /></div>
  </div>;
}

/* 05 ApexTracker. Left as it was: a real screenshot and a plain promise. */
function Apex() {
  return <div className="stage stage-apex" data-scene>
    <div className="stage-caption"><span>06 / APEXTRACKER</span><span>THE APP I ACTUALLY USE.</span></div>
    <div className="apex-statement" aria-hidden="true">A little<br />better.<br /><span>Every day.</span></div>
    <div className="apex-phone"><div className="apex-phone-camera" /><Image src="/projects/apextracker-dashboard.png" alt="ApexTracker’s actual Android interface, with daily goals and an eight-week consistency grid" width={1080} height={2340} sizes="(max-width: 650px) 200px, 310px" /></div>
    <div className="apex-orbit"><span>OFFLINE</span><span>BY DEFAULT</span><i /></div>
    <div className="stage-bottom"><p>One app. Less mental overhead.<small>Solo-built. Local-first. A daily driver.</small></p><span className="privacy-tag">NO ACCOUNT REQUIRED</span></div>
  </div>;
}

export default function ProjectStage({ id }: { id: ProjectId }) {
  switch (id) {
    case "accordion": return <Accordion />;
    case "rung": return <Rung />;
    case "gazeboard": return <Gaze />;
    case "alta": return <AltaStage number="04" />;
    case "visionassist": return <Vision />;
    case "apextracker": return <Apex />;
  }
}
