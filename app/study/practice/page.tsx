"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { SelectField, UploadBox } from "@/components/study/StudyFields";
import { COURSES } from "@/lib/courses";

const CATEGORIES = ["Past Question", "MCQ", "Theory", "Flashcards"];
const TIMES = ["No limit", "10 mins", "20 mins", "30 mins"];
const COUNTS = ["5", "10", "20", "30"];
const TYPES = ["MCQ", "Theory", "Mixed"];
const COURSE_CODES = COURSES.map((c) => c.code);

export default function PracticeToolPage() {
  const router = useRouter();
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [count, setCount] = useState(COUNTS[1]);
  const [type, setType] = useState(TYPES[0]);
  const [fileName, setFileName] = useState<string | null>(null);

  const canStart = course && category;

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Practice" />

      <main className="px-gutter pt-2 pb-28">
        <p className="font-display text-sm font-medium text-on-surface-variant mb-7">
          Generate a quiz from your material and test yourself.
        </p>

        <div className="space-y-6">
          <SelectField label="Course" value={course} onChange={setCourse} options={COURSE_CODES} placeholder="Select course" />
          <SelectField label="Category" value={category} onChange={setCategory} options={CATEGORIES} placeholder="Select category" />
          <SelectField label="Time" value={time} onChange={setTime} options={TIMES} />
          <SelectField label="Number of questions" value={count} onChange={setCount} options={COUNTS} />

          {/* Type */}
          <div>
            <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
              Type
            </label>
            <div className="flex gap-2">
              {TYPES.map((t) => {
                const active = t === type;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-xl py-2.5 font-display text-sm font-semibold transition-all squishy-press ${
                      active
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <UploadBox fileName={fileName} onFile={setFileName} />
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={() => router.push("/study/quiz")}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">bolt</span>
          Start Practice
        </button>
      </main>
    </div>
  );
}
