"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { SceneProps } from "../../scenes/kit";

// The project's hand-drawn story, starring Pathfinder: what it does, with no jargon.
const SCENES: Record<string, ComponentType<SceneProps>> = {
  visionassist: dynamic(() => import("../../scenes/VisionScene")),
  accordion: dynamic(() => import("../../scenes/AccordionScene")),
  rung: dynamic(() => import("../../scenes/RungScene")),
  alta: dynamic(() => import("../../scenes/AltaScene")),
  apextracker: dynamic(() => import("../../scenes/ApexScene")),
  "oss-scout": dynamic(() => import("../../scenes/ScoutScene")),
};


export default function ProjectScene({ id }: { id: string }) {
  const Scene = SCENES[id];
  if (!Scene) return null;
  return (
    <div className="pj-scene">
      <Scene paused={false} />
    </div>
  );
}
