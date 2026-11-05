"use client";

import { useState } from "react";
import Chip from "../Chip";
import { PINS } from "../../content";

export default function HeroChip() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Chip
      activePin={active}
      selectedPin={null}
      onHoverPin={setActive}
      onSelectPin={(name) => {
        const pin = PINS.find((p) => p.name === name);
        if (pin) window.location.assign(`/skills/#pin-${pin.n}`);
      }}
    />
  );
}
