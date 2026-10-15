/* Stride Exterior Cleaning — static site build.
 *
 *   node build.mjs                 preview build for GitHub Pages (noindex, /stride-exterior-cleaning base)
 *   node build.mjs --production    production build for strideexteriorcleaning.com.au
 *   Options: --base=/x --origin=https://… --out=<dir>
 *            --lead-transport=endpoint|webhook --lead-endpoint=URL --lead-webhook=URL
 *
 * Output goes to the repository root by default (GitHub Pages serves it).
 * Files written by the previous build but not this one are removed, using
 * .cache/manifest.json — nothing else in the output folder is touched. */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build as esbuild } from 'esbuild';
import sharp from 'sharp';

import { SITE, BUSINESS } from './content/site.mjs';
import { SOURCES, MEDIA } from './lib/media.mjs';
import { loadArticles, parseFaqFile, parseRefs, parseFacts } from './lib/md.mjs';
import { ASSET_VERSION } from './templates/layout.mjs';
import { SERVICES } from './content/services.mjs';
import { AREAS } from './content/areas.mjs';
import { GUIDES } from './content/guides.mjs';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const outArg = process.argv.find((a) => a.startsWith('--out='));
const OUT = path.resolve(SRC, outArg ? outArg.slice(6) : '..');
const CACHE = path.join(SRC, '.cache');
const written = new Set();
const t0 = Date.now();

async function write(rel, data) {
  const file = path.join(OUT, rel);
  await fsp.mkdir(path.dirname(file), { recursive: true });
  await fsp.writeFile(file, data);
  written.add(rel);
}
async function copy(from, rel) {
  const file = path.join(OUT, rel);
  await fsp.mkdir(path.dirname(file), { recursive: true });
  await fsp.copyFile(from, file);
  written.add(rel);
}

/* ---------------------------------------------------------------- media */
async function media() {
  // Guide covers are produced by tools/render-guides.mjs.
  for (const g of GUIDES) {
    const src = `covers/cover-${g.slug}.png`;
    if (fs.existsSync(path.join(SRC, 'media', src))) SOURCES[`cover-${g.slug}`] = { src, widths: [320, 520, 800], kind: 'render' };
  }
  const jobs = [];
  for (const [name, s] of Object.entries(SOURCES)) {
    const file = path.join(SRC, 'media', s.src);
    if (!fs.existsSync(file)) { console.warn('  missing media source', s.src); continue; }
    const srcStat = fs.statSync(file);
    const meta = await sharp(file).metadata();
    const widths = s.widths.filter((w) => w <= meta.width);
    if (!widths.length) widths.push(meta.width);
    MEDIA[name] = { w: meta.width, h: meta.height, widths, kind: s.kind };
    for (const w of widths) for (const fmt of ['avif', 'webp']) {
      const rel = `assets/img/${name}-${w}.${fmt}`;
      written.add(rel);
      const dest = path.join(OUT, rel);
      if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcStat.mtimeMs) continue;
      jobs.push((async () => {
        await fsp.mkdir(path.dirname(dest), { recursive: true });
        const p = sharp(file).resize({ width: w, withoutEnlargement: true });
        await (fmt === 'avif' ? p.avif({ quality: 56, effort: 4 }) : p.webp({ quality: 80, alphaQuality: 90 })).toFile(dest);
      })());
    }
  }
  await Promise.all(jobs);
  console.log(`  media: ${Object.keys(MEDIA).length} images (${jobs.length} encoded)`);
}

/* ---------------------------------------------------------- css + js */
async function assets() {
  for (const f of ['archivo-var-latin.woff2', 'plexmono-500-latin.woff2']) await copy(path.join(SRC, 'fonts', f), `assets/fonts/${f}`);
  for (const f of fs.readdirSync(path.join(SRC, 'media/brand'))) await copy(path.join(SRC, 'media/brand', f), `assets/brand/${f}`);

  const css = await esbuild({ entryPoints: [path.join(SRC, 'styles/stride.css')], bundle: true, minify: true, write: false, external: ['*.woff2'], logLevel: 'warning' });
  await write('assets/css/stride.css', css.outputFiles[0].contents);

  const js = await esbuild({
    entryPoints: { main: path.join(SRC, 'scripts/main.js'), forms: path.join(SRC, 'scripts/forms.js'), story: path.join(SRC, 'scripts/story-entry.js') },
    bundle: true, minify: true, format: 'iife', target: ['es2019'], write: false, outdir: 'x', legalComments: 'none', logLevel: 'warning',
    define: { 'process.env.NODE_ENV': '"production"' }
  });
  const hash = crypto.createHash('sha1');
  for (const f of js.outputFiles) {
    const name = path.basename(f.path);
    await write(`assets/js/${name}`, f.contents);
    hash.update(f.contents);
    console.log(`  js: ${name} ${(f.contents.length / 1024).toFixed(1)} KB`);
  }
  hash.update(css.outputFiles[0].contents);
  ASSET_VERSION.v = hash.digest('hex').slice(0, 10);
}

/* --------------------------------------------------------------- pages */
async function pages() {
  const { home } = await import('./pages/home.mjs');
  const site = await import('./pages/site.mjs');
  const learn = await import('./pages/learn.mjs');
  const forms = await import('./pages/forms.mjs');

  const articles = loadArticles(path.join(SRC, 'content/articles'));
  const R = (f) => path.join(SRC, 'content/research', f);
  const roofRefs = parseRefs(R('roofs-extras.md'));
  const homeowner = parseFaqFile(R('homeowner-questions.md'));
  const methods = parseFaqFile(R('methods-extras.md')).find((g) => /FAQ/i.test(g.title));
  const roofs = parseFaqFile(R('roofs-extras.md'), { refs: roofRefs }).find((g) => /FAQ/i.test(g.title));
  const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
  const toItems = (g) => g.items.map((it) => [it.q, it.a, it.sources]);
  const groups = [
    ...(methods ? [{ title: 'Surfaces & methods', id: 'surfaces-methods', items: toItems(methods) }] : []),
    ...(roofs ? [{ title: 'Roofs, gutters, solar & windows', id: 'roofs-gutters', items: toItems(roofs) }] : []),
    ...homeowner.filter((g) => g.items.length).map((g) => ({ title: g.title, id: slug(g.title), items: toItems(g) }))
  ];
  const facts = [...parseFacts(R('methods-extras.md')), ...parseFacts(R('roofs-extras.md'), roofRefs)];

  const P = [];
  const page = (rel, html) => P.push(write(rel, html));
  page('index.html', home({ SRC, articles }));
  page('services/index.html', site.servicesHub());
  for (const s of SERVICES) page(`services/${s.slug}/index.html`, site.servicePage(s, articles));
  page('service-areas/index.html', site.areasHub());
  for (const a of AREAS) page(`service-areas/${a.slug}/index.html`, site.areaPage(a));
  page('our-work/index.html', site.ourWork());
  page('why-stride/index.html', site.standard());
  page('about/index.html', site.about());
  page('contact/index.html', site.contact());
  page('privacy/index.html', site.privacy());
  page('terms/index.html', site.terms());
  page('thank-you/index.html', site.thankYou());
  page('404.html', site.notFound());
  page('learn/index.html', learn.learnHub(articles, facts));
  for (const a of articles) page(`learn/${a.slug}/index.html`, learn.articlePage(a, articles));
  page('faqs/index.html', learn.faqsPage(groups));
  let guidesHtml = learn.guidesPage();
  guidesHtml = guidesHtml.replace(/\{\{size:([^}]+)\}\}/g, (_, f) => {
    const p = path.join(OUT, 'guides/files', f);
    return fs.existsSync(p) ? `PDF · ${(fs.statSync(p).size / 1048576).toFixed(1)} MB` : 'PDF';
  });
  page('guides/index.html', guidesHtml);
  page('quote/index.html', forms.quotePage());
  page('book/index.html', forms.bookPage());
  await Promise.all(P);
  // Guide PDFs are generated separately but belong to the site.
  const gdir = path.join(OUT, 'guides/files');
  if (fs.existsSync(gdir)) for (const f of fs.readdirSync(gdir)) written.add(`guides/files/${f}`);
  console.log(`  pages: ${P.length} (${articles.length} articles, ${groups.reduce((n, g) => n + g.items.length, 0)} research FAQs)`);
  return { articles };
}

/* ----------------------------------------------------------- site files */
async function siteFiles({ articles }) {
  const urls = ['/', '/services/', ...SERVICES.map((s) => `/services/${s.slug}/`), '/service-areas/', ...AREAS.map((a) => `/service-areas/${a.slug}/`),
    '/our-work/', '/why-stride/', '/about/', '/contact/', '/learn/', ...articles.map((a) => `/learn/${a.slug}/`), '/faqs/', '/guides/', '/quote/', '/book/', '/privacy/', '/terms/'];
  const today = new Date().toISOString().slice(0, 10);
  await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${SITE.origin}${SITE.base}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  await write('robots.txt', SITE.preview
    ? '# Preview build — kept out of search so it cannot compete with the\n# production domain for the same content.\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${SITE.origin}${SITE.base}/sitemap.xml\n`);
  await write('site.webmanifest', JSON.stringify({ name: SITE.name, short_name: SITE.short, description: 'Exterior cleaning across the Redlands & Greater Brisbane.', start_url: `${SITE.base}/`, display: 'browser', background_color: '#FFFFFF', theme_color: '#FFFFFF', icons: [192, 512].map((s) => ({ src: `${SITE.base}/assets/brand/icon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })) }, null, 2));
  // Honoured by Netlify/Cloudflare Pages; ignored (harmlessly) by GitHub Pages.
  await write('_headers', `/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https:\n`);
  await write('.nojekyll', '');
}

/* ---------------------------------------------------------------- clean */
async function clean() {
  const mf = path.join(CACHE, 'manifest.json');
  let prev = [];
  try { prev = JSON.parse(await fsp.readFile(mf, 'utf8')); } catch {}
  let removed = 0;
  for (const rel of prev) {
    if (written.has(rel)) continue;
    const f = path.join(OUT, rel);
    if (fs.existsSync(f)) { await fsp.unlink(f); removed++; }
  }
  await fsp.mkdir(CACHE, { recursive: true });
  await fsp.writeFile(mf, JSON.stringify([...written].sort(), null, 0));
  if (removed) console.log(`  removed ${removed} stale files`);
}

console.log(`Building Stride (${SITE.preview ? 'preview' : 'production'}) → ${OUT}  base="${SITE.base}"`);
await media();
await assets();
const ctx = await pages();
await siteFiles(ctx);
await clean();
console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${written.size} files.`);
