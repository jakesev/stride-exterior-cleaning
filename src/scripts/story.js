/* "The Clean Pass" — scroll controller for the homepage story.
 *
 * Progressive enhancement: the markup is a readable stack of chapters with a
 * still image each. Only when WebGL runs and motion is welcome do we pin the
 * stage, mount the 3D maquette and let scroll drive it. */
import { mountMaquette, SWEEP_FROM } from './maquette.js';
import { CHAPTERS, STORY_HOTSPOTS, LAYER_LABELS } from '../content/story.mjs';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const clamp = (t) => Math.max(0, Math.min(1, t));
const track = (e, p) => window.strideTrack && window.strideTrack(e, p);

export function startStory(root) {
  const stage = $('[data-story-stage]', root);
  const frame = $('[data-frame]', root);
  const chapters = $$('[data-chapter]', root);
  const rail = $$('[data-rail] button', root);
  const lensRing = $('[data-lens]', root);
  const lensOut = $('[data-lens-out]', root);
  const hotEls = Object.fromEntries($$('[data-hot]', root).map((el) => [el.dataset.hot, el]));
  const layerEls = $$('[data-layer-label]', root);
  const meters = $$('[data-meter]', root);
  const coarse = matchMedia('(pointer: coarse)').matches;

  let api;
  try {
    api = mountMaquette(stage, { refAspect: 1600 / 1300, state: { cam: CHAPTERS[0].cam, ...CHAPTERS[0].state(0) }, onFrame: placeOverlays });
  } catch (err) {
    console.warn('[stride] 3D story unavailable', err);
    return false;
  }
  root.classList.add('is-live');
  // Size the scroll track: total of chapter lengths in viewport heights.
  const total = CHAPTERS.reduce((s, c) => s + c.vh, 0);
  root.style.setProperty('--story-vh', String(total + 1));
  requestAnimationFrame(() => stage.classList.add('is-ready'));

  /* ------------------------------------------------------ scroll → state */
  const starts = []; let acc = 0;
  CHAPTERS.forEach((c) => { starts.push(acc); acc += c.vh; });
  let active = -1, localT = 0;

  function onScroll() {
    const r = root.getBoundingClientRect();
    const vh = innerHeight;
    const scrolled = clamp(-r.top / Math.max(1, r.height - vh)) * total;     // in "vh" units
    let i = CHAPTERS.length - 1;
    for (let k = 0; k < CHAPTERS.length; k++) if (scrolled < starts[k] + CHAPTERS[k].vh) { i = k; break; }
    const t = clamp((scrolled - starts[i]) / CHAPTERS[i].vh);
    localT = t;
    const c = CHAPTERS[i];
    const s = c.state(t);
    api.set({ cam: c.cam, ...s, look: i === 0 || i === CHAPTERS.length - 1 });
    if (i !== active) setChapter(i);
    updateReadouts(i, t, s);
    const p = scrolled / total;
    root.style.setProperty('--story-p', p.toFixed(4));
  }

  function setChapter(i) {
    const prev = active;
    active = i;
    chapters.forEach((el, k) => {
      el.classList.toggle('is-active', k === i);
      el.toggleAttribute('inert', k !== i);
    });
    rail.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'step' : 'false'));
    root.dataset.chapter = CHAPTERS[i].id;
    if (prev !== -1) track('story_chapter', { chapter: CHAPTERS[i].id, index: i });
    if (CHAPTERS[i].id === 'vision') startLensAuto(); else stopLensAuto();
  }

  /* ------------------------------------------------------------- readouts */
  function updateReadouts(i, t, s) {
    meters.forEach((m) => {
      const key = m.dataset.meter;
      let v = null;
      if (key === 'roof') v = s.kinds.roof;
      else if (key === 'drive') v = s.drive;
      else if (key === 'layers') v = s.explode;
      if (v == null) return;
      m.style.setProperty('--p', v.toFixed(3));
      const out = $('[data-meter-val]', m.closest('[data-chapter]') || root);
      $$('[data-val="' + key + '"]', root).forEach((o) => {
        o.textContent = key === 'layers' ? `${Math.round(v * 5)} / 5` : `${Math.round(v * 100)}%`;
      });
    });
    const lane = $('[data-val="lane"]', root);
    if (lane) lane.textContent = `${Math.min(3, Math.floor(s.drive * 3) + 1)} of 3`;
  }

  /* --------------------------------------------------- overlay placement */
  // project() returns fractions of the canvas (= stage); overlays live in the frame.
  function toFrame(p) {
    const F = api.frameRect, W = stage.clientWidth, H = stage.clientHeight;
    return { x: (p.x * W - F.x) / F.w, y: (p.y * H - F.y) / F.h };
  }
  function placeOverlays() {
    const showHot = active === 0 || active === CHAPTERS.length - 1;
    STORY_HOTSPOTS.forEach((h) => {
      const el = hotEls[h.id];
      if (!el) return;
      const p = toFrame(api.project(h.at, h.layer));
      el.style.left = (p.x * 100).toFixed(2) + '%';
      el.style.top = (p.y * 100).toFixed(2) + '%';
      el.classList.toggle('is-hidden', !showHot || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1);
    });
    const ex = active === 2;
    layerEls.forEach((el, k) => {
      const L = LAYER_LABELS[k];
      const p = toFrame(api.project(L.at, L.layer));
      el.style.left = (p.x * 100).toFixed(2) + '%';
      el.style.top = (p.y * 100).toFixed(2) + '%';
      el.classList.toggle('is-on', ex && localT > 0.18 + k * 0.03 && localT < 0.9);
    });
  }

  /* -------------------------------------------------------- grime vision */
  let lens = { x: 0, y: 0, r: 120 }, lensAuto = 0, lensAutoT = 0, lastPick = 0, userLens = false;
  function setLens(x, y) {
    const fr = frame.getBoundingClientRect();
    lens.x = x; lens.y = y;
    lens.r = Math.max(70, Math.min(150, fr.width * 0.13));
    api.set({ lens: { x: x + api.frameRect.x, y: y + api.frameRect.y, r: lens.r } });
    if (lensRing) {
      lensRing.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      lensRing.style.setProperty('--r', lens.r + 'px');
    }
    const now = performance.now();
    if (now - lastPick > 90 && lensOut) {
      lastPick = now;
      const hit = api.pick(fr.left + x, fr.top + y);
      if (hit) {
        $('[data-lens-name]', lensOut).textContent = hit.info.name;
        $('[data-lens-growth]', lensOut).textContent = hit.info.growth;
        $('[data-lens-method]', lensOut).textContent = hit.info.method;
        lensOut.dataset.surface = hit.surface;
      }
    }
  }
  function startLensAuto() {
    if (lensAuto) return;
    const loop = (now) => {
      lensAuto = requestAnimationFrame(loop);
      if (userLens) return;
      lensAutoT = now / 1000;
      const fr = frame.getBoundingClientRect();
      setLens(fr.width * (0.5 + 0.22 * Math.sin(lensAutoT * 0.6)), fr.height * (0.52 + 0.16 * Math.sin(lensAutoT * 0.9 + 1)));
    };
    lensAuto = requestAnimationFrame(loop);
  }
  function stopLensAuto() { cancelAnimationFrame(lensAuto); lensAuto = 0; userLens = false; }

  /* ---------------------------------------------------------------- input */
  let down = null, moved = false;
  stage.addEventListener('pointermove', (e) => {
    const fr = frame.getBoundingClientRect();
    const nx = (e.clientX - fr.left) / fr.width, ny = (e.clientY - fr.top) / fr.height;
    api.lookAt((nx - 0.5) * 2, (ny - 0.5) * 2);
    if (active === 3 && e.pointerType === 'mouse') { userLens = true; setLens(e.clientX - fr.left, e.clientY - fr.top); }
    if (down) {
      if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) moved = true;
      if (moved && active === 0 && api.brushTo(e.clientX, e.clientY)) {
        root.classList.add('has-brushed');
        if (api.brushed === 12) track('hero_brush', {});
      }
    }
  });
  stage.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a,button')) return;
    // Touch only brushes when the press lands on the model, so the page still scrolls.
    if (e.pointerType !== 'mouse' && !api.pick(e.clientX, e.clientY)) return;
    down = { x: e.clientX, y: e.clientY }; moved = false;
    if (active === 3) { userLens = true; const fr = frame.getBoundingClientRect(); setLens(e.clientX - fr.left, e.clientY - fr.top); }
  });
  const up = (e) => {
    if (down && !moved && e.type === 'pointerup') { if (api.splash(e.clientX, e.clientY)) { sound.splash(); track('story_splash', { chapter: CHAPTERS[active].id }); } }
    down = null; api.endBrush();
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('pointerleave', () => { api.lookAt(0, 0); down = null; api.endBrush(); if (active === 3) userLens = false; });

  rail.forEach((b, k) => b.addEventListener('click', () => {
    const r = root.getBoundingClientRect();
    const y = scrollY + r.top + (starts[k] + (k ? 0.35 * CHAPTERS[k].vh : 0)) / total * (r.height - innerHeight);
    scrollTo({ top: y, behavior: 'smooth' });
  }));

  /* ----------------------------------------------------------------- sound */
  const sound = makeSound($('[data-sound]', root));

  addEventListener('scroll', () => { onScroll(); sound.activity(); }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
  return true;
}

/* Water sound, synthesised (no audio files): filtered noise that swells while
 * the story is moving. Off by default; the toggle is the only way to start it. */
function makeSound(btn) {
  let ctx = null, gain = null, on = false, decay = 0;
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.6;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
    gain = ctx.createGain(); gain.gain.value = 0;
    src.connect(bp).connect(lp).connect(gain).connect(ctx.destination);
    src.start();
  }
  if (btn) btn.addEventListener('click', () => {
    on = !on;
    btn.setAttribute('aria-pressed', String(on));
    btn.querySelector('span').textContent = on ? 'Sound on' : 'Sound off';
    if (on && !ctx) build();
    if (ctx) (on ? ctx.resume() : ctx.suspend());
    track('story_sound', { on });
  });
  return {
    activity() {
      if (!on || !gain) return;
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(0.11, t, 0.05);
      clearTimeout(decay);
      decay = setTimeout(() => gain && gain.gain.setTargetAtTime(0, ctx.currentTime, 0.25), 140);
    },
    splash() {
      if (!on || !ctx) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(240, t + 0.18);
      g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.25);
    }
  };
}
