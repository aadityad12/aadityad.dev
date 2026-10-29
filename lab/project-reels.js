// Rotating visuals inside one project card. The card's copy stays put; only the picture changes.
// Slides advance on a slow timer that runs only while the reel is on screen, the page is visible,
// motion is allowed, and nobody is hovering or focused inside it. Choosing a view or swiping
// hands control to the visitor for good.
let count = 0;
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const records = new Set();
const cleanup = new WeakMap();

export function createReel({ name, slides, dwell = 7000 }) {
  const id = `reel-${++count}`;
  const n = slides.length;
  const root = document.createElement("section");
  root.className = "reel";
  root.setAttribute("aria-roledescription", "carousel");
  root.setAttribute("aria-label", `${name}, ${n} views`);
  const track = document.createElement("div");
  track.className = "reel-track";
  const tabs = document.createElement("div");
  tabs.className = "reel-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", `${name} views`);

  const panels = slides.map((slide, i) => {
    const panel = document.createElement("div");
    panel.className = "reel-slide";
    panel.id = `${id}-${i}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-roledescription", "slide");
    panel.setAttribute("aria-label", `${i + 1} of ${n}: ${slide.label}`);
    panel.append(slide.node);
    track.append(panel);
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "reel-tab";
    tab.id = `${id}-tab-${i}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    tab.style.setProperty("--reel-dwell", `${slide.dwell ?? dwell}ms`);
    tab.innerHTML = `<span class="reel-num">0${i + 1}</span><span class="reel-label"></span><span class="reel-meter" aria-hidden="true"><span class="reel-fill"></span></span>`;
    tab.querySelector(".reel-label").textContent = slide.label;
    tab.addEventListener("click", () => { takeOver(); go(i); });
    tabs.append(tab);
    return panel;
  });
  const tabButtons = [...tabs.children];
  root.append(track);
  if (n > 1) root.append(tabs);
  else root.classList.add("is-single");

  let index = 0;
  let visible = false;
  let hovered = false;
  let focused = false;
  let manual = false;
  let settle = 0;

  function syncMedia() {
    panels.forEach((panel, i) => panel.querySelectorAll("video").forEach((video) => {
      if (i === index && visible && !paused && !document.hidden) video.play().catch(() => {});
      else video.pause();
    }));
  }
  function sync() {
    const running = n > 1 && visible && !paused && !reduced.matches && !document.hidden && !hovered && !focused && !manual;
    root.classList.toggle("is-running", running);
    root.classList.toggle("is-manual", manual || paused || reduced.matches);
    syncMedia();
  }
  function select(i) {
    index = i;
    tabButtons.forEach((tab, j) => {
      tab.setAttribute("aria-selected", String(j === i));
      tab.tabIndex = j === i ? 0 : -1;
    });
    panels.forEach((panel, j) => { panel.inert = j !== i; });
    sync();
  }
  function go(i) {
    const target = (i + n) % n;
    const wrapping = target < index && !manual;
    select(target);
    const left = target * track.clientWidth;
    if (reduced.matches) track.scrollTo({ left, behavior: "instant" });
    else if (wrapping) {
      track.classList.add("is-rewinding");
      setTimeout(() => {
        track.scrollTo({ left, behavior: "instant" });
        track.classList.remove("is-rewinding");
      }, 260);
    } else track.scrollTo({ left, behavior: "smooth" });
  }
  function takeOver() {
    manual = true;
    sync();
  }

  track.addEventListener("scroll", () => {
    clearTimeout(settle);
    settle = setTimeout(() => {
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i !== index) { takeOver(); select(i); }
    }, 140);
  }, { passive: true });
  tabs.addEventListener("animationend", (event) => { if (event.animationName === "reel-fill") go(index + 1); });
  tabs.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    const to = event.key === "Home" ? 0 : event.key === "End" ? n - 1 : step === undefined ? null : (index + step + n) % n;
    if (to === null) return;
    event.preventDefault();
    takeOver();
    go(to);
    tabButtons[to].focus();
  });
  root.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { hovered = true; sync(); } });
  root.addEventListener("pointerleave", () => { hovered = false; sync(); });
  root.addEventListener("focusin", () => { focused = true; sync(); });
  root.addEventListener("focusout", (event) => { if (!root.contains(event.relatedTarget)) { focused = false; sync(); } });

  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.35 });
  observer.observe(root);
  const resize = new ResizeObserver(() => track.scrollTo({ left: index * track.clientWidth, behavior: "instant" }));
  resize.observe(track);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  const record = { sync };
  records.add(record);
  cleanup.set(root, () => {
    observer.disconnect();
    resize.disconnect();
    clearTimeout(settle);
    document.removeEventListener("visibilitychange", sync);
    reduced.removeEventListener("change", sync);
    records.delete(record);
  });
  select(0);
  return root;
}

export function setReelsPaused(value) {
  paused = value;
  records.forEach((record) => record.sync());
}

export function releaseReel(root) {
  cleanup.get(root)?.();
  cleanup.delete(root);
}
