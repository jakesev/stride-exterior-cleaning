/* Stride — lead delivery.
 *
 * One entry point for every form (quote, booking, contact, guide sign-up):
 *   submitLead(type, fields, photos) -> { ok, ref, mode, mailto }
 *
 * Transports (configured at build time, see content/site.mjs LEADS):
 *   endpoint  multipart POST to the Stride lead API (backend/worker.js):
 *             stores the lead + photos, emails the business, replies with a ref
 *   webhook   JSON POST to an automation webhook (e.g. Airtable). No photo files.
 *   none      nothing configured yet
 *
 * Whatever happens, an enquiry is never silently lost: if delivery isn't
 * configured or fails, the lead is kept in this browser's outbox (retried on
 * the next visit) and the visitor is offered a prefilled email instead. */

const OUTBOX = 'stride-outbox-v1';
const cfg = () => (window.STRIDE_CONFIG && window.STRIDE_CONFIG.leads) || { transport: 'none' };
const contactEmail = () => (window.STRIDE_CONFIG && window.STRIDE_CONFIG.email) || 'info@strideexteriorcleaning.com.au';

export function makeRef(type) {
  const d = new Date();
  const ymd = d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3))).map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 4).toUpperCase();
  return `${{ quote: 'Q', booking: 'B', contact: 'C', guide: 'G' }[type] || 'L'}${ymd}-${rand}`;
}

function source() {
  try { return JSON.parse(sessionStorage.getItem('stride-src') || 'null') || {}; } catch { return {}; }
}

/* -------------------------------------------------------------- photos */
/** Downscale a photo in the browser. Re-encoding also strips EXIF (incl. GPS). */
export async function preparePhoto(file, { maxEdge = 1800, quality = 0.82 } = {}) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch {
    bmp = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
  }
  const w = bmp.width, h = bmp.height, k = Math.min(1, maxEdge / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  if (bmp.close) bmp.close();
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', quality));
  const name = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg' });
}

/* ----------------------------------------------------------- delivery */
async function withTimeout(promise, ms) {
  let t;
  return Promise.race([promise, new Promise((_, rej) => { t = setTimeout(() => rej(new Error('timeout')), ms); })]).finally(() => clearTimeout(t));
}

async function viaEndpoint(lead, photos) {
  const fd = new FormData();
  fd.append('lead', JSON.stringify(lead));
  photos.forEach((p, i) => fd.append('photos', p, `${lead.ref}-${i + 1}.jpg`));
  const res = await withTimeout(fetch(cfg().endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }), 45000);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json().catch(() => ({}));
  if (data.ok === false) throw new Error(data.error || 'rejected');
  return { ref: data.ref || lead.ref };
}

async function viaWebhook(lead) {
  const body = JSON.stringify(lead);
  try {
    const res = await withTimeout(fetch(cfg().webhook, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } }), 20000);
    if (!res.ok) throw new Error('HTTP ' + res.status);
  } catch (err) {
    // Some automation webhooks don't send CORS headers. A no-cors POST still
    // delivers the body; we just can't read the reply.
    if (String(err.message).startsWith('HTTP')) throw err;
    await withTimeout(fetch(cfg().webhook, { method: 'POST', mode: 'no-cors', body, headers: { 'Content-Type': 'text/plain' } }), 20000);
  }
  return { ref: lead.ref };
}

/* --------------------------------------------------------------- outbox */
function readOutbox() { try { return JSON.parse(localStorage.getItem(OUTBOX) || '[]'); } catch { return []; } }
function writeOutbox(list) { try { localStorage.setItem(OUTBOX, JSON.stringify(list.slice(-10))); } catch {} }
function keep(lead) { const l = readOutbox().filter((x) => x.ref !== lead.ref); l.push(lead); writeOutbox(l); }
function drop(ref) { writeOutbox(readOutbox().filter((x) => x.ref !== ref)); }

/** Retry anything left in the outbox (photos are not kept, only details). */
export async function flushOutbox() {
  const c = cfg();
  if (c.transport === 'none') return 0;
  let sent = 0;
  for (const lead of readOutbox()) {
    try {
      if (c.transport === 'endpoint') await viaEndpoint({ ...lead, retried: true }, []);
      else if (c.transport === 'webhook') await viaWebhook({ ...lead, retried: true });
      drop(lead.ref); sent++;
    } catch { /* keep for next time */ }
  }
  return sent;
}

/* ---------------------------------------------------------------- email */
export function summarise(lead) {
  const L = [];
  const f = lead.fields;
  L.push(`${{ quote: 'Quote request', booking: 'Booking request', contact: 'Message', guide: 'Guide sign-up' }[lead.type]} — ref ${lead.ref}`);
  if (f.servicesLabels && f.servicesLabels.length) L.push('Services: ' + f.servicesLabels.join(', '));
  const show = [['Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Address', 'address'], ['Postcode', 'postcode'], ['Property', 'propertyType'], ['Storeys', 'storeys'],
    ['Roof', 'roofType'], ['Driveway', 'drivewaySize'], ['Windows', 'windowCount'], ['Timing', 'timing'], ['Preferred dates', 'dates'], ['Time of day', 'window'], ['Contact by', 'contactPref'], ['Notes', 'notes'], ['Message', 'message']];
  show.forEach(([label, key]) => { const v = f[key]; if (v && String(v).trim()) L.push(`${label}: ${Array.isArray(v) ? v.join(', ') : v}`); });
  if (lead.photoCount) L.push(`Photos: ${lead.photoCount} (please attach them to this email)`);
  return L.join('\n');
}
export function mailtoFor(lead) {
  const subject = encodeURIComponent(`${lead.type === 'booking' ? 'Booking request' : lead.type === 'quote' ? 'Quote request' : 'Enquiry'} ${lead.ref}`);
  return `mailto:${contactEmail()}?subject=${subject}&body=${encodeURIComponent(summarise(lead))}`;
}

/* ------------------------------------------------------------------ API */
export async function submitLead(type, fields, photos = [], extra = {}) {
  const lead = {
    ref: makeRef(type), type, createdAt: new Date().toISOString(),
    page: location.pathname, source: source(), fields, photoCount: photos.length, ...extra,
    client: { lang: navigator.language, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, w: innerWidth }
  };
  const c = cfg();
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  try {
    if (c.transport === 'endpoint' && c.endpoint) { const r = await viaEndpoint(lead, photos); return { ok: true, ref: r.ref, mode: 'endpoint', lead }; }
    if (c.transport === 'webhook' && c.webhook) { const r = await viaWebhook(lead); return { ok: true, ref: r.ref, mode: 'webhook', lead, photosNotSent: photos.length > 0 }; }
  } catch (err) {
    keep(lead);
    return { ok: false, ref: lead.ref, mode: 'failed', error: String(err.message || err), lead, mailto: mailtoFor(lead) };
  }
  keep(lead);
  return { ok: false, ref: lead.ref, mode: local ? 'preview' : 'unconfigured', lead, mailto: mailtoFor(lead) };
}
