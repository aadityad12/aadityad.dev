"use client";

import { useEffect, useState } from "react";

/** Shows its children unless the URL asks for a different scene with ?only=<id>. */
export default function LabOnly({ id, children }: { id: string; children: React.ReactNode }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const only = new URLSearchParams(window.location.search).get("only");
    // Reading the URL after mount keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(!only || only === id);
  }, [id]);
  return show ? <section>{children}</section> : null;
}
