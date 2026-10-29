import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="shell missing">
        <p className="kicker">404</p>
        <h1>That page isn’t here.</h1>
        <p className="intro">The work is on the home page.</p>
        <Link className="btn btn-primary" href="/">Back to the work</Link>
      </main>
    </>
  );
}
