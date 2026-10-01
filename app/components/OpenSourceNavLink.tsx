"use client";

import { useOssStats } from "../lib/ossStats";

// Only shown once there is something to point at: no link while loading, on any
// error, or while the owner has zero PRs.
export default function OpenSourceNavLink() {
  const hasActivity = useOssStats() !== null;
  if (!hasActivity) return null;
  return (
    <a className="nav-oss" href="https://oss.aadityad.dev" target="_blank" rel="noreferrer">Open Source</a>
  );
}
