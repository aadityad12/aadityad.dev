import { DEVPOST, EMAIL, GITHUB, LINKEDIN, RESUME } from "../../content";

export default function Contact() {
  return (
    <section id="contact" className="section wrap">
      <div className="section-head"><h2>Looking for a Summer 2027 internship</h2></div>
      <p>Software, embedded systems or AI. Email is the fastest way to reach me.</p>
      <a className="contact-email" href={`mailto:${EMAIL}`}>
        {EMAIL.split("@")[0]}
        <wbr />@{EMAIL.split("@")[1]}
      </a>
      <div className="contact-links">
        <a className="btn quiet" href={RESUME}>Résumé (PDF)</a>
        <a className="btn quiet" href={GITHUB}>GitHub</a>
        <a className="btn quiet" href={LINKEDIN}>LinkedIn</a>
        <a className="btn quiet" href={DEVPOST}>Devpost</a>
      </div>
    </section>
  );
}
