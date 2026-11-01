import type { Metadata } from "next";
import Link from "next/link";
import Masthead from "./components/Masthead";
import { RESUME } from "./content";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <>
      <Masthead variant="plain" resume={RESUME} />
      <main className="brief" id="main">
        <h1>Aaditya Desai</h1>
        <p>Not found.</p>
        <p>
          <Link href="/">Front page</Link> · <Link href="/work/" prefetch={false}>All work</Link> · <a href="/datasheet/">Full datasheet</a>
        </p>
      </main>
    </>
  );
}
