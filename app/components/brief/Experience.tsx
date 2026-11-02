import Link from "next/link";
import { EXPERIENCE } from "../../content";

export default function Experience() {
  return (
    <section id="experience" className="brief-xp" aria-labelledby="experience-h">
      <header className="pi-head">
        <h2 id="experience-h">Experience</h2>
        <p><Link href="/datasheet/#revisions">Full record in the datasheet ↗</Link></p>
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
              <small className="org">{job.org}</small>
              <p className="xp-sum">
                {job.summary}
                {job.link && <> <Link href="/work/visionassist/">VisionAssist →</Link></>}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
