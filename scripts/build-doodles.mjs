// Generates public/illustrations/doodles.svg — a seamless, WhatsApp-style doodle
// wallpaper tiled behind the app.
//
// A repeating tile rather than a composed scene, deliberately: a tile covers any
// viewport at any height with no cropping and no scaling, which is exactly what
// killed the previous full-page illustration.
//
// Motifs sit fully inside the tile bounds (nothing crosses an edge), so tiles butt
// up seamlessly. Rotation and scale vary per motif so the repeat doesn't read as a
// grid. Tune OPACITY / SIZE below, then: npm run illustration
import { writeFileSync, mkdirSync } from "fs";

const SIZE = 280;
const STROKE = "#0f766e"; // teal-700 — reads as a soft grey-green at low opacity
const OPACITY = 0.075;

// Line-art study motifs, each drawn in a ~24x24 box centred on (0,0).
const MOTIFS = {
  book: `<path d="M-11 -8 L-11 9 Q-2 5 0 8 Q2 5 11 9 L11 -8 Q2 -12 0 -9 Q-2 -12 -11 -8 Z"/><path d="M0 -9 L0 8"/>`,
  pencil: `<path d="M-10 10 L-7 1 L6 -12 L10 -8 L-3 5 Z"/><path d="M-7 1 L-3 5"/>`,
  cap: `<path d="M-12 -3 L0 -9 L12 -3 L0 3 Z"/><path d="M-7 -1 L-7 7 Q0 11 7 7 L7 -1"/>`,
  bulb: `<path d="M-5 8 L5 8"/><path d="M-4 11 L4 11"/><path d="M-6 4 Q-9 -1 -6 -6 Q0 -12 6 -6 Q9 -1 6 4 Z"/>`,
  flask: `<path d="M-4 -10 L-4 -2 L-9 8 Q-10 11 -6 11 L6 11 Q10 11 9 8 L4 -2 L4 -10"/><path d="M-6 -10 L6 -10"/>`,
  clock: `<circle cx="0" cy="0" r="10"/><path d="M0 -5 L0 0 L4 3"/>`,
  star: `<path d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3 Z"/>`,
  question: `<path d="M-5 -5 Q-5 -10 0 -10 Q5 -10 5 -5 Q5 -1 0 1 L0 4"/><circle cx="0" cy="9" r="1.2"/>`,
  atom: `<circle cx="0" cy="0" r="2.2"/><ellipse cx="0" cy="0" rx="11" ry="4.5"/><ellipse cx="0" cy="0" rx="11" ry="4.5" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="11" ry="4.5" transform="rotate(120)"/>`,
  ruler: `<path d="M-11 -5 L7 -11 L11 5 L-7 11 Z"/><path d="M-6 -3 L-5 0"/><path d="M-1 -5 L0 -2"/><path d="M4 -7 L5 -4"/>`,
  note: `<path d="M-8 -11 L8 -11 L8 11 L-8 11 Z"/><path d="M-4 -6 L4 -6"/><path d="M-4 -1 L4 -1"/><path d="M-4 4 L1 4"/>`,
  clip: `<path d="M6 -8 L-4 2 Q-8 6 -4 10 Q0 14 4 10 L11 3"/>`,
};

// (motif, x, y, rotation, scale) — hand-placed so the field feels scattered, not gridded.
const LAYOUT = [
  ["book", 44, 40, -12, 1.0],
  ["pencil", 150, 28, 18, 0.9],
  ["cap", 240, 52, -8, 1.0],
  ["clock", 96, 104, 0, 0.85],
  ["star", 196, 96, 14, 0.8],
  ["flask", 34, 150, 10, 0.9],
  ["atom", 138, 168, -6, 0.85],
  ["question", 244, 148, -14, 0.95],
  ["note", 66, 232, 8, 0.9],
  ["ruler", 170, 240, -18, 0.85],
  ["bulb", 254, 224, 12, 0.9],
  ["clip", 14, 96, -20, 0.8],
];

const body = LAYOUT.map(
  ([name, x, y, rot, scale]) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">${MOTIFS[name]}</g>`
).join("\n  ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <g fill="none" stroke="${STROKE}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="${OPACITY}">
  ${body}
  </g>
</svg>`;

mkdirSync("public/illustrations", { recursive: true });
writeFileSync("public/illustrations/doodles.svg", svg);
console.log(`wrote doodles.svg — ${SIZE}x${SIZE} tile, ${LAYOUT.length} motifs`);
