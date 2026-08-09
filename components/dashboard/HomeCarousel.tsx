"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTerm } from "@/lib/term";
import { todayDay, compactTime, type TimetableEntry } from "@/lib/timetable";
import { getUserTimetable } from "@/lib/user-timetable";

// Today's classes summary → /timetable. Uses the student's own timetable; when they haven't
// set one up, the slide invites them to.
function TodayCard() {
  const [entries, setEntries] = useState<TimetableEntry[] | null>(null);
  useEffect(() => {
    setEntries(getUserTimetable());
  }, []);

  const today = todayDay();
  const classes = (entries ?? [])
    .filter((e) => e.day === today)
    .sort((a, b) => a.start.localeCompare(b.start));

  let subtitle: string;
  if (entries === null) subtitle = "Your class schedule";
  else if (entries.length === 0) subtitle = "No timetable yet — tap to set it up";
  else if (classes.length === 0) subtitle = "No classes today 🎉";
  else
    subtitle = `${classes.length} class${classes.length === 1 ? "" : "es"} · ${classes
      .map((c) => compactTime(c.start))
      .join(" · ")}`;

  return (
    <Link
      href="/timetable"
      className="group flex items-center gap-3 rounded-2xl border border-emerald-600/15 bg-emerald-500/[0.07] px-4 py-3.5 transition-colors hover:bg-emerald-500/[0.11] squishy-press"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/[0.14]">
        <span className="material-symbols-outlined icon-filled text-[24px] leading-none text-emerald-600">schedule</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold leading-tight text-emerald-700">Today&apos;s classes</p>
        <p className="mt-0.5 truncate font-body text-[12px] font-medium leading-tight text-on-surface/55">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined shrink-0 text-[20px] leading-none text-on-surface/30 transition-transform group-hover:translate-x-0.5">
        chevron_right
      </span>
    </Link>
  );
}

// Term / week progress → /calendar.
function TermCard() {
  const term = getTerm();
  const title =
    term.phase === "during"
      ? `Week ${term.week} of ${term.totalWeeks}`
      : term.phase === "before"
        ? "Starting soon"
        : "Teaching done";
  const subtitle =
    term.phase === "during"
      ? `${term.label} · ${term.weeksLeft} week${term.weeksLeft === 1 ? "" : "s"} to go`
      : term.phase === "before"
        ? `${term.label} · begins soon`
        : `${term.label} · exams ahead`;

  return (
    <Link
      href="/calendar"
      className="group flex items-center gap-3 rounded-2xl border border-brand/15 bg-brand/[0.06] px-4 py-3.5 transition-colors hover:bg-brand/[0.09] squishy-press"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/[0.12]">
        <span className="material-symbols-outlined icon-filled text-[24px] leading-none text-brand">calendar_month</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[15px] font-bold leading-tight text-brand">{title}</p>
        <p className="mt-0.5 truncate font-body text-[12px] font-medium leading-tight text-on-surface/55">{subtitle}</p>
      </div>
      <span className="material-symbols-outlined shrink-0 text-[20px] leading-none text-on-surface/30 transition-transform group-hover:translate-x-0.5">
        chevron_right
      </span>
    </Link>
  );
}

const SLIDES = [TodayCard, TermCard];

export default function HomeCarousel() {
  const [i, setI] = useState(0);

  // Auto-advance every 5s; each change re-arms the timer so manual taps reset it too.
  useEffect(() => {
    const id = setTimeout(() => setI((p) => (p + 1) % SLIDES.length), 5000);
    return () => clearTimeout(id);
  }, [i]);

  return (
    <section className="mt-4">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {SLIDES.map((Slide, idx) => (
            <div key={idx} className="w-full shrink-0">
              <Slide />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-brand" : "w-1.5 bg-outline-variant"}`}
          />
        ))}
      </div>
    </section>
  );
}
