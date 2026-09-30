"use client";

import { useEffect, useState } from "react";

// Stats are published by the contribution tracker and fetched at runtime, so the
// static export never needs a rebuild when a PR merges. Any failure falls back to
// the link alone: this card must never be able to break the page.
const STATS_URL = "https://oss.aadityad.dev/stats.json";
const FALLBACK_URL = "https://oss.aadityad.dev";
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

type Stats = {
  merged: number;
  open: number;
  projectCount: number;
  topProjects: string[];
  url: string;
};

type State = { status: "loading" } | { status: "error" } | { status: "ready"; stats: Stats };

const isCount = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;
const isRepo = (value: unknown): value is string => typeof value === "string" && REPO_PATTERN.test(value);

function safeUrl(value: unknown): string {
  if (typeof value !== "string") return FALLBACK_URL;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === "oss.aadityad.dev" ? parsed.href : FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

function parseStats(data: unknown): Stats | null {
  if (typeof data !== "object" || data === null) return null;
  const raw = data as Record<string, unknown>;
  if (!isCount(raw.merged_prs) || !isCount(raw.open_prs) || !Array.isArray(raw.projects)) return null;

  const projects: { repo: string; merged: number }[] = [];
  for (const entry of raw.projects) {
    if (typeof entry !== "object" || entry === null) return null;
    const p = entry as Record<string, unknown>;
    if (!isRepo(p.repo) || !isCount(p.merged) || !isCount(p.open)) return null;
    projects.push({ repo: p.repo, merged: p.merged });
  }

  let topProjects = Array.isArray(raw.top_projects) ? raw.top_projects.filter(isRepo) : [];
  if (topProjects.length === 0) {
    topProjects = projects
      .filter((p) => p.merged > 0)
      .sort((a, b) => b.merged - a.merged)
      .map((p) => p.repo);
  }

  return {
    merged: raw.merged_prs,
    open: raw.open_prs,
    projectCount: projects.length,
    topProjects: topProjects.slice(0, 3),
    url: safeUrl(raw.url),
  };
}

export default function OpenSourceCard() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(STATS_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`stats ${res.status}`);
        return res.json();
      })
      .then((json: unknown) => {
        const stats = parseStats(json);
        setState(stats ? { status: "ready", stats } : { status: "error" });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  const stats = state.status === "ready" ? state.stats : null;
  const url = stats?.url ?? FALLBACK_URL;
  const isEmpty = stats !== null && stats.merged === 0 && stats.open === 0;

  return (
    <aside className="oss-card reveal" aria-label="Open source contributions" aria-busy={state.status === "loading"}>
      <p className="card-kicker" data-scramble>OPEN SOURCE</p>
      <h3>Contributions to other people&apos;s projects.</h3>

      {state.status === "loading" && (
        <div className="oss-stats" aria-hidden="true">
          <div className="oss-skel" />
          <div className="oss-skel" />
          <div className="oss-skel" />
        </div>
      )}

      {stats && isEmpty && <p className="oss-empty">First contributions in progress.</p>}

      {stats && !isEmpty && (
        <>
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
        </>
      )}

      <div className="card-links">
        <a href={url} target="_blank" rel="noreferrer">See all contributions →</a>
      </div>
    </aside>
  );
}
