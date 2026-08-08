import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { query, USER_MATERIALS_TABLE } from "@/lib/db";
import { deleteUserMaterial, userMaterialPrefix } from "@/lib/r2";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  title: string;
  course_code: string | null;
  file_url: string;
  file_ext: string | null;
  size_bytes: string | null;
  shared: boolean;
  created_at: string | Date;
}

export async function GET() {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  try {
    const r = await query<Row>(
      `SELECT id, title, course_code, file_url, file_ext, size_bytes, shared, created_at
         FROM ${USER_MATERIALS_TABLE}
        WHERE email = $1
        ORDER BY created_at DESC`,
      [email],
    );
    const materials = r.rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      courseCode: row.course_code,
      url: row.file_url,
      ext: row.file_ext,
      size: row.size_bytes ? Number(row.size_bytes) : null,
      shared: row.shared,
      createdAt: new Date(row.created_at).toISOString(),
    }));
    return NextResponse.json({ ok: true, materials });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load materials" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    courseCode?: string;
    key?: string;
    url?: string;
    ext?: string;
    size?: number;
    shared?: boolean;
  };
  const { title, key, url } = body;
  if (!title || !key || !url) {
    return NextResponse.json({ ok: false, error: "title, key and url are required" }, { status: 400 });
  }
  // The key must be inside this user's own prefix — guards against saving a row that points
  // at someone else's file (or the admin library).
  if (!key.startsWith(userMaterialPrefix(email))) {
    return NextResponse.json({ ok: false, error: "Invalid file key" }, { status: 400 });
  }
  const courseCode = body.courseCode ? String(body.courseCode).slice(0, 40) : null;
  // Sharing only means something when the upload is tagged to a course.
  const shared = Boolean(body.shared) && !!courseCode;

  try {
    const r = await query<{ id: string }>(
      `INSERT INTO ${USER_MATERIALS_TABLE} (email, title, course_code, file_key, file_url, file_ext, size_bytes, shared)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        email,
        String(title).slice(0, 200),
        courseCode,
        key,
        url,
        body.ext ? String(body.ext).toLowerCase().replace(/^\./, "").slice(0, 10) : null,
        typeof body.size === "number" ? body.size : null,
        shared,
      ],
    );
    return NextResponse.json({ ok: true, id: String(r.rows[0]?.id) });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to save material" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });

  try {
    const r = await query<{ file_key: string }>(
      `SELECT file_key FROM ${USER_MATERIALS_TABLE} WHERE id = $1 AND email = $2`,
      [id, email],
    );
    if (!r.rowCount) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    // Best-effort R2 delete; the row goes regardless so the student's list is correct.
    try {
      await deleteUserMaterial(r.rows[0].file_key);
    } catch {
      /* ignore storage delete failure */
    }
    await query(`DELETE FROM ${USER_MATERIALS_TABLE} WHERE id = $1 AND email = $2`, [id, email]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 },
    );
  }
}
