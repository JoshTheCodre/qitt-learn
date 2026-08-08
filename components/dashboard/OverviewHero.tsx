"use client";

import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";
import AssignmentsCard from "@/components/dashboard/AssignmentsCard";

// Same reference card style as QuickActions, so all four cards match.
const TOOLS: ActionCardProps[] = [
  // Study is parked for now — re-enable and the grid still works.
  // { label: "Study", caption: "Read your notes", icon: "menu_book", href: "/study/learn", color: "#f59e0b" },
  {
    label: "Practice",
    caption: "Quiz & track scores",
    icon: "quiz",
    href: "/study/practice",
    color: "#e9338a", // pink
  },
  {
    label: "My Materials",
    caption: "Upload, study & request",
    icon: "library_books",
    href: "/study/my-materials",
    color: "#0ea5e9", // sky
  },
];

export default function OverviewHero() {
  // Returns bare cards (no grid of its own) so the dashboard can pack these together with
  // the quick-action cards in a single grid.
  return (
    <>
      {TOOLS.map((tool) => (
        <ActionCard key={tool.label} {...tool} />
      ))}
      {/* Live assignments card — renders itself null when the feature is off. */}
      <AssignmentsCard />
    </>
  );
}
