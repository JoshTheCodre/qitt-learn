import "server-only";

// Firebase email/password auth via the Identity Toolkit REST API. We call this from
// the server (inside /api/auth/*) instead of the client SDK so the existing httpOnly
// session cookie + Postgres profile model stays exactly as it is — Firebase only takes
// over the password check. This needs just the Web API key (public, safe to embed);
// no service-account credentials.
//
// PREREQUISITE: the "Email/Password" provider must be enabled for this project in the
// Firebase console (Authentication -> Sign-in method). Until then every call returns
// OPERATION_NOT_ALLOWED, which the routes treat as "fall back to the legacy Postgres
// path" so nobody is locked out.
const API_KEY =
  process.env.FIREBASE_API_KEY ?? "AIzaSyDq--1vjizE4MQzQG3pdC2OGH6V3fepCAM";
const IDENTITY = "https://identitytoolkit.googleapis.com/v1/accounts";

// Stored in the Postgres `password` column for accounts whose password now lives in
// Firebase. It has no ":" so verifyPassword() can never match it — a migrated user can
// only authenticate through Firebase, which removes any ambiguity between the two stores.
export const FIREBASE_MANAGED = "firebase-managed";

export type FirebaseAuthResult =
  | { ok: true; localId: string }
  | { ok: false; code: string };

async function call(
  path: "signInWithPassword" | "signUp",
  email: string,
  password: string,
): Promise<FirebaseAuthResult> {
  try {
    const res = await fetch(`${IDENTITY}:${path}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as {
      localId?: string;
      error?: { message?: string };
    };
    if (res.ok && data.localId) return { ok: true, localId: data.localId };
    // Firebase packs a code like "INVALID_LOGIN_CREDENTIALS" or "EMAIL_EXISTS" here,
    // sometimes suffixed (e.g. "WEAK_PASSWORD : Password should be..."); take the head.
    const code = (data.error?.message ?? "UNKNOWN").split(" ")[0];
    return { ok: false, code };
  } catch {
    return { ok: false, code: "NETWORK_ERROR" };
  }
}

export function firebaseSignIn(email: string, password: string) {
  return call("signInWithPassword", email, password);
}

export function firebaseSignUp(email: string, password: string) {
  return call("signUp", email, password);
}

// True when the failure means "Firebase isn't usable right now" (provider disabled or
// network) rather than "these credentials are wrong". The routes keep the legacy path
// alive for these so a misconfigured/unreachable Firebase never blocks a real user.
export function isFirebaseUnavailable(code: string): boolean {
  return code === "OPERATION_NOT_ALLOWED" || code === "NETWORK_ERROR";
}
