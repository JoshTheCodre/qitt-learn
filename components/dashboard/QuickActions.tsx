import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Two home quick-actions. Colour lives only in the circular badge.
const ACTIONS: ActionCardProps[] = [
  {
    label: "Share Materials",
    caption: "Ask for it or share yours",
    icon: "swap_horiz",
    href: "/request",
    color: "#f59e0b", // amber
  },
  {
    label: "CGPA Calc",
    caption: "Estimate your CGPA",
    icon: "calculate",
    href: "/cgpa",
    color: "#16b364", // green
  },
];

export default function QuickActions() {
  return (
    <section className="mt-4 grid grid-cols-2 gap-3">
      {ACTIONS.map((action) => (
        <ActionCard key={action.label} {...action} />
      ))}
    </section>
  );
}
