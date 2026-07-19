import { NextResponse } from "next/server";
import { deleteMaterial, listMaterials } from "@/lib/r2";

// NOTE: /admin is currently UNAUTHENTICATED (login was removed at the user's request).
// Anyone who reaches these routes can list, upload and delete R2 objects. Re-add the
// isAdmin() gate from lib/admin-auth before this is exposed publicly.
export const dynamic = "force-dynamic"; // never cache the bucket listing

export async function GET() {
  try {
    return NextResponse.json({ ok: true, materials: await listMaterials() });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Could not reach R2" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ ok: false, error: "key is required" }, { status: 400 });

  try {
    await deleteMaterial(key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}
