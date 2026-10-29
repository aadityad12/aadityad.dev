// ALTA: "from the breadboard to the voice."
// The probe pod reads the student's board, the serial stream carries the reading,
// and ALTA turns it into a question instead of an answer. One looping teaching moment:
// measure, ask, point at the spot, confirm the fix.

const portraits = new Set();
const cleanup = new WeakMap();
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
let instance = 0;

const TICK = 400;
const LOOP = 13600;
const BEATS = [
  { key: "measure", at: 0, label: "Measure" },
  { key: "ask", at: 3200, label: "Ask" },
  { key: "point", at: 6400, label: "Point" },
  { key: "confirm", at: 10000, label: "Confirm" },
];
const STUDENT_AT = 5200;
const FLIP_AT = 9200;
const SETTLE_AT = 10000;
const FADE_AT = 13200;
const QUOTES = {
  measure: "Put the yellow probe where the resistor meets the LED.",
  ask: "Yellow reads <b>5.01 V</b>. What does that tell you about the current?",
  point: "Right, so no current is flowing. Check which way the LED faces.",
  confirm: "About <b>2 V</b> now. Current is flowing, and your LED is lit.",
};

const P = 14;
const column = (index) => 50 + P * index;
const ROWS = { a: 92, b: 106, c: 120, d: 134, e: 148, f: 178, g: 192, h: 206, i: 220, j: 234 };
const NODE = column(7);
const LED_CENTER = 163;

function holes() {
  let marks = "";
  for (const [letter, vertical] of Object.entries(ROWS)) {
    marks += `<text x="38" y="${vertical + 2.6}" class="alta-board-index">${letter}</text>`;
    for (let index = 0; index < 20; index++) marks += `<rect x="${column(index) - 1.9}" y="${vertical - 1.9}" width="3.8" height="3.8" rx=".8"/>`;
  }
  for (const vertical of [52, 66, 252, 266]) {
    for (let index = 0; index < 20; index++) if (index % 6 !== 5) marks += `<rect x="${column(index) - 1.9}" y="${vertical - 1.9}" width="3.8" height="3.8" rx=".8"/>`;
  }
  const numbers = [0, 4, 9, 14, 19].map((index) => `<text x="${column(index)}" y="84" text-anchor="middle" class="alta-board-index">${index + 1}</text>`).join("");
  return `<g class="alta-holes">${marks}</g>${numbers}`;
}

function jumper(fromX, fromY, toX, toY, colour, edge) {
  return `<g class="alta-jumper"><path d="M${fromX} ${fromY}L${toX} ${toY}" stroke="#A9A4C2" stroke-width="1.6" stroke-linecap="round"/><path d="M${fromX} ${fromY + 4.5}L${toX} ${toY - 4.5}" stroke="${edge}" stroke-width="6" stroke-linecap="round"/><path d="M${fromX} ${fromY + 4.5}L${toX} ${toY - 4.5}" stroke="${colour}" stroke-width="4.4" stroke-linecap="round"/><path d="M${fromX - 1} ${fromY + 5.5}L${toX - 1} ${toY - 5.5}" stroke="#FFFFFF" stroke-width=".8" stroke-linecap="round" opacity=".35"/></g>`;
}

function resistor(centerX, centerY, length, bands, vertical = false, height = 10) {
  const half = height / 2;
  const body = `<rect x="${-length / 2}" y="${-half}" width="${length}" height="${height}" rx="${half}" fill="#E9D8B6" stroke="#BCA37C" stroke-width=".8"/><path d="M${-length / 2 + half - 1} ${-half * 0.62}H${length / 2 - half + 1}" stroke="#FFFFFF" stroke-width=".9" opacity=".55"/>`;
  const step = length / (bands.length + 2.2);
  const stripes = bands.map((colour, index) => `<rect x="${-length / 2 + step * (index + 0.9) + (index === bands.length - 1 ? step * 0.6 : 0)}" y="${-half}" width="${step * 0.55}" height="${height}" fill="${colour}"/>`).join("");
  return `<g transform="translate(${centerX} ${centerY})${vertical ? " rotate(90)" : ""}">${body}${stripes}</g>`;
}

function breadboard(identifier) {
  return `<g class="alta-board">
    <rect x="33" y="40" width="306" height="246" rx="7" fill="#211946" opacity=".05"/>
    <rect x="30" y="36" width="306" height="246" rx="7" fill="#FBFAFE" stroke="#D3CDE8" stroke-width="1"/>
    <path d="M37 40H329" stroke="#FFFFFF" stroke-width="1.2"/>
    <path d="M44 44H322M44 274H322" stroke="#E0907F" stroke-width=".9" opacity=".8"/>
    <path d="M44 74H322M44 244H322" stroke="#8F95CF" stroke-width=".9" opacity=".8"/>
    <text x="38" y="54.6" class="alta-board-index">+</text><text x="38" y="68.6" class="alta-board-index">−</text>
    <text x="38" y="254.6" class="alta-board-index">−</text><text x="38" y="268.6" class="alta-board-index">+</text>
    <rect x="30" y="158" width="306" height="10" fill="#ECE9F6"/>
    <path d="M30 158H336M30 168H336" stroke="#DCD6EE" stroke-width=".8"/>
    ${holes()}
    ${jumper(column(2), 52, column(2), ROWS.a, "#C2604F", "#9A4436")}
    <path d="M${column(2)} ${ROWS.c}H${NODE}" stroke="#A9A4C2" stroke-width="1.5" stroke-linecap="round"/>
    ${resistor((column(2) + NODE) / 2, ROWS.c, 36, ["#B8483C", "#B8483C", "#7A4B33", "#C9A24A"])}
    <g class="alta-led-glow"><circle cx="${NODE}" cy="${LED_CENTER}" r="34" fill="url(#${identifier}-glow)"/></g>
    <path d="M${NODE} ${ROWS.e}V${ROWS.f}" stroke="#A9A4C2" stroke-width="1.5" stroke-linecap="round"/>
    <g class="alta-led"><g class="alta-led-body">
      <path d="M${NODE - 9.9} ${LED_CENTER - 6}A12 12 0 1 0 ${NODE + 9.9} ${LED_CENTER - 6}Z" fill="#F2C5BE" stroke="#C98C82" stroke-width=".9"/>
      <circle cx="${NODE}" cy="${LED_CENTER}" r="8.4" class="alta-led-dome" fill="#F7DAD4" stroke="#D49C92" stroke-width=".7"/>
      <path d="M${NODE - 4.5} ${LED_CENTER - 3}Q${NODE - 2} ${LED_CENTER - 6} ${NODE + 1.5} ${LED_CENTER - 5.5}" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>
    </g></g>
    ${jumper(NODE, ROWS.h, NODE, 252, "#5B5487", "#433C6E")}
  </g>`;
}

function probeWire(path, colour, edge, className = "") {
  return `<g class="alta-wire ${className}"><path d="${path}" stroke="${edge}" stroke-width="4.6" stroke-linecap="round"/><path d="${path}" stroke="${colour}" stroke-width="3.2" stroke-linecap="round"/></g>`;
}

function plug(x, y, colour, edge, rotation = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="-3.6" y="-17" width="7.2" height="15" rx="1.4" fill="${colour}" stroke="${edge}" stroke-width=".8"/><path d="M-1.6 -15V-5" stroke="#FFFFFF" stroke-width=".7" opacity=".45"/><path d="M0 -2V1" stroke="#8F89AE" stroke-width="1.5" stroke-linecap="round"/></g>`;
}

function pod() {
  const left = 404;
  const top = 34;
  const header = (x, y, count, label) => `<rect x="${x - 4}" y="${y - 4.5}" width="8" height="${count * 9}" rx="1" fill="#2A2540"/>${Array.from({ length: count }, (_, index) => `<rect x="${x - 1.4}" y="${y - 1.4 + index * 9}" width="2.8" height="2.8" fill="#6E6890"/>`).join("")}${label || ""}`;
  const pins = Array.from({ length: 14 }, (_, index) => `<rect x="436.5" y="${119 + index * 6.8}" width="3" height="2.6" fill="#BDB8D2"/><rect x="460.5" y="${119 + index * 6.8}" width="3" height="2.6" fill="#BDB8D2"/>`).join("");
  return `<g class="alta-pod">
    <rect x="${left + 3}" y="${top + 4}" width="150" height="194" rx="6" fill="#211946" opacity=".07"/>
    <rect x="${left}" y="${top}" width="150" height="194" rx="6" fill="#4A8790" stroke="#336A73" stroke-width="1"/>
    <path d="M${left + 6} ${top + 3}H${left + 144}" stroke="#7DB1B8" stroke-width="1" opacity=".6"/>
    <g fill="#E6E3F3" opacity=".9"><circle cx="${left + 12}" cy="${top + 74}" r="3.2"/><circle cx="${left + 138}" cy="${top + 12}" r="3.2"/><circle cx="${left + 138}" cy="${top + 184}" r="3.2"/><circle cx="${left + 14}" cy="${top + 184}" r="3.2"/></g>
    <rect x="${left + 10}" y="${top - 10}" width="30" height="36" rx="2" fill="#2A2540"/><rect x="${left + 16}" y="${top - 4}" width="18" height="10" rx="5" fill="#463F68"/>
    <rect x="${left + 82}" y="${top - 12}" width="42" height="44" rx="2" fill="#C9C5DA" stroke="#8F8AA8" stroke-width=".9"/><rect x="${left + 90}" y="${top - 6}" width="26" height="22" rx="2" fill="#A7A2BE"/><path d="M${left + 84} ${top + 26}H${left + 122}" stroke="#E9E7F2" stroke-width=".8"/>
    <rect x="${left + 54}" y="${top + 10}" width="12" height="12" rx="1.5" fill="#D8D5E6" stroke="#8F8AA8" stroke-width=".7"/><circle cx="${left + 60}" cy="${top + 16}" r="3.3" fill="#7B4D58"/>
    <text x="${left + 20}" y="${top + 54}" class="alta-silk alta-silk-strong">PROBE POD</text>
    <text x="${left + 20}" y="${top + 65}" class="alta-silk">UNO R3</text>
    <rect x="${left + 52}" y="${top + 72}" width="18" height="7" rx="3.5" fill="#D9D6E8" stroke="#8F8AA8" stroke-width=".6"/>
    ${header(left + 8, 96, 7)}
    ${header(left + 8, 162, 6)}
    <text x="${left + 17}" y="164.6" class="alta-silk">A0</text><text x="${left + 17}" y="173.6" class="alta-silk">A1</text><text x="${left + 17}" y="182.6" class="alta-silk">A2</text><text x="${left + 17}" y="191.6" class="alta-silk">A3</text>
    <text x="${left + 17}" y="121.6" class="alta-silk">5V</text><text x="${left + 17}" y="130.6" class="alta-silk">GND</text>
    ${header(left + 142, 70, 10)}
    ${header(left + 142, 166, 8)}
    ${pins}
    <rect x="439" y="114" width="22" height="100" rx="1.6" fill="#2A2540"/>
    <path d="M446 114A4 4 0 0 0 454 114" fill="#463F68"/>
    <text transform="translate(452.6 164) rotate(-90)" text-anchor="middle" class="alta-chip">ATMEGA328P</text>
    <g class="alta-status"><circle cx="${left + 116}" cy="156" r="9" class="alta-status-halo"/><circle cx="${left + 116}" cy="156" r="5" fill="#F4EEF6" stroke="#B8B2CE" stroke-width=".8"/><circle cx="${left + 116}" cy="156" r="2.8" class="alta-status-core"/></g>
    <text x="${left + 116}" y="174" text-anchor="middle" class="alta-silk">STATUS</text>
    <g class="alta-talk"><rect x="${left + 106}" y="186" width="20" height="20" rx="2" fill="#2A2540"/><circle cx="${left + 116}" cy="196" r="6" class="alta-talk-cap"/></g>
    <text x="${left + 116}" y="218" text-anchor="middle" class="alta-silk">TALK</text>
  </g>`;
}

function probes() {
  const yellow = `M391 162C344 162 344 30 252 28C190 27 150 44 ${NODE} 76`;
  const spare = [
    { y: 171, colour: "#7286C6", edge: "#53639F", path: "M391 171C360 171 362 256 398 256H436", tip: [453, 256] },
    { y: 180, colour: "#80A98D", edge: "#5D836A", path: "M391 180C368 180 370 267 408 267H476", tip: [493, 267] },
    { y: 189, colour: "#F5F3FA", edge: "#B7B0D2", path: "M391 189C376 189 378 278 418 278H516", tip: [533, 278] },
  ];
  const resistors = [162, 171, 180, 189].map((y) => resistor(384, y, 17, ["#7A4B33", "#2A2540", "#D27E3C"], false, 7.4)).join("");
  const leads = [162, 171, 180, 189].map((y) => `<path d="M392 ${y}H412" stroke="#A9A4C2" stroke-width="1.3"/>`).join("");
  return `<g class="alta-probes">
    ${leads}
    ${spare.map(({ colour, edge, path }) => probeWire(path, colour, edge, "alta-spare")).join("")}
    ${spare.map(({ colour, edge, tip }) => plug(tip[0], tip[1], colour, edge, -90)).join("")}
    ${probeWire(yellow, "#E3B23C", "#B4862A", "alta-yellow")}
    <g class="alta-yellow-plug">${plug(NODE, ROWS.a, "#E3B23C", "#B4862A")}</g>
    ${resistors}
  </g>`;
}

function marks() {
  return `<g class="alta-probe-ping"><circle cx="${NODE}" cy="${ROWS.a}" r="7"/><circle cx="${NODE}" cy="${ROWS.a}" r="13" opacity=".45"/></g>
    <g class="alta-reading">
      <path d="M${NODE + 9} ${ROWS.a + 4}L182 114" class="alta-leader"/>
      <rect x="182" y="99" width="134" height="30" rx="4" fill="#FBFAFE" stroke="#D7D1EA" stroke-width=".9"/>
      <circle cx="195" cy="114" r="3.6" fill="#E3B23C" stroke="#B4862A" stroke-width=".7"/>
      <text x="205" y="117.4" class="alta-tag-label">YELLOW</text>
      <text x="306" y="119.4" text-anchor="end" class="alta-tag-value"><tspan class="alta-value-high">5.01 V</tspan><tspan class="alta-value-low">2.01 V</tspan></text>
    </g>
    <g class="alta-spot">
      <circle cx="${NODE}" cy="${LED_CENTER}" r="19" class="alta-spot-ring"/>
      <path d="M${NODE + 20} ${LED_CENTER + 5}L182 196" class="alta-leader alta-leader-coral"/>
      <rect x="182" y="184" width="134" height="25" rx="4" fill="#FBFAFE" stroke="#F0B3A9" stroke-width=".9"/>
      <text x="249" y="200.2" text-anchor="middle" class="alta-spot-label">WHICH WAY IT FACES</text>
    </g>`;
}

function sceneDrawing(identifier) {
  return `<svg class="alta-scene" viewBox="0 16 580 278" fill="none" aria-hidden="true">
    <defs><radialGradient id="${identifier}-glow"><stop stop-color="#FF5A47" stop-opacity=".55"/><stop offset=".45" stop-color="#FF5A47" stop-opacity=".18"/><stop offset="1" stop-color="#FF5A47" stop-opacity="0"/></radialGradient></defs>
    ${breadboard(identifier)}
    ${pod()}
    ${probes()}
    ${marks()}
  </svg>`;
}

function noise(seed, salt) {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function streamLine(sequence, millivolts, button) {
  let mean = millivolts + Math.round(noise(sequence, 1) * 6 - 3);
  let low = mean - 4 - Math.round(noise(sequence, 2) * 4);
  let high = mean + 4 + Math.round(noise(sequence, 3) * 4);
  if (millivolts === 5010 && sequence % 5 === 2) [mean, low, high] = [5010, 5004, 5017];
  const supply = 5011 + Math.round(noise(sequence, 4) * 3);
  const key = (name) => `<i>"${name}"</i>:`;
  return `<span class="alta-line${button ? " is-talking" : ""}">{${`<span class="alta-time">${key("t")}${18450 + sequence * 50},</span>`}${key("p")}{${key("y")}{${key("mean")}<b>${mean}</b>,${key("min")}${low},${key("max")}${high}}<span class="alta-rest">,…</span>},${key("vcc")}${supply},${key("btn")}<span class="alta-button">${button}</span>}</span>`;
}

function stateAt(clock) {
  const beat = [...BEATS].reverse().find((candidate) => clock >= candidate.at);
  return {
    beat: beat.key,
    button: clock >= STUDENT_AT && clock < BEATS[2].at ? 1 : 0,
    student: clock >= STUDENT_AT && clock < BEATS[2].at,
    flipped: clock >= FLIP_AT,
    lit: clock >= SETTLE_AT,
    millivolts: clock >= SETTLE_AT ? 2010 : 5010,
    fading: clock >= FADE_AT,
  };
}

export function createAltaArtifact({ motionPaused = paused } = {}) {
  const identifier = `alta-portrait-${++instance}`;
  const root = document.createElement("section");
  root.className = "project-artifact alta-portrait";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "ALTA, an AI lab teaching assistant for intro electronics. A probe pod measures the student's breadboard: the yellow probe reads 5.01 volts where about 2 volts is expected. ALTA asks what that says about the current, points to the LED, and once the LED is turned around the reading drops to about 2 volts and the LED lights. The pod runs bare-metal C on an ATmega328P and samples each probe about 1,200 times a second.");
  root.innerHTML = `<div class="alta-masthead"><span>ALTA<span class="alta-wide"> · AI lab teaching assistant</span></span><span>Lab 1 · LED and 220 Ω<span class="alta-wide"> resistor</span></span></div>
    ${sceneDrawing(identifier)}
    <div class="alta-stream"><div class="alta-stream-head"><span>Pod serial stream</span><span>one JSON line every 50 ms · slowed, illustrative</span></div><div class="alta-stream-lines" data-lines></div></div>
    <div class="alta-voice">
      <div class="alta-voice-head"><span class="alta-voice-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10H8L13 6V18L8 14H4ZM16.5 9Q19 12 16.5 15M19 7Q23 12 19 17"/></svg><span class="alta-speaker">ALTA, by voice</span><span class="alta-reply">Student holds Talk: <q>There isn’t any?</q></span></span><ol class="alta-steps">${BEATS.map((beat) => `<li data-step="${beat.key}">${beat.label}</li>`).join("")}</ol></div>
      <p class="alta-quote" data-quote></p>
    </div>
    <div class="alta-footer"><p>Measures the board. <em>Teaches the fix.</em></p><span>bare-metal C · ATmega328P<br>1,200 samples/s per probe</span></div>`;

  const lines = root.querySelector("[data-lines]");
  const quote = root.querySelector("[data-quote]");
  let clock = 0;
  let sequence = 0;
  let beat = "";
  let timer = 0;
  let swapTimer = 0;
  let visible = true;
  let localPaused = motionPaused;
  let buffer = [];

  function setQuote(key, animate) {
    clearTimeout(swapTimer);
    if (!animate) {
      quote.innerHTML = QUOTES[key];
      quote.classList.remove("is-swapping");
      return;
    }
    quote.classList.add("is-swapping");
    swapTimer = setTimeout(() => { quote.innerHTML = QUOTES[key]; quote.classList.remove("is-swapping"); }, 240);
  }

  function push(state) {
    buffer.push(streamLine(sequence++, state.millivolts, state.button));
    buffer = buffer.slice(-3);
    lines.innerHTML = buffer.join("");
  }

  function apply(state, animate) {
    root.dataset.beat = state.beat;
    root.classList.toggle("is-flipped", state.flipped);
    root.classList.toggle("is-lit", state.lit);
    root.classList.toggle("is-talking", Boolean(state.button));
    root.classList.toggle("has-student", state.student);
    root.classList.toggle("is-fading", state.fading);
    const order = BEATS.findIndex((candidate) => candidate.key === state.beat);
    root.querySelectorAll("[data-step]").forEach((step, index) => {
      step.classList.toggle("is-current", index === order);
      step.classList.toggle("is-done", index < order);
    });
    if (state.beat !== beat) { beat = state.beat; setQuote(beat, animate); }
  }

  function tick() {
    clock += TICK;
    if (clock >= LOOP) {
      clock = 0;
      buffer = [];
      root.classList.add("is-resetting");
      apply(stateAt(0), true);
      void root.offsetWidth;
      root.classList.remove("is-resetting");
    } else apply(stateAt(clock), true);
    push(stateAt(clock));
  }

  function sync() {
    const running = visible && !localPaused && !document.hidden;
    root.classList.toggle("is-animating", running);
    if (running && !timer) timer = setInterval(tick, TICK);
    if (!running && timer) { clearInterval(timer); timer = 0; }
  }

  // Opening state: the teaching moment itself, so a still frame (or reduced motion) still tells the story.
  clock = BEATS[1].at;
  for (let index = 0; index < 3; index++) push({ millivolts: 5010, button: 0 });
  apply(stateAt(clock), false);

  const record = { setPaused(value) { localPaused = value; sync(); } };
  portraits.add(record);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(root);
  document.addEventListener("visibilitychange", sync);
  cleanup.set(root, () => {
    clearInterval(timer);
    clearTimeout(swapTimer);
    timer = 0;
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    portraits.delete(record);
    root.classList.remove("is-animating");
  });
  sync();
  return root;
}

export function setAltaPaused(value) {
  paused = value;
  portraits.forEach((portrait) => portrait.setPaused(value));
}

export function releaseAltaArtifact(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}
