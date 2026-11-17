"use client";

import { useEffect, useRef, useState } from "react";

export default function IdeaSculpture() {
  const host = useRef<HTMLDivElement>(null);
  const expanded = useRef(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

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

        const silver = new T.MeshStandardMaterial({ color: 0xd9dbd5, metalness: 1, roughness: .23, envMapIntensity: 1.1 });
        const orange = new T.MeshStandardMaterial({ color: 0xff612c, metalness: .58, roughness: .25, envMapIntensity: 1.5 });
        const count = 142;
        const geometry = new T.BoxGeometry(.57, .57, .045, 1, 1, 1);
        const ribs = new T.InstancedMesh(geometry, silver, count);
        const accents = new T.InstancedMesh(geometry, orange, count);
        ribs.instanceMatrix.setUsage(T.DynamicDrawUsage);
        accents.instanceMatrix.setUsage(T.DynamicDrawUsage);
        group.add(ribs, accents);

        const point = (u: number) => new T.Vector3(
          (2 + Math.cos(3 * u)) * Math.cos(2 * u) * .57,
          (2 + Math.cos(3 * u)) * Math.sin(2 * u) * .57,
          Math.sin(3 * u) * .68,
        );
        const positions = Array.from({ length: count }, (_, i) => point(i / count * Math.PI * 2));
        const tangents = positions.map((p, i) => point(i / count * Math.PI * 2 + .001).sub(p).normalize());
        const dummy = new T.Object3D();
        const axis = new T.Vector3(0, 0, 1);
        const zero = new T.Matrix4().makeScale(0, 0, 0);
        const light = new T.DirectionalLight(0xfff4df, 4);
        light.position.set(-3, 5, 4);
        scene.add(light, new T.AmbientLight(0xffffff, .3));
        const edgeLight = new T.DirectionalLight(0xff672f, 2.5);
        edgeLight.position.set(4, -2, -2);
        scene.add(edgeLight);

        const media = matchMedia("(prefers-reduced-motion: reduce)");
        let pointerX = 0, pointerY = 0, rotationX = 0, rotationY = 0, spread = 0;
        let visible = true, frame = 0, last = 0, elapsed = 0;
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          pointerX = ((event.clientX - rect.left) / rect.width - .5) * .7;
          pointerY = ((event.clientY - rect.top) / rect.height - .5) * .5;
        };
        const leave = () => { pointerX = 0; pointerY = 0; };
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
        resize();
        const animate = (now: number) => {
          frame = requestAnimationFrame(animate);
          const delta = last ? Math.min((now - last) / 1000, .05) : 0;
          last = now;
          if (!visible || document.hidden) return;
          if (!media.matches) elapsed += delta;
          const smooth = media.matches ? 1 : .055;
          spread += ((expanded.current ? 1 : 0) - spread) * smooth;
          rotationX += (pointerY - rotationX) * smooth;
          rotationY += (pointerX - rotationY) * smooth;
          group.rotation.set(.45 + rotationX + Math.sin(elapsed * .25) * .13, elapsed * .16 + rotationY, -.22 + Math.sin(elapsed * .17) * .1);
          group.position.y = media.matches ? 0 : Math.sin(elapsed * .7) * .08;
          positions.forEach((p, i) => {
            const u = i / count * Math.PI * 2;
            dummy.position.copy(p).multiplyScalar(1 + spread * .26);
            dummy.position.z += Math.sin(u * 4 + elapsed * .4) * spread * .3;
            dummy.quaternion.setFromUnitVectors(axis, tangents[i]);
            dummy.rotateZ(u * .5 + spread * Math.sin(u) * .7);
            dummy.scale.setScalar(1 - spread * .17);
            dummy.updateMatrix();
            const accented = i > 18 && i < 43 || i > 88 && i < 103;
            ribs.setMatrixAt(i, accented ? zero : dummy.matrix);
            accents.setMatrixAt(i, accented ? dummy.matrix : zero);
          });
          ribs.instanceMatrix.needsUpdate = true;
          accents.instanceMatrix.needsUpdate = true;
          renderer.render(scene, camera);
        };
        frame = requestAnimationFrame(animate);
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          resizeObserver.disconnect();
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
          geometry.dispose();
          silver.dispose();
          orange.dispose();
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

  return <div className={`idea-sculpture ${ready ? "is-ready" : ""} ${open ? "is-open" : ""}`}>
    <div className="sculpture-halo" />
    <div className="sculpture-fallback" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
    <div className="sculpture-canvas" ref={host} role="img" aria-label="A living, rotating loop of silver and orange plates. Move your pointer to turn it, or pull it apart." />
    <span className="sculpture-note">A LITTLE CURIOSITY GOES A LONG WAY.</span>
    <button className="sculpture-control" aria-pressed={open} onClick={() => { expanded.current = !open; setOpen(!open); }}><span>{open ? "Put it together" : "Pull it apart"}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button>
  </div>;
}
