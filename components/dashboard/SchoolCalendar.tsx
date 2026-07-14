import Link from "next/link";
import IconFlat from "@/components/IconFlat";

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
        className="group relative overflow-hidden flex items-center gap-2.5 rounded-2xl border border-brand/10 bg-gradient-to-br from-brand/10 to-brand/5 px-3 py-2.5 squishy-press"
      >
        {/* Diagonal hatching — kept faint on purpose. It's texture behind the text, not
            a competitor to it; the text has to be the thing that reads. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-brand/[0.06]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cal-lines"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cal-lines)" />
        </svg>

        <div className="relative z-10 w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
          <IconFlat name="calendar" size={20} />
        </div>
        <div className="relative z-10 min-w-0 flex-1">
          <p className="truncate font-display text-[16px] font-bold leading-tight text-on-surface">
            Week {TERM.week}
            <span className="ml-1 font-semibold text-on-surface/40">of {TERM.totalWeeks}</span>
          </p>
          <p className="truncate font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-brand">
            {TERM.label}
          </p>
        </div>
        <span className="material-symbols-outlined icon-filled relative z-10 shrink-0 text-[20px] text-brand transition-transform group-hover:translate-x-0.5">
          chevron_right
        </span>
      </Link>
    </section>
  );
}
