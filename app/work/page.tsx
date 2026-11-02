import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import Masthead from "../components/Masthead";
import { ALSO, NOTES, RESUME } from "../content";

const BY_ORDER = [...NOTES].sort((a, b) => a.order - b.order);
const description = "Ten things I built, one page each: an ARM64 JIT, an offline vision wearable, a context manager for AI coding agents, bare-metal probe firmware, and more.";
const image = { url: "/og/work.png", width: 1200, height: 630, alt: "Ten projects by Aaditya Desai, one page each" };

export const metadata: Metadata = {
  title: "Work",
  description,
  alternates: { canonical: "/work/" },
  openGraph: { title: "Work", description, url: "/work/", images: [image] },
  twitter: { card: "summary_large_image", title: "Work", description, images: [image.url] },
};

export default function WorkIndexPage() {
  return (
    <>
      <Masthead variant="plain" current="work" resume={RESUME} />
      <main className="brief work-index" id="main">
        <header className="pi-head">
          <h1>Work</h1>
          <p>Ten things I built, one page each.</p>
        </header>
        <ol className="wi">
          {BY_ORDER.map((note) => (
            <li key={note.id} id={note.id}>
              <a href={`/work/${note.id}/`} className="wi-row">
                <span className="wi-n">{String(note.order).padStart(2, "0")}</span>
                <b className="wi-t">{note.title}</b>
                <span className="wi-d">{note.oneLiner}</span>
                <small className="wi-w">{note.where}</small>
                <span className="wi-a" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="wi-also">
          Also: {ALSO.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && " · "}<a href={item.href} target="_blank" rel="noreferrer">{item.title} ↗</a> ({item.tag})
            </Fragment>
          ))}
        </p>
        <p className="wi-long">
          The long version of all of this is the <Link href="/datasheet/">datasheet ↗</Link>
        </p>
      </main>
    </>
  );
}
