"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  carryoverSlug,
  getUserCarryover,
  getUserCourses,
  type CarryoverCourse,
  type StoredCourse,
} from "@/lib/store";
import { COURSES as SAMPLE } from "@/lib/courses";

const SAMPLE_COURSES: StoredCourse[] = SAMPLE.map((c) => ({
  slug: c.slug,
  code: c.code,
  units: c.units,
  title: c.title,
}));

const ACCENTS: Record<string, string> = {
  CSC: "bg-blue-50 text-blue-600",
  MTH: "bg-violet-50 text-violet-600",
  GST: "bg-emerald-50 text-emerald-600",
  GES: "bg-emerald-50 text-emerald-600",
  PHY: "bg-rose-50 text-rose-600",
  CHM: "bg-amber-50 text-amber-600",
};
const DEFAULT_ACCENT = "bg-brand/5 text-brand";

function accentFor(code: string) {
  const prefix = code.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  return ACCENTS[prefix] ?? DEFAULT_ACCENT;
}

export default function CourseList({
  topClass = "mt-12",
  showStats = false,
}: {
  topClass?: string;
  showStats?: boolean;
}) {
  const [courses, setCourses] = useState<StoredCourse[]>([]);
  const [carryover, setCarryover] = useState<CarryoverCourse[]>([]);

  useEffect(() => {
    const user = getUserCourses();
    setCourses(user.length ? user : SAMPLE_COURSES);
    setCarryover(getUserCarryover());
  }, []);

  // Carryover units are unknown (typed by hand, not from the catalog), so they don't
  // contribute to the total — and the course count stays the count of THIS semester's
  // courses. Overstating either would be a lie about the workload.
  const totalUnits = courses.reduce((sum, c) => sum + (parseInt(c.units, 10) || 0), 0);

  return (
    <section className={`space-y-4 ${topClass}`}>
      <div className="flex items-center justify-between mb-3 ml-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-[17px] font-semibold text-on-surface">Courses</h3>
          {!showStats && (
            <span className="rounded-full bg-brand/5 text-brand px-2 py-0.5 font-display text-[11px] font-semibold">
              {courses.length}
            </span>
          )}
        </div>
        {showStats && (
          <div className="flex items-center gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[16px] font-bold text-on-surface leading-none">
                {courses.length}
              </span>
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                Courses
              </span>
            </div>
            <span className="h-4 w-px bg-outline-variant/60" />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-[16px] font-bold text-on-surface leading-none">
                {totalUnits}
              </span>
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                Units
              </span>
            </div>
          </div>
        )}
      </div>

      {courses.map((course) => {
        const accent = accentFor(course.code);
        return (
          <Link
            key={course.slug}
            href={`/study/${course.slug}`}
            className="w-full flex items-center justify-between gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] hover:border-brand/30 transition-all squishy-press"
          >
            <div className="min-w-0">
              <p className="font-body text-[15px] font-semibold text-on-surface truncate">
                {course.title}
              </p>
              <div className="mt-1.5 flex items-center gap-2 font-body text-[12px] font-medium text-on-surface-variant">
                <span>{course.code}</span>
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${accent}`}>
                  {course.units}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">
              chevron_right
            </span>
          </Link>
        );
      })}
    </section>
  );
}
