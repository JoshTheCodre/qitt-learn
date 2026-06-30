export const MATERIAL_TYPES = [
  "Lecture Note",
  "Past Question",
  "Slides",
  "Textbook",
  "Assignment",
  "Other",
] as const;

export type MaterialType = (typeof MATERIAL_TYPES)[number];
