"use client";

import { useSyncExternalStore } from "react";

// Which kind of role the visitor is hiring for. The hero signpost sets it and the Work section
// reads it to put the most relevant projects first. It lives in memory and in the URL (?for=),
// so a link with a role in it opens already sorted.

export type RoleChoice = "software" | "embedded" | "ai";
export const ROLE_CHOICES: { id: RoleChoice; label: string; phrase: string }[] = [
  { id: "software", label: "Software", phrase: "software roles" },
  { id: "embedded", label: "Embedded", phrase: "embedded and firmware roles" },
  { id: "ai", label: "AI and ML", phrase: "AI and ML roles" },
];

let current: RoleChoice | null = null;
let read = false;
const listeners = new Set<() => void>();

function fromUrl(): RoleChoice | null {
  const v = new URLSearchParams(window.location.search).get("for");
  return ROLE_CHOICES.some((r) => r.id === v) ? (v as RoleChoice) : null;
}

export function getRole(): RoleChoice | null {
  if (!read && typeof window !== "undefined") {
    read = true;
    current = fromUrl();
  }
  return current;
}

export function setRole(next: RoleChoice | null) {
  read = true;
  current = next;
  const url = new URL(window.location.href);
  if (next) url.searchParams.set("for", next);
  else url.searchParams.delete("for");
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** The chosen role, or null for everything. Null on the server and on first paint. */
export function useRole() {
  return useSyncExternalStore(subscribe, getRole, () => null);
}
