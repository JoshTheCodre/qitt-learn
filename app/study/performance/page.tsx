"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import { getResults, percent, type PracticeResult } from "@/lib/results";

// Which relative-date group a session falls into.
function bucketOf(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.floor((startOfDay(now) - startOfDay(d)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This Week";
  return "Earlier";
}

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Earlier"];

function buildChart(scores: number[]) {
  const W = 300;
  const H = 110;
  const pad = 12;
  const stepX = (W - pad * 2) / Math.max(scores.length - 1, 1);
  const pts = scores.map((s, i) => ({
    x: pad + i * stepX,
    y: H - pad - (s / 100) * (H - pad * 2),
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M ${pts[0].x},${H - pad} ${pts.map((p) => `L ${p.x},${p.y}`).join(" ")} L ${
    pts[pts.length - 1].x
  },${H - pad} Z`;
  const peak = pts.reduce((a, b) => (b.y < a.y ? b : a), pts[0]);
  return { line, area, peak, W, H };
}

export default function PerformancePage() {
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [course, setCourse] = useState("All Courses");

  useEffect(() => {
    setResults(getResults());
  }, []);

  const courseOptions = useMemo(
    () => ["All Courses", ...Array.from(new Set(results.map((r) => r.course)))],
    [results]
  );

  const filtered = useMemo(
    () => results.filter((r) => course === "All Courses" || r.course === course),
    [results, course]
  );

  // Chart + stats from the filtered set, oldest → newest, last 8 points.
  const scores = filtered.map((r) => percent(r)).reverse().slice(-8);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const best = scores.length ? Math.max(...scores) : 0;
  const chart = scores.length >= 2 ? buildChart(scores) : null;

  const groups = GROUP_ORDER.map((g) => ({
    group: g,
    items: filtered.filter((r) => bucketOf(r.takenAt) === g),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      <div className="relative z-10">
        <BackHeader title="Performance" transparent />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-28">
        {/* Sort by course */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Sort by course
          </span>
          <div className="relative">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="appearance-none rounded-full border border-outline-variant/50 bg-surface-container-lowest pl-4 pr-9 py-1.5 font-display text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              {courseOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-6 py-12 text-center">
            <span className="material-symbols-outlined text-[40px] text-on-surface/25">insights</span>
            <p className="mt-2 font-display text-sm font-bold text-on-surface">No results yet</p>
            <p className="mt-1 font-body text-[12px] text-on-surface/55">
              Finish a practice session and your scores will show up here.
            </p>
            <Link
              href="/study/practice"
              className="mt-5 inline-block rounded-full bg-emerald-800 px-5 py-2.5 font-display text-[13px] font-bold text-white squishy-press"
            >
              Start practising
            </Link>
          </div>
        ) : (
          <>
            {/* Chart */}
            {chart && (
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4">
                <svg
                  viewBox={`0 0 ${chart.W} ${chart.H}`}
                  className="w-full h-auto"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chart.area} fill="url(#perfFill)" />
                  <polyline
                    points={chart.line}
                    fill="none"
                    stroke="rgb(37 99 235)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx={chart.peak.x} cy={chart.peak.y} r="4" fill="rgb(37 99 235)" />
                  <circle cx={chart.peak.x} cy={chart.peak.y} r="8" fill="rgb(37 99 235)" fillOpacity="0.15" />
                </svg>
              </div>
            )}

            {/* Summary stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: "Avg score", value: `${avg}%` },
                { label: "Best", value: `${best}%` },
                { label: "Sessions", value: `${filtered.length}` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 px-3 py-3 text-center"
                >
                  <p className="font-display text-[20px] font-bold text-on-surface leading-none">
                    {s.value}
                  </p>
                  <p className="mt-1 font-display text-[11px] font-medium text-on-surface-variant">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent sessions */}
            <h3 className="mt-8 mb-3 font-display text-[18px] font-bold text-on-surface">Recent</h3>
            {groups.length === 0 && (
              <p className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-8 text-center font-display text-xs text-on-surface-variant">
                No sessions for {course} yet.
              </p>
            )}
            <div className="space-y-4">
              {groups.map(({ group, items }) => (
                <div key={group}>
                  <p className="mb-2 font-display text-xs font-semibold text-on-surface-variant">
                    {group}
                  </p>
                  <div className="space-y-2.5">
                    {items.map((r) => {
                      const pct = percent(r);
                      const pass = pct >= 50;
                      return (
                        <Link
                          key={r.id}
                          href={`/study/performance/${r.id}`}
                          className="w-full flex items-center gap-3 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bento-card-hover squishy-press"
                        >
                          <span
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              pass ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[22px] leading-none">quiz</span>
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-semibold text-on-surface">
                              {r.course}
                            </p>
                            <p className="mt-0.5 font-display text-xs font-medium text-on-surface-variant">
                              {r.type} · {pct}%
                            </p>
                          </div>
                          <span
                            className={`font-display text-sm font-bold ${
                              pass ? "text-emerald-600" : "text-rose-500"
                            }`}
                          >
                            {r.score} / {r.total}
                          </span>
                          <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
                            chevron_right
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
