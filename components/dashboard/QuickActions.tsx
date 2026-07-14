import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

/*
 * Each card carries its own colour, sampled from its icon's dominant hue — so the
 * glow, the icon tile and the arrow all agree with the artwork instead of forcing
 * four different icons into one blue/mint palette.
 * See the note on ActionCard.accent for why these are "R G B" channels, not hex.
 */
const ACTIONS: ActionCardProps[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "request",
    href: "/request",
    accent: "218 72 127", // #da487f — envelope pink
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "contribute",
    href: "/contribute",
    accent: "255 201 84", // #ffc954 — folder amber
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
