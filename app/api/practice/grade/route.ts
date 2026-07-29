import { NextResponse } from "next/server";
import { gradeAnswers, hasOpenRouter, type GradeInput } from "@/lib/openrouter";
import { type TheoryGrade } from "@/lib/practice";

export const dynamic = "force-dynamic";
// Free models can be slow; give the function room beyond the default.
export const maxDuration = 60;

// POST /api/practice/grade
// body: { items: [{ id, question, modelAnswer, studentAnswer }] }
// → { ok, graded, grades: TheoryGrade[] }
//   graded=false means grading was unavailable/failed — the client self-marks instead.
export async function POST(req: Request) {
  let body: { items?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const raw = Array.isArray(body.items) ? body.items : [];
  const items: GradeInput[] = raw
    .slice(0, 12) // one modest batch keeps a free call fast and within rate limits
    .map((it) => {
      const o = (it || {}) as Record<string, unknown>;
      return {
        id: Number(o.id),
        question: String(o.question || ""),
        modelAnswer: String(o.modelAnswer || ""),
        studentAnswer: String(o.studentAnswer || "").trim(),
      };
    });

  // Blanks are wrong without spending a token; only real attempts go to the model.
  const blanks: TheoryGrade[] = items
    .filter((it) => it.studentAnswer.length === 0)
    .map((it) => ({ id: it.id, verdict: "incorrect", score: 0, feedback: "No answer provided." }));
  const answered = items.filter((it) => it.studentAnswer.length > 0);

  if (!hasOpenRouter()) {
    // No key configured → tell the client to fall back to self-marking.
    return NextResponse.json({ ok: true, graded: false, grades: [] });
  }

  try {
    const graded = await gradeAnswers(answered);
    return NextResponse.json({ ok: true, graded: true, grades: [...graded, ...blanks] });
  } catch (err) {
    return NextResponse.json({
      ok: true,
      graded: false,
      grades: [],
      error: err instanceof Error ? err.message : "Grading failed",
    });
  }
}
