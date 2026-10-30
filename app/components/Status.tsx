import { STATUS_HELP, type Status as StatusName } from "../content";

const CLASS: Record<StatusName, string> = {
  Measured: "measured",
  Observed: "observed",
  "Single run": "single",
  Repo: "repo",
  Stated: "stated",
};

export default function Status({ s }: { s: StatusName }) {
  return (
    <span className={`tag ${CLASS[s]}`} title={STATUS_HELP[s]}>
      {s}
    </span>
  );
}
