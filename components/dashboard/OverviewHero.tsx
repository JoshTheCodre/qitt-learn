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
      {/* A clean two-stop blue. Melting blue through teal into green muddied the middle
          of the card; green comes back below as a separate emerald glow instead, which
          keeps both colours legible rather than averaging them into sludge. */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary to-blue-700 p-4 text-white shadow-[0_10px_26px_rgba(37,99,235,0.22)]">
        {/* Decorative background pattern — hairline strokes at varied opacity, so it
            reads as fine engraving rather than a few heavy shapes. */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-white"
          viewBox="0 0 400 120"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hero-glow" cx="350" cy="22" r="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            {/* Green enters as light on top of the blue, not as a stop inside it */}
            <radialGradient id="hero-emerald" cx="40" cy="112" r="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" stopOpacity="0.38" />
              <stop offset="1" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
            <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="currentColor" fillOpacity="0.13" />
            </pattern>
          </defs>

          {/* Emerald light washing in from the lower-left corner */}
          <rect x="0" y="0" width="400" height="120" fill="url(#hero-emerald)" />

          {/* Dot field, faded out from the left so it never crowds the label */}
          <rect x="150" y="0" width="250" height="120" fill="url(#hero-dots)" opacity="0.7" />
          <circle cx="350" cy="22" r="70" fill="url(#hero-glow)" />

          {/* Concentric rings — eight hairlines instead of three heavy ones */}
          <g stroke="currentColor" strokeWidth="0.6">
            <circle cx="350" cy="22" r="72" strokeOpacity="0.10" />
            <circle cx="350" cy="22" r="62" strokeOpacity="0.14" />
            <circle cx="350" cy="22" r="52" strokeOpacity="0.10" />
            <circle cx="350" cy="22" r="42" strokeOpacity="0.18" />
            <circle cx="350" cy="22" r="32" strokeOpacity="0.12" />
            <circle cx="350" cy="22" r="24" strokeOpacity="0.22" />
            <circle cx="350" cy="22" r="14" strokeOpacity="0.16" />
            <circle cx="350" cy="22" r="6" strokeOpacity="0.28" />
          </g>

          {/* Contour waves, stacked closer and thinner for a topographic feel */}
          <g stroke="currentColor" strokeWidth="0.7" fill="none">
            <path d="M-20 74 Q 90 44 210 70 T 460 60" strokeOpacity="0.08" />
            <path d="M-20 86 Q 95 52 215 80 T 470 70" strokeOpacity="0.11" />
            <path d="M-20 98 Q 100 60 220 92 T 480 82" strokeOpacity="0.15" />
            <path d="M-20 108 Q 105 70 225 102 T 486 94" strokeOpacity="0.12" />
            <path d="M-20 118 Q 110 80 230 112 T 492 106" strokeOpacity="0.09" />
          </g>

          {/* A couple of sparks, to break the regularity */}
          <g fill="currentColor">
            <circle cx="60" cy="26" r="1.6" fillOpacity="0.3" />
            <circle cx="128" cy="14" r="1" fillOpacity="0.22" />
            <circle cx="96" cy="48" r="1.2" fillOpacity="0.16" />
          </g>
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
