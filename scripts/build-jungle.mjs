// Generates the foliage watermark behind the practice screen:
//   public/illustrations/jungle-top.svg     — canopy, anchored to the top edge
//   public/illustrations/jungle-bottom.svg  — undergrowth, anchored to the bottom
//
// Two full-width strips rather than one full-page canvas, deliberately. A single
// canvas has to be object-cover'd to an unknown page height, which scales it up and
// crops the sides — and the sides are where the art lives. (That's what made the
// first version invisible: a 1.28x cover scale ate 60px off each edge.) Strips span
// 100% width at their natural aspect and are anchored to an edge, so nothing is cropped.
//
// Tune OPACITY to make the foliage louder or quieter, then: npm run illustration
import { writeFileSync, mkdirSync } from "fs";

const W = 430;
const OPACITY = { back: 0.1, mid: 0.16, front: 0.22 };
const n = (v) => Math.round(v * 10) / 10;

// Blade: narrow base, belly, pointed tip. Shared by leaflets and full leaves.
function blade(len, wid) {
  const w = wid / 2;
  return `M0 0 C ${n(len * 0.16)} ${-n(w)} ${n(len * 0.6)} ${-n(w * 1.08)} ${n(len)} 0 C ${n(len * 0.6)} ${n(w * 1.08)} ${n(len * 0.16)} ${n(w)} 0 0 Z`;
}

function leaf({ x, y, angle, len, wid }) {
  const parts = [`<path d="${blade(len, wid)}" fill="currentColor"/>`];
  parts.push(
    `<path d="M ${n(len * 0.04)} 0 L ${n(len * 0.95)} 0" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="1.4" stroke-linecap="round"/>`
  );
  for (let i = 1; i <= 5; i++) {
    const t = 0.14 + i * 0.14;
    const halfW = (wid / 2) * Math.sin(Math.PI * Math.min(1, t * 1.05)) * 0.86;
    for (const side of [-1, 1]) {
      parts.push(
        `<path d="M ${n(len * t)} 0 Q ${n(len * (t + 0.02))} ${n(halfW * 0.75 * side)} ${n(len * (t + 0.16))} ${n(halfW * side)}" fill="none" stroke="#fff" stroke-opacity="0.38" stroke-width="1" stroke-linecap="round"/>`
      );
    }
  }
  parts.push(
    `<path d="M ${n(-len * 0.18)} 0 L 0 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`
  );
  return `<g transform="translate(${x} ${y}) rotate(${angle})">${parts.join("")}</g>`;
}

function frond({ x, y, angle, len, curve = 26, count = 14, maxLeaf = 24 }) {
  const at = (t) => [len * t, curve * Math.sin(Math.PI * t * 0.85)];
  const parts = [];
  const pts = [];
  for (let i = 0; i <= 36; i++) pts.push(at(i / 36));
  parts.push(
    `<path d="${pts.map(([a, o], i) => `${i ? "L" : "M"} ${n(a)} ${n(o)}`).join(" ")}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`
  );
  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    const [along, off] = at(t);
    const L = maxLeaf * Math.sin(Math.PI * Math.pow(t, 0.72)) * (1 - 0.3 * t);
    if (L < 3.5) continue;
    const tanDeg =
      (Math.atan((curve * Math.PI * 0.85 * Math.cos(Math.PI * t * 0.85)) / len) * 180) / Math.PI;
    for (const side of [-1, 1]) {
      parts.push(
        `<path d="${blade(L, L * 0.52)}" transform="translate(${n(along)} ${n(off)}) rotate(${n(tanDeg + side * 55)})" fill="currentColor"/>`
      );
    }
  }
  return `<g transform="translate(${x} ${y}) rotate(${angle})">${parts.join("")}</g>`;
}

const wrap = (h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" fill="none">${body}</svg>`;

/* ---------- canopy: hangs down from the top edge, spanning the full width ---------- */
const TOP_H = 250;
const canopy = wrap(
  TOP_H,
  `
<defs>
  <linearGradient id="light" x1="215" y1="0" x2="215" y2="${TOP_H}" gradientUnits="userSpaceOnUse">
    <stop stop-color="#10b981" stop-opacity="0.10"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="${W}" height="${TOP_H}" fill="url(#light)"/>

<g color="#34d399" opacity="${OPACITY.back}">
  ${frond({ x: 30, y: -18, angle: 74, len: 165, curve: 30, count: 15, maxLeaf: 21 })}
  ${frond({ x: 168, y: -26, angle: 96, len: 140, curve: -26, count: 13, maxLeaf: 18 })}
  ${frond({ x: 300, y: -22, angle: 84, len: 155, curve: 28, count: 14, maxLeaf: 20 })}
  ${frond({ x: 412, y: -14, angle: 108, len: 150, curve: -28, count: 14, maxLeaf: 19 })}
</g>

<g color="#059669" opacity="${OPACITY.mid}">
  ${leaf({ x: -14, y: -26, angle: 62, len: 130, wid: 58 })}
  ${leaf({ x: 96, y: -34, angle: 84, len: 112, wid: 50 })}
  ${leaf({ x: 214, y: -30, angle: 72, len: 124, wid: 55 })}
  ${leaf({ x: 336, y: -34, angle: 100, len: 116, wid: 52 })}
  ${leaf({ x: 438, y: -22, angle: 118, len: 128, wid: 57 })}
</g>

<g color="#047857" opacity="${OPACITY.front}">
  ${leaf({ x: -30, y: -10, angle: 40, len: 104, wid: 46 })}
  ${leaf({ x: 54, y: -18, angle: 66, len: 88, wid: 40 })}
  ${leaf({ x: 158, y: -14, angle: 96, len: 82, wid: 37 })}
  ${leaf({ x: 268, y: -18, angle: 78, len: 92, wid: 41 })}
  ${leaf({ x: 380, y: -12, angle: 106, len: 86, wid: 39 })}
  ${leaf({ x: 452, y: -6, angle: 136, len: 100, wid: 44 })}
</g>
`
);

// The bottom of the screen is a plain CSS gradient in JungleBackdrop.tsx — a soft
// shade for the Start button to sit in. It carries no artwork, so it needs no asset.

mkdirSync("public/illustrations", { recursive: true });
writeFileSync("public/illustrations/jungle-top.svg", canopy);
console.log("wrote jungle-top.svg");
