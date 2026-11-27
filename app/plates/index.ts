import type { ComponentType } from "react";
import AccordionPlate from "./AccordionPlate";
import AltaPlate from "./AltaPlate";
import ApexPlate from "./ApexPlate";
import RungPlate from "./RungPlate";
import ScoutPlate from "./ScoutPlate";
import VisionPlate from "./VisionPlate";

export type Project = "accordion" | "rung" | "alta" | "visionassist" | "oss-scout" | "apextracker";

export const PLATES: Record<Project, ComponentType<{ playing: boolean }>> = {
  accordion: AccordionPlate,
  rung: RungPlate,
  alta: AltaPlate,
  visionassist: VisionPlate,
  "oss-scout": ScoutPlate,
  apextracker: ApexPlate,
};
