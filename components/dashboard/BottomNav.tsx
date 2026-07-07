"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Timetable", icon: "calendar_today", href: "/timetable" },
  { label: "Profile", icon: "person", href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex justify-around items-center px-4 py-3 bg-surface shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-1.5 relative transition-colors ${
              active ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined font-light ${active ? "active-nav-icon" : ""}`}
            >
              {item.icon}
            </span>
            <span className="font-display text-xs font-medium">{item.label}</span>
            {active && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}
