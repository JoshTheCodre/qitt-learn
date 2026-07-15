import Link from "next/link";

export type ActionCardProps = {
  label: string;
  caption: string;
  /** Material Symbols ligature name, e.g. "download". */
  icon: string;
  href: string;
};

/**
 * The dashboard card. Shared by Quick Actions (Request / Contribute) and the study
 * tools (Practice / Performance) so all four are literally identical in style.
 *
 * Deliberately plain: one surface, one hairline ring, one soft shadow, and a single
 * brand-tinted icon. No per-card colour, no glow, no texture — four different accent
 * colours on four small cards read as noise, not richness. The restraint is the point.
 */
export default function ActionCard({ label, caption, icon, href }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_20px_-14px_rgba(16,24,40,0.18)] transition-shadow duration-200 hover:shadow-[0_2px_6px_rgba(16,24,40,0.06),0_14px_26px_-14px_rgba(16,24,40,0.22)] squishy-press"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
        <span className="material-symbols-outlined text-[22px] leading-none text-brand">
          {icon}
        </span>
      </span>

      <p className="mt-3 font-display text-[14px] font-bold leading-none text-on-surface">
        {label}
      </p>
      <p className="mt-1.5 font-body text-[11px] font-medium leading-none text-on-surface/50">
        {caption}
      </p>

      <span className="material-symbols-outlined absolute right-3 top-4 text-[18px] leading-none text-on-surface/25 transition-colors group-hover:text-brand/70">
        chevron_right
      </span>
    </Link>
  );
}
