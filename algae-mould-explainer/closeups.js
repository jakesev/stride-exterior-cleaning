// Cross-section drawings for the "close-up" card.
// Each one is drawn from a single progress value so it can be scrubbed.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (v, a, b) => clamp((v - a) / (b - a));
const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function backdrop(c, w, h) {
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#16344e'); g.addColorStop(1, '#0c2135');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
}

/** Numbered marker that matches the numbered lines under the drawing. */
function marker(c, x, y, n, on, u) {
  if (on <= 0) return;
  c.save(); c.globalAlpha = ease(on);
  c.beginPath(); c.arc(x, y, 11 * u, 0, 7); c.fillStyle = '#ffffff'; c.fill();
  c.fillStyle = '#071523'; c.font = `700 ${13 * u}px Manrope, system-ui, sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(n), x, y + 0.5 * u);
  c.restore();
}

function speckle(c, r, x0, y0, x1, y1, n, light, dark, u) {
  for (let i = 0; i < n; i++) {
    const x = lerp(x0, x1, r()), y = lerp(y0, y1, r()), s = (0.6 + r() * 1.8) * u;
    c.fillStyle = r() > 0.5 ? light : dark;
    c.beginPath(); c.arc(x, y, s, 0, 7); c.fill();
  }
}

function drops(c, pts, on, u) {
  for (const [x, y, s, at] of pts) {
    const k = ease(seg(on, at, at + 0.3)); if (k <= 0) continue;
    const r = s * u * k;
    c.fillStyle = 'rgba(96,178,247,.92)';
    c.beginPath(); c.moveTo(x, y - r * 1.5); c.bezierCurveTo(x + r * 1.2, y - r * 0.1, x + r, y + r, x, y + r);
    c.bezierCurveTo(x - r, y + r, x - r * 1.2, y - r * 0.1, x, y - r * 1.5); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x - r * 0.3, y + r * 0.1, r * 0.22, 0, 7); c.fill();
  }
}

/* Roof tile: moss holding water, lichen anchoring in, the surface wearing. */
function roof(c, w, h, p, m) {
  const u = w / 480, r = rng(7), y0 = h * 0.58;
  backdrop(c, w, h);
  // tile body
  const g = c.createLinearGradient(0, y0, 0, h);
  g.addColorStop(0, '#a9654c'); g.addColorStop(1, '#7c4433');
  c.fillStyle = g; c.fillRect(0, y0, w, h - y0);
  speckle(c, r, 0, y0 + 6 * u, w, h, 150, 'rgba(255,255,255,.07)', 'rgba(0,0,0,.14)', u);

  const wear = ease(seg(p, 0.5, 1));
  // weakened zone under the lichen
  const lx = w * 0.68, lw = lerp(0.1, 0.25, ease(seg(p, 0, 0.6))) * w;
  if (wear > 0) {
    const zg = c.createRadialGradient(lx, y0, 0, lx, y0, lw * 1.05);
    zg.addColorStop(0, `rgba(226,196,120,${0.5 * wear})`); zg.addColorStop(1, 'rgba(226,196,120,0)');
    c.save(); c.beginPath(); c.rect(0, y0, w, h - y0); c.clip(); c.fillStyle = zg; c.fillRect(lx - lw * 1.2, y0, lw * 2.4, lw * 1.2); c.restore();
  }
  // surface coating, pitted where it has worn
  c.fillStyle = '#c98466'; c.fillRect(0, y0 - 1.5 * u, w, 6 * u);
  c.fillStyle = '#8a4c39';
  for (let i = 0; i < 16; i++) {
    const x = lx + (r() - 0.5) * lw * 2.1, s = (2.5 + r() * 5) * u * wear;
    c.beginPath(); c.ellipse(x, y0 + 1 * u, s * 1.3, s, 0, 0, 7); c.fill();
  }

  // lichen anchoring threads
  const root = ease(seg(p, 0.12, 0.7));
  c.strokeStyle = 'rgba(224,228,206,.85)'; c.lineWidth = 1.4 * u; c.lineCap = 'round';
  for (let i = 0; i < 13; i++) {
    const x = lx + (i / 12 - 0.5) * lw * 1.7, len = (26 + r() * 46) * u * root, bend = (r() - 0.5) * 22 * u;
    if (len < 1) continue;
    c.beginPath(); c.moveTo(x, y0);
    c.bezierCurveTo(x + bend * 0.4, y0 + len * 0.4, x + bend, y0 + len * 0.7, x + bend * 0.7, y0 + len); c.stroke();
    if (i % 3 === 0) { c.beginPath(); c.moveTo(x + bend * 0.5, y0 + len * 0.55); c.lineTo(x + bend * 0.5 - 9 * u, y0 + len * 0.85); c.stroke(); }
  }
  // lichen crust
  c.fillStyle = '#b9c2a3';
  c.beginPath(); c.moveTo(lx - lw, y0);
  for (let i = 0; i <= 14; i++) {
    const t = i / 14, x = lx - lw + t * 2 * lw;
    c.lineTo(x, y0 - (7 + 9 * Math.sin(t * Math.PI) + 5 * Math.sin(t * 23)) * u * lerp(0.4, 1, ease(seg(p, 0, 0.5))));
  }
  c.lineTo(lx + lw, y0); c.closePath(); c.fill();
  c.fillStyle = '#c9912f';
  for (let i = 0; i < 6; i++) { const x = lx + (r() - 0.5) * lw * 1.5; c.beginPath(); c.arc(x, y0 - (7 + r() * 6) * u, 2.6 * u, 0, 7); c.fill(); }

  // moss cushion
  const mx = w * 0.26, grow = ease(seg(p, 0, 0.55));
  const mw = lerp(0.07, 0.2, grow) * w, mh = lerp(0.05, 0.19, grow) * h;
  for (let i = 0; i < 420; i++) {
    const t = r() * 2 - 1, top = Math.sqrt(1 - t * t) * mh, x = mx + t * mw, k = r();
    c.strokeStyle = ['#33491b', '#4d6a25', '#6f8a2b', '#86a03a'][Math.floor(r() * 4)];
    c.lineWidth = (1 + r() * 1.4) * u;
    c.beginPath(); c.moveTo(x, y0 - top * k * 0.85); c.lineTo(x + (r() - 0.5) * 7 * u, y0 - top * k * 0.85 - (5 + r() * 8) * u); c.stroke();
  }
  drops(c, [[mx - mw * 0.45, y0 - mh * 0.25, 5, 0.05], [mx + mw * 0.1, y0 - mh * 0.45, 6.5, 0.2], [mx + mw * 0.5, y0 - mh * 0.2, 5, 0.35], [mx - mw * 0.1, y0 - mh * 0.12, 4, 0.5]], seg(p, 0.1, 0.6), u);
  // damp soaking into the tile under the moss
  const damp = ease(seg(p, 0.25, 0.8));
  if (damp > 0) {
    const dg = c.createLinearGradient(0, y0, 0, y0 + 60 * u);
    dg.addColorStop(0, `rgba(30,60,90,${0.42 * damp})`); dg.addColorStop(1, 'rgba(30,60,90,0)');
    c.fillStyle = dg; c.fillRect(mx - mw, y0 + 4 * u, mw * 2, 60 * u);
  }

  marker(c, lx + lw * 0.2, y0 + 62 * u, 1, m[0], u);
  marker(c, mx, y0 - mh - 22 * u, 2, m[1], u);
  marker(c, lx - lw * 0.75, y0 - 30 * u, 3, m[2], u);
}

/* Painted wall: growth on the film, damp behind it, the paint giving way. */
function walls(c, w, h, p, m) {
  const u = w / 480, r = rng(21), yPaint = h * 0.5, th = 26 * u, ySub = yPaint + th;
  backdrop(c, w, h);
  // render
  c.fillStyle = '#9b958b'; c.fillRect(0, ySub, w, h - ySub);
  speckle(c, r, 0, ySub, w, h, 190, 'rgba(255,255,255,.12)', 'rgba(0,0,0,.16)', u);

  const fail = ease(seg(p, 0.55, 1)), bx = w * 0.7, bw = 62 * u, lift = 20 * u * fail;
  // damp moving through the film into the wall
  const damp = ease(seg(p, 0.3, 0.8));
  if (damp > 0) {
    const dg = c.createLinearGradient(0, ySub, 0, ySub + 80 * u);
    dg.addColorStop(0, `rgba(26,58,92,${0.5 * damp})`); dg.addColorStop(1, 'rgba(26,58,92,0)');
    c.fillStyle = dg; c.fillRect(0, ySub, w, 80 * u);
  }
  // paint film, with one blister lifting
  const top = (x) => yPaint - lift * Math.exp(-Math.pow((x - bx) / (bw * 0.55), 2));
  c.fillStyle = '#ebe6dc';
  c.beginPath(); c.moveTo(0, ySub);
  for (let x = 0; x <= w; x += 4 * u) c.lineTo(x, top(x) + th);
  c.lineTo(w, ySub); c.lineTo(w, top(w));
  for (let x = w; x >= 0; x -= 4 * u) c.lineTo(x, top(x));
  c.closePath(); c.fill();
  if (fail > 0) {   // void behind the blister and hairline cracks
    c.fillStyle = `rgba(12,33,53,${0.85 * fail})`;
    c.beginPath(); c.moveTo(bx - bw, ySub);
    for (let x = bx - bw; x <= bx + bw; x += 4 * u) c.lineTo(x, top(x) + th);
    c.lineTo(bx + bw, ySub); c.closePath(); c.fill();
    c.strokeStyle = `rgba(60,58,52,${0.9 * fail})`; c.lineWidth = 1.5 * u;
    for (const dx of [-0.34, 0.05, 0.4]) {
      const x = bx + dx * bw; c.beginPath(); c.moveTo(x, top(x) - 1); c.lineTo(x + 4 * u, top(x) + th * 0.5); c.lineTo(x - 2 * u, top(x) + th); c.stroke();
    }
  }
  // dirt film, then algae and mould colonies on top of it
  const grow = ease(seg(p, 0, 0.6));
  c.fillStyle = `rgba(110,98,74,${0.55 * ease(seg(p, 0, 0.25))})`;
  c.beginPath(); c.moveTo(0, top(0));
  for (let x = 0; x <= w; x += 4 * u) c.lineTo(x, top(x) - 3 * u);
  for (let x = w; x >= 0; x -= 4 * u) c.lineTo(x, top(x));
  c.fill();
  for (let i = 0; i < 26; i++) {
    const x = r() * w, s = (5 + r() * 12) * u * grow * (0.5 + 0.5 * seg(grow, r() * 0.6, 1));
    if (s < 0.6) continue;
    const mould = i % 3 === 0;
    c.fillStyle = mould ? '#1d1e1b' : ['#5f7a34', '#7d9a3f', '#4a6327'][i % 3];
    c.beginPath(); c.ellipse(x, top(x) - s * 0.45, s * 1.5, s * 0.75, 0, Math.PI, 0); c.fill();
    if (mould) {
      c.strokeStyle = '#1d1e1b'; c.lineWidth = 1.1 * u;
      for (let k = 0; k < 7; k++) { const a = Math.PI * (1 + (k + 0.5) / 7); c.beginPath(); c.moveTo(x, top(x) - s * 0.3); c.lineTo(x + Math.cos(a) * s * 2.1, top(x) - s * 0.3 + Math.sin(a) * s * 1.5); c.stroke(); }
    }
  }
  drops(c, [[w * 0.2, yPaint - 30 * u, 5.5, 0], [w * 0.42, yPaint - 34 * u, 6.5, 0.25], [w * 0.86, yPaint - 28 * u, 5, 0.45]], seg(p, 0.28, 0.75), u);

  // layer names, as on a spec sheet
  c.font = `600 ${11 * u}px Manrope, system-ui, sans-serif`; c.textBaseline = 'middle'; c.textAlign = 'left';
  c.fillStyle = 'rgba(7,21,35,.72)'; c.fillText('PAINT FILM', 12 * u, yPaint + th / 2 + 1);
  c.fillStyle = 'rgba(255,255,255,.75)'; c.fillText('RENDER', 12 * u, ySub + 22 * u);

  marker(c, w * 0.33, yPaint - 58 * u, 1, m[0], u);
  marker(c, w * 0.5, ySub + 46 * u, 2, m[1], u);
  marker(c, bx, top(bx) - 30 * u, 3, m[2], u);
}

/* Concrete with a wet film, beside a deck board taking up moisture. */
function ground(c, w, h, p, m) {
  const u = w / 480, r = rng(33), y0 = h * 0.56, split = w * 0.54;
  backdrop(c, w, h);
  // concrete
  c.fillStyle = '#a6a39b'; c.fillRect(0, y0, split - 10 * u, h - y0);
  for (let i = 0; i < 26; i++) {
    const x = r() * (split - 30 * u) + 8 * u, y = y0 + 14 * u + r() * (h - y0 - 20 * u), s = (4 + r() * 9) * u;
    c.fillStyle = ['#8b877f', '#bdb9b0', '#7d786f'][i % 3];
    c.beginPath(); c.ellipse(x, y, s, s * 0.7, r() * 3, 0, 7); c.fill();
  }
  const film = ease(seg(p, 0, 0.5)), wet = ease(seg(p, 0.2, 0.65));
  c.fillStyle = '#4f6a2a'; c.fillRect(0, y0 - 7 * u * film, split - 10 * u, 7 * u * film + 1);
  c.fillStyle = '#25271f';
  for (let i = 0; i < 9; i++) { const x = r() * (split - 60 * u); c.fillRect(x, y0 - 7 * u * film, (14 + r() * 26) * u, 4 * u * film); }
  if (wet > 0) {   // sheet of water sitting on the film
    const yw = y0 - 7 * u * film;
    c.fillStyle = `rgba(96,178,247,${0.6 * wet})`; c.fillRect(0, yw - 6 * u * wet, split - 10 * u, 6 * u * wet);
    c.strokeStyle = `rgba(255,255,255,${0.85 * wet})`; c.lineWidth = 1.6 * u;
    for (const x of [0.07, 0.2, 0.36]) { c.beginPath(); c.moveTo(w * x, yw - 6 * u * wet); c.lineTo(w * x + 30 * u, yw - 6 * u * wet); c.stroke(); }
  }
  // shoe sole losing grip
  const slip = ease(seg(p, 0.3, 0.75));
  c.save(); c.translate(w * 0.2 + slip * 46 * u, y0 - 22 * u - 12 * u * (1 - slip * 0.55)); c.rotate(-0.16 * slip);
  c.fillStyle = '#eef3f7'; c.beginPath(); c.roundRect(-58 * u, -16 * u, 116 * u, 16 * u, 8 * u); c.fill();
  c.fillStyle = '#16212b'; for (let i = 0; i < 7; i++) c.fillRect((-50 + i * 15) * u, 0, 9 * u, 5 * u);
  c.restore();
  if (slip > 0.15) {
    c.strokeStyle = `rgba(255,255,255,${0.75 * slip})`; c.lineWidth = 2 * u; c.lineCap = 'round';
    for (const dy of [-34, -24, -14]) { c.beginPath(); c.moveTo(w * 0.04, y0 + dy * u); c.lineTo(w * 0.04 + 22 * u * slip, y0 + dy * u); c.stroke(); }
  }

  // deck board, end grain
  const bx = split + 14 * u, bw = w - bx - 16 * u, by = y0 - 6 * u, bh = 74 * u;
  c.fillStyle = '#b07c4c'; c.beginPath(); c.roundRect(bx, by, bw, bh, 5 * u); c.fill();
  c.save(); c.beginPath(); c.roundRect(bx, by, bw, bh, 5 * u); c.clip();
  c.strokeStyle = 'rgba(92,58,30,.5)'; c.lineWidth = 1.3 * u;
  for (let i = 1; i < 9; i++) { c.beginPath(); c.ellipse(bx + bw * 0.5, by + bh * 1.5, bw * 0.13 * i, bh * 0.22 * i, 0, 0, 7); c.stroke(); }
  const soak = ease(seg(p, 0.45, 1));
  if (soak > 0) {
    const sg = c.createLinearGradient(0, by, 0, by + bh);
    sg.addColorStop(0, `rgba(34,44,40,${0.8 * soak})`); sg.addColorStop(Math.min(0.95, 0.3 + 0.6 * soak), `rgba(34,44,40,${0.25 * soak})`); sg.addColorStop(1, 'rgba(34,44,40,0)');
    c.fillStyle = sg; c.fillRect(bx, by, bw, bh);
    c.fillStyle = `rgba(20,24,20,${0.75 * seg(soak, 0.5, 1)})`;   // soft, decayed fibre at the top face
    for (let i = 0; i < 12; i++) c.fillRect(bx + r() * bw, by + r() * 14 * u, (6 + r() * 16) * u, 2.2 * u);
  }
  c.restore();
  c.fillStyle = '#4f6a2a'; c.fillRect(bx, by - 5 * u * film, bw, 5 * u * film + 1);
  drops(c, [[bx + bw * 0.25, by - 22 * u, 5.5, 0], [bx + bw * 0.62, by - 26 * u, 6.5, 0.3]], seg(p, 0.4, 0.8), u);
  // joists hint
  c.fillStyle = 'rgba(255,255,255,.1)'; c.fillRect(bx + bw * 0.38, by + bh, bw * 0.24, h);

  c.font = `600 ${11 * u}px Manrope, system-ui, sans-serif`; c.textBaseline = 'middle'; c.textAlign = 'left';
  c.fillStyle = 'rgba(7,21,35,.7)'; c.fillText('CONCRETE', 12 * u, h - 16 * u);
  c.fillStyle = 'rgba(255,255,255,.75)'; c.fillText('DECK BOARD', bx, h - 16 * u);

  marker(c, w * 0.42, y0 - 44 * u, 1, m[0], u);
  marker(c, bx + bw * 0.5, by + bh * 0.5, 2, m[1], u);
}

export const closeups = { roof, walls, ground };
