// The official Uniport academic calendar, transcribed from the school's published sheet.
// Rendered natively on /calendar (see components/calendar/AcademicCalendar) alongside a
// link to the original image.

export interface CalendarMilestone {
  id: string;
  date: string; // ISO yyyy-mm-dd
  event: string;
}

export interface CalendarEvent {
  id: string;
  event: string;
  date?: string; // single ISO day
  start_date?: string; // ISO range start
  end_date?: string; // ISO range end
  start_month?: string; // e.g. "May 2026" (day unknown)
  end_month?: string;
  duration?: string; // e.g. "13 weeks"
  milestones?: CalendarMilestone[];
}

export interface CalendarSemester {
  semester: string;
  session: string;
  events: CalendarEvent[];
}

export const ACADEMIC_CALENDAR: {
  institution: string;
  title: string;
  academic_sessions: CalendarSemester[];
} = {
  institution: "University of Port Harcourt",
  title:
    "Proposed Revised Academic Calendar for the 2024/2025 and 2025/2026 Academic Session Fulltime Programme and Sandwich Programme",
  academic_sessions: [
    {
      semester: "First Semester",
      session: "2024/2025 and 2025/2026",
      events: [
        {
          id: "0.0",
          start_date: "2026-05-04",
          end_date: "2026-05-15",
          duration: "2 weeks",
          event: "First Semester Break",
        },
        {
          id: "1.0",
          date: "2026-05-27",
          event:
            "Extra-Ordinary Meeting of Senate to consider First Semester 2025/2026 Session Results",
        },
      ],
    },
    {
      semester: "Second Semester",
      session: "2024/2025 and 2025/2026",
      events: [
        {
          id: "2.0",
          start_month: "May 2026",
          end_month: "October 2026",
          event: "Student Industrial Work Scheme (SIWES)",
        },
        {
          id: "3.0",
          date: "2026-05-17",
          event: "All Students Arrive",
        },
        {
          id: "4.0",
          start_date: "2026-05-18",
          end_date: "2026-08-14",
          duration: "13 weeks",
          event: "Teaching Period",
          milestones: [
            { id: "i", date: "2026-05-18", event: "Lecture Begins for all Students" },
            {
              id: "ii",
              date: "2026-06-19",
              event: "Deadline for Payment of Second Installment Charges",
            },
            {
              id: "iii",
              date: "2026-06-26",
              event: "End of Registration for Second Installment Payment",
            },
            {
              id: "iv",
              date: "2026-08-16",
              event: "Submission of Continuous Assessment Scores to Academic Office",
            },
            { id: "v", date: "2026-08-14", event: "End of Lectures" },
          ],
        },
        {
          id: "5.0",
          start_date: "2026-08-17",
          end_date: "2026-08-22",
          duration: "1 week",
          event: "SUG Week",
        },
        {
          id: "6.0",
          start_date: "2026-08-24",
          end_date: "2026-08-28",
          duration: "1 week",
          event: "Revision",
        },
        {
          id: "7.0",
          start_date: "2026-08-31",
          end_date: "2026-09-25",
          duration: "4 weeks",
          event: "Second Semester Examinations",
        },
        {
          id: "8.0",
          start_date: "2026-09-28",
          end_date: "2026-10-30",
          duration: "5 weeks",
          event: "Long Vacation for all Students",
        },
        {
          id: "9.0",
          date: "2026-11-04",
          event:
            "Extra-Ordinary Meeting of Senate to consider Second Semester 2025/2026 Session Results",
        },
      ],
    },
  ],
};

const SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

// A yyyymmdd integer — sortable and directly comparable, no Date objects needed.
function keyISO(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return y * 10000 + m * 100 + d;
}

function monthParts(s: string): { m: number; y: number } {
  const [name, yr] = s.trim().split(/\s+/);
  return { m: MONTHS.indexOf(name.toLowerCase()) + 1, y: Number(yr) };
}

/** The event's first day, as a yyyymmdd sort key. */
export function startKey(e: CalendarEvent): number {
  if (e.start_date) return keyISO(e.start_date);
  if (e.date) return keyISO(e.date);
  if (e.start_month) {
    const { m, y } = monthParts(e.start_month);
    return y * 10000 + m * 100 + 1;
  }
  return 0;
}

function endKey(e: CalendarEvent): number {
  if (e.end_date) return keyISO(e.end_date);
  if (e.date) return keyISO(e.date);
  if (e.end_month) {
    const { m, y } = monthParts(e.end_month);
    return y * 10000 + m * 100 + 31;
  }
  return startKey(e);
}

export type EventStatus = "past" | "now" | "upcoming";

export function eventStatus(e: CalendarEvent, nowKey: number): EventStatus {
  if (nowKey < startKey(e)) return "upcoming";
  if (nowKey > endKey(e)) return "past";
  return "now";
}

/** yyyymmdd key for a Date — pair with eventStatus. */
export function dayKey(d: Date): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** "18 May 2026" */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${SHORT[m - 1]} ${y}`;
}

/** "18 May" — year dropped, for tight milestone rows. */
export function formatDayShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${SHORT[m - 1]}`;
}

function formatRange(a: string, b: string): string {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  if (ay === by && am === bm) return `${ad}–${bd} ${SHORT[am - 1]} ${ay}`;
  if (ay === by) return `${ad} ${SHORT[am - 1]} – ${bd} ${SHORT[bm - 1]} ${ay}`;
  return `${ad} ${SHORT[am - 1]} ${ay} – ${bd} ${SHORT[bm - 1]} ${by}`;
}

/** The human date label for an event, whichever date shape it has. */
export function dateLabel(e: CalendarEvent): string {
  if (e.start_date && e.end_date) return formatRange(e.start_date, e.end_date);
  if (e.date) return formatDay(e.date);
  if (e.start_month && e.end_month) {
    const [sName, sYr] = e.start_month.split(/\s+/);
    const [eName, eYr] = e.end_month.split(/\s+/);
    return sYr === eYr ? `${sName} – ${eName} ${eYr}` : `${e.start_month} – ${e.end_month}`;
  }
  return "";
}
