import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Same clean line-icon + brand accent as QuickActions, so all four cards match.
const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // { label: "Study", caption: "Read your notes", icon: "menu_book", href: "/study/learn" },
  {
    label: "Practice",
    caption: "Quiz yourself",
    icon: "quiz",
    href: "/study/practice",
  },
  {
    label: "Performance",
    caption: "Track your scores",
    icon: "insights",
    href: "/study/performance",
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
