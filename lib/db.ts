import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Reuse a single pool across dev hot-reloads instead of leaking a new one each time.
const g = globalThis as unknown as { __qittPool?: Pool };

function getPool(): Pool {
  if (!g.__qittPool) {
    g.__qittPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  return g.__qittPool;
}

// Namespaced so this prototype never collides with the `users` table already in the
// shared database (owned by the main app).
export const USERS_TABLE = "qitt_learn_users";

let schemaPromise: Promise<unknown> | null = null;
function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS ${USERS_TABLE} (
        email       TEXT PRIMARY KEY,
        password    TEXT NOT NULL,
        profile     JSONB NOT NULL,
        courses     JSONB NOT NULL DEFAULT '[]'::jsonb,
        carryover   JSONB NOT NULL DEFAULT '[]'::jsonb,
        notif_on    BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }
  return schemaPromise;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  await ensureSchema();
  return getPool().query<T>(text, params as never[]);
}

// scrypt-based password hashing — no extra dependency, salted per password.
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const orig = Buffer.from(hash, "hex");
  return orig.length === test.length && timingSafeEqual(orig, test);
}
