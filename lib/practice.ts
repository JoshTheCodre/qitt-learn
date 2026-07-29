// Types shared between the practice API routes and the practice/quiz screens.
// Question data lives in the qitt_learn_practice_* tables (imported from practice.db);
// course codes are matched suffix-tolerantly via materialCodeKey (see lib/materials).

export interface PracticeQuestion {
  id: number;
  q: string;
  options: string[];
  answer: number; // index into options
  session: string | null; // exam year, e.g. "2023/2024"
  explanation: string | null;
}

export interface PracticeTheoryQuestion {
  id: number;
  q: string;
  answerText: string | null; // the model/marking-scheme answer
  explanation: string | null;
  session: string | null;
  qType: string; // subjective | theory
}

export type TheoryVerdict = "correct" | "partial" | "incorrect";

export interface TheoryGrade {
  id: number;
  verdict: TheoryVerdict;
  score: number; // 1 | 0.5 | 0
  feedback: string;
}

// correct = full, partial = half, incorrect = none — shared by grader and UI.
export function verdictScore(v: TheoryVerdict): number {
  return v === "correct" ? 1 : v === "partial" ? 0.5 : 0;
}

export interface PracticeAvailability {
  code: string; // the code as the student holds it, e.g. "GES 103.1"
  key: string; // normalized match key, e.g. "GES103"
  available: boolean; // has at least one auto-gradable MCQ
  questions: number; // total questions on record
  gradable: number; // auto-gradable MCQs (Objective practice draws from these)
  theory: number; // subjective/theory questions (Theory practice draws from these)
  sessions: number; // number of past exam sessions
}
