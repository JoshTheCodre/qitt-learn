import { NextResponse } from "next/server";
import { deleteMaterial, listMaterials } from "@/lib/r2";
import { isAdmin } from "@/lib/admin-auth";

// Gated behind the admin password, like the rest of the admin dashboard.
export const dynamic = "force-dynamic"; // never cache the bucket listing

function guard() {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD is not set — add it to .env.local to use the admin dashboard." },
      { status: 500 },
    );
  }
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = guard();
  if (denied) return denied;

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
  const denied = guard();
  if (denied) return denied;

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
