"use client";

import { useEffect, useRef, useState } from "react";
import type { Quaternion, Vector3 } from "three";
import { heroForms, heroStore, useHero, type FormId, type Shown } from "./heroStore";
import { useVariant } from "./variants";

const COUNT = 150;
const SEGMENT = COUNT / heroForms.length;
type ShapeId = "knot" | "question" | FormId;
type Pose = { p: Vector3; q: Quaternion; s: Vector3; t: number };
type View = { pitch: number; yaw: number; roll: number; spin: boolean; size: number };

const views: Record<ShapeId, View> = {
  knot: { pitch: .45, yaw: 0, roll: -.22, spin: true, size: 1 },
  question: { pitch: .08, yaw: -.3, roll: 0, spin: false, size: 1 },
  accordion: { pitch: .28, yaw: -.55, roll: .1, spin: false, size: .86 },
  gazeboard: { pitch: .05, yaw: -.2, roll: 0, spin: false, size: 1 },
  rung: { pitch: .16, yaw: -.6, roll: .09, spin: false, size: .98 },
  visionassist: { pitch: .62, yaw: -.25, roll: 0, spin: false, size: 1 },
  apextracker: { pitch: .22, yaw: -.4, roll: -.05, spin: false, size: 1.02 },
};

export default function IdeaSculpture() {
  const host = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const variant = useVariant("hero");
  const mode = useRef(variant);
  const expanded = useRef(false);
  const step = useRef(-1);
  const [pulled, setPulled] = useState(false);
  const [built, setBuilt] = useState(-1);
  const [ready, setReady] = useState(false);
  const [found, setFound] = useState(false);
  const { shown, requested, locked } = useHero();
  const open = pulled && variant === "knot";

  useEffect(() => {
    mode.current = variant;
    expanded.current = open;
    step.current = variant === "wonder" ? built : -1;
    heroStore.release();
  }, [variant, open, built]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};

    async function build() {
      try {
        const [T, { RoomEnvironment }] = await Promise.all([
          import("three"),
          import("three/addons/environments/RoomEnvironment.js"),
        ]);
        if (disposed || !element) return;
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.7));
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        renderer.domElement.setAttribute("aria-hidden", "true");
        element.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(37, 1, .1, 40);
        camera.position.set(0, 0, 7.8);
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room, .03);
        scene.environment = environment.texture;
        room.dispose();
        const group = new T.Group();
        scene.add(group);

        // One mesh. A per-plate "tint" blends brushed silver into orange, so a
        // plate can change colour mid-flight instead of popping.
        const geometry = new T.BoxGeometry(.57, .57, .045);
        const tint = new T.InstancedBufferAttribute(new Float32Array(COUNT), 1);
        tint.setUsage(T.DynamicDrawUsage);
        geometry.setAttribute("aTint", tint);
        const material = new T.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .24, envMapIntensity: 1.2 });
        material.onBeforeCompile = shader => {
          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nattribute float aTint;\nvarying float vTint;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTint = aTint;");
          shader.fragmentShader = shader.fragmentShader
            .replace("#include <common>", "#include <common>\nvarying float vTint;")
            .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb = mix(vec3(.69, .705, .665), vec3(1., .12, .025), vTint);")
            .replace("#include <metalnessmap_fragment>", "#include <metalnessmap_fragment>\nmetalnessFactor = mix(1., .58, vTint);");
        };
        const plates = new T.InstancedMesh(geometry, material, COUNT);
        plates.instanceMatrix.setUsage(T.DynamicDrawUsage);
        plates.frustumCulled = false;
        group.add(plates);

        const light = new T.DirectionalLight(0xfff4df, 4);
        light.position.set(-3, 5, 4);
        const edgeLight = new T.DirectionalLight(0xff672f, 2.5);
        edgeLight.position.set(4, -2, -2);
        scene.add(light, edgeLight, new T.AmbientLight(0xffffff, .3));

        // ---------- shapes: every one places the same 150 plates ----------
        const X = new T.Vector3(1, 0, 0), Y = new T.Vector3(0, 1, 0), Z = new T.Vector3(0, 0, 1);
        const m4 = new T.Matrix4(), v1 = new T.Vector3(), v2 = new T.Vector3(), q1 = new T.Quaternion();
        const basis = (q: Quaternion, x: Vector3, y: Vector3, z: Vector3) => q.setFromRotationMatrix(m4.makeBasis(x, y, z));
        const pose = (): Pose => ({ p: new T.Vector3(), q: new T.Quaternion(), s: new T.Vector3(1, 1, 1), t: 0 });
        const from = Array.from({ length: COUNT }, pose);
        const current = Array.from({ length: COUNT }, pose);
        const target = pose();
        let pointerX = 0, pointerY = 0, hoverSegment = -1, pointed = -1, spread = 0, time = 0;

        const knotPoint = (u: number, out: Vector3) => out.set(
          (2 + Math.cos(3 * u)) * Math.cos(2 * u) * .57,
          (2 + Math.cos(3 * u)) * Math.sin(2 * u) * .57,
          Math.sin(3 * u) * .68,
        );
        const knotPositions = Array.from({ length: COUNT }, (_, i) => knotPoint(i / COUNT * Math.PI * 2, new T.Vector3()));
        const knotTangents = knotPositions.map((p, i) => knotPoint(i / COUNT * Math.PI * 2 + .001, new T.Vector3()).sub(p).normalize());
        const segmentCentres = heroForms.map((_, k) => knotPositions.slice(k * SEGMENT, (k + 1) * SEGMENT).reduce((sum, p) => sum.add(p), new T.Vector3()).multiplyScalar(1 / SEGMENT));

        // Evenly spaced points and directions along any curve.
        function along(curve: (v: number, out: Vector3) => Vector3, count: number) {
          const samples = Array.from({ length: 500 }, (_, k) => curve(k / 499, new T.Vector3()));
          const lengths = [0];
          for (let k = 1; k < samples.length; k++) lengths.push(lengths[k - 1] + samples[k].distanceTo(samples[k - 1]));
          const total = lengths[lengths.length - 1];
          let k = 1;
          return Array.from({ length: count }, (_, n) => {
            const want = total * (n + .5) / count;
            while (k < samples.length - 1 && lengths[k] < want) k++;
            const mix = (want - lengths[k - 1]) / (lengths[k] - lengths[k - 1] || 1);
            return { point: samples[k - 1].clone().lerp(samples[k], mix), direction: samples[k].clone().sub(samples[k - 1]).normalize() };
          });
        }
        const HOOK = 118;
        const hook = along((v, out) => {
          if (v < .72) { const a = (165 - 210 * v / .72) * Math.PI / 180; return out.set(.92 * Math.cos(a), .72 + .92 * Math.sin(a), 0); }
          const w = (v - .72) / .28, a = 1 - w;
          return out.set(a * a * .65, a * a * .07 + 2 * a * w * -.3 + w * w * -.85, 0);
        }, HOOK);

        const fold = new Float32Array(COUNT), foldY = new Float32Array(COUNT);
        let foldHeight = 0;
        const day = (i: number) => { const n = Math.sin(i * 127.1) * 43758.5453; return n - Math.floor(n); };

        const shapes: Record<ShapeId, { prepare?: () => void; place: (i: number, out: Pose) => void }> = {
          knot: { place(i, out) {
            const u = i / COUNT * Math.PI * 2, segment = Math.floor(i / SEGMENT), labelled = mode.current === "knot";
            out.p.copy(knotPositions[i]).multiplyScalar(1 + spread * .26);
            out.p.z += Math.sin(u * 4 + time * .4) * spread * .3;
            if (labelled) out.p.addScaledVector(segmentCentres[segment], spread * .5);
            out.q.setFromUnitVectors(Z, knotTangents[i]).multiply(q1.setFromAxisAngle(Z, u * .5 + spread * Math.sin(u) * .7));
            const lifted = labelled && segment === hoverSegment;
            out.s.setScalar((1 - spread * .17) * (lifted ? 1.12 : 1));
            out.t = labelled && hoverSegment >= 0 ? (lifted ? 1 : 0) : (i > 18 && i < 43 || i > 88 && i < 103 ? 1 : 0);
          } },
          question: { place(i, out) {
            if (i < HOOK) {
              const { point, direction } = hook[i];
              out.p.copy(point);
              basis(out.q, v1.set(-direction.y, direction.x, 0), Z, direction).multiply(q1.setFromAxisAngle(Z, Math.sin(i * .11 + time * .8) * .22));
              out.s.setScalar(.92);
              out.t = 0;
            } else {
              const a = (i - HOOK) / (COUNT - HOOK) * Math.PI * 2, bob = Math.sin(time * 1.6) * .04;
              out.p.set(Math.cos(a) * .19, -1.5 + Math.sin(a) * .19 + bob, 0);
              basis(out.q, v1.set(Math.cos(a), Math.sin(a), 0), Z, v2.set(Math.sin(a), -Math.cos(a), 0));
              out.s.setScalar(.6);
              out.t = 1;
            }
          } },
          // A long strip of pleats. A wave runs up it, opening each fold and closing it again.
          accordion: {
            prepare() {
              const wave = (time * 20) % (COUNT + 70) - 35;
              let y = 0;
              for (let i = 0; i < COUNT; i++) {
                fold[i] = .014 + .115 * Math.exp(-(((i - wave) / 11) ** 2));
                const rise = Math.max(.0185, 1.05 * Math.sin(fold[i]));
                foldY[i] = y + rise / 2;
                y += rise;
              }
              foldHeight = y;
            },
            place(i, out) {
              const side = i % 2 ? 1 : -1, y = foldY[i] - foldHeight / 2;
              out.p.set(Math.sin(y * 1.1 + time * .5) * .1, y, 0);
              basis(out.q, v1.set(Math.cos(fold[i]), side * Math.sin(fold[i]), 0), Z, v2.set(side * Math.sin(fold[i]), -Math.cos(fold[i]), 0));
              out.s.set(1.85, 1.7, .4);
              out.t = i >= COUNT - 24 || i > 68 && i < 74 ? 1 : 0;
            },
          },
          // An iris. The pupil looks where the pointer is.
          gazeboard: { place(i, out) {
            const outer = i < 96, a = (outer ? i / 96 : (i - 96) / 54) * Math.PI * 2, radius = outer ? 1.38 : .5;
            const dwell = Math.max(0, Math.sin(time * 1.5)) ** 8;
            out.p.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
            if (!outer) { out.p.x += pointerX * 1.25; out.p.y -= pointerY * 1.25; out.p.z = .28; }
            basis(out.q, v1.set(Math.cos(a), Math.sin(a), 0), Z, v2.set(Math.sin(a), -Math.cos(a), 0)).multiply(q1.setFromAxisAngle(X, outer ? .5 : -.35));
            out.s.setScalar(outer ? 1.05 : .78 + dwell * .16);
            out.t = outer ? 0 : 1;
          } },
          // A nine-rung ladder. A light climbs it and stays on the top rung.
          rung: { place(i, out) {
            if (i < 78) {
              const side = i % 2 ? 1 : -1, level = Math.floor(i / 2);
              out.p.set(side * .62, -1.75 + level * 3.5 / 38, 0);
              basis(out.q, X, v1.set(0, 0, -1), Y);
              out.s.set(.32, .32, 1.7);
              out.t = 0;
            } else {
              const rung = Math.floor((i - 78) / 8), column = (i - 78) % 8, climbed = Math.min(8, Math.floor((time * 2.2) % 15));
              out.p.set(-.5 + column / 7, -1.4 + rung * .35, 0);
              basis(out.q, v1.set(0, 0, -1), Y, X);
              out.s.set(.3, .3, 2.7);
              out.t = rung === climbed || rung === 8 && climbed >= 8 ? 1 : 0;
            }
          } },
          // Five wavefronts leaving one point: what is ahead, nearest first.
          visionassist: { place(i, out) {
            const arc = Math.floor(i / 30), a = (-.5 + (i % 30) / 29) * 1.25, radius = .7 + arc * .62;
            const pulse = Math.max(0, Math.sin(time * 2.4 - arc * 1.1)) ** 4;
            out.p.set(-1.65 + radius * Math.cos(a), -.1, radius * Math.sin(a));
            basis(out.q, v1.set(Math.sin(a), 0, -Math.cos(a)), Y, v2.set(Math.cos(a), 0, Math.sin(a)));
            out.s.set(.44, .5 + pulse * .55, 1.2);
            out.t = arc === 0 ? 1 : 0;
          } },
          // Twenty-one weeks of days. The good ones stand a little taller.
          apextracker: { place(i, out) {
            if (i >= 147) { out.p.set(1.9, -.57, 0); out.q.identity(); out.s.setScalar(.001); out.t = 0; return; }
            const column = Math.floor(i / 7), row = i % 7, reached = i < (time * 16) % 230;
            const met = day(i) < .22 + column / 20 * .62;
            out.p.set((column - 10) * .19, (3 - row) * .19, reached ? (met ? .2 : .05) : 0);
            out.q.identity();
            out.s.set(.29, .29, reached && met ? 3 : 1);
            out.t = reached && met ? 1 : 0;
          } },
        };

        // ---------- which shape, and the flight between two of them ----------
        const reduced = matchMedia("(prefers-reduced-motion: reduce)");
        let shape: ShapeId = mode.current === "wonder" ? "question" : "knot";
        let morph = 1, yaw = 0, tiltX = 0, tiltY = 0, size = 1, pitch = views[shape].pitch, roll = views[shape].roll;
        let paused = false, visible = true, frame = 0, last = 0, idle = 0, tour = -1, ripple = -10, rippleAt = 0;
        let dragging = false, dragX = 0, spin = 0, typed = "", egg = 0;

        function choose(): ShapeId {
          const { requested } = heroStore.get();
          const rest: ShapeId = mode.current === "wonder" ? "question" : "knot";
          if (egg > 0) return "question";
          if (mode.current === "knot") return "knot";
          if (requested) return requested;
          if (mode.current === "wonder") return step.current >= 0 ? heroForms[step.current].id : rest;
          return tour >= 0 ? heroForms[tour].id : rest;
        }
        function go(next: ShapeId) {
          if (next === shape) return;
          current.forEach((pose, i) => { from[i].p.copy(pose.p); from[i].q.copy(pose.q); from[i].s.copy(pose.s); from[i].t = pose.t; });
          shape = next;
          morph = 0;
          heroStore.show(next === "knot" ? null : next);
        }
        heroStore.show(shape === "knot" ? null : shape);

        const ray = new T.Raycaster(), pointer = new T.Vector2();
        function plateAt(event: PointerEvent) {
          const rect = element!.getBoundingClientRect();
          pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
          ray.setFromCamera(pointer, camera);
          plates.boundingSphere = null;
          return ray.intersectObject(plates)[0]?.instanceId ?? -1;
        }
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / rect.width - .5) * .7;
          pointerY = ((event.clientY - rect.top) / rect.height - .5) * .5;
          if (dragging) { spin += (event.clientX - dragX) * .0009; dragX = event.clientX; }
          if (mode.current === "knot") {
            const plate = plateAt(event);
            pointed = plate < 0 ? -1 : Math.floor(plate / SEGMENT);
            element.style.cursor = pointed >= 0 ? "pointer" : "";
          }
          idle = 0;
        };
        const leave = () => { pointerX = 0; pointerY = 0; pointed = -1; dragging = false; };
        const down = (event: PointerEvent) => { dragging = true; dragX = event.clientX; };
        const up = (event: PointerEvent) => {
          dragging = false;
          const plate = plateAt(event);
          if (plate < 0) return;
          ripple = time; rippleAt = plate;
          if (mode.current === "knot" && Math.abs(spin) < .004) document.getElementById(heroForms[Math.floor(plate / SEGMENT)].id)?.scrollIntoView();
        };
        // Type "why" anywhere on the page and the object asks it back.
        const key = (event: KeyboardEvent) => {
          if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
          typed = (typed + event.key.toLowerCase()).slice(-3);
          if (typed === "why") { egg = 5; setFound(true); }
        };
        const motion = (event: Event) => { paused = (event as CustomEvent).detail.paused; };
        const resize = () => {
          const { width, height } = element.getBoundingClientRect();
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(element);
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        observer.observe(element);
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        element.addEventListener("pointerdown", down);
        element.addEventListener("pointerup", up);
        addEventListener("keydown", key);
        addEventListener("sol-motion", motion);
        resize();

        const dummy = new T.Object3D(), world = new T.Vector3();
        const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
        const animate = (now: number) => {
          frame = requestAnimationFrame(animate);
          const delta = last ? Math.min((now - last) / 1000, .05) : 0;
          last = now;
          if (!visible || document.hidden) return;
          const still = reduced.matches || paused;
          if (!still) time += delta;
          if (egg > 0) { egg -= delta; if (egg <= 0) setFound(false); }

          // The tour: left alone, the shape-shifter walks through the five projects.
          if (mode.current === "shift" && !still && !heroStore.get().requested) {
            idle += delta;
            const beat = Math.floor((idle - 3.5) / 5.2);
            tour = idle < 3.5 ? -1 : beat % 6 === 5 ? -1 : beat % 6;
          } else if (heroStore.get().requested) { idle = 0; tour = -1; }
          go(choose());
          // In the labelled knot, a phrase in the headline points at its stretch too.
          const asked = heroStore.get().requested;
          hoverSegment = mode.current !== "knot" ? -1 : pointed >= 0 ? pointed : heroForms.findIndex(item => item.id === asked);

          const smooth = still ? 1 : .055;
          spread += ((expanded.current ? 1 : 0) - spread) * smooth;
          morph = Math.min(1, morph + (still ? 1 : delta / 1.5));
          const view = views[shape];
          tiltX += (pointerY - tiltX) * smooth;
          tiltY += (pointerX - tiltY) * smooth;
          spin *= dragging ? .8 : .95;
          if (view.spin) yaw += still ? 0 : delta * .16;
          else yaw += (view.yaw + Math.PI * 2 * Math.round((yaw - view.yaw) / (Math.PI * 2)) - yaw) * smooth * 1.4;
          yaw += spin;
          pitch += (view.pitch - pitch) * smooth;
          roll += (view.roll - roll) * smooth;
          size += (view.size - size) * smooth;
          group.rotation.set(pitch + tiltX + Math.sin(time * .25) * .1, yaw + tiltY + (view.spin ? 0 : Math.sin(time * .35) * .16), roll + Math.sin(time * .17) * .08);
          group.position.y = still ? 0 : Math.sin(time * .7) * .08;
          group.scale.setScalar(size);

          shapes[shape].prepare?.();
          const tints = tint.array as Float32Array;
          for (let i = 0; i < COUNT; i++) {
            const pose = current[i];
            shapes[shape].place(i, target);
            if (morph < 1) {
              // Plates leave in a wave and swing wide before they land.
              const e = ease(Math.min(1, Math.max(0, morph * 1.55 - i / COUNT * .55)));
              pose.p.lerpVectors(from[i].p, target.p, e).multiplyScalar(1 + Math.sin(e * Math.PI) * .2);
              pose.q.slerpQuaternions(from[i].q, target.q, e);
              pose.s.lerpVectors(from[i].s, target.s, e);
              pose.t = from[i].t + (target.t - from[i].t) * e;
            } else {
              pose.p.copy(target.p); pose.q.copy(target.q); pose.s.copy(target.s);
              pose.t += (target.t - pose.t) * (still ? 1 : .12);
            }
            // A click sends one ripple down the line of plates.
            const distance = Math.min(Math.abs(i - rippleAt), COUNT - Math.abs(i - rippleAt));
            const bump = Math.exp(-(((distance - (time - ripple) * 70) / 5) ** 2)) * Math.max(0, 1 - (time - ripple) / 1.3);
            dummy.position.copy(pose.p);
            dummy.quaternion.copy(pose.q);
            dummy.scale.copy(pose.s).multiplyScalar(1 + bump * .45);
            dummy.updateMatrix();
            plates.setMatrixAt(i, dummy.matrix);
            tints[i] = Math.min(1, pose.t + bump);
          }
          plates.instanceMatrix.needsUpdate = true;
          tint.needsUpdate = true;
          renderer.render(scene, camera);

          // Name each stretch of the knot, where it currently is on screen.
          const { width, height } = renderer.domElement.getBoundingClientRect();
          labels.current.forEach((label, k) => {
            if (!label) return;
            const on = mode.current === "knot" && shape === "knot" && (spread > .5 || hoverSegment === k);
            label.classList.toggle("is-on", on);
            if (!on) return;
            world.set(0, 0, 0);
            for (let i = k * SEGMENT; i < (k + 1) * SEGMENT; i++) world.add(current[i].p);
            world.multiplyScalar(1 / SEGMENT * 1.18).applyMatrix4(group.matrixWorld).project(camera);
            label.style.transform = `translate(-50%, -50%) translate(${((world.x + 1) / 2 * width).toFixed(1)}px, ${((1 - world.y) / 2 * height).toFixed(1)}px)`;
          });
        };
        frame = requestAnimationFrame(animate);
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          resizeObserver.disconnect();
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
          element.removeEventListener("pointerdown", down);
          element.removeEventListener("pointerup", up);
          removeEventListener("keydown", key);
          removeEventListener("sol-motion", motion);
          geometry.dispose();
          material.dispose();
          environment.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        // The CSS sculpture remains a complete fallback without WebGL.
      }
    }
    void build();
    return () => { disposed = true; cleanup(); };
  }, []);

  const form = heroForms.find(item => item.id === shown);
  const note = found ? "GOOD QUESTION. THAT’S HOW ALL OF THIS STARTED." : shown === "question" ? "EVERY ONE OF THESE STARTED AS A QUESTION." : null;
  const active = (id: Shown) => locked && requested === id;

  return <div className={`idea-sculpture hero-${variant} ${ready ? "is-ready" : ""} ${open ? "is-open" : ""}`}>
    <div className="sculpture-halo" />
    <div className="sculpture-fallback" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
    <div className="sculpture-canvas" ref={host} role="img" aria-label="A slowly turning loop of silver and orange plates. The same plates rebuild themselves into a shape for each project." />
    {variant === "knot" && <div className="sculpture-labels">{heroForms.map((item, k) => <button key={item.id} ref={node => { labels.current[k] = node; }} tabIndex={open ? 0 : -1} onClick={() => document.getElementById(item.id)?.scrollIntoView()}><span>{item.number}</span>{item.name}<small>{item.line}</small></button>)}</div>}
    <div className="sculpture-foot">
      {form ? <a className="sculpture-note is-link" href={`#${form.id}`}><span>{form.number} / {form.name.toUpperCase()}</span>{form.line.toUpperCase()}. <b>SEE IT ↓</b></a>
        : <span className="sculpture-note">{note ?? (variant === "knot" ? "FIVE STRETCHES. FIVE THINGS I BUILT." : "A LITTLE CURIOSITY GOES A LONG WAY.")}</span>}
      {variant === "shift" && <div className="sculpture-chips" role="group" aria-label="Rebuild the object as a project" onPointerLeave={() => heroStore.preview(null)}>{heroForms.map(item => <button key={item.id} aria-pressed={active(item.id)} className={shown === item.id ? "is-shown" : ""} aria-label={`${item.name}: ${item.line}`} onPointerEnter={event => { if (event.pointerType === "mouse") heroStore.preview(item.id); }} onFocus={() => heroStore.preview(item.id)} onBlur={() => heroStore.preview(null)} onClick={() => heroStore.toggle(item.id)}>{item.number}</button>)}</div>}
      {variant === "knot" && <button className="sculpture-control" aria-pressed={open} onClick={() => setPulled(!open)}><span>{open ? "Put it together" : "Pull it apart"}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button>}
      {variant === "wonder" && <button className="sculpture-control" onClick={() => setBuilt(built >= heroForms.length - 1 ? -1 : built + 1)}><span>{built < 0 ? "Then I build" : built >= heroForms.length - 1 ? "Back to the question" : "And then"}</span><span aria-hidden="true">→</span></button>}
    </div>
  </div>;
}
