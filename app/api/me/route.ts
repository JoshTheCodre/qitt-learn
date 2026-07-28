import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query, USERS_TABLE } from "@/lib/db";
import { SESSION_COOKIE, readSessionEmail } from "@/lib/session";

export const dynamic = "force-dynamic";

function sessionEmail(): string | null {
  return readSessionEmail(cookies().get(SESSION_COOKIE)?.value);
}

export async function GET() {
  const email = sessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  try {
    const r = await query(
      `SELECT profile, courses, carryover, notif_on FROM ${USERS_TABLE} WHERE email = $1`,
      [email],
    );
    if (!r.rowCount) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    const row = r.rows[0];
    return NextResponse.json({
      ok: true,
      user: {
        profile: row.profile,
        courses: row.courses,
        carryover: row.carryover,
        notifOn: row.notif_on,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const email = sessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  let body: { profile?: unknown; courses?: unknown; carryover?: unknown; notifOn?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const sets: string[] = [];
  const params: unknown[] = [];
  if (body.profile !== undefined) {
    params.push(JSON.stringify(body.profile));
    sets.push(`profile = $${params.length}`);
  }
  if (body.courses !== undefined) {
    params.push(JSON.stringify(body.courses));
    sets.push(`courses = $${params.length}`);
  }
  if (body.carryover !== undefined) {
    params.push(JSON.stringify(body.carryover));
    sets.push(`carryover = $${params.length}`);
  }
  if (body.notifOn !== undefined) {
    params.push(Boolean(body.notifOn));
    sets.push(`notif_on = $${params.length}`);
  }
  if (!sets.length) return NextResponse.json({ ok: true });

  params.push(email);
  try {
    await query(`UPDATE ${USERS_TABLE} SET ${sets.join(", ")} WHERE email = $${params.length}`, params);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 },
    );
  }
}
