import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// A signed, httpOnly session cookie: "<email>|<hmac>". Not a full JWT — just enough
// to stop the email being forged. Set SESSION_SECRET in the environment for production.
const SECRET = process.env.SESSION_SECRET || "qitt-dev-session-secret-change-me";

export const SESSION_COOKIE = "qitt_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeSessionValue(email: string): string {
  return `${email}|${sign(email)}`;
}

// Convenience for route handlers: the signed-in user's email from the request cookies.
export function currentSessionEmail(): string | null {
  return readSessionEmail(cookies().get(SESSION_COOKIE)?.value);
}

export function readSessionEmail(cookie: string | undefined | null): string | null {
  if (!cookie) return null;
  const i = cookie.lastIndexOf("|");
  if (i < 0) return null;
  const email = cookie.slice(0, i);
  const sig = cookie.slice(i + 1);
  const expected = sign(email);
  try {
    if (sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return email;
    }
  } catch {
    /* malformed */
  }
  return null;
}
