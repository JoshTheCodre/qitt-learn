const OVERVIEW = {
  session: "2025 / 2026",
  semester: "Second Semester",
  level: "200 Level",
  courses: 5,
  units: 21,
};

export default function AcademicOverview() {
  return (
    <section className="mt-4">
      <div className="relative overflow-hidden rounded-[24px] bg-primary p-6 text-white">
        {/* Transparent decorative background */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-white/10"
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="340" cy="40" r="90" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="340" cy="40" r="60" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="340" cy="40" r="30" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-20 170 Q 120 110 260 170 T 540 170" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-20 190 Q 120 130 260 190 T 540 190" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Top row: identity (left) + session (right) */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-widest text-white/60">
              Academic Overview
            </p>
            <h2 className="mt-1.5 font-display text-[19px] font-bold leading-tight whitespace-nowrap">
              {OVERVIEW.semester}
            </h2>
            <p className="font-display text-sm font-medium text-white/70">{OVERVIEW.level}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-xs font-medium uppercase tracking-wider text-white/50">
              Session
            </p>
            <p className="font-display text-sm font-semibold">{OVERVIEW.session}</p>
          </div>
        </div>

        {/* Stats row spread for balance */}
        <div className="relative z-10 mt-6 flex items-end justify-between">
          <div>
            <p className="font-display text-[24px] font-bold leading-none">{OVERVIEW.courses}</p>
            <p className="mt-1 font-display text-xs font-medium text-white/60">Courses</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[24px] font-bold leading-none">{OVERVIEW.units}</p>
            <p className="mt-1 font-display text-xs font-medium text-white/60">Units</p>
          </div>
        </div>
      </div>
    </section>
  );
}
