import Link from "next/link";

const ACTIONS = [
  {
    label: "Request Material",
    icon: "request_page",
    href: "/request",
    iconWrap: "bg-amber-100/70 text-amber-700",
  },
  {
    label: "Contribute Material",
    icon: "cloud_upload",
    href: "/contribute",
    iconWrap: "bg-emerald-100/70 text-emerald-700",
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
            <span className="material-symbols-outlined">{action.icon}</span>
          </div>
          <span className="font-display text-[13px] font-semibold text-on-surface text-left whitespace-nowrap">
            {action.label}
          </span>
        </Link>
      ))}
    </section>
  );
}
