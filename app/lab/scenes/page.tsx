import AltaScene from "../../scenes/AltaScene";
import VisionScene from "../../scenes/VisionScene";

// Development only: project scenes, every step side by side, for visual review. Not linked from the site.
export const metadata = { title: "Scenes (lab)", robots: { index: false } };

const SCENES = [VisionScene, AltaScene];

export default function ScenesLab() {
  return (
    <main className="wrap" style={{ paddingBlock: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {SCENES.flatMap((S, i) =>
        [0, 1, 2, 3].map((s) => (
          <div key={`${i}-${s}`} className="fig-body">
            <S step={s} />
          </div>
        )),
      )}
    </main>
  );
}
