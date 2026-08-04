import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Persistent-login routing gate.
//
// The httpOnly session cookie is set on login/register (lib/session.ts) and lasts 30 days.
// Here we only check that it EXISTS — cheap and Edge-safe. The real signature check runs
// server-side in /api/me and the other authenticated routes, so a forged/tampered cookie
// still can't read any data; this only decides which page to show.
const SESSION_COOKIE = "qitt_session";

// Public entry/auth pages a signed-in user shouldn't be stuck on — send them into the app.
const ENTRY_PAGES = new Set(["/", "/login", "/register"]);

// App surface that requires a session. Matched as a prefix, so e.g. /study/<course> counts.
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/study",
  "/timetable",
  "/profile",
  "/notifications",
  "/calendar",
  "/cgpa",
  "/contribute",
  "/request",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signedIn = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

  // Already signed in → skip landing/auth and go straight to the dashboard.
  if (signedIn && ENTRY_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Not signed in and reaching for a protected page → send to login, remembering where they
  // were headed so we can return them there after they sign in.
  if (
    !signedIn &&
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Page navigations only — skip API routes, Next internals and static files (anything
  // with a dot: /sw.js, /manifest.json, images, etc.). /admin has its own password gate.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
