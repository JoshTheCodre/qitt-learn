import Link from "next/link";

const TERM = {
  label: "Second Semester",
  week: 4,
  totalWeeks: 12,
};

export default function SchoolCalendar() {
  return (
    <section className="mt-4">
      <Link
        href="/timetable"
        className="group relative overflow-hidden flex items-center gap-3 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5 p-3.5 squishy-press"
      >
        {/* Subtle dot-grid pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-primary/[0.12]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="cal-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cal-dots)" />
        </svg>

        <div className="relative z-10 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
        </div>
        <p className="relative z-10 min-w-0 flex-1 truncate font-display text-[14px] font-semibold text-on-surface">
          Week {TERM.week} of {TERM.totalWeeks}
          <span className="mx-1.5 inline-block w-1 h-1 rounded-full bg-on-surface-variant/40 align-middle" />
          <span className="font-medium text-on-surface-variant">{TERM.label}</span>
        </p>
        <span className="material-symbols-outlined relative z-10 shrink-0 text-[20px] text-primary transition-transform group-hover:translate-x-0.5">
          chevron_right
        </span>
      </Link>
    </section>
  );
}
