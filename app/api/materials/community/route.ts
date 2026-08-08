import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { query, USER_MATERIALS_TABLE, USERS_TABLE } from "@/lib/db";
import { materialCodeKey } from "@/lib/materials";

// Student-shared materials for a course — the "User uploads" tab on the course page. Only
// uploads a student explicitly shared (shared = true) appear here.
export const dynamic = "force-dynamic";

interface Row {
  id: string;
  title: string;
  file_url: string;
  file_ext: string | null;
  size_bytes: string | null;
  created_at: string | Date;
  uploader: string | null;
}

export async function GET(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  const code = new URL(req.url).searchParams.get("code") || "";
  const key = materialCodeKey(code);
  if (!key) return NextResponse.json({ ok: true, code, materials: [] });

  try {
    // Normalize the stored course_code the same way materialCodeKey does, so "CSC 201.1"
    // and "CSC201" match. Uploader's first name only — no email exposed.
    const r = await query<Row>(
      `SELECT m.id, m.title, m.file_url, m.file_ext, m.size_bytes, m.created_at,
              split_part(COALESCE(u.profile->>'name', ''), ' ', 1) AS uploader
         FROM ${USER_MATERIALS_TABLE} m
         LEFT JOIN ${USERS_TABLE} u ON u.email = m.email
        WHERE m.shared = true
          AND m.course_code IS NOT NULL
          AND upper(regexp_replace(regexp_replace(m.course_code, '\\.[0-9]+$', ''), '[^A-Za-z0-9]', '', 'g')) = $1
        ORDER BY m.created_at DESC`,
      [key],
    );
    const materials = r.rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      url: row.file_url,
      ext: row.file_ext,
      size: row.size_bytes ? Number(row.size_bytes) : null,
      uploader: row.uploader || null,
      createdAt: new Date(row.created_at).toISOString(),
    }));
    return NextResponse.json({ ok: true, code, key, materials });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load community uploads" },
      { status: 500 },
    );
  }
}
