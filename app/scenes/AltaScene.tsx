"use client";

import { Bubble, Ink, Pf, useStory, type SceneProps } from "./kit";

/* Alta: the lab assistant at the bench. The story is one of the three timed runs on the real
   board: an LED put in backwards. Alta asks for a measurement, reads 5.01 V where about 2 V was
   expected, and walks the student to the fault. The fix reads 1.92 V, which it says as
   "about 1.9 volts". The LED lighting up is the one red thing in the picture. */

const STEPS = [3400, 3600, 2800, 3600];

const SAY = [
  ["LED won't light? Put the", "yellow probe on row 15."],
  ["5 volts, and the LED is dark.", "What sits in between?"],
  ["Try turning the", "LED around."],
  ["About 1.9 volts.", "That's it!"],
];

// Breadboard holes: two blocks of 5 rows by 19 columns, either side of the centre channel.
const HOLES: [number, number][] = [];
for (let r = 0; r < 5; r++) for (let c = 0; c < 19; c++) HOLES.push([74 + c * 22, 196 + r * 21], [74 + c * 22, 326 + r * 21]);

export default function AltaScene({ step: forced = null, paused }: SceneProps) {
  const { ref, step } = useStory(STEPS, { forced, paused, rest: 3 });
  const probed = step >= 1;
  const turning = step === 2;
  const lit = step >= 3;

  return (
    <svg ref={ref} className="scene-svg" viewBox="0 0 800 500" role="img" aria-label="Alta at the lab bench. It asks the student to probe row 15, reads 5 volts where the LED is dark, suggests turning the LED around, and confirms the fix at about 1.9 volts as the LED lights.">
      {/* bench */}
      <Ink k="bench" d="M 14 456 C 180 452 420 459 786 454" />

      {/* breadboard */}
      <Ink k="board" className="sc-fill" d="M 54 132 C 190 128 350 129 486 131 C 496 132 500 136 500 146 C 502 250 501 350 500 428 C 500 438 496 442 486 442 C 350 445 190 444 54 442 C 44 442 40 438 40 428 C 38 350 39 250 40 146 C 40 136 44 132 54 132 Z" />
      <Ink k="railp" d="M 62 152 C 200 150 350 151 480 152" className="sc-thin" />
      <Ink k="railn" d="M 62 168 C 200 166 350 167 480 168" className="sc-thin" />
      <Ink k="chan" d="M 54 300 C 200 298 350 299 488 300" className="sc-thin" />
      <text className="hand sc-note" x="58" y="118">+5 V</text>
      <g className="sc-holes">
        {HOLES.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
        ))}
      </g>

      {/* jumper from the rail, the resistor, the LED, and the wire home to ground */}
      <Ink k="pw" d="M 96 152 C 90 172 104 190 98 216" />
      <Ink k="res" className="sc-fill" d="M 98 216 C 112 215 124 217 136 216 M 136 204 C 160 202 190 203 214 204 C 219 204 221 207 221 212 C 222 216 222 220 221 224 C 221 228 219 230 214 230 C 190 232 160 231 136 230 C 131 230 129 228 129 224 C 128 220 128 216 129 212 C 129 207 131 204 136 204 Z M 221 216 C 250 215 290 217 318 216" />
      <Ink k="bands" d="M 150 205 L 150 229 M 164 205 L 164 229 M 178 205 L 178 229 M 200 205 L 200 229" className="sc-band" />
      <text className="hand sc-note" x="176" y="262" textAnchor="middle">220 Ω</text>
      <g className={lit ? "sc-led lit" : "sc-led"}>
        <Ink k="led" className="sc-led-body" d="M 332 222 C 328 190 338 166 358 166 C 378 166 388 190 384 222 C 368 224 348 224 332 222 Z" />
        <Ink k="ledlegs" d={turning || lit ? "M 344 223 C 344 240 343 262 344 280 M 372 223 C 372 236 373 248 372 258" : "M 344 223 C 344 236 343 248 344 258 M 372 223 C 372 240 373 262 372 280"} />
      </g>
      {turning && <Ink k="turn" className="sc-red" d="M 316 150 C 330 128 384 126 400 150 M 400 150 L 402 136 M 400 150 L 387 146" />}
      {lit && <Ink k="rays" className="sc-red" d="M 358 150 L 358 130 M 330 160 L 316 144 M 386 160 L 400 144 M 318 188 L 298 184 M 398 188 L 418 184" />}
      <Ink k="gnd" d="M 372 262 C 380 274 420 276 440 262 C 462 246 468 200 466 168" />

      {/* the probe pod and its yellow probe */}
      <Ink k="pod" className="sc-fill" d="M 96 444 C 94 462 95 478 97 490 C 150 493 240 493 300 490 C 302 478 303 462 300 444" />
      <text className="hand sc-note" x="198" y="478" textAnchor="middle">probe pod</text>
      <Ink
        k={probed ? "probeB" : "probeA"}
        className="sc-probe"
        d={probed ? "M 244 444 C 250 400 312 390 316 350 C 320 310 318 262 318 222" : "M 244 444 C 250 416 276 404 280 384 C 282 372 280 364 280 356"}
      />
      {probed && (
        <g>
          <Ink k="tag" className="sc-fill" d="M 252 278 C 284 276 320 277 352 278 C 359 279 361 282 361 289 C 362 298 362 308 361 316 C 361 322 359 324 352 325 C 320 327 284 326 252 325 C 245 324 243 322 243 316 C 242 308 242 298 243 289 C 243 282 245 279 252 278 Z" />
          <text className="sc-num" x="302" y="310" textAnchor="middle">{lit ? "1.92 V" : "5.01 V"}</text>
        </g>
      )}

      {/* Pathfinder is Alta */}
      <Pf pose={step === 3 ? "wave-b" : step === 1 ? "peer-down" : "point-stand"} x={646} y={454} size={236} />
      <Bubble k={`say${step}`} cx={632} y={34} lines={SAY[step]} tx={640} ty={212} />
    </svg>
  );
}
