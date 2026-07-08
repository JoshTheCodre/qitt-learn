"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";
import { getRecordings } from "@/lib/courseContent";

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

export default function RecordingsPage() {
  const slug = String(useParams().slug);
  const [course, setCourse] = useState<ResolvedCourse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCourse(resolveCourse(slug));
    setLoaded(true);
  }, [slug]);

  if (!loaded) return <div className={FRAME} />;
  if (!course) {
    return (
      <div className={FRAME}>
        <BackHeader title="Recordings" />
        <p className="px-gutter pt-8 font-display text-sm font-medium text-on-surface-variant">
          Course not found.
        </p>
      </div>
    );
  }

  const recordings = getRecordings(course);

  return (
    <div className={FRAME}>
      <BackHeader title="Recordings" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-8">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold text-on-surface leading-tight">
            {course.title}
          </h2>
          <p className="mt-1.5 font-display text-xs font-medium text-on-surface-variant">
            {recordings.length} recordings
          </p>
        </div>

        <div className="space-y-3">
          {recordings.map((rec) => (
            <button
              key={rec.id}
              type="button"
              className="w-full flex items-center gap-3.5 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_4px_rgba(0,0,0,0.05)] bento-card-hover squishy-press"
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600">
                <span className="material-symbols-outlined text-[24px] leading-none">play_circle</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-on-surface truncate">
                  {rec.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-on-surface-variant">
                  <span>{rec.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                  <span>{rec.date}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
