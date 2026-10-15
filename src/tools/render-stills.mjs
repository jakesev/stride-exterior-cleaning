/* Renders still images from the 3D maquette in headless Chromium.
 *
 *   node tools/render-stills.mjs [name ...]
 *
 * Writes transparent PNGs to media/renders/ plus hotspots.json (the poster's
 * hotspot positions, so the no-WebGL fallback can place them identically).
 * These PNGs are committed sources; build.mjs converts them to AVIF/WebP.
 */
import { build } from 'esbuild';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { STORY_HOTSPOTS, CHAPTERS, chapterState } from '../content/story.mjs';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(SRC, 'media/renders');
const TMP = path.join(SRC, '.cache/stills');

// Story frames are rendered at the live frame's aspect (16:13).
const story = Object.fromEntries(CHAPTERS.map((c, i) => [`story-${c.id}`, { w: 1600, h: 1300, state: chapterState(i, c.still), hotspots: i === 0, lens: c.id === 'vision' }]));
const focus = (cam, kinds = {}, extra = {}) => ({ w: 1400, h: 1050, state: { cam, sweep: -18, kinds: { roof: 0, wall: 0, concrete: 0, pavers: 0, glass: 0, ...kinds }, drive: 0, explode: 0, xray: 0, look: false, ...extra } });
const SHOTS = {
  ...story,
  'story-clean': { w: 1600, h: 1300, state: { ...chapterState(5, 1) } },
  'focus-roof': focus({ az: 28, el: 38, dist: 36, tx: -2.4, ty: 6.6, tz: -2.0 }, { roof: 0.5 }),
  'focus-driveway': focus({ az: 16, el: 32, dist: 32, tx: 5.8, ty: 0.3, tz: 6.0 }, {}, { drive: 0.55, rotary: true }),
  'focus-house': focus({ az: 20, el: 13, dist: 40, tx: -2.8, ty: 2.8, tz: 1.4 }, { wall: 0.5 }),
  'focus-gutter': focus({ az: 30, el: 18, dist: 21, tx: -5.2, ty: 5.6, tz: 1.6 }, { wall: 0.5, roof: 0.5 }),
  'focus-solar': focus({ az: 12, el: 50, dist: 24, tx: -1.2, ty: 7.2, tz: -0.3 }, { glass: 0.5 }),
  'focus-pool': focus({ az: 36, el: 36, dist: 30, tx: -6.4, ty: 0.2, tz: 5.8 }, { pavers: 0.5 }),
  'focus-paths': focus({ az: 26, el: 40, dist: 28, tx: 0.6, ty: 0.2, tz: 5.2 }, { concrete: 0.5, pavers: 0.5 }),
  'focus-window': focus({ az: 8, el: 9, dist: 28, tx: -2.6, ty: 3.4, tz: 1.4 }, { glass: 0.5, wall: 0.5 }),
  'model-clean': { w: 1400, h: 1100, state: { ...chapterState(5, 1), cam: { az: 30, el: 31, dist: 74, tx: 0, ty: 1.2, tz: 0.6 } } }
};

const want = process.argv.slice(2);
const names = want.length ? want : Object.keys(SHOTS);

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(TMP, { recursive: true });
await fs.writeFile(path.join(TMP, 'entry.js'), `
import { mountMaquette } from ${JSON.stringify(path.join(SRC, 'scripts/maquette.js'))};
const cfg = JSON.parse(decodeURIComponent(location.hash.slice(1)));
const root = document.getElementById('root');
root.style.width = cfg.w + 'px'; root.style.height = cfg.h + 'px';
const state = cfg.lens ? { ...cfg.state, lens: { x: cfg.w * 0.5, y: cfg.h * 0.5, r: cfg.h * 0.24 } } : cfg.state;
const h = mountMaquette(root, { poster: true, state, dpr: 1 });
h.jump();
window.__hot = cfg.hotspots ? ${JSON.stringify(STORY_HOTSPOTS)}.map(s => ({ id: s.id, ...h.project(s.at, s.layer) })) : null;
requestAnimationFrame(() => { h.renderNow(); window.__ready = true; });
`);
await build({ entryPoints: [path.join(TMP, 'entry.js')], bundle: true, format: 'esm', outfile: path.join(TMP, 'bundle.js'), logLevel: 'warning' });
await fs.writeFile(path.join(TMP, 'index.html'), '<!doctype html><html><head><style>html,body{margin:0;background:transparent}#root{position:relative}canvas{display:block;width:100%;height:100%}</style></head><body><div id="root"></div><script type="module" src="bundle.js"></script></body></html>');

const server = http.createServer(async (req, res) => {
  const file = path.join(TMP, req.url.split('?')[0].split('#')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, { 'content-type': file.endsWith('.js') ? 'text/javascript' : 'text/html' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const hot = {};
for (const name of names) {
  const cfg = SHOTS[name];
  if (!cfg) { console.warn('unknown shot', name); continue; }
  const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error(name, e));
  await page.goto(`http://localhost:${port}/#${encodeURIComponent(JSON.stringify(cfg))}`);
  await page.waitForFunction(() => window.__ready, null, { timeout: 120000 });
  await page.waitForTimeout(150);
  await page.locator('#root').screenshot({ path: path.join(OUT, name + '.png'), omitBackground: true });
  if (cfg.hotspots) hot[name] = await page.evaluate(() => window.__hot);
  await page.close();
  console.log('rendered', name);
}
if (Object.keys(hot).length) {
  const file = path.join(OUT, 'hotspots.json');
  let prev = {};
  try { prev = JSON.parse(await fs.readFile(file, 'utf8')); } catch {}
  await fs.writeFile(file, JSON.stringify({ ...prev, ...hot }, null, 1));
}
await browser.close();
server.close();
