import { NextResponse } from "next/server";
import { query, USERS_TABLE } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";

// Exposes user PII (emails, profiles), so it is gated by the admin password. The matching
// dashboard lives at /admin/users.
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

type DbRow = {
  email: string;
  profile: {
    name?: string;
    university?: string;
    department?: string;
    level?: string;
  } | null;
  notif_on: boolean;
  // pg returns TIMESTAMPTZ as Date objects, not strings — normalize before using.
  created_at: string | Date;
  last_seen: string | Date | null;
  course_count: number;
};

export async function GET(req: Request) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set — add it to .env.local to use this dashboard." },
      { status: 500 },
    );
  }
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }

  // ?email=... returns one user's full record for the detail modal; otherwise the list.
  const detailEmail = new URL(req.url).searchParams.get("email");
  if (detailEmail) return userDetail(detailEmail);

  try {
    const r = await query<DbRow>(
      `SELECT email, profile, notif_on, created_at, last_seen,
              COALESCE(jsonb_array_length(courses), 0) AS course_count
       FROM ${USERS_TABLE}
       ORDER BY created_at DESC`,
    );

    const now = Date.now();
    const within = (v: string | Date | null, ms: number) =>
      v != null && now - new Date(v).getTime() <= ms;

    let active1 = 0;
    let active7 = 0;
    let active30 = 0;
    let new7 = 0;
    let new30 = 0;
    let returning = 0; // came back on a later day than they signed up
    let notifOn = 0;

    // Signups per day for the last 30 days, pre-seeded so quiet days show as zero bars.
    const buckets = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      buckets.set(new Date(now - i * DAY).toISOString().slice(0, 10), 0);
    }

    const users = r.rows.map((row) => {
      const createdIso = new Date(row.created_at).toISOString();
      const seenIso = row.last_seen ? new Date(row.last_seen).toISOString() : null;
      const created = new Date(createdIso).getTime();
      const seen = seenIso ? new Date(seenIso).getTime() : null;

      if (within(seenIso, DAY)) active1++;
      if (within(seenIso, 7 * DAY)) active7++;
      if (within(seenIso, 30 * DAY)) active30++;
      if (within(createdIso, 7 * DAY)) new7++;
      if (within(createdIso, 30 * DAY)) new30++;
      if (seen != null && seen - created > DAY) returning++;
      if (row.notif_on) notifOn++;

      const dayKey = createdIso.slice(0, 10);
      if (buckets.has(dayKey)) buckets.set(dayKey, (buckets.get(dayKey) ?? 0) + 1);

      return {
        email: row.email,
        name: row.profile?.name ?? "—",
        university: row.profile?.university ?? "",
        department: row.profile?.department ?? "",
        level: row.profile?.level ?? "",
        courseCount: Number(row.course_count) || 0,
        notifOn: row.notif_on,
        createdAt: createdIso,
        lastSeen: seenIso,
      };
    });

    const total = users.length;
    const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

    return NextResponse.json({
      ok: true,
      metrics: {
        total,
        new7,
        new30,
        active1,
        active7,
        active30,
        returning,
        returningPct: pct(returning),
        notifOnPct: pct(notifOn),
      },
      signups: Array.from(buckets, ([date, count]) => ({ date, count })),
      users,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load users" },
      { status: 500 },
    );
  }
}

type DetailRow = {
  email: string;
  profile: unknown;
  courses: unknown;
  carryover: unknown;
  notif_on: boolean;
  created_at: string | Date;
  last_seen: string | Date | null;
};

// Full record for a single user — the whole profile blob plus courses/carryover — used by
// the row-click detail modal. Assumes the caller already passed the admin gate above.
async function userDetail(rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  try {
    const r = await query<DetailRow>(
      `SELECT email, profile, courses, carryover, notif_on, created_at, last_seen
       FROM ${USERS_TABLE} WHERE email = $1`,
      [email],
    );
    if (!r.rowCount) {
      return NextResponse.json({ ok: false, error: "User not found" }, { status: 404 });
    }
    const row = r.rows[0];
    return NextResponse.json({
      ok: true,
      user: {
        email: row.email,
        profile: row.profile,
        courses: Array.isArray(row.courses) ? row.courses : [],
        carryover: Array.isArray(row.carryover) ? row.carryover : [],
        notifOn: row.notif_on,
        createdAt: new Date(row.created_at).toISOString(),
        lastSeen: row.last_seen ? new Date(row.last_seen).toISOString() : null,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load user" },
      { status: 500 },
    );
  }
}
