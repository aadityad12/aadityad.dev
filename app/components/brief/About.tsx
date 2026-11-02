import { BRIEF } from "../../content";

export default function About() {
  return (
    <section id="about" className="brief-about" aria-labelledby="about-h">
      <header className="pi-head">
        <h2 id="about-h">About</h2>
      </header>
      <p className="about-text">{BRIEF.about}</p>
    </section>
  );
}
