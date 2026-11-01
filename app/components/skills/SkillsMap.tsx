"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Chip from "../Chip";
import { BRIEF, NOTES, PINS, PIN_GROUPS } from "../../content";
import { useReducedMotion } from "../../figures/hooks";

type SkillsMapProps = { initialPin?: string | null; heading?: "h1" | "h2" };

export default function SkillsMap({ initialPin, heading = "h1" }: SkillsMapProps) {
  const validPin = PINS.some((pin) => pin.name === initialPin) ? initialPin! : null;
  const [active, setActive] = useState<string | null>(validPin);
  const [selected, setSelected] = useState<string | null>(validPin);
  const rows = useRef(new Map<string, HTMLLIElement>());
  const reduced = useReducedMotion();
  const Heading = heading;

  useEffect(() => {
    if (validPin) rows.current.get(validPin)?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [validPin, reduced]);

  const select = (name: string | null) => {
    setSelected(name);
    setActive(name);
    if (name) rows.current.get(name)?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="skills-map">
      <header className="sk-head">
        <Heading id={heading === "h2" ? "skills-dialog-h" : "skills-h"}>Pin map</Heading>
        <p>{BRIEF.chip.line}<span className="sk-hover"> {BRIEF.chip.hover}</span></p>
      </header>
      <div className="sk-cols">
        <div className="sk-chip">
          <Chip activePin={active} selectedPin={selected} onHoverPin={(name) => setActive(name ?? selected)} onSelectPin={select} />
        </div>
        <div className="sk-list">
          {PIN_GROUPS.map((group) => (
            <section key={group.name} aria-labelledby={`sk-group-${group.pins[0]}`}>
              <h3 id={`sk-group-${group.pins[0]}`}>{group.name}</h3>
              <ul>
                {group.pins.map((name) => {
                  const pin = PINS.find((item) => item.name === name)!;
                  return (
                    <li
                      key={pin.n}
                      id={`pin-${pin.n}`}
                      data-pin={pin.name}
                      className={`${active === name ? "on" : ""}${selected === name ? " sel" : ""}`.trim() || undefined}
                      ref={(node) => { if (node) rows.current.set(name, node); else rows.current.delete(name); }}
                      onPointerEnter={() => setActive(name)}
                      onPointerLeave={() => setActive(selected)}
                      onFocus={() => setActive(name)}
                      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(selected); }}
                    >
                      <b>{pin.full}</b>
                      <span className="sk-desc">{pin.desc}</span>
                      <span className="sk-uses">
                        {pin.uses.length ? <>Used in {pin.uses.map((id, i) => (
                          <Fragment key={id}>
                            {i > 0 && ", "}<Link href={`/work/${id}/`}>{NOTES.find((note) => note.id === id)!.title}</Link>
                          </Fragment>
                        ))}</> : "Teaching and coursework"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <p className="sk-foot">The pin table in the datasheet has the same information as text. <Link href="/datasheet/#specs">Pin table ↗</Link></p>
        </div>
      </div>
    </div>
  );
}
