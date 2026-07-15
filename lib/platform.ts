import "server-only";

import { headers } from "next/headers";

/**
 * Server-side platform detection from the User-Agent.
 *
 * Done on the server, not in the browser: a client-side check would render the wrong
 * variant first and then swap after hydration, so every Android user would see the iOS
 * card flash on screen. There is no way to avoid that flash client-side.
 *
 * TWO COSTS, both real:
 *
 * 1. Reading headers() opts the page out of static generation — it becomes
 *    dynamically rendered on every request. For the dashboard that's fine (it's
 *    user-specific anyway), but do not sprinkle this around.
 *
 * 2. User-Agent sniffing is a heuristic, not a fact. It can be spoofed, and desktop
 *    browsers report neither. Everything that isn't Android falls back to the default
 *    variant, so a wrong guess degrades to "the other good layout" — never to a broken
 *    one. Never gate anything that matters (auth, payments, data) on this.
 */
export function isAndroid(): boolean {
  const ua = headers().get("user-agent") ?? "";
  return /android/i.test(ua);
}
