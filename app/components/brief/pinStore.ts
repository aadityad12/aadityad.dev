import { useSyncExternalStore } from "react";

// `active` is the pin being hovered or focused, falling back to `selected`.
// `selected` is the sticky filter set by a click, Enter or Space.
type S = { active: string | null; selected: string | null };

const SERVER: S = { active: null, selected: null };
let state: S = { active: null, selected: null };
const subs = new Set<() => void>();

export const pinStore = {
  get: () => state,
  set: (patch: Partial<S>) => {
    state = { ...state, ...patch };
    subs.forEach((f) => f());
  },
  subscribe: (f: () => void) => {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export const usePins = () => useSyncExternalStore(pinStore.subscribe, pinStore.get, () => SERVER);
