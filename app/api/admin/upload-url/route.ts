import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { KINDS, buildKey, presignUpload, PUBLIC_URL, type MaterialKind } from "@/lib/r2";

// 200MB. A cap belongs here as well as in the UI — the client check is a courtesy,
// this one is the actual limit.
const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

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
