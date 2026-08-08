// Hands an AI-generated quiz (from a student's own material) to the quiz screen without
// putting it in the URL. Held in sessionStorage so it survives the navigation to
// /study/quiz but is scoped to the tab and cleared once consumed.

export interface GeneratedQuizQuestion {
  id: number;
  q: string;
  options: string[];
  answer: number;
}

export interface GeneratedQuiz {
  title: string;
  questions: GeneratedQuizQuestion[];
}

const KEY = "generatedQuiz";

export function setGeneratedQuiz(quiz: GeneratedQuiz) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY, JSON.stringify(quiz));
}

export function getGeneratedQuiz(): GeneratedQuiz | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GeneratedQuiz) : null;
  } catch {
    return null;
  }
}

export function clearGeneratedQuiz() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}
