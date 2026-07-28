"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BackHeader from "@/components/BackHeader";
import { getUserCourses, type StoredCourse } from "@/lib/store";
import { formatCourseCode } from "@/lib/courses";

const GRADES = [
  { label: "A", point: 5 },
  { label: "B", point: 4 },
  { label: "C", point: 3 },
  { label: "D", point: 2 },
  { label: "E", point: 1 },
  { label: "F", point: 0 },
];

function classify(gpa: number, hasData: boolean): string {
  if (!hasData) return "Grade your courses to see your class";
  if (gpa >= 4.5) return "First Class";
  if (gpa >= 3.5) return "Second Class (Upper)";
  if (gpa >= 2.4) return "Second Class (Lower)";
  if (gpa >= 1.5) return "Third Class";
  if (gpa >= 1.0) return "Pass";
  return "Fail";
}

export default function CgpaPage() {
  const [courses, setCourses] = useState<StoredCourse[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({});

  useEffect(() => {
    setCourses(getUserCourses());
  }, []);

  const graded = courses.filter((c) => grades[c.slug]);
  const totalUnits = graded.reduce((s, c) => s + (parseInt(c.units, 10) || 0), 0);
  const totalPoints = graded.reduce((s, c) => {
    const point = GRADES.find((g) => g.label === grades[c.slug])?.point ?? 0;
    return s + (parseInt(c.units, 10) || 0) * point;
  }, 0);
  const gpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
  const hasData = totalUnits > 0;

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="CGPA Calculator" />

      <main className="px-gutter pt-2 pb-28">
        {/* Result card */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-brand to-blue-700 p-5 text-white shadow-[0_10px_26px_rgba(37,99,235,0.22)]">
          <p className="font-body text-[11px] font-semibold uppercase tracking-widest text-white/70">
            Your CGPA
          </p>
          <p className="mt-1 font-display text-[44px] font-extrabold leading-none">
            {gpa.toFixed(2)}
          </p>
          <p className="mt-1.5 font-display text-sm font-semibold text-white/85">
            {classify(gpa, hasData)}
          </p>
          <p className="mt-3 font-body text-[11px] font-medium text-white/60">
            {graded.length} of {courses.length} courses graded · {totalUnits} units · 5.0 scale
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center gap-3 px-4">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              school
            </span>
            <p className="font-body text-sm font-medium text-on-surface-variant">
              No courses yet. Add your courses from the home screen, then come back to calculate
              your CGPA.
            </p>
            <Link
              href="/dashboard"
              className="mt-2 rounded-full bg-brand px-5 py-2.5 font-display text-sm font-semibold text-on-primary squishy-press"
            >
              Go to courses
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-6 mb-2 ml-1 font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
              Grade your courses
            </p>
            <div className="space-y-2.5">
              {courses.map((c) => (
                <div
                  key={c.slug}
                  className="flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[14px] font-semibold text-on-surface truncate">
                      {c.title}
                    </p>
                    <p className="mt-0.5 font-body text-[11px] font-medium text-on-surface-variant">
                      {formatCourseCode(c.code)} · {c.units}
                    </p>
                  </div>
                  <select
                    value={grades[c.slug] ?? ""}
                    onChange={(e) => setGrades((g) => ({ ...g, [c.slug]: e.target.value }))}
                    aria-label={`Grade for ${c.code}`}
                    className={`w-14 shrink-0 rounded-lg px-2 py-2 text-center font-display text-sm font-bold focus:outline-none ${
                      grades[c.slug]
                        ? "bg-brand/10 text-brand"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <option value="">–</option>
                    {GRADES.map((g) => (
                      <option key={g.label} value={g.label}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
