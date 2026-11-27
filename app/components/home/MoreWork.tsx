"use client";

import Link from "next/link";
import { useSortedByRole } from "./WorkStage";

export type Row = { key: string; title: string; text: string; tag: string; href?: string; external: boolean; roles: string[] };

/** Everything else, one line each, sorted by the same role as the stage above it. */
export default function MoreWork({ rows }: { rows: Row[] }) {
  const { sorted } = useSortedByRole(rows);
  return (
    <>
      <h3 className="wk-more-h" id="more-work">More work</h3>
      <ul className="wk-rows">
        {sorted.map((r) => {
          const inner = (
            <>
              <b>{r.title}</b>
              <span>{r.text}</span>
              <span className="wk-row-k">{r.tag}</span>
              {r.href && <span className="wk-row-go" aria-hidden="true">{r.external ? "↗" : "→"}</span>}
            </>
          );
          return (
            <li key={r.key}>
              {!r.href ? (
                <div className="wk-row">{inner}</div>
              ) : r.external ? (
                <a className="wk-row" href={r.href}>{inner}</a>
              ) : (
                <Link className="wk-row" href={r.href}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
