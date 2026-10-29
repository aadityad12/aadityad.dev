import { wobRect, inkArrow } from "./ink";

/* VisionAssist's on-device pipeline, drawn: camera to speech without leaving
   the Pi. Static SVG, no JS. */

function Stage({ x, label, sub, seed }: { x: number; label: string; sub: string; seed: number }) {
  return (
    <g>
      <path d={wobRect(x, 22, 70, 54, seed)} />
      <text x={x + 35} y={44} textAnchor="middle" className="ink-label">{label}</text>
      <text x={x + 35} y={60} textAnchor="middle" className="ink-sub">{sub}</text>
    </g>
  );
}

export default function VisionPipeline() {
  return (
    <div className="ink-panel">
      <svg viewBox="0 0 344 96" role="img" aria-label="VisionAssist's pipeline: camera capture, YOLOv8 detection, distance from bounding-box height, then speech">
        <Stage x={8} label="CAMERA" sub="picamera2" seed={1} />
        <path className="ink-thin" d={inkArrow(78, 49, 16, 1)} />
        <Stage x={94} label="DETECT" sub="yolov8n" seed={2} />
        <path className="ink-thin" d={inkArrow(164, 49, 16, 2)} />
        <Stage x={180} label="DISTANCE" sub="box height" seed={3} />
        <path className="ink-thin" d={inkArrow(250, 49, 16, 3)} />
        <Stage x={266} label="SPEAK" sub="piper tts" seed={4} />
      </svg>
      <p className="ink-foot mono"><b>200 MS</b> A FRAME ON THE PI 5 · SPEAKS FEET + STEPS · BOOTS HEADLESS</p>
    </div>
  );
}
