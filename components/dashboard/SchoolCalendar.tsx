"use client";

import { useState } from "react";

type CalendarEvent = {
  title: string;
  date: string;
  daysAway: number;
  icon: string;
  tone: "exam" | "deadline" | "break";
};

const TERM = {
  label: "Second Semester",
  week: 4,
  totalWeeks: 12,
};

const UPCOMING: CalendarEvent[] = [
  {
    title: "Course registration closes",
    date: "Fri, Jul 3",
    daysAway: 3,
    icon: "how_to_reg",
    tone: "deadline",
  },
  {
    title: "Mid-Semester Exams begin",
    date: "Mon, Jul 21",
    daysAway: 21,
    icon: "edit_note",
    tone: "exam",
  },
  {
    title: "Mid-Semester Break",
    date: "Mon, Aug 4",
    daysAway: 35,
    icon: "beach_access",
    tone: "break",
  },
];

const TONE_STYLES: Record<CalendarEvent["tone"], string> = {
  exam: "bg-error/10 text-error",
  deadline: "bg-primary/10 text-primary",
  break: "bg-tertiary/10 text-tertiary",
};

function countdownLabel(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `in ${days} days`;
}

export default function SchoolCalendar() {
  const [expanded, setExpanded] = useState(false);
  const next = UPCOMING[0];

  return (
    <section className="mt-4">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary p-4 rounded-[24px] border border-primary/10 relative overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div className="min-w-0">
            <p className="font-display text-[11px] font-semibold uppercase tracking-wide opacity-60">
              School Calendar
            </p>
            <h2 className="font-display text-[16px] leading-tight font-bold truncate">
              Week {TERM.week} of {TERM.totalWeeks}
              <span className="inline-block w-1 h-1 rounded-full bg-primary/40 align-middle mx-1.5" />
              {TERM.label}
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="relative z-10 mt-3 border-t border-primary/10" />

        {/* Events — expansion panel (Up next + the rest) */}
        {UPCOMING.length > 0 && (
          <div className="relative z-10 mt-2">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between rounded-xl px-2 py-2 font-display text-xs font-semibold text-primary transition-colors hover:bg-white/40 squishy-press"
            >
              <span>
                {expanded ? "Hide events" : `Up next - ${next.title}`}
              </span>
              <span
                className={`material-symbols-outlined text-[20px] shrink-0 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                expanded ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <ul className="overflow-hidden space-y-1">
                {UPCOMING.map((event) => (
                  <li
                    key={event.title}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/40 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TONE_STYLES[event.tone]}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{event.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-on-surface truncate">
                        {event.title}
                      </p>
                      <p className="font-display text-xs font-normal text-on-surface-variant">
                        {event.date}
                      </p>
                    </div>
                    <span className="font-display text-xs font-semibold text-primary shrink-0">
                      {countdownLabel(event.daysAway)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Decorative blur */}
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-primary/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
