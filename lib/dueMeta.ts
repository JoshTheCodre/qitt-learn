// Due-date presentation logic. Pure functions — safe to unit test. Time is injected as
// `now` so nothing here reads the clock (keeps it deterministic and SSR-safe).

export type DueTone = "urgent" | "soon" | "normal" | "overdue" | "unknown";

export interface DueMeta {
  tone: DueTone;
  label: string;
  isOverdue: boolean;
  title: string;
}

export interface AssignmentLike {
  id: string;
  dueAt: string | null;
  dueTextRaw?: string | null;
  createdAt?: string | null;
}

// Tailwind classes per tone, in the app's palette (used by the DuePill).
export const TONE_CLASS: Record<DueTone, string> = {
  urgent: "bg-error-container text-error",
  soon: "bg-amber-100 text-amber-700",
  normal: "bg-surface-container text-on-surface-variant",
  overdue: "bg-surface-container text-on-surface/40",
  unknown: "bg-primary/10 text-primary",
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

function humanize(ms: number): string {
  if (ms < HOUR) return plural(Math.max(1, Math.round(ms / MINUTE)), "minute");
  if (ms < DAY) return plural(Math.round(ms / HOUR), "hour");
  return plural(Math.round(ms / DAY), "day");
}

const absolute = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

export function dueMeta(dueAt: string | null, dueTextRaw: string | null | undefined, now: number): DueMeta {
  // No parsed date — show the original phrasing rather than an empty slot or a guess.
  if (!dueAt) {
    return {
      tone: "unknown",
      label: dueTextRaw ? `said “${dueTextRaw}”` : "No date given",
      isOverdue: false,
      title: "No date could be parsed from the original message",
    };
  }

  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) {
    return { tone: "unknown", label: "No date given", isOverdue: false, title: "" };
  }

  const delta = date.getTime() - now;
  const exact = date.toLocaleString(undefined, {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  });

  if (delta < 0) return { tone: "overdue", label: `Was due ${humanize(-delta)} ago`, isOverdue: true, title: exact };
  if (delta < DAY) return { tone: "urgent", label: `Due in ${humanize(delta)}`, isOverdue: false, title: exact };
  if (delta < 3 * DAY) return { tone: "soon", label: `Due in ${humanize(delta)}`, isOverdue: false, title: exact };
  return { tone: "normal", label: absolute(date), isOverdue: false, title: exact };
}

// "2 days ago" — for the "Posted by X · …" meta row.
export function timeAgo(iso: string, now: number): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const delta = now - then;
  return delta < MINUTE ? "just now" : `${humanize(delta)} ago`;
}

// Upcoming first (soonest → latest), undated next, overdue last (most recent first).
export function sortForStudent<T extends AssignmentLike>(assignments: T[], now: number): T[] {
  const bucket = (a: T) => (!a.dueAt ? 1 : new Date(a.dueAt).getTime() < now ? 2 : 0);
  const t = (v: string | null | undefined) => new Date(v ?? 0).getTime();
  return [...assignments].sort((a, b) => {
    const ba = bucket(a);
    const bb = bucket(b);
    if (ba !== bb) return ba - bb;
    if (ba === 1) return t(b.createdAt) - t(a.createdAt); // undated: newest first
    return (ba === 2 ? -1 : 1) * (t(a.dueAt) - t(b.dueAt)); // overdue: most recent first
  });
}
