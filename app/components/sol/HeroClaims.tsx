"use client";

import { heroForms, heroStore, useHero } from "./heroStore";

const claims = [
  { id: "accordion", text: "AI that remembers." },
  { id: "gazeboard", text: "A phone that speaks with a glance." },
  { id: "rung", text: "A language that becomes machine code." },
] as const;

// The three phrases in the hero are also three ways into the work: pointing
// at one rebuilds the object beside it, clicking one goes to that project.
export default function HeroClaims() {
  const { shown } = useHero();
  return <p className="hero-claims" onPointerLeave={() => heroStore.preview(null)}>
    {claims.map((claim, i) => <span key={claim.id}>
      <a href={`#${claim.id}`} className={shown === claim.id ? "is-shown" : ""} aria-label={`${claim.text} See ${heroForms.find(form => form.id === claim.id)?.name}.`} onPointerEnter={event => { if (event.pointerType === "mouse") heroStore.preview(claim.id); }} onFocus={() => heroStore.preview(claim.id)} onBlur={() => heroStore.preview(null)}>{claim.text}</a>{i < claims.length - 1 ? " " : ""}
    </span>)}
  </p>;
}
