"use client";

import { useEffect } from "react";

export const LAST_KEY = "work:last";

/** Notes which case study the visitor read, so the Work section can open on it when they go back. */
export default function RememberProject({ id }: { id: string }) {
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_KEY, id);
    } catch {
      // Storage can be blocked; the Work section then simply opens on its first project.
    }
  }, [id]);
  return null;
}
