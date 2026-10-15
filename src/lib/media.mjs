/* Image registry. Sources live in src/media; build.mjs writes resized AVIF +
 * WebP to assets/img/<name>-<w>.<fmt> and fills in natural sizes here.
 *
 * `kind` drives honest captioning:
 *   render — original 3D render of the Stride maquette (owned outright)
 *   stock  — licensed stock photography, always labelled as demonstration
 */
export const SOURCES = {
  // 3D renders (owned)
  'story-arrive': { src: 'renders/story-arrive.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-roof': { src: 'renders/story-roof.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-layers': { src: 'renders/story-layers.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-vision': { src: 'renders/story-vision.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-drive': { src: 'renders/story-drive.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-done': { src: 'renders/story-done.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'story-clean': { src: 'renders/story-clean.png', widths: [640, 960, 1280, 1600], kind: 'render' },
  'model-clean': { src: 'renders/model-clean.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-roof': { src: 'renders/focus-roof.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-driveway': { src: 'renders/focus-driveway.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-house': { src: 'renders/focus-house.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-gutter': { src: 'renders/focus-gutter.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-solar': { src: 'renders/focus-solar.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-pool': { src: 'renders/focus-pool.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-paths': { src: 'renders/focus-paths.png', widths: [560, 900, 1400], kind: 'render' },
  'focus-window': { src: 'renders/focus-window.png', widths: [560, 900, 1400], kind: 'render' },
  // Licensed stock (demonstration only)
  'svc-driveway': { src: 'photos/svc-driveway.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-house': { src: 'photos/svc-house.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-roof': { src: 'photos/svc-roof.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-gutter': { src: 'photos/svc-gutter.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-window': { src: 'photos/svc-window.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-paths': { src: 'photos/svc-paths.webp', widths: [520, 760, 1100], kind: 'stock' },
  'svc-pool': { src: 'photos/svc-pool.webp', widths: [520, 760, 1100], kind: 'stock' },
  'ba-driveway-before': { src: 'photos/ba-driveway-before.webp', widths: [760, 1100, 1340], kind: 'stock' },
  'ba-driveway-after': { src: 'photos/ba-driveway-after.webp', widths: [760, 1100, 1340], kind: 'stock' },
  'ba-pavers-before': { src: 'photos/ba-pavers-before.webp', widths: [760, 1100, 1340], kind: 'stock' },
  'ba-pavers-after': { src: 'photos/ba-pavers-after.webp', widths: [760, 1100, 1340], kind: 'stock' },
  'ba-poolside-before': { src: 'photos/ba-poolside-before.webp', widths: [760, 1100, 1240], kind: 'stock' },
  'ba-poolside-after': { src: 'photos/ba-poolside-after.webp', widths: [760, 1100, 1240], kind: 'stock' },
  'work-steam': { src: 'photos/work-steam.webp', widths: [640, 960, 1400], kind: 'stock' },
  'work-water': { src: 'photos/work-water.webp', widths: [640, 960, 1400], kind: 'stock' },
  'craft-work-wide': { src: 'photos/craft-work-wide.webp', widths: [720, 1100, 1600], kind: 'stock' },
  'area-bay': { src: 'photos/area-bay.webp', widths: [640, 960, 1400], kind: 'stock' },
  'area-brisbane': { src: 'photos/area-brisbane.webp', widths: [640, 960, 1400], kind: 'stock' },
  'texture-render': { src: 'photos/texture-render.webp', widths: [900, 1400, 2000], kind: 'stock' },
  'hero-window': { src: 'photos/hero-window.webp', widths: [900, 1400, 2000], kind: 'stock' }
};

/** Filled by build.mjs: name -> { w, h, widths, kind } */
export const MEDIA = {};
