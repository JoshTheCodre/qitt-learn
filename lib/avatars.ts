/**
 * DiceBear avatars (https://www.dicebear.com) — v9 HTTP API, no key required.
 *
 * The URL is stored as the profile picture rather than the rendered SVG: it's a few
 * bytes instead of ~20KB, and it re-renders identically anywhere it's shown.
 */
const API = "https://api.dicebear.com/9.x";

export const AVATAR_STYLES = [
  "adventurer",
  "big-smile",
  "fun-emoji",
  "lorelei",
  "micah",
  "notionists",
  "open-peeps",
  "personas",
  "thumbs",
  "bottts",
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number];

export function avatarUrl(style: AvatarStyle, seed: string) {
  return `${API}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * A deterministic page of options. Deterministic matters: a random set would differ
 * between the server render and the client hydration, and React would throw a
 * mismatch. New sets come from bumping `page` on a click, not from Math.random().
 */
export function avatarChoices(page: number, count = 8) {
  return Array.from({ length: count }, (_, i) => {
    const n = page * count + i;
    const style = AVATAR_STYLES[n % AVATAR_STYLES.length];
    const seed = `qitt-${n}`;
    return { id: `${style}:${seed}`, style, seed, url: avatarUrl(style, seed) };
  });
}
