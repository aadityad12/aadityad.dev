import Link from "next/link";
import { DEVPOST, EMAIL, GITHUB, LINKEDIN, RESUME } from "../../content";

const SOURCE = "https://github.com/aadityad12/aadityad.dev";
const EXT = { target: "_blank", rel: "noreferrer" } as const;

export default function Contact() {
  return (
    <footer id="contact" className="brief-contact">
      <div className="contact-in">
        <p className="contact-kicker">Summer 2027 internships · Winter 2027 co-ops</p>
        <h2>Get in touch.</h2>
        <p className="contact-line">
          I&apos;m looking for roles in software, embedded systems, and AI/ML. Email is the fastest way to reach me.
        </p>
        <div className="contact-actions">
          <a className="button primary" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="button" href={RESUME} {...EXT}>Résumé ↗</a>
          <a className="button" href={GITHUB} {...EXT}>GitHub ↗</a>
          <a className="button" href={LINKEDIN} {...EXT}>LinkedIn ↗</a>
          <a className="button" href={DEVPOST} {...EXT}>Devpost ↗</a>
        </div>
        <div className="contact-foot">
          <span>Aaditya Desai · Santa Clara, CA</span>
          <span>
            <Link href="/datasheet/">Full datasheet</Link> ↗
          </span>
          <span>
            <a href={SOURCE} {...EXT}>Source ↗</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
