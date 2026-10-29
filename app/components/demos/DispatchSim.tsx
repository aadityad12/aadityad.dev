"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UType = "fire" | "ems" | "police" | "tanker";
type CType = "medical" | "fire" | "crime" | "structure fire";

type Unit = { id: string; type: UType; x: number; y: number; busy: boolean };
type Call = {
  id: number;
  type: CType;
  sev: 1 | 2 | 3;
  x: number;
  y: number;
  status: "queued" | "assigned" | "hold" | "done";
  unit?: string;
  eta?: number;
  holdLeft?: number;
};
type LogEntry = { t: string; text: string; cls: "" | "ok" | "warn" | "crit" };
type Sim = {
  tick: number;
  nextId: number;
  units: Unit[];
  calls: Call[];
  log: LogEntry[];
  spawnTimes: number[];
  mode: "ASSISTED" | "SURGE";
  holdCall: number | null;
};

const UNITS: Unit[] = [
  { id: "E-1", type: "fire", x: 60, y: 70, busy: false },
  { id: "E-2", type: "fire", x: 320, y: 220, busy: false },
  { id: "M-1", type: "ems", x: 130, y: 240, busy: false },
  { id: "M-2", type: "ems", x: 300, y: 60, busy: false },
  { id: "P-1", type: "police", x: 200, y: 140, busy: false },
  { id: "P-2", type: "police", x: 40, y: 180, busy: false },
  { id: "P-3", type: "police", x: 360, y: 120, busy: false },
  { id: "T-1", type: "tanker", x: 210, y: 30, busy: false },
];

const UNIT_COLOR: Record<UType, string> = {
  fire: "#ff5a4d",
  ems: "#59c98a",
  police: "#6ea8ff",
  tanker: "#ffb545",
};

const CALL_COLOR: Record<number, string> = { 1: "#ff5a4d", 2: "#ffb545", 3: "#7d8378" };

const CALL_POOL: { type: CType; sev: 1 | 2 | 3; weight: number }[] = [
  { type: "medical", sev: 2, weight: 4 },
  { type: "medical", sev: 1, weight: 1 },
  { type: "crime", sev: 3, weight: 3 },
  { type: "crime", sev: 2, weight: 2 },
  { type: "fire", sev: 2, weight: 2 },
  { type: "fire", sev: 1, weight: 1 },
  { type: "structure fire", sev: 1, weight: 0.55 },
];

const NEEDED: Record<CType, UType> = {
  medical: "ems",
  fire: "fire",
  crime: "police",
  "structure fire": "tanker",
};

const TICK_MS = 500;
const HOLD_TICKS = 50; // 25 s in demo time, scaled from the real 60 s
const MAX_ACTIVE = 7;

const initial = (): Sim => ({
  tick: 0,
  nextId: 101,
  units: UNITS.map((u) => ({ ...u })),
  calls: [],
  log: [{ t: "00:00", text: "CONSOLE ONLINE — 8 UNITS, 20 SECTORS, SYNTHETIC TRAFFIC", cls: "ok" }],
  spawnTimes: [],
  mode: "ASSISTED",
  holdCall: null,
});

function fmt(ticks: number) {
  const s = Math.floor((ticks * TICK_MS) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function clone(prev: Sim): Sim {
  return {
    ...prev,
    units: prev.units.map((u) => ({ ...u })),
    calls: prev.calls.map((c) => ({ ...c })),
    log: [...prev.log],
    spawnTimes: [...prev.spawnTimes],
  };
}

function pushLog(s: Sim, text: string, cls: LogEntry["cls"] = "") {
  s.log.push({ t: fmt(s.tick), text, cls });
  if (s.log.length > 60) s.log.splice(0, s.log.length - 60);
}

function pickCall(): { type: CType; sev: 1 | 2 | 3 } {
  const total = CALL_POOL.reduce((a, c) => a + c.weight, 0);
  let r = Math.random() * total;
  for (const c of CALL_POOL) {
    r -= c.weight;
    if (r <= 0) return { type: c.type, sev: c.sev };
  }
  return { type: "medical", sev: 2 };
}

export default function DispatchSim() {
  const [sim, setSim] = useState<Sim>(initial);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  const manualPause = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const step = useCallback(() => {
    setSim((prev) => {
      const s = clone(prev);
      s.tick++;

      // surge waves: brief storms of calls every ~25 s
      const inSurgeWave = s.tick % 50 >= 30 && s.tick % 50 <= 44;
      const p = inSurgeWave ? 0.55 : 0.16;

      const active = s.calls.filter((c) => c.status !== "done");
      if (Math.random() < p && active.length < MAX_ACTIVE) {
        const { type, sev } = pickCall();
        const call: Call = {
          id: s.nextId++,
          type,
          sev,
          x: 20 + Math.random() * 360,
          y: 20 + Math.random() * 260,
          status: "queued",
        };
        s.calls.push(call);
        s.spawnTimes.push(s.tick);
        pushLog(s, `CALL #${call.id} ${type.toUpperCase()} · SEV ${sev} → TRIAGE OK`, sev === 1 ? "warn" : "");
        if (s.calls.length > 30) {
          const firstLive = s.calls.findIndex((c) => c.status !== "done");
          s.calls.splice(0, Math.max(1, firstLive));
        }
      }

      // sliding-window surge detection (scaled: 30-tick window)
      const windowStart = s.tick - 30;
      s.spawnTimes = s.spawnTimes.filter((t) => t >= windowStart);
      const rate = s.spawnTimes.length;
      if (s.mode === "ASSISTED" && rate >= 6) {
        s.mode = "SURGE";
        pushLog(s, `MONITOR: ${rate} CALLS IN WINDOW > THRESHOLD → SURGE MODE`, "crit");
      } else if (s.mode === "SURGE" && rate <= 3) {
        s.mode = "ASSISTED";
        pushLog(s, `MONITOR: RATE SUBSIDED → ASSISTED MODE`, "ok");
      }

      // assign queued calls to nearest free unit of the right type
      for (const call of s.calls) {
        if (call.status !== "queued") continue;
        const need = NEEDED[call.type];
        if (need === "tanker") {
          const tanker = s.units.find((u) => u.type === "tanker");
          if (!tanker || tanker.busy) continue;
          if (s.holdCall !== null) continue; // one hold at a time
          tanker.busy = true;
          call.status = "hold";
          call.unit = tanker.id;
          call.holdLeft = HOLD_TICKS;
          s.holdCall = call.id;
          pushLog(s, `RESOURCE: CALL #${call.id} NEEDS HEAVY ASSET → HOLD_REQUIRED (T-1 RESERVED)`, "warn");
          continue;
        }
        const free = s.units.filter((u) => u.type === need && !u.busy);
        if (!free.length) continue;
        free.sort((a, b) => Math.hypot(a.x - call.x, a.y - call.y) - Math.hypot(b.x - call.x, b.y - call.y));
        const unit = free[0];
        unit.busy = true;
        call.status = "assigned";
        call.unit = unit.id;
        call.eta = Math.max(3, Math.round(Math.hypot(unit.x - call.x, unit.y - call.y) / 14));
        pushLog(s, `RESOURCE: ${unit.id} → CALL #${call.id} · ETA ${Math.max(1, Math.round((call.eta * TICK_MS) / 1000))}s`, "ok");
      }

      // progress assignments and holds
      for (const call of s.calls) {
        if (call.status === "hold" && call.holdLeft !== undefined) {
          call.holdLeft--;
          if (call.holdLeft <= 0) {
            const unit = s.units.find((u) => u.id === call.unit);
            if (unit) unit.busy = false;
            call.status = "queued";
            call.unit = undefined;
            call.holdLeft = undefined;
            s.holdCall = null;
            pushLog(s, `HOLD #${call.id} TIMED OUT — T-1 RETURNED TO POOL, NEAREST ENGINE DISPATCHED`, "warn");
          }
        }
        if (call.status === "assigned" && call.eta !== undefined) {
          call.eta--;
          if (call.eta <= 0) {
            call.status = "done";
            const unit = s.units.find((u) => u.id === call.unit);
            if (unit) unit.busy = false;
            pushLog(s, `CALL #${call.id} CLOSED — ${call.unit} ON SCENE, THEN CLEARED`);
          }
        }
      }
      return s;
    });
  }, []);

  const approveHold = (approve: boolean) => {
    setSim((prev) => {
      const s = clone(prev);
      const call = s.calls.find((c) => c.id === s.holdCall);
      if (!call) return prev;
      if (approve) {
        call.status = "assigned";
        call.eta = 14;
        call.holdLeft = undefined;
        s.holdCall = null;
        pushLog(s, `DISPATCHER APPROVED — T-1 AIRBORNE FOR CALL #${call.id}`, "ok");
      } else {
        const unit = s.units.find((u) => u.id === call.unit);
        if (unit) unit.busy = false;
        call.status = "queued";
        call.unit = undefined;
        call.holdLeft = undefined;
        s.holdCall = null;
        pushLog(s, `DISPATCHER DENIED HOLD — T-1 RELEASED, CALL #${call.id} → NEAREST ENGINE`, "warn");
      }
      return s;
    });
  };

  const toggleRun = () => {
    manualPause.current = running;
    runningRef.current = !running;
    setRunning(!running);
  };

  const resetSim = () => setSim(initial());

  // pause when tab hidden or panel scrolled out of view
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        runningRef.current = false;
      } else if (!manualPause.current) {
        runningRef.current = true;
      }
      setRunning(runningRef.current);
    };
    document.addEventListener("visibilitychange", onVis);
    const el = rootRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (!visible) {
          runningRef.current = false;
        } else if (!manualPause.current && !document.hidden) {
          runningRef.current = true;
        }
        setRunning(runningRef.current);
      },
      { threshold: 0 },
    );
    if (el) io.observe(el);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (runningRef.current) step();
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [step]);

  const activeCalls = sim.calls.filter((c) => c.status !== "done");
  const freeUnits = sim.units.filter((u) => !u.busy);
  const hold = sim.calls.find((c) => c.id === sim.holdCall);
  const holdUnit = hold ? sim.units.find((u) => u.id === hold.unit) : undefined;

  return (
    <div className="demo" role="region" aria-label="Clear Dispatch live simulation" ref={rootRef}>
      <div className="demo-head">
        <span className="dot" aria-hidden="true" />
        Fig. 3 — Live dispatch console
        <span className="demo-tag">
          synthetic traffic · <b>{running ? "running" : "paused"}</b>
        </span>
      </div>
      <div className="demo-body">
        <div className={`dispatch-banner${sim.mode === "SURGE" ? " surge" : ""}`}>
          <span>
            MODE <span className="mode">{sim.mode}</span>
          </span>
          <span className="stat">
            CALLS <b>{activeCalls.length}</b> · UNITS FREE <b>{freeUnits.length}/8</b> · WINDOW{" "}
            <b>{sim.spawnTimes.length}/6</b>
          </span>
        </div>

        <div className="dispatch-grid">
          <div>
            <div className="dispatch-map">
              <svg viewBox="0 0 400 300" role="img" aria-label="City grid with units and active calls">
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={`v${i}`} x1={(i + 1) * 40} y1="0" x2={(i + 1) * 40} y2="300" stroke="#1b1f24" strokeWidth="1" />
                ))}
                {Array.from({ length: 6 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={(i + 1) * 40} x2="400" y2={(i + 1) * 40} stroke="#1b1f24" strokeWidth="1" />
                ))}
                <text x="16" y="20" fill="#3a4048" fontSize="8" letterSpacing="2">NORTHSIDE</text>
                <text x="150" y="160" fill="#3a4048" fontSize="8" letterSpacing="2">DOWNTOWN</text>
                <text x="300" y="290" fill="#3a4048" fontSize="8" letterSpacing="2">HARBOR</text>
                {activeCalls
                  .filter((c) => c.unit)
                  .map((c) => {
                    const u = sim.units.find((un) => un.id === c.unit);
                    if (!u) return null;
                    return (
                      <line
                        key={`l${c.id}`}
                        x1={u.x}
                        y1={u.y}
                        x2={c.x}
                        y2={c.y}
                        stroke={c.status === "hold" ? "#ffb545" : UNIT_COLOR[u.type]}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity="0.55"
                      />
                    );
                  })}
                {sim.units.map((u) => (
                  <g key={u.id}>
                    <rect
                      x={u.x - 5}
                      y={u.y - 5}
                      width="10"
                      height="10"
                      fill={u.busy ? "none" : UNIT_COLOR[u.type]}
                      stroke={UNIT_COLOR[u.type]}
                      strokeWidth="1.5"
                      opacity={u.busy ? 0.6 : 1}
                    />
                    <text x={u.x + 8} y={u.y + 3} fill="#7d8378" fontSize="7" letterSpacing="1">
                      {u.id}
                    </text>
                  </g>
                ))}
                {activeCalls.map((c) => (
                  <g key={c.id}>
                    <circle cx={c.x} cy={c.y} r="4" fill="none" stroke={CALL_COLOR[c.sev]} strokeWidth="1.5" />
                    <circle cx={c.x} cy={c.y} r="1.6" fill={CALL_COLOR[c.sev]} />
                    <text x={c.x + 7} y={c.y - 5} fill={CALL_COLOR[c.sev]} fontSize="7" letterSpacing="1">
                      #{c.id}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="map-legend">
              <span><i style={{ background: "#ff5a4d" }} /> FIRE</span>
              <span><i style={{ background: "#59c98a" }} /> EMS</span>
              <span><i style={{ background: "#6ea8ff" }} /> POLICE</span>
              <span><i style={{ background: "#ffb545" }} /> AIR TANKER (HEAVY)</span>
            </div>
          </div>

          <div className="dispatch-log" aria-label="Event log">
            {sim.log.slice(-10).map((l, i) => (
              <div key={`${l.t}-${i}`} className={`dl ${l.cls}`}>
                <span className="t">[{l.t}]</span> <b>{l.text}</b>
              </div>
            ))}
          </div>
        </div>

        {hold && (
          <div className="hold-card" role="alert">
            <span className="hc-t">HOLD_REQUIRED</span>
            <span className="hc-info">
              CALL #{hold.id} · {hold.type.toUpperCase()} requests {holdUnit?.id} (air tanker)
            </span>
            <span className="hc-count">{Math.ceil(((hold.holdLeft ?? 0) * TICK_MS) / 1000)}s</span>
            <span className="hc-actions">
              <button type="button" className="go" onClick={() => approveHold(true)}>
                Approve
              </button>
              <button type="button" className="armed" onClick={() => approveHold(false)}>
                Deny
              </button>
            </span>
          </div>
        )}

        <div className="acc-actions">
          <button type="button" onClick={toggleRun}>
            {running ? "❚❚ Pause" : "▸ Resume"}
          </button>
          <button type="button" onClick={resetSim}>
            Reset
          </button>
        </div>
      </div>
      <div className="demo-foot">
        <span>Simulation — thresholds scaled down from 10 calls / 60 s and a 60 s hold</span>
        <span>Every transition above is an event; the real client is a pure reducer</span>
      </div>
    </div>
  );
}
