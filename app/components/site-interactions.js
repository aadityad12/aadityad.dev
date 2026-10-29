// Everything interactive on the page, layered over the server-rendered content. The page is
// complete without this file: it adds the 3D map, the map explorer, project reels, and stamps.
import { PROJECT_ARTIFACTS, createProjectArtifact, releaseProjectArtifact, setArtifactsPaused } from "@/lab/project-artifacts.js";
import { createVisionDirection, releaseVisionDirection, setVisionDirectionsPaused } from "@/lab/visionassist-directions.js";
import { createReel, setReelsPaused } from "@/lab/project-reels.js";

const pausers = [setArtifactsPaused, setVisionDirectionsPaused, setReelsPaused];
const extra = {}; // project id -> () => HTMLElement, for artifacts from optional modules

function picture(src, alt, className) {
  const image = document.createElement("img");
  Object.assign(image, { src, alt, className, loading: "lazy", decoding: "async" });
  return image;
}
function phone(src, alt) {
  const frame = document.createElement("figure");
  frame.className = "phone";
  frame.append(picture(src, alt, ""));
  return frame;
}
function video(src, poster, label) {
  const v = document.createElement("video");
  Object.assign(v, { src, poster, muted: true, loop: true, playsInline: true, preload: "metadata", className: "demo" });
  v.setAttribute("aria-label", label);
  return v;
}

const REELS = {
  visionassist: [
    { label: "What it sees", make: () => createVisionDirection("attention") },
    { label: "What it says", make: () => createVisionDirection("quiet") },
    { label: "How it's worn", make: () => picture("/projects/visionassist-fit-cad.png", "CAD model of the VisionAssist mount: the Pi 5 and camera on a visor bracket, on a head form", "v-plate") },
    { label: "The build", make: () => picture("/projects/visionassist-device.jpg", "VisionAssist's Raspberry Pi 5 in a red 3D-printed case with a cooling fan, and an Arducam camera module on top", "v-photo") },
  ],
  accordion: [
    { label: "The context map, live", make: () => video("/projects/accordion-demo.mp4", "/projects/accordion-poster.jpg", "Accordion's context map folding and unfolding blocks of a live coding-agent session"), dwell: 10000 },
    { label: "One session, block by block", make: () => picture("/projects/accordion-context-map.png", "Accordion's context map: a 109,407-token session drawn as coloured blocks for user, reply, thinking, tool call and tool result", "v-ui") },
  ],
  rung: [
    { label: "Watch it run", make: () => picture("/projects/rung-jit.gif", "Terminal output: Rung compiles a function to ARM64, then a float fails the integer type guard and the VM finishes the call, printing 42 and 22.5", "v-terminal"), dwell: 9000 },
    { label: "Speed-ups by engine", make: () => picture("/projects/rung-performance.svg", "Bar chart of speed-ups over the tree-walker for the stack VM, register VM and JIT across six benchmarks, up to 38.84x on fib", "v-chart") },
  ],
  alta: [
    { label: "Probe to voice", make: () => extra.alta?.(), optional: true },
    { label: "The bench", make: () => picture("/projects/alta-setup.png", "Alta's bench: a phone camera over the student's breadboard, the probe pod in its printed dock, and a laptop showing 'Yellow 5.01 V (expect about 2)'", "v-ui") },
    { label: "Where to probe", make: () => picture("/projects/alta-overlay.jpg", "Alta's camera overlay engine marking wires, the hole where the yellow probe goes, and the power rails on a real breadboard", "v-photo tall") },
    { label: "The pod dock", make: () => picture("/projects/alta-pod-dock.png", "Top view of the 3D-printed pod dock holding the Arduino Uno and the mini breadboard, with Y B G W probe labels", "v-plate") },
  ],
  "oss-scout": [{ label: "The night shift", make: () => extra["oss-scout"]?.(), optional: true }],
  apextracker: [
    { label: "The day, scored", make: () => phone("/projects/apextracker-dashboard.jpg", "ApexTracker's graphite dashboard: daily goal score and a consistency chart") },
    { label: "Study sessions", make: () => phone("/projects/apextracker-study.jpg", "ApexTracker's study session timer with a weekly study chart") },
    { label: "Daily insights", make: () => phone("/projects/apextracker-insights.jpg", "ApexTracker's daily insights: money spent, study time and screen time for one day") },
  ],
  gazeboard: [{ label: "Letters to words to voice", make: () => createProjectArtifact("gazeboard") }],
  echo: [
    { label: "An alert, no internet", make: () => phone("/projects/echo-alert.jpg", "Echo showing a severe weather alert received over Bluetooth") },
    { label: "Every alert it carried", make: () => phone("/projects/echo-home.jpg", "Echo's home screen listing severe weather alerts received from nearby phones") },
  ],
  temper: [
    { label: "Bare vs. harnessed", make: () => extra.temper?.(), optional: true },
    { label: "Temper", make: () => picture("/projects/temper-logo.jpg", "The Temper logo", "v-plate logo") },
  ],
};

async function loadOptionalArtifacts() {
  const loaders = [
    ["alta", () => import("@/lab/alta-artifact.js"), "createAltaArtifact", "setAltaPaused"],
  ];
  /* PENDING
  const _pending = [
    ["oss-scout", () => import("@/lab/oss-scout-artifact.js"), "createScoutArtifact", "setScoutPaused"],
    ["temper", () => import("@/lab/temper-artifact.js"), "createTemperArtifact", "setTemperPaused"],
  ];  */

  await Promise.all(loaders.map(async ([id, load, make, pause]) => {
    try {
      const mod = await load();
      extra[id] = () => mod[make]();
      pausers.push(mod[pause]);
    } catch { /* not built yet: the reel skips this view */ }
  }));
}

let started = false;
export async function start() {
  if (started) return;
  started = true;
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.getElementById("hdr");
  const syncHeader = () => header.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  // Pathfinder in the footer watches the cursor, blinks, and waves when poked
  const pf = document.querySelector("[data-pathfinder]");
  if (pf) {
    const eye = pf.querySelector(".pf-eye");
    let blinkTimer = 0;
    const look = (x, y) => {
      const box = pf.getBoundingClientRect();
      const dx = x - (box.left + box.width * 0.51), dy = y - (box.top + box.height * 0.51);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300) * 5;
      eye.setAttribute("cx", String(122 + (dx / d) * k));
      eye.setAttribute("cy", String(130 + (dy / d) * k));
    };
    addEventListener("pointermove", (event) => look(event.clientX, event.clientY), { passive: true });
    const blink = () => {
      eye.setAttribute("ry", "1.2");
      setTimeout(() => eye.setAttribute("ry", "7"), 130);
      blinkTimer = setTimeout(blink, 2800 + Math.random() * 3500);
    };
    if (!motionPreference.matches) blinkTimer = setTimeout(blink, 2000);
    pf.addEventListener("click", () => {
      pf.classList.remove("hop", "wave");
      void pf.offsetWidth;
      pf.classList.add("hop", "wave");
    });
    pf.addEventListener("animationend", (event) => { if (event.animationName === "pf-hop") pf.classList.remove("hop"); if (event.animationName === "pf-wave") pf.classList.remove("wave"); });
    void blinkTimer;
  }

  await loadOptionalArtifacts();

  const cards = [...document.querySelectorAll(".pc")];
  const leads = new Map();
  for (const card of cards) {
    const slides = (REELS[card.id] ?? []).map((slide) => ({ ...slide, node: slide.make() })).filter((slide) => slide.node);
    if (!slides.length) continue;
    leads.set(card.id, REELS[card.id].find((slide) => !slide.optional || extra[card.id]));
    const reel = createReel({ name: card.querySelector("h3").textContent, slides });
    card.querySelector(".pc-pic").replaceWith(reel);
  }

  const map = document.getElementById("map");
  const explorer = document.getElementById("map-explorer");
  const heroScene = document.querySelector(".hero-scene");
  const entryButton = document.getElementById("map-entry");
  const resetButton = document.getElementById("whole");
  const motionButton = document.getElementById("map-motion");
  const explorerMotion = document.getElementById("explorer-motion");
  const explorerIndex = document.getElementById("explorer-index");
  const preview = document.getElementById("project-preview");
  const artifactHost = document.getElementById("preview-artifact");

  let bay = null;
  let paused = motionPreference.matches;
  let mapVisible = true;
  let returnFocus = null;
  let returnScroll = 0;
  let selectedTarget = null;
  let savedOverflow = "";
  let lastTrip = null;

  const heroFrame = () => ({
    insetLeft: (width) => (innerWidth >= 1000 ? Math.min(560, width * 0.38) : 0),
    offsetY: (width, height) => (innerWidth >= 1000 ? -height * 0.04 : -height * 0.07),
    fit: innerWidth >= 1200 ? 0.5 : innerWidth >= 1000 ? 0.58 : 0.69,
  });
  const explorerFrame = () => ({ insetLeft: 0, offsetY: 0, fit: innerWidth <= 700 ? 0.65 : 0.53 });
  function frameMap() {
    bay.setFrame(explorer.open ? explorerFrame() : heroFrame());
    bay.goHome(motionPreference.matches ? 1 : 750);
  }

  function syncAnimation() {
    map.classList.toggle("map-paused", paused);
    pausers.forEach((pause) => pause(paused));
    for (const button of [motionButton, explorerMotion]) {
      button.textContent = paused ? "Play" : "Pause";
      button.setAttribute("aria-pressed", String(paused));
    }
    if (!bay) return;
    bay.controls.enabled = explorer.open;
    bay.setMotionEnabled(!paused);
    bay.setActive((explorer.open || (mapVisible && !paused)) && !document.hidden);
  }

  function clearPreviewArtifact() {
    artifactHost.querySelectorAll(".project-artifact").forEach(releaseProjectArtifact);
    artifactHost.querySelectorAll(".direction-art").forEach(releaseVisionDirection);
    artifactHost.replaceChildren();
  }
  function dismissPreview() {
    preview.hidden = true;
    explorer.classList.remove("has-selection");
    explorerIndex.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", "false"));
    bay?.clearPins();
  }

  function showProject(target, pinId) {
    dismissPreview();
    selectedTarget = target;
    const isProject = target.matches(".pc");
    document.getElementById("preview-place").textContent = isProject ? target.dataset.where : "San José State University";
    document.getElementById("preview-title").textContent = isProject ? target.querySelector("h3").textContent : "Study and teaching";
    document.getElementById("preview-hook").textContent = isProject ? target.querySelector(".hook").textContent : "B.S. Computer Engineering with a minor in AI, 3.8 GPA, Dean's Scholar, and a TA for ENGR 10, the course where my robot posted the fastest run in its section.";
    document.getElementById("preview-meta").textContent = isProject ? [...target.querySelectorAll(".badges li")].map((li) => li.textContent).join(" · ") : "Expected May 2028";
    clearPreviewArtifact();
    if (isProject) {
      const lead = leads.get(target.id);
      if (target.id === "gazeboard" && PROJECT_ARTIFACTS.gazeboard) artifactHost.append(createProjectArtifact("gazeboard", { compact: true }));
      else if (lead) {
        const node = lead.make();
        if (node) {
          node.querySelectorAll?.("video").forEach((v) => { v.autoplay = !paused; });
          if (node.matches?.("video") && !paused) node.autoplay = true;
          artifactHost.append(node);
        }
      }
    }
    document.getElementById("preview-cta").textContent = isProject ? "View full project ↓" : "See my experience ↓";
    const related = document.getElementById("preview-related");
    related.replaceChildren();
    if (pinId === "home") {
      for (const sibling of cards.filter((card) => card.dataset.pin === "home")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn";
        button.textContent = sibling.querySelector("h3").textContent;
        button.setAttribute("aria-pressed", String(sibling === target));
        button.addEventListener("click", () => {
          showProject(sibling, "home");
          related.querySelector('[aria-pressed="true"]')?.focus();
        });
        related.append(button);
      }
    }
    preview.hidden = false;
    preview.scrollTop = 0;
    explorer.classList.add("has-selection");
    bay?.highlight(pinId);
    // Pathfinder heads for the place (riding the Caltrain on long trips) and the camera follows
    if (bay && pinId && pinId !== lastTrip) { lastTrip = pinId; bay.travel(pinId); }
    explorerIndex.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.target === target.id)));
  }

  function openExplorer(target = null, pinId = null) {
    if (!bay) return;
    if (!explorer.open) {
      returnFocus = document.activeElement;
      returnScroll = scrollY;
      savedOverflow = document.documentElement.style.overflow;
      explorer.showModal();
      document.documentElement.style.overflow = "hidden";
      document.getElementById("explorer-stage").append(map);
      bay.setInputMode("map");
      dismissPreview();
      frameMap();
      syncAnimation();
      document.getElementById("explorer-close").focus();
    }
    if (target) showProject(target, pinId);
  }

  function closeExplorer(target = null) {
    if (!explorer.open) return;
    dismissPreview();
    clearPreviewArtifact();
    lastTrip = null;
    heroScene.prepend(map);
    bay.setInputMode("page");
    explorer.close();
    document.documentElement.style.overflow = savedOverflow;
    frameMap();
    syncAnimation();
    if (paused && mapVisible) {
      bay.setActive(true);
      requestAnimationFrame(syncAnimation);
    }
    window.scrollTo({ top: returnScroll, behavior: "instant" });
    if (target) {
      history.pushState(null, "", `#${target.id}`);
      target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: motionPreference.matches ? "instant" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    } else if (returnFocus instanceof HTMLElement) returnFocus.focus({ preventScroll: true });
  }

  entryButton.addEventListener("click", () => openExplorer());
  resetButton.addEventListener("click", () => openExplorer());
  document.getElementById("explorer-close").addEventListener("click", () => closeExplorer());
  explorer.addEventListener("cancel", (event) => { event.preventDefault(); closeExplorer(); });
  document.getElementById("preview-cta").addEventListener("click", () => closeExplorer(selectedTarget));
  document.getElementById("preview-dismiss").addEventListener("click", () => { dismissPreview(); document.getElementById("explorer-close").focus(); });
  document.getElementById("explorer-reset").addEventListener("click", () => { dismissPreview(); lastTrip = null; frameMap(); });
  motionButton.addEventListener("click", () => { paused = !paused; syncAnimation(); });
  explorerMotion.addEventListener("click", () => { paused = !paused; syncAnimation(); });
  motionPreference.addEventListener("change", (event) => { paused = event.matches; syncAnimation(); });
  document.addEventListener("visibilitychange", syncAnimation);
  new IntersectionObserver(([entry]) => { mapVisible = entry.isIntersecting; syncAnimation(); }).observe(map);
  syncAnimation();

  // the map is the heaviest thing on the page, so it waits until the browser is idle
  await new Promise((resolve) => ("requestIdleCallback" in window ? requestIdleCallback(resolve, { timeout: 1200 }) : setTimeout(resolve, 300)));
  try {
    const [{ createBay }, { PINS }] = await Promise.all([import("@/lab/bay.js"), import("@/lab/shared.js")]);
    bay = await createBay(map, {
      pins: PINS, wheel: "modifier", touch: "page", pinCta: "Preview the work ↗", ...heroFrame(),
      onPin: (pin) => {
        const target = document.querySelector(pin.href);
        if (target) openExplorer(target, pin.id);
        return false;
      },
    });
    document.querySelector(".map-load")?.remove();
    for (const button of [motionButton, resetButton, entryButton]) button.disabled = false;
    for (const target of [...cards.filter((card) => card.dataset.pin), document.getElementById("experience")]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.target = target.id;
      button.textContent = target.matches(".pc") ? target.querySelector("h3").textContent : "SJSU";
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => showProject(target, target.dataset.pin || "sjsu"));
      explorerIndex.append(button);
    }
    addEventListener("resize", () => {
      frameMap();
      if (paused && mapVisible) {
        bay.setActive(true);
        requestAnimationFrame(syncAnimation);
      }
    });
    await new Promise(requestAnimationFrame);
    syncAnimation();
  } catch (error) {
    const note = document.querySelector(".map-load");
    if (note) note.textContent = "The map couldn't load here. Everything else is below.";
    console.error("Hero map unavailable:", error);
  }

  try {
    const [{ landmarkStamp, ridgeStamp }, { ferryBuilding, campanile }] = await Promise.all([import("@/lab/stamps.js"), import("@/lab/landmarks3d.js")]);
    const builders = { campanile, ferryBuilding };
    const looks = { campanile: { zoom: 1.05, yaw: 0.5 }, ferryBuilding: { zoom: 1.9, yaw: 0.35, dy: 12 } };
    for (const card of cards) {
      if (!card.dataset.stamp) continue;
      const [kind, key] = card.dataset.stamp.split(":");
      const bg = card.dataset.bg;
      const url = kind === "lm" ? landmarkStamp(builders[key], { w: 140, h: 176, bg, ...looks[key] }) : await ridgeStamp(key, { w: 140, h: 176, bg });
      const stamp = document.createElement("span");
      stamp.className = "stamp";
      stamp.setAttribute("aria-hidden", "true");
      stamp.innerHTML = '<span class="perf"><img alt=""></span>';
      stamp.querySelector("img").src = url;
      card.querySelector(".pc-head").append(stamp);
    }
  } catch (error) {
    console.warn("Decorative stamps unavailable:", error);
  }
}
