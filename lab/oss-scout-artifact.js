// OSS Scout: a night-to-morning plate read left to right. Issues are sifted and ranked,
// one tested draft is prepared, every GitHub write the agent tries turns back at the guard,
// and only the morning tap opens act.yml, the one gate that writes upstream.
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const records = new Set();
const cleanup = new WeakMap();
let instance = 0;

// Open issues scattered across the night sky. Fixed positions keep the plate stable.
const ISSUES = [
  [22, 58], [38, 48], [55, 62], [71, 50], [88, 57], [104, 47], [30, 74], [47, 84], [63, 76], [80, 87],
  [96, 73], [112, 82], [20, 92], [39, 101], [56, 96], [74, 104], [91, 98], [108, 106], [28, 113], [118, 62],
  [126, 96], [14, 76], [66, 40], [99, 38],
];
// The few that fall through the sieve: [index into ISSUES, delay in seconds].
const FALLING = [[2, 0], [9, 0.45], [16, 0.9], [7, 1.3]];
const STARS = [[150, 22, 1], [176, 58, 0.8], [196, 82, 0.7], [138, 40, 0.6], [234, 30, 0.9], [258, 18, 0.6], [222, 70, 0.5], [128, 18, 0.7], [282, 44, 0.5], [246, 112, 0.5]];

function issueGlyph([x, y], extra = "") {
  return `<g class="scout-issue${extra}" transform="translate(${x} ${y})"><circle r="3.1"/><circle r=".95" class="scout-issue-dot"/></g>`;
}

function plate(id) {
  const issues = ISSUES.map((point, index) => issueGlyph(point, FALLING.some(([fall]) => fall === index) ? " is-picked" : "")).join("");
  const falling = FALLING.map(([index, delay]) => {
    const [x, y] = ISSUES[index];
    return `<g class="scout-fall" style="--dx:${68 - x}px;--dy:${168 - y}px;animation-delay:${delay}s">${issueGlyph([x, y])}</g>`;
  }).join("");
  const stars = STARS.map(([x, y, r], index) => `<circle class="scout-star" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${(index * 0.83) % 4}s"/>`).join("");
  const bricks = Array.from({ length: 19 }, (_, index) => `<path d="M384 ${36 + index * 10}H400"/>`).join("");
  return `<svg class="scout-scene" viewBox="0 0 480 300" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-sky" x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#120E30"/><stop offset=".3" stop-color="#1B1544"/><stop offset=".52" stop-color="#2F2662"/><stop offset=".68" stop-color="#5E4F92"/><stop offset=".8" stop-color="#A88CB8"/><stop offset=".91" stop-color="#EDB2A4"/><stop offset="1" stop-color="#FFD5C2"/></linearGradient>
      <linearGradient id="${id}-ground" x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="#0D0A26"/><stop offset=".55" stop-color="#191340"/><stop offset="1" stop-color="#3B3170"/></linearGradient>
      <radialGradient id="${id}-glow" cx="452" cy="258" r="150" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8B6E" stop-opacity=".75"/><stop offset=".45" stop-color="#FF9A7E" stop-opacity=".22"/><stop offset="1" stop-color="#FF9A7E" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}-sun" cx="452" cy="250" r="34" gradientUnits="userSpaceOnUse"><stop stop-color="#FFE1CF"/><stop offset=".6" stop-color="#FF9878"/><stop offset="1" stop-color="#FF6F55"/></radialGradient>
      <radialGradient id="${id}-lamp" cx="153" cy="160" r="62" gradientUnits="userSpaceOnUse"><stop stop-color="#FFE7D6" stop-opacity=".32"/><stop offset="1" stop-color="#FFE7D6" stop-opacity="0"/></radialGradient>
      <marker id="${id}-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L7 4L1 7" stroke="#FF8A74" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></marker>
    </defs>
    <rect width="480" height="300" fill="url(#${id}-sky)"/>
    <g class="scout-sunrise"><rect width="480" height="300" fill="url(#${id}-glow)"/><circle cx="452" cy="258" r="34" fill="url(#${id}-sun)"/></g>
    <g class="scout-stars">${stars}</g>
    <path class="scout-moon" d="M214 22A13 13 0 1 0 226 41A10 10 0 1 1 214 22Z"/>

    <text x="16" y="25" class="scout-label scout-label-night">SCAN</text>
    <text x="16" y="37" class="scout-sub scout-sub-night">NIGHTLY · NO AI</text>
    <g class="scout-issues">${issues}</g>
    <g class="scout-falling">${falling}</g>
    <path class="scout-sieve" d="M12 122L58 164V172M124 122L78 164V172"/>
    <path class="scout-sieve-mesh" d="M20 129H116M28 137H108M36 145H100M44 153H92"/>
    <g class="scout-ranks">
      <rect class="scout-rank scout-rank-top" x="34" y="180" width="66" height="5" rx="2.5"/>
      <rect class="scout-rank" x="34" y="192" width="50" height="5" rx="2.5"/>
      <rect class="scout-rank" x="34" y="204" width="36" height="5" rx="2.5"/>
    </g>
    <text x="16" y="228" class="scout-sub scout-sub-night">FRIENDLIEST PROJECTS FIRST</text>
    <path class="scout-handoff" d="M102 182C112 182 114 166 124 164"/>

    <rect x="88" y="96" width="132" height="132" fill="url(#${id}-lamp)" class="scout-lamp"/>
    <text x="124" y="104" class="scout-label scout-label-night">PREPARE</text>
    <text x="124" y="116" class="scout-sub scout-sub-night">ONE TESTED DRAFT</text>
    <g class="scout-draft" transform="rotate(-3 153 161)">
      <rect x="124" y="124" width="58" height="74" rx="3" class="scout-paper"/>
      <path d="M124 136H182" class="scout-paper-rule"/>
      <text x="130" y="133" class="scout-card-kicker">DRAFT FIX</text>
      <g class="scout-diff"><path d="M130 146H164" class="is-minus"/><path d="M130 154H172" class="is-plus"/><path d="M130 162H158" class="is-plus"/><path d="M130 170H168"/></g>
      <path d="M130 186L133 189L139 182" class="scout-check"/>
      <text x="143" y="189" class="scout-card-kicker">TESTED</text>
    </g>

    <g class="scout-attempt">
      <path class="scout-attempt-path" pathLength="100" marker-end="url(#${id}-head)" d="M182 140C222 96 290 46 380 50"/>
      <path class="scout-bounce" marker-end="url(#${id}-head)" d="M379 55C364 58 352 66 344 77"/>
      <g transform="translate(383 50)"><g class="scout-impact"><path d="M-4 -10L-1.5 -4.5M-9 -2H-3.5M-4 8L-1.5 3"/></g></g>
      <g transform="translate(305 58)" class="scout-chip"><rect x="-30" y="-9" width="60" height="18" rx="9"/><text y="3.4">git push</text></g>
    </g>
    <g class="scout-attempt scout-attempt-late">
      <path class="scout-attempt-path" pathLength="100" marker-end="url(#${id}-head)" d="M182 162C226 116 296 84 380 88"/>
      <path class="scout-bounce" marker-end="url(#${id}-head)" d="M379 93C366 96 356 103 350 113"/>
      <g transform="translate(383 88)"><g class="scout-impact"><path d="M-4 -10L-1.5 -4.5M-9 -2H-3.5M-4 8L-1.5 3"/></g></g>
      <g transform="translate(314 92)" class="scout-chip"><rect x="-40" y="-9" width="80" height="18" rx="9"/><text y="3.4">gh pr create</text></g>
    </g>

    <g class="scout-wall">
      <rect x="384" y="26" width="16" height="188" class="scout-wall-body"/>
      <g class="scout-wall-bricks">${bricks}</g>
      <rect x="381" y="22" width="22" height="6" rx="1" class="scout-wall-cap"/>
      <text transform="translate(395.4 120) rotate(-90)" class="scout-wall-text">GUARD HOOK</text>
    </g>
    <text x="392" y="14" class="scout-sub scout-sub-dawn" text-anchor="middle">NO GITHUB WRITES</text>

    <path class="scout-route" d="M153 199V240H384"/>
    <path class="scout-route-open" d="M400 240H433"/>

    <text x="296" y="121" class="scout-label scout-label-night">REVIEW</text>
    <text x="296" y="132" class="scout-sub scout-sub-review">8 AM, PRIVATE</text>
    <g class="scout-phone">
      <rect x="296" y="136" width="58" height="92" rx="9" class="scout-phone-body"/>
      <path d="M318 142H332" class="scout-phone-notch"/>
      <text x="303" y="157" class="scout-phone-kicker">BRIEFING</text>
      <path d="M303 165H340M303 172H333" class="scout-phone-lines"/>
      <g class="scout-phone-card"><rect x="302" y="179" width="46" height="18" rx="2"/><path d="M306 186H336M306 191H326"/></g>
      <rect x="302" y="204" width="46" height="16" rx="8" class="scout-approve"/>
      <text x="325" y="215" class="scout-approve-text" text-anchor="middle">Approve</text>
    </g>
    <circle cx="325" cy="212" r="13" class="scout-ripple"/>
    <circle cx="325" cy="212" r="20" class="scout-ripple scout-ripple-late"/>
    <path class="scout-signal" d="M349 212C366 212 372 220 382 226"/>

    <rect x="0" y="258" width="480" height="42" fill="url(#${id}-ground)"/>
    <path d="M0 258.5H480" class="scout-horizon"/>
    <g class="scout-gate">
      <rect x="383" y="213" width="18" height="46" class="scout-gate-frame"/>
      <rect x="384.5" y="214.5" width="15" height="43" class="scout-gate-door"/>
    </g>
    <path d="M384 259V266H400V259" class="scout-wall-base"/>

    <g class="scout-pr"><g class="scout-pr-move"><rect x="-14" y="-8" width="28" height="16" rx="8"/><text y="3">PR</text></g></g>
    <g class="scout-track" transform="translate(446 240)">
      <circle r="14" class="scout-node"/>
      <g class="scout-merge"><circle cx="-4" cy="-6" r="2.3"/><circle cx="-4" cy="6" r="2.3"/><circle cx="5" cy="0" r="2.3"/><path d="M-4 -3.7V3.7M-4 -3.7C-4 0 -1 0 2.7 0"/></g>
    </g>

    <text x="377" y="278" class="scout-label scout-label-night" text-anchor="end">ACT</text>
    <text x="377" y="290" class="scout-sub scout-sub-code" text-anchor="end">act.yml</text>
    <text x="409" y="278" class="scout-label scout-label-night">TRACK</text>
    <text x="409" y="290" class="scout-sub scout-sub-night">FROM GITHUB</text>
  </svg>`;
}

export function createScoutArtifact() {
  const id = `scout-${++instance}`;
  const root = document.createElement("figure");
  root.className = "scout-art";
  root.setAttribute("role", "img");
  root.setAttribute("aria-label", "OSS Scout, from night to morning: a nightly scan sifts open beginner-friendly issues and ranks the friendliest projects first. An agent prepares one tested draft fix. Its attempts to write to GitHub, such as git push and gh pr create, are turned back by a guard hook. At 8 am I review it privately, and one tap on Approve opens act.yml, the only path that writes to GitHub. Status is then tracked from GitHub.");
  root.innerHTML = `<div class="scout-masthead" aria-hidden="true"><span>OSS Scout</span><span>Nightly scout · human in charge</span></div>
    <div class="scout-plate" aria-hidden="true">${plate(id)}</div>
    <figcaption class="scout-caption" aria-hidden="true"><p>Does the night shift.<br><em>Waits for my tap.</em></p><span>One gate writes<br>to GitHub</span></figcaption>`;
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

export function setScoutPaused(value) {
  paused = value;
  records.forEach((record) => record.sync());
}

export function releaseScoutArtifact(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}
