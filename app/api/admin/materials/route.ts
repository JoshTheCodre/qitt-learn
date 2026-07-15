import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { deleteMaterial, listMaterials } from "@/lib/r2";

export const dynamic = "force-dynamic"; // never cache the bucket listing

export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
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
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

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
