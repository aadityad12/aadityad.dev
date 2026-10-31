import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="brief">
      <h1>Aaditya Desai</h1>
      <p>Not found.</p>
      <p>
        <Link href="/">Front page</Link> · <a href="/datasheet/">Full datasheet</a>
      </p>
    </main>
  );
}
