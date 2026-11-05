import { EMAIL, PART, REV } from "../content";

export const TOTAL_PAGES = 15;

export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p))}
    </>
  );
}

export function Sheet({
  id,
  page,
  title,
  section,
  children,
}: {
  id?: string;
  page: number;
  title: string;
  section: string;
  children: React.ReactNode;
}) {
  return (
    <section className="sheet" id={id} data-section={section} aria-label={title}>
      <header className="sheet-head">
        <b>{PART}</b>
        <span>{title}</span>
        <span>aadityad.dev · {REV}</span>
      </header>
      <div className="sheet-body">{children}</div>
      <footer className="sheet-foot">
        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`${PART} datasheet feedback`)}`}>Submit document feedback</a>
        <span>© 2026 Aaditya Desai</span>
        <span>
          Page {page} of {TOTAL_PAGES}
        </span>
      </footer>
    </section>
  );
}

export function SectionHead({ num, title, aside, id }: { num: string; title: string; aside?: string; id?: string }) {
  return (
    <div className="sh" id={id}>
      <span className="sh-num">{num}</span>
      <h2 className="sh-title">{title}</h2>
      {aside && <span className="sh-aside">{aside}</span>}
    </div>
  );
}

export function Fig({
  num,
  label,
  caption,
  live = true,
  children,
}: {
  num: string;
  label: string;
  caption: string;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className="fig">
      <div className="fig-frame">
        <div className="fig-bar">
          <span>Figure {num}</span>
          <span>{label}</span>
          {live ? (
            <span className="live"><i />Interactive</span>
          ) : (
            <span>Static</span>
          )}
        </div>
        <div className="fig-body">{children}</div>
      </div>
      <figcaption className="fig-cap">
        <b>Figure {num}.</b>
        {caption}
      </figcaption>
    </figure>
  );
}
