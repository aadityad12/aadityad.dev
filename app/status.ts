export type Status = "Measured" | "Observed" | "Single run" | "Repo" | "Stated";

export const STATUS_HELP: Record<Status, string> = {
  Measured: "A recorded result in the project repository.",
  Observed: "Read live during the event, not logged.",
  "Single run": "One benchmark run at hackathon scale.",
  Repo: "A count you can check in the code.",
  Stated: "My account; nothing public behind it.",
};
