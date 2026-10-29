import Link from "next/link";
import Navigation from "./components/sol/Navigation";
import { Arrow } from "./components/sol/Icons";

export default function NotFound() {
  return <><Navigation /><main id="main" className="not-found wrap"><span className="eyebrow">404 / A DIFFERENT KIND OF CONSTRAINT</span><h1>No signal<br /><em>here.</em></h1><p>That page isn’t part of the build. The projects are still right where I left them.</p><Link href="/#work" className="button blue">Back to the work <Arrow /></Link></main></>;
}
