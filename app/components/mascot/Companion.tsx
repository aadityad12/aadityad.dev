"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/* The desktop companion: one fixed-position critter that starts over the hero
   slot, walks to a corner dock as you scroll (scrubbed FLIP), leans into
   scroll velocity, follows the cursor with its eye, runs an idle → sleep →
   startled-wake state machine, and boops on pointerdown.

   Activation is gated in JS (min-width 900px + fine pointer + no reduced
   motion). Without it — mobile, no-JS, reduced motion — this renders nothing
   visible and the static hero mascot remains, so nothing ever depends on it. */

const BASE = 120; // rendered px width of the un-scaled companion (240 viewBox)

function CP({ d, delay = 0, speed = 600, className = "" }: { d: string; delay?: number; speed?: number; className?: string }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={className || undefined}
      style={{ "--path-delay": `${delay}ms`, "--path-speed": `${speed}ms` } as CSSProperties}
    />
  );
}

export default function Companion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 900px) and (pointer: fine)");
    if (reduceMotion) return;

    const doc = document.documentElement;
    const pupil = root.querySelector<SVGCircleElement>(".c-pupil")!;
    const boopLayer = root.querySelector<HTMLElement>(".c-boop")!;

    let active = false;
    let raf = 0;
    let heroX = 0, heroTopDoc = 0, heroW = BASE;
    let px = 0, py = 0, ptx = 0, pty = 0; // pupil lerp state
    let vel = 0, lastScrollY = window.scrollY;
    let lastInput = Date.now();
    let asleep = false;
    let boops = 0;

    const anchors = () => {
      const slot = document.getElementById("mascot-slot");
      if (!slot) return;
      const r = slot.getBoundingClientRect();
      heroX = r.left;
      heroTopDoc = r.top + window.scrollY;
      heroW = r.width;
    };

    const oneShot = (el: Element, cls: string) => {
      el.classList.remove(cls);
      void (el as HTMLElement).offsetWidth;
      el.classList.add(cls);
    };

    const wake = () => {
      lastInput = Date.now();
      if (asleep) {
        asleep = false;
        root.removeAttribute("data-sleep");
        oneShot(root, "is-startled");
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      ptx = (e.clientX / window.innerWidth - 0.5) * 2;
      pty = (e.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };

    const onBoop = (e: PointerEvent) => {
      const mascot = (e.target as Element).closest?.(".mascot");
      if (!mascot) return;
      wake();
      boops += 1;
      const target = mascot.closest(".companion") ? boopLayer : mascot;
      oneShot(target, boops % 7 === 0 ? "is-booped-rare" : "is-booped");
    };

    const onScrollInput = () => wake();
    const onResize = () => anchors();

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!active) return;

      // scroll velocity → lean + walking
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      vel += (dy - vel) * 0.12;
      const lean = Math.max(-12, Math.min(12, vel * 0.3));
      root.style.setProperty("--lean", `${lean.toFixed(2)}deg`);
      const walking = Math.abs(vel) > 1.5;
      root.classList.toggle("is-walking", walking);
      if (walking) lastInput = Date.now();

      // scrubbed FLIP: hero slot → corner dock
      const start = 40;
      const end = heroTopDoc + heroW * 0.8;
      let p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
      p = p * p * (3 - 2 * p); // smoothstep
      const dockW = 96;
      const dockX = window.innerWidth - dockW - 28;
      const dockY = window.innerHeight - dockW * 1.5 - 64;
      const x = lerp(heroX, dockX, p);
      const y = lerp(heroTopDoc - window.scrollY, dockY, p);
      const s = lerp(heroW / BASE, dockW / BASE, p);
      root.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      root.classList.toggle("is-docked", p > 0.99);

      // at the very bottom the contact section never wins the observer band
      if (window.scrollY + window.innerHeight > doc.scrollHeight - 120) {
        root.setAttribute("data-state", "contact");
      }

      // pupil: lerped cursor-follow, biased by scroll direction
      if (!asleep) {
        const bias = Math.max(-0.6, Math.min(0.6, vel * 0.04));
        px += (ptx - px) * 0.08;
        py += (pty + bias - py) * 0.08;
        pupil.style.transform = `translate(${(px * 4).toFixed(2)}px, ${(py * 3).toFixed(2)}px)`;
      }
    };

    // idle → one-shots → sleep (oneko-style: probabilistic, never clockwork)
    const IDLE_MS = 15000;
    const SLEEP_MS = 45000;
    const idlePool = ["idle-tilt", "idle-foot", "idle-antenna"];
    const idleTimer = window.setInterval(() => {
      if (!active || asleep) {
        if (active && !asleep && Date.now() - lastInput > SLEEP_MS) {
          asleep = true;
          root.setAttribute("data-sleep", "");
        }
        return;
      }
      const idle = Date.now() - lastInput;
      if (idle > SLEEP_MS) {
        asleep = true;
        root.setAttribute("data-sleep", "");
      } else if (idle > IDLE_MS && Math.random() < 0.02) {
        oneShot(boopLayer, idlePool[Math.floor(Math.random() * idlePool.length)]);
      }
    }, 250);

    // section awareness → arm variants
    const sections = ["top", "machines", "about", "contact"];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        if (window.scrollY + window.innerHeight > doc.scrollHeight - 120) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) root.setAttribute("data-state", visible.target.id === "top" ? "hero" : visible.target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.2] },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    const applyActivation = () => {
      const next = desktop.matches;
      if (next === active) return;
      active = next;
      doc.classList.toggle("companion-on", active);
      if (active) {
        anchors();
        lastScrollY = window.scrollY;
        lastInput = Date.now();
      }
    };

    applyActivation();
    desktop.addEventListener("change", applyActivation);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScrollInput, { passive: true });
    document.addEventListener("pointerdown", onBoop);
    // recompute anchors after fonts/layout settle
    const settle = window.setTimeout(anchors, 600);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(idleTimer);
      clearTimeout(settle);
      sectionObserver.disconnect();
      desktop.removeEventListener("change", applyActivation);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScrollInput);
      document.removeEventListener("pointerdown", onBoop);
      doc.classList.remove("companion-on");
    };
  }, []);

  return (
    <div className="companion" ref={rootRef} aria-hidden="true">
      <div className="c-lean">
        <div className="c-bob">
          <div className="c-boop">
            <svg className="mascot draw" viewBox="0 0 240 240" focusable="false">
              {/* body */}
              <CP
                d="M 74 101 C 71 93 77 87 85 88 C 108 84 149 85 157 89 C 165 90 170 96 168 104 C 171 127 170 151 167 164 C 166 172 160 176 152 175 C 126 178 96 177 83 174 C 76 173 70 168 71 160 C 68 140 71 119 74 101 Z"
                speed={800}
              />
              <CP d="M 96 84 C 111 80 130 81 144 84" delay={350} speed={350} />
              {/* antenna */}
              <g className="m-antenna c-antenna">
                <CP d="M 120 80 C 118 71 121 62 120 55" delay={450} speed={300} />
                <CP d="M 120 55 C 111 53 111 40 121 40 C 131 41 129 54 120 55" delay={650} speed={400} />
              </g>
              {/* legs (hip-rotating groups for the walk cycle) */}
              <g className="c-leg c-leg-l">
                <CP d="M 97 177 C 96 190 97 202 95 212 M 95 212 C 90 214 85 214 80 213" delay={500} speed={450} />
              </g>
              <g className="c-leg c-leg-r">
                <CP d="M 143 177 C 144 190 143 202 145 212 M 145 212 C 150 214 155 214 160 213" delay={600} speed={450} />
              </g>
              {/* left arm: resting */}
              <CP d="M 72 130 C 64 136 60 144 61 152" delay={700} speed={350} />
              {/* right arm variants, swapped by data-state */}
              <g className="c-arm c-arm-wave">
                <CP d="M 168 121 C 180 113 188 103 192 91" delay={750} speed={400} />
                <CP d="M 192 91 C 190 84 197 79 201 84" delay={1100} speed={250} />
              </g>
              <g className="c-arm c-arm-wrench">
                <CP d="M 168 128 C 178 132 186 140 191 148" />
                <CP d="M 191 148 C 198 141 206 143 209 150 M 209 150 C 213 143 207 135 199 137" />
              </g>
              <g className="c-arm c-arm-rest">
                <CP d="M 168 132 C 176 138 180 146 179 154" />
              </g>
              {/* eye + pupil (pupil is lerp-driven, so no saccade class here) */}
              <g className="m-eye c-eyegroup">
                <CP
                  d="M 120 103 C 136 103 147 114 147 129 C 147 144 135 155 119 155 C 104 155 93 143 93 128 C 93 113 105 103 120 103"
                  delay={900}
                  speed={550}
                />
                <circle className="m-pupil c-pupil" cx={122} cy={130} r={7} style={{ "--pop-delay": "1400ms" } as CSSProperties} />
              </g>
              {/* standby LED */}
              <circle className="m-led" cx={120} cy={165} r={4} style={{ "--pop-delay": "1500ms" } as CSSProperties} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
