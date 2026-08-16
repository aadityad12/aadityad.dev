"use client";

import { useEffect, useRef, useState } from "react";

/* The flagship demo as a muted loop. `autoplay` is deliberately absent from
   the markup: JS adds playback only when reduced-motion is off (there is no
   declarative way to make autoplay respect it). Without JS: poster + native
   controls. A visible pause toggle satisfies WCAG 2.2.2. */

export default function AccordionVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const enhanceTimer = window.setTimeout(() => setEnhanced(true), 0);
    video.controls = false;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (prm.matches) {
        video.pause();
        setPlaying(false);
      } else {
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    sync();
    prm.addEventListener("change", sync);
    return () => {
      prm.removeEventListener("change", sync);
      window.clearTimeout(enhanceTimer);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="video-frame">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        controls
        preload="metadata"
        poster="/projects/accordion-poster.jpg"
        width={1280}
        height={720}
        aria-label="Accordion folding a long coding-agent session: the context map compresses cold blocks while the working tail stays live"
      >
        <source src="/projects/accordion-demo.webm" type="video/webm" />
        <source src="/projects/accordion-demo.mp4" type="video/mp4" />
      </video>
      {enhanced && (
        <button type="button" className="video-toggle mono" onClick={toggle} aria-label={playing ? "Pause demo video" : "Play demo video"}>
          {playing ? "❚❚" : "▶"}
        </button>
      )}
    </figure>
  );
}
