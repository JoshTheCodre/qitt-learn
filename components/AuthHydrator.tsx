"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { refreshCurrentUser } from "@/lib/store";

// Public pages where the visitor is, by definition, signed out (middleware bounces
// signed-in users away from these), so there's nothing to hydrate — skip the request.
const SKIP = new Set(["/", "/login", "/register"]);

// On each full app load, pull the authoritative user from /api/me using the session cookie.
// This makes the cookie — not just the localStorage cache — the source of truth: it
// rehydrates the cache when it's empty but the session is still valid, and clears it when
// the session has expired. It also stamps last_seen server-side, so the retention dashboard
// reflects real visits, not just logins.
//
// Runs once per full load (empty deps): the root layout doesn't remount on client-side
// navigation, so this doesn't fire on every in-app page change.
export default function AuthHydrator() {
  const pathname = usePathname();
  useEffect(() => {
    if (!SKIP.has(pathname)) refreshCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
