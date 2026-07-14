// Client-side data store backed by localStorage (prototype auth + profile + courses).
import { COURSES as STATIC_COURSES, type ClassSession } from "./courses";

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
  password: string;
  profile: UserProfile;
  courses: StoredCourse[];
  carryover: CarryoverCourse[];
  notifOn: boolean;
}

const USERS_KEY = "qitt_users";
const SESSION_KEY = "qitt_session";

function readUsers(): Record<string, UserRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, UserRecord>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
    const data: Record<string, { code: string; title: string; unit: number; level: number; semester: string }[]> =
      await res.json();
    const list = data[department] || [];
    let picked = list.filter((c) => c.level === levelNum && c.semester === "SECOND");
    if (picked.length === 0) picked = list.filter((c) => c.level === levelNum);
    const seen = new Set<string>();
    const courses: StoredCourse[] = [];
    for (const c of picked) {
      if (seen.has(c.code)) continue;
      seen.add(c.code);
      courses.push({
        slug: slugify(c.code),
        code: c.code,
        units: `${c.unit} units`,
        title: titleCase(c.title),
      });
    }
    return courses;
  } catch {
    return [];
  }
}

export async function registerUser(input: RegisterInput): Promise<void> {
  const users = readUsers();
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
    picture_url: input.pictureUrl || null,
    created_at: now.toISOString(),
  };
  const courses = await deriveCourses(input.department, levelNum);
  users[email] = { password: input.password, profile, courses, carryover: [], notifOn: false };
  writeUsers(users);
  localStorage.setItem(SESSION_KEY, email);
}

export function loginUser(email: string, password: string): boolean {
  const users = readUsers();
  const key = email.trim().toLowerCase();
  const rec = users[key];
  if (!rec || rec.password !== password) return false;
  localStorage.setItem(SESSION_KEY, key);
  return true;
}

export function getSessionEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser(): UserRecord | null {
  const email = getSessionEmail();
  if (!email) return null;
  return readUsers()[email] ?? null;
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
}

export function updateCurrentUser(patch: Partial<Pick<UserRecord, "carryover" | "notifOn">>) {
  const email = getSessionEmail();
  if (!email) return;
  const users = readUsers();
  if (!users[email]) return;
  users[email] = { ...users[email], ...patch };
  writeUsers(users);
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
