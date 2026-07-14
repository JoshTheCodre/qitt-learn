import type { CSSProperties } from "react";
import Link from "next/link";
import IconFlat, { type IconFlatName } from "@/components/IconFlat";

export type ActionCardProps = {
  label: string;
  caption: string;
  icon: IconFlatName;
  href: string;
  /**
   * Accent as an "R G B" channel triplet, NOT a hex string.
   *
   * Tailwind compiles classes at build time from source text, so it cannot generate
   * `bg-[#36669c]/10` from a runtime prop — the class would silently produce no CSS.
   * Passing channels lets the colour-dependent layers be inline `rgb(var(--c) / a)`,
   * which is real CSS and works with any value.
   */
  accent: string;
};

/**
 * The dashboard card. Shared by Quick Actions (Request / Contribute) and the study
 * tools (Practice / Performance) so all four read as one family.
 *
 * The depth is deliberately layered — a single flat shadow is what makes a card look
 * cheap. Bottom to top:
 *   1. accent glow washing in from the top-right corner (directional light)
 *   2. diagonal hatch, masked so it fades before it reaches the text (texture)
 *   3. a 1px white highlight along the top edge (the lit edge of a raised surface)
 *   4. a two-part shadow: a tight contact shadow + a wide soft ambient one
 */
export default function ActionCard({ label, caption, icon, href, accent }: ActionCardProps) {
  const vars = { "--c": accent } as CSSProperties;

  return (
    <Link
      href={href}
      style={vars}
      className="group relative overflow-hidden rounded-[20px] bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.05] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-14px_rgba(16,24,40,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_22px_38px_-14px_rgba(16,24,40,0.28)] squishy-press"
    >
      {/* 1. directional accent light */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(125% 95% at 100% 0%, rgb(var(--c) / 0.14), transparent 62%)",
        }}
      />

      {/* 2. hatch, fading out toward the text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgb(var(--c) / 0.06) 0 1px, transparent 1px 9px)",
          maskImage: "linear-gradient(to bottom left, #000, transparent 55%)",
          WebkitMaskImage: "linear-gradient(to bottom left, #000, transparent 55%)",
        }}
      />

      {/* 3. lit top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="relative z-10">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset ring-black/[0.04] transition-transform duration-300 group-hover:scale-105"
          style={{
            background: "linear-gradient(140deg, rgb(var(--c) / 0.18), rgb(var(--c) / 0.05))",
            boxShadow: "0 8px 18px -10px rgb(var(--c) / 0.7)",
          }}
        >
          <IconFlat name={icon} size={24} />
        </span>

        <p className="mt-3 font-display text-[14px] font-bold leading-none text-on-surface">
          {label}
        </p>
        <p className="mt-1.5 font-body text-[10px] font-medium leading-none text-on-surface/50">
          {caption}
        </p>
      </div>

      {/* Affordance: nudges on hover so the card reads as a door, not a tile */}
      <span
        className="material-symbols-outlined absolute bottom-3.5 right-3.5 z-10 text-[16px] leading-none opacity-25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-60"
        style={{ color: "rgb(var(--c))" }}
      >
        arrow_forward
      </span>
    </Link>
  );
}
