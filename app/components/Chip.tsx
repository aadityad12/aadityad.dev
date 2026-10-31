"use client";

import { useRef, useState } from "react";
import { NOTES, PINS, type Pin } from "../content";

const BODY = { x: 150, y: 150, s: 300 };
const PITCH = BODY.s / 8;
const LEAD = 26;

type Placed = { pin: Pin; side: "L" | "B" | "R" | "T"; cx: number; cy: number };

function place(): Placed[] {
  // counter-clockwise from pin 1 at the top of the left side, as on a real package
  return PINS.map((pin, i) => {
    const k = (i % 7) + 1;
    if (i < 7) return { pin, side: "L", cx: BODY.x, cy: BODY.y + PITCH * k };
    if (i < 14) return { pin, side: "B", cx: BODY.x + PITCH * k, cy: BODY.y + BODY.s };
    if (i < 21) return { pin, side: "R", cx: BODY.x + BODY.s, cy: BODY.y + BODY.s - PITCH * k };
    return { pin, side: "T", cx: BODY.x + BODY.s - PITCH * k, cy: BODY.y };
  });
}

const PLACED = place();
const noteTitle = (id: string) => NOTES.find((n) => n.id === id);

type ChipProps = {
  activePin?: string | null; // pin name currently hovered or selected
  selectedPin?: string | null; // pin name clicked (sticky filter)
  onHoverPin?: (name: string | null) => void;
  onSelectPin?: (name: string | null) => void; // same pin again clears
};

export default function Chip({ activePin, selectedPin, onHoverPin, onSelectPin }: ChipProps = {}) {
  // Index mode: the front page drives the chip from outside. The datasheet renders <Chip /> bare.
  const index = !!onSelectPin;
  const [rove, setRove] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const sheen = useRef<SVGRadialGradientElement>(null);
  const [hover, setHover] = useState<{ p: Placed; x: number; y: number } | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = wrap.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--rx", (nx * 14).toFixed(2));
      el.style.setProperty("--ry", (-ny * 14).toFixed(2));
    }
    sheen.current?.setAttribute("cx", (0.5 + nx * 1.1).toFixed(3));
    sheen.current?.setAttribute("cy", (0.5 + ny * 1.1).toFixed(3));
  };
  const onLeave = () => {
    wrap.current?.style.setProperty("--rx", "0");
    wrap.current?.style.setProperty("--ry", "0");
    setHover(null);
  };

  const showPin = (p: Placed, e: React.PointerEvent) => {
    if (index && e.pointerType === "touch") return;
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setHover({ p, x: Math.min(Math.max(e.clientX - r.left + 14, 0), r.width - 250), y: e.clientY - r.top + 16 });
    if (index) onHoverPin?.(p.pin.name);
  };

  const hidePin = () => {
    setHover(null);
    if (index) onHoverPin?.(null);
  };

  const showPinAtLead = (p: Placed) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    const k = r.width / 600;
    setHover({ p, x: Math.min(Math.max(p.cx * k + 14, 0), r.width - 250), y: p.cy * k + 16 });
  };

  const pick = (p: Placed) => {
    if (!index || p.pin.uses.length === 0) return;
    const clearing = selectedPin === p.pin.name;
    onSelectPin?.(clearing ? null : p.pin.name);
    // the pointer or focus is still on this pin, so it stays active after a clear
    if (clearing) onHoverPin?.(p.pin.name);
  };

  const onPinKey = (e: React.KeyboardEvent, i: number) => {
    if (!index) return;
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (step) {
      e.preventDefault();
      const pins = wrap.current?.querySelectorAll<SVGGElement>("g.pin");
      pins?.[(i + step + PLACED.length) % PLACED.length]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(PLACED[i]);
    } else if (e.key === "Escape") {
      onSelectPin?.(null);
    }
  };

  const lit = index ? (activePin ?? selectedPin ?? null) : null;

  return (
    <div className="chip-wrap" ref={wrap} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="chip-tilt">
        <svg
          className="chip-svg booting"
          viewBox="0 0 600 600"
          role={index ? "group" : "img"}
          aria-label="Pin diagram of a 28-pin chip package marked AD2028. Each pin is a skill; the same information is in the pin table in section 4."
        >
          {index && <title>AD2028 pin diagram: each of the 28 pins is a skill. Hover or focus a pin to see where it was used; select it to filter the projects.</title>}
          <defs>
            <linearGradient id="lead" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9d9d3" />
              <stop offset="0.55" stopColor="#a3a39c" />
              <stop offset="1" stopColor="#7c7c76" />
            </linearGradient>
            <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#262625" />
              <stop offset="1" stopColor="#0c0c0c" />
            </linearGradient>
            <radialGradient id="sheen" ref={sheen} cx="0.5" cy="0.5" r="0.75">
              <stop offset="0" stopColor="#fff" stopOpacity="0.13" />
              <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#2a2618" floodOpacity="0.32" />
            </filter>
          </defs>

          <g filter="url(#shadow)">
            <rect x={BODY.x} y={BODY.y} width={BODY.s} height={BODY.s} rx="7" fill="url(#body)" />
          </g>
          <rect x={BODY.x} y={BODY.y} width={BODY.s} height={BODY.s} rx="7" fill="url(#sheen)" />
          <rect x={BODY.x + 6} y={BODY.y + 6} width={BODY.s - 12} height={BODY.s - 12} rx="4" fill="none" stroke="#2c2c2b" strokeWidth="1" />
          <circle cx={BODY.x + 40} cy={BODY.y + 40} r="8" fill="#0a0a0a" stroke="#2f2f2e" />
          <circle cx={BODY.x + BODY.s - 40} cy={BODY.y + BODY.s - 40} r="15" fill="none" stroke="#252524" strokeWidth="1.5" />

          <g fill="#c9c9c3" style={{ fontFamily: "var(--mono)" }}>
            <text x="300" y="268" textAnchor="middle" style={{ fontFamily: "var(--sans)", fontStretch: "125%", fontWeight: 800, fontSize: 54, letterSpacing: "-1px" }} fill="#e2e2dc">AD2028</text>
            <text x="300" y="300" textAnchor="middle" fontSize="13" letterSpacing="4">{lit ?? "AADITYA DESAI"}</text>
            <line x1="200" x2="400" y1="318" y2="318" stroke="#3a3a38" />
            <text x="300" y="342" textAnchor="middle" fontSize="11.5" letterSpacing="2" fill="#8f8f89">SJSU · CMPE · CLASS OF 2028</text>
            <text x="300" y="362" textAnchor="middle" fontSize="11.5" letterSpacing="2" fill="#8f8f89">2643 · SANTA CLARA, CA</text>
            <text x="300" y="400" textAnchor="middle" fontSize="10" letterSpacing="2.5" fill="#5f5f5b">{"FROM THE METAL UP"}</text>
          </g>

          {PLACED.map((pl, i) => {
            const { pin, side, cx, cy } = pl;
            const horiz = side === "L" || side === "R";
            const w = horiz ? LEAD : 13;
            const h = horiz ? 13 : LEAD;
            const x = side === "L" ? cx - LEAD : side === "R" ? cx : cx - 6.5;
            const y = side === "T" ? cy - LEAD : side === "B" ? cy : cy - 6.5;
            const gap = LEAD + 10;
            let lbl;
            if (side === "L") lbl = <text className="lbl" x={cx - gap} y={cy + 4.5} textAnchor="end">{pin.name}</text>;
            else if (side === "R") lbl = <text className="lbl" x={cx + gap} y={cy + 4.5}>{pin.name}</text>;
            else if (side === "T") lbl = <text className="lbl" transform={`translate(${cx + 4.5} ${cy - gap}) rotate(-90)`}>{pin.name}</text>;
            else lbl = <text className="lbl" transform={`translate(${cx + 4.5} ${cy + gap}) rotate(-90)`} textAnchor="end">{pin.name}</text>;
            const nIn = side === "L" ? { x: cx + 12, y: cy + 3.5, a: "start" } : side === "R" ? { x: cx - 12, y: cy + 3.5, a: "end" } : side === "T" ? { x: cx, y: cy + 18, a: "middle" } : { x: cx, y: cy - 10, a: "middle" };
            const dead = index && pin.uses.length === 0;
            const on = index ? lit === pin.name : hover?.p.pin.n === pin.n;
            const aria = index
              ? {
                  role: "button" as const,
                  tabIndex: i === rove ? 0 : -1,
                  "aria-label": `${pin.name} ${pin.n}. ${dead ? "Used in teaching" : "Used in " + pin.uses.map((u) => noteTitle(u)?.title).join(", ")}`,
                  ...(dead ? { "aria-disabled": true } : { "aria-pressed": selectedPin === pin.name }),
                }
              : {};
            return (
              <g
                key={pin.n}
                className={`pin${on ? " on" : ""}${index && selectedPin === pin.name ? " sel" : ""}${index ? (dead ? " dead" : " pick") : ""}`}
                style={{ "--i": i } as React.CSSProperties}
                onPointerEnter={(e) => showPin(pl, e)}
                onPointerMove={(e) => showPin(pl, e)}
                onPointerLeave={() => hidePin()}
                {...aria}
                onClick={index ? () => pick(pl) : undefined}
                onKeyDown={index ? (e) => onPinKey(e, i) : undefined}
                onFocus={
                  index
                    ? (e) => {
                        setRove(i);
                        onHoverPin?.(pin.name);
                        if (e.currentTarget.matches(":focus-visible")) showPinAtLead(pl);
                      }
                    : undefined
                }
                onBlur={index ? () => hidePin() : undefined}
              >
                <rect x={x - (horiz ? 0 : 8)} y={y - (horiz ? 8 : 0)} width={w + (horiz ? 0 : 16)} height={h + (horiz ? 16 : 0)} fill="transparent" />
                <rect className="lead" x={x} y={y} width={w} height={h} fill="url(#lead)" />
                {lbl}
                <text className="num" aria-hidden="true" x={nIn.x} y={nIn.y} textAnchor={nIn.a as "start" | "end" | "middle"} style={{ fill: "#6d6d68" }}>{pin.n}</text>
              </g>
            );
          })}

        </svg>
      </div>
      {hover && (
        <div className="chip-tip" style={{ left: hover.x, top: hover.y }} role="status">
          <span className="t">Pin {hover.p.pin.n} · {hover.p.pin.name} · {hover.p.pin.type}</span>
          {hover.p.pin.desc}
          <span className="u">
            {index
              ? "Used in: " + (hover.p.pin.uses.length ? hover.p.pin.uses.map((u) => noteTitle(u)?.title).join(", ") : "teaching")
              : hover.p.pin.uses.length
                ? "Used in " + hover.p.pin.uses.map((u) => `${noteTitle(u)?.an} ${noteTitle(u)?.title}`).join(", ")
                : "Teaching and coursework"}
          </span>
        </div>
      )}
      {!index && (
        <div className="chip-legend" aria-hidden="true">
          <span>Fig. 0 · 28-pin package, top view</span>
          <span>Hover a pin</span>
        </div>
      )}
    </div>
  );
}
