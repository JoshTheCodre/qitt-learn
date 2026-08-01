"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

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

type Traffic = {
  totals: { last30: number; today: number };
  viewsByDay: { date: string; count: number }[];
  topPages: { path: string; views: number }[];
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function fmtRelative(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  if (day < 30) return `${Math.floor(day / 7)}w ago`;
  return fmtDate(iso);
}

export default function AdminUsersPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [pw, setPw] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, pRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/pageviews"),
      ]);
      if (uRes.status === 401 || pRes.status === 401) {
        setNeedsAuth(true);
        setData(null);
        setTraffic(null);
        return;
      }
      const uJson = await uRes.json();
      if (!uJson.ok) {
        setError(uJson.error ?? "Failed to load");
        return;
      }
      setNeedsAuth(false);
      setError(null);
      setData(uJson as Payload);

      const pJson = await pRes.json();
      if (pJson.ok) setTraffic(pJson as Traffic);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setPwBusy(true);
    setPwError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!json.ok) {
        setPwError(json.error ?? "Wrong password");
        return;
      }
      setPw("");
      await load();
    } catch {
      setPwError("Could not reach the server.");
    } finally {
      setPwBusy(false);
    }
  }

  // ---- Password gate ----
  if (needsAuth) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6">
        <h1 className="font-display text-[22px] font-bold text-on-surface">Admin access</h1>
        <p className="mt-1 font-body text-[13px] text-on-surface/55">
          Enter the admin password to view users and retention.
        </p>
        <form onSubmit={signIn} className="mt-5 space-y-3">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-3 font-body text-[14px] text-on-surface focus:border-primary focus:outline-none"
          />
          {pwError && <p className="font-body text-[13px] font-medium text-error">{pwError}</p>}
          <button
            type="submit"
            disabled={!pw.trim() || pwBusy}
            className="w-full rounded-xl bg-primary py-3 font-display text-sm font-semibold text-on-primary disabled:opacity-40"
          >
            {pwBusy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-bold text-on-surface">Users &amp; retention</h1>
          <p className="mt-0.5 font-body text-[13px] text-on-surface/55">
            {data ? `${data.metrics.total} registered user${data.metrics.total === 1 ? "" : "s"}` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="font-display text-[13px] font-semibold text-primary">
            Materials →
          </Link>
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-surface-container px-3.5 py-1.5 font-display text-[12px] font-semibold text-on-surface-variant"
          >
            Refresh
          </button>
        </div>
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

          {/* Traffic */}
          {traffic && <TrafficSection traffic={traffic} />}

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

function Stat({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: number | string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.06]">
      <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface/50">
        {label}
      </p>
      <p className={`mt-1.5 font-display text-[26px] font-bold leading-none ${accent ? "text-primary" : "text-on-surface"}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 font-body text-[11px] text-on-surface/45">{hint}</p>}
    </div>
  );
}

function DailyBarChart({ title, data }: { title: string; data: { date: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((n, d) => n + d.count, 0);
  return (
    <section className="mt-6 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-inset ring-black/[0.06]">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-bold text-on-surface">{title}</h2>
        <span className="font-body text-[12px] text-on-surface/50">{total} total</span>
      </div>
      <div className="mt-4 flex h-32 items-end gap-[3px]" role="img" aria-label="Signups per day for the last 30 days">
        {data.map((d) => (
          <div key={d.date} className="group relative flex-1" title={`${fmtDate(d.date)}: ${d.count}`}>
            <div
              className="w-full rounded-t bg-primary/80 transition-colors hover:bg-primary"
              style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between font-body text-[10px] text-on-surface/40">
        <span>{fmtDate(data[0]?.date ?? new Date().toISOString())}</span>
        <span>Today</span>
      </div>
    </section>
  );
}

function TrafficSection({ traffic }: { traffic: Traffic }) {
  const maxViews = Math.max(1, ...traffic.topPages.map((p) => p.views));
  return (
    <>
      <div className="mt-8">
        <h2 className="font-display text-[18px] font-bold text-on-surface">Traffic</h2>
        <p className="mt-0.5 font-body text-[12px] text-on-surface/50">
          {traffic.totals.today} view{traffic.totals.today === 1 ? "" : "s"} today ·{" "}
          {traffic.totals.last30} in the last 30 days
        </p>
      </div>

      <DailyBarChart title="Page views · last 30 days" data={traffic.viewsByDay} />

      <section className="mt-6 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-inset ring-black/[0.06]">
        <h2 className="font-display text-[16px] font-bold text-on-surface">Top pages · last 30 days</h2>
        {traffic.topPages.length === 0 ? (
          <p className="mt-3 font-body text-[13px] text-on-surface/50">No page views recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-2.5">
            {traffic.topPages.map((p) => (
              <li key={p.path} className="flex items-center gap-3">
                <span
                  className="w-32 shrink-0 truncate font-body text-[12px] text-on-surface/70 sm:w-48"
                  title={p.path}
                >
                  {p.path}
                </span>
                <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
                    style={{ width: `${(p.views / maxViews) * 100}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right font-display text-[12px] font-semibold text-on-surface">
                  {p.views}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
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
