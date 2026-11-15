import Link from "next/link";
import { GITHUB, RESUME } from "../content";

export default function SiteFooter() {
  return (
    <footer className="wrap">
      <div className="site-foot">
        <p>© 2026 Aaditya Desai · Santa Clara, CA</p>
        <nav aria-label="Footer">
          <Link href="/#work">Work</Link><a href={RESUME}>Résumé</a><a href={GITHUB}>GitHub</a><a href="https://github.com/aadityad12/aadityad.dev">Source</a>
        </nav>
      </div>
    </footer>
  );
}
