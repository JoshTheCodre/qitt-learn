"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";
import { getMaterials } from "@/lib/courseContent";

const FRAME =
  "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

export default function CourseMaterialsPage() {
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
        <BackHeader title="Course Materials" />
        <p className="px-gutter pt-8 font-display text-sm font-medium text-on-surface-variant">
          Course not found.
        </p>
      </div>
    );
  }

  const materials = getMaterials(course);

  return (
    <div className={FRAME}>
      <BackHeader title="Course Materials" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-8">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold text-on-surface leading-tight">
            {course.title}
          </h2>
          <p className="mt-1.5 font-display text-xs font-medium text-on-surface-variant">
            {materials.length} files
          </p>
        </div>

        <div className="space-y-3">
          {materials.map((m) => (
            <button
              key={m.id}
              type="button"
              className="w-full flex items-center gap-3.5 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bento-card-hover squishy-press"
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[22px] leading-none">draft</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-on-surface truncate">
                  {m.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-on-surface-variant">
                  <span>{m.format}</span>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                  <span>{m.size}</span>
                </div>
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
