import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fig, Rich } from "../../components/parts";
import Status from "../../components/Status";
import { FIGURES } from "../../figures";
import { NOTES, PHOTOS } from "../../content";

export const dynamicParams = false;

// Figures that were drawn for a wide frame; the rest are centred at 720px.
const WIDE = new Set(["accordion", "visionassist", "rung", "clear-dispatch"]);

const BY_ORDER = [...NOTES].sort((a, b) => a.order - b.order);

export function generateStaticParams() {
  return NOTES.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) return {};
  const url = `/work/${note.id}/`;
  const title = `${note.title} · Aaditya Desai`;
  return {
    title,
    description: note.hook,
    alternates: { canonical: url },
    openGraph: { title, description: note.hook, url },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.id === slug);
  if (!note) notFound();
  const photos = PHOTOS[note.id] ?? [];
  const F = FIGURES[note.id];
  const next = BY_ORDER[note.order % BY_ORDER.length];

  return (
    <main className="work" id="main">
      <header className="work-head">
        <p className="work-meta">
          <span>{note.an}</span>
          <span>{note.domain}</span>
          <span>{note.context}</span>
          <span>{note.role}</span>
          <span>{note.when}</span>
        </p>
        <h1>{note.title}</h1>
        <p className="hook">{note.hook}</p>
        <div className="work-links">
          {note.links.map((l) => (
            <a key={l.href} className="button" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
          <Link className="work-all" href="/#projects">← All projects</Link>
        </div>
      </header>

      <div className="work-figure" data-slot="reel">
        <div className={WIDE.has(note.id) ? "work-fig-wide" : "work-fig-narrow"}>
          {F ? (
            <Fig num="1" label={note.title} caption={note.figure}>
              <F />
            </Fig>
          ) : photos[0] ? (
            <Fig num="1" label={note.title} caption={note.figure} live={false}>
              <Image src={photos[0].src} width={photos[0].w} height={photos[0].h} alt={photos[0].alt} sizes="(max-width: 760px) 90vw, 720px" style={{ width: "100%", height: "auto" }} />
            </Fig>
          ) : null}
        </div>
      </div>

      <section className="work-sec" id="overview">
        <h2>Overview</h2>
        <p className="work-prose">{note.problem}</p>
      </section>

      <div className="work-cols">
        <section className="work-sec" id="built">
          <h2>What I built</h2>
          <ol className="built">
            {note.built.map((b, i) => (
              <li key={i}><Rich text={b} /></li>
            ))}
          </ol>
        </section>
        <section className="work-sec" id="specs">
          <h2>Key characteristics</h2>
          <table className="kspec">
            <tbody>
              {note.specs.map((s) => (
                <tr key={s.param}>
                  <td>
                    {s.param}
                    {s.note && <small>{s.note}</small>}
                  </td>
                  <td>{s.value}</td>
                  <td>{s.status && <Status s={s.status} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Stack</h3>
          <ul className="stack">
            {note.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      {photos.length > 0 && (
        <section className="work-sec" id="photos">
          <h2>From the build</h2>
          <div className="an-photo-row">
            {photos.map((p, i) => (
              <figure key={p.src} style={{ "--ar": (p.w / p.h).toFixed(3) } as React.CSSProperties}>
                <Image src={p.src} width={p.w} height={p.h} alt={p.alt} sizes="(max-width: 760px) 80vw, 420px" />
                <figcaption><b>Plate {String.fromCharCode(65 + i)}.</b> {p.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav className="work-next" aria-label="More">
        <a href={`/work/${next.id}/`}>Next: {next.title} →</a>
        {note.id === "visionassist" && <Link href="/#experience">Experience: Infineon →</Link>}
        <a href={`/datasheet/#${note.id}`}>Full entry in the datasheet ↗</a>
      </nav>
    </main>
  );
}
