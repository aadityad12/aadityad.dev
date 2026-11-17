"use client";

import { useSyncExternalStore } from "react";

// Review-only switches for the open design questions on this branch.
// Each choice is mirrored onto <html data-*> so CSS can react, and kept in
// the URL (?name=dock&mark=star&hero=shift) so a combination can be shared.
export const options = {
  name: {
    label: "Name",
    choices: [
      { id: "dock", label: "Docks into nav", note: "Big in the hero, then it slides up and becomes the nav mark as you scroll." },
      { id: "nav", label: "Grows in nav", note: "The nav itself starts with the full name, large, and tightens on scroll." },
      { id: "static", label: "Big, static", note: "Same big line, but it scrolls away. The nav mark never changes." },
      { id: "original", label: "As it was", note: "Small mono line, for comparison." },
    ],
  },
  mark: {
    label: "Mark",
    choices: [
      { id: "star", label: "✳ Asterisk", note: "The current mark." },
      { id: "wonder", label: "? → !", note: "A question mark at the top of the page. It becomes an exclamation mark once you reach the work." },
      { id: "knot", label: "Knot", note: "A line drawing of the hero object." },
      { id: "dot", label: "Just the dot", note: "No symbol. The orange full stop carries it." },
    ],
  },
  hero: {
    label: "Hero object",
    choices: [
      { id: "shift", label: "Shape-shifter", note: "The plates rebuild themselves into each project. The three phrases and the numbered chips drive it." },
      { id: "knot", label: "Labelled knot", note: "The knot stays a knot. Each stretch of it is a project: hover to name it, pull it apart to see all five." },
      { id: "wonder", label: "Starts as a ?", note: "It rests as a question mark. Press the button and it builds." },
    ],
  },
} as const;

export type VariantKey = keyof typeof options;
type State = Record<VariantKey, string>;

const defaults: State = { name: "dock", mark: "star", hero: "shift" };
let state: State = defaults;
let loaded = false;
const listeners = new Set<() => void>();

function valid(key: VariantKey, value: string | null): value is string {
  return !!value && options[key].choices.some(choice => choice.id === value);
}

function apply() {
  const root = document.documentElement;
  (Object.keys(state) as VariantKey[]).forEach(key => root.setAttribute(`data-${key}`, state[key]));
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const params = new URLSearchParams(location.search);
  const next = { ...defaults };
  (Object.keys(defaults) as VariantKey[]).forEach(key => {
    const fromUrl = params.get(key);
    let stored: string | null = null;
    try { stored = localStorage.getItem(`sol-variant-${key}`); } catch { /* private mode */ }
    if (valid(key, fromUrl)) next[key] = fromUrl;
    else if (valid(key, stored)) next[key] = stored;
  });
  state = next;
  apply();
}

export function setVariant(key: VariantKey, value: string) {
  if (!valid(key, value) || state[key] === value) return;
  state = { ...state, [key]: value };
  try { localStorage.setItem(`sol-variant-${key}`, value); } catch { /* private mode */ }
  const params = new URLSearchParams(location.search);
  params.set(key, value);
  history.replaceState(null, "", `${location.pathname}?${params}${location.hash}`);
  apply();
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // The first client render used the defaults; tell it about stored choices.
  queueMicrotask(listener);
  return () => { listeners.delete(listener); };
}

export function useVariant(key: VariantKey) {
  return useSyncExternalStore(subscribe, () => state[key], () => defaults[key]);
}
