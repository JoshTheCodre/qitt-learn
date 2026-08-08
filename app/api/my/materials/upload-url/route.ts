import { NextResponse } from "next/server";
import { currentSessionEmail } from "@/lib/session";
import { buildUserMaterialKey, presignUpload, PUBLIC_URL } from "@/lib/r2";

export const dynamic = "force-dynamic";

const MAX_BYTES = 30 * 1024 * 1024; // 30MB cap for student uploads

// Returns a presigned R2 PUT so the browser uploads straight to storage, under this user's
// own prefix. The key is derived server-side from the session email — the client can't
// choose where the file lands.
export async function POST(req: Request) {
  const email = currentSessionEmail();
  if (!email) return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    filename?: string;
    contentType?: string;
    size?: number;
  };
  if (!body.filename) {
    return NextResponse.json({ ok: false, error: "filename is required" }, { status: 400 });
  }
  if (typeof body.size === "number" && body.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is larger than 30MB" }, { status: 413 });
  }

  try {
    const key = buildUserMaterialKey(email, String(body.filename), Date.now());
    const uploadUrl = await presignUpload(key, body.contentType || "application/octet-stream");
    return NextResponse.json({ ok: true, key, uploadUrl, publicUrl: `${PUBLIC_URL()}/${key}` });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not create upload URL" },
      { status: 500 },
    );
  }
}
