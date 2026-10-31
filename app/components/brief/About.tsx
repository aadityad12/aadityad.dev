import { ABOUT } from "../../content";

const FACTS: [string, string][] = [
  ["Based", "Santa Clara, CA"],
  ["Studying", "B.S. Computer Engineering, minor in AI, SJSU"],
  ["Graduating", "May 2028"],
  ["Available", "Summer 2027 · Winter 2027 co-op"],
];

export default function About() {
  return (
    <section id="about" className="brief-about" aria-labelledby="about-h">
      <header className="pi-head">
        <h2 id="about-h">About</h2>
      </header>
      <div className="about-cols">
        <div className="about-text">
          {ABOUT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="about-facts">
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
