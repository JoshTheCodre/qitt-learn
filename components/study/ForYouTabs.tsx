import Link from "next/link";

const TABS = [
  { label: "Study", href: "/study/learn", icon: "auto_stories", gradient: "from-violet-500 to-fuchsia-500" },
  { label: "Practice", href: "/study/practice", icon: "stylus_note", gradient: "from-amber-400 to-orange-500" },
  { label: "Performance", href: "/study/performance", icon: "trending_up", gradient: "from-emerald-400 to-teal-500" },
];

export default function ForYouTabs() {
  return (
    <section className="mt-6">
      <h3 className="font-display text-[18px] font-bold text-on-surface mb-4 ml-1">For You</h3>
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/20 transition-all squishy-press"
          >
            <span
              className={`material-symbols-outlined text-[20px] leading-none bg-gradient-to-br ${tab.gradient} bg-clip-text text-transparent`}
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}
            >
              {tab.icon}
            </span>
            <span className="font-display text-xs font-semibold text-on-surface-variant">
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
