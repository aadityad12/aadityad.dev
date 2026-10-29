"use client";

import { useState } from "react";

const LOCAL = [
  "Room database",
  "Five home-screen widgets",
  "Reboot-safe alarms",
  "Receipt parsing on the device",
];

export function LocalFirst() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="local">
      <div className="local-grid">
        <div>
          <p className="kicker">Always on</p>
          <ul>
            {LOCAL.map((item) => (
              <li key={item}><span className="tick" aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker">Only with an account</p>
          <ul>
            <li className={signedIn ? "is-on" : "is-off"}>
              <span className="tick" aria-hidden="true" />
              Firestore sync
            </li>
          </ul>
        </div>
      </div>
      <div className="exhibit-actions">
        <button type="button" className="btn" aria-pressed={signedIn} onClick={() => setSignedIn((value) => !value)}>
          {signedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
      <p className="hint" role="status">
        {signedIn
          ? "Sync is on. The local list did not change. The account adds a copy. It is not the app."
          : "No account. The day still scores, the widgets still read Room, and an alarm still survives reboot."}
      </p>
    </div>
  );
}
