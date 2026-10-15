import { esc, u, icon, arr, pic } from '../lib/html.mjs';
import { MEDIA } from '../lib/media.mjs';
import { SERVICES, SERVICE_BY_ID } from '../content/services.mjs';
import { AREAS, MAP_EXTRAS } from '../content/areas.mjs';

let figN = 0;
export const resetFigures = () => { figN = 0; };

/** Captioned figure. Stock is always labelled as demonstration photography. */
export function figure(name, { caption = '', alt = '', ratio = 'ratio-photo', sizes = '(min-width: 1000px) 50vw, 100vw', cls = '', reveal = true, eager = false } = {}) {
  figN++;
  const kind = MEDIA[name]?.kind;
  const tag = kind === 'stock' ? 'Demonstration photograph' : kind === 'render' ? 'Stride 3D study' : '';
  return `<figure class="fig ${cls}"${reveal ? ' data-reveal' : ''}>
  <div class="fig-frame ${ratio}">${pic(name, { alt, sizes, eager })}</div>
  <figcaption><span class="spec spec--ink">Fig. ${String(figN).padStart(2, '0')}${caption ? ' — ' + esc(caption) : ''}</span><span class="spec">${tag}</span></figcaption>
</figure>`;
}

export const WORK = [
  { id: 'driveway', title: 'Exposed concrete driveway', surface: 'Broom-finished concrete', method: 'Rotary surface clean', service: 'driveway' },
  { id: 'pavers', title: 'Concrete paver courtyard', surface: 'Concrete pavers', method: 'Surface clean + re-sand joints', service: 'patio' },
  { id: 'poolside', title: 'Pool surround', surface: 'Tumbled pavers & coping', method: 'Low-pressure, run-off managed', service: 'pool' }
];

export function beforeAfter(id, { label = '', start = 50, eager = false } = {}) {
  const w = WORK.find((x) => x.id === id);
  return `<div class="ba ratio-photo" data-ba style="--pos:${start}%">
  ${pic(`ba-${id}-before`, { alt: `${w.title} before cleaning (demonstration)`, sizes: '(min-width: 1000px) 60vw, 100vw', eager })}
  <div class="ba-after">${pic(`ba-${id}-after`, { alt: `${w.title} after cleaning (demonstration)`, sizes: '(min-width: 1000px) 60vw, 100vw', eager })}</div>
  <span class="ba-line" aria-hidden="true"></span>
  <span class="spec ba-tag ba-tag--b">Before</span><span class="spec ba-tag ba-tag--a">After</span>
  <input type="range" min="0" max="100" value="${start}" aria-label="${esc(label || 'Compare before and after: ' + w.title)}" aria-valuetext="${start}% after">
  <span class="ba-knob" aria-hidden="true">${icon('drag')}</span>
</div>`;
}

export function sectionHead(title, lede = '', { idx = '', h = 'h2', cls = 'h2' } = {}) {
  return `<div class="sec-head">
  <div>${idx ? `<span class="spec idx">${idx}</span>` : ''}<${h} class="${cls}">${title}</${h}></div>
  ${lede ? `<p class="lede">${lede}</p>` : ''}
</div>`;
}

export function surfaceIndex(list = SERVICES) {
  return `<div class="index" data-index>
${list.map((s) => `  <a class="index-row" href="${u(`/services/${s.slug}/`)}"${s.img ? ` data-peek="${u(`/assets/img/${s.img}-520.webp`)}"` : ''}>
    <span class="spec n">${s.n}</span>
    ${s.img ? pic(s.img, { alt: '', sizes: '84px' }).replace('<img ', '<img class="thumb" ') : `<span class="thumb thumb--icon">${icon(s.icon)}</span>`}
    <h3>${esc(s.name)}</h3>
    <span class="spec c2">${esc(s.surfaces)}</span>
    <span class="spec c3">${esc(s.method)}</span>
    <span class="spec c4">Pressure · ${esc(s.pressure)}</span>
    <span class="go" aria-hidden="true">${icon('arrow')}</span>
  </a>`).join('\n')}
</div>
<div class="index-peek" aria-hidden="true" data-index-peek><img alt=""></div>`;
}

export function specsheet(rows) {
  return `<dl class="specsheet">${rows.map(([k, v]) => `<div><dt class="spec">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

export function ticks(items) { return `<ul class="ticks">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`; }

export function faqList(items, { idPrefix = 'q' } = {}) {
  return `<div class="faq">${items.map(([q, a, sources], i) => `<details id="${idPrefix}-${i + 1}"><summary>${esc(q)}<span class="pm" aria-hidden="true"></span></summary><div class="faq-body"><div>${a.startsWith('<') ? a : `<p>${esc(a)}</p>`}${sources && sources.length ? `<p class="small mt-1">Source${sources.length > 1 ? 's' : ''}: ${sources.map((s) => `<a class="link" href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title)}</a>`).join('; ')}</p>` : ''}</div></div></details>`).join('')}</div>`;
}

export function crumbs(list) {
  return `<nav aria-label="Breadcrumb"><ol class="crumbs spec">${list.map(([name, href], i) => `<li>${i < list.length - 1 ? `<a href="${u(href)}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`}</li>`).join('')}</ol></nav>`;
}

export function cta({ title = 'Ready to see your home <span class="blue">clean</span>?', text = 'Tell us what needs cleaning and where. Photos help us quote without a visit — we’ll come back with a clear scope, a price, and our honest read on what actually needs doing.', art = 'ba-driveway-after' } = {}) {
  return `<section class="cta section" aria-labelledby="cta-h">
  <div class="wrap cta-grid">
    <div data-reveal>
      <h2 id="cta-h">${title}</h2>
      <p class="lede mt-2">${text}</p>
      <div class="btn-row mt-3"><a class="btn btn--lg" href="${u('/quote/')}">Get a free quote ${arr()}</a><a class="btn btn--ghost btn--lg" href="${u('/book/')}">Request a booking</a></div>
      <ul class="reassure">${['Free, no obligation', 'Photo quotes, usually within a business day', '$10m public liability'].map((t) => `<li class="spec spec-dot">${t}</li>`).join('')}</ul>
    </div>
    <div class="cta-art" data-reveal>${pic(art, { alt: '', sizes: '(min-width: 900px) 40vw, 90vw' })}<span class="glass-pill spec cta-tag">Demonstration photograph</span></div>
  </div>
</section>`;
}

/* ---------------------------------------------------------------- map */
export function areaMap({ highlight = null } = {}) {
  // Simple equirectangular projection of the Redlands + bayside Brisbane.
  const W = 760, H = 520, minLng = 152.99, maxLng = 153.34, minLat = -27.65, maxLat = -27.42;
  const x = (lng) => ((lng - minLng) / (maxLng - minLng)) * W;
  const y = (lat) => ((maxLat - lat) / (maxLat - minLat)) * H;
  const label = (a) => {
    const right = ['wellington-point', 'cleveland', 'victoria-point', 'redland-bay', 'thornlands', 'ormiston'].includes(a.slug);
    return { dx: right ? 14 : -14, anchor: right ? 'start' : 'end' };
  };
  // Stylised Moreton Bay shoreline (approximate, for orientation only).
  const shore = 'M760,0 L760,520 L705,520 C 700,480 690,452 676,430 C 668,412 672,396 668,380 C 662,352 640,345 634,318 C 628,290 612,272 600,250 C 590,232 584,212 588,190 C 592,170 572,160 556,150 C 538,140 528,120 520,102 C 512,86 500,70 486,58 C 470,44 452,36 440,22 C 432,12 428,4 426,0 Z';
  const towns = AREAS.filter((a) => !a.wide).map((a) => {
    const l = label(a);
    const hi = highlight === a.slug;
    return `<a class="town" href="${u(`/service-areas/${a.slug}/`)}" aria-label="${esc(a.name)}">
      <circle cx="${x(a.ll[1]).toFixed(1)}" cy="${y(a.ll[0]).toFixed(1)}" r="${hi ? 26 : 18}" fill="rgba(0,118,209,${hi ? 0.14 : 0.07})"/>
      <circle class="dot" cx="${x(a.ll[1]).toFixed(1)}" cy="${y(a.ll[0]).toFixed(1)}" r="${hi ? 8 : 6}" fill="${hi ? '#0076D1' : '#fff'}" stroke="#0076D1" stroke-width="2.5"/>
      <text x="${(x(a.ll[1]) + l.dx).toFixed(1)}" y="${(y(a.ll[0]) + 4).toFixed(1)}" text-anchor="${l.anchor}"${hi ? ' font-weight="600"' : ''}>${esc(a.name)}</text>
    </a>`;
  }).join('');
  const extras = MAP_EXTRAS.map((m) => `<g><circle cx="${x(m.ll[1]).toFixed(1)}" cy="${y(m.ll[0]).toFixed(1)}" r="3.5" fill="#8794a3"/><text x="${(x(m.ll[1]) - 9).toFixed(1)}" y="${(y(m.ll[0]) + 4).toFixed(1)}" text-anchor="end" fill="#8794a3" style="fill:#8794a3">${esc(m.name)}</text></g>`).join('');
  return `<figure class="areamap fig" data-reveal>
  <svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="map-t">
    <title id="map-t">Map of the suburbs Stride services across the Redlands and bayside Brisbane</title>
    <defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><line x1="0" y1="0" x2="0" y2="7" stroke="#d6e8f7" stroke-width="1.4"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="#fff"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 95}" y1="0" x2="${i * 95}" y2="${H}" stroke="#eef2f5"/>`).join('')}
    ${Array.from({ length: 6 }, (_, i) => `<line x1="0" y1="${i * 104}" x2="${W}" y2="${i * 104}" stroke="#eef2f5"/>`).join('')}
    <path d="${shore}" fill="url(#hatch)" stroke="#9ccbef" stroke-width="1.2"/>
    <text x="700" y="140" text-anchor="end" fill="#5d93c2" style="fill:#5d93c2;letter-spacing:.3em">MORETON BAY</text>
    ${extras}
    ${towns}
  </svg>
  <figcaption><span class="spec spec--ink">Service area — Redlands core, bayside &amp; south-east Brisbane by arrangement</span><span class="spec">Schematic, not to scale</span></figcaption>
</figure>`;
}

export const svcLink = (id) => { const s = SERVICE_BY_ID[id]; return s ? `<a class="textlink" href="${u(`/services/${s.slug}/`)}">${esc(s.name)} ${arr().replace('class="arr"', 'class="arr"')}</a>` : ''; };
