// Practice results, persisted to localStorage and scoped per signed-in user (falling
// back to "guest"). This is what powers the Performance screen and the full-result view.
import { getSessionEmail } from "./store";

export type ResultQuestion = {
  q: string;
  options: string[];
  answer: number; // index of the correct option
  picked: number | null; // what the user chose, null if left blank
};

export type PracticeResult = {
  id: string;
  course: string;
  type: string; // "Past Question", "MCQ", …
  score: number;
  total: number;
  takenAt: string; // ISO
  questions: ResultQuestion[];
};

const RESULTS_KEY = "qitt_results";

function readAll(): Record<string, PracticeResult[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function scope(): string {
  return getSessionEmail() || "guest";
}

export function makeResultId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function saveResult(result: PracticeResult) {
  if (typeof window === "undefined") return;
  const all = readAll();
  const key = scope();
  // Newest first, capped — a practice history doesn't need to grow unbounded.
  all[key] = [result, ...(all[key] || [])].slice(0, 100);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
}

export function getResults(): PracticeResult[] {
  return readAll()[scope()] || [];
}

export function getResult(id: string): PracticeResult | null {
  return getResults().find((r) => r.id === id) || null;
}

export function percent(r: Pick<PracticeResult, "score" | "total">): number {
  return r.total ? Math.round((r.score / r.total) * 100) : 0;
}
