import { FACTS } from "../../content";

export default function Facts() {
  return (
    <ul className="facts" aria-label="Three facts">
      {FACTS.map((f) => (
        <li key={f.big}><a href={f.href}><b>{f.big}</b><span>{f.small}</span></a></li>
      ))}
    </ul>
  );
}
