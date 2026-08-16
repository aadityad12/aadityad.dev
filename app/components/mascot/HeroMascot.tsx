"use client";

import { useEffect, useRef } from "react";
import { BASE_FRAME } from "./frames";
import { MascotSvg } from "./MascotSvg";
import { FramePlayer } from "./player";

/* The one performer. Draws itself in, waves hello, then lives: watches the
   cursor, blinks irregularly, glances around, peers down at the proof rows,
   powers down when ignored, startles awake, squashes when booped. */

const ENTRANCE_MS = 2600; // after the stroke draw-in completes

export default function HeroMascot() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = wrapRef.current?.querySelector("svg");
    if (!svg) return;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prm.matches) return; // static drawn pose; player never constructed

    const player = new FramePlayer(svg);
    const ac = new AbortController();
    const { signal } = ac;

    player.start(ENTRANCE_MS);

    window.addEventListener(
      "pointermove",
      (e) => {
        player.setPupilTarget((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        player.notifyInput();
      },
      { passive: true, signal },
    );
    window.addEventListener("scroll", () => player.notifyInput(), { passive: true, signal });
    svg.addEventListener("pointerdown", () => player.boop(), { signal });
    prm.addEventListener(
      "change",
      () => {
        if (prm.matches) {
          player.destroy();
          ac.abort();
        }
      },
      { signal },
    );

    return () => {
      player.destroy();
      ac.abort();
    };
  }, []);

  return (
    <div className="hero-critter" ref={wrapRef}>
      <MascotSvg frame={BASE_FRAME} withDraw label="A small hand-drawn machine critter standing on the line below, watching you" />
    </div>
  );
}
