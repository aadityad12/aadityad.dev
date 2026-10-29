"use client";

import { useState } from "react";

type Phase = "idle" | "draft" | "approved";

export function Scout() {
  const [phase, setPhase] = useState<Phase>("idle");

  return (
    <div className="scout">
      <div className="rooms">
        <section className="room" aria-label="Public GitHub">
          <p className="kicker">Public GitHub</p>
          <p>Read issues. Score how a project treats new contributors.</p>
          <p className="room-note">The agent can read this.</p>
        </section>
        <section className="room" aria-label="Private draft">
          <p className="kicker">Private draft</p>
          {phase === "idle" ? <p>Empty tonight.</p> : (
            <p className="draft-card"><span className="kicker">Sample</span> One tested patch, waiting on a person.</p>
          )}
          <p className="room-note">At most one draft a night.</p>
        </section>
        <section className={phase === "approved" ? "room" : "room is-locked"} aria-label="Write token">
          <p className="kicker">Write token</p>
          {phase === "approved"
            ? <p>Used once, by a person. The agent never held it.</p>
            : <p>Locked. It lives in a different repo.</p>}
          <p className="room-note">{phase === "approved" ? "Published by you." : "A hook blocks the agent."}</p>
        </section>
      </div>
      <div className="exhibit-actions">
        <button type="button" className="btn btn-primary" onClick={() => setPhase("draft")} disabled={phase !== "idle"}>
          Run tonight
        </button>
        <button type="button" className="btn" onClick={() => setPhase("approved")} disabled={phase !== "draft"}>
          Approve and publish
        </button>
        <button type="button" className="btn" onClick={() => setPhase("idle")} disabled={phase === "idle"}>
          Reset the night
        </button>
      </div>
    </div>
  );
}
