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
import { COURSES as SAMPLE, formatCourseCode } from "@/lib/courses";
import EditCoursesModal from "@/components/study/EditCoursesModal";

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

// GES ("General Studies") courses are sat as computer-based tests — they get a badge and
// float to the top of the list so students see their exam-day courses first.
function isCbt(code: string) {
  return /ges/i.test(code);
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
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const user = getUserCourses();
    setCourses(user.length ? user : SAMPLE_COURSES);
    setCarryover(getUserCarryover());
  }, []);

  // Carryover units are unknown (typed by hand, not from the catalog), so they don't
  // contribute to the total — and the course count stays the count of THIS semester's
  // courses. Overstating either would be a lie about the workload.
  const totalUnits = courses.reduce((sum, c) => sum + (parseInt(c.units, 10) || 0), 0);

  // CBT (GES) courses lead the list; a stable sort keeps everything else in place.
  const ordered = [...courses].sort((a, b) => Number(isCbt(b.code)) - Number(isCbt(a.code)));

  return (
    <section className={`space-y-4 ${topClass}`}>
      <div className="flex items-center justify-between mb-3 ml-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-[17px] font-semibold text-on-surface">Courses</h3>
          <button
            type="button"
            aria-label="Edit courses"
            onClick={() => setEditing(true)}
            className="flex items-center justify-center squishy-press"
          >
            <span className="material-symbols-outlined text-[19px] leading-none text-blue-400">
              edit_square
            </span>
          </button>
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

      {ordered.map((course) => {
        const accent = accentFor(course.code);
        const cbt = isCbt(course.code);
        return (
          <Link
            key={course.slug}
            href={`/study/${course.slug}`}
            className={`w-full flex items-center justify-between gap-3 rounded-xl border p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] transition-all squishy-press ${
              cbt
                ? "border-violet-200/60 bg-surface-container-lowest hover:border-violet-300"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-brand/30"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-body text-[15px] font-semibold text-on-surface truncate">
                  {course.title}
                </p>
                {cbt && (
                  <span className="shrink-0 inline-flex items-center gap-0.5 rounded-full border border-violet-200 bg-violet-100 py-0.5 pl-1 pr-1.5 font-display text-[9px] font-bold uppercase tracking-[0.1em] text-violet-700">
                    <span className="material-symbols-outlined text-[12px] leading-none">desktop_windows</span>
                    CBT
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-2 font-body text-[12px] font-medium text-on-surface-variant">
                <span>{formatCourseCode(course.code)}</span>
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

      {carryover.length > 0 && (
        <>
          {/* Divider label — carryovers are this semester's list too, but they're not
              the same thing as your registered courses, so they're set apart. */}
          <div className="flex items-center gap-2.5 pt-2">
            <span className="h-px flex-1 bg-outline-variant/50" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface/45">
              Carryover Courses
            </span>
            <span className="h-px flex-1 bg-outline-variant/50" />
          </div>

          {carryover.map((c) => (
            <Link
              key={c.course_code}
              href={`/study/${carryoverSlug(c.course_code)}`}
              className="w-full flex items-center justify-between gap-3 rounded-xl border border-amber-300/50 bg-amber-50/40 p-4 text-left shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] hover:border-amber-400 transition-all squishy-press"
            >
              <div className="min-w-0">
                <p className="font-body text-[15px] font-semibold text-on-surface truncate">
                  {c.course_title || c.course_code}
                </p>
                <div className="mt-1.5 flex items-center gap-2 font-body text-[12px] font-medium text-on-surface-variant">
                  <span>{formatCourseCode(c.course_code)}</span>
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                    Carryover
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">
                chevron_right
              </span>
            </Link>
          ))}
        </>
      )}

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex w-full items-center justify-center gap-1.5 pt-2 text-center font-body text-[12px] font-medium text-on-surface-variant/70"
      >
        Missing a course? Tap
        <span className="material-symbols-outlined text-[15px] leading-none text-blue-400">
          edit_square
        </span>
        to add it.
      </button>

      {editing && (
        <EditCoursesModal
          courses={courses}
          onChange={setCourses}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  );
}
