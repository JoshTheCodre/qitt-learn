"use client";

import { useRef } from "react";
import Link from "next/link";

type ClassItem = {
  code: string;
  kind: string;
  location: string;
  time: string;
};

const CLASSES: ClassItem[] = [
  {
    code: "CSC240.2",
    kind: "Lecture",
    location: "MBA 2",
    time: "2:00 - 3:00pm",
  },
  {
    code: "MTH101.1",
    kind: "Lecture",
    location: "Hall A",
    time: "4:00 - 5:00pm",
  },
];

export default function TodaysClasses() {
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    drag.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
    };
  };

  const stop = () => {
    drag.current.isDown = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el || !drag.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - drag.current.startX) * 2;
    el.scrollLeft = drag.current.scrollLeft - walk;
  };

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-[18px] sm:text-[20px] md:text-[24px] font-bold text-on-surface">
          Today&apos;s Classes
        </h3>
        <Link className="text-primary font-display text-sm font-medium hover:underline" href="/timetable">
          See all
        </Link>
      </div>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={stop}
        onMouseUp={stop}
        onMouseMove={onMouseMove}
        className="flex overflow-x-auto pb-2 gap-4 no-scrollbar -mx-gutter px-gutter scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {CLASSES.map((c) => (
          <div
            key={c.code}
            className="min-w-[190px] sm:min-w-[210px] md:min-w-[240px] bg-white rounded-[20px] p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-outline-variant/30 flex flex-col gap-2.5 bento-card-hover group"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[18px] font-bold text-primary group-hover:text-primary-container transition-colors">
                {c.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-display text-[11px] font-semibold bg-primary/5 text-primary">
                {c.kind}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary/60">
                  location_on
                </span>
                <span className="font-display text-xs font-medium">{c.location}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary/60">
                  schedule
                </span>
                <span className="font-display text-xs font-medium">{c.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
