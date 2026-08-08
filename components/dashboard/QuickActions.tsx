import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Home quick-actions. Colour lives only in the circular badge.
const ACTIONS: ActionCardProps[] = [
  {
    label: "CGPA Calc",
    caption: "Estimate your CGPA",
    icon: "calculate",
    href: "/cgpa",
    color: "#16b364", // green
  },
];

// Bare cards (no grid) so they pack into the dashboard's shared card grid.
export default function QuickActions() {
  return (
    <>
      {ACTIONS.map((action) => (
        <ActionCard key={action.label} {...action} />
      ))}
    </>
  );
}
