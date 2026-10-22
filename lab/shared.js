// Shared bits for the direction mockups: Pathfinder's idle pose (same paths as
// app/components/mascot/frames.ts), the heightmap, and the hero copy.
export const PATHFINDER = [
  "M 74 101 C 71 93 77 87 85 88 C 108 84 149 85 157 89 C 165 90 170 96 168 104 C 171 127 170 151 167 164 C 166 172 160 176 152 175 C 126 178 96 177 83 174 C 76 173 70 168 71 160 C 68 140 71 119 74 101 Z",
  "M 96 84 C 111 80 130 81 144 84",
  "M 120 80 C 118 71 121 62 120 55",
  "M 120 55 C 111 53 111 40 121 40 C 131 41 129 54 120 55",
  "M 97 177 C 96 190 97 202 95 212 M 95 212 C 90 214 85 214 80 213",
  "M 143 177 C 144 190 143 202 145 212 M 145 212 C 150 214 155 214 160 213",
  "M 72 130 C 64 136 60 144 61 152",
  "M 168 132 C 176 138 180 146 179 154",
  "M 120 103 C 136 103 147 114 147 129 C 147 144 135 155 119 155 C 104 155 93 143 93 128 C 93 113 105 103 120 103",
];
export function pathfinder({ ink = "#221F1A", eye = "#E4572E", fill = "none", width = 4, size = 80 } = {}) {
  return `<svg viewBox="40 30 160 195" width="${size}" height="${(size * 195) / 160}" aria-hidden="true">
    <g fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">
      <path d="${PATHFINDER[0]}" fill="${fill}"/>${PATHFINDER.slice(1).map((d) => `<path d="${d}"/>`).join("")}
    </g>
    <circle cx="122" cy="130" r="7" fill="${eye}"/>
    <circle cx="120" cy="165" r="4" fill="${eye}"/>
  </svg>`;
}
export async function heightmap() {
  return fetch(new URL("./heightmap.json", import.meta.url)).then((r) => r.json());
}
// places in heightmap cells (see heightmap.mjs); labels are what the work was
export const PLACES = [
  { id: "deanza", name: "De Anza", what: "VisionAssist, with Infineon" },
  { id: "sunnyvale", name: "Sunnyvale", what: "GazeBoard" },
  { id: "scu", name: "Santa Clara U", what: "Echo" },
  { id: "sjsu", name: "SJSU", what: "School, ENGR 10 TA" },
  { id: "berkeley", name: "Berkeley", what: "Accordion" },
];
export const COPY = {
  eyebrow: "Computer Engineering @ SJSU · Expected May 2028",
  name: "Aaditya Desai",
  hi: "Hi, I'm Aadi.",
  intro:
    "I'm a computer engineering student at San José State. I've built a head-mounted obstacle detector with Infineon, a small programming language with a hand-written ARM64 JIT, an Android app I use every day, and tools for AI coding agents.",
  avail: "Looking for a Summer 2027 internship or Winter 2027 co-op in software, AI/ML, embedded and hardware, DevOps, or security.",
};
// project pins on the 3D map; `href` is the section each pin links to on the site.
// anchor: { lm } sits on top of a landmark model, { place } is a heightmap cell above.
export const PINS = [
  { id: "visionassist", name: "De Anza College", what: "VisionAssist, with Infineon", anchor: { place: "deanza" }, href: "#visionassist" },
  { id: "gazeboard", name: "Sunnyvale", what: "GazeBoard", anchor: { place: "sunnyvale" }, href: "#gazeboard" },
  { id: "echo", name: "Santa Clara University", what: "Echo", anchor: { place: "scu" }, href: "#echo" },
  { id: "home", name: "Home, Santa Clara", what: "Rung, OSS Scout, ApexTracker", anchor: { place: "home" }, href: "#rung" },
  { id: "sjsu", name: "SJSU", what: "School, ENGR 10 TA", anchor: { lm: "towerHall" }, href: "#experience" },
  { id: "accordion", name: "UC Berkeley", what: "Accordion", anchor: { lm: "campanile" }, href: "#accordion" },
  { id: "temper", name: "Ferry Building", what: "Temper", anchor: { lm: "ferryBuilding" }, href: "#temper" },
];
