"use client";

import { useEffect, useRef } from "react";

export function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      video.pause();
      return;
    }
    const start = () => {
      video.play().catch(() => {});
    };
    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
    return () => video.removeEventListener("canplay", start);
  }, []);

  return (
    <video
      ref={ref}
      className="demo-video"
      autoPlay
      muted
      loop
      controls
      playsInline
      poster="/projects/accordion-map.png"
      aria-label="Recorded Accordion context map, playing. Colored blocks stand for parts of an agent session."
    >
      <source src="/projects/accordion-demo.webm" type="video/webm" />
      <source src="/projects/accordion-demo.mp4" type="video/mp4" />
      <track kind="captions" srcLang="en" label="English" src="/projects/accordion-demo.vtt" default />
    </video>
  );
}
