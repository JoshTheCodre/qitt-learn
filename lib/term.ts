// The academic term, shared by the dashboard week card and the /calendar page so the two
// never drift out of sync. Everything is derived from the real Teaching Period in the
// published academic calendar and the current date — no hardcoded week to fall stale.
import { ACADEMIC_CALENDAR } from "./academic-calendar";

const DAY = 86400000;

// Compare dates as UTC midnights so day-of-week maths never trips on the local timezone.
function utcKey(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}
function utcOf(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export interface TermState {
  label: string;
  start: string; // ISO first teaching day
  end: string; // ISO last teaching day
  week: number; // 0 before it starts, capped at totalWeeks once it ends
  totalWeeks: number;
  weeksLeft: number;
  pct: number; // 0..100
  phase: "before" | "during" | "after";
}

export function getTerm(now: Date = new Date()): TermState {
  let label = "Second Semester";
  let start = "";
  let end = "";
  let duration = "";
  for (const sem of ACADEMIC_CALENDAR.academic_sessions) {
    const t = sem.events.find((e) => e.event === "Teaching Period");
    if (t?.start_date && t.end_date) {
      label = sem.semester;
      start = t.start_date;
      end = t.end_date;
      duration = t.duration ?? "";
      break;
    }
  }

  const startMs = utcKey(start);
  const endMs = utcKey(end);
  const nowMs = utcOf(now);

  // Prefer the sheet's stated duration ("13 weeks"); fall back to the date span.
  const totalWeeks =
    parseInt(duration, 10) || Math.max(1, Math.ceil((endMs - startMs) / DAY / 7));

  let week: number;
  let phase: TermState["phase"];
  if (nowMs < startMs) {
    week = 0;
    phase = "before";
  } else if (nowMs > endMs) {
    week = totalWeeks;
    phase = "after";
  } else {
    week = Math.min(totalWeeks, Math.floor((nowMs - startMs) / DAY / 7) + 1);
    phase = "during";
  }

  const weeksLeft = Math.max(totalWeeks - week, 0);
  const pct = Math.max(0, Math.min(100, Math.round((week / totalWeeks) * 100)));

  return { label, start, end, week, totalWeeks, weeksLeft, pct, phase };
}
