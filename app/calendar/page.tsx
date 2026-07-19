import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import BottomNav from "@/components/dashboard/BottomNav";
import { TERM } from "@/lib/term";

export default function CalendarPage() {
  const weeks = Array.from({ length: TERM.totalWeeks }, (_, i) => i + 1);
  const weeksLeft = Math.max(TERM.totalWeeks - TERM.week, 0);
  const pct = Math.round((TERM.week / TERM.totalWeeks) * 100);

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
              {TERM.label}
            </p>
            <p className="mt-2 font-display text-[30px] font-bold leading-none">
              Week {TERM.week}
              <span className="text-white/50"> of {TERM.totalWeeks}</span>
            </p>
            <p className="mt-1.5 font-body text-[12px] font-medium text-white/70">
              {weeksLeft} week{weeksLeft === 1 ? "" : "s"} left this semester
            </p>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#3ec995] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </section>

        {/* Week-by-week */}
        <h3 className="mb-3 mt-7 font-display text-[15px] font-bold text-on-surface">
          Semester weeks
        </h3>
        <div className="grid grid-cols-4 gap-2.5">
          {weeks.map((w) => {
            const done = w < TERM.week;
            const current = w === TERM.week;
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

        {/* Honest note — official dates aren't in the app yet, so we don't invent them. */}
        <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
          <span className="material-symbols-outlined shrink-0 text-[18px] leading-none text-brand">
            event
          </span>
          <p className="font-body text-[12px] leading-snug text-on-surface/60">
            Exam dates, breaks and holidays will appear here once your school&apos;s official
            calendar is added.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
