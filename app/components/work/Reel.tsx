"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Beat } from "../../content";
import type { FigureProps } from "../../figures";

type ReelProps = {
  beats: Beat[];
  figure: ComponentType<FigureProps>;
  title: string;
  caption: string;
};

// The active beat is the one crossing a line 40% down the viewport.
const TRIGGER_LINE = 0.4;

export default function Reel({ beats, figure: F, title, caption }: ReelProps) {
  const [active, setActive] = useState<number | null>(0);
  const list = useRef<HTMLOListElement>(null);
  const end = useRef<HTMLLIElement>(null);
  const frame = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>(".beat, .reel-end");
    if (!items?.length) return;
    let io: IntersectionObserver;
    const observe = () => {
      io?.disconnect();
      // Percentage root margins use width, even on the vertical edges.
      // Pixel margins keep the reading line at 40% of the viewport height.
      const height = Math.max(1, window.innerHeight);
      const top = Math.floor(height * TRIGGER_LINE);
      const bottom = Math.max(0, height - top - 1);
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const i = (e.target as HTMLElement).dataset.i;
            if (e.isIntersecting) {
              setActive(i === undefined ? null : Number(i));
            } else if (Number(i) === beats.length - 1 && e.boundingClientRect.bottom < (e.rootBounds?.top ?? top)) {
              // A wheel step can cross the one-pixel sentinel between frames.
              // Leaving the final beat above the line also releases the figure.
              setActive(null);
            }
          }
        },
        { rootMargin: `-${top}px 0px -${bottom}px 0px`, threshold: 0 },
      );
      items.forEach((el) => io.observe(el));
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, [beats.length]);

  const play = () => {
    setActive(null);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    end.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    frame.current?.focus({ preventScroll: true });
  };

  return (
    <section className="reel" aria-labelledby="reel-h" data-active-beat={active ?? "free"}>
      <h2 id="reel-h" className="visually-hidden">{title} highlights</h2>
      <div className="reel-figure" id="figure" data-mode={active === null ? "free" : "beat"}>
        <figure className="fig" role="group" aria-label={caption} tabIndex={-1} ref={frame}>
          <div className="fig-frame">
            <div className="fig-bar">
              <span>Figure 1</span>
              <span>{title}</span>
            </div>
            <div className="fig-body" tabIndex={active === null ? 0 : undefined}>
              <F beat={active} />
            </div>
          </div>
          <figcaption className="reel-cap">Figure 1. {caption}</figcaption>
        </figure>
      </div>
      <ol className="reel-beats" ref={list}>
        {beats.map((b, i) => (
          <li key={i} className="beat" data-i={i} aria-current={active === i ? "step" : undefined}>
            <span className="beat-n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </li>
        ))}
        <li className="reel-end" aria-hidden="true" ref={end} />
      </ol>
      <p className="reel-free">
        <button type="button" onClick={play}>Play with the figure</button>
      </p>
    </section>
  );
}
