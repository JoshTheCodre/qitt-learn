import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { query, USER_MATERIALS_TABLE } from "@/lib/db";
import { extractMaterialText, UnsupportedMaterialError } from "@/lib/materialText";
import { generateMCQs, hasOpenRouter } from "@/lib/openrouter";

export const dynamic = "force-dynamic";
// Text extraction + a free-model generation call can be slow; give it room.
export const maxDuration = 60;

// POST { id, count? } → generate practice MCQs from one of the student's own materials.
export async function POST(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  if (!hasOpenRouter()) {
    return NextResponse.json(
      { ok: false, error: "Question generation isn't available right now." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { id?: string | number; count?: number };
  if (body.id == null) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  const count = Math.min(Math.max(Number(body.count) || 10, 1), 20);

  try {
    const r = await query<{ title: string; file_url: string; file_ext: string | null }>(
      `SELECT title, file_url, file_ext FROM ${USER_MATERIALS_TABLE} WHERE id = $1 AND email = $2`,
      [String(body.id), email],
    );
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "Material not found" }, { status: 404 });
    const { title, file_url, file_ext } = r.rows[0];

    let text: string;
    try {
      text = await extractMaterialText(file_url, file_ext);
    } catch (e) {
      if (e instanceof UnsupportedMaterialError) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 422 });
      }
      throw e;
    }
    if (!text || text.trim().length < 40) {
      return NextResponse.json(
        { ok: false, error: "We couldn't read enough text from this file (is it a scan or photo?)." },
        { status: 422 },
      );
    }

    const mcqs = await generateMCQs(text, count);
    const questions = mcqs.map((m, i) => ({ id: i + 1, q: m.q, options: m.options, answer: m.answer }));
    return NextResponse.json({ ok: true, title, count: questions.length, questions });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not generate practice" },
      { status: 500 },
    );
  }
}
