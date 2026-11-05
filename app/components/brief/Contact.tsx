import Link from "next/link";
import { BRIEF, DEVPOST, EMAIL, GITHUB, LINKEDIN, OSS, RESUME } from "../../content";

const SOURCE = "https://github.com/aadityad12/aadityad.dev";
const EXT = { target: "_blank", rel: "noreferrer" } as const;

export default function Contact() {
  return (
    <footer id="contact" className="brief-contact">
      <div className="contact-in">
        <p className="contact-kicker">{BRIEF.contactKicker}</p>
        <h2>Get in touch.</h2>
        <p className="contact-line">{BRIEF.contactLine}</p>
        <div className="contact-actions">
          <a className="button primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="button" href={RESUME} {...EXT}>Résumé ↗</a>
          <a className="button" href={GITHUB} {...EXT}>GitHub ↗</a>
          <a className="button" href={LINKEDIN} {...EXT}>LinkedIn ↗</a>
        </div>
        <p className="contact-about">{BRIEF.about}</p>
        <div className="contact-foot">
          <span>Aaditya Desai · Santa Clara, CA</span>
          <span>
            <Link href="/datasheet/">Full datasheet</Link> ↗ · <a href={DEVPOST} {...EXT}>Devpost ↗</a> · <a href={OSS} {...EXT}>Open source ↗</a>
          </span>
          <span>
            <a href={SOURCE} {...EXT}>Source ↗</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
