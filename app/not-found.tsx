import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell" style={{ minHeight: "100svh", display: "grid", alignContent: "center", gap: 18 }}>
      <p className="mono" style={{ color: "var(--muted)", margin: 0 }}>404 · Off the map</p>
      <h1 style={{ font: '400 clamp(56px,9vw,104px)/.9 "Instrument Serif",Georgia,serif', margin: 0 }}>
        Nothing here<span style={{ color: "var(--accent)" }}>.</span>
      </h1>
      <p style={{ margin: 0, color: "var(--muted)", maxWidth: 460 }}>This page doesn&apos;t exist, but the projects do.</p>
      <p style={{ margin: 0 }}><Link className="btn primary" href="/">Back to aadityad.dev</Link></p>
    </main>
  );
}
