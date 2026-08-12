"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/store";
import { randomAvatarUrl } from "@/lib/avatars";

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
  const [who, setWho] = useState<{ first: string; department: string; level: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The signed-in student's own details. The avatar falls back to a stable one seeded
  // from the email if none was picked, so every account still shows a real face.
  useEffect(() => {
    const p = getCurrentUser()?.profile;
    if (p) {
      setAvatar(p.picture_url || randomAvatarUrl(p.email));
      setWho({
        first: p.name.trim().split(/\s+/)[0] || p.name.trim(),
        department: p.department,
        level: String(p.level).replace(/\D/g, ""),
      });
    }
  }, []);

  return (
    <header
      className={`w-full top-0 z-40 transition-all ${
        scrolled
          ? "shadow-sm bg-background/85 backdrop-blur-md"
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
              className="shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2.5px] squishy-press"
            >
              {/* Instagram-story-style ring: gradient outer, a background-coloured gap, then
                  the avatar. Rendered only once resolved to avoid a flash of a broken image. */}
              <span className="block rounded-full bg-background p-[2px]">
                <span className="block h-11 w-11 overflow-hidden rounded-full bg-surface-container-highest">
                  {avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="h-full w-full object-cover" alt="Student avatar" src={avatar} />
                  )}
                </span>
              </span>
            </Link>
          )}
          {title ? (
            <h1 className="font-display text-[24px] leading-tight font-bold text-on-surface">
              {title}
            </h1>
          ) : (
            <div>
              <h1 className="font-display text-[24px] leading-tight font-bold text-brand">
                {who ? `Hello, ${who.first}` : "Hello"}
              </h1>
              {who && (
                <p className="font-display text-sm font-medium text-on-surface/70">
                  {who.department}
                  {who.level && (
                    <>
                      {" "}
                      <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 align-middle mx-0.5" />{" "}
                      {who.level}lvl
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
        {showUpgrade && (
          // Quiet outlined pill — a standing offer, not a call to action. No fill, no
          // icon, so it doesn't compete with the page content.
          <Link
            href="/upgrade"
            className="flex shrink-0 items-center rounded-full border border-brand/25 px-3.5 py-1.5 font-display text-[12px] font-semibold text-brand transition-colors hover:bg-brand/[0.06] squishy-press"
          >
            Upgrade
          </Link>
        )}
      </div>
    </header>
  );
}
