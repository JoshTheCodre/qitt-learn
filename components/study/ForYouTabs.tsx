import Link from "next/link";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";

const TABS: { label: string; href: string; icon: Icon3DName }[] = [
  { label: "Study", href: "/study/learn", icon: "study" },
  { label: "Practice", href: "/study/practice", icon: "practice" },
  { label: "Performance", href: "/study/performance", icon: "performance" },
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
            <Icon3D name={tab.icon} size={22} />
            <span className="font-display text-xs font-semibold text-on-surface-variant">
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
