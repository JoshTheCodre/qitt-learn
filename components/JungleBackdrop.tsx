/**
 * Foliage watermark. The parent must be `relative`, and content over it needs its
 * own stacking context (`relative z-10`).
 *
 * Leaves live only in a full-width strip pinned to the TOP edge. Not one full-page
 * image: a single canvas has to be object-cover'd to an unknown page height, which
 * scales it up and crops the sides — exactly where foliage sits. At a realistic
 * 1150px page that ate 60px off each edge and left only gradient bands showing.
 *
 * The bottom is a plain CSS gradient — a soft shade for the Start button to sit in.
 * It carries no artwork, so there's no reason to pay for an SVG.
 *
 * Canopy art is generated: `npm run illustration` (scripts/build-jungle.mjs).
 */
export default function JungleBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Plain <img>: a static SVG gains nothing from the image optimizer, which
          neither rasterizes nor shrinks SVG — it would only add a round trip. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/jungle-top.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-x-0 top-0 w-full select-none"
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-emerald-700/[0.12] via-emerald-600/[0.05] to-transparent" />
    </div>
  );
}
