import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Accents as "R G B" channels — see the note on ActionCard.accent.
const BLUE = "54 102 156"; // #36669c
const MINT = "62 201 149"; // #3ec995

const ACTIONS: ActionCardProps[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "request",
    href: "/request",
    accent: BLUE,
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "contribute",
    href: "/contribute",
    accent: MINT,
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
