import { ABOUT } from "../../content";
import { StaticMascot } from "../mascot/StaticMascot";

export default function About() {
  return (
    <section id="about" className="section wrap">
      <div className="section-head"><h2>About</h2></div>
      <div className="about-grid">
        <div className="about-copy">{ABOUT.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <figure className="about-drawing">
          <div className="about-mascot"><StaticMascot pose="perch" hoverFrame="wave-b" label="Pathfinder, the small hand-drawn robot that lives on this site" /></div>
          <svg className="about-line" viewBox="0 0 340 12" aria-hidden="true"><path d="M3 7 C65 3 117 10 173 6 S280 4 337 7" /></svg>
          <figcaption className="hand">This is Pathfinder. He finds the way.</figcaption>
        </figure>
      </div>
    </section>
  );
}
