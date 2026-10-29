import type { ComponentType } from "react";
import AccordionMap from "./AccordionMap";
import AltaBench from "./AltaBench";
import ApexMidnight from "./ApexMidnight";
import DispatchTiming from "./DispatchTiming";
import EchoMesh from "./EchoMesh";
import GazeBoardDemo from "./GazeBoardDemo";
import RungLadder from "./RungLadder";
import ScoutInterlock from "./ScoutInterlock";
import TemperLoop from "./TemperLoop";
import VisionScene from "./VisionScene";

export const FIGURES: Record<string, ComponentType> = {
  accordion: AccordionMap,
  rung: RungLadder,
  visionassist: VisionScene,
  gazeboard: GazeBoardDemo,
  alta: AltaBench,
  apextracker: ApexMidnight,
  echo: EchoMesh,
  "oss-scout": ScoutInterlock,
  temper: TemperLoop,
  "clear-dispatch": DispatchTiming,
};
