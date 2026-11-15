import Link from "next/link";
import { RESUME } from "../content";

// One header for every page: name, three places to go, the résumé.
export default function SiteHeader() {
  return (
    <header className="wrap site-head">
      <Link className="me" href="/">Aaditya Desai</Link>
      <nav aria-label="Main">
        <Link href="/#work">Work</Link>
        <Link className="opt" href="/#experience">Experience</Link>
        <Link className="opt" href="/#about">About</Link>
        <a className="btn small" href={RESUME}>Résumé</a>
      </nav>
    </header>
  );
}
