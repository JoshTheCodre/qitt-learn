import { ICON_FLAT, type IconFlatName } from "@/lib/iconflat.generated";

export type { IconFlatName };

type IconFlatProps = {
  name: IconFlatName;
  size?: number;
  className?: string;
};

/**
 * Flat 2D colour icon. Use these where an icon should look bright and switched-on —
 * Material Symbols are monochrome outlines and read as inactive/greyed at small sizes.
 */
export default function IconFlat({ name, size = 24, className = "" }: IconFlatProps) {
  return (
    // Inlined data URI — no network request, so the icon is there on first paint.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON_FLAT[name]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 select-none ${className}`}
    />
  );
}
