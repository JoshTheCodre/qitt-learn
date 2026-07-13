import Link from "next/link";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";

const TOOLS: { label: string; icon: Icon3DName; href: string }[] = [
  // Study is parked for now — re-enable with grid-cols-3 below.
  // { label: "Study", icon: "study", href: "/study/learn" },
  { label: "Practice", icon: "practice", href: "/study/practice" },
  { label: "Performance", icon: "performance", href: "/study/performance" },
];

export default function OverviewHero() {
  return (
    <section className="mt-4">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-blue-700 p-4 text-white shadow-[0_10px_26px_rgba(37,99,235,0.22)]">
        {/* Decorative background pattern */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-white/20"
          viewBox="0 0 400 120"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="350" cy="22" r="60" stroke="currentColor" strokeWidth="1" />
          <circle cx="350" cy="22" r="40" stroke="currentColor" strokeWidth="1" />
          <circle cx="350" cy="22" r="20" stroke="currentColor" strokeWidth="1" />
          <path d="M-20 96 Q 110 56 240 96 T 520 96" stroke="currentColor" strokeWidth="1" />
          <path d="M-20 112 Q 110 72 240 112 T 520 112" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="relative z-10">
          <h2 className="font-display text-[16px] font-bold">For You</h2>

          {/* Tools — top, horizontal */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="rounded-2xl bg-white/10 hover:bg-white/20 px-2 py-2.5 flex items-center justify-center gap-1.5 backdrop-blur-sm transition-colors squishy-press"
              >
                <Icon3D name={tool.icon} size={20} priority />
                <span className="font-body text-[11px] font-semibold whitespace-nowrap">{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
