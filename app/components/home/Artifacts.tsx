import type { Plate as PlateT, StageMedia } from "../../content";
import StageVideo from "./StageVideo";

/* Plates for the front-page stage, and real material for project pages that has no other home there:
   Accordion's screen recording and the code that keeps OSS Scout from writing to GitHub. */

export function Artifact({ media }: { media: StageMedia }) {
  return media.kind === "video" ? <StageVideo src={media.src} poster={media.poster} alt={media.alt} /> : <GuardCode />;
}

// From guard/guard.py in the OSS Scout repo, trimmed to the rule and what the agent is told.
function GuardCode() {
  return (
    <figure className="art-card art-code" aria-label="Code from OSS Scout's guard hook, which blocks every GitHub write from the agent">
      <figcaption className="art-card-h">
        <span>guard/guard.py</span>
        <span>a PreToolUse hook, 37 tests</span>
      </figcaption>
      <pre className="art-pre">
        <code>
          <span className="c">{'"""PreToolUse hook: the scout may read GitHub, never write to it."""'}</span>
          {"\n\n"}
          {"GH_WRITE_SUBCOMMANDS = {\n"}
          {'    "pr": {"create", "merge", "close", "comment", "review", ...},\n'}
          {'    "issue": {"create", "comment", "edit", "close", ...},\n'}
          {'    "repo": {"create", "fork", "delete", "edit", ...},\n'}
          {'    "release": None, "workflow": None, "secret": None, ...\n'}
          {"}\n\n"}
          {"def "}
          <b>block</b>
          {"(reason, advice=DEFAULT_ADVICE):\n"}
          {'    print(f"Blocked by oss-scout guard: {reason}. {advice}")\n'}
          {"    sys.exit(2)  "}
          <span className="c"># exit 2 stops the tool call</span>
        </code>
      </pre>
      <p className="art-out">
        <span className="art-prompt">agent $</span> gh pr create
        <br />
        <span className="art-blocked">Blocked by oss-scout guard: `gh pr create` writes to GitHub. The scout never writes to GitHub; leave this for the human.</span>
      </p>
    </figure>
  );
}

/** A two-ink drawing of the project's idea, with its label set in the page's own type over the drawing's empty corner. */
export function Plate({ id, plate }: { id: string; plate: PlateT }) {
  return (
    <figure className="plate">
      <picture>
        <source type="image/webp" srcSet={`/projects/plates/${id}.webp`} />
        <img src={`/projects/plates/${id}.png`} width={1600} height={1000} alt={plate.alt} loading="lazy" decoding="async" />
      </picture>
      <figcaption className="plate-label">
        <b>{plate.big}</b>
        <span>{plate.line}</span>
      </figcaption>
    </figure>
  );
}
