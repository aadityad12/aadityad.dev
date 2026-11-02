import { BRIEF, EMAIL, GITHUB, LINKEDIN, RESUME } from "../../content";
import Chip from "../Chip";
import HeroChip from "./HeroChip";

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
          <i aria-hidden="true" /> {BRIEF.avail}
        </p>
        <p className="brief-eyebrow">{BRIEF.eyebrow}</p>
        <h1 id="brief-name">Aaditya Desai</h1>
        <p className="brief-lead">
          <Lead text={BRIEF.lead} />
        </p>
        <div className="actions">
          <a className="button primary" href={RESUME}>Résumé PDF ↓</a>
          <a className="button" href="#work">See the work ↓</a>
          <span className="actions-links">
            <a href={`mailto:${EMAIL}`}>Email</a> ·{" "}
            <a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a> ·{" "}
            <a href={LINKEDIN} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </span>
        </div>
      </div>
      <div className="brief-chip">
        <HeroChip />
        <p className="brief-cap">
          {BRIEF.chip.line}
          <span className="brief-cap-hover">{BRIEF.chip.hover}</span>
          <a href="/skills/" data-skills>{BRIEF.chip.action} →</a>
        </p>
      </div>
      <a className="brief-chipcard" href="/skills/" data-skills>
        <Chip compact />
        <span className="brief-chipcard-t">
          <b>{BRIEF.chip.line}</b>
          <span>{BRIEF.chip.action} →</span>
        </span>
      </a>
    </section>
  );
}
