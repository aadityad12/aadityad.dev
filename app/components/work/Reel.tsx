"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Beat } from "../../content";
import type { FigureProps } from "../../figures";
import { Fig } from "../parts";

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
  const [wide, setWide] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const end = useRef<HTMLLIElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Sticky storytelling only on wide screens; narrow screens get the figure once, free.
  useEffect(() => {
    const mq = matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!wide) return;
    const items = list.current?.querySelectorAll<HTMLElement>(".reel-beat, .reel-end");
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
              // A wheel step can cross the sentinel between frames: leaving the final beat releases the figure.
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
  }, [beats.length, wide]);

  const play = () => {
    setActive(null);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    end.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    stage.current?.focus({ preventScroll: true });
  };

  const beat = wide ? active : null;

  return (
    <section className="reel" aria-labelledby="reel-h" data-mode={beat === null ? "free" : "beat"}>
      <h2 id="reel-h" className="visually-hidden">{title} highlights</h2>
      <div className="reel-figure">
        <div className="reel-stage" ref={stage} tabIndex={-1}>
          <Fig caption={caption}>
            <F beat={beat} />
          </Fig>
        </div>
        {wide && (
          <p className="reel-try">
            <button type="button" className="btn quiet small" onClick={play}>Try it yourself</button>
          </p>
        )}
      </div>
      <ol className="reel-beats" ref={list}>
        {beats.map((b, i) => (
          <li key={i} className="reel-beat" data-i={i} data-on={beat === i ? "true" : undefined} aria-current={beat === i ? "step" : undefined}>
            <div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </div>
          </li>
        ))}
        <li className="reel-end" aria-hidden="true" ref={end} />
      </ol>
    </section>
  );
}
