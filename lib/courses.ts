export type ClassSession = {
  day: string;
  time: string;
  location: string;
  accent: "primary" | "tertiary";
};

/**
 * Display a course code with a space between the department letters and the number:
 * "FAC202.2" → "FAC 202.2". Codes that are already spaced pass through unchanged.
 */
export function formatCourseCode(code: string): string {
  return code.replace(/^([A-Za-z]+)\s*(\d)/, "$1 $2").trim();
}

export type Course = {
  slug: string;
  code: string;
  units: string;
  title: string;
  schedule: ClassSession[];
};

export const COURSES: Course[] = [
  {
    slug: "csc-202-2",
    code: "CSC 202.2",
    units: "3 units",
    title: "Systems Thinking and Props",
    schedule: [
      { day: "Mon", time: "12:30 - 2:00 PM", location: "NSA Hall 2", accent: "primary" },
      { day: "Fri", time: "12:30 - 2:00 PM", location: "NSA Hall 2", accent: "tertiary" },
    ],
  },
  {
    slug: "csc-204-1",
    code: "CSC 204.1",
    units: "3 units",
    title: "Data Structures and Algorithms",
    schedule: [
      { day: "Tue", time: "10:00 - 12:00 PM", location: "MBA 2", accent: "primary" },
      { day: "Thu", time: "8:00 - 9:00 AM", location: "MBA 2", accent: "tertiary" },
    ],
  },
  {
    slug: "mth-201-1",
    code: "MTH 201.1",
    units: "3 units",
    title: "Linear Algebra",
    schedule: [
      { day: "Wed", time: "9:00 - 11:00 AM", location: "Hall A", accent: "primary" },
    ],
  },
  {
    slug: "csc-206-2",
    code: "CSC 206.2",
    units: "2 units",
    title: "Operating Systems",
    schedule: [
      { day: "Mon", time: "2:00 - 3:00 PM", location: "Lab 1", accent: "primary" },
      { day: "Wed", time: "2:00 - 3:00 PM", location: "Lab 1", accent: "tertiary" },
    ],
  },
  {
    slug: "gst-212-1",
    code: "GST 212.1",
    units: "2 units",
    title: "Philosophy and Logic",
    schedule: [
      { day: "Fri", time: "4:00 - 6:00 PM", location: "Hall C", accent: "primary" },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
