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

export default function AdminUsersPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
            <UsersTable users={data.users} search={search} />
          </section>
        </>
      )}
    </div>
  );
}

function UsersTable({ users, search }: { users: UserRow[]; search: string }) {
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
              className={`bg-surface-container-lowest ${i > 0 ? "border-t border-outline-variant/30" : ""}`}
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
