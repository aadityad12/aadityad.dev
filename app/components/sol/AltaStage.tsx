"use client";

import { Beats, Waves, useBeats } from "./stageKit";

/* ---------------------------------------------------------------------
   Alta. A student's breadboard with one LED that won't light. Alta asks
   for a probe on one hole, reads the real voltage, and answers with a
   hint. When the student fixes it, the reading changes and Alta says so.
---------------------------------------------------------------------- */
const scenes = [
  { label: "LAB 1 / LIGHT AN LED", big: "Off", unit: "", of: "The LED should be on.", verdict: "Thirty students. One TA.", says: null, line: "A first circuit won’t light, and the TA is across the room." },
  { label: "PROBE 1 READS", big: "5.0", unit: "V", of: "where the resistor meets the LED", verdict: "It should be about 1.9 V.", says: "Touch the red probe to where the resistor meets the LED.", line: "Alta asks for one measurement and reads the real voltage." },
  { label: "PROBE 1 READS", big: "5.0", unit: "V", of: "where the resistor meets the LED", verdict: "All five volts are stuck at the LED.", says: "Nothing is getting through the LED. Which way round is it?", line: "Then it gives a hint, not the answer." },
  { label: "PROBE 1 READS", big: "1.9", unit: "V", of: "where the resistor meets the LED", verdict: "Fixed, and confirmed by the reading.", says: "About 1.9 volts. That’s it.", line: "The student flips the LED. Alta sees the reading change." },
];
const altaBeats = [4.5, 5.5, 5.5, 6];

export default function AltaStage({ number }: { number: string }) {
  const [host, state] = useBeats(altaBeats);
  const { beat } = state;
  const scene = scenes[beat];
  return <div ref={host} className={`stage stage-alta beat-${beat}`} data-scene>
    <div className="stage-caption"><span>{number} / ALTA</span><span>MEASURE FIRST. THEN TEACH.</span></div>
    <div className="alta-hud" aria-live="polite">
      <span className="stage-label">{scene.label}</span>
      <b key={scene.big}>{scene.big}{scene.unit && <small>{scene.unit}</small>}</b>
      <span className="alta-of">{scene.of}</span>
      <span className="alta-verdict">{scene.verdict}</span>
    </div>
    <div className={`said alta-said ${scene.says ? "is-on" : ""}`} aria-live="polite"><Waves /><b>{scene.says ? `“${scene.says}”` : "…"}</b><span>ALTA, OUT LOUD</span></div>
    <div className="alta-scene" aria-hidden="true"><div className="alta-table">
      <div className="alta-shadow" />
      <div className="alta-board">
        <div className="alta-rail is-plus"><span>+ 5 V</span></div>
        <div className="alta-strip is-a" />
        <div className="alta-strip is-b" />
        <div className="alta-rail is-minus"><span>GND</span></div>
        <i className="alta-wire is-power" />
        <i className="alta-wire is-ground" />
        <div className="alta-resistor"><i /><i /><i /></div>
        <i className="alta-spot" />
        <div className="alta-post alta-led"><svg viewBox="0 0 40 74"><path className="alta-legs" d="M14 36v36M26 36v28" /><path className="alta-dome" d="M8 31V19a12 12 0 0 1 24 0v12h3v5H5v-5Z" /></svg></div>
        <div className="alta-post alta-probe"><svg viewBox="0 0 20 92"><path className="alta-needle" d="M10 44v46" /><rect className="alta-grip" x="4" y="1" width="12" height="46" rx="6" /></svg><div className="alta-tag"><b>probe 1</b><span>{beat === 3 ? "1.9 V" : "5.0 V"}</span></div></div>
      </div>
    </div></div>
    <div className="stage-bottom"><p>{scene.line}<small>A voice lab assistant for intro electronics. I built the probe pod and its bare-metal firmware. Illustrative readings.</small></p><Beats state={state} labels={["Stuck", "Measure", "Hint", "Fixed"]} /></div>
  </div>;
}
