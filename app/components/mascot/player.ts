import { BOIL_COUNT, FRAMES, SLOTS } from "./frames";
import type { Frame, FrameId, Slot } from "./frames";
import { SEQUENCES } from "./sequences";
import type { SequenceName, Step } from "./sequences";

/* The director. One recursive setTimeout drives everything; interrupts clear
   it and swap the pending sequence. Every frame is a complete drawing, so
   cutting any sequence at any point is visually safe. No React, no deps. */

export type MState = "entering" | "idle" | "special" | "sleep" | "boop";

const SLEEP_MS = 45_000;
const BOIL_TICK = 250;

export class FramePlayer {
  private slots = new Map<Slot, SVGPathElement>();
  private pupil: SVGCircleElement | null;
  private svg: SVGSVGElement;

  private state: MState = "entering";
  private timer = 0;
  private disposed = false;
  private queue: Step[] = [];
  private holdFrame: FrameId = "idle";
  private holdRemaining = 0;
  private boilIdx = 0;
  private currentShown: { f: FrameId; v: number } | null = null;

  private lastInputAt = Date.now();
  private nextBlinkAt = 0;
  private nextSpecialAt = 0;
  private boops = 0;

  private pupilBase = { cx: 122, cy: 130 };
  private lerp = { x: 0, y: 0, tx: 0, ty: 0 };
  private raf = 0;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
    for (const slot of SLOTS) {
      const el = svg.querySelector<SVGPathElement>(`[data-slot="${slot}"]`);
      if (el) this.slots.set(slot, el);
    }
    this.pupil = svg.querySelector<SVGCircleElement>(".m-pupil");
  }

  start(entranceDelayMs: number) {
    const now = Date.now();
    this.nextBlinkAt = now + entranceDelayMs + 900;
    this.nextSpecialAt = now + entranceDelayMs + 6000;
    this.timer = window.setTimeout(() => {
      if (this.disposed) return;
      this.svg.classList.remove("draw"); // clear dasharray state before swaps
      this.state = "idle";
      this.play("wave"); // greeting right after the draw-in
    }, entranceDelayMs);

    const pupilTick = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(pupilTick);
      if (this.state === "sleep") return;
      this.lerp.x += (this.lerp.tx - this.lerp.x) * 0.08;
      this.lerp.y += (this.lerp.ty - this.lerp.y) * 0.08;
      if (this.pupil) {
        this.pupil.style.transform = `translate(${(this.lerp.x * 4).toFixed(2)}px, ${(this.lerp.y * 3).toFixed(2)}px)`;
      }
    };
    this.raf = requestAnimationFrame(pupilTick);

    document.addEventListener("visibilitychange", this.onVisibility);
  }

  setPupilTarget(nx: number, ny: number) {
    this.lerp.tx = Math.max(-1, Math.min(1, nx));
    this.lerp.ty = Math.max(-1, Math.min(1, ny));
  }

  notifyInput() {
    this.lastInputAt = Date.now();
    if (this.state === "sleep") {
      this.state = "idle";
      this.interrupt("wake");
    }
  }

  boop() {
    if (this.disposed || this.state === "entering") return;
    this.lastInputAt = Date.now();
    if (this.state === "sleep") {
      this.state = "idle";
      this.interrupt("wake");
      return;
    }
    this.boops += 1;
    this.state = "boop";
    this.interrupt(this.boops % 7 === 0 ? "boopRare" : "boop");
  }

  destroy() {
    this.disposed = true;
    clearTimeout(this.timer);
    cancelAnimationFrame(this.raf);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  /* ---------- internals ---------- */

  private onVisibility = () => {
    if (this.disposed) return;
    clearTimeout(this.timer);
    if (!document.hidden) {
      this.lastInputAt = Date.now(); // never wake straight into sleep-catchup
      this.timer = window.setTimeout(() => this.tick(), 120);
    }
  };

  private play(name: SequenceName) {
    this.queue = [...SEQUENCES[name]];
    clearTimeout(this.timer);
    this.tick();
  }

  private interrupt(name: SequenceName) {
    this.holdRemaining = 0;
    this.play(name);
  }

  private show(f: FrameId, variant = 0) {
    if (this.currentShown && this.currentShown.f === f && this.currentShown.v === variant) return;
    this.currentShown = { f, v: variant };
    const frame: Frame = FRAMES[f][variant % BOIL_COUNT];
    for (const slot of SLOTS) {
      const el = this.slots.get(slot);
      if (!el) continue;
      const d = frame.paths[slot];
      if (d === null) {
        el.style.display = "none";
      } else {
        if (el.getAttribute("d") !== d) el.setAttribute("d", d);
        el.style.display = "";
      }
    }
    if (this.pupil) {
      if (frame.meta.pupil) {
        this.pupil.setAttribute("cx", String(frame.meta.pupil.cx));
        this.pupil.setAttribute("cy", String(frame.meta.pupil.cy));
        this.pupil.setAttribute("r", String(frame.meta.pupil.r));
        this.pupil.style.display = "";
        this.pupilBase = { cx: frame.meta.pupil.cx, cy: frame.meta.pupil.cy };
      } else {
        this.pupil.style.display = "none";
      }
    }
    this.svg.setAttribute("data-mstate", this.state);
  }

  private tick = () => {
    if (this.disposed || document.hidden) return;

    // mid-hold boil sub-tick: re-show the same frame with the next redraw
    if (this.holdRemaining > 0) {
      const slice = Math.min(BOIL_TICK, this.holdRemaining);
      this.holdRemaining -= slice;
      this.boilIdx = (this.boilIdx + 1) % BOIL_COUNT;
      this.show(this.holdFrame, this.boilIdx);
      this.timer = window.setTimeout(this.tick, slice);
      return;
    }

    // play the next queued step
    const step = this.queue.shift();
    if (step) {
      if (step.hold > 400) {
        // long hold: shimmer through boil variants for its duration
        this.holdFrame = step.f;
        this.holdRemaining = step.hold - BOIL_TICK;
        this.show(step.f, this.boilIdx);
        this.timer = window.setTimeout(this.tick, BOIL_TICK);
      } else {
        this.show(step.f, 0);
        this.timer = window.setTimeout(this.tick, step.hold);
      }
      return;
    }

    // queue empty → director decides
    const now = Date.now();
    if (this.state === "sleep") {
      this.play("sleepLoop");
      return;
    }
    this.state = "idle";
    if (now - this.lastInputAt > SLEEP_MS) {
      this.state = "sleep";
      this.play("sleepEnter");
      return;
    }
    if (now >= this.nextBlinkAt) {
      this.nextBlinkAt = now + 2000 + Math.random() * 6000;
      this.play(Math.random() < 0.15 ? "doubleBlink" : "blink");
      return;
    }
    if (now >= this.nextSpecialAt) {
      this.nextSpecialAt = now + 6000 + Math.random() * 9000;
      this.state = "special";
      const pool: SequenceName[] = ["glanceL", "glanceR", "peerDown", "wave"];
      this.play(pool[Math.floor(Math.random() * pool.length)]);
      return;
    }
    // plain idle: boil shimmer
    this.boilIdx = (this.boilIdx + 1) % BOIL_COUNT;
    this.show("idle", this.boilIdx);
    this.timer = window.setTimeout(this.tick, 220 + Math.random() * 90);
  };
}
