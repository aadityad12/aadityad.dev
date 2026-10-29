// Screenshot loop for visual checks: drives system Chrome over the DevTools
// protocol (no Playwright/Puppeteer dependency).
//
//   node scripts/shoot.mjs <url> <outDir> [--w 1440] [--h 900] [--scroll 0,900,1800] [--frames 6] [--every 500] [--eval js]
//
// For each scroll position it captures --frames screenshots --every ms apart,
// so animations and timed carousels show up as a sequence.
import { spawn } from "node:child_process";
import { mkdir, writeFile, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [url, outDir, ...rest] = process.argv.slice(2);
if (!url || !outDir) {
  console.error("usage: node scripts/shoot.mjs <url> <outDir> [--w] [--h] [--scroll a,b] [--frames n] [--every ms] [--settle ms]");
  process.exit(1);
}
const opt = { w: 1440, h: 900, scroll: "0", frames: 1, every: 500, settle: 2500 };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, "")] = rest[i + 1];
const W = Number(opt.w), H = Number(opt.h), FRAMES = Number(opt.frames), EVERY = Number(opt.every);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = await mkdtemp(join(tmpdir(), "shoot-"));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  "--hide-scrollbars", "--no-first-run", "--allow-file-access-from-files", `--window-size=${W},${H}`, "about:blank",
], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(100);
    target = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json()).then((l) => l.find((t) => t.type === "page")).catch(() => null);
  }
  if (!target) throw new Error("chrome did not start");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    // --console 1 prints page errors and console warnings/errors
    if (opt.console && msg.method === "Runtime.exceptionThrown") console.log("page error:", msg.params.exceptionDetails?.exception?.description ?? msg.params.exceptionDetails?.text);
    if (opt.console && msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) console.log(`console.${msg.params.type}:`, msg.params.args.map((a) => a.value ?? a.description).join(" "));
  };
  const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

  await send("Page.enable");
  if (opt.console) await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
  await send("Page.navigate", { url });
  await sleep(Number(opt.settle));
  await mkdir(outDir, { recursive: true });
  // --eval "<js expression>" prints its (JSON-able) value, for checking page state
  if (opt.eval) console.log("eval:", JSON.stringify((await send("Runtime.evaluate", { expression: opt.eval, returnByValue: true, awaitPromise: true })).result?.result?.value));

  for (const y of String(opt.scroll).split(",").map(Number)) {
    // scroll in steps so scroll-triggered reveals fire on the way down
    await send("Runtime.evaluate", { expression: `(async()=>{const t=${y};const s=window.scrollY;for(let k=1;k<=8;k++){window.scrollTo(0,s+(t-s)*k/8);await new Promise(r=>setTimeout(r,60))}})()`, awaitPromise: true });
    await sleep(700);
    for (let f = 0; f < FRAMES; f++) {
      const { result } = await send("Page.captureScreenshot", { format: "png" });
      const name = `y${String(y).padStart(5, "0")}-f${f}.png`;
      await writeFile(join(outDir, name), Buffer.from(result.data, "base64"));
      console.log(join(outDir, name));
      if (f < FRAMES - 1) await sleep(EVERY);
    }
  }
  ws.close();
} finally {
  chrome.kill();
}
