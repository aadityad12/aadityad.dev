"use client";

import { useSyncExternalStore } from "react";

// The five things the hero object can turn into. Shared by the sentence, the chips and the 3D object.
export const heroForms = [
  { id: "accordion", number: "01", name: "Accordion", line: "AI that remembers" },
  { id: "rung", number: "02", name: "Rung", line: "A language that becomes machine code" },
  { id: "gazeboard", number: "03", name: "GazeBoard", line: "A phone that speaks with a glance" },
  { id: "visionassist", number: "04", name: "VisionAssist", line: "A wearable that says what’s ahead" },
  { id: "apextracker", number: "05", name: "ApexTracker", line: "The app I open every day" },
] as const;

export type FormId = (typeof heroForms)[number]["id"];
export type Shown = FormId | "question" | null;

type State = {
  requested: Shown;   // what a person asked for (hover, focus or a chip)
  locked: boolean;    // a chip was pressed: stay until it is pressed again
  shown: Shown;       // what the object is showing right now
};

let state: State = { requested: null, locked: false, shown: null };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());

export const heroStore = {
  get: () => state,
  preview(form: Shown) { if (!state.locked && state.requested !== form) { state = { ...state, requested: form }; emit(); } },
  toggle(form: FormId) {
    state = state.locked && state.requested === form ? { ...state, requested: null, locked: false } : { ...state, requested: form, locked: true };
    emit();
  },
  release() { if (state.locked || state.requested) { state = { ...state, requested: null, locked: false }; emit(); } },
  show(form: Shown) { if (state.shown !== form) { state = { ...state, shown: form }; emit(); } },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
};

const serverState: State = { requested: null, locked: false, shown: null };
export function useHero() {
  return useSyncExternalStore(heroStore.subscribe, heroStore.get, () => serverState);
}
