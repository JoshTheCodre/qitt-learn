import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
import CourseHeader from "@/components/study/CourseHeader";
import { COURSES, getCourse } from "@/lib/courses";

const QUICK_ACTIONS = [
  { label: "Course materials", icon: "library_books", iconWrap: "bg-primary/10 text-primary", sub: "materials" },
  { label: "Course outline", icon: "format_list_bulleted", iconWrap: "bg-tertiary/10 text-tertiary", sub: "outline" },
];

const ACCENT = {
  primary: { badge: "bg-primary/10 text-primary" },
  tertiary: { badge: "bg-tertiary/10 text-tertiary" },
} as const;

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  return (
    <div className="mx-auto w-full max-w-[480px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
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
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              href={`/study/${course.slug}/${action.sub}`}
              className="group flex flex-col items-start gap-3 p-4 rounded-2xl bg-surface-container-lowest shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-transparent hover:border-primary/10 bento-card-hover squishy-press"
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center ${action.iconWrap}`}
              >
                <span className="material-symbols-outlined leading-none">{action.icon}</span>
              </span>
              <span className="font-display text-sm font-semibold text-on-surface text-left">
                {action.label}
              </span>
            </Link>
          ))}
        </section>

        {/* Class schedule */}
        <section className="mt-8">
          <h3 className="font-display text-[18px] font-bold text-on-surface mb-4">Weekly Schedule</h3>
          <div className="space-y-3">
            {course.schedule.map((session, i) => {
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
      </main>

      <BottomNav />
    </div>
  );
}
