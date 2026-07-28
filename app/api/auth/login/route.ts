import { NextResponse } from "next/server";
import { query, verifyPassword, USERS_TABLE } from "@/lib/db";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, makeSessionValue } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Missing credentials" }, { status: 400 });
  }
  const key = String(email).trim().toLowerCase();

  try {
    const r = await query(
      `SELECT password, profile, courses, carryover, notif_on FROM ${USERS_TABLE} WHERE email = $1`,
      [key],
    );
    if (!r.rowCount) {
      return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }
    const row = r.rows[0];
    if (!verifyPassword(String(password), row.password)) {
      return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      user: {
        profile: row.profile,
        courses: row.courses,
        carryover: row.carryover,
        notifOn: row.notif_on,
      },
    });
    res.cookies.set(SESSION_COOKIE, makeSessionValue(key), SESSION_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Login failed" },
      { status: 500 },
    );
  }
}
