export const MATERIAL_TYPES = [
  "Lecture Note",
  "Past Question",
  "Slides",
  "Textbook",
  "Assignment",
  "Other",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];

// ---------------------------------------------------------------------------
// Course library (the `course_materials` table). Helpers below are DB-agnostic
// and safe to import from both the API route (server) and the client.
// ---------------------------------------------------------------------------

/**
 * Canonical match key for a course code, tolerant of the semester suffix and spacing.
 * A student's course reads "GES 103.1"; the library stores "GES 103" — both collapse to
 * "GES103" so they match. The rule: drop a trailing ".<n>" semester marker, then strip
 * every non-alphanumeric character and upper-case what's left.
 *
 * IMPORTANT: the SQL side in /api/materials normalizes course_code the *same* way, so if
 * you change this you must change that regex too, or matches will silently drop.
 */
export function materialCodeKey(code: string): string {
  return code
    .toUpperCase()
    .replace(/\.\d+$/, "") // GES 103.1 -> GES 103
    .replace(/[^A-Z0-9]/g, ""); // GES 103 -> GES103
}

export interface MaterialItem {
  id: string;
  slug: string;
  title: string;
  courseCode: string; // as stored, e.g. "GES 103"
  type: string; // material_type
  typeLabel: string | null; // source_type_label
  format: string; // upper-cased extension, e.g. "PDF"
  size: string | null; // size_human
  pages: number | null; // page_count
  url: string; // public file_url (R2)
}

// Presentation for each material_type. Icon names live here (a scanned root), so the
// icon-font build picks them up — keep them to real Material Symbols ligatures.
export const MATERIAL_TYPE_META: Record<string, { label: string; icon: string; wrap: string }> = {
  past_question: { label: "Past Questions", icon: "quiz", wrap: "bg-violet-100 text-violet-700" },
  note: { label: "Lecture Notes", icon: "edit_note", wrap: "bg-amber-100 text-amber-600" },
  material: { label: "Materials", icon: "description", wrap: "bg-primary/10 text-primary" },
  textbook: { label: "Textbooks", icon: "menu_book", wrap: "bg-emerald-100 text-emerald-600" },
  practical: { label: "Practicals", icon: "science", wrap: "bg-cyan-100 text-cyan-600" },
  course_outline: {
    label: "Course Outline",
    icon: "format_list_bulleted",
    wrap: "bg-blue-100 text-blue-600",
  },
  solution: { label: "Solutions", icon: "task_alt", wrap: "bg-green-100 text-green-600" },
  workbook: { label: "Workbooks", icon: "auto_stories", wrap: "bg-orange-100 text-orange-600" },
  assignment: { label: "Assignments", icon: "assignment", wrap: "bg-rose-100 text-rose-600" },
  formula_sheet: {
    label: "Formula Sheets",
    icon: "calculate",
    wrap: "bg-fuchsia-100 text-fuchsia-600",
  },
};

export const DEFAULT_TYPE_META = {
  label: "Other",
  icon: "draft",
  wrap: "bg-surface-container text-on-surface-variant",
};

export function typeMeta(type: string) {
  return MATERIAL_TYPE_META[type] ?? DEFAULT_TYPE_META;
}

// The order material groups are shown in — most exam-relevant first.
export const MATERIAL_TYPE_ORDER = [
  "past_question",
  "note",
  "material",
  "textbook",
  "practical",
  "workbook",
  "solution",
  "course_outline",
  "assignment",
  "formula_sheet",
];

/** Group materials by type, in MATERIAL_TYPE_ORDER; unknown types appended alphabetically. */
export function groupByType(items: MaterialItem[]): { type: string; items: MaterialItem[] }[] {
  const byType = new Map<string, MaterialItem[]>();
  for (const m of items) {
    const list = byType.get(m.type) ?? [];
    list.push(m);
    byType.set(m.type, list);
  }
  const known = MATERIAL_TYPE_ORDER.filter((t) => byType.has(t));
  const unknown = Array.from(byType.keys())
    .filter((t) => !MATERIAL_TYPE_ORDER.includes(t))
    .sort();
  return [...known, ...unknown].map((type) => ({ type, items: byType.get(type)! }));
}
