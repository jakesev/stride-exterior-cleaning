/* "The Clean Pass" — the homepage scroll story.
 *
 * Each chapter has a scroll length (in viewport heights), a camera, and a
 * state function of local progress t (0..1). The same data drives the live
 * WebGL story (scripts/story.js) and the still renders used as fallbacks
 * (tools/render-stills.mjs renders each chapter at `still`). */

export const STORY_HOTSPOTS = [
  { id: 'roof', at: [-6.4, 7.0, -1.6], layer: 3, label: 'Roof · soft wash', href: '/services/roof-cleaning/' },
  { id: 'solar', at: [-1.2, 7.55, 0.1], layer: 4, label: 'Solar · pure water', href: '/services/solar-panel-cleaning/' },
  { id: 'gutter', at: [-7.7, 5.95, 1.85], layer: 3, label: 'Gutters · by hand', href: '/services/gutter-cleaning/' },
  { id: 'house', at: [5.0, 2.2, 3.0], layer: 1, label: 'Render · low pressure', href: '/services/house-washing/' },
  { id: 'driveway', at: [6.2, 0.1, 7.6], layer: 0, label: 'Driveway · surface clean', href: '/services/driveway-cleaning/' },
  { id: 'pool', at: [-8.6, 0.2, 8.0], layer: 0, label: 'Pool surround · stone-safe', href: '/services/pool-surround-cleaning/' }
];

export const LAYER_LABELS = [
  { at: [1.2, 7.95, 0.6], layer: 4, n: '05', label: 'Solar panels', method: 'Deionised water · soft brush' },
  { at: [3.4, 6.1, 1.9], layer: 3, n: '04', label: 'Roof tiles & gutters', method: 'Soft wash · cleared by hand' },
  { at: [2.9, 4.6, 1.4], layer: 2, n: '03', label: 'Upper walls & glass', method: 'Soft wash · pure water' },
  { at: [8.7, 2.2, 2.9], layer: 1, n: '02', label: 'Render & garage', method: 'Low pressure · fan tip' },
  { at: [8.4, 0.1, 9.6], layer: 0, n: '01', label: 'Driveway, paths & pool', method: 'Rotary clean · stone-safe' }
];

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (t) => Math.max(0, Math.min(1, t));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const START_SWEEP = -6;

export const CHAPTERS = [
  {
    id: 'arrive', vh: 0.7, name: 'Arrive',
    cam: { az: 30, el: 31, dist: 74, tx: 0, ty: 1.2, tz: 0.6 },
    state: () => ({ sweep: START_SWEEP, kinds: { roof: 0, wall: 0, concrete: 0, pavers: 0, glass: 0 }, drive: 0, explode: 0, xray: 0, rotary: false }),
    still: 0
  },
  {
    id: 'roof', vh: 1.4, name: 'The roof',
    cam: { az: 22, el: 40, dist: 40, tx: -2.6, ty: 6.6, tz: -1.6 },
    state: (t) => ({ sweep: START_SWEEP, kinds: { roof: seg(t, 0.12, 0.85), wall: 0, concrete: 0, pavers: 0, glass: 0 }, drive: 0, explode: 0, xray: 0, rotary: false }),
    still: 0.42
  },
  {
    id: 'layers', vh: 1.6, name: 'Every layer',
    cam: { az: 36, el: 20, dist: 88, tx: 0, ty: 7.0, tz: 0.4 },
    state: (t) => ({ sweep: START_SWEEP, kinds: { roof: 1, wall: 0, concrete: 0, pavers: 0, glass: 0 }, drive: 0, explode: Math.sin(Math.PI * seg(t, 0.05, 0.95)) ** 0.6, xray: 0, rotary: false }),
    still: 0.5
  },
  {
    id: 'vision', vh: 1.5, name: 'Grime vision',
    cam: { az: 16, el: 20, dist: 54, tx: -1.2, ty: 3.2, tz: 1.2 },
    state: (t) => ({ sweep: START_SWEEP, kinds: { roof: 1, wall: 0, concrete: 0, pavers: 0, glass: 0 }, drive: 0, explode: 0, xray: seg(t, 0.05, 0.2) * (1 - seg(t, 0.9, 1)), rotary: false }),
    still: 0.5
  },
  {
    id: 'drive', vh: 1.5, name: 'The driveway',
    cam: { az: 10, el: 30, dist: 36, tx: 5.6, ty: 0.4, tz: 6.0 },
    state: (t) => ({ sweep: START_SWEEP, kinds: { roof: 1, wall: seg(t, 0.85, 1), concrete: seg(t, 0.6, 0.95), pavers: 0, glass: 0 }, drive: seg(t, 0.08, 0.86), explode: 0, xray: 0, rotary: true }),
    still: 0.55
  },
  {
    id: 'done', vh: 1.0, name: 'Done',
    cam: { az: 42, el: 29, dist: 76, tx: 0, ty: 1.4, tz: 0.6 },
    state: (t) => ({ sweep: lerp(START_SWEEP, 60, seg(t, 0, 0.6)), kinds: { roof: 1, wall: 1, concrete: 1, pavers: 1, glass: 1 }, drive: 1, explode: 0, xray: 0, rotary: false }),
    still: 1
  }
];

/** Fully resolved state for chapter i at local progress t (used by the stills renderer). */
export function chapterState(i, t) {
  const c = CHAPTERS[i];
  return { cam: c.cam, ...c.state(t), look: false };
}
