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

// Page views are stored as pre-aggregated counters — one row per (path, day) that we
// increment — rather than one row per hit. That keeps the table tiny (bounded by
// routes x days) and every read is a cheap GROUP BY instead of scanning millions of
// event rows. See /api/pv for the write path.
export const PAGEVIEWS_TABLE = "qitt_learn_pageviews";

// Materials a student uploads for themselves (stored in R2 under user-materials/<email>/…).
// Separate from the admin-curated course_materials library.
export const USER_MATERIALS_TABLE = "qitt_learn_user_materials";

// Assignments a student tracks (title, optional course, due date, done flag).
export const ASSIGNMENTS_TABLE = "qitt_learn_assignments";

// Class assignments sourced from group messages: an AI-extracted DRAFT an admin reviews,
// then PUBLISHES for students to see. One table, `status` distinguishes the two stages.
export const CLASS_ASSIGNMENTS_TABLE = "qitt_learn_class_assignments";

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
      -- Activity signal for the retention dashboard. Nullable: existing rows and brand-new
      -- signups have no visit yet, which is what lets us tell "new" from "returning".
      ALTER TABLE ${USERS_TABLE} ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ;

      CREATE TABLE IF NOT EXISTS ${PAGEVIEWS_TABLE} (
        path  TEXT NOT NULL,
        day   DATE NOT NULL,
        views INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY (path, day)
      );

      CREATE TABLE IF NOT EXISTS ${USER_MATERIALS_TABLE} (
        id          BIGSERIAL PRIMARY KEY,
        email       TEXT NOT NULL,
        title       TEXT NOT NULL,
        course_code TEXT,
        file_key    TEXT NOT NULL,
        file_url    TEXT NOT NULL,
        file_ext    TEXT,
        size_bytes  BIGINT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS ${USER_MATERIALS_TABLE}_email_idx ON ${USER_MATERIALS_TABLE} (email);
      -- Opt-in: a student can share an upload with everyone taking that course.
      ALTER TABLE ${USER_MATERIALS_TABLE} ADD COLUMN IF NOT EXISTS shared BOOLEAN NOT NULL DEFAULT false;

      CREATE TABLE IF NOT EXISTS ${ASSIGNMENTS_TABLE} (
        id          BIGSERIAL PRIMARY KEY,
        email       TEXT NOT NULL,
        title       TEXT NOT NULL,
        course_code TEXT,
        due_date    DATE,
        done        BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS ${ASSIGNMENTS_TABLE}_email_idx ON ${ASSIGNMENTS_TABLE} (email);

      CREATE TABLE IF NOT EXISTS ${CLASS_ASSIGNMENTS_TABLE} (
        id            BIGSERIAL PRIMARY KEY,
        status        TEXT NOT NULL DEFAULT 'draft',   -- 'draft' | 'published'
        title         TEXT NOT NULL DEFAULT '',
        course_code   TEXT,
        due_at        TIMESTAMPTZ,
        due_text_raw  TEXT,
        description   TEXT,
        posted_by     TEXT,
        source_sender TEXT,
        source_text   TEXT,
        source_ts     TIMESTAMPTZ,
        confidence    REAL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        published_at  TIMESTAMPTZ
      );
      CREATE INDEX IF NOT EXISTS ${CLASS_ASSIGNMENTS_TABLE}_status_idx ON ${CLASS_ASSIGNMENTS_TABLE} (status);
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

// Best-effort "user was active just now" stamp for retention metrics. Never let a failure
// here break the request that triggered it — activity tracking is not worth a 500.
export async function touchLastSeen(email: string): Promise<void> {
  try {
    await query(`UPDATE ${USERS_TABLE} SET last_seen = now() WHERE email = $1`, [email]);
  } catch {
    /* ignore */
  }
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
