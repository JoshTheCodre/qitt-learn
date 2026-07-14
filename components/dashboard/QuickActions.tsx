import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

const ACTIONS: ActionCardProps[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "request",
    href: "/request",
    tile: "bg-[#36669c]/10 ring-[#36669c]/15",
    wash: "from-[#36669c]/[0.07]",
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "contribute",
    href: "/contribute",
    tile: "bg-[#3ec995]/15 ring-[#3ec995]/20",
    wash: "from-[#3ec995]/[0.09]",
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
