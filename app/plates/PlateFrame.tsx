import type { KeyboardEvent, ReactNode } from "react";
import styles from "./plates.module.css";

interface FrameProps {
  name: string;
  playing: boolean;
  children: ReactNode;
  mode?: string;
  /** Plates with a control inside stay in the accessibility tree; the rest are decoration under a labelled wrapper. */
  interactive?: boolean;
}

export function PlateFrame({ name, playing, mode, interactive = false, children }: FrameProps) {
  return (
    <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice"
      className={styles.plate} data-plate={name} data-playing={playing} data-mode={mode}
      aria-hidden={interactive ? undefined : true} focusable="false" strokeLinejoin="round" strokeLinecap="round">
      <g transform="scale(2)" fill="none" stroke="var(--ink)" strokeWidth="1.8">
        <rect width="800" height="500" fill="var(--paper)" stroke="none" />
        {children}
      </g>
    </svg>
  );
}

export function Hatch({ id }: { id: string }) {
  return (
    <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="var(--hair)" stroke="none" />
      <path d="M-1 1l2 -2 M0 4l4 -4 M3 5l2 -2" strokeWidth=".55" />
    </pattern>
  );
}

export function activateWithKey(event: KeyboardEvent<SVGGElement>, activate: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (!event.repeat) activate();
  }
}
