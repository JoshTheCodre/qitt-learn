import {
  ACADEMIC_CALENDAR,
  dateLabel,
  dayKey,
  eventStatus,
  formatDayShort,
  startKey,
  type CalendarEvent,
  type EventStatus,
} from "@/lib/academic-calendar";

function EventCard({ e, status }: { e: CalendarEvent; status: EventStatus }) {
  const isNow = status === "now";
  const isPast = status === "past";

  return (
    <article
      className={`rounded-2xl border p-4 ${
        isNow
          ? "border-brand/40 bg-brand/[0.05]"
          : "border-outline-variant/40 bg-surface-container-lowest"
      } ${isPast ? "opacity-55" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                isNow ? "bg-brand" : isPast ? "bg-on-surface/25" : "bg-emerald-500"
              }`}
            />
            <p
              className={`font-body text-[11px] font-bold uppercase tracking-[0.08em] ${
                isNow ? "text-brand" : "text-on-surface-variant"
              }`}
            >
              {dateLabel(e)}
            </p>
          </div>
          <p className="mt-1.5 font-display text-[14px] font-semibold leading-snug text-on-surface">
            {e.event}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {isNow && (
            <span className="rounded-full bg-brand px-2 py-0.5 font-display text-[9px] font-bold uppercase tracking-wide text-white">
              Now
            </span>
          )}
          {e.duration && (
            <span className="rounded-md bg-surface-container px-1.5 py-0.5 font-body text-[10px] font-semibold text-on-surface-variant">
              {e.duration}
            </span>
          )}
        </div>
      </div>

      {e.milestones?.length ? (
        <ul className="mt-3 space-y-2 border-l-2 border-outline-variant/40 pl-3">
          {e.milestones.map((m) => (
            <li key={m.id} className="flex gap-2.5">
              <span className="w-[52px] shrink-0 font-body text-[11px] font-semibold text-on-surface-variant">
                {formatDayShort(m.date)}
              </span>
              <span className="flex-1 font-body text-[12px] leading-snug text-on-surface/75">
                {m.event}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function AcademicCalendar() {
  // Real wall-clock: highlights whichever event is running today and dims what's past.
  const nowKey = dayKey(new Date());

  return (
    <div className="space-y-6">
      {ACADEMIC_CALENDAR.academic_sessions.map((sem) => {
        const events = [...sem.events].sort((a, b) => startKey(a) - startKey(b));
        return (
          <section key={sem.semester}>
            <h4 className="mb-2.5 font-display text-[12px] font-bold uppercase tracking-[0.1em] text-on-surface/50">
              {sem.semester}
            </h4>
            <div className="space-y-2.5">
              {events.map((e) => (
                <EventCard key={e.id} e={e} status={eventStatus(e, nowKey)} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
