import Image from "next/image";
import { PHOTOS, type AppNote as Note } from "../content";
import { Fig, Rich, Sheet } from "./parts";

export default function AppNote({ note, page, index, children }: { note: Note; page: number; index: number; children: React.ReactNode }) {
  const num = `7-${index}`;
  const photos = PHOTOS[note.id];
  return (
    <Sheet id={note.id} page={page} title={`Application note ${note.an} · ${note.title}`} section={`7.${index}|${note.an} · ${note.title}`}>
      <div className="an-top">
        <div>
          <div className="an-kicker">
            <b>{note.an}</b>
            <span>Block: {note.block}</span>
            <span>{note.domain}</span>
          </div>
          <h2 className="an-title">{note.title}</h2>
          <p className="an-hook">{note.hook}</p>
        </div>
        <div className="an-links">
          {note.links.map((l) => (
            <a key={l.href} className="button" href={l.href} target="_blank" rel="noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>
      <dl className="an-meta">
        <div><dt>Context</dt><dd>{note.context}</dd></div>
        <div><dt>Role</dt><dd>{note.role}</dd></div>
        <div><dt>Date</dt><dd>{note.when}</dd></div>
        <div><dt>Domain</dt><dd>{note.domain}</dd></div>
      </dl>
      <div className={`an-grid${index % 2 === 0 ? " flip" : ""}`}>
        <div className="an-text">
          <h3><span>7.{index}.1</span>Overview</h3>
          <p>{note.problem}</p>
          <h3><span>7.{index}.2</span>What I built</h3>
          <ol className="built">
            {note.built.map((b, i) => (
              <li key={i}><Rich text={b} /></li>
            ))}
          </ol>
          <h3><span>7.{index}.3</span>Key characteristics</h3>
          <table className="kspec">
            <tbody>
              {note.specs.map((s) => (
                <tr key={s.param}>
                  <td>
                    {s.param}
                    {s.note && <small>{s.note}</small>}
                  </td>
                  <td>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3><span>7.{index}.4</span>Stack</h3>
          <ul className="stack">
            {note.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="an-figcol">
          <Fig num={num} label={`${note.an} · ${note.title}`} caption={note.figure}>
            {children}
          </Fig>
          <div className="errata">
            <div className="errata-h">
              <span><b>Errata</b> · known limitations</span>
              <span>{note.an}</span>
            </div>
            <ol>
              {note.errata.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      {photos && photos.length > 0 && (
        <div className="an-photos">
          <h3><span>7.{index}.5</span>From the build</h3>
          <div className="an-photo-row">
            {photos.map((p, i) => (
              <figure key={p.src} style={{ "--ar": (p.w / p.h).toFixed(3) } as React.CSSProperties}>
                <Image src={p.src} width={p.w} height={p.h} alt={p.alt} sizes="(max-width: 760px) 80vw, 420px" />
                <figcaption><b>Plate {String.fromCharCode(65 + i)}.</b> {p.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </Sheet>
  );
}
