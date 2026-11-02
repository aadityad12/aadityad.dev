"use client";

import { useState } from "react";
import Chip from "../Chip";

export default function HeroChip() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Chip
      activePin={active}
      selectedPin={null}
      onHoverPin={setActive}
      onSelectPin={(name) => name && window.dispatchEvent(new CustomEvent("skills:open", { detail: { pin: name } }))}
    />
  );
}
