import Link from "next/link";
import { TERM } from "@/lib/term";

export default function SchoolCalendar() {
  const weeksLeft = Math.max(TERM.totalWeeks - TERM.week, 0);

  return (
    <section className="mt-4">
      {/* Styled after the "Make Money" card: soft tinted panel, icon badge on the left,
          a bold coloured title over a muted subtitle, and a chevron. */}
      <Link
        href="/calendar"
        className="group flex items-center gap-3 rounded-2xl border border-brand/15 bg-brand/[0.06] px-4 py-3.5 transition-colors hover:bg-brand/[0.09] squishy-press"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/[0.12]">
          <span className="material-symbols-outlined icon-filled text-[24px] leading-none text-brand">
            calendar_month
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-bold leading-tight text-brand">
            Week {TERM.week} of {TERM.totalWeeks}
          </p>
          <p className="mt-0.5 truncate font-body text-[12px] font-medium leading-tight text-on-surface/55">
            {TERM.label} · {weeksLeft} week{weeksLeft === 1 ? "" : "s"} to go
          </p>
        </div>

        <span className="material-symbols-outlined shrink-0 text-[20px] leading-none text-on-surface/30 transition-transform group-hover:translate-x-0.5">
          chevron_right
        </span>
      </Link>
    </section>
  );
}
