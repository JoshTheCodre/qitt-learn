"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Records a page view on every client-side navigation. Uses navigator.sendBeacon: it's
// fire-and-forget, doesn't block the navigation, and still delivers if the tab is closing
// — the cheapest correct way to ship an analytics ping. Next.js prefetches don't change
// the pathname, so this only fires on real navigations, never on hover-prefetch.
export default function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    // Skip internal pages and guard against counting the same path twice in a row (also
    // neutralizes React StrictMode's double-effect in dev).
    if (!pathname || pathname === last.current || pathname.startsWith("/admin")) return;
    last.current = pathname;

    const body = JSON.stringify({ path: pathname });
    // Plain string -> text/plain, same-origin, so no CORS preflight to slow it down.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/pv", body);
    } else {
      fetch("/api/pv", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
