import Link from "next/link";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";

const ACTIONS: { label: string; icon: Icon3DName; href: string; iconWrap: string }[] = [
  {
    label: "Request Material",
    icon: "request",
    href: "/request",
    iconWrap: "bg-amber-100/70",
  },
  {
    label: "Contribute Material",
    icon: "contribute",
    href: "/contribute",
    iconWrap: "bg-emerald-100/70",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-4 grid grid-cols-2 gap-4">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="bento-card-hover squishy-press flex flex-col items-start gap-3 p-4 rounded-[20px] bg-surface-container-lowest shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent hover:border-primary/10"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.iconWrap}`}
          >
            <Icon3D name={action.icon} size={24} />
          </div>
          <span className="font-display text-[13px] font-semibold text-on-surface text-left whitespace-nowrap">
            {action.label}
          </span>
        </Link>
      ))}
    </section>
  );
}
