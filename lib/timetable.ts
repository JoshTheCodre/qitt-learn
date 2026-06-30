export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const DAY_FULL: Record<Day, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

export const DAY_SHORT: Record<Day, string> = {
  Mon: "MON",
  Tue: "TUE",
  Wed: "WED",
  Thu: "THU",
  Fri: "FRI",
};

export interface TimetableEntry {
  id: string;
  day: Day;
  start: string; // "HH:MM" 24h
  end: string; // "HH:MM" 24h
  location: string | null;
  code: string;
  title: string;
}

export const TIMETABLE: TimetableEntry[] = [
  { id: "1", day: "Mon", start: "12:30", end: "14:00", location: "NSA Hall 2", code: "CSC 202.2", title: "Systems Thinking & Props" },
  { id: "2", day: "Mon", start: "14:00", end: "15:00", location: "Lab 1", code: "CSC 206.2", title: "Operating Systems" },
  { id: "3", day: "Tue", start: "10:00", end: "12:00", location: "MBA 2", code: "CSC 204.1", title: "Data Structures & Algorithms" },
  { id: "4", day: "Wed", start: "09:00", end: "11:00", location: "Hall A", code: "MTH 201.1", title: "Linear Algebra" },
  { id: "5", day: "Wed", start: "14:00", end: "15:00", location: "Lab 1", code: "CSC 206.2", title: "Operating Systems" },
  { id: "6", day: "Thu", start: "08:00", end: "09:00", location: "MBA 2", code: "CSC 204.1", title: "Data Structures & Algorithms" },
  { id: "7", day: "Fri", start: "12:30", end: "14:00", location: "NSA Hall 2", code: "CSC 202.2", title: "Systems Thinking & Props" },
  { id: "8", day: "Fri", start: "16:00", end: "18:00", location: "Hall C", code: "GST 212.1", title: "Philosophy & Logic" },
];

export function compactTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "pm" : "am";
  const hr = h % 12 || 12;
  return m === 0 ? `${hr}${ap}` : `${hr}:${String(m).padStart(2, "0")}${ap}`;
}

export function timeToMins(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export interface FreeSlot {
  from: string;
  to: string;
  mins: number;
}

export function getFreeSlots(entries: TimetableEntry[]): FreeSlot[] {
  if (entries.length < 2) return [];
  const sorted = [...entries].sort((a, b) => a.start.localeCompare(b.start));
  return sorted.slice(0, -1).flatMap((e, i) => {
    const gap = timeToMins(sorted[i + 1].start) - timeToMins(e.end);
    return gap > 0 ? [{ from: e.end, to: sorted[i + 1].start, mins: gap }] : [];
  });
}

export function fmtMins(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 && m > 0 ? `${h}h ${m}m free` : h > 0 ? `${h}h free` : `${m}m free`;
}

export function todayDay(): Day {
  const d = new Date().getDay();
  if (d === 0 || d === 6) return "Mon";
  return DAYS[d - 1];
}
