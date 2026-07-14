/**
 * Tiled doodle wallpaper. The parent must be `relative`, and content over it needs its
 * own stacking context (`relative z-10`).
 *
 * A CSS-repeated tile, not a composed illustration: it covers any viewport at any
 * height with no scaling and no cropping. (The full-page artwork this replaced had to
 * be object-cover'd to an unknown page height, which scaled it 1.28x and cropped 60px
 * off each side — taking the art with it.)
 *
 * Tiles are generated: `npm run illustration` (scripts/build-doodles.mjs).
 */
const TILES = {
  // Study objects — books, flasks, rulers. For screens inside the app.
  study: { src: "/illustrations/doodles.svg", size: "280px 280px" },
  // Abstract geometry — rings, sparks, waves. For the auth screens, so signing up
  // doesn't already feel like being inside the app.
  auth: { src: "/illustrations/doodles-auth.svg", size: "320px 320px" },
} as const;

export default function PatternBackdrop({
  variant = "study",
}: {
  variant?: keyof typeof TILES;
}) {
  const tile = TILES[variant];

  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
      style={{
        backgroundImage: `url(${tile.src})`,
        backgroundRepeat: "repeat",
        backgroundSize: tile.size,
      }}
    />
  );
}
