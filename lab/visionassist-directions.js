export const VISION_DIRECTIONS = [
  { key: "attention", number: "01", name: "A field of attention", premise: "The work is deciding what not to say.", description: "Treat detections as cropped object studies. Three observations stay visible; only the higher-risk chair earns the spoken channel.", strength: "Puts prioritization—the software decision—at the centre.", tension: "More conceptual than literal; the surrounding project copy still matters." },
  { key: "object", number: "02", name: "The handmade machine", premise: "A physical build, not another app.", description: "An object portrait drawn from the real enclosure, fan, camera board, and ribbon. No invented headband or polished consumer-product redesign.", strength: "Gives the embedded work a tangible, recognizable hero.", tension: "Says more about what was built than how it chooses a warning." },
  { key: "quiet", number: "03", name: "Quiet is part of it", premise: "A useful interruption, not a commentary.", description: "A temporal portrait: ongoing scene analysis, a stretch of silence, one warning, then quiet again. Dark editorial treatment, without terminal chrome.", strength: "Makes restraint—and the user’s audio channel—the subject.", tension: "The boldest departure from the paper palette; risks being too abstract." },
];
let instance = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const records = new Set();
const cleanup = new WeakMap();

const CHAIR_SPECIMEN = "<polygon points=\"180.97,285.25 183.57,282.78 183.57,175.67 180.97,176.54\" fill=\"#A38AAE\"/><polygon points=\"176.86,284.69 180.97,285.25 180.97,176.54 176.86,176.34\" fill=\"#BDA5C9\"/><polygon points=\"176.86,176.34 180.97,176.54 183.57,175.67 179.51,175.48\" fill=\"#DDCFE4\"/><polygon points=\"137.71,326.33 141.72,322.52 141.72,263.72 137.71,266.44\" fill=\"#A38AAE\"/><polygon points=\"132.77,325.47 137.71,326.33 137.71,266.44 132.77,265.82\" fill=\"#BDA5C9\"/><polygon points=\"132.77,265.82 137.71,266.44 141.72,263.72 136.86,263.13\" fill=\"#DDCFE4\"/><polygon points=\"237.84,292.96 239.67,290.27 239.67,178.29 237.84,179.24\" fill=\"#A38AAE\"/><polygon points=\"233.34,292.35 237.84,292.96 237.84,179.24 233.34,179.02\" fill=\"#BDA5C9\"/><polygon points=\"233.34,179.02 237.84,179.24 239.67,178.29 235.24,178.09\" fill=\"#DDCFE4\"/><polygon points=\"206.84,338.44 209.74,334.18 209.74,272.03 206.84,275.07\" fill=\"#A38AAE\"/><polygon points=\"201.31,337.48 206.84,338.44 206.84,275.07 201.31,274.38\" fill=\"#BDA5C9\"/><polygon points=\"201.31,274.38 206.84,275.07 209.74,272.03 204.31,271.37\" fill=\"#DDCFE4\"/><polygon points=\"204.88,313.54 206.43,311.56 206.43,307.50 204.88,309.44\" fill=\"#A38AAE\"/><polygon points=\"136.35,302.87 204.88,313.54 204.88,309.44 136.35,298.99\" fill=\"#BDA5C9\"/><polygon points=\"136.35,298.99 204.88,309.44 206.43,307.50 138.47,297.26\" fill=\"#DDCFE4\"/><polygon points=\"206.81,311.50 237.54,271.93 237.54,269.22 206.81,308.10\" fill=\"#A38AAE\"/><polygon points=\"203.69,311.02 206.81,311.50 206.81,308.10 203.69,307.63\" fill=\"#BDA5C9\"/><polygon points=\"203.69,307.63 206.81,308.10 237.54,269.22 235.00,268.92\" fill=\"#DDCFE4\"/><polygon points=\"235.45,224.00 237.58,222.15 237.58,179.74 235.45,180.83\" fill=\"#A38AAE\"/><polygon points=\"178.73,219.33 235.45,224.00 235.45,180.83 178.73,178.06\" fill=\"#BDA5C9\"/><polygon points=\"178.73,178.06 235.45,180.83 237.58,179.74 181.71,177.06\" fill=\"#DDCFE4\"/><polygon points=\"182.42,216.00 231.33,219.89 231.33,184.47 182.42,181.94\" fill=\"#D4C1DE\"/><g class=\"vision-timber-grain\"><path d=\"M185.19 213.63L185.19 184.21\"/><path d=\"M188.17 213.86L188.17 184.37\"/><path d=\"M191.16 214.09L191.16 184.53\"/><path d=\"M194.16 214.33L194.16 184.69\"/><path d=\"M197.18 214.56L197.18 184.85\"/><path d=\"M200.22 214.79L200.22 185.01\"/><path d=\"M203.27 215.03L203.27 185.17\"/><path d=\"M206.33 215.27L206.33 185.34\"/><path d=\"M209.41 215.51L209.41 185.50\"/><path d=\"M212.50 215.74L212.50 185.67\"/><path d=\"M215.61 215.98L215.61 185.84\"/><path d=\"M218.73 216.23L218.73 186.00\"/><path d=\"M221.87 216.47L221.87 186.17\"/><path d=\"M225.03 216.71L225.03 186.34\"/><path d=\"M228.20 216.96L228.20 186.51\"/></g><polygon points=\"209.21,285.00 211.83,282.05 211.83,275.24 209.21,278.08\" fill=\"#A38AAE\"/><polygon points=\"129.44,274.44 209.21,285.00 209.21,278.08 129.44,267.95\" fill=\"#BDA5C9\"/><polygon points=\"129.44,267.95 209.21,278.08 211.83,275.24 133.22,265.46\" fill=\"#DDCFE4\"/><polygon points=\"211.21,281.97 240.18,249.40 240.18,243.94 211.21,275.16\" fill=\"#A38AAE\"/><polygon points=\"205.61,281.24 211.21,281.97 211.21,275.16 205.61,274.46\" fill=\"#BDA5C9\"/><polygon points=\"205.61,274.46 211.21,275.16 240.18,243.94 235.59,243.50\" fill=\"#DDCFE4\"/><polygon points=\"210.13,279.41 244.44,241.73 244.44,236.91 210.13,273.12\" fill=\"#A38AAE\"/><polygon points=\"126.31,268.69 210.13,279.41 210.13,273.12 126.31,262.82\" fill=\"#BDA5C9\"/><polygon points=\"126.31,262.82 210.13,273.12 244.44,236.91 177.40,230.75\" fill=\"#DDCFE4\"/><polygon points=\"133.79,260.81 207.77,269.72 237.38,239.62 175.97,233.83\" fill=\"#DFC9D9\"/>";

function fieldDrawing() {
  return `<svg class="direction-scene field-scene" viewBox="0 0 620 380" fill="none" role="img" aria-label="Three cropped object studies: a person, a cup, and a chair. Only the higher-risk chair is selected for the spoken warning.">
    <g class="field-secondary field-person" transform="rotate(-9 136 144)">
      <rect x="35" y="32" width="182" height="212" fill="#ECE5EF" stroke="#A18EAD" stroke-width=".7"/>
      <path d="M46 54V43H57M195 43H206V54M46 222V233H57M195 233H206V222" stroke="#8F789D" stroke-width="1"/>
      <path d="M110 120C96 121 91 131 88 150L82 195H162L155 146C153 127 139 120 131 119Z" fill="#B4A2C3" stroke="#8E769D" stroke-width="1"/>
      <path d="M111 109L131 108L134 126Q123 136 109 125Z" fill="#BBA5BA"/>
      <path d="M105 78C106 59 136 56 142 77L142 91L147 98L140 103L138 112C124 120 110 110 109 101Z" fill="#CDBCCB"/>
      <path d="M105 93C96 78 104 60 119 59C136 56 146 67 145 83L135 90L130 75L116 80L113 97Z" fill="#85708E"/>
      <path d="M96 138L91 176M145 139L152 176M103 187Q124 194 149 185" stroke="#8F779C" stroke-width="1"/>
      <text x="57" y="218" class="field-plate-title">person</text>
    </g>
    <g class="field-secondary field-cup" transform="rotate(9 496 174)">
      <rect x="414" y="80" width="168" height="198" fill="#ECE5EF" stroke="#A18EAD" stroke-width=".7"/>
      <path d="M425 102V91H436M560 91H571V102M425 256V267H436M560 267H571V256" stroke="#8F789D" stroke-width="1"/>
      <ellipse cx="495" cy="216" rx="36" ry="6" fill="#8C7598" opacity=".18"/>
      <path d="M520 139C557 132 559 187 525 188L523 178C545 177 546 146 521 149Z" fill="#B6A5C4" stroke="#8E769D" stroke-width="1"/>
      <path d="M459 133H525L520 206Q493 221 465 205Z" fill="#C6B7D0" stroke="#8E769D" stroke-width="1"/>
      <ellipse cx="492" cy="133" rx="33" ry="9" fill="#DCD0E1" stroke="#8E769D" stroke-width="1"/>
      <ellipse cx="492" cy="133" rx="27" ry="5.5" fill="#A992B3"/>
      <path d="M470 151L474 196" stroke="#F6EDF6" stroke-width="2" opacity=".6"/>
      <text x="437" y="253" class="field-plate-title">cup</text>
    </g>
    <path d="M157 77H400L420 97V337H157Z" fill="#A78BA9" opacity=".08"/>
    <rect x="147" y="69" width="253" height="263" rx="2" fill="#FBF7F0" stroke="#CFBBCF" stroke-width=".9"/>
    <path d="M147 92V69H170M377 69H400V92M147 309V332H170M377 332H400V309" stroke="#BF5B45" stroke-width="1.5"/>
    <text x="166" y="93" class="field-chosen-label">SELECTED SUBJECT</text>
    <svg x="195" y="109" width="159" height="195" viewBox="115 164 141 184" fill="none"><g stroke="#6C5279" stroke-width=".95" stroke-linecap="round" stroke-linejoin="round">${CHAIR_SPECIMEN}</g></svg>
    <text x="164" y="319" class="field-chair-title">chair</text>
    <path class="field-choice-stroke" d="M222 316H382" stroke="#BF5B45" stroke-width=".7" stroke-linecap="round"/>
    <path d="M400 319C450 319 471 353 548 353" stroke="#BF5B45" stroke-width=".8" stroke-dasharray="2 4"/>
    <g transform="translate(548 334)" stroke="#BF5B45" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4C3 4 2 15 7 20L9 22V31H15V19C24 16 23 4 12 4Z"/><path d="M9 10C10 6 17 7 17 12C17 16 10 17 9 13M28 9Q33 16 28 23"/></g>
    <text x="149" y="365" class="field-detail field-selected-detail">THE OTHER DETECTIONS STAY UNSPOKEN.</text>
  </svg>`;
}

function hardwareDrawing(identifier) {
  const layers = Array.from({ length: 7 }, (_, index) => `<path d="M8 ${8+index*4}H292"/>`).join("");
  const sideLayers = Array.from({ length: 7 }, (_, index) => `<path d="M8 ${8+index*4}H182"/>`).join("");
  const vents = Array.from({ length: 10 }, (_, index) => `<rect x="${104+index*16}" y="9" width="7" height="22" rx="2" fill="#673C43"/><path d="M${106+index*16} 12V28" stroke="#E1A08C" stroke-width=".5" opacity=".5"/>`).join("");
  const blades = Array.from({ length: 7 }, (_, index) => `<path d="M105 99C81 77 100 62 118 64C139 71 139 87 110 108Z" transform="rotate(${index*360/7} 105 103)" fill="${index%2?"#655E66":"#81757A"}" stroke="#A89A9C" stroke-width=".65"/>`).join("");
  const screws = [[57,54],[153,54],[57,151],[153,151]].map(([horizontal,vertical])=>`<g transform="translate(${horizontal} ${vertical})"><circle r="5.2" fill="#D7CAC9" stroke="#655561" stroke-width="1"/><path d="M-2.6 0H2.6M0-2.6V2.6" stroke="#655561" stroke-width=".8"/></g>`).join("");
  return `<svg class="direction-scene hardware-scene" viewBox="0 0 620 405" fill="none" role="img" aria-label="An illustrated specimen of the real prototype: a red vented Raspberry Pi enclosure, cooling fan, copper ribbon, and green camera board. Not a newly designed commercial wearable.">
    <defs><linearGradient id="${identifier}-lid" x1="0" y1="0" x2="300" y2="190" gradientUnits="userSpaceOnUse"><stop stop-color="#E3947D"/><stop offset=".5" stop-color="#CC7163"/><stop offset="1" stop-color="#BD5D57"/></linearGradient><linearGradient id="${identifier}-lens"><stop stop-color="#716976"/><stop offset=".45" stop-color="#211F31"/><stop offset="1" stop-color="#4F495F"/></linearGradient></defs>
    <path d="M94 232L407 145L515 277L195 363Z" fill="#705869" opacity=".045"/><path d="M99 231L407 150L510 275L197 356Z" fill="#705869" opacity=".075"/>
    <path d="M243 320C258 357 209 364 201 388" stroke="#443943" stroke-width="9" stroke-linecap="round"/>
    <path d="M243 320C258 357 209 364 201 388" stroke="#8B7882" stroke-width="1" stroke-linecap="round" opacity=".6"/>
    <g transform="matrix(.52 .66 0 1 96 180)"><path d="M0 0H190V29Q190 45 173 45H18Q0 45 0 29Z" fill="#A75B57" stroke="#87494C" stroke-width="1"/><g stroke="#E0A08D" stroke-width=".45" opacity=".38">${sideLayers}</g></g>
    <g transform="matrix(1.03 -.27 0 1 195 305)"><path d="M0 0H300V29Q300 45 282 45H18Q0 45 0 29Z" fill="#BD6B60" stroke="#87494C" stroke-width="1"/><g stroke="#F0B29B" stroke-width=".45" opacity=".4">${layers}</g>${vents}<rect x="31" y="21" width="25" height="23" rx="3" fill="#534550" stroke="#392F3D" stroke-width="1"/><path d="M37 25V38M42 25V38M47 25V38" stroke="#8E7D85" stroke-width=".7"/><text x="68" y="38" class="hardware-case-text">RASPBERRY PI 5</text></g>
    <g transform="matrix(1.03 -.27 .52 .66 96 180)">
      <rect width="300" height="190" rx="18" fill="url(#${identifier}-lid)" stroke="#9D5454" stroke-width="1.2"/>
      <path d="M19 6H281Q294 6 294 19" stroke="#F1B49A" stroke-width="1.2" opacity=".8"/>
      <circle cx="105" cy="103" r="57" fill="#77484A" stroke="#904F50" stroke-width="2"/>
      <circle cx="105" cy="103" r="52" fill="#322D3A"/>
      <g class="hardware-rotor">${blades}</g>
      <circle cx="105" cy="103" r="20" fill="#B6B1B4" stroke="#33303C" stroke-width="1.2"/>
      <circle cx="105" cy="103" r="13.5" fill="#706574"/>
      <path d="M98 103H112M105 96V110" stroke="#C5BBC2" stroke-width=".6" opacity=".65"/>
      ${screws}
      <rect x="176" y="108" width="18" height="24" rx="2" fill="#794549"/>
      <path d="M182 126C174 106 187 83 206 75L239 48L249 62L216 94C199 106 197 115 198 129Z" fill="#D6AB62" stroke="#8C684A" stroke-width="1"/>
      <g stroke="#F6D79A" stroke-width=".7"><path d="M185 121Q181 98 210 82L241 54M189 124Q186 102 214 86L244 57M193 126Q190 106 218 90L247 60"/></g>
      <g transform="rotate(-9 245 54)">
        <path d="M216 22H274V79H216Z" fill="#66867C" stroke="#405E58" stroke-width="1"/>
        <path d="M216 76H274V81H216Z" fill="#385850"/>
        <g fill="#D7B579" stroke="#716547" stroke-width=".6"><circle cx="221" cy="27" r="2"/><circle cx="269" cy="27" r="2"/><circle cx="221" cy="73" r="2"/><circle cx="269" cy="73" r="2"/></g>
        <path d="M224 64H233V70H245M261 32V44H268M222 37H229V44" stroke="#A5B7A0" stroke-width=".65"/>
        <rect x="230" y="34" width="30" height="30" rx="2" fill="#38333E" stroke="#B4ADAA" stroke-width="1"/>
        <circle cx="245" cy="49" r="14" fill="#B8B5B5" stroke="#4B414F" stroke-width="1.2"/>
        <circle cx="245" cy="49" r="10" fill="url(#${identifier}-lens)"/>
        <circle cx="245" cy="49" r="5.4" fill="#222331"/>
        <path d="M240 44Q244 41 248 44" stroke="#E5E1DA" stroke-width="1.4" stroke-linecap="round"/>
      </g>
    </g>
    <text x="40" y="67" class="hardware-margin-note">A FIELD BUILD.</text><text x="40" y="81" class="hardware-margin-note">NOT A CLOUD SERVICE.</text>
    <path d="M502 270C526 272 518 289 538 297" stroke="#A16D60" stroke-width=".8" stroke-dasharray="2 4" opacity=".7"/><g transform="translate(527 291) rotate(15)" stroke="#A16D60" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4C3 4 2 15 7 20L9 22V32H15V19C24 16 23 4 12 4Z" fill="#F7EDE1"/><path d="M9 10C10 6 17 7 17 12C17 16 10 17 9 13M27 9Q32 16 27 23"/></g>
  </svg>`;
}

function quietDrawing() {
  const frames = Array.from({ length: 7 }, (_, index) => {
    const horizontal = 35 + index * 80;
    const scale = [0.35,0.5,0.65,1,0.65,0.5,0.35][index];
    const offsetHorizontal = 33 - 18 * scale;
    const offsetVertical = 46 - 43 * scale;
    return `<g class="quiet-frame${index===3?" quiet-frame-chosen":""}" transform="translate(${horizontal} 221)"><rect width="66" height="51" rx="2"/><g class="quiet-chair" transform="translate(${offsetHorizontal} ${offsetVertical}) scale(${scale})"><path d="M5 2L23 0L25 19L7 21ZM7 20L25 18L34 25L14 28ZM14 28L13 43M34 25L36 40M7 21L5 36M25 18L26 33"/></g></g>`;
  }).join("");
  return `<svg class="direction-scene quiet-scene" viewBox="0 0 620 315" fill="none" role="img" aria-label="An illustrative safe, warning, safe episode. Camera frames keep observing a chair; one selected warning interrupts silence. Not a recorded performance trace.">
    <text x="225" y="83" class="quiet-warning">stop, chair,</text><text x="225" y="116" class="quiet-warning">2 steps ahead</text>
    <path d="M308 128V174" stroke="#ECAD8A" stroke-width=".9"/>
    <path d="M35 174H585" stroke="#BCA9BE" stroke-width=".8" opacity=".42"/>
    <g class="quiet-marker"><circle cx="308" cy="174" r="4" fill="#ECAD8A"/><circle cx="308" cy="174" r="13" stroke="#ECAD8A" stroke-width=".65" opacity=".5"/></g>
    <path d="M308 187V217" stroke="#ECAD8A" stroke-width=".65" opacity=".55"/>
    <text x="65" y="157" class="quiet-small">silence</text><text x="470" y="157" class="quiet-small">silence</text>
    <g class="quiet-frame-strip">${frames}</g>
    <text x="35" y="303" class="quiet-small">THE CAMERA KEEPS LOOKING.</text>
    <text x="375" y="303" class="quiet-small">THE VOICE DOESN’T NARRATE IT ALL.</text>
  </svg>`;
}

export function createVisionDirection(key) {
  const direction = VISION_DIRECTIONS.find((candidate) => candidate.key === key);
  if (!direction) throw new Error(`Unknown VisionAssist direction: ${key}`);
  const identifier = `vision-direction-${++instance}`;
  const root = document.createElement("figure");
  root.className = `direction-art direction-${key}`;
  root.setAttribute("aria-label", `VisionAssist: ${direction.name}`);
  if (key === "attention") root.innerHTML = `<div class="direction-masthead"><span>VisionAssist</span><span>Attention, not narration</span></div>${fieldDrawing()}<figcaption class="field-caption"><p>Seen three.<br><em>Said one.</em></p><span>EXAMPLE WARNING<br>“stop, chair, 2 steps ahead”</span></figcaption>`;
  if (key === "object") root.innerHTML = `<div class="direction-masthead"><span>VisionAssist</span><span>Camera · Pi 5 · Offline voice</span></div>${hardwareDrawing(identifier)}<figcaption class="hardware-caption"><p>Computer vision.<br><em>Without the cloud.</em></p><span>Obstacles in.<br>One spoken warning out.</span></figcaption>`;
  if (key === "quiet") root.innerHTML = `<div class="direction-masthead"><span>VisionAssist</span><span>An audio-first perspective</span></div><p class="quiet-title">Not a running<br><em>commentary.</em></p>${quietDrawing()}<figcaption class="quiet-caption">An illustrated safe → warning → safe episode.<br>Not a recording, benchmark, or safety claim.</figcaption>`;
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

export function setVisionDirectionsPaused(value) {
  paused = value;
  records.forEach((record) => record.sync());
}

export function releaseVisionDirection(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}
