import { ICON_3D, type Icon3DName } from "@/lib/icon3d.generated";

export type { Icon3DName };

type Icon3DProps = {
  name: Icon3DName;
  size?: number;
  /**
   * Kept for call-site compatibility. Icons are inlined as data URIs and paint with
   * the HTML, so there is nothing to prioritize or preload.
   */
  priority?: boolean;
  className?: string;
};

export default function Icon3D({ name, size = 24, className = "" }: Icon3DProps) {
  return (
    // Inlined data URI — no network request, so the icon is there on first paint.
    // next/image would add a round trip through the optimizer for a 24px decoration.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON_3D[name]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={`shrink-0 select-none ${className}`}
    />
  );
}
