import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Playwright isn't a project dependency: point PLAYWRIGHT_DIR at any folder that has it installed.
//   PLAYWRIGHT_DIR=/path/with/playwright CHROMIUM_PATH=/path/to/chrome node scripts/og/render.mjs
const require = createRequire(resolve(process.env.PLAYWRIGHT_DIR || process.cwd(), "package.json"));
const { chromium } = require("playwright");
const output = process.argv[2] || fileURLToPath(new URL("../../public/og-noir.png", import.meta.url));
const browser = await chromium.launch({
  args: ["--disable-lcd-text"],
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: Number(process.env.OG_SCALE || 1),
  });
  await page.goto(new URL("./og-noir.html", import.meta.url).href);
  await page.evaluate(async () => {
    const fonts = await Promise.all([
      document.fonts.load('600 120px "Bricolage Grotesque"'),
      document.fonts.load('500 30px "Manrope"'),
    ]);
    if (fonts.some(faces => faces.length === 0)) throw new Error("Google Fonts failed to load");
    await document.querySelector(".sculpture").decode();
  });
  await page.screenshot({ path: output, type: "png" });
} finally {
  await browser.close();
}
