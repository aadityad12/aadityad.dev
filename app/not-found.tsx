import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import { StaticMascot } from "./components/mascot/StaticMascot";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap nf">
        <h1>This page does not exist.</h1>
        <p>The work is on the front page.</p>
        <Link className="btn" href="/">Go to the front page</Link>
        <div className="nf-pf">
          <StaticMascot pose="peer-down" label="Pathfinder looking down, puzzled" />
        </div>
      </main>
    </>
  );
}
