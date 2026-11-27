"use client";

import { useEffect, useRef, useState } from "react";
import { PLATES, type Project } from "./index";

// Interactive plates are labelled groups, so their buttons stay reachable; the rest read as one image.
const INTERACTIVE = new Set<Project>(["accordion", "alta", "oss-scout"]);

/** A plate that plays while it is on screen. A hidden plate (an unselected tab) never intersects, so it rests. */
export default function LivePlate({ id, alt }: { id: Project; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Plate = PLATES[id];
  const interactive = INTERACTIVE.has(id);
  return (
    <div ref={ref} className="plate-art" role={interactive ? "group" : "img"} aria-label={alt}>
      <Plate playing={playing} />
    </div>
  );
}
