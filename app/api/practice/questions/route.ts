import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { materialCodeKey } from "@/lib/materials";
import type { PracticeQuestion, PracticeTheoryQuestion } from "@/lib/practice";

export const dynamic = "force-dynamic";

interface ObjectiveRow {
  id: number;
  question: string;
  options: unknown;
  answer_indices: unknown;
  session: string | null;
  explanation_text: string | null;
}

interface TheoryRow {
  id: number;
  question: string;
  answer_text: string | null;
  explanation_text: string | null;
  session: string | null;
  q_type_norm: string | null;
}

// GET /api/practice/questions?code=GES 103.1&count=20&kind=objective|theory
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const kind = url.searchParams.get("kind") === "theory" ? "theory" : "objective";
  const count = Math.min(Math.max(Number(url.searchParams.get("count")) || 10, 1), 50);
  const key = materialCodeKey(code);

  if (!key) {
    return NextResponse.json({ ok: true, code, key, kind, count: 0, questions: [] });
  }

  try {
    if (kind === "theory") {
      // Open-ended questions with a model answer to grade/compare against. Drawing and
      // unknown types are excluded — they can't be graded from text.
      const r = await query<TheoryRow>(
        `SELECT id, question, answer_text, explanation_text, session, q_type_norm
           FROM qitt_learn_practice_questions
          WHERE match_key = $1
            AND q_type_norm IN ('subjective', 'theory')
            AND question IS NOT NULL AND question <> ''
            AND answer_text IS NOT NULL AND answer_text <> ''
          ORDER BY random()
          LIMIT $2`,
        [key, count],
      );
      const questions: PracticeTheoryQuestion[] = r.rows.map((row) => ({
        id: row.id,
        q: row.question,
        answerText: row.answer_text,
        explanation: row.explanation_text,
        session: row.session,
        qType: row.q_type_norm || "theory",
      }));
      return NextResponse.json({ ok: true, code, key, kind, count: questions.length, questions });
    }

    // Objective (auto-gradable single-answer MCQs). Over-fetch, then keep only rows whose
    // answer index is valid and in range.
    const limit = Math.min(count * 2, 120);
    const r = await query<ObjectiveRow>(
      `SELECT id, question, options, answer_indices, session, explanation_text
         FROM qitt_learn_practice_questions
        WHERE match_key = $1
          AND gradable = true
          AND multi = false
          AND n_options >= 2
        ORDER BY random()
        LIMIT $2`,
      [key, limit],
    );

    const questions: PracticeQuestion[] = [];
    for (const row of r.rows) {
      const options = Array.isArray(row.options) ? (row.options as string[]) : [];
      const indices = Array.isArray(row.answer_indices) ? (row.answer_indices as number[]) : [];
      const answer = indices[0];
      if (options.length < 2 || answer == null || answer < 0 || answer >= options.length) continue;
      questions.push({
        id: row.id,
        q: row.question,
        options,
        answer,
        session: row.session,
        explanation: row.explanation_text,
      });
      if (questions.length >= count) break;
    }

    return NextResponse.json({ ok: true, code, key, kind, count: questions.length, questions });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}
