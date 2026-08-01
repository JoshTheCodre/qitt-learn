import { NextResponse } from "next/server";
import { query, PAGEVIEWS_TABLE } from "@/lib/db";

// Public endpoint hit by a sendBeacon() on every client-side navigation. It must be as
// cheap as possible: normalize the path, do one UPSERT that bumps a daily counter, and
// return 204 with no body.
export const dynamic = "force-dynamic";

// Static sub-pages under /study. Anything else after /study/ is a course slug, which we
// collapse to /study/[slug] so thousands of courses don't explode into thousands of rows.
const STUDY_TOOLS = new Set(["learn", "practice", "performance", "quiz", "read"]);

function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let p = raw.split("?")[0].split("#")[0].trim().toLowerCase();
  if (!p.startsWith("/")) return null;
  if (p.length > 1) p = p.replace(/\/+$/, ""); // drop trailing slash (but keep root "/")
  if (p.length === 0) p = "/";
  if (p.length > 128) return null;
  // Don't count internal/admin/API traffic as user page views.
  if (p.startsWith("/admin") || p.startsWith("/api")) return null;

  const m = p.match(/^\/study\/([^/]+)(\/.*)?$/);
  if (m && !STUDY_TOOLS.has(m[1])) p = `/study/[slug]${m[2] ?? ""}`;

  return p;
}

export async function POST(req: Request) {
  let path: string | null = null;
  try {
    const body = (await req.json()) as { path?: unknown };
    path = normalizePath(body.path);
  } catch {
    path = null;
  }
  if (!path) return new NextResponse(null, { status: 204 });

  try {
    await query(
      `INSERT INTO ${PAGEVIEWS_TABLE} (path, day, views)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (path, day) DO UPDATE SET views = ${PAGEVIEWS_TABLE}.views + 1`,
      [path],
    );
  } catch {
    // Analytics must never surface an error to the visitor — swallow and move on.
  }
  return new NextResponse(null, { status: 204 });
}
