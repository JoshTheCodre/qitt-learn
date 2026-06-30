"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { SelectField, UploadBox } from "@/components/study/StudyFields";
import { COURSES } from "@/lib/courses";

const TYPES = ["Lecture Note", "Past Question", "Textbook", "Slides"];
const TIMES = ["None", "15 mins", "30 mins", "1 hour"];
const MODES = ["Summary", "Easy Read"];
const COURSE_CODES = COURSES.map((c) => c.code);

export default function StudyToolPage() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [time, setTime] = useState(TIMES[0]);
  const [course, setCourse] = useState("");
  const [mode, setMode] = useState(MODES[0]);
  const [fileName, setFileName] = useState<string | null>(null);

  const canStart = type && course && fileName;

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Study" />

      <main className="px-gutter pt-2 pb-28">
        <p className="font-display text-sm font-medium text-on-surface-variant mb-7">
          Turn your material into a clean summary or an easy-read breakdown.
        </p>

        <div className="space-y-6">
          <SelectField label="Type" value={type} onChange={setType} options={TYPES} placeholder="Select type" />
          <SelectField label="Time" value={time} onChange={setTime} options={TIMES} />
          <SelectField label="Course" value={course} onChange={setCourse} options={COURSE_CODES} placeholder="Select course" />
          <UploadBox fileName={fileName} onFile={setFileName} />

          {/* Mode */}
          <div>
            <label className="block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
              Reading mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const active = m === mode;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl py-3 font-display text-sm font-semibold transition-all squishy-press ${
                      active
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] leading-none">
                      {m === "Summary" ? "subject" : "auto_stories"}
                    </span>
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!canStart}
          onClick={() => router.push("/study/read")}
          className="mt-8 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-on-primary font-display text-sm font-semibold disabled:opacity-40 squishy-press"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">play_arrow</span>
          Start Studying
        </button>
      </main>
    </div>
  );
}
