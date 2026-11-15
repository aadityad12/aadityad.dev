"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* VisionAssist: a camera worn on the head, a voice in the ear. Pathfinder wears the rig and walks
   toward a chair. The device spots it, says how many steps away it is, and says "Stop" once it is
   inside the warning zone. Distances are announced in steps, as the real device does. */

const STEPS = [2200, 3200, 3800, 2400];
const GROUND = 436;
const SIZE = 236;
const U = SIZE / 175; // scene units per unit of Pathfinder's own drawing
const CHAIR = 620; // the chair's back leg; its box starts 39 units to the left
const STRIDE = 90;
const FRONT = 60 * U; // Pathfinder's toes, ahead of his centre
const at = (stepsAway: number) => CHAIR - 39 - stepsAway * STRIDE - FRONT;
const X = [at(4.8), at(4), at(2), at(2)];
const AWAY = [0, 4, 2, 2];
const SAY: (string[] | null)[] = [null, ["Chair, 4 steps ahead."], ["Stop. Chair,", "2 steps ahead."], ["Stop. Chair,", "2 steps ahead."]];

export default function VisionScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 2 });
  const x = X[step];
  const seen = step >= 1;
  const say = SAY[step];
  const px = (dx: number) => x + dx * U;
  const py = (dy: number) => GROUND - dy * U;

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="VisionAssist. Pathfinder walks with a camera on his head. The device spots a chair, says it is four steps ahead, then says stop when it is two steps ahead.">
      <Ink k="ground" d="M 14 438 C 200 434 480 441 786 436" />

      {/* the steps left to the chair, counted the way the device counts them */}
      {Array.from({ length: AWAY[step] }, (_, i) => (
        <text key={i} className={`hand sc-count${step >= 2 ? " hot" : ""}`} x={CHAIR - 39 - (i + 0.5) * STRIDE} y="476" textAnchor="middle">
          {i + 1}
        </text>
      ))}

      {/* the chair */}
      <g transform={`translate(${CHAIR} ${GROUND}) scale(1.5) translate(${-CHAIR} ${-GROUND})`}>
        <Ink k="chair" className="sc-fill" d={`M ${CHAIR} 306 C ${CHAIR - 2} 346 ${CHAIR + 1} 386 ${CHAIR} 436 M ${CHAIR} 378 C ${CHAIR + 30} 376 ${CHAIR + 60} 377 ${CHAIR + 84} 378 M ${CHAIR + 84} 378 C ${CHAIR + 85} 398 ${CHAIR + 83} 418 ${CHAIR + 84} 436 M ${CHAIR + 14} 380 L ${CHAIR + 13} 410 M ${CHAIR + 70} 380 L ${CHAIR + 71} 410`} />
        <Ink k="chairback" d={`M ${CHAIR - 8} 306 C ${CHAIR} 302 ${CHAIR + 10} 302 ${CHAIR + 18} 306 M ${CHAIR - 6} 326 C ${CHAIR + 2} 323 ${CHAIR + 10} 323 ${CHAIR + 16} 326 M ${CHAIR - 6} 346 C ${CHAIR + 2} 343 ${CHAIR + 10} 343 ${CHAIR + 16} 346`} />
        {seen && (
          <g>
            <Ink k="box" className="sc-red" d={`M ${CHAIR - 26} 288 C ${CHAIR + 20} 286 ${CHAIR + 70} 287 ${CHAIR + 104} 288 C ${CHAIR + 106} 336 ${CHAIR + 105} 396 ${CHAIR + 104} 444 C ${CHAIR + 60} 446 ${CHAIR + 10} 445 ${CHAIR - 26} 444 C ${CHAIR - 28} 396 ${CHAIR - 27} 336 ${CHAIR - 26} 288 Z`} />
            <text className="hand sc-tag" x={CHAIR + 39} y="278" textAnchor="middle">chair</text>
          </g>
        )}
      </g>

      {/* what the camera sees */}
      <Ink k={`cone${step}`} className="sc-dash" d={`M ${px(54)} ${py(137)} L ${px(54) + 250} ${py(137) - 96} M ${px(54)} ${py(133)} L ${px(54) + 250} ${py(133) + 118}`} />

      {/* Pathfinder, wearing the rig: a camera on top, a bud in his ear */}
      <Pf pose={step === 3 ? "startle" : step % 2 === 0 ? "walk-a" : "walk-b"} x={x} y={GROUND} size={SIZE} flip />
      <Ink k={`rig${step}`} className="sc-fill" d={`M ${px(23)} ${py(148)} C ${px(33)} ${py(150)} ${px(43)} ${py(149)} ${px(52)} ${py(148)} C ${px(54)} ${py(140)} ${px(53)} ${py(132)} ${px(52)} ${py(124)} C ${px(43)} ${py(122)} ${px(33)} ${py(123)} ${px(23)} ${py(124)} C ${px(21)} ${py(132)} ${px(22)} ${py(140)} ${px(23)} ${py(148)} Z`} />
      <circle className="sc-lens" cx={px(45)} cy={py(136)} r="5.5" />
      <Ink k={`bud${step}`} d={`M ${px(-51)} ${py(98)} C ${px(-60)} ${py(94)} ${px(-60)} ${py(82)} ${px(-51)} ${py(78)}`} />
      {say && <Ink k={`snd${step}`} className="sc-red" d={`M ${px(-66)} ${py(100)} C ${px(-74)} ${py(94)} ${px(-74)} ${py(82)} ${px(-66)} ${py(76)} M ${px(-78)} ${py(106)} C ${px(-90)} ${py(96)} ${px(-90)} ${py(80)} ${px(-78)} ${py(70)}`} />}

      {say && <Bubble k={`say${step}`} cx={Math.max(160, x - 30)} y={26} lines={say} tx={px(-70)} ty={py(118)} />}
    </svg>
  );
}
