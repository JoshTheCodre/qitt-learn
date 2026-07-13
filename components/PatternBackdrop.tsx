/**
 * WhatsApp-style doodle wallpaper. The parent must be `relative`, and content over
 * it needs its own stacking context (`relative z-10`).
 *
 * A CSS-repeated tile, not a composed illustration: it covers any viewport at any
 * height with no scaling and no cropping. (The previous full-page artwork had to be
 * object-cover'd to an unknown page height, which scaled it 1.28x and cropped 60px
 * off each side — taking the art with it.)
 *
 * Tile is generated: `npm run illustration` (scripts/build-doodles.mjs).
 */
export default function PatternBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        backgroundImage: "url(/illustrations/doodles.svg)",
        backgroundRepeat: "repeat",
        backgroundSize: "280px 280px",
      }}
    />
  );
}
