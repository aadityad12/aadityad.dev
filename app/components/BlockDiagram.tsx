import { NOTES } from "../content";

type Row = { id: string; in: string; out: string; fn: string; spec: string; net?: boolean; human?: boolean };

const ROWS: Row[] = [
  { id: "accordion", in: "CTX_IN", out: "CTX_OUT", fn: "Folds stale agent context reversibly, ranked in three stages", spec: "5/6 vs 2/6", human: true },
  { id: "rung", in: "SRC.rg", out: "A64_OUT", fn: "Tree-walker → stack VM → register VM → ARM64 JIT", spec: "38.8×", net: true },
  { id: "visionassist", in: "CAM_IN", out: "SPKR_OUT", fn: "YOLOv8n → monocular distance → risk rank → speech", spec: "200 ms/frame", net: true },
  { id: "gazeboard", in: "EYE_IN", out: "TTS_OUT", fn: "Eye crop → EyeGaze on the NPU → dwell select → speech", spec: "≈8 ms", net: true },
  { id: "alta", in: "PROBE[3:0]", out: "VOICE_OUT", fn: "Bare-metal ADC → JSON stream → voice hint ladder", spec: "1.2 kHz", human: true },
  { id: "apextracker", in: "GOALS_IN", out: "DAY_SCORE", fn: "Encrypted local store, reboot-safe alarms, five widgets", spec: "≈525 tests", net: true },
  { id: "echo", in: "RF_IN", out: "RF_OUT", fn: "Receive, store and re-advertise alerts over BLE GATT", spec: "22 lang", net: true },
  { id: "oss-scout", in: "ISSUES_IN", out: "PR_OUT", fn: "Nightly scan → tested draft → waits for one tap", spec: "1 write path", human: true },
  { id: "temper", in: "HARNESS_IN", out: "PATCH_OUT", fn: "Harness vs. bare model on six dimensions → patch", spec: "6 dims" },
  { id: "clear-dispatch", in: "CALLS_IN", out: "UNITS_OUT", fn: "Triage → nearest unit → heavy assets wait for a human", spec: "60 s hold", human: true },
];

export default function BlockDiagram() {
  return (
    <div className="bd">
      <div className="bd-top">
        <span><b>Figure 1.</b> Functional block diagram</span>
        <span>10 blocks · click one to open its application note</span>
      </div>
      <div className="bd-rows" role="list">
        <div className="bd-head" aria-hidden="true">
          <span>Input</span>
          <span />
          <span>Block · project · key figure</span>
          <span className="bus-h b1" title="NO_NET: runs with no network connection">NO_NET</span>
          <span className="bus-h b2" title="HUMAN_OVR: a person holds final authority">HUMAN_OVR</span>
          <span />
          <span>Output</span>
        </div>
        {ROWS.map((r) => {
          const n = NOTES.find((x) => x.id === r.id)!;
          return (
            <div className="bd-row" role="listitem" key={r.id}>
              <span className="bd-pin in" aria-hidden="true">{r.in}</span>
              <span className="bd-wire in" aria-hidden="true" />
              <a className="bd-blk" href={`#${r.id}`} title="Jump to the application note">
                <span className="bk"><b>{n.an}</b>{n.block}</span>
                <span className="bp">{n.title}</span>
                <span className="bf">{r.fn}</span>
                <span className="bs">{r.spec}</span>
              </a>
              <span className={`bd-bus b1${r.net ? " tap" : ""}`} aria-hidden="true"><i /></span>
              <span className={`bd-bus b2${r.human ? " tap" : ""}`} aria-hidden="true"><i /></span>
              <span className="bd-wire out" aria-hidden="true" />
              <span className="bd-pin out" aria-hidden="true">{r.out}</span>
            </div>
          );
        })}
      </div>
      <div className="bd-foot">
        <span><b>●</b> junction: connected. A crossing with no dot is not.</span>
        <span><b>NO_NET</b> runs with no network connection</span>
        <span><b>HUMAN_OVR</b> a person holds final authority</span>
        <span className="no-print">Hover a bus name to trace it.</span>
      </div>
    </div>
  );
}
