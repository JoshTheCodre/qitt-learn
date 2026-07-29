import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { materialCodeKey } from "@/lib/materials";
import type { PracticeAvailability } from "@/lib/practice";

export const dynamic = "force-dynamic";

interface Row {
  match_key: string;
  q: number; // total questions
  s: number; // sessions
  gradable: number; // serveable objective MCQs
  theory: number; // subjective/theory questions
}

// GET /api/practice?codes=GES 103.1,PHY 112.2 — which of these courses have practice.
// Returns one availability entry per input code (deduped by normalized key server-side).
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("codes") || "";
  const codes = raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  if (codes.length === 0) {
    return NextResponse.json({ ok: true, items: [] });
  }

  // Map each unique key back to the (possibly several) student codes that produced it.
  const keys = Array.from(new Set(codes.map(materialCodeKey))).filter(Boolean);

  try {
    // gradable/theory counted from the questions table with the SAME filters the quiz
    // uses, so the numbers shown match what a session can actually draw.
    const r = await query<Row>(
      `SELECT c.match_key,
              COALESCE(SUM(c.n_questions), 0)::int AS q,
              COALESCE(SUM(c.n_sessions), 0)::int  AS s,
              COALESCE(qc.gradable, 0)::int        AS gradable,
              COALESCE(qc.theory, 0)::int          AS theory
         FROM qitt_learn_practice_courses c
         LEFT JOIN (
           SELECT match_key,
                  count(*) FILTER (WHERE gradable AND NOT multi AND n_options >= 2) AS gradable,
                  count(*) FILTER (WHERE q_type_norm IN ('subjective','theory')
                                    AND answer_text IS NOT NULL AND answer_text <> '') AS theory
             FROM qitt_learn_practice_questions
            WHERE match_key = ANY($1)
            GROUP BY match_key
         ) qc ON qc.match_key = c.match_key
        WHERE c.match_key = ANY($1)
        GROUP BY c.match_key, qc.gradable, qc.theory`,
      [keys],
    );
    const byKey = new Map(r.rows.map((row) => [row.match_key, row]));

    const items: PracticeAvailability[] = codes.map((code) => {
      const key = materialCodeKey(code);
      const row = byKey.get(key);
      return {
        code,
        key,
        available: !!row && (row.gradable > 0 || row.theory > 0),
        questions: row?.q ?? 0,
        gradable: row?.gradable ?? 0,
        theory: row?.theory ?? 0,
        sessions: row?.s ?? 0,
      };
    });

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}
