# Regenerating the Open Graph images

`public/og/home.png` and `public/og/work/<slug>.png` (1200 x 630) are rendered from
`home.html` and `work.html?slug=<id>` in this folder. Both read `notes.json`, which is
generated from `app/content.ts`, so the text on the images can never drift from the site.
`public/og/datasheet.png` is the datasheet-era image, moved from `public/og.png`.

1. Regenerate the data (Node 22.18 or newer strips the TypeScript types itself, no `tsx`):

   ```
   node scripts/og/notes.mjs
   ```

2. Render the PNGs. The script is not part of the repo because it needs Playwright, which
   the site does not depend on. Save it outside the repo (for example `/tmp/og-render.mjs`
   next to a `node_modules` with `playwright-core`), then run
   `node /tmp/og-render.mjs <repo-root>`. It serves `scripts/og/` on a local port (the pages
   `fetch` their JSON), loads Archivo and IBM Plex Mono from Google Fonts, and waits for
   `body[data-ready]` before each screenshot, so it needs network access.

```js
// Renders the OG PNGs. Usage: node pr15-render.mjs <repo-root>
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const repo = process.argv[2];
const og = join(repo, "scripts/og");
const types = { ".html": "text/html", ".css": "text/css", ".json": "application/json" };
const server = createServer(async (req, res) => {
  try {
    const f = join(og, new URL(req.url, "http://x").pathname);
    const body = await readFile(f);
    res.writeHead(200, { "content-type": types[extname(f)] ?? "text/plain" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}`;
const { notes } = JSON.parse(await readFile(join(og, "notes.json"), "utf8"));

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const shoot = async (url, out) => {
  await page.goto(url);
  await page.waitForSelector("body[data-ready]");
  await page.screenshot({ path: join(repo, "public/og", out) });
  console.log("wrote", out);
};
await shoot(`${base}/home.html`, "home.png");
for (const n of notes) await shoot(`${base}/work.html?slug=${n.id}`, `work/${n.id}.png`);
await browser.close();
server.close();
```

Open every PNG before committing.
