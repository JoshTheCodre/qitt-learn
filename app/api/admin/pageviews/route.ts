import { NextResponse } from "next/server";
import { query, PAGEVIEWS_TABLE } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

// Traffic report for the admin dashboard. Reads the pre-aggregated counters, so it stays
// a couple of cheap GROUP BYs no matter how much traffic accrues.
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

export async function GET() {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set — add it to .env.local to use this dashboard." },
      { status: 500 },
    );
  }
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }

  try {
    // Cast day to text so it comes back as a stable "YYYY-MM-DD" string (avoids pg Date /
    // timezone surprises when we bucket it).
    const daily = await query<{ day: string; views: number }>(
      `SELECT to_char(day, 'YYYY-MM-DD') AS day, SUM(views)::int AS views
       FROM ${PAGEVIEWS_TABLE}
       WHERE day >= CURRENT_DATE - INTERVAL '29 days'
       GROUP BY day`,
    );
    const top = await query<{ path: string; views: number }>(
      `SELECT path, SUM(views)::int AS views
       FROM ${PAGEVIEWS_TABLE}
       WHERE day >= CURRENT_DATE - INTERVAL '29 days'
       GROUP BY path
       ORDER BY views DESC
       LIMIT 15`,
    );

    // Pricing is a conversion page, so surface its views as a first-class metric.
    const pricingRes = await query<{ today: number; last30: number }>(
      `SELECT
         COALESCE(SUM(views) FILTER (WHERE day = CURRENT_DATE), 0)::int AS today,
         COALESCE(SUM(views) FILTER (WHERE day >= CURRENT_DATE - INTERVAL '29 days'), 0)::int AS last30
       FROM ${PAGEVIEWS_TABLE}
       WHERE path = '/pricing'`,
    );
    const pricing = pricingRes.rows[0] ?? { today: 0, last30: 0 };

    // Pre-seed 30 day buckets so quiet days render as zero bars.
    const buckets = new Map<string, number>();
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      buckets.set(new Date(now - i * DAY).toISOString().slice(0, 10), 0);
    }
    for (const row of daily.rows) {
      if (buckets.has(row.day)) buckets.set(row.day, row.views);
    }

    const viewsByDay = Array.from(buckets, ([date, count]) => ({ date, count }));
    const last30 = viewsByDay.reduce((n, d) => n + d.count, 0);
    const todayKey = new Date(now).toISOString().slice(0, 10);
    const today = buckets.get(todayKey) ?? 0;

    return NextResponse.json({
      ok: true,
      totals: { last30, today },
      pricing: { today: Number(pricing.today) || 0, last30: Number(pricing.last30) || 0 },
      viewsByDay,
      topPages: top.rows.map((r) => ({ path: r.path, views: Number(r.views) || 0 })),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load page views" },
      { status: 500 },
    );
  }
}
