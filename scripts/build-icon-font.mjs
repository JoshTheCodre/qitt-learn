/**
 * Rebuilds public/fonts/material-symbols-outlined.woff2.
 *
 * The font is SUBSET to only the ligatures the app uses — that's why it's ~8KB
 * instead of ~450KB. The catch: an icon that isn't in the subset renders as its
 * literal name ("call", "school"), which is exactly how the profile page broke.
 *
 * So the list is derived from the source rather than hand-maintained:
 *   1. scrape icon references out of app/ and components/
 *   2. intersect them with Google's official icon-name list, to drop false positives
 *      (our own Icon3D names, stray identifiers)
 *   3. fetch the subset woff2 for exactly that set
 *
 * Run after adding an icon anywhere in the app:  npm run icon-font
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["app", "components"];
const OUT = "public/fonts/material-symbols-outlined.woff2";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) out.push(p);
  }
  return out;
}

// Every place an icon name can appear in this codebase.
const PATTERNS = [
  // <span className="material-symbols-outlined ...">home</span>
  /material-symbols-outlined[^>]*>\s*([a-z_0-9]+)\s*</g,
  // { icon: "home" }  /  icon="home"
  /\bicon\s*[:=]\s*"([a-z_0-9]+)"/g,
  // {cond ? "notifications_active" : "notifications_off"}
  /\?\s*"([a-z_0-9]+)"\s*:\s*"([a-z_0-9]+)"/g,
];

const files = (await Promise.all(ROOTS.map(walk))).flat();
const candidates = new Set();

for (const f of files) {
  const src = await readFile(f, "utf8");
  for (const re of PATTERNS) {
    for (const m of src.matchAll(re)) {
      for (const g of m.slice(1)) if (g) candidates.add(g);
    }
  }
}

// Google's official list — the filter that turns a noisy scrape into a valid set.
const res = await fetch("https://fonts.google.com/metadata/icons?incomplete=1");
const meta = JSON.parse((await res.text()).replace(/^\)\]\}'/, ""));
const official = new Set(meta.icons.map((i) => i.name));

const icons = [...candidates].filter((c) => official.has(c)).sort();
const dropped = [...candidates].filter((c) => !official.has(c)).sort();

console.log(`scanned ${files.length} files`);
console.log(`icons  (${icons.length}): ${icons.join(", ")}`);
console.log(`ignored (${dropped.length}): ${dropped.join(", ") || "—"}\n`);

if (!icons.length) throw new Error("No icons found — refusing to write an empty font.");

const cssUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0" +
  `&icon_names=${icons.join(",")}`;

// Google negotiates font format by User-Agent — on BOTH the stylesheet and the font
// download. Without a modern UA it serves TrueType, which is several times larger.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const css = await fetch(cssUrl, { headers: { "User-Agent": UA } }).then((r) => r.text());

// Subset fonts come from a /l/font?kit=... URL with no file extension. Given a modern
// UA, Google serves woff2 and omits format() entirely; given anything else it falls
// back to TrueType. So match the src url and verify the bytes rather than the syntax.
const src = css.match(/src:\s*url\((https:\/\/[^)]+)\)/)?.[1];
if (!src) throw new Error(`No font url in Google's stylesheet:\n${css.slice(0, 300)}`);

const font = Buffer.from(
  await fetch(src, { headers: { "User-Agent": UA } }).then((r) => r.arrayBuffer())
);

// wOF2 magic. A TrueType fallback would still "work" but is several times larger,
// so fail loudly rather than silently regressing the payload.
const magic = font.subarray(0, 4).toString("ascii");
if (magic !== "wOF2") {
  throw new Error(`Expected woff2, got "${magic}" — Google served a fallback format.`);
}

await writeFile(OUT, font);
console.log(`wrote ${OUT} — ${(font.length / 1024).toFixed(1)}KB, ${icons.length} glyphs`);
