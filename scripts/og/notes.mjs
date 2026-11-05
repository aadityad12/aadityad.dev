// Writes scripts/og/notes.json for the OG templates from app/content.ts.
// Node >= 22.18 strips TypeScript types natively, so no tsx is needed.
import { writeFileSync } from "node:fs";
import { registerHooks } from "node:module";

// Content uses Next's extensionless TypeScript imports; resolve those for Node too.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[^/]+$/.test(specifier)) {
        return nextResolve(`${specifier}.ts`, context);
      }
      throw error;
    }
  },
});
const { FACTS, HERO, NOTES, PINS, PIN_GROUPS } = await import("../../app/content.ts");

const notes = NOTES.map(({ id, order, an, title, hook, headline }) => ({ id, order, an, title, hook, headline }));
const out = new URL("./notes.json", import.meta.url);
writeFileSync(out, JSON.stringify({ hero: { lead: HERO.lead }, facts: FACTS, notes, pinGroups: PIN_GROUPS, pins: PINS.map(({ name, full }) => ({ name, full })) }, null, 2) + "\n");
console.log(`wrote ${notes.length} notes`);
