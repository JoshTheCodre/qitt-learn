import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Clean Material Symbols line icons, all in the single brand accent — see ActionCard.
const ACTIONS: ActionCardProps[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "download",
    href: "/request",
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "cloud_upload",
    href: "/contribute",
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
