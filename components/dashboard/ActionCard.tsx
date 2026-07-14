import Link from "next/link";
import IconFlat, { type IconFlatName } from "@/components/IconFlat";

export type ActionCardProps = {
  label: string;
  caption: string;
  icon: IconFlatName;
  href: string;
  /** Tailwind classes for the icon tile — background + ring, e.g. "bg-[#3ec995]/15 ring-[#3ec995]/20" */
  tile: string;
  /** Tailwind gradient-from class for the corner colour wash, e.g. "from-[#3ec995]/[0.09]" */
  wash: string;
};

/**
 * The dashboard's card. Shared by Quick Actions (Request / Contribute) and the study
 * tools (Practice / Performance) so all four read as one family.
 *
 * Depth cues, on a light surface:
 *  - a hairline ring rather than a border (a border shifts layout; a ring doesn't)
 *  - a soft offset shadow for real elevation, not a tight dark halo
 *  - a colour wash from one corner, so the card isn't lit flat
 */
export default function ActionCard({ label, caption, icon, href, tile, wash }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[20px] bg-surface-container-lowest p-3.5 ring-1 ring-inset ring-black/[0.06] shadow-[0_10px_24px_-12px_rgba(16,24,40,0.18)] transition-all hover:shadow-[0_16px_30px_-12px_rgba(16,24,40,0.24)] hover:-translate-y-0.5 squishy-press"
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${wash} to-transparent`} />

      <div className="relative z-10">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${tile}`}
        >
          <IconFlat name={icon} size={22} />
        </span>
        <p className="mt-2.5 font-display text-[14px] font-bold leading-none text-on-surface">
          {label}
        </p>
        <p className="mt-1.5 font-body text-[10px] font-medium leading-none text-on-surface/55">
          {caption}
        </p>
      </div>
    </Link>
  );
}
