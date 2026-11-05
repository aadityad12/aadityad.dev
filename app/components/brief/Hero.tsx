import { BRIEF, EMAIL, GITHUB, LINKEDIN, RESUME } from "../../content";
import Chip from "../Chip";
import HeroChip from "./HeroChip";

export default function Hero() {
  return (
    <section className="brief-hero" aria-labelledby="brief-name">
      <div className="brief-copy">
        <p className="avail">
          <i aria-hidden="true" /> {BRIEF.avail}
        </p>
        <p className="brief-eyebrow">{BRIEF.eyebrow}</p>
        <h1 id="brief-name">Aaditya Desai</h1>
        <p className="brief-lead">{BRIEF.lead}</p>
        <div className="actions">
          <a className="button primary" href={RESUME}>Résumé PDF ↓</a>
          <a className="button accent" href="#work">See the work ↓</a>
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
          <a className="cta" href="/skills/">{BRIEF.chip.action} →</a>
        </p>
      </div>
      <a className="brief-chipcard" href="/skills/">
        <Chip compact />
        <span className="brief-chipcard-t">
          <b>{BRIEF.chip.line}</b>
          <span>{BRIEF.chip.action} →</span>
        </span>
      </a>
    </section>
  );
}
