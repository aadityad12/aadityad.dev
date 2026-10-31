import Link from "next/link";
import { EXPERIENCE } from "../../content";

export default function Experience() {
  return (
    <section id="experience" className="brief-xp" aria-labelledby="experience-h">
      <header className="pi-head">
        <h2 id="experience-h">Experience</h2>
        <p>Industry research, teaching, and leadership.</p>
      </header>
      <ol className="xp">
        {EXPERIENCE.map((job) => (
          <li key={job.role}>
            <p className="xp-when">
              {job.when}
              <br />
              {job.where}
            </p>
            <div className="xp-body">
              <h3>{job.role}</h3>
              <p className="org">{job.org}</p>
              <ul>
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {job.link && (
                <p className="xp-more">
                  <Link href="/work/visionassist/">More on {job.link.label} →</Link>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
