"use client";

import { useState, useEffect } from "react";
import BackHeader from "@/components/BackHeader";
import { getUserCourses, type StoredCourse } from "@/lib/store";
import { COURSES as SAMPLE } from "@/lib/courses";

const YEARS = ["2023", "2022"];

const SAMPLE_COURSES: StoredCourse[] = SAMPLE.map((c) => ({
  slug: c.slug,
  code: c.code,
  units: c.units,
  title: c.title,
}));

export default function PastQuestionsPage() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);

  useEffect(() => {
    const user = getUserCourses();
    setCourses(user.length ? user : SAMPLE_COURSES);
  }, []);

  const papers = courses.flatMap((c) =>
    YEARS.map((year) => ({ id: `${c.slug}-${year}`, code: c.code, title: c.title, year })),
  );

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Past Questions" />

      <main className="px-gutter pt-2 pb-28">
        <p className="font-display text-sm font-medium text-on-surface-variant mb-6">
          Past exam papers for your registered courses.
        </p>

        <div className="space-y-3">
          {papers.map((p) => (
            <button
              key={p.id}
              type="button"
              className="w-full flex items-center gap-3.5 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_4px_rgba(0,0,0,0.05)] bento-card-hover squishy-press"
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 text-amber-600">
                <span className="material-symbols-outlined text-[22px] leading-none">history_edu</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-on-surface truncate">
                  {p.code} — {p.year}
                </p>
                <p className="mt-0.5 font-body text-xs font-medium text-on-surface-variant truncate">
                  {p.title}
                </p>
              </div>
              <span className="w-9 h-9 shrink-0 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px] leading-none">download</span>
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
