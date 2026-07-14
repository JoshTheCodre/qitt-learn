import ActionCard, { type ActionCardProps } from "@/components/dashboard/ActionCard";

/*
 * Each card carries its own colour, sampled from its icon's dominant hue (all cool: violet / teal / green / blue) — so the
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
    accent: "147 156 226", // #939ce2 — envelope violet
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "contribute",
    href: "/contribute",
    accent: "20 184 200",  // #14b8c8 — folder teal (deepened from the icon's #38e3fb: the
                          // raw cyan is too pale for the hover arrow to read on white)
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
