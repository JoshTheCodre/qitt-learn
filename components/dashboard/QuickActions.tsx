import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

// Reference-style colored circular badges — one solid colour each, clean and flat.
const ACTIONS: ActionCardProps[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "download",
    href: "/request",
    color: "#16b364", // green
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "cloud_upload",
    href: "/contribute",
    color: "#2e7df1", // blue
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
