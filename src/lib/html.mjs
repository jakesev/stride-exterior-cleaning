/* Small HTML helpers shared by every template. */
import { SITE } from '../content/site.mjs';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Site-relative URL with the deploy base path ("/stride-exterior-cleaning" on the preview). */
export const u = (p = '/') => {
  if (/^(https?:|mailto:|tel:|#)/.test(p)) return p;
  return SITE.base + (p.startsWith('/') ? p : '/' + p);
};
export const abs = (p = '/') => SITE.origin + u(p);

export const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? flat(vals[i]) : ''), '');
const flat = (v) => (v == null || v === false ? '' : Array.isArray(v) ? v.map(flat).join('') : String(v));

export const attrs = (o) => Object.entries(o).filter(([, v]) => v !== false && v != null)
  .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

/* --------------------------------------------------------------- icons */
const I = {
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  down: '<path d="M12 4v15M6 13l6 6 6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2h5.6l1.5 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="1.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.5"/><path d="M4 7l8 6 8-6"/>',
  phone: '<path d="M6.5 4h3l1.5 4-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4.5 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  download: '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 19.5h15"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  shield: '<path d="M12 3.5l7 2.8v5.4c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.3z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  drag: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M3 12h18"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9"/>',
  sparkle: '<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"/>',
  doc: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6"/>',
  roof: '<path d="M3 12L12 5l9 7"/><path d="M5.5 10.5V19h13v-8.5"/>',
  drop: '<path d="M12 3.5s6 6.5 6 10.5a6 6 0 0 1-12 0c0-4 6-10.5 6-10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  grid: '<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M3.5 12h17M12 3.5v17"/>',
  house: '<path d="M4 20V10l8-6 8 6v10z"/><path d="M9.5 20v-6h5v6"/>',
  gutter: '<path d="M3 7h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z"/><path d="M17 13v7"/>',
  window: '<rect x="4.5" y="3.5" width="15" height="17" rx="1"/><path d="M12 3.5v17M4.5 12h15"/>',
  path: '<path d="M8 21l2-18M16 21l-2-18M9.6 8h4.8M9 14h6"/>',
  pool: '<path d="M3 15c2 0 2 1.5 4.5 1.5S10 15 12 15s2.5 1.5 4.5 1.5S19 15 21 15M3 19c2 0 2 1.5 4.5 1.5S10 19 12 19s2.5 1.5 4.5 1.5S19 19 21 19M8 13V5a2 2 0 0 1 4 0M16 13V5"/>',
  solar: '<path d="M4 17l2-10h12l2 10z"/><path d="M5 12h14M9.5 7l-1 10M14.5 7l1 10"/>',
  more: '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
  warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.4v.1"/>'
};
export const icon = (name, cls = '') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[name] || ''}</svg>`;
export const arr = () => icon('arrow', 'arr');

/* ------------------------------------------------------------- images */
import { MEDIA } from './media.mjs';

/** Responsive <picture> for a processed image. */
export function pic(name, { alt = '', sizes = '100vw', cls = '', eager = false, priority = false, style = '' } = {}) {
  const m = MEDIA[name];
  if (!m) throw new Error('Unknown image: ' + name);
  const set = (fmt) => m.widths.map((w) => `${u(`/assets/img/${name}-${w}.${fmt}`)} ${w}w`).join(', ');
  const fallbackW = m.widths[Math.min(1, m.widths.length - 1)];
  return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img src="${u(`/assets/img/${name}-${fallbackW}.webp`)}" alt="${esc(alt)}" width="${m.w}" height="${m.h}" ${eager ? '' : 'loading="lazy" '}decoding="async"${priority ? ' fetchpriority="high"' : ''}${style ? ` style="${style}"` : ''}></picture>`;
}
export const imgUrl = (name, w) => u(`/assets/img/${name}-${w || MEDIA[name].widths.at(-1)}.webp`);
