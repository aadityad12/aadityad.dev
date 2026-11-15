"use client";

import { useEffect, useState } from "react";
import { FIGURES } from "../../figures";

export default function LabFigure({ id }: { id: string }) {
  const [state, setState] = useState<{ show: boolean; beat: number | null }>({ show: true, beat: null });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const only = q.get("only");
    const beat = q.get("beat");
    // Reading the URL after mount keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ show: !only || only === id, beat: beat === null ? null : Number(beat) });
    if (only && only !== id) document.querySelector<HTMLElement>(`[data-fig="${id}"]`)?.style.setProperty("display", "none");
  }, [id]);
  const F = FIGURES[id];
  if (!F || !state.show) return null;
  return <F beat={state.beat} />;
}
