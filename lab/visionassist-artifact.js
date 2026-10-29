const portraits = new Set();
const cleanup = new WeakMap();
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
let instance = 0;

function projectRoomPoint(horizontal, vertical, depth) {
  return { horizontal: 290 + 300 * horizontal / depth, vertical: 118 + 300 * (1.6 - vertical) / depth };
}

function chairDrawing() {
  const rotation = 0.22;
  const vertices = [];
  const floorContacts = [];
  const project = (horizontal, vertical, depth) => {
    const rotatedHorizontal = -0.84 + horizontal * Math.cos(rotation) + depth * Math.sin(rotation);
    const rotatedDepth = 2.55 - horizontal * Math.sin(rotation) + depth * Math.cos(rotation);
    return projectRoomPoint(rotatedHorizontal, vertical, rotatedDepth);
  };
  const polygon = (points, fill) => {
    const projected = points.map((point) => project(...point));
    vertices.push(...projected);
    return `<polygon points="${projected.map((point) => `${point.horizontal.toFixed(2)},${point.vertical.toFixed(2)}`).join(" ")}" fill="${fill}"/>`;
  };
  const timber = (left, right, bottom, top, front, back) => [
    polygon([[right,bottom,front],[right,bottom,back],[right,top,back],[right,top,front]], "#A38AAE"),
    polygon([[left,bottom,front],[right,bottom,front],[right,top,front],[left,top,front]], "#BDA5C9"),
    polygon([[left,top,front],[right,top,front],[right,top,back],[left,top,back]], "#DDCFE4"),
  ].join("");
  let structure = "";
  for (const horizontal of [-0.29, 0.29]) {
    for (const depth of [0.29, -0.29]) {
      floorContacts.push(project(horizontal, 0, depth));
      structure += timber(horizontal - 0.022, horizontal + 0.022, 0, depth > 0 ? 1.04 : 0.46, depth - 0.022, depth + 0.022);
    }
  }
  structure += timber(-0.29, 0.29, 0.17, 0.2, -0.3, -0.277);
  structure += timber(0.275, 0.3, 0.18, 0.205, -0.29, 0.29);
  structure += timber(-0.29, 0.29, 0.63, 1.025, 0.265, 0.315);
  structure += polygon([[-0.25,0.665,0.264],[0.25,0.665,0.264],[0.25,0.99,0.264],[-0.25,0.99,0.264]], "#D4C1DE");
  const grain = Array.from({ length: 15 }, (_, index) => {
    const horizontal = -0.22 + index * 0.0314;
    const lower = project(horizontal, 0.69, 0.263);
    const upper = project(horizontal, 0.97, 0.263);
    return `<path d="M${lower.horizontal.toFixed(2)} ${lower.vertical.toFixed(2)}L${upper.horizontal.toFixed(2)} ${upper.vertical.toFixed(2)}"/>`;
  }).join("");
  structure += `<g class="vision-timber-grain">${grain}</g>`;
  structure += timber(-0.335, 0.335, 0.395, 0.445, -0.32, -0.28);
  structure += timber(0.285, 0.33, 0.395, 0.445, -0.28, 0.28);
  structure += timber(-0.35, 0.35, 0.445, 0.49, -0.335, 0.335);
  structure += polygon([[-0.313,0.493,-0.3],[0.313,0.493,-0.3],[0.313,0.493,0.255],[-0.313,0.493,0.255]], "#DFC9D9");
  const shadows = floorContacts.map((point) => `<ellipse cx="${point.horizontal.toFixed(2)}" cy="${(point.vertical+0.4).toFixed(2)}" rx="6.5" ry="2.2" fill="#756080" opacity=".16"/>`).join("");
  const bounds = {
    left: Math.min(...vertices.map((point) => point.horizontal)) - 11,
    right: Math.max(...vertices.map((point) => point.horizontal)) + 11,
    top: Math.min(...vertices.map((point) => point.vertical)) - 11,
    bottom: Math.max(...vertices.map((point) => point.vertical)) + 10,
  };
  return { structure, shadows, bounds, floorContacts };
}

function roomDrawing(identifier) {
  const chair = chairDrawing();
  const bounds = chair.bounds;
  const cornerLength = 16;
  const corners = `M${bounds.left} ${bounds.top+cornerLength}V${bounds.top}H${bounds.left+cornerLength}M${bounds.right-cornerLength} ${bounds.top}H${bounds.right}V${bounds.top+cornerLength}M${bounds.left} ${bounds.bottom-cornerLength}V${bounds.bottom}H${bounds.left+cornerLength}M${bounds.right-cornerLength} ${bounds.bottom}H${bounds.right}V${bounds.bottom-cornerLength}`;
  return `<svg class="vision-room" viewBox="0 0 580 380" fill="none" role="img" aria-label="Illustrated camera view: a nearby chair is the priority obstacle. A standing person and a potted plant are farther back in the room.">
    <defs>
      <clipPath id="${identifier}-room"><rect x="21" y="23" width="538" height="334" rx="3"/></clipPath>
      <linearGradient id="${identifier}-floor" x1="290" y1="238" x2="290" y2="358" gradientUnits="userSpaceOnUse"><stop stop-color="#E6DFE7"/><stop offset="1" stop-color="#F7F0E5"/></linearGradient>
      <linearGradient id="${identifier}-pot" x1="437" y1="292" x2="473" y2="292" gradientUnits="userSpaceOnUse"><stop stop-color="#B49DAF"/><stop offset=".6" stop-color="#D7C2CE"/><stop offset="1" stop-color="#B9A1B5"/></linearGradient>
      <pattern id="${identifier}-wall" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#96839F" stroke-width=".45" opacity=".08"/></pattern>
    </defs>
    <g clip-path="url(#${identifier}-room)">
      <path d="M20 22L155 70H425L560 22V358H20Z" fill="#F4EEF0"/>
      <path d="M20 22L155 70V238L20 358Z" fill="#E4DAE8"/>
      <path d="M20 22L155 70V238L20 358Z" fill="url(#${identifier}-wall)"/>
      <path d="M425 70L560 22V358L425 238Z" fill="#EDE5EC"/>
      <path d="M155 238H425L560 358H20Z" fill="url(#${identifier}-floor)"/>
      <path d="M20 346L155 232H425L560 346V358L425 238H155L20 358Z" fill="#D1C6D7" opacity=".48"/>
      <g class="vision-room-lines"><path d="M155 70V238H425V70M20 22L155 70H425L560 22M20 358L155 238M425 238L560 358M20 346L155 232H425L560 346"/></g>
      <g class="vision-window">
        <path d="M246 92H315V197H246Z" fill="#DADCE9"/>
        <path d="M254 100H308V190H254Z" fill="#F7F4F4"/>
        <path d="M254 158L271 146L285 152L302 136L308 141V190H254Z" fill="#CFCDDE"/>
        <path d="M254 179L279 169L294 172L308 163V190H254Z" fill="#B7B3CD" opacity=".65"/>
        <path d="M246 92H315V197H246ZM280 96V193M249 145H312" stroke="#94829F" stroke-width="1"/>
        <path d="M243 198H318L323 203H243Z" fill="#CFC0D7" stroke="#9A88A7" stroke-width=".7"/>
        <path d="M251 97V192M284 98V192" stroke="#FFFBF5" stroke-width="1.2" opacity=".8"/>
      </g>
      <g class="vision-background-person" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="363" cy="258" rx="23" ry="4.4" fill="#89758F" opacity=".1"/>
        <ellipse cx="351" cy="258.3" rx="10" ry="2" fill="#796381" opacity=".12"/>
        <ellipse cx="376" cy="255.3" rx="10" ry="2" fill="#796381" opacity=".12"/>
        <path d="M364 187L375 188C378 201 376 215 376 224L379 251L370 254L364 225L359 204Z" fill="#887992"/>
        <path d="M350 187L365 188C365 201 363 213 360 225L357 254L347 254L350 223L348 205Z" fill="#9D8BA8"/>
        <path d="M355 198C358 203 357 211 355 222L352 248M369 200L371 220L375 247" stroke="#6F5C7B" stroke-width=".65" opacity=".38"/>
        <path d="M348 252L357 252L358 257C354 259 346 260 340 258L341 255Z" fill="#62536E"/>
        <path d="M370 250L378 250L384 254L384 257L370 256Z" fill="#62536E"/>
        <path d="M342 258L355 258M371 256L383 256" stroke="#DDD1DD" stroke-width=".7"/>
        <path d="M350 141C356 137 365 137 373 141L377 158L375 189C365 193 355 193 349 190L347 157Z" fill="#C4B7D1" stroke="#8E7A9D" stroke-width=".8"/>
        <path d="M349 144C346 148 344 158 343 169L342 190L347 192L351 171L354 151Z" fill="#B5A5C4" stroke="#8E7A9D" stroke-width=".75"/>
        <path d="M373 143C379 148 380 159 382 170L378 192L373 191L375 170L370 151Z" fill="#B9ABC8" stroke="#8E7A9D" stroke-width=".75"/>
        <path d="M342 190L347 192L346 200C342 202 340 199 341 197ZM374 191L379 192L378 200C375 202 372 199 373 196Z" fill="#D6C2C9"/>
        <path d="M358 131L369 130L370 140Q363 146 356 140Z" fill="#C8AFBB"/>
        <path d="M354 116C355 108 369 107 373 116L373 122L377 126L372 129L371 133C365 138 358 134 356 130Z" fill="#DDC8CA"/>
        <path d="M354 123C349 116 353 108 360 107C368 104 375 109 375 117L370 121L367 114L361 116L359 124L357 126Z" fill="#75617F"/>
        <path d="M358 125Q361 122 362 126" stroke="#AB8F9F" stroke-width=".65"/>
        <path d="M355 144Q363 148 371 142M353 183Q364 186 374 183" stroke="#907C9F" stroke-width=".7" opacity=".5"/>
      </g>
      <g class="vision-plant-shadow">
        <ellipse cx="458" cy="312" rx="25" ry="5" fill="#8B7894" opacity=".1"/>
        <ellipse cx="455" cy="310" rx="15" ry="2.8" fill="#796781" opacity=".12"/>
      </g>
      <g class="vision-plant" stroke-linecap="round" stroke-linejoin="round">
        <path d="M437 274L441 305Q455 314 469 305L473 274Z" fill="url(#${identifier}-pot)" stroke="#9F889F" stroke-width=".8"/>
        <path d="M443 284L446 303" stroke="#F0DFE3" stroke-width="1.2" opacity=".6"/>
        <ellipse cx="455" cy="274" rx="18" ry="5.1" fill="#D7C5D4" stroke="#9F889F" stroke-width=".8"/>
        <ellipse cx="455" cy="274" rx="14.5" ry="3.5" fill="#9D8A98"/>
        <g stroke="#7F8A81" stroke-width="1">
          <path d="M455 275C455 249 453 224 449 202M454 246L434 229M454 235L475 219M454 225L443 208M455 258L477 246"/>
          <path d="M449 214C436 208 435 190 443 181C455 189 459 205 449 214Z" fill="#BFC8BA"/>
          <path d="M456 231C459 212 476 205 488 205C485 223 470 232 456 231Z" fill="#ABB9AC"/>
          <path d="M452 244C435 244 423 230 424 218C439 219 450 230 452 244Z" fill="#CDD1C1"/>
          <path d="M455 258C461 242 480 237 490 242C482 256 469 261 455 258Z" fill="#B7C2B3"/>
          <path d="M453 263C439 263 431 253 431 245C443 245 451 254 453 263Z" fill="#ABB9AC"/>
        </g>
        <g stroke="#F0F0DE" stroke-width=".7" opacity=".65"><path d="M449 211L444 190M460 228L479 212M448 240L431 225M459 255L482 245M450 260L436 249"/></g>
        <path d="M437 274Q455 283 473 274" stroke="#A18A9F" stroke-width=".85"/>
      </g>
      <g class="vision-chair-shadow"><ellipse cx="177" cy="316" rx="58" ry="13" fill="#8A7397" opacity=".055"/>${chair.shadows}</g>
      <g class="vision-chair" stroke="#6C5279" stroke-width=".95" stroke-linecap="round" stroke-linejoin="round">${chair.structure}</g>
      <g class="vision-secondary-detection" stroke="#9B8BA9" stroke-width=".9"><path d="M335 123V99H352M378 99H395V123M335 240V266H352M378 266H395V240"/><text x="335" y="91">person</text></g>
      <g class="vision-priority-fill"><rect x="${bounds.left}" y="${bounds.top}" width="${bounds.right-bounds.left}" height="${bounds.bottom-bounds.top}" fill="#E9806509"/></g>
      <g class="vision-priority-corners" stroke="#C4553F" stroke-width="1.7"><path d="${corners}"/></g>
      <g class="vision-detection-label"><rect x="${bounds.left-1}" y="${bounds.top-26}" width="115" height="19" rx="2" fill="#FAF5ED"/><circle cx="${bounds.left+8}" cy="${bounds.top-16.5}" r="2" fill="#BB4938"/><text x="${bounds.left+16}" y="${bounds.top-13}">chair · est. 5 ft</text></g>
    </g>
    <path class="vision-viewfinder" d="M21 40V23H39M541 23H559V40M21 340V357H39M541 357H559V340"/>
    <path class="vision-priority-thread" d="M${bounds.left} ${bounds.bottom}L85 367H45"/>
  </svg>`;
}

export function createVisionAssistArtifact({ compact = false, motionPaused = paused } = {}) {
  const root = document.createElement("section");
  const identifier = `vision-portrait-${++instance}`;
  root.className = `project-artifact vision-portrait${compact ? " is-compact" : ""}`;
  root.setAttribute("aria-label", "VisionAssist: seeing obstacles, speaking what matters");
  root.innerHTML = `<div class="vision-masthead"><span>VisionAssist</span><span>A wearable lookout</span></div><div class="vision-scene-meta"><span>Illustrated camera view</span><span>Raspberry Pi 5 · Offline</span></div>${roomDrawing(identifier)}<div class="vision-voice"><div class="vision-voice-label"><svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M16 8C7 8 5 19 10 24L12 26V34H18V22C25 19 25 8 16 8Z"/><path d="M12 14C14 11 19 12 19 16C19 20 14 21 12 18M29 13Q35 20 29 27M26 17Q29 20 26 23"/></svg><span>One priority. One warning.</span><span class="vision-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div><p class="vision-warning">Stop<span>.</span></p><p class="vision-phrase">Chair, 2 steps ahead.</p></div><div class="vision-footnote"><span>Camera → risk priority → offline speech</span><span>Illustrated scenario · distances are estimates</span></div>`;
  let visible = true;
  let localPaused = motionPaused;
  const sync = () => root.classList.toggle("is-animating", visible && !localPaused && !document.hidden);
  const record = { setPaused(value) { localPaused = value; sync(); } };
  portraits.add(record);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(root);
  document.addEventListener("visibilitychange", sync);
  cleanup.set(root, () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", sync);
    portraits.delete(record);
    root.classList.remove("is-animating");
  });
  sync();
  return root;
}

export function releaseVisionAssistArtifact(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}

export function setVisionAssistPaused(value) {
  paused = value;
  portraits.forEach((portrait) => portrait.setPaused(value));
}
