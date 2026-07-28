import { NextResponse } from "next/server";
import { query, hashPassword, USERS_TABLE } from "@/lib/db";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, makeSessionValue } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    email?: string;
    password?: string;
    profile?: unknown;
    courses?: unknown;
    carryover?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { email, password, profile, courses = [], carryover = [] } = body;
  if (!email || !password || !profile) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }
  const key = String(email).trim().toLowerCase();

  try {
    const existing = await query(`SELECT 1 FROM ${USERS_TABLE} WHERE email = $1`, [key]);
    if (existing.rowCount) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    await query(
      `INSERT INTO ${USERS_TABLE} (email, password, profile, courses, carryover, notif_on)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        key,
        hashPassword(String(password)),
        JSON.stringify(profile),
        JSON.stringify(courses),
        JSON.stringify(carryover),
        false,
      ],
    );

    const res = NextResponse.json({
      ok: true,
      user: { profile, courses, carryover, notifOn: false },
    });
    res.cookies.set(SESSION_COOKIE, makeSessionValue(key), SESSION_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Registration failed" },
      { status: 500 },
    );
  }
}
