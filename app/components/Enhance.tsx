"use client";

import { useEffect } from "react";

// Loads the interactive layer once, after the static page has rendered.
export default function Enhance() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    import("./site-interactions.js").then((module) => module.start()).catch((error) => console.error(error));
  }, []);
  return null;
}
