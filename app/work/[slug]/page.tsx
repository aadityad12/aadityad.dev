import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { Fig, Rich } from "../../components/parts";
import Reel from "../../components/work/Reel";
import ProjectScene from "../../components/work/ProjectScene";
import RememberProject from "../../components/work/RememberProject";
import { Artifact } from "../../components/home/Artifacts";
import { FIGURES } from "../../figures";
import { NOTES, PHOTOS, STAGE } from "../../content";

export const dynamicParams = false;

/** Lets a long value such as a package name wrap after a slash instead of mid-word. */
function breakAtSlash(v: string) {
  const parts = v.split("/");
  return parts.map((p, i) => (i < parts.length - 1 ? <span key={i}>{p}/<wbr /></span> : <span key={i}>{p}</span>));
}

// One order for the whole site, the same as the home page: the six featured projects as they stand on the stage,
// then the rest as they are listed under "More work".
const FEATURED = STAGE.map((s) => s.id);
const SEQUENCE = [
  ...FEATURED.flatMap((id) => NOTES.filter((n) => n.id === id)),
  ...NOTES.filter((n) => !FEATURED.includes(n.id)).sort((a, b) => a.order - b.order),
];

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
  const at = SEQUENCE.findIndex((n) => n.id === note.id);
  const prev = at > 0 ? SEQUENCE[at - 1] : null;
  const next = at < SEQUENCE.length - 1 ? SEQUENCE[at + 1] : null;
  const back = FEATURED.includes(note.id) ? "/#work" : "/#more-work";
  const award = "award" in note ? note.award : undefined;
  // The award already names the event, so the facts line does not repeat it.
  const facts = [award && award.includes(note.context) ? null : note.context, note.role, note.team, note.when].filter(Boolean).join(" · ");
  const hasScene = STAGE.some((x) => x.id === note.id);
  // Real material that has no other place on the page: Accordion's screen recording, OSS Scout's guard code.
  const media = STAGE.find((x) => x.id === note.id)?.media;
  const extra = media && (media.kind === "video" || media.kind === "guard") ? media : null;

  return (
    <>
      <SiteHeader current="work" />
      <main id="main">
        <RememberProject id={note.id} />
        {/* Where you are among the projects, and the way on, wherever you are on the page. */}
        <nav className="pj-bar" aria-label="Projects">
          <div className="wrap pj-bar-in">
            <Link className="pj-bar-back" href={back}><span aria-hidden="true">←</span> All work</Link>
            <span className="pj-bar-pos"><b className="pj-bar-t">{note.title}</b><span className="num">{at + 1} of {SEQUENCE.length}</span></span>
            <span className="pj-bar-step">
              {prev && (
                <Link href={`/work/${prev.id}/`} rel="prev" aria-label={`Previous project: ${prev.title}`}>
                  <span aria-hidden="true">←</span><span className="pj-bar-t">{prev.title}</span><span className="pj-bar-s">Prev</span>
                </Link>
              )}
              {next ? (
                <Link href={`/work/${next.id}/`} rel="next" aria-label={`Next project: ${next.title}`}>
                  <span className="pj-bar-t">{next.title}</span><span className="pj-bar-s">Next</span><span aria-hidden="true">→</span>
                </Link>
              ) : (
                <Link href={back}>Back to work</Link>
              )}
            </span>
          </div>
        </nav>
        <article className="wrap pj">
          <header className={hasScene ? "pj-head has-scene" : "pj-head"}>
            <div className="pj-head-text">
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
            </div>
            {hasScene && <ProjectScene id={note.id} />}
          </header>

          <section className="pj-results" aria-labelledby="pj-results-h">
            <h2 id="pj-results-h" className="visually-hidden">Results</h2>
            <ul>
              {note.specs.slice(0, 4).map((sp) => (
                <li key={sp.param}>
                  <span className="pj-spec-v">{breakAtSlash(sp.value)}</span>
                  <span className="pj-spec-p">{sp.param}</span>
                  {sp.note && <span className="pj-spec-n">{sp.note}</span>}
                </li>
              ))}
            </ul>
          </section>

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
              <div className="pj-stack">
                <h2 id="pj-stack">Built with</h2>
                <p>{note.stack.join(", ")}</p>
              </div>
            </div>
          </div>

          {(photos.length > 0 || extra) && (
            <section className="pj-sec" aria-labelledby="pj-photos">
              <h2 id="pj-photos">From the build</h2>
              {extra && (
                <figure className="pj-extra">
                  <Artifact media={extra} />
                  <figcaption className="fig-cap">{extra.kind === "video" ? "A real session in Accordion's desktop app, folding as it runs" : "From guard/guard.py in the repo, and what the agent sees when it tries to post"}</figcaption>
                </figure>
              )}
              {photos.length > 0 && <div className="pj-photos" data-n={Math.min(photos.length, 3)}>
                {photos.map((p) => (
                  <Fig key={p.src} flush caption={p.cap}>
                    <Image className={p.w >= p.h ? "land" : undefined} src={p.src} width={p.w} height={p.h} alt={p.alt} sizes="(max-width: 900px) 100vw, 400px" />
                  </Fig>
                ))}
              </div>}
            </section>
          )}

          <nav className="pj-next" aria-label="Previous and next project">
            {prev ? (
              <Link className="pj-nl" href={`/work/${prev.id}/`}>
                <span className="pj-nk">Previous project</span>
                <b>{prev.title}</b>
                <span className="pj-nd">{prev.oneLiner}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link className="pj-nl" href={`/work/${next.id}/`}>
                <span className="pj-nk">Next project</span>
                <b>{next.title}</b>
                <span className="pj-nd">{next.oneLiner}</span>
              </Link>
            ) : (
              <Link className="pj-nl" href={back}>
                <span className="pj-nk">That was the last one</span>
                <b>Back to all work</b>
                <span className="pj-nd">Every project, sorted for the role you hire for.</span>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
