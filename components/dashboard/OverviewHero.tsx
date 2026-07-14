import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Accents as "R G B" channels — see the note on ActionCard.accent.
const BLUE = "54 102 156"; // #36669c
const MINT = "62 201 149"; // #3ec995

const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // { label: "Study", caption: "Read your notes", icon: "study", href: "/study/learn", accent: BLUE },
  {
    label: "Practice",
    caption: "Quiz yourself",
    icon: "practice",
    href: "/study/practice",
    accent: MINT,
  },
  {
    label: "Performance",
    caption: "Track your scores",
    icon: "performance",
    href: "/study/performance",
    accent: BLUE,
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
