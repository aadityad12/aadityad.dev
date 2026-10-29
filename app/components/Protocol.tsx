"use client";

import { useState } from "react";

const STEPS = [
  {
    title: "Evaluate",
    body: "Run the harness and a bare-model baseline on the same dimensions.",
  },
  {
    title: "Find the regression",
    body: "Keep the dimensions where the prompts, tools, or skills made the model worse.",
  },
  {
    title: "Patch the artifact",
    body: "Replace the piece that caused it. Leave the rest of the harness alone.",
  },
  {
    title: "Retest that dimension",
    body: "Rerun the affected checks. Don’t start the whole suite over.",
  },
];

export function Protocol() {
  const [step, setStep] = useState(0);

  return (
    <div className="protocol">
      <ol>
        {STEPS.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              className={index === step ? "step is-on" : "step"}
              aria-current={index === step ? "step" : undefined}
              onClick={() => setStep(index)}
            >
              <span className="step-index">0{index + 1}</span>
              <span>
                <strong>{item.title}</strong>
                <span className="step-body">{item.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="exhibit-actions">
        <button type="button" className="btn" onClick={() => setStep((value) => (value + 1) % STEPS.length)}>
          Next step
        </button>
      </div>
    </div>
  );
}
