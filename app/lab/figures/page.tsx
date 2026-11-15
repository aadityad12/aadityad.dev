import { FIGURES } from "../../figures";
import { NOTES } from "../../content";
import { Fig } from "../../components/parts";
import LabFigure from "./LabFigure";

// Development only: every project figure in the shared frame, for visual review.
// Open /lab/figures/?only=rung to see one, and add &beat=2 to hold a beat. Not linked from the site.
export const metadata = { title: "Figures (lab)", robots: { index: false } };

export default function FiguresLab() {
  return (
    <main className="wrap" style={{ paddingBlock: 40, display: "grid", gap: 56 }}>
      {Object.keys(FIGURES).map((id) => {
        const note = NOTES.find((n) => n.id === id);
        return (
          <section key={id} data-fig={id} style={{ maxWidth: 880 }}>
            <h2 style={{ fontSize: 28, marginBottom: 14 }}>{note?.title ?? id}</h2>
            <Fig caption={note?.figure}>
              <LabFigure id={id} />
            </Fig>
          </section>
        );
      })}
    </main>
  );
}
