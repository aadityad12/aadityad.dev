"use client";

import { useEffect, useRef, useState } from "react";

type Item = { id: string; number: string; name: string };

export default function WorkRail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.45;
      let current = 0;
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [items]);

  // Scrolls only the rail itself; scrollIntoView would also move the page.
  useEffect(() => {
    const box = list.current;
    const link = box?.children[active] as HTMLElement | undefined;
    if (!box || !link) return;
    box.scrollTo({ left: link.offsetLeft - (box.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  return <nav className="work-rail" aria-label="Projects on this page">
    <span className="work-rail-count" aria-hidden="true"><b>{items[active].number}</b> / {String(items.length).padStart(2, "0")}</span>
    <div className="work-rail-list" ref={list}>{items.map((item, i) => <a key={item.id} href={`#${item.id}`} aria-current={i === active ? "true" : undefined}><span>{item.number}</span>{item.name}</a>)}</div>
  </nav>;
}
