// Renders the Open Graph cards: public/og/home.png and public/og/work/<id>.png (1200 x 630).
// Project titles and hooks are read from app/content.ts as text, so the cards match the site.
// Needs playwright-core: OG_PLAYWRIGHT=/path/to/a/folder/with/node_modules node scripts/og/render.mjs
import { createRequire } from "node:module";
import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const require = createRequire(import.meta.url);
const pwPath = process.env.OG_PLAYWRIGHT;
if (!pwPath) throw new Error("Set OG_PLAYWRIGHT to a folder whose node_modules contain playwright-core");
const { chromium } = require(require.resolve("playwright-core", { paths: [pwPath] }));

// Read the projects from app/content.ts (NOTES only, not MORE).
const src = await readFile(join(root, "app/content.ts"), "utf8");
const notesText = src.slice(src.indexOf("export const NOTES"), src.indexOf("export const MORE"));
const unescape = (s) => s.replace(/\\(.)/g, "$1");
const projects = notesText
  .split(/\n {2}\{\n(?= {4}id: )/)
  .slice(1)
  .map((chunk) => {
    const id = chunk.match(/^\s{4}id: "([^"]+)"/m)?.[1];
    const title = chunk.match(/^\s{4}title: "((?:[^"\\]|\\.)*)"/m)?.[1];
    const hook = chunk.match(/^\s{4}hook: "((?:[^"\\]|\\.)*)"/m)?.[1];
    if (!id || !title || !hook) throw new Error(`Could not read id, title and hook from a NOTES entry (${id ?? "?"})`);
    return { id, title: unescape(title), hook: unescape(hook) };
  });
if (projects.length === 0) throw new Error("No projects found in app/content.ts");

const mark = (await readFile(join(root, "public/favicon.svg"), "utf8"))
  .replace(/<svg([^>]*)>/, '<svg$1 width="150" height="150" aria-hidden="true">');
const fontsCss = "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..900&display=swap";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// `main` is the big line (HTML); `sub` the line under it (HTML, may be empty).
const card = ({ main, mainSize, sub, subClass }) => `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="${fontsCss}">
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #f7f8f5; }
  body { position: relative; font-family: "Schibsted Grotesk", system-ui, sans-serif; color: #111417; }
  .card { position: absolute; inset: 0; padding: 64px; display: flex; flex-direction: column; }
  .name { font-size: 30px; font-weight: 700; line-height: 1.2; }
  .main { margin-top: auto; font-size: ${mainSize}px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; white-space: nowrap; }
  .sub { margin-top: 28px; font-size: 40px; font-weight: 500; line-height: 1.25; color: #5a6268; max-width: 1000px; }
  .sub.hook { font-size: 44px; font-weight: 500; color: #111417; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 28px; }
  .url { font-size: 30px; font-weight: 500; color: #5a6268; line-height: 1; }
  .mark { line-height: 0; }
  .mark svg { display: block; }
</style></head>
<body>
<div class="card">
  <div class="name">${main === "Aaditya Desai" ? "&nbsp;" : "Aaditya Desai"}</div>
  <div class="main" id="main">${main}</div>
  ${sub ? `<div class="${subClass}">${sub}</div>` : ""}
  <div class="foot">
    <div class="url">aadityad.dev</div>
    <div class="mark">${mark}</div>
  </div>
</div>
</body></html>`;

// Shrinks the big line until it fits its box on one line.
const fit = () => {
  const el = document.getElementById("main");
  let size = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > el.clientWidth && size > 40) {
    size -= 2;
    el.style.fontSize = size + "px";
  }
};

const cards = [
  {
    file: "home.png",
    html: card({
      main: esc("Aaditya Desai"),
      mainSize: 150,
      sub: esc("Computer engineering student · San José State · Class of 2028"),
      subClass: "sub",
    }),
  },
  ...projects.map((p) => ({
    file: join("work", `${p.id}.png`),
    html: card({ main: esc(p.title), mainSize: 130, sub: esc(p.hook), subClass: "sub hook" }),
  })),
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const outDir = join(root, "public/og");
await mkdir(join(outDir, "work"), { recursive: true });

for (const c of cards) {
  await page.setContent(c.html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(fit);
  await page.evaluate(() => document.fonts.ready);
  const out = join(outDir, c.file);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log("wrote", join("public/og", c.file));
}
await browser.close();
console.log(`projects: ${projects.map((p) => p.id).join(", ")}`);
