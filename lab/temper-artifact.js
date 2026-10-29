// Temper: one question, asked twice. Six judged dimensions show where the harness
// lands behind the bare model; replacement files patch those rows and a scoped
// re-check brings them back. Positions are qualitative (worse to better), never scores.
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const records = new Set();
const cleanup = new WeakMap();

// bare / harness / patched are positions on a worse-to-better track (0 to 1), not scores.
const DIMENSIONS = [
  { name: "instruction adherence", bare: 0.68, harness: 0.3, patched: 0.88, file: 0 },
  { name: "tool accuracy", bare: 0.62, harness: 0.26, patched: 0.83, file: 1 },
  { name: "output format", bare: 0.55, harness: 0.73 },
  { name: "skill triggering", bare: 0.5, harness: 0.2, patched: 0.79, file: 2 },
  { name: "latency delta", bare: 0.58, harness: 0.7 },
  { name: "error recovery", bare: 0.46, harness: 0.71 },
];

const FILES = [
  { path: "system_prompt.md", fixes: "adherence", lines: [0.92, 0.7, 0.84, 0.52] },
  { path: "tools/*.json", fixes: "tool accuracy", lines: [0.6, 0.86, 0.74, 0.4] },
  { path: "skills/*.md", fixes: "skill triggering", lines: [0.8, 0.58, 0.9, 0.66] },
];

function forkDrawing() {
  return `<svg class="temper-fork" viewBox="0 0 400 104" fill="none" aria-hidden="true">
    <rect x="1" y="17" width="184" height="70" rx="3" class="temper-question-card"/>
    <path d="M1 26V20Q1 17 4 17H12" class="temper-question-tick"/>
    <text x="14" y="38" class="temper-fork-kicker">SAME QUESTION, TWICE</text>
    <text x="13" y="69" class="temper-question">“Where’s my refund?”</text>
    <path class="temper-fork-path" d="M185 52H200C217 52 215 28 234 28H244"/>
    <path class="temper-fork-path" d="M185 52H200C217 52 215 76 234 76H244"/>
    <path class="temper-fork-signal" d="M185 52H200C217 52 215 28 234 28H244"/>
    <path class="temper-fork-signal temper-fork-signal-late" d="M185 52H200C217 52 215 76 234 76H244"/>
    <circle cx="251" cy="28" r="5.5" class="temper-mark-bare"/>
    <circle cx="251" cy="76" r="5.5" class="temper-mark-harness"/>
    <text x="264" y="32" class="temper-lane">bare model</text>
    <text x="264" y="45" class="temper-lane-sub">THE MODEL ALONE</text>
    <text x="264" y="80" class="temper-lane">with its harness</text>
    <text x="264" y="93" class="temper-lane-sub">PROMPT · SKILLS · TOOLS</text>
  </svg>`;
}

function rows() {
  return DIMENSIONS.map((dimension, index) => {
    const failing = dimension.patched !== undefined;
    const low = Math.min(dimension.bare, dimension.harness);
    const high = Math.max(dimension.bare, dimension.harness);
    const style = `--b:${dimension.bare};--h:${dimension.harness};--p:${dimension.patched ?? dimension.harness};--lo:${low};--hi:${high};--order:${failing ? dimension.file : 0}`;
    const marks = failing
      ? `<span class="temper-verdict temper-verdict-worse">✗</span><span class="temper-verdict temper-verdict-fixed">✓</span>`
      : `<span class="temper-verdict temper-verdict-fine">✓</span>`;
    const failingParts = failing
      ? `<i class="temper-trace"></i><i class="temper-deficit"></i><i class="temper-gain"></i><i class="temper-ghost"></i>`
      : `<i class="temper-span"></i>`;
    return `<div class="temper-row${failing ? " is-failing" : ""}" style="${style}">
      <span class="temper-dimension">${dimension.name}</span>
      <span class="temper-track"><i class="temper-rule"></i>${failingParts}<i class="temper-bare"></i><span class="temper-rail"><i class="temper-harness"></i></span></span>
      <span class="temper-verdicts">${marks}</span>
    </div>`;
  }).join("");
}

function fileCards() {
  return FILES.map((file, index) => `<div class="temper-slot"><div class="temper-file" style="--order:${index}">
    <span class="temper-file-path">${file.path}</span>
    <span class="temper-file-lines">${file.lines.map((width) => `<i style="--w:${width}"></i>`).join("")}</span>
    <span class="temper-file-fixes">fixes ${file.fixes}</span>
  </div></div>`).join("");
}

export function createTemperArtifact() {
  const root = document.createElement("figure");
  root.className = "temper-art";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "Temper: the same question goes to the bare model and to the model with its harness. A judge compares the answers across six dimensions: instruction adherence, tool accuracy, output format, skill triggering, latency delta and error recovery. Where the harness does worse than the bare model, Temper returns replacement files, such as system_prompt.md, and a scoped re-check shows those dimensions recovered.");
  root.innerHTML = `<div class="temper-masthead" aria-hidden="true"><span>Temper</span><span>Harness evaluator · six dimensions</span></div>
    ${forkDrawing()}
    <div class="temper-chart" aria-hidden="true">
      <div class="temper-chart-head"><span class="temper-key"><i></i>harness worse than bare</span><span class="temper-axis"><span>worse</span><span>better</span></span></div>
      ${rows()}
    </div>
    <div class="temper-patch" aria-hidden="true">
      <div class="temper-patch-head"><span>Patch loop</span><span>complete replacement files</span></div>
      <div class="temper-files">${fileCards()}</div>
    </div>
    <figcaption class="temper-caption" aria-hidden="true"><p>Bare vs. harnessed.<br><em>Then patched.</em></p><span>Judge · Gemini<br>Baseline · DeepSeek</span></figcaption>`;
  let visible = false;
  const sync = () => root.classList.toggle("is-animating", visible && !paused && !document.hidden);
  const record = { sync };
  records.add(record);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(root);
  document.addEventListener("visibilitychange", sync);
  cleanup.set(root, () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    records.delete(record);
    root.classList.remove("is-animating");
  });
  return root;
}

export function setTemperPaused(value) {
  paused = value;
  records.forEach((record) => record.sync());
}

export function releaseTemperArtifact(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}
