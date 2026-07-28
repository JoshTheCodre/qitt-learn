// Client-side data store backed by localStorage (prototype auth + profile + courses).
import { COURSES as STATIC_COURSES, formatCourseCode, type ClassSession } from "./courses";
import { randomAvatarUrl } from "./avatars";

export interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  university: string;
  faculty: string;
  department: string;
  level: string; // "200"
  semester: string; // "Second Semester"
  session: string; // "2025 / 2026"
  student_code: string;
  // The school-issued registration number. Optional at signup — and optional on the
  // type too, because accounts created before this field existed have no such key in
  // localStorage. Typing it as `string | null` would be a lie about those records.
  reg_number?: string | null;
  picture_url: string | null;
  created_at: string; // ISO
}

export interface StoredCourse {
  slug: string;
  code: string;
  units: string; // "3 units"
  title: string;
}

export interface CarryoverCourse {
  course_code: string;
  course_title: string | null;
  // Present when the course was picked from the school catalog. Optional because
  // carryovers saved before the picker existed were typed by hand and have no unit.
  unit?: number | null;
}

export interface UserRecord {
  profile: UserProfile;
  courses: StoredCourse[];
  carryover: CarryoverCourse[];
  notifOn: boolean;
}

// The authoritative store is Postgres (via /api/auth/* and /api/me). This localStorage
// entry is only a per-device cache of the signed-in user, so the app's many synchronous
// reads (getUserCourses, getCurrentUser, …) stay instant. It's written on login/register
// and updated alongside every server write.
const CACHE_KEY = "qitt_current";

interface CachedUser extends UserRecord {
  email: string;
}

function readCache(): CachedUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CachedUser) : null;
  } catch {
    return null;
  }
}

function writeCache(user: CachedUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  else localStorage.removeItem(CACHE_KEY);
}

export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([ivx]+)\b/gi, (m) => m.toUpperCase()) // keep roman numerals upper
    .replace(/\b([a-z])/g, (c) => c.toUpperCase());
}

export function slugify(code: string): string {
  return code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function genStudentCode(faculty: string, date: Date): string {
  const abbr = (faculty.match(/\b[a-z]/gi) || ["U", "P"]).join("").slice(0, 3).toUpperCase();
  const yy = String(date.getFullYear()).slice(2);
  const rand = String(1000 + Math.floor(Math.random() * 9000));
  return `${abbr}/${yy}/${rand}`;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  regNumber?: string;
  pictureUrl?: string | null;
  university: string;
  faculty: string;
  department: string;
  level: string; // "200 Level"
}

async function deriveCourses(department: string, levelNum: number): Promise<StoredCourse[]> {
  try {
    const res = await fetch("/uniport_dept_courses.json");
    const data: Record<
      string,
      { code: string; title: string; unit: number; level: number; semester: string; category: string }[]
    > = await res.json();
    const list = data[department] || [];
    // Only COMPULSORY courses are auto-added — students add their electives themselves
    // via Edit Courses, so we never assume an elective they didn't pick.
    const compulsory = (c: { category: string }) => c.category === "COMPULSORY";
    let picked = list.filter((c) => c.level === levelNum && c.semester === "SECOND" && compulsory(c));
    if (picked.length === 0) picked = list.filter((c) => c.level === levelNum && compulsory(c));
    const seen = new Set<string>();
    const courses: StoredCourse[] = [];
    for (const c of picked) {
      if (seen.has(c.code)) continue;
      seen.add(c.code);
      courses.push({
        slug: slugify(c.code),
        code: formatCourseCode(c.code),
        units: `${c.unit} units`,
        title: titleCase(c.title),
      });
    }
    return courses;
  } catch {
    return [];
  }
}

export async function registerUser(
  input: RegisterInput,
): Promise<{ ok: boolean; error?: string }> {
  const email = input.email.trim().toLowerCase();
  const levelNum = parseInt(input.level.replace(/\D/g, ""), 10) || 100;
  const now = new Date();
  const profile: UserProfile = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    university: input.university,
    faculty: titleCase(input.faculty),
    department: titleCase(input.department),
    level: String(levelNum),
    semester: "Second Semester",
    session: "2025 / 2026",
    student_code: genStudentCode(input.faculty, now),
    reg_number: input.regNumber?.trim() || null,
    // Everyone gets a face: fall back to a stable avatar seeded from their email so
    // accounts that skipped the picker still show a real avatar everywhere.
    picture_url: input.pictureUrl || randomAvatarUrl(email),
    created_at: now.toISOString(),
  };
  const courses = await deriveCourses(input.department, levelNum);

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: input.password, profile, courses }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || "Registration failed. Please try again." };
    }
    writeCache({ email, profile, courses, carryover: [], notifOn: false });
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function loginUser(email: string, password: string): Promise<boolean> {
  const key = email.trim().toLowerCase();
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: key, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) return false;
    writeCache({ email: key, ...(data.user as UserRecord) });
    return true;
  } catch {
    return false;
  }
}

export function getSessionEmail(): string | null {
  return readCache()?.email ?? null;
}

export function getCurrentUser(): UserRecord | null {
  return readCache();
}

// Pull the authoritative record from the server into the cache — call on app load so a
// fresh device (or cleared cache) rehydrates from Postgres if the session cookie is valid.
export async function refreshCurrentUser(): Promise<UserRecord | null> {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) {
      if (res.status === 401) writeCache(null);
      return null;
    }
    const data = await res.json().catch(() => ({}));
    if (!data.ok) return null;
    const email = readCache()?.email ?? String(data.user.profile.email || "").toLowerCase();
    writeCache({ email, ...(data.user as UserRecord) });
    return data.user as UserRecord;
  } catch {
    return null;
  }
}

export function logout() {
  writeCache(null);
  if (typeof window !== "undefined") {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }
}

// Re-derive the signed-in user's course list to their department's COMPULSORY courses
// only. Used to fix accounts created before the compulsory-only filter existed — and any
// time a student wants to start from a clean required-courses list.
export async function resyncCompulsoryCourses(): Promise<StoredCourse[]> {
  const cur = readCache();
  if (!cur) return [];
  const levelNum = parseInt(String(cur.profile.level).replace(/\D/g, ""), 10) || 100;
  // Catalog keys are the raw uppercase department names; the profile stores a Title-Cased
  // copy, so uppercasing it back matches the key exactly.
  const courses = await deriveCourses(cur.profile.department.toUpperCase(), levelNum);
  writeCache({ ...cur, courses });
  fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courses }),
  }).catch(() => {});
  return courses;
}

export function updateCurrentUser(
  patch: Partial<Pick<UserRecord, "carryover" | "notifOn" | "courses">>,
) {
  const cur = readCache();
  if (!cur) return;
  writeCache({ ...cur, ...patch });
  // Persist to Postgres in the background; the cache is already updated for instant UI.
  fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => {});
}

// Merge a patch into the signed-in user's profile (e.g. a new picture_url), update the
// cache for instant UI, and persist the full merged profile to Postgres in the background.
export function updateProfile(patch: Partial<UserProfile>): UserProfile | null {
  const cur = readCache();
  if (!cur) return null;
  const profile = { ...cur.profile, ...patch };
  writeCache({ ...cur, profile });
  fetch("/api/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  }).catch(() => {});
  return profile;
}

export function getUserCourses(): StoredCourse[] {
  return getCurrentUser()?.courses ?? [];
}

export function getUserCourse(slug: string): StoredCourse | null {
  return getUserCourses().find((c) => c.slug === slug) ?? null;
}

export function getUserCarryover(): CarryoverCourse[] {
  return getCurrentUser()?.carryover ?? [];
}

/** Carryover courses are stored by code only, so their slug is derived from it. */
export function carryoverSlug(code: string): string {
  return code
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface ResolvedCourse {
  slug: string;
  code: string;
  units: string;
  title: string;
  schedule?: ClassSession[];
}

// Resolve a course by slug from the user's courses, falling back to the sample catalog,
// then to carryover. Without the carryover case, tapping a carryover course on the
// dashboard would land on a dead page.
export function resolveCourse(slug: string): ResolvedCourse | null {
  const u = getUserCourse(slug);
  if (u) return u;

  const s = STATIC_COURSES.find((c) => c.slug === slug);
  if (s) return { slug: s.slug, code: s.code, units: s.units, title: s.title, schedule: s.schedule };

  const c = getUserCarryover().find((x) => carryoverSlug(x.course_code) === slug);
  if (c) {
    return {
      slug,
      code: c.course_code,
      // Dash, not "0", for legacy carryovers typed in before the catalog picker existed
      // — inventing a unit count is worse than admitting we don't know it.
      units: c.unit != null ? String(c.unit) : "—",
      title: c.course_title || c.course_code,
    };
  }

  return null;
}
