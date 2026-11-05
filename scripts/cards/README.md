# Regenerating the card frames

`public/cards/<slug>.png` is a frame of the figure on `/work/<slug>/`, for the four cards in
`FEATURED` (`app/content.ts`). Each is the figure body at 1440 px wide, device scale 2,
reduced motion on, showing the figure's last beat. Regenerate after changing a featured
figure or `FEATURED`.

1. `npm run build && npx serve out -l 4181 --no-clipboard` in one terminal.
2. In another, with Playwright available outside the repo:
   `node /tmp/cards-render.mjs http://localhost:4181 <repo-root>`

```js
// Renders a frame of each featured figure. Usage: node cards-render.mjs <base-url> <repo-root>
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

const [base, repo] = process.argv.slice(2);
const FEATURED = ["visionassist", "accordion", "rung", "alta"]; // keep equal to FEATURED in app/content.ts
await mkdir(join(repo, "public/cards"), { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
for (const slug of FEATURED) {
  await page.goto(`${base}/work/${slug}/`, { waitUntil: "networkidle" });
  const beats = await page.locator(".beat").count();
  // Bring the last beat to the reading line so the figure shows its final state.
  await page.locator(".beat").nth(beats - 1).evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForFunction((n) => document.querySelector("section.reel")?.getAttribute("data-active-beat") === String(n), beats - 1);
  await page.waitForTimeout(400);
  await page.locator(".reel-figure .fig-body").screenshot({ path: join(repo, "public/cards", `${slug}.png`) });
  console.log("wrote", slug);
}
await browser.close();
```

Open every PNG before committing. Each must show the whole figure body in its final beat,
with no tooltip, no focus ring and no pointer state. Each must be under 250 KB; if one is
over, lower `deviceScaleFactor` to 1.5 for all four and rerun.
