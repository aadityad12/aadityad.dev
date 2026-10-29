import type { ReactNode } from "react";
import type { Fact, Link } from "../lib/content";

export function Plate({
  id,
  index,
  kicker,
  title,
  headline,
  lede,
  exhibit,
  caption,
  facts,
  stack,
  links,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  headline: string;
  lede: string;
  exhibit: ReactNode;
  caption: string;
  facts: Fact[];
  stack: string;
  links: Link[];
}) {
  return (
    <article className="plate" id={id} data-layout={id}>
      <header className="plate-head">
        <div>
          <p className="kicker"><span className="kicker-index">{index}</span>{kicker}</p>
          <h3>{title}</h3>
          <p className="headline">{headline}</p>
          <div className="plate-links">
            {links.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.href}
                  className={link.primary ? "btn btn-primary" : "btn"}
                  href={link.href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.label}
                  {external ? <span aria-hidden="true"> ↗</span> : null}
                </a>
              );
            })}
          </div>
          <p className="stack">{stack}</p>
        </div>
        <p className="lede">{lede}</p>
      </header>
      <figure className="exhibit">
        {exhibit}
        <figcaption>{caption}</figcaption>
      </figure>
      <div className="facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <h4>{fact.label}</h4>
            <p>{fact.text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
