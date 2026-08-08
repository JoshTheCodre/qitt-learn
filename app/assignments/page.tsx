"use client";

import { useCallback, useEffect, useState } from "react";
import BackHeader from "@/components/BackHeader";
import BottomNav from "@/components/dashboard/BottomNav";
import { dueMeta, timeAgo, sortForStudent, TONE_CLASS, type DueTone } from "@/lib/dueMeta";

type Assignment = {
  id: string;
  title: string;
  course: string | null;
  dueAt: string | null;
  dueTextRaw: string | null;
  description: string | null;
  postedBy: string | null;
  postedAt: string | null;
  createdAt: string | null;
  sourceMessage: { sender: string; text: string; timestamp: string | null } | null;
};

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

// Time-based labels must not render during SSR (server/client clock would differ). Null
// until mounted, then the clock, refreshed each minute.
function useNow(refreshMs = 60_000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);
  return now;
}

const pillIcon = (tone: DueTone) =>
  tone === "normal" ? "calendar_today" : tone === "unknown" ? "help" : "schedule";

function DuePill({ dueAt, dueTextRaw, now }: { dueAt: string | null; dueTextRaw: string | null; now: number | null }) {
  if (now === null) return <span className="invisible text-[11px]">Due in 0 days</span>;
  const { tone, label, title } = dueMeta(dueAt, dueTextRaw, now);
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body text-[11px] font-semibold ${TONE_CLASS[tone]}`}
    >
      {tone !== "unknown" && (
        <span className="material-symbols-outlined text-[13px] leading-none">{pillIcon(tone)}</span>
      )}
      {label}
    </span>
  );
}

function Card({ a, now }: { a: Assignment; now: number | null }) {
  const overdue = now !== null && dueMeta(a.dueAt, a.dueTextRaw, now).isOverdue;
  return (
    <div
      className={`rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] ${
        overdue ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {a.course ? (
          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wide text-primary">
            {a.course}
          </span>
        ) : (
          <span />
        )}
        <DuePill dueAt={a.dueAt} dueTextRaw={a.dueTextRaw} now={now} />
      </div>

      <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-on-surface">{a.title}</h3>

      {a.description && (
        <p className="mt-1 font-body text-[13px] leading-relaxed text-on-surface-variant line-clamp-2">
          {a.description}
        </p>
      )}

      {a.sourceMessage && (
        <div className="mt-3 rounded-lg border-l-2 border-[#25D366] bg-[#25D366]/[0.06] px-3 py-2">
          <p className="font-body text-[11px] font-semibold text-[#0f7a3d]">💬 {a.sourceMessage.sender}</p>
          <p className="mt-0.5 font-body text-[12px] italic leading-snug text-on-surface/70 line-clamp-2">
            “{a.sourceMessage.text}”
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-surface-container pt-2.5 font-body text-[11px] text-on-surface-variant">
        <span>{a.postedBy ? `Posted by ${a.postedBy}` : "Posted by admin"}</span>
        {now !== null && a.postedAt && <span>{timeAgo(a.postedAt, now)}</span>}
      </div>
    </div>
  );
}

type Tab = "upcoming" | "overdue" | "all";

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("upcoming");
  const now = useNow();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (data.ok) {
        setItems(data.assignments);
        setError(null);
      } else {
        setError(data.error ?? "Failed to load");
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const overdue = now === null ? [] : items.filter((a) => dueMeta(a.dueAt, a.dueTextRaw, now).isOverdue);
  const upcoming = now === null ? [] : items.filter((a) => !dueMeta(a.dueAt, a.dueTextRaw, now).isOverdue);
  const shown = tab === "overdue" ? overdue : tab === "all" ? sortForStudent(items, now ?? 0) : upcoming;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcoming.length },
    { id: "overdue", label: "Overdue", count: overdue.length },
    { id: "all", label: "All", count: items.length },
  ];

  return (
    <div className={FRAME}>
      <BackHeader title="Assignments" />
      <main className="px-gutter pb-28 pt-2">
        {/* Tabs */}
        <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface-container p-1">
          {TABS.map((t) => {
            const on = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 font-display text-[13px] font-semibold transition-colors ${
                  on ? "bg-white text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.06)]" : "text-on-surface-variant"
                }`}
              >
                {t.label}
                <span className={`font-body text-[11px] font-bold ${on ? "text-primary" : "text-on-surface/40"}`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {loading && <p className="py-8 text-center font-body text-[13px] text-on-surface-variant">Loading…</p>}
          {error && (
            <p className="rounded-xl bg-error-container px-4 py-3 font-body text-[13px] font-medium text-error">
              {error}
            </p>
          )}
          {!loading && !error && shown.length === 0 && (
            <div className="rounded-2xl bg-surface-container-lowest px-4 py-12 text-center ring-1 ring-inset ring-outline-variant/30">
              <span className="material-symbols-outlined text-[36px] text-outline-variant">edit_note</span>
              <p className="mt-2 font-display text-[15px] font-bold text-on-surface">
                {tab === "overdue" ? "Nothing overdue 🎉" : "No assignments yet"}
              </p>
              {tab !== "overdue" && (
                <p className="mt-1 font-body text-[12px] text-on-surface-variant">
                  When your class rep&apos;s post is added, it&apos;ll show up here.
                </p>
              )}
            </div>
          )}
          {!loading && !error && shown.map((a) => <Card key={a.id} a={a} now={now} />)}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
