"use client";

import { useState } from "react";
import { options, setVariant, useVariant, type VariantKey } from "./variants";

function Group({ id }: { id: VariantKey }) {
  const value = useVariant(id);
  const group = options[id];
  const current = group.choices.find(choice => choice.id === value);
  return <fieldset className="variant-group">
    <legend>{group.label}</legend>
    <div>{group.choices.map(choice => <button key={choice.id} aria-pressed={choice.id === value} onClick={() => setVariant(id, choice.id)}>{choice.label}</button>)}</div>
    <p>{current?.note}</p>
  </fieldset>;
}

// A review tool for this branch only. Delete this component (and its one
// line in Navigation) once the choices are made.
export default function VariantSwitch() {
  const [open, setOpen] = useState(false);
  return <div className={`variant-switch ${open ? "is-open" : ""}`}>
    {open && <div className="variant-panel" role="group" aria-label="Design options under review">
      <Group id="name" /><Group id="mark" /><Group id="hero" />
      <p className="variant-foot">Review panel. Not part of the site.</p>
    </div>}
    <button className="variant-toggle" aria-expanded={open} onClick={() => setOpen(!open)}><span aria-hidden="true">◐</span>{open ? "Close options" : "Try the options"}</button>
  </div>;
}
