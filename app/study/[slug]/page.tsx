"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
import CourseHeader from "@/components/study/CourseHeader";
import { resolveCourse, type ResolvedCourse } from "@/lib/store";

const QUICK_ACTIONS = [
  { label: "Course materials", icon: "library_books", iconWrap: "bg-primary/10 text-primary", sub: "materials", soon: false },
  { label: "Course outline", icon: "format_list_bulleted", iconWrap: "bg-tertiary/10 text-tertiary", sub: "outline", soon: true },
  { label: "Lecture notes", icon: "edit_note", iconWrap: "bg-amber-100 text-amber-600", sub: "notes", soon: true },
  { label: "Recordings", icon: "play_circle", iconWrap: "bg-rose-100 text-rose-600", sub: "recordings", soon: true },
];

const ACCENT = {
  primary: { badge: "bg-primary/10 text-primary" },
  tertiary: { badge: "bg-tertiary/10 text-tertiary" },
} as const;

export default function CourseDetailPage() {
  const params = useParams();
  const slug = String(params.slug);
  const [course, setCourse] = useState<ResolvedCourse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [materialCount, setMaterialCount] = useState<number | null>(null);

  useEffect(() => {
    setCourse(resolveCourse(slug));
    setLoaded(true);
  }, [slug]);

  // How many library files exist for this course — shown as a badge on the materials card.
  useEffect(() => {
    if (!course) return;
    let alive = true;
    fetch(`/api/materials?code=${encodeURIComponent(course.code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d.ok) setMaterialCount(d.count as number);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [course]);

  const frame =
    "mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20";

  if (!loaded) return <div className={frame} />;

  if (!course) {
    return (
      <div className={frame}>
        <CourseHeader code="Course" units="" />
        <div className="flex flex-col items-center justify-center py-24 gap-2 text-center px-gutter">
          <span className="material-symbols-outlined text-[40px] text-outline-variant">search_off</span>
          <p className="font-display text-sm font-medium text-on-surface-variant">Course not found.</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const schedule = course.schedule ?? [];

  return (
    <div className={frame}>
      <CourseHeader code={course.code} units={course.units} />

      <main className="px-gutter pb-28">
        {/* Course title */}
        <section className="mt-2">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Course Title
          </p>
          <h2 className="font-display text-[26px] font-bold leading-tight text-on-surface">
            {course.title}
          </h2>
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const icon = (
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center ${action.iconWrap}`}
              >
                <span className="material-symbols-outlined leading-none">{action.icon}</span>
              </span>
            );

            // Not built yet — show a disabled card with a "Coming soon" chip instead of a link.
            if (action.soon) {
              return (
                <div
                  key={action.label}
                  aria-disabled="true"
                  className="relative flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent opacity-60"
                >
                  {icon}
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-surface-container-highest px-1.5 py-px font-display text-[9px] font-semibold tracking-wide text-on-surface-variant">
                    Coming soon
                  </span>
                  <span className="font-display text-sm font-semibold text-on-surface text-left">
                    {action.label}
                  </span>
                </div>
              );
            }

            const showCount = materialCount != null && materialCount > 0;
            return (
              <Link
                key={action.label}
                href={`/study/${course.slug}/${action.sub}`}
                className="group relative flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent hover:border-primary/10 bento-card-hover squishy-press"
              >
                {icon}
                {showCount && (
                  <span className="absolute right-3 top-3 min-w-[22px] rounded-full bg-primary/10 px-2 py-0.5 text-center font-display text-[11px] font-bold text-primary">
                    {materialCount}
                  </span>
                )}
                <span className="font-display text-sm font-semibold text-on-surface text-left">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </section>

        {/* Class schedule */}
        {schedule.length > 0 && (
          <section className="mt-8">
            <h3 className="font-display text-[18px] font-bold text-on-surface mb-4">Weekly Schedule</h3>
            <div className="space-y-3">
              {schedule.map((session, i) => {
                const accent = ACCENT[session.accent];
                return (
                  <div
                    key={`${session.day}-${i}`}
                    className="bg-surface-container-lowest rounded-2xl p-4 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/30"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-display font-semibold ${accent.badge}`}
                      >
                        {session.day}
                      </div>
                      <div className="min-w-0">
                        <div className="text-on-surface font-display text-sm font-semibold">
                          {session.time}
                        </div>
                        <p className="mt-0.5 font-display text-xs font-medium text-on-surface-variant">
                          {session.location}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Set reminder"
                      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-outline hover:text-primary transition-colors squishy-press"
                    >
                      <span className="material-symbols-outlined leading-none">notifications_active</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
