"use client";

import { useEffect, useRef } from "react";
import { boilPath, hashString, mulberry32 } from "../mascot/boil";
import { BASE_FRAME } from "../mascot/frames";
import { MascotSvg } from "../mascot/MascotSvg";
import { FramePlayer } from "../mascot/player";
import { ROLE_CHOICES, setRole, useRole, type RoleChoice } from "../role";

/* Pathfinder at a signpost. Each sign is a real link to the Work section, so it works with no
   script. With scripts, a sign also sorts the work for that kind of role, Pathfinder points at
   the sign you are on, and when you pick one he walks off down the trail ahead of you.

   The signpost is drawn in Pathfinder's hand: every line is redrawn three times with a small
   deterministic jitter and the three drawings cycle, so the ink shimmers the way his does. */

const ENTRANCE_MS = 2600;
const BOILS = [0, 1, 2] as const;

/** Three redraws of one path. Redraw 0 is the path as authored. Same output on server and client. */
function boil(d: string, key: string, amp = 1.1): string[] {
  return BOILS.map((v) => (v === 0 ? d : boilPath(d, mulberry32(hashString(key) * 31 + v * 7919 + 1), amp)));
}

// Ground, grass, a pebble, the post and its grain, and the little arrow under the question.
const ART = [
  "M 6 472 C 70 468 130 475 210 471 C 300 467 400 474 514 470",
  "M 122 471 C 121 463 119 458 115 453 M 127 471 C 127 461 128 455 130 450 M 132 471 C 133 465 135 461 138 458",
  "M 168 471 C 169 464 171 460 175 456 M 173 471 C 175 465 178 462 182 460",
  "M 226 480 C 230 476 238 476 241 480 C 238 484 229 484 226 480 Z",
  "M 147 338 C 148 356 146 376 148 396 M 154 420 C 153 432 155 444 154 456",
  "M 372 84 C 368 98 358 108 345 113 M 345 113 L 356 113 M 345 113 L 350 103",
].map((d, i) => boil(d, `art${i}`));

const POST = boil("M 141 470 C 139 380 143 250 141 96 C 142 89 145 83 150 75 C 155 83 159 89 160 96 C 158 250 161 380 160 470", "post");

// The three boards. Each is a plank with one pointed end and one notched end, nailed to the post.
const SIGNS: { id: RoleChoice; board: string[]; x: number; y: number; tilt: number; nails: [number, number]; push: number }[] = [
  {
    id: "software",
    board: boil("M 108 104 C 170 100 240 99 298 96 C 310 105 322 115 332 124 C 322 134 311 144 300 152 C 240 154 170 155 110 156 C 114 147 118 138 122 130 C 118 121 113 112 108 104 Z", "b1"),
    x: 218, y: 127, tilt: -2.2, nails: [111, 147], push: 6,
  },
  {
    id: "embedded",
    board: boil("M 26 206 C 36 196 47 187 58 178 C 120 175 190 174 250 172 C 246 181 241 190 237 199 C 242 208 247 217 252 226 C 190 229 120 230 60 232 C 48 224 37 215 26 206 Z", "b2"),
    x: 146, y: 203, tilt: -1.6, nails: [184, 221], push: -6,
  },
  {
    id: "ai",
    board: boil("M 112 260 C 170 257 230 256 286 254 C 297 263 308 272 318 281 C 308 290 298 299 288 308 C 230 310 170 311 114 312 C 118 303 122 295 125 286 C 121 277 116 268 112 260 Z", "b3"),
    x: 216, y: 283, tilt: -1.8, nails: [268, 302], push: 6,
  },
];

export default function HeroScene() {
  const role = useRole();
  const wrap = useRef<HTMLDivElement>(null);
  const player = useRef<FramePlayer | null>(null);
  const walking = useRef(false);

  useEffect(() => {
    const svg = wrap.current?.querySelector<SVGSVGElement>("svg.mascot");
    if (!svg) return;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prm.matches) return;

    const p = new FramePlayer(svg);
    player.current = p;
    const ac = new AbortController();
    const { signal } = ac;
    p.start(ENTRANCE_MS);

    window.addEventListener(
      "pointermove",
      (e) => {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        p.setPupilTarget((e.clientX - cx) / (window.innerWidth / 2), (e.clientY - cy) / (window.innerHeight / 2));
        p.notifyInput();
      },
      { passive: true, signal },
    );
    window.addEventListener("scroll", () => p.notifyInput(), { passive: true, signal });
    svg.addEventListener("pointerdown", () => p.boop(), { signal });

    return () => {
      p.destroy();
      ac.abort();
      player.current = null;
    };
  }, []);

  const point = (on: boolean) => {
    if (!walking.current) player.current?.pose(on ? "point-stand" : null);
  };

  const choose = (e: React.MouseEvent, id: RoleChoice) => {
    e.preventDefault();
    setRole(id);
    const work = document.getElementById("work");
    const pf = wrap.current?.querySelector<HTMLElement>(".scene-pf");
    const p = player.current;
    const go = () => work?.scrollIntoView({ block: "start" });
    if (!p || !pf || walking.current) return go();

    // Walk off to the left along the trail, then let the page follow.
    walking.current = true;
    p.walk(true);
    const anim = pf.animate(
      [
        { transform: "translate(0, 0)" },
        { transform: "translate(-60%, 5%)", offset: 0.7 },
        { transform: "translate(-80%, 13%)", opacity: 1, offset: 0.92 },
        { transform: "translate(-88%, 17%)", opacity: 0 },
      ],
      { duration: 1100, easing: "linear", fill: "forwards" },
    );
    window.setTimeout(go, 260);
    anim.onfinish = () => {
      // He comes back once the visitor has moved on, so the hero is whole when they return.
      window.setTimeout(() => {
        anim.cancel();
        p.walk(false);
        walking.current = false;
      }, 1400);
    };
  };

  return (
    <div className="scene" ref={wrap}>
      <svg className="scene-art" viewBox="0 0 520 548" role="group" aria-label="A signpost with three signs. Pick the kind of role you are hiring for.">
        {BOILS.map((v) => (
          <g key={v} className={`boil-g boil-g${v}`} aria-hidden="true">
            {ART.map((d, i) => (
              <path key={i} className="ink" d={d[v]} />
            ))}
            <path className="ink post" d={POST[v]} />
          </g>
        ))}
        <g className="scene-ask" aria-hidden="true" transform="rotate(-4 410 60)">
          <text className="hand" x="408" y="52">What are you</text>
          <text className="hand" x="412" y="78">hiring for?</text>
        </g>
        <path className="trail" d="M 330 494 C 280 514 190 510 110 540" aria-hidden="true" />
        {SIGNS.map((s) => {
          const r = ROLE_CHOICES.find((c) => c.id === s.id)!;
          return (
            <a
              key={s.id}
              className="sign"
              style={{ "--push": `${s.push}px` } as React.CSSProperties}
              href={`/?for=${s.id}#work`}
              aria-label={`Show the work for ${r.phrase}`}
              aria-current={role === s.id ? "true" : undefined}
              onClick={(e) => choose(e, s.id)}
              onPointerEnter={() => point(true)}
              onPointerLeave={() => point(false)}
              onFocus={() => point(true)}
              onBlur={() => point(false)}
            >
              <g className="sign-plank">
                {BOILS.map((v) => (
                  <path key={v} className={`board boil-g boil-g${v}`} d={s.board[v]} />
                ))}
                <circle className="nail" cx="150" cy={s.nails[0]} r="2.6" />
                <circle className="nail" cx="150" cy={s.nails[1]} r="2.6" />
                <text className="hand" x={s.x} y={s.y + 9} textAnchor="middle" transform={`rotate(${s.tilt} ${s.x} ${s.y})`}>
                  {r.label}
                </text>
              </g>
            </a>
          );
        })}
      </svg>
      <div className="scene-pf">
        <MascotSvg frame={BASE_FRAME} withDraw label="Pathfinder, a small hand-drawn robot, standing by the signpost" />
      </div>
    </div>
  );
}
