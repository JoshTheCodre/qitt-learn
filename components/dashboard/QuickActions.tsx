import Link from "next/link";
import IconFlat, { type IconFlatName } from "@/components/IconFlat";

const ACTIONS: {
  label: string;
  caption: string;
  icon: IconFlatName;
  href: string;
  tile: string;
  wash: string;
}[] = [
  {
    label: "Request",
    caption: "Ask for material",
    icon: "request",
    href: "/request",
    tile: "bg-[#36669c]/10 ring-[#36669c]/15",
    wash: "from-[#36669c]/[0.07]",
  },
  {
    label: "Contribute",
    caption: "Share your notes",
    icon: "contribute",
    href: "/contribute",
    tile: "bg-[#3ec995]/15 ring-[#3ec995]/20",
    wash: "from-[#3ec995]/[0.09]",
  },
];

export default function QuickActions() {
  return (
    <section className="mt-4 grid grid-cols-2 gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          /*
           * Same depth cues as the For You card, inverted for a light surface:
           *  - hairline ring instead of a border (a border shifts layout; a ring doesn't)
           *  - soft offset shadow for real elevation, not a tight halo
           *  - a colour wash from one corner, so it isn't lit flat
           */
          className="group relative overflow-hidden rounded-[20px] bg-surface-container-lowest p-3.5 ring-1 ring-inset ring-black/[0.06] shadow-[0_10px_24px_-12px_rgba(16,24,40,0.18)] transition-all hover:shadow-[0_16px_30px_-12px_rgba(16,24,40,0.24)] hover:-translate-y-0.5 squishy-press"
        >
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${action.wash} to-transparent`}
          />

          <div className="relative z-10">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${action.tile}`}
            >
              <IconFlat name={action.icon} size={22} />
            </span>
            <p className="mt-2.5 font-display text-[14px] font-bold leading-none text-on-surface">
              {action.label}
            </p>
            <p className="mt-1.5 font-body text-[10px] font-medium leading-none text-on-surface/55">
              {action.caption}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
