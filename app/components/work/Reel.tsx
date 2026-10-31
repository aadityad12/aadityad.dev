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
const TRIGGER_LINE = "-40% 0px -60% 0px";

export default function Reel({ beats, figure: F, title, caption }: ReelProps) {
  const [active, setActive] = useState<number | null>(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>(".beat");
    if (!items?.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: TRIGGER_LINE, threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const play = () => {
    setActive(null);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("figure")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section className="reel" aria-labelledby="reel-h" data-active-beat={active ?? "free"}>
      <h2 id="reel-h" className="visually-hidden">{title} highlights</h2>
      <div className="reel-figure">
        <figure className="fig" role="group" aria-label={caption}>
          <div className="fig-frame">
            <div className="fig-bar">
              <span>Highlights</span>
              <span>{title}</span>
            </div>
            <div className="fig-body">
              <F beat={active} />
            </div>
          </div>
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
      </ol>
      <p className="reel-free">
        <button type="button" onClick={play}>Play with the figure ↓</button>
      </p>
    </section>
  );
}
