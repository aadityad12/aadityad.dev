import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import { Fig, Rich } from "../../components/parts";
import Reel from "../../components/work/Reel";
import { FIGURES } from "../../figures";
import { NOTES, PHOTOS } from "../../content";

export const dynamicParams = false;

const BY_ORDER = [...NOTES].sort((a, b) => a.order - b.order);

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) return {};
  const url = `/work/${note.id}/`;
  const image = { url: `/og/work/${note.id}.png`, width: 1200, height: 630, alt: `${note.title}: ${note.hook}` };
  return {
    title: note.title,
    description: note.hook,
    alternates: { canonical: url },
    openGraph: { title: `${note.title} · Aaditya Desai`, description: note.hook, url, siteName: "Aaditya Desai", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title: `${note.title} · Aaditya Desai`, description: note.hook, images: [image.url] },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) notFound();
  const photos = PHOTOS[note.id] ?? [];
  const F = FIGURES[note.id];
  const beats = note.beats ?? [];
  const hasReel = !!F && beats.length >= 3;
  const next = BY_ORDER[note.order % BY_ORDER.length];
  const prev = BY_ORDER[(note.order - 2 + BY_ORDER.length) % BY_ORDER.length];
  const award = "award" in note ? note.award : undefined;
  const facts = [note.context, note.role, note.team, note.when].filter(Boolean).join(" · ");

  return (
    <>
      <SiteHeader />
      <main id="main">
        <article className="wrap pj">
          <Link className="arrow-link pj-back" href="/#work"><span aria-hidden="true">←</span> All work</Link>
          <h1>{note.title}</h1>
          <p className="pj-lede">{note.hook}</p>
          {award && <p className="pj-award">{award}</p>}
          <p className="pj-facts">{facts}</p>
          {note.links.length > 0 && (
            <div className="pj-links">
              {note.links.map((l) => (
                <a key={l.href} className="btn quiet small" href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
              ))}
            </div>
          )}

          {F && (
            <div className="pj-lead">
              {hasReel ? (
                <Reel beats={beats} figure={F} title={note.title} caption={note.figure} />
              ) : (
                <Fig caption={note.figure}><F /></Fig>
              )}
            </div>
          )}
          {!F && photos[0] && (
            <div className="pj-lead pj-lead-photo">
              <Fig flush caption={photos[0].cap || note.figure}>
                <Image src={photos[0].src} width={photos[0].w} height={photos[0].h} alt={photos[0].alt} sizes="(max-width: 900px) 100vw, 900px" priority />
              </Fig>
            </div>
          )}

          <section className="pj-sec" aria-labelledby="pj-why">
            <h2 id="pj-why">Why</h2>
            <p className="pj-why">{note.problem}</p>
          </section>

          <div className="pj-cols">
            <section className="pj-col" aria-labelledby="pj-built">
              <h2 id="pj-built">What I built</h2>
              {note.focus && <p className="pj-focus">{note.focus}</p>}
              <ul className="pj-built">
                {note.built.map((b, i) => (
                  <li key={i}><Rich text={b} /></li>
                ))}
              </ul>
            </section>
            <div className="pj-col">
              <h2>Results</h2>
              <ul className="pj-specs">
                {note.specs.map((s) => (
                  <li key={s.param}>
                    <span className="pj-spec-v">{s.value}</span>
                    <span className="pj-spec-p">{s.param}</span>
                    {s.note && <span className="pj-spec-n">{s.note}</span>}
                  </li>
                ))}
              </ul>
              <div className="pj-stack">
                <h2>Built with</h2>
                <p>{note.stack.join(", ")}</p>
              </div>
            </div>
          </div>

          {photos.length > 0 && (
            <section className="pj-sec" aria-labelledby="pj-photos">
              <h2 id="pj-photos">From the build</h2>
              <div className="pj-photos" data-n={Math.min(photos.length, 3)}>
                {photos.map((p) => (
                  <Fig key={p.src} flush caption={p.cap}>
                    <Image className={p.w >= p.h ? "land" : undefined} src={p.src} width={p.w} height={p.h} alt={p.alt} sizes="(max-width: 900px) 100vw, 400px" />
                  </Fig>
                ))}
              </div>
            </section>
          )}

          <nav className="pj-next" aria-label="More work">
            <Link className="pj-nl" href={`/work/${prev.id}/`}>
              <span className="pj-nk">Previous</span>
              <b>{prev.title}</b>
              <span className="pj-nd">{prev.oneLiner}</span>
            </Link>
            <Link className="pj-nl" href={`/work/${next.id}/`}>
              <span className="pj-nk">Next</span>
              <b>{next.title}</b>
              <span className="pj-nd">{next.oneLiner}</span>
            </Link>
          </nav>
          <p className="pj-all"><Link className="arrow-link" href="/#work"><span aria-hidden="true">←</span> All work</Link></p>
        </article>
      </main>
    </>
  );
}
