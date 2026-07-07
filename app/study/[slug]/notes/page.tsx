import { notFound } from "next/navigation";
import BackHeader from "@/components/BackHeader";
import { COURSES, getCourse } from "@/lib/courses";
import { getLectureNotes } from "@/lib/courseContent";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export default function LectureNotesPage({ params }: { params: { slug: string } }) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  const notes = getLectureNotes(course);

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      <BackHeader title="Lecture Notes" />

      <main className="px-gutter pt-2 pb-28">
        <div className="mb-8">
          <p className="font-display text-xs font-semibold text-primary">{course.code}</p>
          <h2 className="mt-1 font-display text-[18px] font-bold text-on-surface leading-tight">
            {course.title}
          </h2>
          <p className="mt-1.5 font-display text-xs font-medium text-on-surface-variant">
            {notes.length} notes
          </p>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className="w-full flex items-center gap-3.5 rounded-2xl p-4 text-left bg-surface-container-lowest border border-outline-variant/30 shadow-[0_1px_4px_rgba(0,0,0,0.05)] bento-card-hover squishy-press"
            >
              <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 text-amber-600">
                <span className="material-symbols-outlined text-[22px] leading-none">edit_note</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-on-surface truncate">
                  {note.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5 font-body text-xs font-medium text-on-surface-variant">
                  <span>{note.week}</span>
                  <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                  <span>{note.size}</span>
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
