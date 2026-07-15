import "server-only";

import { S3Client, ListObjectsV2Command, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2. It speaks the S3 API, so the AWS SDK works against it directly —
 * the only differences are the endpoint and `region: "auto"`.
 *
 * This module imports "server-only": if it's ever pulled into a client component by
 * accident, the build fails loudly instead of shipping R2_SECRET_ACCESS_KEY to the
 * browser. That is the single most important line in this file.
 */
function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} — set it in .env.local`);
  return v;
}

export const BUCKET = () => env("R2_BUCKET");
export const PUBLIC_URL = () => env("R2_PUBLIC_URL").replace(/\/$/, "");

let client: S3Client | null = null;
export function r2(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "auto",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env("R2_ACCESS_KEY_ID"),
      secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

export const KINDS = ["notes", "past-questions", "slides", "recordings", "other"] as const;
export type MaterialKind = (typeof KINDS)[number];

/** Keys are the source of truth: materials/<course>/<kind>/<timestamp>-<filename> */
export function buildKey(course: string, kind: MaterialKind, filename: string, now: number) {
  const safeCourse = course
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9.]+/g, "-")
    .replace(/^-|-$/g, "");

  // Strip path separators and anything exotic — a filename is attacker-controlled and
  // must never be able to escape its prefix.
  const safeName = filename
    .replace(/[/\\]/g, "-")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);

  return `materials/${safeCourse || "UNSORTED"}/${kind}/${now}-${safeName}`;
}

export type MaterialObject = {
  key: string;
  course: string;
  kind: string;
  filename: string;
  size: number;
  uploadedAt: string;
  url: string;
};

function parseKey(key: string, size: number, lastModified?: Date): MaterialObject {
  const [, course = "?", kind = "?", ...rest] = key.split("/");
  const raw = rest.join("/");
  const filename = raw.replace(/^\d+-/, ""); // drop the timestamp prefix for display
  return {
    key,
    course,
    kind,
    filename: filename || raw,
    size,
    uploadedAt: (lastModified ?? new Date(0)).toISOString(),
    url: `${PUBLIC_URL()}/${key}`,
  };
}

export async function listMaterials(): Promise<MaterialObject[]> {
  const out: MaterialObject[] = [];
  let token: string | undefined;

  // Paginate — ListObjectsV2 caps at 1000 keys per call, and silently truncating would
  // make materials vanish from the dashboard once the bucket grows.
  do {
    const res = await r2().send(
      new ListObjectsV2Command({
        Bucket: BUCKET(),
        Prefix: "materials/",
        ContinuationToken: token,
      })
    );
    for (const o of res.Contents ?? []) {
      if (!o.Key || o.Key.endsWith("/")) continue;
      out.push(parseKey(o.Key, o.Size ?? 0, o.LastModified));
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  return out.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function deleteMaterial(key: string) {
  if (!key.startsWith("materials/")) throw new Error("Refusing to delete outside materials/");
  await r2().send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: key }));
}

/**
 * Presigned PUT so the browser uploads straight to R2.
 *
 * Not routed through our own server on purpose: a Next route handler would have to
 * buffer the whole file, and serverless platforms cap request bodies around 4.5MB —
 * which a slide deck or a recording blows straight past.
 *
 * Requires CORS on the bucket allowing PUT from your origin (see the admin page).
 */
export async function presignUpload(key: string, contentType: string) {
  return getSignedUrl(
    r2(),
    new PutObjectCommand({ Bucket: BUCKET(), Key: key, ContentType: contentType }),
    { expiresIn: 600 }
  );
}
