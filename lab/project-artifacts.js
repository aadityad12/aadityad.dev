import { GAZEBOARD_WORDS } from "./gazeboard-words.js";
import { createVisionAssistArtifact, releaseVisionAssistArtifact, setVisionAssistPaused } from "./visionassist-artifact.js";

export const PROJECT_ARTIFACTS = {
  visionassist: {
    name: "VisionAssist",
    summary: "On-device obstacle detection turns the highest-priority hazard into a spoken warning. A passive illustrated scene, not a live detection demo.",
  },
  gazeboard: {
    name: "GazeBoard",
    summary: "Gaze selects letter groups. A local dictionary predicts words to select and speak. Your pointer stands in for gaze here; no camera is used.",
  },
};

export const LETTER_GROUPS = ["abcdefg", "hijklm", "nopqrs", "tuvwxyz"];
export function predictWords(sequence) {
  if (!sequence.length) return [];
  return GAZEBOARD_WORDS.filter((word) => word.length >= sequence.length && sequence.every((group, index) => LETTER_GROUPS[group - 1]?.includes(word[index]))).slice(0, 3);
}

const cleanup = new WeakMap();
const motionListeners = new Set();
const maxWordLength = Math.max(...GAZEBOARD_WORDS.map((word) => word.length));
let motionPaused = matchMedia("(prefers-reduced-motion: reduce)").matches;
let instance = 0;

function letterCanopy(identifier) {
  return LETTER_GROUPS.map((letters, index) => {
    const lower = index > 1;
    const path = lower ? "M18 25 Q120 110 222 25" : "M18 95 Q120 10 222 95";
    return `<button class="gaze-letter-group gaze-group-${index + 1}" type="button" data-group="${index + 1}" aria-label="Select letter group ${letters[0].toUpperCase()} to ${letters.at(-1).toUpperCase()}"><svg viewBox="0 0 240 120" aria-hidden="true"><defs><path id="${identifier}-arc-${index}" d="${path}"/></defs><path class="gaze-letter-track" d="${lower ? "M18 41 Q120 126 222 41" : "M18 111 Q120 26 222 111"}"/><text><textPath href="#${identifier}-arc-${index}" startOffset="50%" text-anchor="middle">${[...letters].join(" ")}</textPath></text></svg><span class="gaze-group-label" aria-hidden="true">${letters[0].toUpperCase()}–${letters.at(-1).toUpperCase()}</span><span class="gaze-target-progress" aria-hidden="true"></span></button>`;
  }).join("");
}

function gazeArtifact(compact) {
  const identifier = `gaze-portrait-${++instance}`;
  const root = document.createElement("section");
  root.className = `project-artifact gaze-portrait${compact ? " is-compact" : ""}`;
  root.setAttribute("aria-label", "GazeBoard: letters become words, words become a voice");
  root.innerHTML = `<div class="gaze-portrait-masthead"><span>GazeBoard</span><span>Letters → words → voice</span></div>
    <p class="gaze-sr-only" id="${identifier}-instructions">Pointer simulation, not eye tracking. Hold over a letter group for one second, or click, tap, or keyboard-select it immediately. The app uses four groups, not individual letter keys. Choose a predicted word, then optionally speak it with your browser voice. The initial three-group example predicts water, wet, or watch.</p>
    <div class="gaze-letter-canopy" aria-describedby="${identifier}-instructions">${letterCanopy(identifier)}<div class="gaze-focus" aria-hidden="true"><span></span><i></i></div></div>
    <div class="gaze-pattern"><span class="gaze-pattern-label">Your gaze</span><span data-pattern></span><button type="button" class="gaze-undo" data-undo aria-label="Undo last letter group"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5L3 10L8 15M4 10H14C23 10 23 20 14 20"/></svg></button><button type="button" class="gaze-reset" data-reset aria-label="Start a new word"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5V11H13M19 11A8 8 0 1 0 19 17"/></svg></button></div>
    <div class="gaze-word-portrait"><div class="gaze-prediction-heading"><span data-state-label></span><span data-look-count></span></div><div class="gaze-expression"><p data-gaze-output aria-hidden="true"></p><div class="gaze-voice-wave" aria-hidden="true">${Array.from({ length: 17 }, (_, index) => `<i style="--wave-height:${6 + Math.round(Math.sin(index / 16 * Math.PI) * (12 + index % 4 * 6))}px;--wave-delay:${index * 34}ms"></i>`).join("")}</div></div><div class="gaze-candidates" aria-label="Predicted words" data-candidates></div><p class="gaze-sr-only" role="status" aria-live="polite" aria-atomic="true" data-announcement></p></div>
    <div class="gaze-portrait-footer"><span data-gaze-hint></span><button type="button" class="gaze-hear" data-speak disabled aria-label="Speak selected word"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10H8L13 6V18L8 14H4ZM17 8Q22 12 17 16M16 11Q17 12 16 13"/></svg><span>Speak word</span></button></div><p class="gaze-simulation">Pointer demo · Local dictionary · No camera</p>`;

  const canopy = root.querySelector(".gaze-letter-canopy");
  const focus = root.querySelector(".gaze-focus");
  const groups = [...root.querySelectorAll("[data-group]")];
  const pattern = root.querySelector("[data-pattern]");
  const output = root.querySelector("[data-gaze-output]");
  const candidates = root.querySelector("[data-candidates]");
  const hint = root.querySelector("[data-gaze-hint]");
  const announcement = root.querySelector("[data-announcement]");
  const speak = root.querySelector("[data-speak]");
  const undo = root.querySelector("[data-undo]");
  const reset = root.querySelector("[data-reset]");
  const canSpeak = "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
  let sequence = [4, 1, 4];
  let selected = "";
  let dwellFrame = 0;
  let pulseTimer = 0;
  let dwellTarget = null;
  let completedTarget = null;
  let dwellJustCommitted = false;
  let utterance = null;
  let visible = true;
  let disposed = false;

  function stopSpeech() {
    if (!utterance) return;
    utterance.onstart = utterance.onend = utterance.onerror = null;
    utterance = null;
    speechSynthesis.cancel();
    root.classList.remove("is-voicing");
  }

  function cancelDwell() {
    cancelAnimationFrame(dwellFrame);
    dwellFrame = 0;
    dwellTarget = null;
    root.querySelectorAll(".is-dwelling").forEach((target) => {
      target.classList.remove("is-dwelling");
      target.style.removeProperty("--dwell");
    });
    root.classList.remove("is-attending");
  }

  function pulse() {
    clearTimeout(pulseTimer);
    root.classList.remove("is-resolving");
    if (motionPaused) return;
    void root.offsetWidth;
    root.classList.add("is-resolving");
    pulseTimer = setTimeout(() => root.classList.remove("is-resolving"), 900);
  }

  function selectWord(word) {
    cancelDwell();
    stopSpeech();
    selected = word;
    output.textContent = word;
    root.classList.add("has-word");
    root.querySelector("[data-state-label]").textContent = "Your word. Your voice.";
    candidates.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.word === word)));
    hint.textContent = "Ready when you are.";
    speak.disabled = !canSpeak;
    speak.setAttribute("aria-label", `Speak ${word}`);
    announcement.textContent = `${word} selected. ${canSpeak ? "Speak word is available." : "Browser speech is unavailable."}`;
    pulse();
  }

  function activate(target) {
    if (disposed) return;
    cancelDwell();
    completedTarget = target;
    if (target.dataset.word) return selectWord(target.dataset.word);
    if (sequence.length >= maxWordLength) return;
    sequence.push(Number(target.dataset.group));
    selected = "";
    render();
    pulse();
  }

  function beginDwell(target) {
    if (disposed || !visible || document.hidden || dwellTarget === target || completedTarget === target) return;
    cancelDwell();
    completedTarget = null;
    dwellTarget = target;
    target.classList.add("is-dwelling");
    root.classList.add("is-attending");
    const start = performance.now();
    const tick = (now) => {
      target.style.setProperty("--dwell", String(Math.min(1, (now - start) / 1000)));
      if (now - start >= 1000) { activate(target); dwellJustCommitted = true; }
      else dwellFrame = requestAnimationFrame(tick);
    };
    dwellFrame = requestAnimationFrame(tick);
  }

  function bindTarget(target) {
    target.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") beginDwell(target); });
    target.addEventListener("pointerleave", () => { cancelDwell(); completedTarget = null; dwellJustCommitted = false; });
    target.addEventListener("pointercancel", () => { cancelDwell(); completedTarget = null; dwellJustCommitted = false; });
    target.addEventListener("click", (event) => {
      if (event.detail !== 0 && dwellJustCommitted && completedTarget === target && !target.dataset.word) { dwellJustCommitted = false; return; }
      dwellJustCommitted = false;
      activate(target);
    });
    target.addEventListener("blur", cancelDwell);
  }

  function render() {
    cancelDwell();
    stopSpeech();
    root.classList.remove("has-word");
    speak.disabled = true;
    undo.disabled = reset.disabled = !sequence.length;
    pattern.replaceChildren();
    for (const group of sequence) {
      const mark = document.createElement("span");
      mark.className = "gaze-pattern-mark";
      mark.textContent = `${LETTER_GROUPS[group - 1][0].toUpperCase()}–${LETTER_GROUPS[group - 1].at(-1).toUpperCase()}`;
      pattern.append(mark);
    }
    if (!sequence.length) pattern.textContent = "Start with a letter group";
    root.querySelector("[data-look-count]").textContent = sequence.length ? `${sequence.length} ${sequence.length === 1 ? "look" : "looks"}` : "";
    groups.forEach((button) => button.classList.toggle("is-last-group", Number(button.dataset.group) === sequence.at(-1)));
    const predictions = predictWords(sequence);
    candidates.replaceChildren();
    root.querySelector("[data-state-label]").textContent = predictions.length ? "A few looks. Possible words." : "Your gaze, your own words.";
    output.replaceChildren();
    output.classList.toggle("is-empty", !predictions.length);
    if (predictions.length) {
      const first = document.createElement("span");
      first.textContent = predictions[0].slice(0, sequence.length);
      const completion = document.createElement("span");
      completion.className = "gaze-completion";
      completion.textContent = predictions[0].slice(sequence.length);
      output.append(first, completion);
      for (const word of predictions) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "gaze-candidate";
        button.dataset.word = word;
        button.setAttribute("aria-label", `Choose predicted word ${word}`);
        button.setAttribute("aria-pressed", "false");
        const stem = document.createElement("span");
        stem.textContent = word.slice(0, sequence.length);
        const tail = document.createElement("span");
        tail.className = "gaze-candidate-tail";
        tail.textContent = word.slice(sequence.length);
        const progress = document.createElement("span");
        progress.className = "gaze-target-progress";
        progress.setAttribute("aria-hidden", "true");
        button.append(stem, tail, progress);
        bindTarget(button);
        candidates.append(button);
      }
    } else {
      output.textContent = sequence.length ? "Another way?" : "Your own\nwords.";
      const message = document.createElement("span");
      message.className = "gaze-candidate-empty";
      message.textContent = sequence.length ? "No match in the dictionary. Undo a look or start again." : "Look toward a group. Let a word take shape.";
      candidates.append(message);
    }
    hint.textContent = predictions.length ? "Keep spelling, or choose a word." : "Hold for 1 second · Tap also works";
    announcement.textContent = predictions.length ? `${sequence.length} group selections. Predicted words: ${predictions.join(", ")}.` : sequence.length ? "No matching words. Undo or start again." : "New word. Choose a letter group.";
  }

  groups.forEach(bindTarget);
  canopy.addEventListener("pointermove", (event) => {
    if (motionPaused || event.pointerType === "touch") return;
    const bounds = canopy.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    focus.style.transform = `translate(calc(-50% + ${horizontal * 14}px),calc(-50% + ${vertical * 10}px))`;
  });
  canopy.addEventListener("pointerleave", () => { focus.style.removeProperty("transform"); });
  undo.addEventListener("click", () => { sequence.pop(); selected = ""; completedTarget = null; render(); });
  reset.addEventListener("click", () => { sequence = []; selected = ""; completedTarget = null; render(); });
  speak.addEventListener("click", () => {
    if (!selected || !canSpeak) return;
    stopSpeech();
    speechSynthesis.cancel();
    const current = new SpeechSynthesisUtterance(selected);
    utterance = current;
    current.rate = 0.9;
    current.onstart = () => { if (utterance === current) root.classList.add("is-voicing"); };
    current.onend = () => {
      if (utterance !== current) return;
      utterance = null;
      root.classList.remove("is-voicing");
    };
    current.onerror = () => {
      if (utterance !== current) return;
      utterance = null;
      root.classList.remove("is-voicing");
      hint.textContent = "Voice unavailable. Your word stays here.";
    };
    speechSynthesis.speak(current);
  });

  function stop() {
    cancelDwell();
    completedTarget = null;
    dwellJustCommitted = false;
    clearTimeout(pulseTimer);
    root.classList.remove("is-resolving");
    focus.style.removeProperty("transform");
    stopSpeech();
  }

  const motion = () => {
    root.classList.toggle("motion-paused", motionPaused);
    if (motionPaused) stop();
  };
  motionListeners.add(motion);
  motion();
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop(); });
  observer.observe(root);
  const visibility = () => { if (document.hidden) stop(); };
  document.addEventListener("visibilitychange", visibility);
  cleanup.set(root, () => {
    disposed = true;
    stop();
    observer.disconnect();
    motionListeners.delete(motion);
    document.removeEventListener("visibilitychange", visibility);
  });
  render();
  return root;
}

export function createProjectArtifact(key, { compact = false } = {}) {
  if (key === "visionassist") return createVisionAssistArtifact({ compact, motionPaused });
  if (key === "gazeboard") return gazeArtifact(compact);
  throw new Error(`No project portrait for ${key}`);
}

export function releaseProjectArtifact(root) {
  if (root.classList.contains("vision-portrait")) releaseVisionAssistArtifact(root);
  cleanup.get(root)?.();
  cleanup.delete(root);
}

export function setArtifactsPaused(paused) {
  motionPaused = paused;
  setVisionAssistPaused(paused);
  motionListeners.forEach((listener) => listener());
}
