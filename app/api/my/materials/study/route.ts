import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { query, USER_MATERIALS_TABLE } from "@/lib/db";
import { extractMaterialText, UnsupportedMaterialError } from "@/lib/materialText";
import { generateStudyNotes, hasOpenRouter } from "@/lib/openrouter";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST { id } → an easy-read summary of one of the student's own materials.
export async function POST(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  if (!hasOpenRouter()) {
    return NextResponse.json({ ok: false, error: "Summaries aren't available right now." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as { id?: string | number };
  if (body.id == null) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

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

    const notes = await generateStudyNotes(text);
    return NextResponse.json({ ok: true, title, notes });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not create summary" },
      { status: 500 },
    );
  }
}
