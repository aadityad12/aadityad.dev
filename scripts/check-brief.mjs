// Read the static export as a recruiter scans it. Run npm run build first.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const FILES = ["out/index.html", "out/skills/index.html"];
const REQUIRED = [
  "Computer Engineering · SJSU · Class of 2028",
  "Aaditya Desai",
  "Infineon",
  "Hackathon winner",
  "3.8 GPA",
  "Résumé PDF ↓",
  "See the work ↓",
  "Available for Summer 2027 internships · May to August 2027",
  "Work",
  "VisionAssist",
  "Accordion",
  "Rung",
  "Alta",
  "Experience",
  "Infineon Technologies, with De Anza College",
  "Education",
  "San José State University",
  "Get in touch.",
  "aaditya.d.desai@gmail.com",
];
const RE = /<(h1|h2|h3|b|strong|small)\b[^>]*>([\s\S]*?)<\/\1>|<a\b[^>]*class="(button|cta)[^"]*"[^>]*>([\s\S]*?)<\/a>|<(?:p|span|div)\b[^>]*class="(?:avail|brief-eyebrow)[^"]*"[^>]*>([\s\S]*?)<\/(?:p|span|div)>|<span class="tag[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
const BANNED = [
  /38\.84/, /200 ms/, /1,200/, /≈/, /525/, /4\.54/, /0\.63/, /14\.41/,
  /team of/i, /-person/i, /\bsolo\b/i, /\(in progress\)/i,
  /\d[\d,.]*\+?\s*k?\s*(students?|members?|hours?|PRs?|pull requests?|commits?|lines?|tests?|contact hours)\b/i,
];
const TEAM = /team of|-person|\bsolo\b/i;
const strip = (s) => s.replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ").trim();
const block = (html, tag) => html.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`))?.[0] ?? "";
const withoutSvg = (html) => html.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/g, "");
const pages = new Map(FILES.filter(existsSync).map((file) => {
  const html = readFileSync(file, "utf8");
  const main = withoutSvg(block(html, "main"));
  return [file, { html, main, scan: main + withoutSvg(block(html, "footer")) }];
}));

const landmarks = [...(pages.get(FILES[0])?.scan ?? "").matchAll(RE)].map((m) => ({
  kind: m[1] ?? (m[3] !== undefined ? m[3] : m[5] !== undefined ? "kicker" : "tag"),
  text: strip(m[2] ?? m[4] ?? m[5] ?? m[6]),
}));
console.log("landmark read, /");
for (const stop of landmarks) console.log(`${stop.kind}\t${stop.text}`);
console.log(`${landmarks.length} stops, ${landmarks.filter((s) => s.kind === "tag").length} tags\n`);

let failed = false;
const row = (name, errors = []) => {
  if (errors.length) failed = true;
  console.log(`${errors.length ? "FAIL" : "PASS"} ${name}`);
  for (const error of errors) console.log(`  ${error}`);
};
const missing = FILES.filter((file) => !pages.has(file)).map((file) => `missing ${file}; run npm run build first`);
let cursor = 0;
const orderErrors = [];
for (const text of REQUIRED) {
  const found = landmarks.findIndex((stop, i) => i >= cursor && stop.text === strip(text));
  if (found === -1) {
    orderErrors.push(`expected "${text}" after stop ${cursor}; found "${landmarks[cursor]?.text ?? "end of read"}" instead (missing or out of order)`);
    break;
  }
  cursor = found + 1;
}
row("landmarks in order", orderErrors);
row("status tags", [...pages].flatMap(([file, { html }]) => {
  const count = [...html.matchAll(/class="tag(?:\s|"|$)/g)].length;
  return count ? [`${file}: ${count} status tag(s)`] : [];
}));
const context = (file, pattern, text, match) => `${file}: ${pattern} matched "${match[0]}" near "${text.slice(Math.max(0, match.index - 40), match.index + match[0].length + 40)}"`;
row("banned patterns", [...pages].flatMap(([file, { scan }]) => {
  const text = strip(scan);
  return BANNED.flatMap((pattern) => {
    const match = pattern.exec(text);
    return match ? [context(file, pattern, text, match)] : [];
  });
}));
row("bold in body", /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*?<(?:b|strong)\b/.test(pages.get(FILES[0])?.main ?? "") ? [`${FILES[0]}: <b> or <strong> inside a <p>`] : []);
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
row("team sizes, site-wide", existsSync("out") ? walk("out").filter((file) => file.endsWith("index.html")).flatMap((file) => {
  // Flight payloads and executable code are not rendered page text.
  const text = strip(readFileSync(file, "utf8").replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, ""));
  const match = TEAM.exec(text);
  return match ? [context(file, TEAM, text, match)] : [];
}) : ["missing out/; run npm run build first"]);
row("routes present", missing);
process.exitCode = failed ? 1 : 0;
