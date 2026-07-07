"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
import {
  TIMETABLE,
  DAYS,
  DAY_SHORT,
  DAY_FULL,
  compactTime,
  getFreeSlots,
  fmtMins,
  todayDay,
  type Day,
} from "@/lib/timetable";

function fmtUpdated(d: Date): string {
  return (
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) +
    " · " +
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  );
}

export default function TimetablePage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Day>(todayDay());
  const [showFreeTime, setShowFreeTime] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setUpdatedAt(new Date());
  }, []);

  const dayEntries = TIMETABLE.filter((e) => e.day === selectedDay).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  const freeSlots = getFreeSlots(dayEntries);

  async function shareDay() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My Weekly Timetable",
          text: "Check out my class timetable on Academic Pulse.",
        });
      } catch {
        /* user cancelled or unsupported */
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-[430px] min-h-screen bg-background relative md:shadow-[0_0_60px_rgba(0,0,0,0.08)] md:border-x md:border-outline-variant/20">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-gutter pt-5 pb-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => router.push("/")}
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center shrink-0 squishy-press"
        >
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant leading-none">
            arrow_back
          </span>
        </button>
        <h1 className="font-display text-[20px] font-bold text-on-surface">Timetable</h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFreeTime((v) => !v)}
            className={`flex items-center gap-1.5 font-display text-xs font-semibold border rounded-full px-3 py-1.5 transition-all squishy-press ${
              showFreeTime
                ? "bg-amber-500 text-white border-amber-500"
                : "text-on-surface-variant border-outline-variant/50 bg-surface-container-lowest"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] leading-none">schedule</span>
            Free Time
          </button>
          <button
            type="button"
            aria-label="Share timetable"
            onClick={shareDay}
            className="w-8 h-8 flex items-center justify-center border border-outline-variant/50 rounded-full bg-surface-container-lowest squishy-press"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant leading-none">
              share
            </span>
          </button>
        </div>
      </div>

      {/* Last updated */}
      {updatedAt && (
        <div className="px-gutter pb-3">
          <span className="inline-flex items-center gap-1.5 font-display text-[11px] text-on-surface-variant/70 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            Updated {fmtUpdated(updatedAt)}
          </span>
        </div>
      )}

      {/* Day selector */}
      <div className="flex px-gutter mb-4 gap-1">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`flex-1 font-display text-[11px] font-semibold py-2.5 rounded-full transition-colors ${
              selectedDay === day ? "bg-primary text-white" : "text-on-surface-variant"
            }`}
          >
            {DAY_SHORT[day]}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="px-gutter pb-28">
        {dayEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              event_busy
            </span>
            <p className="font-display text-[13px] text-on-surface-variant font-medium">
              No classes on {DAY_FULL[selectedDay]}
            </p>
          </div>
        ) : (
          dayEntries.map((e) => (
            <div key={e.id}>
              <div className="relative bg-surface-container-lowest rounded-xl border border-outline-variant/30 px-4 py-4 pl-5 flex items-start justify-between shadow-sm overflow-hidden mb-3">
                <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-full" />
                <div className="min-w-0">
                  <p className="font-display text-[11px] font-medium text-on-surface-variant mb-0.5">
                    {compactTime(e.start)}–{compactTime(e.end)}
                  </p>
                  <p className="font-display text-[15px] font-bold text-on-surface">{e.code}</p>
                  {e.title && (
                    <p className="font-display text-[13px] font-medium text-on-surface-variant mt-0.5 truncate">
                      {e.title}
                    </p>
                  )}
                </div>
                {e.location && (
                  <span className="inline-flex items-center gap-1 bg-primary/5 text-primary font-display text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ml-3 mt-1">
                    <span className="material-symbols-outlined text-[12px] leading-none">
                      location_on
                    </span>
                    {e.location}
                  </span>
                )}
              </div>

              {showFreeTime &&
                (() => {
                  const gap = freeSlots.find((f) => f.from === e.end);
                  if (!gap) return null;
                  return (
                    <div className="flex items-center gap-2 py-1.5 px-2 mb-3 opacity-60">
                      <div className="flex-1 h-px border-t border-dashed border-outline-variant" />
                      <span className="font-display text-[11px] font-medium text-on-surface-variant whitespace-nowrap flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px] leading-none">
                          schedule
                        </span>
                        {fmtMins(gap.mins)}
                      </span>
                      <div className="flex-1 h-px border-t border-dashed border-outline-variant" />
                    </div>
                  );
                })()}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
