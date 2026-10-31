// Writes scripts/og/notes.json (what work.html and home.html read) from app/content.ts.
// Node >= 22.18 strips TypeScript types natively, so no tsx is needed.
import { writeFileSync } from "node:fs";
import { HERO, NOTES, PROOF } from "../../app/content.ts";

const notes = NOTES.map(({ id, an, title, hook, headline }) => ({ id, an, title, hook, headline }));
const out = new URL("./notes.json", import.meta.url);
writeFileSync(out, JSON.stringify({ hero: { lead: HERO.lead }, proof: PROOF.map(({ big, small, status }) => ({ big, small, status })), notes }, null, 2) + "\n");
console.log(`wrote ${notes.length} notes`);
