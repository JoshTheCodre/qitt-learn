import Link from "next/link";

const SUBJECTS = [
  { label: "Study", icon: "auto_stories" },
  { label: "Practice", icon: "quiz" },
  { label: "Performance", icon: "insights" },
];

export default function Hero() {
  return (
    <section className="mt-4">
      <Link
        href="/study"
        aria-label="Explore courses"
        className="group relative block w-full overflow-hidden rounded-[28px] bg-primary p-5 text-left text-white squishy-press"
      >
        {/* Fine transparent decorative background */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-white/25"
          viewBox="0 0 400 160"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="350" cy="30" r="70" stroke="currentColor" strokeWidth="1" />
          <circle cx="350" cy="30" r="46" stroke="currentColor" strokeWidth="1" />
          <circle cx="350" cy="30" r="22" stroke="currentColor" strokeWidth="1" />
          <path d="M-20 130 Q 110 80 240 130 T 520 130" stroke="currentColor" strokeWidth="1" />
          <path d="M-20 150 Q 110 100 240 150 T 520 150" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-[18px] sm:text-[20px] md:text-[24px] font-bold leading-tight">
              Explore Courses
            </h2>
            <p className="mt-1 font-display text-sm font-medium text-white/80 truncate">
              Browse, study and practice.
            </p>
          </div>
          <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
            <span className="material-symbols-outlined text-[22px] leading-none">chevron_right</span>
          </span>
        </div>

        {/* Subject chips */}
        <div className="relative z-10 mt-3 flex flex-nowrap gap-1.5">
          {SUBJECTS.map((subject) => (
            <span
              key={subject.label}
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 font-display text-[11px] font-semibold text-white/90 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px]">{subject.icon}</span>
              {subject.label}
            </span>
          ))}
        </div>
      </Link>
    </section>
  );
}
