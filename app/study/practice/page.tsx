"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import PatternBackdrop from "@/components/PatternBackdrop";
import { SelectField } from "@/components/study/StudyFields";
import { COURSES } from "@/lib/courses";
import { haptic } from "@/lib/haptics";

const MODES = ["Past Question", "Lecture Notes"];
const TIMES = ["No limit", "10", "20", "30"];
const TYPES = ["MCQ", "Flashcards"];
const COURSE_CODES = COURSES.map((c) => c.code);

// Near-black rather than the muted on-surface-variant — the copy needs real weight
// to sit cleanly over the patterned backdrop.
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
              className={`flex-1 rounded-lg py-2 font-display text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-on-surface/60"
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
  const [course, setCourse] = useState("");
  const [mode, setMode] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [count, setCount] = useState(10);
  const [type, setType] = useState(TYPES[0]);

  const canStart = course && mode;

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <PatternBackdrop />

      <div className="relative z-10">
        <BackHeader title="Practice" transparent home />
      </div>

      <main className="relative z-10 px-gutter pt-2 pb-28">
        <section className="mb-7 rounded-2xl border border-emerald-700/15 bg-emerald-600/[0.05] p-4">
          <h2 className="font-display text-[17px] font-bold leading-tight text-on-surface">
            Revise. Understand. Ace.
          </h2>
          <p className="mt-1 font-body text-[12px] font-medium text-on-surface/75">
            Turn your notes and past questions into a quiz, and walk into the
            exam hall ready.
          </p>
        </section>

        <div className="space-y-6">
          <SelectField
            label="Course"
            value={course}
            onChange={setCourse}
            options={COURSE_CODES}
            placeholder="Select course"
            glow
          />

          {/* Mode — chips, because it's a one-of-four pick with wordy labels */}
          <div>
            <label className={LABEL}>Mode</label>
            <div className="flex flex-wrap gap-2">
              {MODES.map((m) => {
                const active = m === mode;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      if (active) return;
                      haptic("select");
                      setMode(m);
                    }}
                    aria-pressed={active}
                    className={`rounded-full px-3.5 py-2 font-display text-[13px] font-semibold transition-colors squishy-press ${
                      active
                        ? "bg-emerald-700 text-white"
                        : "border border-outline-variant/50 bg-surface-container-lowest text-on-surface/70"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
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
              max={50}
              step={5}
              value={count}
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
              <span>50</span>
            </div>
          </div>

          {/* Time — segmented, because the options are short and mutually exclusive */}
          <div>
            <label className={LABEL}>Time limit</label>
            <Segmented
              value={time}
              onChange={setTime}
              options={TIMES}
              suffix=" min"
            />
          </div>

          <div>
            <label className={LABEL}>Type</label>
            <Segmented value={type} onChange={setType} options={TYPES} />
          </div>
        </div>
      </main>

      {/* Opaque, so scrolling content is hidden rather than sliding visibly under the
          button. Softly tinted rather than pure white, and the fade strip above it lets
          content dissolve into the bar instead of being cut by a hard edge. */}
      <div className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 bg-[#e9f2ee] px-gutter pb-5 pt-3">
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-10 bg-gradient-to-t from-[#e9f2ee] to-transparent" />
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
              router.push("/study/quiz");
            }}
            className={`flex w-full items-center justify-center gap-2 bg-emerald-800 py-4 font-display text-sm font-semibold text-white shadow-[0_8px_24px_rgba(6,78,59,0.28)] transition-opacity disabled:opacity-40 disabled:shadow-none squishy-press ${
              canStart ? "rounded-[15px]" : "rounded-2xl"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] leading-none">
              bolt
            </span>
            {canStart ? `Start ${count} questions` : "Start Practice"}
          </button>
        </div>
      </div>
    </div>
  );
}
