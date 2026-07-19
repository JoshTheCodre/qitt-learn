import { NextResponse } from "next/server";
import { KINDS, buildKey, presignUpload, PUBLIC_URL, type MaterialKind } from "@/lib/r2";

// 200MB. A cap belongs here as well as in the UI — the client check is a courtesy,
// this one is the actual limit.
const MAX_BYTES = 200 * 1024 * 1024;

// NOTE: unauthenticated — see the note in app/api/admin/materials/route.ts.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    filename?: string;
    contentType?: string;
    course?: string;
    kind?: string;
    size?: number;
  };

  const { filename, course, kind, size } = body;
  const contentType = body.contentType || "application/octet-stream";

  if (!filename || !course || !kind) {
    return NextResponse.json({ ok: false, error: "filename, course and kind are required" }, { status: 400 });
  }
  if (!KINDS.includes(kind as MaterialKind)) {
    return NextResponse.json({ ok: false, error: `kind must be one of: ${KINDS.join(", ")}` }, { status: 400 });
  }
  if (typeof size === "number" && size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is larger than 200MB" }, { status: 413 });
  }

  const key = buildKey(course, kind as MaterialKind, filename, Date.now());
  const uploadUrl = await presignUpload(key, contentType);

  return NextResponse.json({
    ok: true,
    key,
    uploadUrl,
    publicUrl: `${PUBLIC_URL()}/${key}`,
  });
}
