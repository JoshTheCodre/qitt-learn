import Link from "next/link";

export type ActionCardProps = {
  label: string;
  caption: string;
  /** Material Symbols ligature name, e.g. "download". */
  icon: string;
  href: string;
  /** Solid colour for the circular icon badge (hex). */
  color: string;
};

/**
 * The dashboard card, styled after the reference "Explore These" cards: a plain white
 * card with a solid colour circular icon badge, a bold title and a muted caption.
 *
 * Colour lives only in the badge — a small, consistent circle with a white glyph — so
 * the four cards read as one disciplined set rather than a rainbow of loud surfaces.
 * All four are otherwise identical.
 */
export default function ActionCard({ label, caption, icon, href, color }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-shadow duration-200 hover:shadow-[0_8px_20px_-12px_rgba(16,24,40,0.2)] squishy-press"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <span className="material-symbols-outlined icon-filled text-[22px] leading-none text-white">
          {icon}
        </span>
      </span>

      <p className="mt-3 font-display text-[14px] font-bold leading-tight text-on-surface">
        {label}
      </p>
      <p className="mt-1 font-body text-[11px] font-medium leading-snug text-on-surface/55">
        {caption}
      </p>
    </Link>
  );
}
