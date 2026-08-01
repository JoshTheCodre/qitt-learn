import { NextResponse } from "next/server";
import { query, verifyPassword, touchLastSeen, USERS_TABLE } from "@/lib/db";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, makeSessionValue } from "@/lib/session";
import { firebaseSignIn, firebaseSignUp, FIREBASE_MANAGED } from "@/lib/firebaseAuth";

export const dynamic = "force-dynamic";

const WRONG = { ok: false, error: "Incorrect email or password." } as const;

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
    // Load the profile row up front — we need it whichever path authenticates, and its
    // presence/absence also tells us whether this email is known to the app at all.
    const r = await query<LoginRow>(
      `SELECT password, profile, courses, carryover, notif_on FROM ${USERS_TABLE} WHERE email = $1`,
      [key],
    );
    const row = r.rowCount ? r.rows[0] : null;

    // 1) Preferred path: authenticate against Firebase.
    const fb = await firebaseSignIn(key, String(password));
    if (fb.ok) {
      // Authenticated by Firebase but we have no local profile — shouldn't happen since
      // registration always writes Postgres too, but fail clearly rather than guess.
      if (!row) return NextResponse.json({ ok: false, error: "Profile not found." }, { status: 404 });
      await touchLastSeen(key);
      return sessionResponse(key, row);
    }

    // 2) Legacy / migration path. Firebase rejected the sign-in — either the user hasn't
    // been migrated yet, or the credentials are simply wrong. Fall back to the old scrypt
    // hash. (Note: with email-enumeration protection, Firebase can't tell us "unknown
    // email" vs "wrong password", so we always attempt the local check here.)
    if (!row || !verifyPassword(String(password), row.password)) {
      return NextResponse.json(WRONG, { status: 401 });
    }

    // The legacy password is correct. Best-effort migrate this user into Firebase using
    // the plaintext they just supplied, then mark the row Firebase-managed. If Firebase
    // is unavailable (provider off / network / already exists), we still log them in via
    // the verified legacy password — migration is opportunistic, never a gate.
    const signUp = await firebaseSignUp(key, String(password));
    if (signUp.ok) {
      await query(`UPDATE ${USERS_TABLE} SET password = $1 WHERE email = $2`, [
        FIREBASE_MANAGED,
        key,
      ]);
    }
    await touchLastSeen(key);
    return sessionResponse(key, row);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Login failed" },
      { status: 500 },
    );
  }
}

type LoginRow = {
  password: string;
  profile: unknown;
  courses: unknown;
  carryover: unknown;
  notif_on: boolean;
};

function sessionResponse(email: string, row: LoginRow) {
  const res = NextResponse.json({
    ok: true,
    user: {
      profile: row.profile,
      courses: row.courses,
      carryover: row.carryover,
      notifOn: row.notif_on,
    },
  });
  res.cookies.set(SESSION_COOKIE, makeSessionValue(email), SESSION_COOKIE_OPTIONS);
  return res;
}
