"use client";

import { useState } from "react";

/* ---------------------------------------------------------------------
   Alta: you are the student. Pick what went wrong on the bench, put the
   probe where you like, and climb the hint ladder. The three faults are
   the three Alta was timed on with the real board.
---------------------------------------------------------------------- */
type PointId = "rail" | "node" | "led" | "ground";
type Fault = {
  id: string; name: string; fix: string; seconds: number; glow: number;
  volts: Record<PointId, number>;
  says: Record<PointId, string>;
  ladder: [string, string, string, string];
};
const points: { id: PointId; name: string; x: number; y: number; healthy: number }[] = [
  { id: "rail", name: "the 5 V rail", x: 96, y: 34, healthy: 5 },
  { id: "node", name: "where the resistor meets the LED", x: 300, y: 118, healthy: 1.9 },
  { id: "led", name: "the far leg of the LED", x: 372, y: 118, healthy: 0 },
  { id: "ground", name: "the ground rail", x: 468, y: 250, healthy: 0 },
];
const faults: Fault[] = [
  {
    id: "led", name: "LED in backwards", fix: "Flip the LED", seconds: 205, glow: 0,
    volts: { rail: 5, node: 5, led: 0, ground: 0 },
    says: {
      rail: "Five volts on the rail. Power is fine, so the problem is further along.",
      node: "Five volts here, and it should be about 1.9. Nothing is getting through the LED.",
      led: "Zero here, which is right. So ground is connected. Try one hole back.",
      ground: "Zero volts. Ground is where it should be.",
    },
    ladder: ["Start where the resistor meets the LED. What do you read?", "All five volts are stuck on one side of the LED. What does that tell you about the LED?", "Look at the LED’s two legs. One is longer.", "The LED is in backwards. Turn it so the long leg faces the resistor."],
  },
  {
    id: "wire", name: "Ground wire missing", fix: "Add the ground wire", seconds: 110, glow: 0,
    volts: { rail: 5, node: 5, led: 3.6, ground: 0 },
    says: {
      rail: "Five volts on the rail. Power is fine.",
      node: "Five volts here. Nothing is flowing through the resistor at all.",
      led: "This leg should sit at zero, and it doesn’t. It isn’t connected to ground.",
      ground: "The rail itself is at zero. So the rail is fine, but is anything connected to it?",
    },
    ladder: ["Follow the path from 5 V all the way round to ground.", "What should the far leg of the LED read if it reached ground?", "Look at the row under the LED’s far leg. Where does it go?", "There’s no wire from that row to the ground rail. Add one."],
  },
  {
    id: "resistor", name: "Wrong resistor", fix: "Swap in the 220 Ω", seconds: 322, glow: .18,
    volts: { rail: 5, node: 1.7, led: 0, ground: 0 },
    says: {
      rail: "Five volts on the rail. Power is fine.",
      node: "About 1.7 volts. That’s close to right, so the path is complete. The LED is just starved.",
      led: "Zero volts. Ground is connected.",
      ground: "Zero volts. Ground is where it should be.",
    },
    ladder: ["The voltages look close, yet it’s barely lit. What sets how much current flows?", "Read me the colour bands on your resistor.", "Brown, black, orange is 10,000 ohms. The lab sheet asks for red, red, brown.", "That’s a 10 kΩ resistor. Swap it for the 220 Ω one."],
  },
];
const rungs = ["Nudge", "Question", "Point at it", "The fix"];
const volts = (v: number) => `${v.toFixed(1)} V`;

export default function AltaLab() {
  const [faultId, setFaultId] = useState("led");
  const [probe, setProbe] = useState<PointId | null>(null);
  const [level, setLevel] = useState(-1);
  const [fixed, setFixed] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const fault = faults.find(item => item.id === faultId) ?? faults[0];
  const point = points.find(item => item.id === probe);
  const reading = point ? (fixed ? point.healthy : fault.volts[point.id]) : null;
  const pick = (id: string) => { setFaultId(id); setProbe(null); setLevel(-1); setFixed(false); setWrong(null); };
  const attempt = (id: string) => { if (id === fault.id) { setFixed(true); setWrong(null); } else setWrong(faults.find(item => item.id === id)?.fix ?? null); };
  const message = fixed
    ? (point ? `${point.id === "node" ? "About 1.9 volts where the resistor meets the LED." : `${volts(point.healthy)} at ${point.name}.`} That’s the fix, and the reading confirms it.` : "It’s lit. Put the probe back on and I’ll confirm it with a reading.")
    : wrong ? `You tried “${wrong}”. The readings haven’t changed, so that wasn’t it.`
    : level >= 0 ? fault.ladder[level]
    : point ? fault.says[point.id]
    : "The LED isn’t lit. Touch the probe to any marked point and tell me what you find.";
  const glow = fixed ? 1 : fault.glow;
  const reversed = fault.id === "led" && !fixed;
  return <div className="lab lab-alta">
    <div className="lab-top"><span><i />HANDS ON / YOU ARE THE STUDENT</span><span>ILLUSTRATIVE READINGS</span></div>
    <div className="lab-actions alta-faults" role="group" aria-label="What went wrong on the bench"><span className="lab-label">WHAT WENT WRONG</span>{faults.map(item => <button key={item.id} className="lab-button" aria-pressed={item.id === fault.id} onClick={() => pick(item.id)}>{item.name}</button>)}</div>
    <div className="bench">
      <svg viewBox="0 0 560 284" role="group" aria-label="A breadboard seen from above. Choose a marked point to place the probe.">
        <rect className="bench-board" x="1" y="1" width="558" height="282" rx="12" />
        <path className="bench-holes" d="M24 34H536M24 70H536M24 94H536M24 118H536M24 142H536M24 190H536M24 214H536M24 250H536" />
        <path className="bench-plus" d="M24 20H536" /><path className="bench-minus" d="M24 264H536" />
        <text className="bench-text" x="24" y="14">+ 5 V</text><text className="bench-text" x="24" y="278">GND</text>
        <path className="bench-wire is-power" d="M156 34V118" />
        <path className="bench-lead" d="M156 118H192M264 118H300" />
        <rect className="bench-resistor" x="192" y="106" width="72" height="24" rx="8" />
        {(fault.id === "resistor" && !fixed ? ["#6b4423", "#1d1d1b", "#e2852a"] : ["#c7431a", "#c7431a", "#6b4423"]).map((colour, i) => <rect key={i} x={206 + i * 13} y="106" width="6" height="24" fill={colour} />)}
        <text className="bench-text" x="228" y="98" textAnchor="middle">{fault.id === "resistor" && !fixed ? "10 kΩ" : "220 Ω"}</text>
        <g className="bench-led" style={{ "--glow": glow } as React.CSSProperties}>
          <circle className="bench-halo" cx="336" cy="118" r="34" />
          <path className="bench-lead" d="M300 118H318M354 118H372" />
          <g transform={reversed ? "rotate(180 336 118)" : undefined}><circle className="bench-dome" cx="336" cy="118" r="18" /><path className="bench-flat" d="M349 105V131" /><path className="bench-long" d="M318 112V124" /></g>
        </g>
        {(fault.id !== "wire" || fixed) && <path className="bench-wire is-ground" d="M372 118V250" />}
        {fault.id === "wire" && !fixed && <path className="bench-gap" d="M372 132V250" />}
        {points.map(item => <g key={item.id} className={`bench-point ${probe === item.id ? "is-on" : ""}`} role="button" tabIndex={0} aria-pressed={probe === item.id} aria-label={`Probe ${item.name}`} onClick={() => { setProbe(item.id); setLevel(-1); setWrong(null); }} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setProbe(item.id); setLevel(-1); setWrong(null); } }}>
          <circle cx={item.x} cy={item.y} r="20" className="bench-hit" /><circle cx={item.x} cy={item.y} r="9" className="bench-ring" /><circle cx={item.x} cy={item.y} r="3.5" className="bench-dot" />
        </g>)}
        {point && <g className="bench-probe" transform={`translate(${point.x} ${point.y})`}><path d="M0 0L26 -44" /><rect x="14" y="-74" width="76" height="24" rx="5" /><text x="52" y="-58" textAnchor="middle">{volts(reading ?? 0)}</text></g>}
      </svg>
      <div className="bench-side">
        <span className="lab-label">PROBE 1 READS</span>
        <b className={`bench-reading ${reading !== null && point && reading !== point.healthy ? "is-off" : ""}`} aria-live="polite">{reading === null ? "–" : volts(reading)}</b>
        <span className="bench-where">{point ? `${point.name}${reading !== point.healthy ? `, should be ${volts(point.healthy)}` : ", as it should be"}` : "The probe isn’t touching anything yet."}</span>
        <span className="lab-label">ALTA SAYS</span>
        <p className="bench-said" aria-live="polite">“{message}”</p>
        <ol className="bench-ladder" aria-label="Hint ladder">{rungs.map((rung, i) => <li key={rung} className={!fixed && i <= level ? "is-used" : ""}>{rung}</li>)}</ol>
      </div>
    </div>
    <div className="lab-actions">
      <button className="lab-button is-primary" disabled={fixed || level >= 3} onClick={() => { setLevel(level + 1); setWrong(null); }}>{level < 0 ? "I’m stuck" : "Still stuck"}</button>
      <span className="lab-label alta-try">TRY A FIX</span>
      {faults.map(item => <button key={item.id} className="lab-button" disabled={fixed} onClick={() => attempt(item.id)}>{item.fix}</button>)}
      <span className="lab-readout">{fixed ? <>On the real board, Alta got a student here in <b>{fault.seconds} s</b></> : <>Hints used: <b>{level + 1}</b> of 4</>}</span>
    </div>
    <p className="lab-note">The real pod reads four probes about 1,200 times a second and reports every 50 ms. Alta has to measure before it diagnoses, and it holds the fix back until the student has had a real try.</p>
  </div>;
}
