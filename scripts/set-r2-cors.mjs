/**
 * Applies a CORS policy to the R2 bucket so the browser can PUT uploads directly.
 * Run once (and again whenever you add a new origin):  node scripts/set-r2-cors.mjs
 *
 * Reads credentials from .env.local. Extend ALLOWED_ORIGINS with your deployed
 * domain(s) before going live — a browser upload only works from a listed origin.
 */
import { readFileSync } from "node:fs";
import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";

// Minimal .env.local parser (a plain node script doesn't load it automatically).
const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2];
}

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // TODO: add your production origin, e.g. "https://qitt.app"
];

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutBucketCorsCommand({
    Bucket: env.R2_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ALLOWED_ORIGINS,
          AllowedMethods: ["PUT", "GET", "HEAD"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  })
);

console.log(`CORS applied to ${env.R2_BUCKET} for: ${ALLOWED_ORIGINS.join(", ")}`);

const check = await client.send(new GetBucketCorsCommand({ Bucket: env.R2_BUCKET }));
console.log("Bucket now reports:", JSON.stringify(check.CORSRules, null, 2));
