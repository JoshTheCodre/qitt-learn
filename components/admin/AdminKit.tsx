"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Shared building blocks for the admin dashboard pages (/admin, /admin/users,
// /admin/traffic) so the nav, password gate and charts stay identical across them.

const TABS = [
  { href: "/admin", label: "Materials" },
  { href: "/admin/users", label: "Users & retention" },
  { href: "/admin/traffic", label: "Traffic" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="inline-flex flex-wrap gap-1 rounded-full bg-surface-container p-1">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-full px-4 py-1.5 font-display text-[13px] font-semibold transition-colors ${
              active
                ? "bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                : "text-black/55 hover:text-black"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

// Full-screen admin password prompt. Calls onUnlock() after a successful sign-in so the
// page can re-fetch its now-authorized data.
export function AdminAuthPrompt({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error ?? "Wrong password");
        return;
      }
      setPw("");
      onUnlock();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-[22px] font-bold text-on-surface">Admin access</h1>
      <p className="mt-1 font-body text-[13px] text-on-surface/55">
        Enter the admin password to open the dashboard.
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
        {error && <p className="font-body text-[13px] font-medium text-error">{error}</p>}
        <button
          type="submit"
          disabled={!pw.trim() || busy}
          className="w-full rounded-xl bg-primary py-3 font-display text-sm font-semibold text-on-primary disabled:opacity-40"
        >
          {busy ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}

export function Stat({
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
      <p
        className={`mt-1.5 font-display text-[26px] font-bold leading-none ${
          accent ? "text-primary" : "text-on-surface"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-1.5 font-body text-[11px] text-on-surface/45">{hint}</p>}
    </div>
  );
}

export function DailyBarChart({
  title,
  data,
}: {
  title: string;
  data: { date: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((n, d) => n + d.count, 0);
  return (
    <section className="mt-6 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-inset ring-black/[0.06]">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-[16px] font-bold text-on-surface">{title}</h2>
        <span className="font-body text-[12px] text-on-surface/50">{total} total</span>
      </div>
      <div
        className="mt-4 flex h-32 items-end gap-[3px]"
        role="img"
        aria-label={`${title}: ${total} total`}
      >
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

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtRelative(iso: string | null) {
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
