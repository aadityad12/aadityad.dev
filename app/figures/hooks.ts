"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/** True while the element is on screen. Figures use it to pause loops offscreen. */
export function useInView(ref: RefObject<Element | null>, margin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin, threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function useReducedMotion() {
  return useSyncExternalStore(subscribeRM, () => matchMedia(RM).matches, () => false);
}

/** Locale-independent thousands separator; toLocaleString can differ between server and client. */
export const commas = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Small deterministic PRNG so server and client render the same "random" data. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
