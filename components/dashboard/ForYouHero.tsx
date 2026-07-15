/**
 * The gradient "For You" card — Android only.
 *
 * iOS keeps the flat ActionCard grid (see OverviewHero). The two exist side by side
 * on purpose; see lib/platform.ts for why, and for the cost.
 */
import Link from "next/link";
import IconFlat, { type IconFlatName } from "@/components/IconFlat";

// Full-colour 2D icons — monochrome glyphs read as inactive against the card.
const TOOLS: { label: string; icon: IconFlatName; href: string }[] = [
  // Study is parked for now — re-enable with grid-cols-3 below.
  // { label: "Study", icon: "study", href: "/study/learn" },
  { label: "Practice", icon: "practice", href: "/study/practice" },
  { label: "Performance", icon: "performance", href: "/study/performance" },
];

export default function ForYouHero() {
  return (
    <section className="mt-4">
      {/*
       * Depth is what separates this from a flat coloured box:
       *  - a three-stop gradient so the surface turns, rather than washing flat
       *  - ring-inset white hairline = the lit top edge of a raised surface
       *  - a large, soft, offset shadow (not a tight dark halo) = real elevation
       *  - mint light entering from one corner, so it isn't lit uniformly
       */}
      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#4d80bd] via-[#36669c] to-[#22406a] p-3.5 text-white shadow-[0_16px_36px_-14px_rgba(34,64,106,0.6)] ring-1 ring-inset ring-white/[0.14]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-white"
          viewBox="0 0 400 150"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            {/* Mint enters as light on top of the blue, not as a stop inside it —
                blending them in one gradient just muddies the middle. */}
            <radialGradient id="hero-mint" cx="18" cy="150" r="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3ec995" stopOpacity="0.5" />
              <stop offset="1" stopColor="#3ec995" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hero-glow" cx="356" cy="4" r="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="hero-lines"
              width="9"
              height="9"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="9" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" />
            </pattern>
            <linearGradient id="hero-fade" x1="400" y1="0" x2="120" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="hero-mask">
              <rect width="400" height="150" fill="url(#hero-fade)" />
            </mask>
          </defs>

          <rect width="400" height="150" fill="url(#hero-mint)" />
          {/* Hatching, masked so it fades out before it reaches the text */}
          <rect width="400" height="150" fill="url(#hero-lines)" mask="url(#hero-mask)" />
          <rect width="400" height="150" fill="url(#hero-glow)" />

          {/* Concentric hairlines — detail from density, not stroke weight */}
          <g stroke="currentColor" strokeWidth="0.6" mask="url(#hero-mask)">
            <circle cx="356" cy="4" r="74" strokeOpacity="0.10" />
            <circle cx="356" cy="4" r="58" strokeOpacity="0.14" />
            <circle cx="356" cy="4" r="42" strokeOpacity="0.10" />
            <circle cx="356" cy="4" r="28" strokeOpacity="0.16" />
          </g>
        </svg>

        {/* Compact: icon and text sit on one row, so each tile is ~52px instead of ~90px,
            and the card keeps its depth without eating the fold. */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[15px] font-bold leading-none">For You</h2>
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ec995] shadow-[0_0_8px_rgba(62,201,149,0.9)]" />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="flex items-center gap-2 rounded-xl bg-white/[0.09] px-2.5 py-2 ring-1 ring-inset ring-white/[0.12] backdrop-blur-sm transition-colors hover:bg-white/[0.16] squishy-press"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.14] ring-1 ring-inset ring-white/10">
                  <IconFlat name={tool.icon} size={16} />
                </span>
                <span className="min-w-0 truncate font-display text-[12px] font-bold">
                  {tool.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
