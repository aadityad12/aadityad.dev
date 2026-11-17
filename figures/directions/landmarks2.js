// Landmark drawings, second pass: hand-drawn pen, real colour, shading, and the
// small life around each place. Each draw(p, T, now) works in local units with
// (0,0) on the ground; w/h are the drawing's extent for labels and hit tests.
import { C, rect, arcPts, quadPts, quadAt, arch, clock, flag, palm, tree, walkers, bird, fog } from "./pen.js";

export const goldenGate = {
  w: 230, h: 96,
  draw(p, T) {
    const c = p.c;
    // anchorages where the bridge meets land
    for (const s of [-1, 1]) {
      p.box(s * 104 - 7, -27, 14, 27, { hatch: 1 });
      p.line([[s * 111, -27], [s * 126, -27]], { w: 0.8 });
      for (const x of [s * 114, s * 121]) p.line([[x, -27], [x, 0]], { w: 0.7 });
    }
    const cable = [[-104, -28, -78, -46, -50, -82], [-50, -82, 0, 26, 50, -82], [50, -82, 78, -46, 104, -28]];
    // suspenders first, so the deck and cables sit over them
    c.save();
    for (const [x0, y0, cx, cy, x1, y1] of cable) {
      const pts = [];
      for (let x = x0 + 3.5; x < x1 - 1; x += 3.5) pts.push([x, quadAt(x0, y0, cx, cy, x1, y1, x)]);
      c.strokeStyle = C.orangeD; c.globalAlpha = 0.75; c.lineWidth = 0.55 / p.s; c.beginPath();
      for (const [x, y] of pts) { c.moveTo(x, y); c.lineTo(x, -27); } c.stroke();
    }
    c.restore();
    // towers: two tapering legs, portal struts, a stepped cap
    for (const x0 of [-50, 50]) {
      p.box(x0 - 12, -8, 24, 8, { hatch: 1 });
      p.shape([[x0 - 9, -8], [x0 - 3.2, -8], [x0 - 3.4, -82], [x0 - 7.6, -82]], { fill: C.orange });
      p.shape([[x0 + 3.2, -8], [x0 + 9, -8], [x0 + 7.6, -82], [x0 + 3.4, -82]], { fill: C.orangeD });
      for (const y of [-34, -50, -64, -76]) p.shape(rect(x0 - 3.6, y - 2.6, 7.2, 2.6), { fill: C.orange, w: 0.8 });
      p.line([[x0 - 6, -10], [x0 - 5.5, -79]], { w: 0.5, alpha: 0.55 });
      p.line([[x0 + 6, -10], [x0 + 5.5, -79]], { w: 0.5, alpha: 0.4 });
      p.shape(rect(x0 - 8.4, -85, 16.8, 3), { fill: C.orange, w: 0.9 });
      p.dot(x0 - 6, -87, 1.3, C.coral, 0.5 + 0.5 * Math.sin(T / 300 + x0));
      p.dot(x0 + 6, -87, 1.3, C.coral, 0.5 + 0.5 * Math.sin(T / 300 + x0 + 2));
    }
    // deck with its truss
    p.shape(rect(-112, -27, 224, 4.5), { fill: C.orange });
    const tr = []; for (let i = 0, x = -111; x <= 111; x += 3.4, i++) tr.push([x, i % 2 ? -22.5 : -18.5]);
    p.line(tr, { w: 0.5, stroke: C.orangeD });
    p.line([[-112, -18.5], [112, -18.5]], { w: 0.5, stroke: C.orangeD, alpha: 0.7 });
    // traffic both ways
    const cars = ["#FFFFFF", C.ink, C.gold, "#7E74B8", C.leafD, "#FFFFFF"];
    for (let i = 0; i < 9; i++) {
      const a = ((T * 0.02 + i * 24.7) % 224) - 112, b = 112 - ((T * 0.016 + i * 26.3 + 9) % 224);
      c.fillStyle = cars[i % 6]; c.fillRect(a, -29.3, 3.2, 1.8); c.fillStyle = cars[(i + 3) % 6]; c.fillRect(b, -29.3, 3.2, 1.8);
    }
    // main cables over everything
    for (const [x0, y0, cx, cy, x1, y1] of cable) p.line(quadPts([x0, y0], [cx, cy], [x1, y1], 20), { stroke: C.orangeD, w: 1.5 });
    // the fog rolls in from the ocean side, swallows the legs, and pulls back
    fog(c, T, { x0: -190, x1: 40, y0: -6, y1: -40, n: 18 });
    for (let i = 0; i < 3; i++) bird(p, -20 + i * 9 + 30 * Math.sin(T / 5200 + i), -100 - i * 3 + 4 * Math.sin(T / 900 + i), T, i, 1.1);
  },
};

export const ferryBuilding = {
  w: 200, h: 140,
  draw(p, T, now) {
    p.line([[-104, 0], [100, 0]], { w: 0.9 });
    // Saturday market stalls at the north end
    [-95, -86, -77].forEach((x, i) => {
      p.line([[x - 3.6, 0], [x - 3.6, -5]], { w: 0.6 }); p.line([[x + 3.6, 0], [x + 3.6, -5]], { w: 0.6 });
      p.shape([[x - 4.6, -5], [x, -9.5], [x + 4.6, -5]], { fill: i === 1 ? C.gold : C.coral, w: 0.8 });
      p.shape(rect(x - 3, -3.6, 6, 3.6), { fill: C.paper, w: 0.6 });
    });
    // the long arcade
    p.box(-64, -24, 128, 24, { shade: 0 });
    p.shape(rect(-64, -24, 128, 3), { fill: C.shade, stroke: null });
    p.shape([[-66, -24], [-62, -29], [62, -29], [66, -24]], { fill: C.shade, hatch: 1 });
    for (const s of [-1, 1]) { p.box(s * 60 - 7, -31, 14, 31, { shade: s > 0 ? 0.35 : 0 }); p.shape([[s * 60 - 8, -31], [s * 60, -36], [s * 60 + 8, -31]], { fill: C.paper }); }
    for (let x = -46; x <= 46; x += 9.2) if (Math.abs(x) > 12) {
      p.shape(arch(x, 0, 5.4, 10.5), { fill: C.shade, w: 0.8 });
      p.shape(rect(x - 2, -19.5, 4, 5.5), { fill: C.shade, w: 0.6 });
    }
    // centre bay with the great arch
    p.box(-13, -40, 26, 40, { shade: 0.22 });
    p.shape(arch(0, 0, 10, 18), { fill: C.shade, hatch: 1 });
    p.line([[-14.5, -40], [14.5, -40]], { w: 1.2 });
    // tower shaft, clock stage, belfry, cupola
    p.box(-7.5, -86, 15, 46);
    for (const y of [-50, -60, -70, -80]) p.shape(rect(-1.3, y - 5, 2.6, 5), { fill: C.ink, w: 0.5 });
    p.line([[-4.8, -42], [-4.8, -84]], { w: 0.5, alpha: 0.55 });
    p.box(-9.5, -101, 19, 15);
    p.line([[-11, -86], [11, -86]], { w: 1.1 }); p.line([[-11, -101], [11, -101]], { w: 1.1 });
    clock(p, 0, -93.5, 5.2, now);
    p.box(-7.5, -114, 15, 13);
    for (const x of [-4, 0, 4]) p.shape(arch(x, -103, 2.6, 8.5), { fill: C.ink, w: 0.5 });
    p.line([[-9, -114], [9, -114]], { w: 1.1 });
    p.shape([[-8.5, -114], [0, -128], [8.5, -114]], { fill: C.paper });
    p.shape([[0, -128], [8.5, -114], [0, -114]], { fill: C.shade, stroke: null, hatch: 1 });
    p.line([[0, -128], [0, -141]], { w: 0.8 });
    flag(p, 0, -141, T, 11, 6.5);
    // pigeons on the roofline take off every so often and circle back
    const ph = (T % 12000) / 12000;
    for (let i = 0; i < 5; i++) {
      const hx = -40 + i * 18, hy = -30;
      if (ph > 0.55 && ph < 0.85) {
        const q = (ph - 0.55) / 0.3, a = q * Math.PI * 2 + i;
        bird(p, hx + Math.sin(a) * 22 + q * 10, hy - Math.sin(q * Math.PI) * 34 - Math.cos(a) * 5, T, i, 0.9);
      } else { p.dot(hx, hy - 1.3, 1.3, C.ink); p.dot(hx + 1.2, hy - 2.2, 0.7, C.ink); }
    }
    palm(p, 74, 0, 40, T, 1); palm(p, 87, 0, 33, T, 2);
    walkers(p, T, 9, -100, 98, 0, 3);
  },
};

export const campanile = {
  w: 130, h: 196,
  draw(p, T, now) {
    const c0 = p.c; c0.fillStyle = C.leaf; c0.globalAlpha = 0.55; c0.beginPath(); c0.ellipse(0, 2, 62, 3.2, 0, 0, 7); c0.fill(); c0.globalAlpha = 1;
    for (const [x, r, s] of [[-44, 12, 1], [-27, 16, 2], [29, 17, 3], [47, 12, 4]]) tree(p, x, 0, r, T, s);
    p.box(-14, -8, 28, 8, { hatch: 1 });
    p.box(-9.5, -102, 19, 94, { shade: 0.3 });
    for (const x of [-6, 6]) p.line([[x, -10], [x, -99]], { w: 0.5, alpha: 0.45 });
    for (let y = -22; y > -96; y -= 12) p.shape(rect(-1.1, y - 5.5, 2.2, 5.5), { fill: C.ink, w: 0.4 });
    p.line([[-11.5, -102], [11.5, -102]], { w: 1.2 });
    p.box(-10, -117, 20, 15);
    clock(p, 0, -109.5, 5.5, now);
    p.line([[-12, -117], [12, -117]], { w: 1.2 });
    // belfry: three tall openings with the bells inside
    p.box(-10, -142, 20, 25);
    const ring = (T % 9000) / 9000, swing = ring < 0.32 ? Math.sin(ring * 60) * 0.55 * (1 - ring / 0.32) : 0;
    for (const [i, x] of [-5.8, 0, 5.8].entries()) {
      p.shape(arch(x, -119, 4.3, 19), { fill: C.ink, w: 0.5 });
      const c = p.c; c.save(); c.translate(x, -133); c.rotate(swing * (i === 1 ? 1 : -0.8));
      p.shape([[-1.6, 4.6], [-1.2, 1], [0, 0], [1.2, 1], [1.6, 4.6]], { fill: C.gold, stroke: C.gold, w: 0.4 }); c.restore();
    }
    p.line([[-11, -119], [11, -119]], { w: 0.8 });
    p.shape(rect(-12.5, -145.5, 25, 3.5), { fill: C.paper });
    p.shape([[-11.5, -145.5], [0, -181], [11.5, -145.5]], { fill: C.paper });
    p.shape([[0, -181], [11.5, -145.5], [0, -145.5]], { fill: C.shade, stroke: null, hatch: 1 });
    p.box(-2.2, -188, 4.4, 7); p.line([[0, -188], [0, -195]], { w: 0.8 });
    // the bells ring out, and the birds on the balcony scatter
    if (ring < 0.4) {
      const c = p.c;
      for (const s of [-1, 1]) for (let k = 0; k < 2; k++) {
        const q = (ring * 2.5 + k * 0.35) % 1; c.globalAlpha = (1 - q) * 0.9; c.strokeStyle = C.coral; c.lineWidth = 1.1 / p.s;
        c.beginPath(); c.arc(s * 11, -131, 4 + q * 20, s > 0 ? -0.7 : Math.PI - 0.7, s > 0 ? 0.7 : Math.PI + 0.7); c.stroke();
      }
      c.globalAlpha = 1;
      for (let i = 0; i < 3; i++) { const q = ring / 0.4; bird(p, (i - 1) * 6 + (i - 1) * q * 46, -146 - q * 30 - i * 4, T, i, 1); }
    } else for (let i = 0; i < 3; i++) p.dot((i - 1) * 6, -147.5, 1.2, C.ink);
  },
};

export const towerHall = {
  w: 180, h: 106,
  draw(p, T) {
    const c = p.c;
    c.fillStyle = C.leaf; c.globalAlpha = 0.55; c.beginPath(); c.ellipse(0, 2, 70, 3.2, 0, 0, 7); c.fill(); c.globalAlpha = 1;
    palm(p, -76, 0, 66, T, 4);
    for (const s of [-1, 1]) {
      const x = s < 0 ? -60 : 11;
      p.box(x, -31, 49, 31, { shade: s > 0 ? 0.18 : 0 });
      p.shape(s < 0 ? [[-63, -31], [-58, -38], [-11, -38], [-11, -31]] : [[11, -31], [11, -38], [58, -38], [63, -31]], { fill: s < 0 ? C.terra : C.terraD });
      for (const y of [-33.4, -35.7]) p.line(s < 0 ? [[-61, y], [-11, y]] : [[11, y], [61, y]], { w: 0.45, alpha: 0.5 });
      for (let k = 0; k < 5; k++) {
        const ax = s * (18 + k * 8.4);
        p.shape(arch(ax, 0, 5.4, 12), { fill: C.shade, w: 0.75 });
        p.shape(rect(ax - 2, -26, 4, 6.5), { fill: C.shade, w: 0.6 });
      }
    }
    // the tower: arched door, the big window, a balcony, terracotta roof
    p.box(-12, -66, 24, 66, { shade: 0.26 });
    p.shape(arch(0, 0, 8, 15), { fill: C.shade, hatch: 1 });
    p.line([[-13, -38], [13, -38]], { w: 0.9 });
    for (let x = -10; x <= 10; x += 2.5) p.line([[x, -38], [x, -41.5]], { w: 0.4 });
    p.line([[-13, -41.5], [13, -41.5]], { w: 0.7 });
    p.shape(arch(0, -42.5, 7.5, 15), { fill: C.ink, w: 0.6 });
    p.line([[0, -43], [0, -55]], { w: 0.5, stroke: C.paper });
    p.shape(rect(-7, -31, 3, 4), { fill: C.shade, w: 0.5 }); p.shape(rect(4, -31, 3, 4), { fill: C.shade, w: 0.5 });
    p.shape(rect(-13.5, -66, 27, 3.5), { fill: C.paper });
    p.shape([[-15, -66], [0, -82], [15, -66]], { fill: C.terra });
    p.shape([[0, -82], [15, -66], [0, -66]], { fill: C.terraD, stroke: null });
    for (const y of [-70, -74, -78]) { const h = ((y + 82) / 16) * 15; p.line([[-h, y], [h, y]], { w: 0.4, alpha: 0.5 }); }
    p.line([[0, -82], [0, -100]], { w: 0.8 });
    flag(p, 0, -100, T, 11, 6.5, C.gold);
    palm(p, 76, 0, 58, T, 5);
    walkers(p, T, 7, -66, 66, 3, 1);
  },
};
