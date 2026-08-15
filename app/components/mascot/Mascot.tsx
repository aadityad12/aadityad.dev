import type { CSSProperties, ReactNode } from "react";

/* Shared frame + stroke helpers for the machine-critter mascot.
   Every stroke is a separate <path pathLength={1}> so the self-draw
   animation (globals.css `.js-ready .mascot.draw path`) can choreograph
   per-path via --path-delay / --path-speed. Without JS the mascot renders
   fully drawn — paths must never depend on the animation to be visible. */

export function MascotFrame({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <svg
      className={`mascot draw ${className}`}
      viewBox="0 0 240 240"
      role="img"
      aria-label={label}
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function P({ d, delay = 0, speed = 600, accent = false }: { d: string; delay?: number; speed?: number; accent?: boolean }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={accent ? "m-accent" : undefined}
      style={{ "--path-delay": `${delay}ms`, "--path-speed": `${speed}ms` } as CSSProperties}
    />
  );
}

export function Pupil({ cx, cy, r = 7, delay = 1400, className = "" }: { cx: number; cy: number; r?: number; delay?: number; className?: string }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      className={`m-pupil ${className}`}
      style={{ "--pop-delay": `${delay}ms` } as CSSProperties}
    />
  );
}

/* Base body shared by standing poses: wobbly toaster box, slot, antenna, legs. */
export function BaseBody({ delay = 0 }: { delay?: number }) {
  return (
    <>
      {/* body */}
      <P
        d="M 74 101 C 71 93 77 87 85 88 C 108 84 149 85 157 89 C 165 90 170 96 168 104 C 171 127 170 151 167 164 C 166 172 160 176 152 175 C 126 178 96 177 83 174 C 76 173 70 168 71 160 C 68 140 71 119 74 101 Z"
        delay={delay}
        speed={800}
      />
      {/* toaster slot */}
      <P d="M 96 84 C 111 80 130 81 144 84" delay={delay + 350} speed={350} />
      {/* antenna stem + loop */}
      <P d="M 120 80 C 118 71 121 62 120 55" delay={delay + 450} speed={300} />
      <P d="M 120 55 C 111 53 111 40 121 40 C 131 41 129 54 120 55" delay={delay + 650} speed={400} />
      {/* legs + feet */}
      <P d="M 97 177 C 96 190 97 202 95 212 M 95 212 C 90 214 85 214 80 213" delay={delay + 500} speed={450} />
      <P d="M 143 177 C 144 190 143 202 145 212 M 145 212 C 150 214 155 214 160 213" delay={delay + 600} speed={450} />
    </>
  );
}

/* Open round eye (outline). Pair with <Pupil/>. */
export function OpenEye({ delay = 900 }: { delay?: number }) {
  return (
    <P
      d="M 120 103 C 136 103 147 114 147 129 C 147 144 135 155 119 155 C 104 155 93 143 93 128 C 93 113 105 103 120 103"
      delay={delay}
      speed={550}
    />
  );
}
