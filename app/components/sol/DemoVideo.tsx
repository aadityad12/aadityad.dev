"use client";

import { useEffect, useRef, useState } from "react";

type Source = { src: string; type: string };

/* A short project recording as a muted loop. `autoplay` is deliberately
   absent from the markup: JS adds playback only when reduced-motion is off
   (there is no declarative way to make autoplay respect it). Without JS:
   poster or first frame plus native controls. A visible pause toggle
   satisfies WCAG 2.2.2. */
export default function DemoVideo({ sources, poster, label, width, height }: { sources: Source[]; poster?: string; label: string; width: number; height: number }) {
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
      if (prm.matches) { video.pause(); setPlaying(false); }
      else video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };
    sync();
    prm.addEventListener("change", sync);
    return () => { prm.removeEventListener("change", sync); window.clearTimeout(enhanceTimer); };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => {});
    else { video.pause(); setPlaying(false); }
  };

  return <div className="video-shell">
    <video ref={videoRef} loop muted playsInline controls preload="metadata" poster={poster} width={width} height={height} aria-label={label}>
      {sources.map(source => <source key={source.src} src={source.src} type={source.type} />)}
    </video>
    {enhanced && <button type="button" className="video-toggle" onClick={toggle} aria-label={playing ? "Pause the recording" : "Play the recording"}>{playing ? "❚❚" : "▶"}</button>}
  </div>;
}
