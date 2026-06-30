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
