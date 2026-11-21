/**
 * Asset manifest for brand-supplied photography.
 *
 * MULTI-ANGLE BAAZ (optional upgrade for the Rotator scene):
 *   Drop transparent cutouts in `public/img/angles/oud-brown/` named
 *   01.webp, 02.webp … in turntable order, then list them here in order.
 *   If the shots still have the cream product-photo background, run
 *   `node tools/cutout.mjs <path-to-image>` on each first (see tools/cutout.mjs).
 *   With one or zero frames, the Rotator keeps its 3D-tilt simulation of the
 *   real side-profile photograph — the site works perfectly without them.
 *
 * WORKSHOP PHOTOS (in use — Journey scene):
 *   Five frames lifted from the brand's own workshop reel (the making-of
 *   video), one per construction step, at `public/img/workshop/*.webp`
 *   (1278x720, ~22 KB each). Journey renders them as cover-cropped cards
 *   and falls back to the product cutout for any step left null.
 */
export const angleFrames = []
// export const angleFrames = [
//   '/img/angles/oud-brown/01.webp',
//   '/img/angles/oud-brown/02.webp',
//   // ...
// ]

export const workshopPhotos = {
  cutting: '/img/workshop/cutting.webp',
  lasting: '/img/workshop/lasting.webp',
  painting: '/img/workshop/painting.webp',
  vulcanising: '/img/workshop/vulcanising.webp',
  numbering: '/img/workshop/numbering.webp',
}
