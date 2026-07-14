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

/*
 * Second tile, for the auth screens (register / login).
 *
 * Deliberately a different language: abstract geometry rather than study objects, on a
 * larger, sparser grid. Reusing the study doodles here would make signing up feel like
 * you were already inside the app.
 */
const ALT_SIZE = 320;
const ALT_STROKE = "#36669c"; // brand steel blue
const ALT_OPACITY = 0.07;

const ALT_MOTIFS = {
  ring: `<circle cx="0" cy="0" r="11"/><circle cx="0" cy="0" r="5"/>`,
  plus: `<path d="M0 -9 L0 9"/><path d="M-9 0 L9 0"/>`,
  spark: `<path d="M0 -11 Q1.5 -1.5 11 0 Q1.5 1.5 0 11 Q-1.5 1.5 -11 0 Q-1.5 -1.5 0 -11 Z"/>`,
  wave: `<path d="M-13 0 Q-6.5 -7 0 0 T13 0"/>`,
  tri: `<path d="M0 -10 L9 7 L-9 7 Z"/>`,
  arc: `<path d="M-10 7 A 12 12 0 0 1 10 7"/>`,
  dots: `<circle cx="-7" cy="0" r="1.6"/><circle cx="0" cy="0" r="1.6"/><circle cx="7" cy="0" r="1.6"/>`,
  square: `<rect x="-8" y="-8" width="16" height="16" rx="3"/>`,
  chev: `<path d="M-7 -6 L2 0 L-7 6"/><path d="M2 -6 L11 0 L2 6"/>`,
};

const ALT_LAYOUT = [
  ["ring", 52, 46, 0, 1.0],
  ["spark", 168, 30, 14, 0.95],
  ["wave", 268, 62, -8, 1.0],
  ["plus", 108, 118, 20, 0.9],
  ["tri", 228, 142, -12, 0.85],
  ["dots", 34, 158, 30, 1.0],
  ["square", 296, 176, 18, 0.85],
  ["arc", 138, 214, 8, 1.0],
  ["chev", 244, 258, -14, 0.9],
  ["ring", 60, 266, 0, 0.75],
  ["spark", 300, 300, 22, 0.7],
  ["plus", 190, 300, -16, 0.75],
];

const render = (layout, motifs) =>
  layout
    .map(
      ([name, x, y, rot, scale]) =>
        `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">${motifs[name]}</g>`
    )
    .join("\n  ");

const tile = (size, stroke, opacity, width, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
  ${body}
  </g>
</svg>`;

mkdirSync("public/illustrations", { recursive: true });

writeFileSync(
  "public/illustrations/doodles.svg",
  tile(SIZE, STROKE, OPACITY, 1.6, render(LAYOUT, MOTIFS))
);
writeFileSync(
  "public/illustrations/doodles-auth.svg",
  tile(ALT_SIZE, ALT_STROKE, ALT_OPACITY, 1.5, render(ALT_LAYOUT, ALT_MOTIFS))
);

console.log(`wrote doodles.svg      — ${SIZE}x${SIZE} tile, ${LAYOUT.length} study motifs`);
console.log(`wrote doodles-auth.svg — ${ALT_SIZE}x${ALT_SIZE} tile, ${ALT_LAYOUT.length} abstract motifs`);
