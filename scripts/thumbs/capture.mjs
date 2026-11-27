// With the noir site running on localhost:4101, run
// PLAYWRIGHT_DIR=/path/to/playwright-install node scripts/thumbs/capture.mjs
// PLAYWRIGHT_DIR contains node_modules/playwright. Requires Python 3 + Pillow.
// Set CHROMIUM_PATH to use a different Chromium binary.
import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const playwrightDir = process.env.PLAYWRIGHT_DIR;
if (!playwrightDir) throw new Error("Set PLAYWRIGHT_DIR to the directory containing node_modules/playwright.");
const { chromium } = createRequire(resolve(playwrightDir, "package.json"))("playwright");
const outputDir = fileURLToPath(new URL("../../public/projects/thumbs/", import.meta.url));

// The bounds include the object and its attached markings. A separate fit for
// each aspect keeps a wide breadboard and a tall phone intact in both frames.
const projects = [
  { id: "accordion", beat: "Step 2: Fold", subject: ".acc-face", fill: [.79, .82] },
  { id: "rung", beat: "Step 4: ARM64 JIT", subject: ".processor", fill: [.79, .76] },
  { id: "alta", beat: "Step 3: Hint", subject: ".alta-board, .alta-tag, .alta-probe svg", fill: [.8, .84] },
  { id: "gazeboard", beat: "Step 4: Say it", subject: ".gz-phone", fill: [.85, .84] },
  { id: "visionassist", beat: "Step 3: Speak", subject: ".va-tag, .va-stand, .va-mark > span, .va-you", fill: [.76, .79] },
  { id: "apextracker", subject: ".apex-phone", fill: [.85, .84] },
];

const isolate = `
  nextjs-portal { display: none !important; }
  .site-header, .stage-caption, .stage-bottom, .beats, .acc-hud, .acc-limit,
  .rung-flow, .rung-speed, .instruction-stream, .gz-statement, .said, .alta-hud,
  .va-side, .apex-statement, .apex-orbit { visibility: hidden !important; }
  html { scroll-behavior: auto !important; }
  .case-exhibit .stage { border-radius: 0; --scene-progress: 0 !important; }
  .va-scene { left: 0; }
`;

const encode = `
import io, json, sys
from pathlib import Path
from PIL import Image

config = json.loads(sys.argv[1])
source = Image.open(io.BytesIO(sys.stdin.buffer.read())).convert("RGB")
x0, y0, x1, y1 = config["bounds"]
cx, cy = (x0 + x1)/2, (y0 + y1)/2
# A subpixel-aligned stage edge can include a row of the surrounding page.
inset = 4
interior = source.crop((inset, inset, source.width-inset, source.height-inset))
for (w, h, suffix), fill in zip([(1200, 750, ""), (480, 480, "-square")], config["fill"]):
    scale = max((x1-x0)/w, (y1-y0)/h) / fill
    width, height = round(w*scale), round(h*scale)
    left, top = round(cx-width/2), round(cy-height/2)
    # Portrait objects can need more side room than the original stage has.
    # Continue the stage's own flat tint around its unmodified screenshot.
    frame = Image.new("RGB", (width, height), tuple(config["background"]))
    frame.paste(interior, (inset-left, inset-top))
    dest = Path(config["outputDir"]) / (config["id"] + suffix + ".webp")
    frame.resize((w,h), Image.Resampling.LANCZOS).save(dest, quality=82, method=6)
    print(f"{dest.name}  {dest.stat().st_size} bytes")
`;

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || resolve(homedir(), ".cache/ms-playwright/chromium-1228/chrome-linux64/chrome"),
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "no-preference",
  });
  // Publish after capturing every stage so asset writes cannot refresh a case page.
  const captures = [];
  for (const project of projects) {
    const response = await page.goto(`http://localhost:4101/work/${project.id}/`);
    if (!response?.ok()) throw new Error(`Could not load ${project.id}: ${response?.status()}`);
    const stage = page.locator(".case-exhibit .stage");
    await stage.scrollIntoViewIfNeeded();
    if (project.beat) {
      // The ring appears when React has attached the controls and started playback.
      await stage.locator(".beat-ring").waitFor();
      const button = stage.getByRole("button", { name: project.beat, exact: true });
      await button.click();
      await button.and(stage.locator('[aria-pressed="true"]')).waitFor();
    }
    await page.addStyleTag({ content: isolate });
    await stage.evaluate(async el => {
      await document.fonts.ready;
      await Promise.all(Array.from(el.querySelectorAll("img"), img => img.decode()));
    });
    await page.waitForTimeout(2600);
    const geometry = await stage.evaluate((el, selector) => {
      // Fix a representative point in each loop so both files share a frame.
      for (const animation of el.getAnimations({ subtree: true })) {
        const timing = animation.effect?.getTiming();
        if (timing?.iterations === Infinity && typeof timing.duration === "number") {
          animation.pause();
          animation.currentTime = timing.duration * .6;
        }
      }
      const box = el.getBoundingClientRect();
      const parts = Array.from(el.querySelectorAll(selector), node => node.getBoundingClientRect());
      if (!parts.length) throw new Error(`Missing subject: ${selector}`);
      const horizontal = parts.flatMap(p => [p.left, p.right]);
      const vertical = parts.flatMap(p => [p.top, p.bottom]);
      return {
        bounds: [
          (Math.min(...horizontal) - box.left) * devicePixelRatio,
          (Math.min(...vertical) - box.top) * devicePixelRatio,
          (Math.max(...horizontal) - box.left) * devicePixelRatio,
          (Math.max(...vertical) - box.top) * devicePixelRatio,
        ],
        background: getComputedStyle(el).backgroundColor.match(/\d+/g).slice(0, 3).map(Number),
      };
    }, project.subject);
    const shot = await stage.screenshot({ scale: "device" });
    const capturedBeat = await stage.evaluate(el => el.querySelector('.beats [aria-pressed="true"]')?.getAttribute("aria-label") ?? null);
    const chromeHidden = await stage.locator(".stage-caption").evaluate(el => getComputedStyle(el).visibility === "hidden");
    if (!chromeHidden || capturedBeat !== (project.beat ?? null)) {
      throw new Error(`The stage changed during capture of ${project.id}. Run the script again.`);
    }
    const config = { id: project.id, fill: project.fill, ...geometry, outputDir };
    captures.push({ shot, config });
  }
  for (const { shot, config } of captures) {
    const result = spawnSync("python3", ["-c", encode, JSON.stringify(config)], { input: shot });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr.toString());
    process.stdout.write(result.stdout);
  }
} finally {
  await browser.close();
}
