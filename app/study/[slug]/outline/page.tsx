"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";
import { getOutline } from "@/lib/courseContent";

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

export default function CourseOutlinePage() {
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
        <BackHeader title="Course Outline" />
        <p className="px-gutter pt-8 font-display text-sm font-medium text-on-surface-variant">
          Course not found.
        </p>
      </div>
    );
  }

  const outline = getOutline(course);

  return (
    <div className={FRAME}>
      <BackHeader title="Course Outline" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-8">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold text-on-surface leading-tight">
            {course.title}
          </h2>
          <p className="mt-1.5 font-display text-xs font-medium text-on-surface-variant">
            {outline.length} weeks
          </p>
        </div>

        <ol className="relative pl-2">
          {outline.map((item, i) => (
            <li key={item.week} className="relative flex gap-4 pb-6 last:pb-0">
              {i < outline.length - 1 && (
                <span className="absolute left-[15px] top-9 bottom-0 w-px bg-outline-variant/50" />
              )}
              <span className="relative z-10 w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-display text-xs font-bold text-primary">
                {item.week}
              </span>
              <div className="pt-1.5">
                <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant/70">
                  Week {item.week}
                </p>
                <p className="mt-0.5 font-display text-sm font-semibold text-on-surface">
                  {item.topic}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
