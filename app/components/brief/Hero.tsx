import { EMAIL, GITHUB, HERO, LINKEDIN, RESUME } from "../../content";
import ChipIndex from "./ChipIndex";

const EM = "from the metal up";

function Lead({ text }: { text: string }) {
  const i = text.indexOf(EM);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <em>{EM}</em>
      {text.slice(i + EM.length)}
    </>
  );
}

export default function Hero() {
  return (
    <section className="brief-hero" aria-labelledby="brief-name">
      <div className="brief-copy">
        <p className="avail">
          <i aria-hidden="true" /> {HERO.avail}
        </p>
        <p className="brief-eyebrow">{HERO.eyebrow}</p>
        <h1 id="brief-name">Aaditya Desai</h1>
        <p className="brief-lead">
          <Lead text={HERO.lead} />
        </p>
        <p className="brief-intro">{HERO.intro}</p>
        <div className="actions">
          <a className="button primary" href={RESUME}>Résumé PDF ↓</a>
          <a className="button" href={`mailto:${EMAIL}`}>Email</a>
          <a className="button" href={GITHUB}>GitHub ↗</a>
          <a className="button" href={LINKEDIN}>LinkedIn ↗</a>
        </div>
      </div>
      <div className="brief-chip">
        <ChipIndex />
        <p className="brief-cap">
          <span className="brief-cap-hover">
            Fig. 0 · 28 pins, one per skill. Hover to see where I used it; click to filter the projects.{" "}
            <a href="/datasheet/#specs">Pin table ↗</a>
          </span>
          <span className="brief-cap-touch">
            Tap a pin to filter the projects. <a href="/datasheet/#specs">Pin table ↗</a>
          </span>
        </p>
      </div>
    </section>
  );
}
