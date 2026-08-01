"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav, AdminAuthPrompt, DailyBarChart } from "@/components/admin/AdminKit";

type Traffic = {
  totals: { last30: number; today: number };
  viewsByDay: { date: string; count: number }[];
  topPages: { path: string; views: number }[];
};

export default function AdminTrafficPage() {
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pageviews");
      if (res.status === 401) {
        setNeedsAuth(true);
        setTraffic(null);
        return;
      }
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Failed to load");
        return;
      }
      setNeedsAuth(false);
      setError(null);
      setTraffic(json as Traffic);
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
          <h1 className="font-display text-[26px] font-bold text-on-surface">Traffic</h1>
          <p className="mt-0.5 font-body text-[13px] text-on-surface/55">
            {traffic
              ? `${traffic.totals.today} view${traffic.totals.today === 1 ? "" : "s"} today · ${traffic.totals.last30} in the last 30 days`
              : "Loading…"}
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

      {loading && !traffic && <p className="mt-8 font-body text-[13px] text-on-surface/50">Loading…</p>}

      {traffic && (
        <>
          <DailyBarChart title="Page views · last 30 days" data={traffic.viewsByDay} />
          <TopPages topPages={traffic.topPages} />
        </>
      )}
    </div>
  );
}

function TopPages({ topPages }: { topPages: { path: string; views: number }[] }) {
  const maxViews = Math.max(1, ...topPages.map((p) => p.views));
  return (
    <section className="mt-6 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-inset ring-black/[0.06]">
      <h2 className="font-display text-[16px] font-bold text-on-surface">Top pages · last 30 days</h2>
      {topPages.length === 0 ? (
        <p className="mt-3 font-body text-[13px] text-on-surface/50">No page views recorded yet.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {topPages.map((p) => (
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
  );
}
