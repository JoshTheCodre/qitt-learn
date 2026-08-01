import { NextResponse } from "next/server";
import { query, hashPassword, USERS_TABLE } from "@/lib/db";
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, makeSessionValue } from "@/lib/session";
import { firebaseSignUp, isFirebaseUnavailable, FIREBASE_MANAGED } from "@/lib/firebaseAuth";

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

    // Create the account in Firebase first. What we store in the local `password` column
    // depends on the outcome:
    //  - success            -> FIREBASE_MANAGED sentinel (Firebase owns the password)
    //  - provider off / net -> scrypt hash, so signup still works today and the user gets
    //                          lazily migrated on their next login once Firebase is live
    //  - EMAIL_EXISTS       -> the email is taken in Firebase; refuse (409)
    //  - WEAK_PASSWORD      -> surface it, so every account stays Firebase-compatible
    const signUp = await firebaseSignUp(key, String(password));
    let storedPassword: string;
    if (signUp.ok) {
      storedPassword = FIREBASE_MANAGED;
    } else if (signUp.code === "EMAIL_EXISTS") {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    } else if (signUp.code === "WEAK_PASSWORD") {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    } else if (isFirebaseUnavailable(signUp.code)) {
      storedPassword = hashPassword(String(password));
    } else {
      // Unknown Firebase error — don't block the signup; store a real hash so login keeps
      // working via the legacy path, and let lazy migration retry Firebase later.
      storedPassword = hashPassword(String(password));
    }

    await query(
      `INSERT INTO ${USERS_TABLE} (email, password, profile, courses, carryover, notif_on)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        key,
        storedPassword,
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
