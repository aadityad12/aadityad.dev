"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { layers } from "../lib/content";

export function SectionCut() {
  const [active, setActive] = useState("accordion");
  const listRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const layer = layers.find((item) => item.id === active) ?? layers[2];

  function pick(clientY: number) {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-layer]");
    if (!buttons) return;
    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        const id = button.dataset.layer;
        if (id) setActive(id);
        return;
      }
    }
  }

  function move(key: "ArrowDown" | "ArrowUp" | "Home" | "End", currentId: string) {
    const index = layers.findIndex((item) => item.id === currentId);
    const nextIndex =
      key === "Home" ? 0 :
      key === "End" ? layers.length - 1 :
      key === "ArrowDown" ? (index + 1) % layers.length :
      (index - 1 + layers.length) % layers.length;
    const next = layers[nextIndex];
    setActive(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-layer="${next.id}"]`)?.focus();
  }

  return (
    <figure className="cut">
      <figcaption>Fig. 1 — From the day I live, down to the instruction. Drag the cut, or choose a layer.</figcaption>
      <div className="cut-frame">
        <div ref={listRef} className="layer-list" role="group" aria-label="Section through the work">
          {layers.map((item) => {
            const on = item.id === layer.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                data-layer={item.id}
                className={on ? "layer is-active" : "layer"}
                onClick={() => setActive(item.id)}
                onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
                  if (event.button !== 0) return;
                  dragging.current = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  pick(event.clientY);
                }}
                onPointerMove={(event: PointerEvent<HTMLButtonElement>) => {
                  if (!dragging.current) return;
                  pick(event.clientY);
                }}
                onPointerUp={() => {
                  dragging.current = false;
                }}
                onPointerCancel={() => {
                  dragging.current = false;
                }}
                onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
                    event.preventDefault();
                    move(event.key, event.currentTarget.dataset.layer ?? active);
                  }
                }}
              >
                <span className="cut-cap cut-cap-l" aria-hidden="true">A</span>
                <span className="cut-cap cut-cap-r" aria-hidden="true">A</span>
                <span className="layer-kicker">{item.kicker}</span>
                <span className="layer-name">{item.name}</span>
                <span className="layer-proof">{item.proof}</span>
              </button>
            );
          })}
        </div>
        <div className="cut-detail" aria-live="polite">
          <p className="cut-line">{layer.line}</p>
          <p className="cut-proof">{layer.proof}</p>
          <p className="cut-proof-label">{layer.proofLabel}</p>
          <a className="text-link" href={`#${layer.id}`}>Open {layer.name}</a>
        </div>
      </div>
    </figure>
  );
}
