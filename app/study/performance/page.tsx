"use client";

import { useState } from "react";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";

const RANGES = ["All Time", "This Month", "This Week"];

const SCORES = [55, 68, 60, 82, 74, 90, 78];

const SESSIONS = [
  { id: "1", group: "Yesterday", course: "CSC 202.2", type: "Past Question", score: "18 / 20" },
  { id: "2", group: "Yesterday", course: "MTH 201.1", type: "MCQ", score: "12 / 15" },
  { id: "3", group: "This Week", course: "CSC 204.1", type: "Theory", score: "8 / 10" },
];

function buildChart(scores: number[]) {
  const W = 300;
  const H = 110;
  const pad = 12;
  const max = 100;
  const stepX = (W - pad * 2) / (scores.length - 1);
  const pts = scores.map((s, i) => {
    const x = pad + i * stepX;
    const y = H - pad - (s / max) * (H - pad * 2);
    return { x, y };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M ${pts[0].x},${H - pad} ${pts
    .map((p) => `L ${p.x},${p.y}`)
    .join(" ")} L ${pts[pts.length - 1].x},${H - pad} Z`;
  const peak = pts.reduce((a, b) => (b.y < a.y ? b : a), pts[0]);
  return { line, area, peak, W, H };
}

export default function PerformancePage() {
  const [range, setRange] = useState(RANGES[0]);
  const { line, area, peak, W, H } = buildChart(SCORES);

  const avg = Math.round(SCORES.reduce((a, b) => a + b, 0) / SCORES.length);
  const best = Math.max(...SCORES);

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      {/* z-10 lifts the page above the absolutely-positioned backdrop */}
      <div className="relative z-10">
        <BackHeader title="Performance" transparent />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-28">
        {/* Filters */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="rounded-full bg-primary/5 text-primary px-3 py-1.5 font-display text-xs font-semibold">
            All Courses
          </span>
          <div className="relative">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="appearance-none rounded-full border border-outline-variant/50 bg-surface-container-lowest pl-4 pr-9 py-1.5 font-display text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
            >
              {RANGES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
            <defs>
              <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#perfFill)" />
            <polyline
              points={line}
              fill="none"
              stroke="rgb(37 99 235)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx={peak.x} cy={peak.y} r="4" fill="rgb(37 99 235)" />
            <circle cx={peak.x} cy={peak.y} r="8" fill="rgb(37 99 235)" fillOpacity="0.15" />
          </svg>
        </div>

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Avg score", value: `${avg}%` },
            { label: "Best", value: `${best}%` },
            { label: "Sessions", value: `${SESSIONS.length}` },
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
        <div className="space-y-4">
          {["Yesterday", "This Week"].map((group) => {
            const groupItems = SESSIONS.filter((s) => s.group === group);
            if (!groupItems.length) return null;
            return (
              <div key={group}>
                <p className="mb-2 font-display text-xs font-semibold text-on-surface-variant">
                  {group}
                </p>
                <div className="space-y-2.5">
                  {groupItems.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="w-full flex items-center gap-3 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bento-card-hover squishy-press"
                    >
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-[22px] leading-none">quiz</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold text-on-surface">{s.course}</p>
                        <p className="mt-0.5 font-display text-xs font-medium text-on-surface-variant">
                          {s.type}
                        </p>
                      </div>
                      <span className="font-display text-sm font-bold text-primary">{s.score}</span>
                      <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
                        chevron_right
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
