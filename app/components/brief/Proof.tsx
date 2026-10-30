import { PROOF } from "../../content";
import Status from "../Status";

export default function Proof() {
  return (
    <ul className="proof" aria-label="Proof points">
      {PROOF.map((p) => (
        <li key={p.big}>
          <a href={p.href}>
            <b>{p.big}</b>
            {p.status && <Status s={p.status} />}
            <span>{p.small}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
