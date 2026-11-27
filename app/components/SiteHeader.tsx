import Link from "next/link";
import { RESUME } from "../content";

// One header for every page: name, the places to go, the résumé. On a phone the places drop to a second row.
export default function SiteHeader({ current }: { current?: "work" } = {}) {
  return (
    <header className="wrap site-head">
      <Link className="me" href="/">Aaditya Desai</Link>
      <nav aria-label="Main">
        <Link href="/#work" aria-current={current === "work" ? "page" : undefined}>Work</Link>
        <Link href="/#experience">Experience</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <a className="btn small" href={RESUME}>Résumé</a>
    </header>
  );
}
