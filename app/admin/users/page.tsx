"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav, AdminAuthPrompt, Stat, DailyBarChart, fmtDate, fmtRelative } from "@/components/admin/AdminKit";

type Metrics = {
  total: number;
  new7: number;
  new30: number;
  active1: number;
  active7: number;
  active30: number;
  returning: number;
  returningPct: number;
  notifOnPct: number;
};

type UserRow = {
  email: string;
  name: string;
  university: string;
  department: string;
  level: string;
  courseCount: number;
  notifOn: boolean;
  createdAt: string;
  lastSeen: string | null;
};

type Payload = {
  metrics: Metrics;
  signups: { date: string; count: number }[];
  users: UserRow[];
};

type FullUser = {
  email: string;
  profile: {
    name?: string;
    email?: string;
    phone?: string | null;
    university?: string;
    faculty?: string;
    department?: string;
    level?: string;
    semester?: string;
    session?: string;
    student_code?: string;
    reg_number?: string | null;
    picture_url?: string | null;
    created_at?: string;
  } | null;
  courses: { code?: string; title?: string; units?: string }[];
  carryover: { course_code?: string; course_title?: string | null; unit?: number | null }[];
  notifOn: boolean;
  createdAt: string;
  lastSeen: string | null;
};

export default function AdminUsersPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 401) {
        setNeedsAuth(true);
        setData(null);
        return;
      }
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Failed to load");
        return;
      }
      setNeedsAuth(false);
      setError(null);
      setData(json as Payload);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (needsAuth) return <AdminAuthPrompt onUnlock={load} />;

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8">
      <AdminNav />

      <header className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-bold text-on-surface">Users &amp; retention</h1>
          <p className="mt-0.5 font-body text-[13px] text-on-surface/55">
            {data ? `${data.metrics.total} registered user${data.metrics.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-full bg-surface-container px-3.5 py-1.5 font-display text-[12px] font-semibold text-on-surface-variant"
        >
          Refresh
        </button>
      </header>

      {error && (
        <p className="mt-4 rounded-xl bg-error-container px-4 py-3 font-body text-[13px] font-medium text-error">
          {error}
        </p>
      )}

      {loading && !data && <p className="mt-8 font-body text-[13px] text-on-surface/50">Loading…</p>}

      {data && (
        <>
          {/* Metric cards */}
          <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat label="Total users" value={data.metrics.total} />
            <Stat label="Active · 7 days" value={data.metrics.active7} hint="Weekly active (WAU)" accent />
            <Stat label="Active · 30 days" value={data.metrics.active30} hint="Monthly active (MAU)" accent />
            <Stat
              label="Returning"
              value={`${data.metrics.returningPct}%`}
              hint={`${data.metrics.returning} came back after signup`}
              accent
            />
            <Stat label="Active today" value={data.metrics.active1} hint="Last 24 hours" />
            <Stat label="New · 7 days" value={data.metrics.new7} />
            <Stat label="New · 30 days" value={data.metrics.new30} />
            <Stat label="Notifications on" value={`${data.metrics.notifOnPct}%`} />
          </section>

          {/* Signups chart */}
          <DailyBarChart title="Signups · last 30 days" data={data.signups} />

          {/* Users table */}
          <section className="mt-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-[16px] font-bold text-on-surface">All users</h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, dept…"
                className="min-w-[220px] flex-1 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2 font-body text-[13px] text-on-surface focus:border-primary focus:outline-none sm:max-w-xs sm:flex-none"
              />
            </div>
            <UsersTable users={data.users} search={search} onSelect={setSelectedEmail} />
          </section>
        </>
      )}

      {selectedEmail && (
        <UserDetailModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
      )}
    </div>
  );
}

function UsersTable({
  users,
  search,
  onSelect,
}: {
  users: UserRow[];
  search: string;
  onSelect: (email: string) => void;
}) {
  const q = search.trim().toLowerCase();
  const shown = q
    ? users.filter((u) =>
        [u.name, u.email, u.department, u.university, u.level].some((f) => f.toLowerCase().includes(q)),
      )
    : users;

  if (shown.length === 0) {
    return (
      <p className="rounded-2xl bg-surface-container-lowest px-4 py-10 text-center font-body text-[13px] text-on-surface/50 ring-1 ring-inset ring-black/[0.06]">
        {users.length === 0 ? "No users yet." : "No users match that search."}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-inset ring-black/[0.06]">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="bg-surface-container text-on-surface/55">
            <Th>User</Th>
            <Th>School · Dept · Level</Th>
            <Th className="text-center">Courses</Th>
            <Th className="text-center">Notifs</Th>
            <Th>Joined</Th>
            <Th>Last seen</Th>
          </tr>
        </thead>
        <tbody>
          {shown.map((u, i) => (
            <tr
              key={u.email}
              onClick={() => onSelect(u.email)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(u.email);
                }
              }}
              tabIndex={0}
              title="View full details"
              className={`cursor-pointer bg-surface-container-lowest transition-colors hover:bg-surface-container/70 focus:bg-surface-container/70 focus:outline-none ${
                i > 0 ? "border-t border-outline-variant/30" : ""
              }`}
            >
              <td className="px-4 py-3">
                <p className="font-body text-[14px] font-semibold text-on-surface">{u.name}</p>
                <p className="mt-0.5 font-body text-[11px] text-on-surface/50">{u.email}</p>
              </td>
              <td className="px-4 py-3 font-body text-[12px] text-on-surface/70">
                {[u.university, u.department, u.level].filter(Boolean).join(" · ") || "—"}
              </td>
              <td className="px-4 py-3 text-center font-display text-[13px] font-semibold text-on-surface">
                {u.courseCount}
              </td>
              <td className="px-4 py-3 text-center font-body text-[12px]">
                {u.notifOn ? (
                  <span className="text-primary">On</span>
                ) : (
                  <span className="text-on-surface/35">Off</span>
                )}
              </td>
              <td className="px-4 py-3 font-body text-[12px] text-on-surface/70">{fmtDate(u.createdAt)}</td>
              <td className="px-4 py-3 font-body text-[12px] text-on-surface/70">{fmtRelative(u.lastSeen)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-2.5 font-display text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function UserDetailModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [user, setUser] = useState<FullUser | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`);
        const json = await res.json();
        if (!alive) return;
        if (!json.ok) setErr(json.error ?? "Failed to load user");
        else setUser(json.user as FullUser);
      } catch {
        if (alive) setErr("Could not reach the server.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [email]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <p className="py-12 text-center font-body text-[13px] text-on-surface/50">Loading…</p>
        ) : err ? (
          <p className="py-6 text-center font-body text-[13px] font-medium text-error">{err}</p>
        ) : user ? (
          <UserDetail user={user} onClose={onClose} />
        ) : null}
      </div>
    </div>
  );
}

function UserDetail({ user, onClose }: { user: FullUser; onClose: () => void }) {
  const p = user.profile ?? {};
  const initials =
    (p.name ?? user.email)
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div>
      <div className="flex items-start gap-3">
        {p.picture_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.picture_url} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-[18px] font-bold text-on-surface">{p.name ?? "—"}</p>
          <p className="truncate font-body text-[12px] text-on-surface/55">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 font-display text-[12px] font-semibold text-on-surface-variant"
        >
          Close
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Phone" value={p.phone} />
        <Field label="Student code" value={p.student_code} />
        <Field label="Reg number" value={p.reg_number} />
        <Field label="Level" value={p.level} />
        <Field label="University" value={p.university} span />
        <Field label="Faculty" value={p.faculty} span />
        <Field label="Department" value={p.department} span />
        <Field label="Semester" value={p.semester} />
        <Field label="Session" value={p.session} />
      </div>

      <div className="mt-5 border-t border-outline-variant/30 pt-4">
        <p className="font-display text-[13px] font-bold text-on-surface">
          Courses <span className="text-on-surface/45">({user.courses.length})</span>
        </p>
        {user.courses.length === 0 ? (
          <p className="mt-1 font-body text-[12px] text-on-surface/45">None</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {user.courses.map((c, i) => (
              <li key={`${c.code}-${i}`} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 font-body text-[12px] text-on-surface/75">
                  <span className="font-semibold text-on-surface">{c.code ?? "—"}</span>
                  {c.title ? ` · ${c.title}` : ""}
                </span>
                {c.units && (
                  <span className="shrink-0 font-body text-[11px] text-on-surface/45">{c.units}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {user.carryover.length > 0 && (
        <div className="mt-4 border-t border-outline-variant/30 pt-4">
          <p className="font-display text-[13px] font-bold text-on-surface">
            Carryover <span className="text-on-surface/45">({user.carryover.length})</span>
          </p>
          <ul className="mt-2 space-y-1.5">
            {user.carryover.map((c, i) => (
              <li key={`${c.course_code}-${i}`} className="font-body text-[12px] text-on-surface/75">
                <span className="font-semibold text-on-surface">{c.course_code ?? "—"}</span>
                {c.course_title ? ` · ${c.course_title}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-outline-variant/30 pt-4">
        <Field label="Joined" value={fmtDate(user.createdAt)} />
        <Field label="Last seen" value={fmtRelative(user.lastSeen)} />
        <Field label="Notifications" value={user.notifOn ? "On" : "Off"} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  span = false,
}: {
  label: string;
  value?: string | null;
  span?: boolean;
}) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="font-display text-[10px] font-semibold uppercase tracking-wide text-on-surface/45">
        {label}
      </p>
      <p className="mt-0.5 break-words font-body text-[13px] text-on-surface">{value || "—"}</p>
    </div>
  );
}
