"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Assignment = { id: string; dueAt: string | null };

// A grid card matching the ActionCard shape (icon badge, label, caption) with a live
// caption and an overdue badge. Shows the student's published class assignments.
export default function AssignmentsCard() {
  const [items, setItems] = useState<Assignment[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/assignments")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && d.ok) setItems(d.assignments as Assignment[]);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const now = Date.now();
  const list = items ?? [];
  const overdue = list.filter((a) => a.dueAt && new Date(a.dueAt).getTime() < now).length;
  const upcoming = list.length - overdue;

  let caption = "Class assignments";
  if (items) {
    if (list.length === 0) caption = "Nothing due";
    else caption = `${upcoming} upcoming`;
  }

  return (
    <Link
      href="/assignments"
      className="group rounded-2xl bg-surface-container-lowest p-4 ring-1 ring-inset ring-black/[0.06] shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-shadow duration-200 hover:shadow-[0_8px_20px_-12px_rgba(16,24,40,0.2)] squishy-press"
    >
      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: "#f97316" }}
      >
        <span className="material-symbols-outlined icon-filled text-[22px] leading-none text-white">
          edit_note
        </span>
        {overdue > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 font-display text-[10px] font-bold text-white">
            {overdue}
          </span>
        )}
      </span>

      <p className="mt-3 font-display text-[14px] font-bold leading-tight text-on-surface">Assignments</p>
      <p className="mt-1 font-body text-[11px] font-medium leading-snug text-on-surface/55">{caption}</p>
    </Link>
  );
}
