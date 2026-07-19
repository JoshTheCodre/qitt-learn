import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Same reference card style as QuickActions, so all four cards match.
const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // { label: "Study", caption: "Read your notes", icon: "menu_book", href: "/study/learn", color: "#f59e0b" },
  {
    label: "Practice",
    caption: "Quiz yourself",
    icon: "quiz",
    href: "/study/practice",
    color: "#e9338a", // pink
  },
  {
    label: "Performance",
    caption: "Track your scores",
    icon: "insights",
    href: "/study/performance",
    color: "#7c5ce0", // purple
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
