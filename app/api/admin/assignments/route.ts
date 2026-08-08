import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { query, CLASS_ASSIGNMENTS_TABLE } from "@/lib/db";
import { extractAssignment, hasOpenRouter } from "@/lib/openrouter";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // extraction calls a free model

function guard() {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set — add it to .env.local." },
      { status: 500 },
    );
  }
  if (!isAdmin()) return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  return null;
}

interface Row {
  id: string;
  status: string;
  title: string;
  course_code: string | null;
  due_at: string | Date | null;
  due_text_raw: string | null;
  description: string | null;
  posted_by: string | null;
  source_sender: string | null;
  source_text: string | null;
  source_ts: string | Date | null;
  confidence: number | null;
  created_at: string | Date;
  published_at: string | Date | null;
}

const iso = (v: string | Date | null) => (v ? new Date(v).toISOString() : null);

function mapRow(r: Row) {
  return {
    id: String(r.id),
    status: r.status,
    title: r.title,
    course: r.course_code,
    dueAt: iso(r.due_at),
    dueTextRaw: r.due_text_raw,
    description: r.description,
    postedBy: r.posted_by,
    confidence: r.confidence,
    createdAt: iso(r.created_at),
    postedAt: iso(r.published_at),
    sourceMessage: r.source_text
      ? { sender: r.source_sender ?? "Unknown", text: r.source_text, timestamp: iso(r.source_ts) }
      : null,
  };
}

const COLS =
  "id, status, title, course_code, due_at, due_text_raw, description, posted_by, source_sender, source_text, source_ts, confidence, created_at, published_at";

export async function GET() {
  const denied = guard();
  if (denied) return denied;
  try {
    const r = await query<Row>(
      `SELECT ${COLS} FROM ${CLASS_ASSIGNMENTS_TABLE} ORDER BY created_at DESC`,
    );
    const all = r.rows.map(mapRow);
    return NextResponse.json({
      ok: true,
      drafts: all.filter((a) => a.status === "draft"),
      published: all.filter((a) => a.status === "published"),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load" },
      { status: 500 },
    );
  }
}

// Ingest a group message → AI extracts a draft for review.
export async function POST(req: Request) {
  const denied = guard();
  if (denied) return denied;
  if (!hasOpenRouter()) {
    return NextResponse.json({ ok: false, error: "Extraction isn't available right now." }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    message?: { sender?: string; text?: string; ts?: string };
  };
  const msg = body.message || {};
  const text = String(msg.text || "").trim();
  if (!text) return NextResponse.json({ ok: false, error: "Message text is required" }, { status: 400 });

  try {
    const ex = await extractAssignment(text, new Date().toISOString());
    const sourceTs = msg.ts && !Number.isNaN(new Date(msg.ts).getTime()) ? new Date(msg.ts).toISOString() : new Date().toISOString();
    const r = await query<Row>(
      `INSERT INTO ${CLASS_ASSIGNMENTS_TABLE}
         (status, title, course_code, due_at, due_text_raw, description, source_sender, source_text, source_ts, confidence)
       VALUES ('draft', $1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING ${COLS}`,
      [ex.title, ex.course, ex.dueAt, ex.dueTextRaw, ex.description, msg.sender || null, text, sourceTs, ex.confidence],
    );
    return NextResponse.json({ ok: true, draft: mapRow(r.rows[0]) });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Extraction failed" },
      { status: 500 },
    );
  }
}

// Publish a draft (with the admin's edits) or edit a published one.
export async function PATCH(req: Request) {
  const denied = guard();
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    title?: string;
    course?: string | null;
    dueAt?: string | null;
    description?: string | null;
    postedBy?: string | null;
  };
  if (!body.id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ ok: false, error: "A title is required" }, { status: 400 });
  const dueAt = body.dueAt && !Number.isNaN(new Date(body.dueAt).getTime()) ? new Date(body.dueAt).toISOString() : null;

  try {
    const r = await query(
      `UPDATE ${CLASS_ASSIGNMENTS_TABLE}
          SET title = $1, course_code = $2, due_at = $3, description = $4, posted_by = $5,
              status = 'published', published_at = COALESCE(published_at, now())
        WHERE id = $6`,
      [
        title.slice(0, 200),
        body.course ? String(body.course).trim().slice(0, 40) : null,
        dueAt,
        body.description ? String(body.description).trim().slice(0, 300) : null,
        body.postedBy ? String(body.postedBy).trim().slice(0, 80) : null,
        body.id,
      ],
    );
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Publish failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const denied = guard();
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  try {
    await query(`DELETE FROM ${CLASS_ASSIGNMENTS_TABLE} WHERE id = $1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 },
    );
  }
}
