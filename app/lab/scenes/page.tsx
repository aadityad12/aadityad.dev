import AccordionScene from "../../scenes/AccordionScene";
import AltaScene from "../../scenes/AltaScene";
import ApexScene from "../../scenes/ApexScene";
import RungScene from "../../scenes/RungScene";
import ScoutScene from "../../scenes/ScoutScene";
import VisionScene from "../../scenes/VisionScene";
import LabOnly from "./LabOnly";

// Development only: project scenes, every step side by side, for visual review. Not linked from the site.
// /lab/scenes/?only=rung shows one scene.
export const metadata = { title: "Scenes (lab)", robots: { index: false } };

const SCENES = { visionassist: VisionScene, alta: AltaScene, accordion: AccordionScene, rung: RungScene, apextracker: ApexScene, "oss-scout": ScoutScene };

export default function ScenesLab() {
  return (
    <main className="wrap" style={{ paddingBlock: 40, display: "grid", gap: 48 }}>
      {Object.entries(SCENES).map(([id, S]) => (
        <LabOnly key={id} id={id}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>{id}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[0, 1, 2, 3].map((s) => (
              <div key={s} className="fig-body">
                <S step={s} />
              </div>
            ))}
          </div>
        </LabOnly>
      ))}
    </main>
  );
}
