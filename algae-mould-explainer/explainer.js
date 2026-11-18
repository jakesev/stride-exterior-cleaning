// Player for the algae and mould explainer: narration clock, camera and growth
// timeline, captions, labels and the close-up card.

import { createScene, roofY } from './scene.js';
import { closeups } from './closeups.js';

/* Narration timing, generated with the audio. Times are seconds. */
const TIMING = {"duration":94.857,"chapters":[{"id":"intro","title":"More than dirt","start":0,"lines":[{"text":"That green film on the path, and those dark marks on the roof, are more than dirt.","start":0.9,"end":5.454},{"text":"They are alive.","start":5.874,"end":7.208}],"end":8.358},{"id":"what","title":"What it is","start":8.358,"lines":[{"text":"Algae, mould, lichen and moss are living organisms.","start":8.358,"end":11.684},{"text":"They settle wherever a surface stays damp, usually on the shaded side of the house.","start":12.104,"end":17.074},{"text":"In a warm, humid climate like South East Queensland, conditions suit them for most of the year.","start":17.494,"end":23.275}],"end":24.425},{"id":"roof","title":"On the roof","start":24.425,"lines":[{"text":"On the roof, lichen and moss anchor into the tile surface, and hold water against it like a sponge.","start":24.425,"end":30.422},{"text":"Lichen also releases weak acids that slowly wear the surface.","start":30.842,"end":34.851},{"text":"Loose growth then washes down, and can block the gutters.","start":35.271,"end":38.563}],"end":39.713},{"id":"walls","title":"On walls and paint","start":39.713,"lines":[{"text":"On walls, mould and algae feed on the dirt and organic matter sitting on paint and render.","start":39.713,"end":45.258},{"text":"They keep the surface damp for longer, and that moisture can shorten the life of the paint.","start":45.678,"end":50.768}],"end":51.918},{"id":"ground","title":"Underfoot","start":51.918,"lines":[{"text":"Underfoot, the risk is more immediate.","start":51.918,"end":54.38},{"text":"Wet algae forms a slippery film on driveways, paths and decks.","start":54.8,"end":58.593},{"text":"And timber that stays damp is timber that can start to rot.","start":59.013,"end":62.59}],"end":63.74},{"id":"spread","title":"It keeps going","start":63.74,"lines":[{"text":"Left alone, it does not stop.","start":63.74,"end":65.74},{"text":"It spreads, anchors deeper, and gets harder to remove.","start":66.16,"end":69.467}],"end":70.617},{"id":"fix","title":"Treated, not blasted","start":70.617,"lines":[{"text":"The fix is not more pressure.","start":70.617,"end":72.528},{"text":"On most house surfaces, high pressure can cause damage, and still leave living growth behind.","start":72.948,"end":78.643},{"text":"A soft wash treats the growth first, then rinses it away gently.","start":79.063,"end":83.276}],"end":84.426},{"id":"outro","title":"Protect the surface","start":84.426,"lines":[{"text":"A clean exterior is about more than looks.","start":84.426,"end":86.919},{"text":"It protects the surfaces that protect your home.","start":87.339,"end":90.05},{"text":"Stride Exterior Cleaning.","start":90.47,"end":92.258}],"end":94.858}]};

const DUR = TIMING.duration;
const CH = TIMING.chapters;
const C = Object.fromEntries(CH.map((c) => [c.id, c]));
const L = (id, line, offset = 0) => C[id].lines[line].start + offset;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (v, a, b) => clamp((v - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);
const easeIO = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const keys = (pairs) => (t) => {
  if (t <= pairs[0][0]) return pairs[0][1];
  for (let i = 1; i < pairs.length; i++) if (t <= pairs[i][0]) return lerp(pairs[i - 1][1], pairs[i][1], seg(t, pairs[i - 1][0], pairs[i][0]));
  return pairs[pairs.length - 1][1];
};

/* ───────────────────────── timeline ───────────────────────── */

// Camera: each chapter drifts slowly from a to b.
const SHOTS = {
  intro:  { a: { cam: [-13.6, 5.3, 19.6], look: [-0.6, 1.9, 1.0] }, b: { cam: [-11.6, 4.6, 17.2], look: [-0.4, 1.9, 1.0] } },
  what:   { a: { cam: [4.6, 3.5, 20.0], look: [1.4, 2.1, 0.0] },    b: { cam: [7.0, 3.9, 18.6], look: [1.9, 2.1, 0.0] } },
  roof:   { a: { cam: [9.6, 7.8, 12.4], look: [3.4, 3.3, 1.4] },    b: { cam: [8.4, 7.0, 11.0], look: [3.5, 3.4, 1.6] } },
  walls:  { a: { cam: [0.6, 1.9, 13.6], look: [2.0, 1.45, 4.5] },   b: { cam: [1.8, 1.8, 12.6], look: [2.3, 1.45, 4.5] } },
  ground: { a: { cam: [-7.6, 2.2, 14.6], look: [1.7, 0.3, 6.6] },   b: { cam: [-6.4, 1.95, 13.5], look: [2.3, 0.3, 6.5] } },
  spread: { a: { cam: [-2.5, 9.4, 22.5], look: [0.0, 1.5, 0.6] },   b: { cam: [1.0, 10.6, 24.0], look: [0.0, 1.5, 0.6] } },
  fix:    { a: { cam: [-9.4, 5.4, 19.4], look: [0.0, 1.9, 1.0] },   b: { cam: [-5.0, 4.9, 20.0], look: [0.3, 1.9, 1.0] } },
  outro:  { a: { cam: [-10.6, 4.2, 17.0], look: [0.0, 1.9, 1.0] },  b: { cam: [-12.8, 4.7, 19.4], look: [0.0, 2.0, 1.0] } },
};
const CUT = 1.9;   // seconds to travel from one shot to the next

function shotAt(c, t) {
  const s = SHOTS[c.id], k = seg(t, c.start, c.end);
  return { cam: lerp3(s.a.cam, s.b.cam, k), look: lerp3(s.a.look, s.b.look, k) };
}
function cameraAt(t) {
  const i = Math.max(0, CH.findIndex((c) => t < c.end)), c = CH[i === -1 ? CH.length - 1 : i];
  const now = shotAt(c, t);
  if (i > 0 && t < c.start + CUT) {
    const prev = shotAt(CH[i - 1], CH[i - 1].end), k = easeIO(seg(t, c.start, c.start + CUT));
    return { cam: lerp3(prev.cam, now.cam, k), look: lerp3(prev.look, now.look, k) };
  }
  return now;
}

// How far along the growth is on each kind of surface.
const GROW = {
  roof: keys([[0, 0.3], [C.intro.end, 0.46], [C.what.end, 0.58], [C.roof.end, 0.9], [C.spread.start, 0.92], [C.spread.end, 1]]),
  wall: keys([[0, 0.28], [C.intro.end, 0.42], [C.what.end, 0.54], [C.walls.start, 0.6], [C.walls.end, 0.9], [C.spread.start, 0.92], [C.spread.end, 1]]),
  ground: keys([[0, 0.3], [C.intro.end, 0.48], [C.what.end, 0.56], [C.ground.start, 0.64], [C.ground.end, 0.9], [C.spread.end, 1]]),
};
const TREAT = [L('fix', 1, 2.6), L('fix', 2, 1.3)];
const WIPE = [L('fix', 2, 1.2), C.fix.end + 0.9];

// Labels pinned to points on the house.
const LABELS = [
  { text: 'Lichen', p: [1.7, roofY(1.7, 2.3) + 0.03, 2.3], from: L('roof', 0, 1.0), to: C.roof.end - 0.4 },
  { text: 'Moss', p: [5.3, roofY(5.3, 3.7) + 0.03, 3.7], from: L('roof', 0, 1.8), to: C.roof.end - 0.4 },
  { text: 'Debris in the gutter', p: [2.4, 2.86, 5.2], from: L('roof', 2, 0.9), to: C.roof.end - 0.4 },
  { text: 'Mould', p: [1.62, 2.5, 4.52], from: L('walls', 0, 0.8), to: C.walls.end - 0.4 },
  { text: 'Algae', p: [-0.75, 0.42, 4.52], from: L('walls', 0, 1.6), to: C.walls.end - 0.4 },
  { text: 'Slippery film', p: [-3.9, 0.08, 8.6], from: L('ground', 1, 0.4), to: C.ground.end - 0.4 },
  { text: 'Damp timber', left: true, p: [4.7, 0.28, 7.3], from: L('ground', 2, 0.6), to: C.ground.end - 0.4 },
];

// The card beside the picture. rows: [badge, heading, detail, time it lights up]
const CARDS = [
  { id: 'what', title: 'What it needs', from: L('what', 1, 0.0), to: C.what.end - 0.3, rows: [
    ['drop', 'Moisture', 'Surfaces that stay damp', L('what', 1, 0.5)],
    ['shade', 'Shade', 'Slow to dry out', L('what', 1, 2.5)],
    ['sun', 'Warmth', 'A humid climate, most of the year', L('what', 2, 0.4)]] },
  { id: 'roof', title: 'Close-up: roof tile', draw: 'roof', from: C.roof.start + 0.9, to: C.roof.end - 0.3, rows: [
    ['1', 'Anchors into the surface', '', L('roof', 0, 1.3)],
    ['2', 'Holds water against it', '', L('roof', 0, 3.5)],
    ['3', 'Weak acids slowly wear it', '', L('roof', 1, 0.6)]] },
  { id: 'walls', title: 'Close-up: painted wall', draw: 'walls', from: C.walls.start + 0.9, to: C.walls.end - 0.3, rows: [
    ['1', 'Feeds on dirt and organic matter', '', L('walls', 0, 1.3)],
    ['2', 'Keeps the surface damp', '', L('walls', 1, 0.2)],
    ['3', 'Can shorten the life of paint', '', L('walls', 1, 2.5)]] },
  { id: 'ground', title: 'Close-up: underfoot', draw: 'ground', from: C.ground.start + 0.9, to: C.ground.end - 0.3, rows: [
    ['1', 'A slippery film when wet', '', L('ground', 1, 0.4)],
    ['2', 'Damp timber can start to rot', '', L('ground', 2, 0.6)]] },
  { id: 'fix', title: 'Soft washing', from: L('fix', 2, -0.2), to: C.fix.end + 0.6, rows: [
    ['1', 'Treat', 'A cleaning solution at low pressure', L('fix', 2, 0.3)],
    ['2', 'Dwell', 'Time for it to work', L('fix', 2, 1.5)],
    ['3', 'Rinse', 'At a pressure the surface can take', L('fix', 2, 2.5)]] },
];
const ICONS = {
  drop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.6 4.3 6 7.4 6 10.6A6 6 0 0 1 6 13.6C6 10.4 8.400 7.300 12 3Z" fill="currentColor"/></svg>',
  shade: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.200" fill="currentColor"/><path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

/* ───────────────────────── elements ───────────────────────── */

const $ = (s, r = document) => r.querySelector(s);
const player = $('#xp-player');
const stage = $('.xp-stage', player);
const glCanvas = $('#xp-gl');
const els = {
  chip: $('.xp-chip', player), chipN: $('.xp-chip b', player), chipT: $('.xp-chip span', player),
  title: $('.xp-title', player), cap: $('.xp-cap', player), capText: $('.xp-cap span', player),
  labels: $('.xp-labels', player), card: $('.xp-card', player), cardTitle: $('.xp-card-title', player),
  cardCanvas: $('.xp-card canvas', player), cardRows: $('.xp-card-rows', player),
  end: $('.xp-end', player), start: $('.xp-start', player), play: $('.xp-play', player),
  time: $('.xp-time', player), bar: $('.xp-bar', player), fill: $('.xp-bar-fill', player),
  range: $('.xp-range', player), cc: $('.xp-cc', player), mute: $('.xp-mute', player), full: $('.xp-full', player),
  replay: $('.xp-replay', player), status: $('.xp-status', player),
};

const EXPORT = new URLSearchParams(location.search).has('export');
if (EXPORT) document.documentElement.classList.add('xp-export');

let scene3d = null;
try {
  scene3d = createScene(glCanvas, { preserve: EXPORT });
} catch (err) {
  player.classList.add('xp-nogl');
  console.warn('3D view unavailable:', err);
}

/* chapter ticks on the progress bar */
for (const c of CH) {
  const s = document.createElement('i');
  s.style.flexGrow = String(c.end - c.start);
  els.bar.insertBefore(s, els.fill);
}

/* labels */
const labelEls = LABELS.map((l) => {
  const d = document.createElement('div');
  d.className = 'xp-label' + (l.left ? ' left' : ''); d.innerHTML = '<i></i><span></span>';
  d.lastChild.textContent = l.text;
  els.labels.appendChild(d); return d;
});

/* ───────────────────────── state ───────────────────────── */

const audio = new Audio();
audio.preload = 'auto';
audio.src = new URL('./narration.mp3', import.meta.url).href;
let audioOk = true;
audio.addEventListener('error', () => { audioOk = false; });

const st = { t: 0, playing: false, started: false, ended: false, captions: true, lastNow: 0, w: 0, h: 0, wide: true };
let cardShown = null, capShown = null, chipShown = -1;

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/* ───────────────────────── drawing one moment ───────────────────────── */

function drawCard(t) {
  const card = CARDS.find((c) => t >= c.from - 0.05 && t <= c.to + 0.6);
  const vis = card ? ease(seg(t, card.from, card.from + 0.5)) * (1 - ease(seg(t, card.to, card.to + 0.5))) : 0;
  els.card.style.opacity = vis.toFixed(3);
  els.card.style.transform = `translateY(${((1 - vis) * 10).toFixed(1)}px)`;
  els.card.style.visibility = vis > 0.001 ? 'visible' : 'hidden';
  if (!card) return 0;
  if (cardShown !== card.id) {
    cardShown = card.id;
    els.card.dataset.kind = card.draw ? 'closeup' : 'list';
    els.cardTitle.textContent = card.title;
    els.cardCanvas.hidden = !card.draw;
    els.cardRows.innerHTML = '';
    for (const [badge, head, detail] of card.rows) {
      const li = document.createElement('li');
      li.innerHTML = `<b>${ICONS[badge] || badge}</b><div><strong></strong><span></span></div>`;
      li.querySelector('strong').textContent = head;
      li.querySelector('span').textContent = detail;
      if (!detail) li.querySelector('span').remove();
      els.cardRows.appendChild(li);
    }
  }
  const on = card.rows.map((r) => seg(t, r[3], r[3] + 0.45));
  [...els.cardRows.children].forEach((li, i) => { li.style.opacity = (0.28 + 0.72 * ease(on[i])).toFixed(3); li.classList.toggle('on', on[i] > 0.5); });
  if (card.draw) {
    const cv = els.cardCanvas, dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(160, Math.round(cv.clientWidth * dpr)), h = Math.round(w * 0.7);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    closeups[card.draw](cv.getContext('2d'), w, h, seg(t, card.from, card.to - 1.2), on);
  }
  return vis;
}

function render(t) {
  t = clamp(t, 0, DUR);
  const idle = !st.started;                       // poster: an affected house, slow drift
  const ci = Math.max(0, CH.findIndex((c) => t < c.end)), ch = CH[ci === -1 ? CH.length - 1 : ci];

  // captions
  const line = idle ? null : ch.lines.find((l) => t >= l.start - 0.12 && t <= l.end + 0.4);
  if (line !== capShown) { capShown = line; if (line) els.capText.textContent = line.text; }
  els.cap.style.opacity = line && st.captions ? '1' : '0';

  // chapter chip and opening title
  if (chipShown !== ci) { chipShown = ci; els.chipN.textContent = `${ci + 1} / ${CH.length}`; els.chipT.textContent = ch.title; }
  els.chip.style.opacity = idle ? '0' : (ease(seg(t, 0.4, 1.2)) * (1 - ease(seg(t, L('outro', 2, -0.9), L('outro', 2, -0.3))))).toFixed(3);
  els.title.style.opacity = idle ? '0' : (ease(seg(t, 0.3, 1.1)) * (1 - ease(seg(t, C.intro.end - 1.2, C.intro.end - 0.4)))).toFixed(3);

  // end card
  const endV = idle ? 0 : ease(seg(t, L('outro', 2, -0.7), L('outro', 2, 0.3)));
  els.end.style.opacity = endV.toFixed(3);
  els.end.style.visibility = endV > 0.01 ? 'visible' : 'hidden';
  els.end.classList.toggle('live', endV > 0.9);

  const cardVis = idle ? (drawCard(-99), 0) : drawCard(t);

  if (scene3d) {
    let s;
    if (idle) {
      const k = performance.now() / 1000;
      s = { cam: [-12.6 + Math.sin(k * 0.12) * 0.7, 4.9, 18.4 + Math.cos(k * 0.1) * 0.5], look: [-0.5, 1.9, 1], roof: 0.86, wall: 0.84, ground: 0.86, treat: 0, wipe: -60, wipeOn: 0 };
    } else {
      s = cameraAt(t);
      s.roof = GROW.roof(t); s.wall = GROW.wall(t); s.ground = GROW.ground(t);
      s.treat = ease(seg(t, TREAT[0], TREAT[1]));
      s.wipe = lerp(-13, 17, seg(t, WIPE[0], WIPE[1]));
      if (t < WIPE[0]) s.wipe = -60;
      s.wipeOn = seg(t, WIPE[0], WIPE[0] + 0.3) * (1 - seg(t, WIPE[1] - 0.6, WIPE[1]));
    }
    s.shift = st.wide ? [0.1 * cardVis, 0] : [0, -0.12 * cardVis];
    scene3d.update(s);

    LABELS.forEach((l, i) => {
      const v = idle ? 0 : ease(seg(t, l.from, l.from + 0.4)) * (1 - ease(seg(t, l.to, l.to + 0.4)));
      const el = labelEls[i], p = v > 0.001 ? scene3d.project(l.p) : null;
      if (!p) { el.style.opacity = '0'; return; }
      el.style.opacity = v.toFixed(3);
      el.style.transform = `translate(${(p[0] * st.w).toFixed(1)}px, ${(p[1] * st.h).toFixed(1)}px)`;
    });
  }

  // transport
  els.fill.style.width = `${(t / DUR) * 100}%`;
  els.time.textContent = `${fmt(Math.min(t, Math.round(DUR)))} / ${fmt(Math.round(DUR))}`;
  if (document.activeElement !== els.range) els.range.value = String(Math.round(t * 10));
}

/* ───────────────────────── transport ───────────────────────── */

function setPlaying(on) {
  st.playing = on;
  player.classList.toggle('is-playing', on);
  player.classList.toggle('is-started', st.started);
  player.classList.toggle('is-ended', st.ended);
  els.play.setAttribute('aria-label', on ? 'Pause' : 'Play');
  els.status.textContent = on ? 'Playing' : st.ended ? 'Finished' : 'Paused';
}

function play() {
  if (st.ended || st.t >= DUR - 0.05) { st.t = 0; st.ended = false; }
  st.started = true;
  st.lastNow = performance.now();
  if (audioOk) {
    try { audio.currentTime = st.t; } catch (e) { /* not seekable yet */ }
    const p = audio.play();
    if (p && p.catch) p.catch(() => { audioOk = false; player.classList.add('xp-silent'); });
  } else player.classList.add('xp-silent');
  setPlaying(true);
}
function pause() { audio.pause(); setPlaying(false); }
function toggle() { st.playing ? pause() : play(); }
function seek(t) {
  st.t = clamp(t, 0, DUR); st.started = true; st.ended = false;
  if (audioOk) { try { audio.currentTime = st.t; } catch (e) { /* ignore */ } }
  setPlaying(st.playing);
  render(st.t);
}

function frame(now) {
  if (st.playing) {
    const dt = Math.min(0.1, (now - st.lastNow) / 1000);
    st.t += dt;
    // Follow the audio clock, but glide between its coarse updates.
    if (audioOk && !audio.paused && audio.readyState >= 2) {
      const drift = audio.currentTime - st.t;
      if (Math.abs(drift) > 0.18) st.t = audio.currentTime; else st.t += drift * 0.08;
    }
    if (st.t >= DUR) { st.t = DUR; st.ended = true; audio.pause(); setPlaying(false); }
  }
  st.lastNow = now;
  if (st.playing || !st.started || st.dirty) { render(st.t); st.dirty = false; }
  requestAnimationFrame(frame);
}

/* ───────────────────────── wiring ───────────────────────── */

function measure() {
  const r = stage.getBoundingClientRect();
  st.w = r.width; st.h = r.height; st.wide = r.width >= 640;
  player.classList.toggle('is-narrow', !st.wide);
  if (scene3d && r.width > 0) {
    let dpr = Math.min(2, window.devicePixelRatio || 1);
    while (r.width * r.height * dpr * dpr > 2560 * 1440 * 1.1 && dpr > 1) dpr -= 0.25;
    scene3d.resize(Math.round(r.width), Math.round(r.height), dpr);
  }
  st.dirty = true;
}
new ResizeObserver(measure).observe(stage);
measure();

els.start.addEventListener('click', play);
els.play.addEventListener('click', toggle);
els.replay.addEventListener('click', () => { st.t = 0; st.ended = false; play(); });
stage.addEventListener('click', (e) => {
  if (e.target.closest('a, button')) return;
  if (st.started) toggle();
});
els.range.max = String(Math.round(DUR * 10));
els.range.addEventListener('input', () => seek(Number(els.range.value) / 10));
els.cc.addEventListener('click', () => {
  st.captions = !st.captions; els.cc.setAttribute('aria-pressed', String(st.captions)); st.dirty = true;
});
els.mute.addEventListener('click', () => {
  audio.muted = !audio.muted; els.mute.setAttribute('aria-pressed', String(audio.muted));
  player.classList.toggle('is-muted', audio.muted);
});
if (document.fullscreenEnabled && player.requestFullscreen) {
  els.full.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen(); else player.requestFullscreen().catch(() => {});
  });
} else els.full.hidden = true;

player.addEventListener('keydown', (e) => {
  if (e.target === els.range || e.target.closest('a')) return;
  if (e.key === ' ' || e.key === 'k') { if (e.target.tagName !== 'BUTTON') { e.preventDefault(); st.started ? toggle() : play(); } }
  else if (e.key === 'ArrowRight') seek(st.t + 5);
  else if (e.key === 'ArrowLeft') seek(st.t - 5);
});

// "Jump to" links in the transcript below the player.
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-xp-seek]');
  if (!b) return;
  const c = C[b.dataset.xpSeek]; if (!c) return;
  seek(c.start); if (!st.playing) play();
  player.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

setPlaying(false);

if (EXPORT) {
  // Frame-accurate rendering for video export: no clock, draw on request.
  st.started = true; setPlaying(true);
  window.__xp = { duration: DUR, draw(t) { st.t = t; render(t); }, measure };
} else {
  window.__xp = { duration: DUR, seek, play, pause };
  requestAnimationFrame(frame);
}
