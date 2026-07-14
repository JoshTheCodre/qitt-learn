import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Accents sampled from each icon's dominant hue — see QuickActions for the rationale.
const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // { label: "Study", caption: "Read your notes", icon: "study", href: "/study/learn", accent: "94 168 88" },
  {
    label: "Practice",
    caption: "Quiz yourself",
    icon: "practice",
    href: "/study/practice",
    accent: "244 126 83", // #f47e53 — pencil coral
  },
  {
    label: "Performance",
    caption: "Track your scores",
    icon: "performance",
    href: "/study/performance",
    accent: "74 150 212", // #4a96d4 — chart blue
  },
];

export default function OverviewHero() {
  return (
    <section className="mt-3 grid grid-cols-2 gap-3">
      {TOOLS.map((tool) => (
        <ActionCard key={tool.label} {...tool} />
      ))}
    </section>
  );
}
