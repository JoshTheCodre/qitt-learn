// The user's own timetable, persisted to localStorage and scoped per signed-in user.
// Replaces the old static sample as the source of truth for the timetable page.
import { getSessionEmail } from "./store";
import { TIMETABLE, type TimetableEntry } from "./timetable";

const KEY = "qitt_timetable";

function readAll(): Record<string, TimetableEntry[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function scope(): string {
  return getSessionEmail() || "guest";
}

function write(entries: TimetableEntry[]) {
  const all = readAll();
  all[scope()] = entries;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function makeEntryId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getUserTimetable(): TimetableEntry[] {
  return readAll()[scope()] || [];
}

export function addTimetableEntry(entry: TimetableEntry): TimetableEntry[] {
  const next = [...getUserTimetable(), entry];
  write(next);
  return next;
}

export function removeTimetableEntry(id: string): TimetableEntry[] {
  const next = getUserTimetable().filter((e) => e.id !== id);
  write(next);
  return next;
}

/**
 * Venues to offer in the search-and-add field: the ones the user has already used,
 * plus the common campus venues from the sample data as a starting suggestion set.
 * A new venue simply becomes "known" the next time it's read back.
 */
export function getKnownVenues(): string[] {
  const seed = TIMETABLE.map((e) => e.location).filter((v): v is string => !!v);
  const mine = getUserTimetable()
    .map((e) => e.location)
    .filter((v): v is string => !!v);
  return Array.from(new Set([...mine, ...seed])).sort((a, b) => a.localeCompare(b));
}
