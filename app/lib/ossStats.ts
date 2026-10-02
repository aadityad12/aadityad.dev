import { useEffect, useState } from "react";

// Stats are published by the contribution tracker and fetched at runtime, so the
// static export never needs a rebuild when a PR merges. The card and the nav link
// share one fetch and show nothing unless there is real activity to show: any
// failure, invalid data, or a 0/0 count resolves to null.
const STATS_URL = "https://oss.aadityad.dev/stats.json";
const FALLBACK_URL = "https://oss.aadityad.dev";
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

export type OssStats = {
  merged: number;
  open: number;
  projectCount: number;
  topProjects: string[];
  url: string;
};

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

export function parseStats(data: unknown): OssStats | null {
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

let cached: Promise<OssStats | null> | null = null;

// One shared request for the whole page. Resolves to stats worth showing, or null
// (never rejects). Only call from the browser (effects), never during render.
export function loadOssStats(): Promise<OssStats | null> {
  cached ??= fetch(STATS_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`stats ${res.status}`);
      return res.json();
    })
    .then((json: unknown) => {
      const stats = parseStats(json);
      return stats && stats.merged + stats.open > 0 ? stats : null;
    })
    .catch(() => null);
  return cached;
}

// null while loading, on failure, and when there are no PRs yet.
export function useOssStats(): OssStats | null {
  const [stats, setStats] = useState<OssStats | null>(null);
  useEffect(() => {
    let active = true;
    loadOssStats().then((result) => {
      if (active) setStats(result);
    });
    return () => {
      active = false;
    };
  }, []);
  return stats;
}
