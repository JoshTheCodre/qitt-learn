/**
 * Thin wrapper over the Vibration API.
 *
 * Support is Android-only in practice — iOS Safari does not implement
 * navigator.vibrate and exposes no access to the Taptic Engine, so every call
 * here is a silent no-op on iPhone. Treat haptics as an enhancement, never as
 * the only feedback for an action.
 *
 * Fire these on discrete commitments (choosing, starting, answering). Do not
 * wire them to scroll, hover, or anything that repeats.
 */
export type HapticPattern = "select" | "tap" | "success" | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  select: 8, // a tick — changing a chip, segment, or slider step
  tap: 16, // a commit — starting a session, submitting
  success: [12, 45, 28],
  error: [28, 40, 28],
};

export function haptic(pattern: HapticPattern = "select") {
  if (typeof window === "undefined") return;

  const { navigator: nav, matchMedia } = window;
  if (typeof nav?.vibrate !== "function") return;

  // Someone who has asked for less motion has usually asked for less buzzing too.
  if (matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  try {
    nav.vibrate(PATTERNS[pattern]);
  } catch {
    // Some browsers throw if the gesture requirement isn't met; feedback is
    // optional, so never let it break the interaction.
  }
}
