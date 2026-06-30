import Link from "next/link";
import { COURSES } from "@/lib/courses";

export default function CourseList() {
  return (
    <section className="mt-12 space-y-4">
      <h3 className="font-display text-[18px] font-bold text-on-surface mb-4 ml-1">Courses</h3>
      {COURSES.map((course) => (
        <Link
          key={course.code}
          href={`/study/${course.slug}`}
          className="group w-full bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between gap-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/30 bento-card-hover squishy-press"
        >
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <span className="font-display text-xs font-medium text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                {course.units}
              </span>
            </div>
            <h4 className="font-display text-[18px] font-bold text-on-surface truncate">
              {course.title}
            </h4>
          </div>
          <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-surface-container text-primary transition-all group-hover:bg-primary group-hover:text-on-primary">
            <span className="material-symbols-outlined leading-none">chevron_right</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
