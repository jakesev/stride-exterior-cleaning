/* Stride — forms: quote & booking flows, contact, guide sign-up, thank-you. */
import * as Q from './qualify.js';
import { submitLead, preparePhoto, flushOutbox } from './leads.js';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const BASE = window.STRIDE_BASE || '';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const track = (e, p) => window.strideTrack && window.strideTrack(e, p);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const cfg = () => window.STRIDE_CONFIG || {};

/* ---------------------------------------------------------- validation */
function clearErrors(scope) {
  $$('.has-error', scope).forEach((n) => n.classList.remove('has-error'));
  $$('.ferr', scope).forEach((n) => n.remove());
  $$('[aria-invalid]', scope).forEach((n) => n.removeAttribute('aria-invalid'));
}
function fail(el, msg) {
  const wrap = el.closest('.field') || el.closest('fieldset') || el.closest('.consent') || el.parentElement;
  wrap.classList.add('has-error');
  const p = document.createElement('p');
  p.className = 'ferr'; p.id = 'err-' + Math.random().toString(36).slice(2, 8);
  p.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.4v.1"/></svg><span></span>';
  p.lastChild.textContent = msg;
  (el.closest('.consent') || wrap).insertAdjacentElement(el.closest('.consent') ? 'afterend' : 'beforeend', p);
  el.setAttribute('aria-invalid', 'true');
  el.setAttribute('aria-describedby', p.id);
}
function validate(scope) {
  clearErrors(scope);
  let first = null;
  const seenRadio = new Set();
  $$('[required]', scope).forEach((el) => {
    if (el.closest('[hidden]') && el.type !== 'hidden') return;
    let bad = false;
    if (el.type === 'radio') {
      if (seenRadio.has(el.name)) return;
      seenRadio.add(el.name);
      bad = !scope.querySelector(`input[name="${el.name}"]:checked`);
    } else if (el.type === 'checkbox') bad = !el.checked;
    else {
      const v = (el.value || '').trim();
      bad = !v;
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      if (!bad && el.type === 'tel') bad = v.replace(/\D/g, '').length < 8;
      if (!bad && el.hasAttribute('data-postcode')) bad = !/^\d{4}$/.test(v);
    }
    if (bad) { fail(el.type === 'hidden' ? (el.closest('fieldset') || el) : el, el.getAttribute('data-error') || 'This one is needed.'); first = first || el; }
  });
  if (first) {
    const f = first.type === 'hidden' ? first.closest('fieldset') : first;
    f.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    if (first.focus && first.type !== 'hidden') setTimeout(() => first.focus({ preventScroll: true }), 250);
  }
  return !first;
}
// Clear an error as soon as the person fixes it.
document.addEventListener('input', (e) => {
  const w = e.target.closest('.has-error');
  if (w) { w.classList.remove('has-error'); $$('.ferr', w).forEach((n) => n.remove()); e.target.removeAttribute('aria-invalid'); }
});
document.addEventListener('change', (e) => {
  const w = e.target.closest('.has-error');
  if (w) { w.classList.remove('has-error'); $$('.ferr', w).forEach((n) => n.remove()); }
  const c = e.target.closest('.consent'); if (c && c.nextElementSibling && c.nextElementSibling.classList.contains('ferr')) c.nextElementSibling.remove();
});

function formData(form) {
  const out = {};
  new FormData(form).forEach((v, k) => {
    if (v instanceof File) return;
    if (k === 'company_website') return;
    if (k in out) out[k] = [].concat(out[k], v); else out[k] = v;
  });
  return out;
}
const isBot = (form, started) => {
  const hp = form.querySelector('[name="company_website"]');
  return (hp && hp.value) || Date.now() - started < 2500;
};

function showStatus(form, html, kind) {
  const st = $('[data-form-status]', form);
  if (!st) return;
  st.hidden = false;
  st.className = 'status status--' + kind;
  st.innerHTML = html;
  st.setAttribute('role', kind === 'err' ? 'alert' : 'status');
  st.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
}
function fallbackMessage(res) {
  const copyId = 'copy-' + res.ref;
  const why = res.mode === 'preview' ? '<strong>Preview mode:</strong> nothing has been sent from this local copy of the site.'
    : res.mode === 'failed' ? '<strong>We couldn’t send that just now</strong> — your connection may have dropped.'
    : '<strong>Online delivery isn’t switched on for this preview address yet.</strong>';
  return `${why} Your details are saved on this device (reference <b>${esc(res.ref)}</b>), so nothing is lost. To reach us now, send them as an email — it’s already written for you:
  <div class="btn-row mt-1"><a class="btn btn--sm" href="${res.mailto}">Open the prefilled email</a><button class="btn btn--ghost btn--sm" type="button" data-copy="${copyId}">Copy the details</button></div>
  <textarea id="${copyId}" class="sr" readonly>${esc(decodeURIComponent(res.mailto.split('body=')[1] || ''))}</textarea>`;
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-copy]');
  if (!b) return;
  const t = document.getElementById(b.dataset.copy);
  try { await navigator.clipboard.writeText(t.value); b.textContent = 'Copied'; } catch { t.classList.remove('sr'); t.select(); }
});

/* --------------------------------------------------- simple lead forms */
$$('[data-lead-form]').forEach((form) => {
  const started = Date.now();
  const type = form.dataset.leadForm;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(form)) { track(`${type}_validation_error`, {}); return; }
    if (isBot(form, started)) { showStatus(form, 'Thanks — received.', 'ok'); return; }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true; btn.setAttribute('aria-busy', 'true');
    const res = await submitLead(type, formData(form));
    btn.disabled = false; btn.removeAttribute('aria-busy');
    track(`${type}_submit`, { result: res.ok ? 'sent' : res.mode });
    if (res.ok) {
      form.reset();
      showStatus(form, type === 'guide'
        ? `<strong>You’re on the list.</strong> The first reminder arrives before the next season change. Reference ${esc(res.ref)}.`
        : `<strong>Message sent.</strong> We’ll reply within one business day. Reference ${esc(res.ref)}.`, 'ok');
    } else showStatus(form, fallbackMessage(res), 'warn');
  });
});

/* -------------------------------------------------------- flow forms */
const flow = $('[data-flow]');
if (flow) initFlow(flow);

function initFlow(form) {
  const kind = form.dataset.flow;              // quote | book
  const leadType = kind === 'book' ? 'booking' : 'quote';
  const steps = $$('[data-step]', form);
  const btnNext = $('[data-next]', form), btnBack = $('[data-back]', form), btnSend = $('[data-send]', form);
  const label = $('[data-step-label]', form), count = $('[data-step-count]', form), fill = $('[data-progress]', form);
  const C = cfg();
  const started = Date.now();
  let i = 0, first = true, area = null;
  const photos = [];                           // prepared File objects

  const picked = () => $$('input[name="services"]:checked', form).map((c) => c.value);
  const pickedLabels = () => $$('input[name="services"]:checked', form).map((c) => c.closest('label').textContent.trim());
  const radio = (n) => { const el = form.querySelector(`input[name="${n}"]:checked`); return el ? el.value : ''; };
  const radioLabel = (n) => { const el = form.querySelector(`input[name="${n}"]:checked`); return el ? el.closest('label').querySelector('span').childNodes[0].textContent.trim() : ''; };
  const field = (n) => form.querySelector(`[data-field="${n}"]`);

  function show(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    steps.forEach((s, k) => { s.hidden = k !== i; });
    fill.style.setProperty('--p', ((i + 1) / steps.length).toFixed(3));
    label.textContent = steps[i].dataset.label;
    count.textContent = `Step ${i + 1} of ${steps.length}`;
    btnBack.hidden = i === 0;
    btnNext.hidden = i === steps.length - 1;
    btnSend.hidden = i !== steps.length - 1;
    if (i === steps.length - 1) { qualify(); summary(); }
    if (!first) {
      const h = $('h1, h2', steps[i]);
      const top = form.getBoundingClientRect().top + scrollY - 100;
      if (scrollY > top) scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      if (h) h.focus({ preventScroll: true });
      track(`${kind}_step_view`, { step: i + 1, name: steps[i].dataset.label });
    }
    first = false;
  }

  function validateStep() {
    const scope = steps[i];
    let ok = validate(scope);
    if (i === 0 && !picked().length) {
      const g = $('[data-services-group]', scope);
      fail($('input', g), 'Pick at least one service.');
      if (ok) g.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      ok = false;
    }
    return ok;
  }

  btnNext.addEventListener('click', () => {
    if (!validateStep()) { track(`${kind}_validation_error`, { step: i + 1 }); return; }
    track(`${kind}_step_complete`, { step: i + 1 });
    show(i + 1);
  });
  btnBack.addEventListener('click', () => show(i - 1));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
      e.preventDefault();
      if (i < steps.length - 1) btnNext.click();
    }
  });

  /* postcode */
  const pc = $('[data-postcode]', form), out = $('[data-area-result]', form);
  function checkPostcode() {
    const v = (pc.value || '').trim();
    if (!/^\d{4}$/.test(v) || !C.areas) { out.hidden = true; area = null; return; }
    area = Q.resolveArea(v, C.areas);
    out.hidden = false;
    out.className = 'area-result area-' + area.tier;
    out.textContent = (area.tier === 'core' ? '✓ ' : '') + area.message + (area.label ? ` (${area.label})` : '');
    track('postcode_check', { result: area.tier });
  }
  pc.addEventListener('input', () => { pc.value = pc.value.replace(/\D/g, '').slice(0, 4); checkPostcode(); });

  /* conditionals + upsell */
  const upsell = $('[data-upsell]', form);
  const all = C.flow ? [...C.flow.services.primary, ...C.flow.services.more] : [];
  const byId = Object.fromEntries(all.map((s) => [s.id, s]));
  function onServices() {
    const sel = picked();
    $$('[data-when]', form).forEach((fs) => { fs.hidden = !sel.includes(fs.dataset.when); });
    if (!upsell || !C.flow) return;
    let prompt = '', suggest = [];
    for (const id of sel) {
      const u = C.flow.upsells[id];
      if (!u) continue;
      const avail = u.suggest.filter((x) => !sel.includes(x) && byId[x]);
      if (avail.length) { prompt = u.prompt; suggest = avail.slice(0, 3); break; }
    }
    upsell.hidden = !suggest.length;
    upsell.innerHTML = suggest.length ? `<p>${esc(prompt)}</p><div class="upsell-row">${suggest.map((id) => `<button type="button" class="upsell-add" data-add="${id}">+ ${esc(byId[id].label)}</button>`).join('')}</div>` : '';
  }
  $$('input[name="services"]', form).forEach((c) => c.addEventListener('change', () => { onServices(); track('service_select', { service: c.value, selected: c.checked }); }));
  if (upsell) upsell.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const input = form.querySelector(`input[name="services"][value="${b.dataset.add}"]`);
    if (input) { input.checked = true; if (input.closest('details')) input.closest('details').open = true; onServices(); track('upsell_add', { service: b.dataset.add }); }
  });
  // Arriving from a service page (?service=roof) pre-ticks that service.
  const pre = new URLSearchParams(location.search).get('service');
  if (pre) { const el = form.querySelector(`input[name="services"][value="${CSS.escape(pre)}"]`); if (el) el.checked = true; }

  /* photos */
  const input = $('[data-files]', form), zone = $('[data-dropzone]', form), thumbs = $('[data-thumbs]', form), fc = $('[data-file-count]', form);
  const L = C.leads || { maxPhotos: 8, maxPhotoMB: 15, photoMaxEdge: 1800, photoQuality: 0.82 };
  function renderThumbs() {
    thumbs.innerHTML = '';
    photos.forEach((f, k) => {
      const d = document.createElement('div'); d.className = 'thumb';
      const img = document.createElement('img'); img.alt = `Photo ${k + 1}`; img.src = URL.createObjectURL(f);
      const rm = document.createElement('button'); rm.type = 'button'; rm.setAttribute('aria-label', `Remove photo ${k + 1}`);
      rm.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      rm.addEventListener('click', () => { photos.splice(k, 1); renderThumbs(); });
      const m = document.createElement('span'); m.className = 'meta'; m.textContent = `${Math.round(f.size / 1024)} KB`;
      d.append(img, rm, m); thumbs.appendChild(d);
    });
    fc.textContent = photos.length ? `${photos.length} photo${photos.length === 1 ? '' : 's'} ready · resized and location data removed` : '';
    const pf = field('photoCount'); if (pf) pf.value = String(photos.length);
  }
  async function addFiles(list) {
    const files = Array.from(list);
    let errors = 0;
    fc.textContent = 'Preparing photos…';
    for (const f of files) {
      if (photos.length >= L.maxPhotos) { errors++; continue; }
      if (!/^image\//.test(f.type) && !/\.(heic|heif)$/i.test(f.name)) { errors++; track('photo_upload_error', { type: 'wrong_type' }); continue; }
      if (f.size > L.maxPhotoMB * 1048576) { errors++; track('photo_upload_error', { type: 'too_large' }); continue; }
      try { photos.push(await preparePhoto(f, { maxEdge: L.photoMaxEdge, quality: L.photoQuality })); }
      catch { errors++; track('photo_upload_error', { type: 'decode' }); }
    }
    renderThumbs();
    if (errors) fc.textContent += (fc.textContent ? ' · ' : '') + `${errors} file${errors === 1 ? '' : 's'} skipped (not a photo, too large, or over the limit of ${L.maxPhotos}).`;
    if (photos.length) track('photo_upload_success', { count: photos.length });
  }
  if (input) {
    input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.remove('is-over'); }));
    zone.addEventListener('drop', (e) => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  }

  /* booking calendar */
  const cal = $('[data-cal]', form);
  const chosen = [];
  if (cal) initCalendar();
  function initCalendar() {
    const grid = $('[data-cal-grid]', cal), title = $('[data-cal-title]', cal);
    const prev = $('[data-cal-prev]', cal), next = $('[data-cal-next]', cal);
    const hidden = $('[data-dates]', form), list = $('[data-picked]', form);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    // Earliest bookable: two business days out. Horizon: ~10 weeks.
    const earliest = new Date(today); let added = 0;
    while (added < 2) { earliest.setDate(earliest.getDate() + 1); if (earliest.getDay() % 6) added++; }
    const latest = new Date(today); latest.setDate(latest.getDate() + 70);
    let view = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const nice = (s) => new Date(s + 'T00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
    function draw() {
      title.textContent = view.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
      const dows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      let html = dows.map((d) => `<div class="dow" role="columnheader">${d}</div>`).join('');
      const firstDow = (view.getDay() + 6) % 7;
      for (let k = 0; k < firstDow; k++) html += '<div></div>';
      const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const dt = new Date(view.getFullYear(), view.getMonth(), d);
        const weekend = dt.getDay() === 0 || dt.getDay() === 6;
        const off = weekend || dt < earliest || dt > latest;
        const id = iso(dt);
        const on = chosen.includes(id);
        html += `<button type="button" class="cal-day${+dt === +today ? ' is-today' : ''}" data-day="${id}" aria-pressed="${on}" ${off ? 'disabled' : ''} aria-label="${dt.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}${off ? ', unavailable' : on ? ', selected' : ''}">${d}</button>`;
      }
      grid.innerHTML = html;
      prev.disabled = view <= new Date(earliest.getFullYear(), earliest.getMonth(), 1);
      next.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > latest;
      list.innerHTML = chosen.map((id) => `<span>${nice(id)}<button type="button" data-unpick="${id}" aria-label="Remove ${nice(id)}">×</button></span>`).join('') || '<span class="small" style="background:none;padding:0">No dates chosen yet.</span>';
      hidden.value = chosen.join(',');
    }
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-day]');
      if (!b || b.disabled) return;
      const id = b.dataset.day, k = chosen.indexOf(id);
      if (k > -1) chosen.splice(k, 1);
      else if (chosen.length < 3) chosen.push(id);
      else { chosen.shift(); chosen.push(id); }
      chosen.sort();
      draw();
      const again = grid.querySelector(`[data-day="${id}"]`); if (again) again.focus();
      track('booking_date_pick', { count: chosen.length });
    });
    list.addEventListener('click', (e) => { const b = e.target.closest('[data-unpick]'); if (b) { chosen.splice(chosen.indexOf(b.dataset.unpick), 1); draw(); } });
    grid.addEventListener('keydown', (e) => {
      const b = e.target.closest('[data-day]'); if (!b) return;
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (!step) return;
      e.preventDefault();
      const all = $$('[data-day]', grid); let k = all.indexOf(b) + step;
      while (all[k] && all[k].disabled) k += Math.sign(step);
      if (all[k]) all[k].focus();
    });
    prev.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); draw(); });
    next.addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); draw(); });
    draw();
  }

  /* qualification + summary */
  function leadShape() {
    return {
      postcode: pc.value.trim(), services: picked(), propertyType: radio('propertyType') || (kind === 'book' ? 'house' : ''),
      storeys: radio('storeys') || (kind === 'book' ? '1' : ''), improve: 'general', timing: radio('timing'),
      photoCount: photos.length,
      flags: Object.fromEntries($$('input[data-flag]:checked', form).map((c) => [c.dataset.flag, true]))
    };
  }
  function qualify() {
    if (!C.areas) return null;
    const lead = leadShape();
    const res = Q.qualifyLead(lead, C), score = Q.scoreLead(lead, C);
    field('qualification').value = res.outcome;
    field('reasons').value = res.reasons.join(', ');
    field('area').value = res.area ? res.area.tier : '';
    field('priority').value = String(score);
    const note = $('[data-qual-note]', form);
    if (note && kind === 'quote') {
      const msg = {
        REMOTE_QUOTE_CANDIDATE: '<strong>Good news:</strong> with your photos we should be able to price this without a visit.',
        MANUAL_REVIEW: photos.length ? '<strong>We’ll take a careful look.</strong> If anything needs checking in person, we’ll book a quick free visit.' : '<strong>Tip:</strong> adding a few photos (step 2) usually lets us quote without a visit.',
        ONSITE_ASSESSMENT: '<strong>This one needs a quick look in person.</strong> We’ll suggest a time for a free assessment — it takes about twenty minutes.',
        OUTSIDE_SERVICE_AREA: '<strong>You’re outside our usual area.</strong> Send it anyway and we’ll let you know honestly whether we can help.'
      }[res.outcome];
      note.hidden = !msg; note.innerHTML = msg || '';
    }
    return res;
  }
  function summary() {
    const dl = $('[data-summary]', form);
    if (!dl) return;
    const rows = [['Services', pickedLabels().join(', ')], ['Postcode', pc.value + (area && area.label ? ` · ${area.label}` : '')]];
    if (radio('propertyType')) rows.push(['Property', `${radioLabel('propertyType')}, ${radioLabel('storeys').toLowerCase()}`]);
    if (chosen.length) rows.push(['Dates', chosen.map((id) => new Date(id + 'T00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })).join(', ') + ` · ${radioLabel('window').toLowerCase()}`]);
    if (radio('timing')) rows.push(['Timing', radioLabel('timing')]);
    rows.push(['Photos', photos.length ? `${photos.length} attached` : 'None']);
    dl.innerHTML = rows.map(([k, v]) => `<div><dt class="spec">${esc(k)}</dt><dd>${esc(v || '—')}</dd></div>`).join('');
  }

  /* submit */
  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!validateStep()) return;
    if (isBot(form, started)) { location.href = BASE + '/thank-you/'; return; }
    const res0 = qualify();
    sending = true;
    btnSend.disabled = true; btnSend.setAttribute('aria-busy', 'true');
    const orig = btnSend.innerHTML;
    btnSend.textContent = photos.length ? `Sending ${photos.length} photo${photos.length === 1 ? '' : 's'}…` : 'Sending…';
    const fields = { ...formData(form), services: picked(), servicesLabels: pickedLabels(), dates: chosen.slice() };
    delete fields.consent; fields.consent = true;
    const res = await submitLead(leadType, fields, photos, { qualification: res0 && { outcome: res0.outcome, reasons: res0.reasons, area: res0.area && res0.area.tier }, priority: Number(field('priority').value || 0) });
    sending = false; btnSend.disabled = false; btnSend.removeAttribute('aria-busy'); btnSend.innerHTML = orig;
    track(`${kind}_submit`, { result: res.ok ? 'sent' : res.mode, services: picked().length, photos: photos.length, outcome: res0 && res0.outcome });
    if (res.ok) {
      try { sessionStorage.setItem('stride-last', JSON.stringify({ ref: res.ref, type: leadType, name: (fields.name || '').split(' ')[0], services: pickedLabels(), dates: chosen, outcome: res0 && res0.outcome, photosNotSent: !!res.photosNotSent })); } catch {}
      location.href = `${BASE}/thank-you/?ref=${encodeURIComponent(res.ref)}&type=${leadType}`;
    } else {
      showStatus(form, fallbackMessage(res), res.mode === 'failed' ? 'err' : 'warn');
    }
  });

  onServices();
  show(0);
  track(`${kind}_start`, { from: document.referrer ? 'internal' : 'direct' });
}

/* ----------------------------------------------------------- thank you */
const ty = $('[data-ty-title]');
if (ty) {
  let last = null;
  try { last = JSON.parse(sessionStorage.getItem('stride-last') || 'null'); } catch {}
  const params = new URLSearchParams(location.search);
  const ref = params.get('ref') || (last && last.ref);
  if (ref) { $('[data-ty-ref]').hidden = false; $('[data-ty-refnum]').textContent = ref; }
  if (last && last.ref === ref) {
    if (last.name) ty.textContent = `Thanks, ${last.name} — that’s with us.`;
    const lede = $('[data-ty-lede]');
    if (last.type === 'booking') lede.textContent = `We’ll confirm one of your dates, the price and an arrival window within one business day. ${last.services && last.services.length ? 'Booked services: ' + last.services.join(', ') + '.' : ''}`;
    else if (last.outcome === 'ONSITE_ASSESSMENT') lede.textContent = 'Your home needs a quick look in person, so we’ll be in touch within one business day to suggest a time for a free twenty-minute assessment.';
    else if (last.outcome === 'REMOTE_QUOTE_CANDIDATE') lede.textContent = 'With your photos we should be able to price this without a visit. Expect a written scope and price within one business day.';
    if (last.photosNotSent) lede.textContent += ' (Photos couldn’t be attached through this channel — we’ll ask for them by email.)';
  }
  track('thank_you_view', { type: params.get('type') || (last && last.type) || 'unknown' });
}

flushOutbox().then((n) => { if (n) track('outbox_flushed', { count: n }); });
