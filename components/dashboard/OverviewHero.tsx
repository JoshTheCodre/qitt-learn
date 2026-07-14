import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // {
  //   label: "Study",
  //   caption: "Read your notes",
  //   icon: "study",
  //   href: "/study/learn",
  //   tile: "bg-[#36669c]/10 ring-[#36669c]/15",
  //   wash: "from-[#36669c]/[0.07]",
  // },
  {
    label: "Practice",
    caption: "Quiz yourself",
    icon: "practice",
    href: "/study/practice",
    tile: "bg-[#3ec995]/15 ring-[#3ec995]/20",
    wash: "from-[#3ec995]/[0.09]",
  },
  {
    label: "Performance",
    caption: "Track your scores",
    icon: "performance",
    href: "/study/performance",
    tile: "bg-[#36669c]/10 ring-[#36669c]/15",
    wash: "from-[#36669c]/[0.07]",
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
