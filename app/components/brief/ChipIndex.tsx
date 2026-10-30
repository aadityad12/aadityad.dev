"use client";

import { useEffect } from "react";
import Chip from "../Chip";
import { PINS } from "../../content";
import { pinStore, usePins } from "./pinStore";

const KEY = "#skill=";

const writeHash = (name: string | null) => {
  const url = name ? KEY + encodeURIComponent(name) : location.pathname + location.search;
  history.replaceState(null, "", url);
};

export default function ChipIndex() {
  const { active, selected } = usePins();

  // A filtered view is linkable: #skill=C%2B%2B. Read once on mount.
  useEffect(() => {
    if (!location.hash.startsWith(KEY)) return;
    let name: string;
    try {
      name = decodeURIComponent(location.hash.slice(KEY.length));
    } catch {
      return;
    }
    if (PINS.some((p) => p.name === name && p.uses.length > 0)) pinStore.set({ selected: name, active: name });
  }, []);

  return (
    <Chip
      activePin={active}
      selectedPin={selected}
      onHoverPin={(name) => pinStore.set({ active: name ?? pinStore.get().selected })}
      onSelectPin={(name) => {
        pinStore.set({ selected: name, active: name });
        writeHash(name);
      }}
    />
  );
}
