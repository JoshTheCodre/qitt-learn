"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import JungleBackdrop from "@/components/JungleBackdrop";
import { SelectField } from "@/components/study/StudyFields";
import PerformanceView from "@/components/study/PerformanceView";
import { COURSES, formatCourseCode } from "@/lib/courses";
import { getUserCarryover, getUserCourses } from "@/lib/store";
import { haptic } from "@/lib/haptics";
import { startPracticeSession } from "@/lib/practice-session";
import type { PracticeAvailability } from "@/lib/practice";

const TIMES = ["No limit", "10", "20", "30"];
const TYPES = ["Objective", "Theory"];
const THEORY_MAX = 10; // AI grades each answer; keep a theory session short

// Near-black rather than the muted on-surface-variant — the copy needs real weight
// to sit cleanly over the foliage behind it.
const LABEL =
  "block font-display text-xs font-semibold uppercase tracking-wide text-on-surface mb-2";

function Segmented({
  value,
  onChange,
  options,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  suffix?: string;
}) {
  return (
    <div className="animated-field rounded-xl p-px">
      {/* Gray track, pure-white selected pill, strong black text */}
      <div className="flex gap-1 rounded-[11px] bg-surface-container p-1">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => {
                if (active) return; // re-tapping the current segment isn't a change
                haptic("select");
                onChange(o);
              }}
              className={`flex-1 rounded-lg py-2 font-display text-[13px] font-bold transition-colors ${
                active
                  ? "bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                  : "text-black"
              }`}
            >
              {o}
              {suffix && o !== "No limit" ? suffix : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function PracticeToolPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"practice" | "performance">("practice");
  const [course, setCourse] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [count, setCount] = useState(10);
  const [type, setType] = useState<string>(TYPES[0]);
  const [allCodes, setAllCodes] = useState<string[]>([]);
  const [avail, setAvail] = useState<Record<string, PracticeAvailability>>({});
  const [availLoading, setAvailLoading] = useState(true);

  // The user's own registered courses plus carryovers — you practise what you're
  // actually taking. Falls back to the sample catalog only if they have none yet
  // (e.g. a guest session). We then ask the bank which of those actually have questions;
  // only those make it into the picker.
  useEffect(() => {
    const mine = getUserCourses().map((c) => formatCourseCode(c.code));
    const carry = getUserCarryover().map((c) => formatCourseCode(c.course_code));
    const all = Array.from(new Set([...mine, ...carry]));
    const opts = all.length ? all : COURSES.map((c) => formatCourseCode(c.code));
    setAllCodes(opts);

    let alive = true;
    fetch(`/api/practice?codes=${encodeURIComponent(opts.join(","))}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d.ok) return;
        const map: Record<string, PracticeAvailability> = {};
        for (const it of d.items as PracticeAvailability[]) map[it.code] = it;
        setAvail(map);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setAvailLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  // Only courses that have practice questions (objective or theory) are offered.
  const courseOptions = useMemo(
    () => allCodes.filter((c) => avail[c]?.available),
    [allCodes, avail],
  );

  const chosen = course ? avail[course] : undefined;
  const isTheory = type === "Theory";
  const maxCount = isTheory ? THEORY_MAX : 50;
  // How many questions the selected TYPE has for the chosen course.
  const forType = isTheory ? chosen?.theory ?? 0 : chosen?.gradable ?? 0;
  const knownUnavailable = !!chosen && forType === 0;
  // A brand-new pick is allowed until the bank tells us otherwise; a known-empty course
  // is blocked so the quiz never opens on nothing.
  const canStart = !!course && !knownUnavailable;
  const startCount = forType > 0 ? Math.min(count, maxCount, forType) : Math.min(count, maxCount);

  // Keep the type selector on something the chosen course actually has.
  useEffect(() => {
    if (!chosen) return;
    if (type === "Theory" && chosen.theory === 0 && chosen.gradable > 0) setType("Objective");
    else if (type === "Objective" && chosen.gradable === 0 && chosen.theory > 0) setType("Theory");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen]);

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {tab === "practice" && <JungleBackdrop />}

      <div className="relative z-10">
        <BackHeader title="Practice" transparent home />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-28">
        {/* Practice / Performance segmented tabs */}
        <div className="mb-5 flex rounded-full bg-surface-container p-1">
          {(["practice", "performance"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 font-display text-[13px] font-semibold capitalize transition-all squishy-press ${
                tab === t
                  ? "bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-on-surface-variant"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "performance" ? (
          <PerformanceView />
        ) : (
          <>
        <section className="mb-7 rounded-2xl border border-emerald-700/15 bg-emerald-600/[0.05] p-4">
          <h2 className="font-display text-[17px] font-bold leading-tight text-on-surface">
            Prepare ahead. Stay ahead.
          </h2>
          <p className="mt-1 font-body text-[12px] font-medium text-on-surface/75">
            Turn your notes and past questions into quizzes, so you walk into every
            exam better prepared than the rest.
          </p>
        </section>

        <div className="space-y-6">
          <div>
            <SelectField
              label="Course"
              value={course}
              onChange={setCourse}
              options={courseOptions}
              placeholder={
                availLoading
                  ? "Checking your courses…"
                  : courseOptions.length === 0
                    ? "No practice courses yet"
                    : "Select course"
              }
              glow
            />
          </div>

          {/* Question type — Objective (auto-graded MCQs) or Theory (AI-graded) */}
          <div>
            <label className={LABEL}>Question type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const active = t === type;
                const n = chosen ? (t === "Theory" ? chosen.theory : chosen.gradable) : null;
                const disabled = chosen ? n === 0 : false;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (active) return;
                      haptic("select");
                      setType(t);
                      if (t === "Theory" && count > THEORY_MAX) setCount(THEORY_MAX);
                    }}
                    aria-pressed={active}
                    className={`rounded-full px-3.5 py-2 font-display text-[13px] font-semibold transition-colors squishy-press disabled:opacity-35 ${
                      active
                        ? "bg-emerald-700 text-white"
                        : "border border-outline-variant/50 bg-surface-container-lowest text-on-surface/70"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {isTheory && (
              <p className="mt-2 font-body text-[11px] font-medium text-on-surface/55">
                Theory answers are graded by AI when you submit.
              </p>
            )}
          </div>

          {/* Questions — a slider, because it's a magnitude, not a category */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="count" className={`${LABEL} mb-0`}>
                Questions
              </label>
              <span className="font-display text-[15px] font-bold text-on-surface tabular-nums">
                {count}
              </span>
            </div>
            <input
              id="count"
              type="range"
              min={5}
              max={maxCount}
              step={5}
              value={Math.min(count, maxCount)}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (next === count) return;
                haptic("select"); // one tick per step, like a physical detent
                setCount(next);
              }}
              className="w-full cursor-pointer accent-emerald-700"
            />
            <div className="mt-1.5 flex justify-between font-body text-[10px] font-medium text-on-surface/65">
              <span>5</span>
              <span>{maxCount}</span>
            </div>
          </div>

          {/* Time — segmented, because the options are short and mutually exclusive */}
          <div>
            {/* Pure black label, not the shared LABEL's text-on-surface gray */}
            <label className="mb-2 block font-display text-xs font-bold uppercase tracking-wide text-black">
              Time limit
            </label>
            <Segmented
              value={time}
              onChange={setTime}
              options={TIMES}
              suffix=" min"
            />
          </div>

        </div>
          </>
        )}
      </main>

      {/* Start button bar — Practice tab only. Opaque so scrolling content hides under it. */}
      {tab === "practice" && (
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 bg-[#e9f2ee] px-gutter pb-5 pt-3">
        {/* The sweeping border is the reward for a complete setup — it only runs
            once the button is actually armed, so it reads as "ready", not decoration. */}
        <div
          className={`rounded-2xl ${canStart ? "animated-border p-[1.5px]" : ""}`}
        >
          <button
            type="button"
            disabled={!canStart}
            onClick={() => {
              haptic("tap");
              // Carry the setup through, so the session screen reflects what was chosen
              // instead of ignoring it.
              const q = new URLSearchParams({
                course,
                type,
                count: String(startCount),
                time,
              });
              // Mark the session active, then REPLACE so Setup drops out of history —
              // pressing Back from the quiz can never land back on this page.
              startPracticeSession();
              router.replace(`/study/quiz?${q}`);
            }}
            className={`flex w-full items-center justify-center gap-2 bg-emerald-800 py-4 font-display text-sm font-semibold text-white transition-opacity disabled:opacity-40 squishy-press ${
              canStart ? "rounded-[15px]" : "rounded-2xl"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              bolt
            </span>
            {canStart ? `Start ${startCount} questions` : "Start Practice"}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
