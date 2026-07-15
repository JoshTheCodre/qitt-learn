import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * A single shared password gates /admin.
 *
 * The cookie holds an HMAC of a fixed string, keyed by ADMIN_PASSWORD — so it cannot
 * be forged without knowing the password, and the password itself never sits in the
 * cookie. It's httpOnly, so page scripts can't read it either.
 *
 * This is a gate, not an identity system: there are no accounts, roles, or audit
 * trail, and everyone who uploads shares one password. Fine for one admin. If more
 * than a couple of people ever need this, it should become real per-user auth.
 */
const COOKIE = "qitt_admin";

function expected(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Missing ADMIN_PASSWORD — set it in .env.local");
  return createHmac("sha256", secret).update("qitt-admin-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  // Length check first: timingSafeEqual throws on a length mismatch. Comparing lengths
  // does leak the password's length, which is an acceptable trade for not leaking the
  // password itself byte-by-byte through timing.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function sessionToken(): string {
  return expected();
}

export function isAdmin(): boolean {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected());
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE = COOKIE;
