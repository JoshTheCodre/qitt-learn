import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import BottomNav from "@/components/dashboard/BottomNav";
import AcademicCalendar from "@/components/calendar/AcademicCalendar";
import { ACADEMIC_CALENDAR, formatDay } from "@/lib/academic-calendar";
import { getTerm } from "@/lib/term";

const CALENDAR_IMG =
  "https://pub-be6a9a73dd09446ea58b4dde1ab47745.r2.dev/announcements/uniport-calendar-2025-2026.jpg";

export default function CalendarPage() {
  const term = getTerm();
  const weeks = Array.from({ length: term.totalWeeks }, (_, i) => i + 1);

  return (
    <div className="theme-home mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      <div className="relative z-10">
        <BackHeader title="School Calendar" transparent home />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-28">
        {/* Term hero */}
        <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4d80bd] via-[#36669c] to-[#22406a] p-5 text-white shadow-[0_18px_40px_-18px_rgba(34,64,106,0.6)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#3ec995]/25 blur-3xl" />
          <div className="relative">
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
              {term.label}
            </p>
            <p className="mt-2 font-display text-[30px] font-bold leading-none">
              {term.phase === "during" ? (
                <>
                  Week {term.week}
                  <span className="text-white/50"> of {term.totalWeeks}</span>
                </>
              ) : term.phase === "before" ? (
                "Starting soon"
              ) : (
                "Teaching done"
              )}
            </p>
            <p className="mt-1.5 font-body text-[12px] font-medium text-white/70">
              {term.phase === "during"
                ? `${term.weeksLeft} week${term.weeksLeft === 1 ? "" : "s"} left this semester`
                : term.phase === "before"
                  ? `Teaching begins ${formatDay(term.start)}`
                  : "Exams & vacation period"}
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#3ec995] transition-all"
                style={{ width: `${term.pct}%` }}
              />
            </div>
          </div>
        </section>

        {/* Official academic calendar — the real dates, straight from the school. */}
        <div className="mb-3 mt-7">
          <h3 className="font-display text-[15px] font-bold text-on-surface">
            Academic calendar
          </h3>
          <p className="mt-0.5 font-body text-[12px] text-on-surface-variant">
            {ACADEMIC_CALENDAR.academic_sessions[0].session} session
          </p>
        </div>
        <AcademicCalendar />

        {/* Original sheet — the source, for anyone who wants the full printed layout. */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          Official calendar sheet
        </h3>
        <a
          href={CALENDAR_IMG}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm squishy-press"
        >
          {/* Plain <img>: a remote R2 asset next/image can't optimise anyway. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CALENDAR_IMG}
            alt="University of Port Harcourt 2025 / 2026 academic calendar"
            loading="lazy"
            className="w-full"
          />
          <div className="flex items-center justify-center gap-1.5 border-t border-outline-variant/30 py-2.5 text-brand">
            <span className="material-symbols-outlined text-[16px] leading-none">zoom_in</span>
            <span className="font-display text-[12px] font-semibold">Tap to enlarge</span>
          </div>
        </a>

        {/* Week-by-week */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          Semester weeks
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {weeks.map((w) => {
            const done = w < term.week;
            const current = w === term.week;
            return (
              <div
                key={w}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-center ${
                  current
                    ? "border-brand bg-brand text-white shadow-[0_6px_16px_-8px_rgba(54,102,156,0.7)]"
                    : done
                      ? "border-outline-variant/30 bg-surface-container text-on-surface/40"
                      : "border-outline-variant/40 bg-surface-container-lowest text-on-surface/70"
                }`}
              >
                <span className="font-body text-[9px] font-semibold uppercase tracking-wide opacity-70">
                  Week
                </span>
                <span className="font-display text-[18px] font-bold leading-none">{w}</span>
                {current && (
                  <span className="mt-0.5 font-body text-[8px] font-bold uppercase tracking-wide">
                    Now
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
