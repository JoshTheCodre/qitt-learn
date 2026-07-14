"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/store";

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAU3WKEecXrJ8DkLkSCOfbDsos1cylYgWky_LWRq6C6LkwwpxKlBwMdrR8XyYfNNPYzeL4lfvnG_rLK-0HtjoVWSISbkZFoWOZXKBaMQs9GJ0OVXGiAYOOd1MiJ2TNtkxvyYFgrBvea_e5UGmjJebQRjxTHZ42HsPCr0cihlp8_O6-mL3EiKjMHNjlEqfFMSwe5Mqc5ipYXlfBXzBOlQnS1LuT9J3vcnCkhmQYaODaHGwuc6x8_fN46Xcw3RCJpu5OY7PVsqAYalMI";

export default function Header({
  title,
  showAvatar = true,
  showUpgrade = true,
  paddingX = "px-gutter",
  transparent = false,
}: {
  title?: string;
  showAvatar?: boolean;
  showUpgrade?: boolean;
  paddingX?: string;
  // Opt in on pages with artwork behind the header — the default white bar would
  // otherwise paint over the top of it. Once scrolled it still goes frosted, so the
  // content passing underneath stays readable.
  transparent?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The avatar chosen at signup. Falls back to the stock image if none was picked.
  useEffect(() => {
    setAvatar(getCurrentUser()?.profile.picture_url ?? null);
  }, []);

  return (
    <header
      className={`w-full top-0 z-40 transition-all ${
        scrolled
          ? "shadow-sm bg-white/90 backdrop-blur-md"
          : transparent
            ? "bg-transparent"
            : "bg-background"
      }`}
    >
      <div className={`flex items-center justify-between py-4 ${paddingX}`}>
        <div className="flex items-center gap-3">
          {showAvatar && (
            <Link
              href="/profile"
              aria-label="Open profile"
              className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant squishy-press"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-full h-full object-cover" alt="Student avatar" src={avatar ?? AVATAR_URL} />
            </Link>
          )}
          {title ? (
            <h1 className="font-display text-[24px] leading-tight font-bold text-on-surface">
              {title}
            </h1>
          ) : (
            <div>
              <h1 className="font-display text-[24px] leading-tight font-bold text-brand">
                Hello, Joshua
              </h1>
              <p className="font-display text-sm font-medium text-on-surface/70">
                Computer Science{" "}
                <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 align-middle mx-0.5" />{" "}
                200lvl
              </p>
            </div>
          )}
        </div>
        {showUpgrade && (
          // Quiet by design: the moving gradient IS the border, so the pill itself stays
          // a plain surface. It's a standing offer, not a call to action.
          <div className="animated-ring shrink-0 rounded-full p-px">
            <Link
              href="/upgrade"
              // Opaque fill — a translucent one would let the conic gradient show through
              // the middle instead of only the 1px ring.
              className="flex items-center gap-1 rounded-full bg-background px-2.5 py-1.5 transition-colors hover:bg-surface-container squishy-press"
            >
              {/* Filled, and in the accent rather than the label's blue — one spot of
                  colour is what makes a quiet pill still catch the eye. */}
              <span className="material-symbols-outlined icon-filled text-[14px] leading-none text-accent">
                bolt
              </span>
              <span className="font-display text-[12px] font-semibold text-brand">Upgrade</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
