import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { query, CLASS_ASSIGNMENTS_TABLE, USERS_TABLE } from "@/lib/db";
import { materialCodeKey } from "@/lib/materials";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  title: string;
  course_code: string | null;
  due_at: string | Date | null;
  due_text_raw: string | null;
  description: string | null;
  posted_by: string | null;
  source_sender: string | null;
  source_text: string | null;
  source_ts: string | Date | null;
  created_at: string | Date;
  published_at: string | Date | null;
}

const iso = (v: string | Date | null) => (v ? new Date(v).toISOString() : null);

export async function GET() {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  try {
    const [pub, me] = await Promise.all([
      query<Row>(
        `SELECT id, title, course_code, due_at, due_text_raw, description, posted_by,
                source_sender, source_text, source_ts, created_at, published_at
           FROM ${CLASS_ASSIGNMENTS_TABLE}
          WHERE status = 'published'
          ORDER BY published_at DESC`,
      ),
      query<{ courses: unknown }>(`SELECT courses FROM ${USERS_TABLE} WHERE email = $1`, [email]),
    ]);

    // Show assignments for the student's own courses; course-less ones are general (all).
    const courses = Array.isArray(me.rows[0]?.courses) ? (me.rows[0].courses as { code?: string }[]) : [];
    const myKeys = new Set(courses.map((c) => materialCodeKey(String(c?.code || ""))).filter(Boolean));

    const assignments = pub.rows
      .filter((r) => {
        if (!r.course_code) return true; // general
        if (myKeys.size === 0) return true; // no courses on file → show everything
        return myKeys.has(materialCodeKey(r.course_code));
      })
      .map((r) => ({
        id: String(r.id),
        title: r.title,
        course: r.course_code,
        dueAt: iso(r.due_at),
        dueTextRaw: r.due_text_raw,
        description: r.description,
        postedBy: r.posted_by,
        postedAt: iso(r.published_at),
        createdAt: iso(r.created_at),
        sourceMessage: r.source_text
          ? { sender: r.source_sender ?? "Class group", text: r.source_text, timestamp: iso(r.source_ts) }
          : null,
      }));

    return NextResponse.json({ ok: true, assignments });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed to load assignments" },
      { status: 500 },
    );
  }
}
