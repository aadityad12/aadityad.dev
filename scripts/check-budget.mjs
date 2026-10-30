// Performance budget check for the static export in out/.
// Sizes are uncompressed bytes on disk. Run `npm run build` first.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const BUDGETS = [
  { html: "out/index.html", label: "/", maxKB: 60 },
  { html: "out/work/rung/index.html", label: "/work/rung/", maxKB: 180 },
  { html: "out/datasheet/index.html", label: "/datasheet/", maxKB: 500 },
];

const OUT = "out";
const MAP_HTML = join(OUT, "map", "index.html");
const KB = 1024;

// Every JS chunk a page loads. This matches the path wherever it appears in the
// HTML: <script src>, <link rel="preload" as="script" href>, and the chunk lists
// inside the inline self.__next_f.push(...) payloads (the client chunks React
// fetches for hydration). A whole-document match covers all three, so a new
// reference style from Next cannot slip past it.
const CHUNK_RE = /\/_next\/[^"'\s\\<>()]+?\.js/g;

const fileCache = new Map();
const read = (path) => {
  if (!fileCache.has(path)) fileCache.set(path, readFileSync(path, "utf8"));
  return fileCache.get(path);
};

const chunksOf = (htmlPath) => {
  const found = new Set();
  for (const m of read(htmlPath).matchAll(CHUNK_RE)) {
    found.add(join(OUT, m[0]));
  }
  return found;
};

const sizeOf = (paths) => {
  let total = 0;
  for (const p of paths) {
    if (!existsSync(p)) throw new Error(`referenced chunk is missing: ${p}`);
    total += statSync(p).size;
  }
  return total;
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

const fmt = (bytes) => (bytes / KB).toFixed(1);
const pad = (s, n) => String(s).padEnd(n);

let failed = false;

for (const b of BUDGETS) {
  if (!existsSync(b.html)) {
    console.log(`FAIL missing ${b.html}; run npm run build first`);
    process.exit(1);
  }
}

// Shared Next runtime: chunks referenced by all budgeted pages.
const perPage = BUDGETS.map((b) => chunksOf(b.html));
const runtime = new Set([...perPage[0]].filter((c) => perPage.every((s) => s.has(c))));
const runtimeBytes = sizeOf(runtime);

const rows = BUDGETS.map((b, i) => {
  const own = [...perPage[i]].filter((c) => !runtime.has(c));
  const bytes = sizeOf(own);
  const pass = bytes <= b.maxKB * KB;
  if (!pass) failed = true;
  return [b.label, `${fmt(bytes)} KB`, `${fmt(runtimeBytes)} KB`, `${b.maxKB} KB`, pass ? "PASS" : "FAIL"];
});

const head = ["route", "page-specific", "runtime", "budget", "result"];
const widths = head.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
const line = (r) => r.map((cell, c) => pad(cell, widths[c])).join("  ").trimEnd();
console.log(line(head));
console.log(widths.map((w) => "-".repeat(w)).join("  "));
for (const r of rows) console.log(line(r));

// Three.js and heightmap data may only be loaded by /map/.
const THREE_RE = /three[\w./@-]{0,40}\.module|THREE\.REVISION/;
const HEIGHTMAP_RE = /heightmap/i;
const pages = walk(OUT).filter((f) => f.endsWith("index.html") && f !== MAP_HTML);
const problems = [];
for (const page of pages) {
  const route = "/" + relative(OUT, page).split(sep).slice(0, -1).join("/");
  const sources = [page, ...chunksOf(page)];
  for (const src of sources) {
    const text = read(src);
    if (THREE_RE.test(text)) problems.push(`${route} loads three.js via ${src}`);
    if (HEIGHTMAP_RE.test(text)) problems.push(`${route} references heightmap via ${src}`);
  }
}
if (problems.length) {
  failed = true;
  console.log("");
  for (const p of problems) console.log(`FAIL ${p}`);
} else {
  console.log(`\nno three.js or heightmap outside /map/ (${pages.length} pages scanned)`);
}

process.exit(failed ? 1 : 0);
