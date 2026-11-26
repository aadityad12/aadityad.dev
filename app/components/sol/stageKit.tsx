"use client";

import { useEffect, useRef, useState } from "react";

// Every project stage tells its story in a few "beats". Left alone and in
// view, a stage plays through them slowly. The moment someone picks a beat
// themselves, it stops and stays where they put it.
export function useBeats(seconds: number[]) {
  const host = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState(0);
  const [auto, setAuto] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let paused = document.documentElement.classList.contains("motion-paused");
    const update = () => setLive(inView && !paused && !media.matches);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: .75 });
    observer.observe(element);
    const motion = (event: Event) => { paused = (event as CustomEvent).detail.paused; update(); };
    addEventListener("sol-motion", motion);
    media.addEventListener("change", update);
    return () => { observer.disconnect(); removeEventListener("sol-motion", motion); media.removeEventListener("change", update); };
  }, []);

  useEffect(() => {
    if (!live || !auto) return;
    const timer = setTimeout(() => setBeat(current => (current + 1) % seconds.length), seconds[beat] * 1000);
    return () => clearTimeout(timer);
  }, [live, auto, beat, seconds]);

  const state = { beat, playing: live && auto, seconds: seconds[beat], pick: (next: number) => { setAuto(false); setBeat(next); } };
  return [host, state] as const;
}

type BeatState = ReturnType<typeof useBeats>[1];

export function Beats({ state, labels }: { state: BeatState; labels: string[] }) {
  return <div className="beats" role="group" aria-label="Steps of this explanation">
    {labels.map((label, i) => <button key={label} aria-pressed={i === state.beat} aria-label={`Step ${i + 1}: ${label}`} onClick={() => state.pick(i)}>
      {i === state.beat && state.playing && <svg className="beat-ring" viewBox="0 0 46 46" aria-hidden="true" style={{ animationDuration: `${state.seconds}s` }}><circle cx="23" cy="23" r="21.5" pathLength="1" /></svg>}
      {i + 1}
    </button>)}
  </div>;
}

// A number that counts to its new value instead of jumping.
export function Count({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 900;
    let frame = 0;
    const began = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / duration), eased = 1 - (1 - t) ** 3;
      from.current = start + (value - start) * eased;
      setShown(Math.round(from.current));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{shown}</>;
}

// Steps inside one beat: returns how many of the given moments (ms) have passed.
// Mount the caller with key={beat} so the count restarts with each beat.
export function useSteps(moments: number[]) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = moments.map((moment, i) => setTimeout(() => setStep(i + 1), moment));
    return () => timers.forEach(clearTimeout);
  }, [moments]);
  return step;
}

export function Waves() {
  return <span className="waves" aria-hidden="true"><i /><i /><i /><i /></span>;
}
