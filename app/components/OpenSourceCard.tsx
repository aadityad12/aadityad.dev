"use client";

import { useOssStats } from "../lib/ossStats";

// Renders nothing while loading, on any error or invalid data, and while the
// owner has zero PRs. It sits at the end of the Projects section, so appearing
// late shifts nothing above it.
export default function OpenSourceCard() {
  const stats = useOssStats();
  if (!stats) return null;

  return (
    <aside className="oss-card" aria-label="Open source contributions">
      <p className="card-kicker">OPEN SOURCE</p>
      <h3>Contributions to other people&apos;s projects.</h3>

      <dl className="oss-stats">
        <div>
          <dt>MERGED PRS</dt>
          <dd className="oss-merged">{stats.merged}</dd>
        </div>
        {stats.projectCount > 0 && (
          <div>
            <dt>{stats.projectCount === 1 ? "PROJECT" : "PROJECTS"}</dt>
            <dd>{stats.projectCount}</dd>
          </div>
        )}
        {stats.open > 0 && (
          <div>
            <dt>IN REVIEW</dt>
            <dd>{stats.open}</dd>
          </div>
        )}
      </dl>
      {stats.topProjects.length > 0 && (
        <p className="tech-line oss-top">
          TOP PROJECTS /{" "}
          {stats.topProjects.map((repo, i) => (
            <span key={repo}>
              {i > 0 && " · "}
              <a href={`https://github.com/${repo}`} target="_blank" rel="noreferrer">{repo}</a>
            </span>
          ))}
        </p>
      )}

      <div className="card-links">
        <a href={stats.url} target="_blank" rel="noreferrer">See all contributions →</a>
      </div>
    </aside>
  );
}
