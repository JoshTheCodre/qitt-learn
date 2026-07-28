"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";
import VenueInput from "@/components/VenueInput";
import {
  DAYS,
  DAY_SHORT,
  DAY_FULL,
  compactTime,
  getFreeSlots,
  fmtMins,
  todayDay,
  type Day,
  type TimetableEntry,
} from "@/lib/timetable";
import {
  addTimetableEntry,
  getKnownVenues,
  getUserTimetable,
  makeEntryId,
  removeTimetableEntry,
} from "@/lib/user-timetable";
import { getUserCourses } from "@/lib/store";
import { formatCourseCode } from "@/lib/courses";
import { haptic } from "@/lib/haptics";

function fmtUpdated(d: Date): string {
  return (
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) +
    " · " +
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  );
}

// One class block in the add form — a course with its own day, time and venue.
type Slot = {
  id: string;
  day: Day;
  code: string;
  title: string;
  start: string;
  end: string;
  venue: string;
};
const makeSlot = (day: Day = DAYS[0]): Slot => ({
  id: makeEntryId(),
  day,
  code: "",
  title: "",
  start: "08:00",
  end: "10:00",
  venue: "",
});
const slotValid = (s: Slot) => s.code.trim() !== "" && s.start !== "" && s.end !== "" && s.start < s.end;

export default function TimetablePage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Day>(todayDay());
  const [showFreeTime, setShowFreeTime] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // The user's own timetable, loaded from storage.
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [courses, setCourses] = useState<{ code: string; title: string }[]>([]);
  const [venues, setVenues] = useState<string[]>([]);

  // Add-class form — grouped by day. `activeDay` is the tab you're editing.
  const [showAdd, setShowAdd] = useState(false);
  const [activeDay, setActiveDay] = useState<Day>(todayDay());
  const [slots, setSlots] = useState<Slot[]>(() => [makeSlot()]);
  const [pendingDelete, setPendingDelete] = useState<TimetableEntry | null>(null);

  useEffect(() => {
    setUpdatedAt(new Date());
    setEntries(getUserTimetable());
    setCourses(getUserCourses().map((c) => ({ code: c.code, title: c.title })));
    setVenues(getKnownVenues());
  }, []);

  const dayEntries = entries
    .filter((e) => e.day === selectedDay)
    .sort((a, b) => a.start.localeCompare(b.start));
  const freeSlots = getFreeSlots(dayEntries);

  const canSave = slots.some(slotValid);
  const daySlots = slots.filter((s) => s.day === activeDay);

  function openAdd() {
    haptic("tap");
    setActiveDay(selectedDay);
    setSlots([makeSlot(selectedDay)]);
    setShowAdd(true);
  }

  function updateSlot(id: string, patch: Partial<Slot>) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function addSlot() {
    setSlots((prev) => [...prev, makeSlot(activeDay)]);
  }
  function removeSlot(id: string) {
    setSlots((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }

  function saveEntry() {
    const valid = slots.filter(slotValid);
    if (!valid.length) return;
    let next = entries;
    for (const s of valid) {
      next = addTimetableEntry({
        id: makeEntryId(),
        day: s.day,
        start: s.start,
        end: s.end,
        location: s.venue.trim() || null,
        code: formatCourseCode(s.code.trim()),
        title: s.title.trim(),
      });
    }
    setEntries(next);
    setVenues(getKnownVenues());
    setSelectedDay(valid[0].day);
    setShowAdd(false);
    haptic("success");
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    setEntries(removeTimetableEntry(pendingDelete.id));
    setPendingDelete(null);
  }

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
          <button
            type="button"
            aria-label="Add class"
            onClick={openAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white squishy-press"
          >
            <span className="material-symbols-outlined text-[18px] leading-none">add</span>
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
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <span className="material-symbols-outlined text-[40px] text-outline-variant">
              event_busy
            </span>
            <p className="font-display text-[13px] font-medium text-on-surface-variant">
              No classes on {DAY_FULL[selectedDay]}
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-2 rounded-full bg-primary px-5 py-2.5 font-display text-[13px] font-bold text-white squishy-press"
            >
              + Add a class
            </button>
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
                <div className="ml-3 flex shrink-0 flex-col items-end gap-2">
                  {e.location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 font-display text-[11px] font-medium text-primary">
                      <span className="material-symbols-outlined text-[12px] leading-none">
                        location_on
                      </span>
                      {e.location}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label="Delete class"
                    onClick={() => setPendingDelete(e)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error squishy-press"
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                  </button>
                </div>
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

      {/* Add class */}
      {showAdd && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-surface-container-lowest p-5 sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[18px] font-bold text-on-surface">Add a class</h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowAdd(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant squishy-press"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Day tabs — pick a day, then add its classes below */}
              <div className="flex gap-1">
                {DAYS.map((d) => {
                  const count = slots.filter((s) => s.day === d && slotValid(s)).length;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setActiveDay(d)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2 font-display text-[11px] font-semibold transition-colors ${
                        activeDay === d ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {DAY_SHORT[d]}
                      {count > 0 && (
                        <span
                          className={`rounded-full px-1 text-[9px] font-bold leading-tight ${
                            activeDay === d ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {daySlots.length === 0 && (
                <p className="py-1 text-center font-body text-[13px] font-medium text-on-surface-variant">
                  No classes for {DAY_FULL[activeDay]} yet — add one below.
                </p>
              )}

              {/* Classes for the active day */}
              {daySlots.map((s, idx) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-outline-variant/40 bg-surface-container/40 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                      Class {idx + 1}
                    </p>
                    {slots.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remove class"
                        onClick={() => removeSlot(s.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error squishy-press"
                      >
                        <span className="material-symbols-outlined text-[16px] leading-none">close</span>
                      </button>
                    )}
                  </div>

                  {/* Course + Venue in one row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                        Course
                      </label>
                      {courses.length > 0 ? (
                        <select
                          value={s.code}
                          onChange={(e) =>
                            updateSlot(s.id, {
                              code: e.target.value,
                              title: courses.find((c) => c.code === e.target.value)?.title ?? "",
                            })
                          }
                          className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-primary focus:outline-none"
                        >
                          <option value="">Select</option>
                          {courses.map((c) => (
                            <option key={c.code} value={c.code}>
                              {formatCourseCode(c.code)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={s.code}
                          onChange={(e) => updateSlot(s.id, { code: e.target.value.toUpperCase() })}
                          placeholder="e.g. CSC 202.2"
                          className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-primary focus:outline-none"
                        />
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                        Venue
                      </label>
                      <VenueInput
                        value={s.venue}
                        onChange={(v) => updateSlot(s.id, { venue: v })}
                        suggestions={venues}
                      />
                    </div>
                  </div>

                  {/* Start | End */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                        Start
                      </label>
                      <input
                        type="time"
                        value={s.start}
                        onChange={(e) => updateSlot(s.id, { start: e.target.value })}
                        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                        End
                      </label>
                      <input
                        type="time"
                        value={s.end}
                        onChange={(e) => updateSlot(s.id, { end: e.target.value })}
                        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2.5 font-body text-[14px] text-on-surface focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  {s.start >= s.end && (
                    <p className="font-body text-[11px] font-medium text-error">
                      End time must be after the start time.
                    </p>
                  )}
                </div>
              ))}

              {/* Add a class to the active day */}
              <button
                type="button"
                onClick={addSlot}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-outline-variant/60 py-3 font-display text-sm font-semibold text-primary squishy-press"
              >
                <span className="material-symbols-outlined text-[18px] leading-none">add</span>
                Add class to {DAY_FULL[activeDay]}
              </button>

              <button
                type="button"
                onClick={saveEntry}
                disabled={!canSave}
                className="mt-1 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-white transition-opacity disabled:opacity-40 squishy-press"
              >
                {slots.filter(slotValid).length > 1
                  ? `Add ${slots.filter(slotValid).length} classes`
                  : "Add class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {pendingDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-[320px] rounded-2xl bg-surface-container-lowest p-5 text-center shadow-2xl">
            <h3 className="font-display text-[17px] font-bold text-on-surface">Delete class?</h3>
            <p className="mt-1.5 font-body text-[13px] leading-snug text-on-surface/60">
              Remove {formatCourseCode(pendingDelete.code)} on {DAY_FULL[pendingDelete.day]} from your
              timetable?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="flex-1 rounded-xl bg-surface-container py-3 font-display text-sm font-semibold text-on-surface squishy-press"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-rose-600 py-3 font-display text-sm font-bold text-white squishy-press"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
