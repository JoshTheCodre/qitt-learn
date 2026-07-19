// A single source of truth for "is there an active practice session?".
//
// Held in sessionStorage (per-tab, cleared when the tab closes) rather than a URL flag,
// so a bookmarked or hand-typed /study/quiz URL has no active session and gets bounced
// back to setup. The quiz page validates this on every mount.
const KEY = "activePracticeSession";

export function startPracticeSession() {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, "1");
}

export function hasPracticeSession(): boolean {
  return typeof window !== "undefined" && sessionStorage.getItem(KEY) === "1";
}

export function endPracticeSession() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}
