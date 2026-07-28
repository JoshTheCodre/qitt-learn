import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { materialCodeKey, type MaterialItem } from "@/lib/materials";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  slug: string;
  title: string;
  course_code: string;
  material_type: string;
  source_type_label: string | null;
  file_url: string;
  file_extension: string | null;
  size_human: string | null;
  page_count: number | null;
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") || "";
  const key = materialCodeKey(code);
  if (!key) {
    return NextResponse.json({ ok: true, code, key, count: 0, materials: [] });
  }

  try {
    // Normalize the stored course_code the SAME way materialCodeKey() does — strip a
    // trailing ".<n>" semester marker, drop non-alphanumerics, upper-case — so "GES 103"
    // in the library matches a student's "GES 103.1". 207 rows: a seq scan is nothing.
    const r = await query<Row>(
      `SELECT id, slug, title, course_code, material_type, source_type_label,
              file_url, file_extension, size_human, page_count
         FROM course_materials
        WHERE upper(
                regexp_replace(
                  regexp_replace(course_code, '\\.[0-9]+$', ''),
                  '[^A-Za-z0-9]', '', 'g'
                )
              ) = $1
        ORDER BY material_type, title`,
      [key],
    );

    const materials: MaterialItem[] = r.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      courseCode: row.course_code,
      type: row.material_type,
      typeLabel: row.source_type_label,
      format: (row.file_extension || "").toUpperCase(),
      size: row.size_human,
      pages: row.page_count,
      url: row.file_url,
    }));

    return NextResponse.json({ ok: true, code, key, count: materials.length, materials });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load materials" },
      { status: 500 },
    );
  }
}
