"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProjectId } from "../../lib/portfolio";
import { gazeGroups, matches } from "../../lib/gazeWords";

type Css = React.CSSProperties;
const say = (text: string) => {
  if (typeof speechSynthesis === "undefined") return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

function Lab({ title, hint, className = "", children }: { title: string; hint: string; className?: string; children: React.ReactNode }) {
  return <div className={`lab ${className}`}>
    <div className="lab-top"><span><i />HANDS ON / {title}</span><span>{hint}</span></div>
    {children}
  </div>;
}

/* ---------------------------------------------------------------------
   Accordion: a whole session as a map of blocks. Fold them yourself, let
   Accordion do it, or see what a lossy summary would have cost.
---------------------------------------------------------------------- */
type Kind = "you" | "thinking" | "call" | "result" | "reply";
type Block = { id: number; kind: Kind; tokens: number; label: string; relevance: number };
const kindName: Record<Kind, string> = { you: "Your message", thinking: "Thinking", call: "Tool call", result: "Tool output", reply: "Agent reply" };
const BUDGET = 100_000, TAIL = 20_000;

function makeSession(): Block[] {
  let seed = 2028;
  const random = () => { seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const files = ["parser.ts", "lexer.ts", "routes/api.ts", "db/schema.sql", "auth.ts", "README.md", "tests/parse.test.ts", "config.json"];
  const asks = ["Fix the failing parse test", "Add pagination to /items", "Why is login slow?", "Refactor the date helpers", "Write a migration for tags", "Run the suite again"];
  const blocks: Block[] = [];
  const add = (kind: Kind, tokens: number, label: string) => blocks.push({ id: blocks.length, kind, tokens: Math.round(tokens), label, relevance: 0 });
  for (let turn = 0; turn < 12; turn++) {
    add("you", 200 + random() * 900, asks[turn % asks.length]);
    add("thinking", 400 + random() * 2200, "Plans the next step");
    for (let call = 0, calls = 1 + Math.floor(random() * 3); call < calls; call++) {
      const file = files[Math.floor(random() * files.length)], pick = random();
      add("call", 80 + random() * 260, pick < .6 ? `read ${file}` : pick < .85 ? `search ${file}` : "run the tests");
      add("result", random() < .25 ? 6000 + random() * 6000 : 600 + random() * 3600, pick < .6 ? `${file}, ${Math.round(80 + random() * 300)} lines` : pick < .85 ? `${Math.round(2 + random() * 20)} matches` : `${Math.round(40 + random() * 80)} passed, ${Math.round(random() * 4)} failed`);
    }
    add("reply", 250 + random() * 1400, "Explains the change");
  }
  // Recent blocks and the person's own words matter most; big, old tool output matters least.
  blocks.forEach((block, i) => { block.relevance = Math.min(.99, .08 + i / blocks.length * .55 + (block.kind === "you" ? .35 : block.kind === "reply" ? .15 : block.kind === "call" ? .1 : block.kind === "thinking" ? .05 : 0) + random() * .18); });
  return blocks;
}
const size = (tokens: number) => tokens <= 500 ? 1 : tokens <= 1500 ? 2 : tokens <= 4000 ? 3 : 4;
const thousands = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

function AccordionLab() {
  const blocks = useMemo(() => makeSession(), []);
  const tailStart = useMemo(() => { let sum = 0; for (let i = blocks.length - 1; i >= 0; i--) { sum += blocks[i].tokens; if (sum >= TAIL) return i; } return 0; }, [blocks]);
  const [folded, setFolded] = useState<number[]>([]);
  const [compacted, setCompacted] = useState(false);
  const [running, setRunning] = useState(false);
  const [hover, setHover] = useState<Block | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const history = blocks.slice(0, tailStart), tail = blocks.slice(tailStart);
  const tailTokens = tail.reduce((sum, block) => sum + block.tokens, 0);
  const seen = compacted ? tailTokens + 1800 : blocks.reduce((sum, block) => sum + (folded.includes(block.id) ? 100 : block.tokens), 0);
  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; setFolded([]); setCompacted(false); setRunning(false); };
  const conduct = () => {
    reset();
    setRunning(true);
    let now = blocks.reduce((sum, block) => sum + block.tokens, 0);
    const plan: number[] = [];
    for (const block of [...history].sort((a, b) => a.relevance - b.relevance)) { if (now <= BUDGET * .8) break; plan.push(block.id); now -= block.tokens - 100; }
    plan.forEach((id, i) => timers.current.push(setTimeout(() => setFolded(current => [...current, id]), 250 + i * 60)));
    timers.current.push(setTimeout(() => setRunning(false), 300 + plan.length * 60));
  };
  const toggle = (block: Block) => { if (!running && !compacted && block.id < tailStart) setFolded(current => current.includes(block.id) ? current.filter(id => id !== block.id) : [...current, block.id]); };
  const cell = (block: Block) => {
    const isFolded = !compacted && folded.includes(block.id);
    return <button key={block.id} className={`map-block kind-${block.kind} size-${size(block.tokens)} ${isFolded ? "is-folded" : ""}`} aria-pressed={isFolded} aria-label={`${kindName[block.kind]}, ${thousands(block.tokens)} tokens${isFolded ? ", folded" : ""}`} onClick={() => toggle(block)} onPointerEnter={() => setHover(block)} onFocus={() => setHover(block)} />;
  };
  return <Lab title="THE CONTEXT MAP" hint="ILLUSTRATIVE SESSION" className="lab-accordion">
    <div className="map-meter"><div><span>What the agent is holding</span><b className={seen > BUDGET ? "is-over" : ""}>{seen.toLocaleString("en-US")} <small>of a {BUDGET.toLocaleString("en-US")} token budget</small></b></div><div className="map-bar"><i className={seen > BUDGET ? "is-over" : ""} style={{ width: `${Math.min(100, seen / (BUDGET * 1.4) * 100).toFixed(2)}%` }} /><em style={{ left: "71.43%" }} /></div></div>
    <div className="map-grid" role="group" aria-label="Older blocks. Select one to fold or unfold it.">{compacted ? <div className="map-summary"><b>One summary paragraph</b><span>{history.length} blocks flattened into it. None can be opened again.</span></div> : history.map(cell)}</div>
    <div className="map-tail-label">THE NEWEST {thousands(tailTokens)} TOKENS / ALWAYS KEPT IN FULL</div>
    <div className="map-grid is-tail">{tail.map(cell)}</div>
    <p className="map-inspect" aria-live="polite">{hover ? <><i className={`kind-${hover.kind}`} /><b>{kindName[hover.kind]}</b> {hover.label} <span>{!compacted && folded.includes(hover.id) ? "folded to a one-line stub, full text on disk" : `${thousands(hover.tokens)} tokens`}</span></> : "Each square is one block of the session, sized by how much room it takes. Select an older one to fold it."}</p>
    <div className="lab-actions"><button className="lab-button is-primary" onClick={conduct} disabled={running}>Let Accordion fold</button><button className="lab-button" aria-pressed={compacted} onClick={() => { reset(); setCompacted(true); }}>Summarise instead</button><button className="lab-button" onClick={reset}>Reset</button><span className="lab-readout">Can be opened again: <b>{compacted ? 0 : history.length}</b> of {history.length} older blocks</span></div>
    <div className="map-legend">{(Object.keys(kindName) as Kind[]).map(kind => <span key={kind}><i className={`kind-${kind}`} />{kindName[kind]}</span>)}</div>
  </Lab>;
}

/* ---------------------------------------------------------------------
   Rung: all nine rungs, with the one that got slower left in.
---------------------------------------------------------------------- */
const ladder = [
  { name: "Tree walker", speed: 1, text: "Runs the program’s syntax tree directly. Everything above is measured against this." },
  { name: "Stack VM", speed: 3.8, text: "Compiles the program to bytecode once, then runs that on a small stack machine." },
  { name: "+ computed-goto dispatch", speed: 4.53, text: "Each instruction jumps straight to the next one’s handler, instead of returning to one big switch." },
  { name: "+ NaN-boxed values", speed: 4.06, text: "Every value shrinks from 16 bytes to 8 and memory use halves. It still ran slower on all six benchmarks. The row stays in, because a measured ladder keeps every rung." },
  { name: "Register VM", speed: 5.71, text: "Values are named directly instead of being pushed and popped. The sieve benchmark needs a third of the instructions." },
  { name: "+ superinstructions", speed: 5.76, text: "Pairs of instructions that often run together are fused into one." },
  { name: "+ inline caching", speed: 8.41, text: "A lookup of a global remembers where it found the answer last time." },
  { name: "+ constant folding", speed: 8.55, text: "Anything that can be worked out before the program runs is worked out then, and dead code is dropped." },
  { name: "+ ARM64 JIT", speed: 38.84, text: "Hot functions become real machine code through an encoder written by hand and checked byte for byte against LLVM. If a value breaks an assumption, the VM takes over mid-function." },
];
function RungLab() {
  const [selected, setSelected] = useState(8);
  const rung = ladder[selected], gain = selected ? rung.speed / ladder[selected - 1].speed : 1;
  return <Lab title="THE WHOLE LADDER" hint="fib / APPLE M1 PRO" className="lab-rung">
    <div className="ladder">
      <div className="ladder-rows" role="group" aria-label="Choose a rung">{ladder.map((item, i) => ({ item, i })).reverse().map(({ item, i }) => <button key={item.name} aria-pressed={i === selected} className={`${i && item.speed < ladder[i - 1].speed ? "is-slower" : ""} ${i === 8 ? "is-native" : ""}`} onClick={() => setSelected(i)} onPointerEnter={event => { if (event.pointerType === "mouse") setSelected(i); }}>
        <span>0{i + 1}</span><b>{item.name}</b><i><em style={{ width: `${Math.max(1.5, Math.log(item.speed) / Math.log(40) * 100).toFixed(2)}%` }} /></i><span>{item.speed.toFixed(2)}×</span>
      </button>)}</div>
      <div className="ladder-detail" aria-live="polite"><span>RUNG 0{selected + 1} OF 09</span><h4>{rung.name.replace("+ ", "")}</h4><p>{rung.text}</p><dl><div><dt>vs. the tree walker</dt><dd>{rung.speed.toFixed(2)}×</dd></div><div><dt>vs. the rung below</dt><dd className={gain < 1 ? "is-slower" : ""}>{selected ? `${gain.toFixed(2)}×` : "start"}</dd></div></dl></div>
    </div>
    <p className="lab-note">Each rung is the one below it plus a single change. The bars use a log scale, so the last step doesn’t flatten the rest.</p>
  </Lab>;
}

/* ---------------------------------------------------------------------
   GazeBoard: your pointer stands in for your eyes. Rest on a tile for a
   second. The words and the narrowing rule are the app's own.
---------------------------------------------------------------------- */
type GazeMode = { screen: "phrases" } | { screen: "spell"; glances: number[] } | { screen: "choose"; glances: number[]; words: string[] };
function GazeLab() {
  const [mode, setMode] = useState<GazeMode>({ screen: "phrases" });
  const [sentence, setSentence] = useState<string[]>([]);
  const [resting, setResting] = useState<number | null>(null);
  const [note, setNote] = useState("Rest your pointer on a tile for one second, or tap it.");
  const [sound, setSound] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const speak = (word: string) => { setSentence(current => [...current, word].slice(-6)); if (sound) say(word); };
  const tiles = mode.screen === "phrases" ? ["Yes", "No", "Help", "More"] : mode.screen === "spell" ? gazeGroups : [...mode.words, "", "", ""].slice(0, 3).concat("Back");
  const left = mode.screen === "spell" && mode.glances.length ? matches(mode.glances) : [];
  function choose(i: number) {
    if (timer.current) clearTimeout(timer.current);
    setResting(null);
    if (mode.screen === "phrases") {
      if (i === 3) { setMode({ screen: "spell", glances: [] }); setNote("Spelling. Glance at the group that holds each letter of your word."); }
      else { speak(tiles[i]); setNote(`It said “${tiles[i]}”.`); }
    } else if (mode.screen === "spell") {
      const glances = [...mode.glances, i], found = matches(glances), offered = found.slice(0, 5);
      if (!found.length) setNote("No word starts that way. Try another group.");
      else if (offered.length === 1) { speak(offered[0]); setMode({ screen: "spell", glances: [] }); setNote(`Only one word fits, so it said “${offered[0]}”.`); }
      else if (offered.length <= 3) { setMode({ screen: "choose", glances, words: offered }); setNote(`${offered.length} words fit. Look at the one you mean.`); }
      else { setMode({ screen: "spell", glances }); setNote(`${found.length} words still fit. Keep going.`); }
    } else if (i === 3) { setMode({ screen: "spell", glances: mode.glances }); setNote("Back to spelling."); }
    else if (mode.words[i]) { speak(mode.words[i]); setMode({ screen: "spell", glances: [] }); setNote(`It said “${mode.words[i]}”. Spell another, or start over.`); }
  }
  const rest = (i: number, pointerType: string) => { if (pointerType !== "mouse" || !tiles[i]) return; if (timer.current) clearTimeout(timer.current); setResting(i); timer.current = setTimeout(() => choose(i), 1000); };
  const leave = () => { if (timer.current) clearTimeout(timer.current); setResting(null); };
  return <Lab title="YOUR POINTER IS YOUR GAZE" hint="THE APP’S OWN 378 WORDS" className="lab-gaze">
    <div className="gaze-lab">
      <div className="gaze-board">{tiles.map((tile, i) => <button key={`${mode.screen}-${i}`} disabled={!tile} className={`${resting === i ? "is-resting" : ""} ${mode.screen === "spell" ? "is-letters" : ""}`} onPointerEnter={event => rest(i, event.pointerType)} onPointerLeave={leave} onClick={() => choose(i)}><b>{tile}</b>{mode.screen === "phrases" && i === 3 && <span>SPELL A WORD</span>}{mode.screen === "choose" && i === 3 && <span>KEEP SPELLING</span>}<i /></button>)}</div>
      <div className="gaze-side">
        <span className="lab-label">SAID SO FAR</span>
        <p className="gaze-sentence" aria-live="polite">{sentence.length ? sentence.join(" ") : <em>Nothing yet.</em>}</p>
        <span className="lab-label">{mode.screen === "phrases" ? "QUICK PHRASES" : `GLANCES: ${mode.glances.length ? mode.glances.map(group => `${gazeGroups[group][0]}–${gazeGroups[group].slice(-1)}`).join("  ") : "NONE YET"}`}</span>
        <p className="gaze-note">{note}</p>
        {left.length > 0 && <p className="gaze-left">{left.slice(0, 8).join(", ")}{left.length > 8 ? ` and ${left.length - 8} more` : ""}</p>}
        <div className="lab-actions"><button className="lab-button" aria-pressed={sound} onClick={() => setSound(!sound)}>{sound ? "Sound on" : "Sound off"}</button><button className="lab-button" onClick={() => { setMode({ screen: "phrases" }); setSentence([]); setNote("Rest your pointer on a tile for one second, or tap it."); }}>Start over</button></div>
      </div>
    </div>
    <p className="lab-note">On the phone, the front camera does this with your eyes, using Qualcomm’s EyeGaze model on the chip’s neural processor. Nothing leaves the device.</p>
  </Lab>;
}

/* ---------------------------------------------------------------------
   VisionAssist: move things around a room, seen from above. The rules
   that decide what is spoken are the project's rules.
---------------------------------------------------------------------- */
type Thing = { id: string; name: string; tier: 0 | 1 | 2; x: number; y: number };
const room: Thing[] = [
  { id: "chair", name: "Chair", tier: 0, x: -1.2, y: 4.5 },
  { id: "person", name: "Person", tier: 1, x: 2.2, y: 8 },
  { id: "dog", name: "Dog", tier: 1, x: -2.8, y: 11.5 },
  { id: "cup", name: "Cup", tier: 2, x: 1, y: 3.6 },
];
const tierName = ["Fixed furniture", "Moves around", "Low risk"];
const FT = 26, HALF = Math.tan(22 * Math.PI / 180);
function VisionLab() {
  const [things, setThings] = useState(room);
  const [active, setActive] = useState("chair");
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);
  const read = things.map(thing => { const feet = Math.hypot(thing.x, thing.y), seen = thing.y > .5 && Math.abs(thing.x) < thing.y * HALF + .4; return { ...thing, feet, seen, zone: feet < 6 ? "warn" : feet <= 9 ? "care" : "safe", speaks: seen && feet <= 9 && thing.tier < 2 }; });
  const subject = read.filter(thing => thing.speaks).sort((a, b) => a.tier - b.tier || a.feet - b.feet)[0];
  const steps = subject ? Math.max(1, Math.round(subject.feet / 2.5)) : 0;
  const message = subject ? `${subject.feet < 6 ? "Stop. " : ""}${subject.name}, ${steps} step${steps > 1 ? "s" : ""} ahead.` : "";
  const move = (id: string, x: number, y: number) => setThings(current => current.map(thing => thing.id === id ? { ...thing, x: Math.round(Math.min(5.6, Math.max(-5.6, x)) * 4) / 4, y: Math.round(Math.min(13.5, Math.max(1, y)) * 4) / 4 } : thing));
  const drag = (event: React.PointerEvent) => {
    const matrix = svg.current?.getScreenCTM();
    if (!dragging.current || !matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    move(dragging.current, (point.x - 6 * FT) / FT, (14 * FT - point.y) / FT);
  };
  const key = (event: React.KeyboardEvent, thing: Thing) => {
    const by: Record<string, [number, number]> = { ArrowLeft: [-.5, 0], ArrowRight: [.5, 0], ArrowUp: [0, .5], ArrowDown: [0, -.5] };
    if (!by[event.key]) return;
    event.preventDefault();
    move(thing.id, thing.x + by[event.key][0], thing.y + by[event.key][1]);
  };
  const X = (x: number) => (6 + x) * FT, Y = (y: number) => (14 - y) * FT;
  const chosen = read.find(thing => thing.id === active) ?? read[0];
  return <Lab title="MOVE THINGS AROUND THE ROOM" hint="SEEN FROM ABOVE" className="lab-vision">
    <div className="room">
      <svg ref={svg} viewBox={`0 0 ${12 * FT} ${15.3 * FT}`} role="group" aria-label="A room seen from above. Drag an object, or focus it and use the arrow keys." onPointerMove={drag} onPointerUp={() => { dragging.current = null; }} onPointerLeave={() => { dragging.current = null; }}>
        <defs><clipPath id="room-clip"><rect width={12 * FT} height={14 * FT} /></clipPath></defs>
        <g clipPath="url(#room-clip)">
          <circle cx={X(0)} cy={Y(0)} r={9 * FT} className="room-care" /><circle cx={X(0)} cy={Y(0)} r={6 * FT} className="room-warn" />
          <path d={`M${X(0)} ${Y(0)}L${X(-14 * HALF).toFixed(1)} ${Y(14)}H${X(14 * HALF).toFixed(1)}Z`} className="room-cone" />
          {[3, 6, 9, 12].map(feet => <text key={feet} x={X(0) + 6} y={Y(feet) - 5} className="room-feet">{feet} ft</text>)}
        </g>
        <circle cx={X(0)} cy={Y(0)} r="9" className="room-you" /><text x={X(0)} y={Y(0) + 13} textAnchor="middle" className="room-feet" dominantBaseline="hanging">the wearer</text>
        {read.map(thing => <g key={thing.id} tabIndex={0} role="button" aria-label={`${thing.name}, ${thing.feet.toFixed(1)} feet away. Drag or use the arrow keys.`} className={`room-thing ${subject?.id === thing.id ? "is-spoken" : ""} ${thing.seen ? "" : "is-unseen"} ${active === thing.id ? "is-active" : ""}`} transform={`translate(${X(thing.x).toFixed(1)} ${Y(thing.y).toFixed(1)})`} onPointerDown={event => { (event.currentTarget as Element).setPointerCapture(event.pointerId); dragging.current = thing.id; setActive(thing.id); }} onFocus={() => setActive(thing.id)} onKeyDown={event => key(event, thing)}>
          <circle r="17" /><text textAnchor="middle" dominantBaseline="central">{thing.name.slice(0, 2)}</text><text y="-25" textAnchor="middle" className="room-tag">{thing.name.toLowerCase()} {thing.feet.toFixed(1)} ft</text>
        </g>)}
      </svg>
      <div className="room-side">
        <span className="lab-label">WHAT THE WEARER HEARS</span>
        <p className={`room-said ${message ? "" : "is-quiet"}`} aria-live="polite">{message ? `“${message}”` : "Nothing. All clear."}</p>
        <button className="lab-button" disabled={!message} onClick={() => say(message)}>Hear it</button>
        <dl className="room-facts"><div><dt>{chosen.name}</dt><dd>{chosen.feet.toFixed(1)} ft / {tierName[chosen.tier].toLowerCase()}</dd></div><div><dt>Verdict</dt><dd>{!chosen.seen ? "Outside the camera’s view" : chosen.tier === 2 ? "Low risk, so it stays quiet" : chosen.feet > 9 ? "Past 9 ft, so it stays quiet" : subject?.id === chosen.id ? "The one worth saying" : "Seen, but something matters more"}</dd></div></dl>
        <ul className="room-rules"><li>Under 6 ft, it starts with “Stop”.</li><li>Past 9 ft, it says nothing.</li><li>Furniture outranks things that move. Then the nearest wins.</li><li>One sentence at a time, in steps.</li></ul>
      </div>
    </div>
  </Lab>;
}

/* ---------------------------------------------------------------------
   ApexTracker: the trackers feed the goals, and the goals shade the day.
---------------------------------------------------------------------- */
const past = [.5, .75, 1, .25, .75, .5, .75, 1, .75, .5, 1, .75, .25, .5, .75, 1, 1, .5, .75, .75, 1, .5, .25, .75, 1, .75, .75, .5, 1, 1, .75, .5, .75, 1, .75, 1, .5, .75, 1, .75, 1, 1, .5, .75, 1, .75, 1, .75, .75, 1, 1, .75, .5, 1, .75];
function ApexLab() {
  const [screen, setScreen] = useState(5.5);
  const [study, setStudy] = useState(1.5);
  const [paper, setPaper] = useState(true);
  const [workout, setWorkout] = useState(false);
  const goals = [
    { name: "Screen time under 6h", met: screen < 6, from: `read from screen time: ${screen.toFixed(1)}h` },
    { name: "Study 2h", met: study >= 2, from: `read from the study timer: ${study.toFixed(1)}h` },
    { name: "Read 1+ papers", met: paper, from: "read from the reading queue" },
    { name: "Workout", met: workout, from: "ticked by hand" },
  ];
  const met = goals.filter(goal => goal.met).length;
  return <Lab title="ONE DAY IN THE APP" hint="SAMPLE DATA" className="lab-apex">
    <div className="apex-lab">
      <div className="apex-inputs">
        <span className="lab-label">THE TRACKERS</span>
        <label>Screen time today <b>{screen.toFixed(1)}h</b><input type="range" min="0" max="10" step=".5" value={screen} onChange={event => setScreen(+event.target.value)} /></label>
        <label>Study timer <b>{study.toFixed(1)}h</b><input type="range" min="0" max="4" step=".5" value={study} onChange={event => setStudy(+event.target.value)} /></label>
        <label className="apex-check"><input type="checkbox" checked={paper} onChange={event => setPaper(event.target.checked)} />Finished a paper from the queue</label>
        <label className="apex-check"><input type="checkbox" checked={workout} onChange={event => setWorkout(event.target.checked)} />Workout done</label>
      </div>
      <div className="apex-goals"><span className="lab-label">GOALS, CHECKED FOR YOU</span>{goals.map(goal => <div key={goal.name} className={goal.met ? "is-met" : ""}><i>{goal.met ? "✓" : ""}</i><p>{goal.name}<small>{goal.met ? "Met" : "Open"}, {goal.from}</small></p></div>)}</div>
      <div className="apex-day"><span className="lab-label">ONE SCORE A DAY</span><b aria-live="polite">{met} / 4</b><small>goals met today</small><div className="apex-heat" aria-hidden="true">{past.map((value, i) => <i key={i} style={{ "--v": value } as Css} />)}<i className="is-today" style={{ "--v": met / 4 } as Css} /></div><small>Each square is a day, shaded by the share of goals met. The outlined one is today.</small></div>
    </div>
    <p className="lab-note">All of it lives on the phone, in an encrypted database that works with no connection. Five home-screen widgets show the same numbers without opening the app.</p>
  </Lab>;
}

export default function ProjectLab({ id }: { id: ProjectId }) {
  switch (id) {
    case "accordion": return <AccordionLab />;
    case "rung": return <RungLab />;
    case "gazeboard": return <GazeLab />;
    case "visionassist": return <VisionLab />;
    case "apextracker": return <ApexLab />;
  }
}
