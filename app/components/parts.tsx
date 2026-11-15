/** Turns **bold** markers in content strings into <strong>. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p))}
    </>
  );
}

/** The one frame every figure, photo and video sits in: a white card with a plain caption under it. */
export function Fig({
  caption,
  children,
  flush = false,
}: {
  caption?: string;
  /** Media that should touch the card's edges (photos, video) instead of sitting inside padding. */
  flush?: boolean;
  children: React.ReactNode;
  // Accepted and ignored so older callers keep compiling until they are rewritten.
  num?: string;
  label?: string;
  live?: boolean;
}) {
  return (
    <figure className="fig">
      <div className={`fig-body${flush ? " flush" : ""}`}>{children}</div>
      {caption && <figcaption className="fig-cap">{caption}</figcaption>}
    </figure>
  );
}
