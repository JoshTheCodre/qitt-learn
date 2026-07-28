"use client";

import { useState } from "react";
import { updateCurrentUser, slugify, type StoredCourse } from "@/lib/store";
import { formatCourseCode } from "@/lib/courses";
import CourseSearch from "@/components/CourseSearch";
import type { CatalogCourse } from "@/lib/catalog";

type Pending = { kind: "add" | "remove"; label: string; apply: () => void };

export default function EditCoursesModal({
  courses,
  onClose,
  onChange,
}: {
  courses: StoredCourse[];
  onClose: () => void;
  onChange: (next: StoredCourse[]) => void;
}) {
  const [list, setList] = useState<StoredCourse[]>(courses);
  const [pending, setPending] = useState<Pending | null>(null);

  function persist(next: StoredCourse[]) {
    setList(next);
    updateCurrentUser({ courses: next });
    onChange(next);
  }

  // Confirm before adding — matches the profile carryover flow.
  function requestAdd(course: CatalogCourse) {
    const code = course.code.trim().toUpperCase();
    const slug = slugify(code);
    if (list.some((x) => x.slug === slug)) return; // no duplicates
    setPending({
      kind: "add",
      label: formatCourseCode(code),
      apply: () =>
        persist([...list, { slug, code, title: course.title || code, units: `${course.unit} units` }]),
    });
  }

  function requestRemove(c: StoredCourse) {
    setPending({
      kind: "remove",
      label: formatCourseCode(c.code),
      apply: () => persist(list.filter((x) => x.slug !== c.slug)),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-[430px] max-h-[85vh] overflow-y-auto no-scrollbar rounded-t-3xl bg-background px-5 pt-4 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.15)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant/60" />

        <div className="flex items-center justify-between">
          <h3 className="font-display text-[18px] font-bold text-on-surface">Edit Courses</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center squishy-press"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant leading-none">
              close
            </span>
          </button>
        </div>

        {/* Search to add — at the top, like the profile carryover picker */}
        <CourseSearch excludeCodes={list.map((c) => c.code)} onSelect={requestAdd} />

        {/* Current courses */}
        <p className="mt-3 mb-1.5 font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
          Your courses ({list.length})
        </p>
        <div className="space-y-2">
          {list.length === 0 && (
            <p className="font-body text-[13px] font-medium text-on-surface-variant text-center py-3">
              No courses yet — search above to add one.
            </p>
          )}
          {list.map((c) => (
            <div
              key={c.slug}
              className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="font-body text-[14px] font-semibold text-on-surface truncate">
                  {c.title}
                </p>
                <p className="mt-0.5 font-body text-[11px] font-medium text-on-surface-variant">
                  {formatCourseCode(c.code)} · {c.units}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${c.code}`}
                onClick={() => requestRemove(c)}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error-container transition-colors squishy-press"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">close</span>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3.5 rounded-2xl bg-surface-container text-on-surface font-display text-sm font-semibold squishy-press"
        >
          Done
        </button>
      </div>

      {/* Add / remove confirmation */}
      {pending && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-surface-container-lowest p-5 text-center shadow-2xl">
            <h3 className="font-display text-[17px] font-bold text-on-surface">
              {pending.kind === "add" ? "Add course?" : "Remove course?"}
            </h3>
            <p className="mt-1.5 font-body text-[13px] leading-snug text-on-surface/60">
              {pending.kind === "add"
                ? `Add ${pending.label} to your courses?`
                : `Remove ${pending.label} from your courses?`}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPending(null)}
                className="flex-1 rounded-xl bg-surface-container py-3 font-display text-sm font-semibold text-on-surface squishy-press"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  pending.apply();
                  setPending(null);
                }}
                className={`flex-1 rounded-xl py-3 font-display text-sm font-semibold text-white squishy-press ${
                  pending.kind === "remove" ? "bg-error" : "bg-brand"
                }`}
              >
                {pending.kind === "add" ? "Add" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
