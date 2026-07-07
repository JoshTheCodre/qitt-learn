import type { Course } from "./courses";

export interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  format: "PDF" | "PPT" | "DOCX";
}

const FORMAT_ICON: Record<Material["format"], { icon: string; wrap: string }> = {
  PDF: { icon: "picture_as_pdf", wrap: "bg-rose-100 text-rose-600" },
  PPT: { icon: "slideshow", wrap: "bg-amber-100 text-amber-600" },
  DOCX: { icon: "description", wrap: "bg-primary/10 text-primary" },
};

export function formatStyle(format: Material["format"]) {
  return FORMAT_ICON[format];
}

export function getMaterials(course: Course): Material[] {
  return [
    { id: "1", title: `${course.code} Lecture Note 1`, type: "Lecture Note", size: "2.4 MB", format: "PDF" },
    { id: "2", title: `${course.code} Lecture Note 2`, type: "Lecture Note", size: "1.8 MB", format: "PDF" },
    { id: "3", title: `${course.code} Week 1 Slides`, type: "Slides", size: "5.1 MB", format: "PPT" },
    { id: "4", title: `${course.code} 2023 Past Questions`, type: "Past Question", size: "900 KB", format: "PDF" },
    { id: "5", title: `${course.code} Tutorial Sheet`, type: "Assignment", size: "320 KB", format: "DOCX" },
  ];
}

export interface LectureNote {
  id: string;
  title: string;
  week: string;
  size: string;
}

export function getLectureNotes(course: Course): LectureNote[] {
  return [
    { id: "1", title: `${course.code} — Introduction`, week: "Week 1", size: "1.2 MB" },
    { id: "2", title: `${course.code} — Foundations`, week: "Week 2", size: "0.9 MB" },
    { id: "3", title: `${course.code} — Core Concepts`, week: "Week 3", size: "1.6 MB" },
    { id: "4", title: `${course.code} — Applications`, week: "Week 5", size: "1.1 MB" },
  ];
}

export interface Recording {
  id: string;
  title: string;
  duration: string;
  date: string;
}

export function getRecordings(course: Course): Recording[] {
  return [
    { id: "1", title: `${course.code} — Lecture 1`, duration: "48 min", date: "Mon, Jul 7" },
    { id: "2", title: `${course.code} — Lecture 2`, duration: "52 min", date: "Fri, Jul 11" },
    { id: "3", title: `${course.code} — Tutorial`, duration: "31 min", date: "Mon, Jul 14" },
  ];
}

export interface OutlineWeek {
  week: number;
  topic: string;
}

export function getOutline(course: Course): OutlineWeek[] {
  return [
    { week: 1, topic: `Introduction to ${course.title}` },
    { week: 2, topic: "Foundations and Key Terms" },
    { week: 3, topic: "Core Concepts I" },
    { week: 4, topic: "Core Concepts II" },
    { week: 5, topic: "Practical Applications" },
    { week: 6, topic: "Advanced Topics" },
    { week: 7, topic: "Case Studies and Review" },
    { week: 8, topic: "Revision and Exam Prep" },
  ];
}
