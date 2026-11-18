// 3D scene for the algae and mould explainer.
// Everything here is a pure function of the values passed to update(), so any
// moment of the presentation can be drawn on demand (scrubbing, video export).

import * as THREE from './vendor/three.module.min.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/* ───────────────────────── house dimensions (metres) ───────────────────────── */

export const H = {
  w: 14, d: 9, wall: 2.7,            // wall box
  roofW: 15.2, roofD: 10.2,          // roof footprint incl. eaves
  eaveY: 2.82, pitch: 24 * Math.PI / 180,
};
const TAN = Math.tan(H.pitch), COS = Math.cos(H.pitch);
H.rise = (H.roofD / 2) * TAN;
H.ridge = H.roofW - H.roofD;

/** Height of the roof surface above a ground point. */
export function roofY(x, z) {
  const run = Math.min(H.roofD / 2 - Math.abs(z), H.roofW / 2 - Math.abs(x));
  return H.eaveY + Math.max(0, run) * TAN;
}

const SUN_DIR = new THREE.Vector3(0.45, 0.76, 0.47).normalize();
const SHADE = new THREE.Vector2(7.6, 0.2);     // centre of the tree's shade

/* ───────────────────────── procedural textures ───────────────────────── */

function lcg(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/** Tileable value noise on an n×n lattice. */
function periodicNoise(n, seed) {
  const r = lcg(seed), g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = r();
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    let fx = x - xi, fy = y - yi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const x0 = ((xi % n) + n) % n, x1 = (x0 + 1) % n, y0 = ((yi % n) + n) % n, y1 = (y0 + 1) % n;
    return (g[y0 * n + x0] * (1 - fx) + g[y0 * n + x1] * fx) * (1 - fy)
         + (g[y1 * n + x0] * (1 - fx) + g[y1 * n + x1] * fx) * fy;
  };
}

/** Tileable fractal noise; u,v in 0..1 across the tile. */
function tileFbm(base, seed, octaves = 4) {
  const layers = [];
  for (let o = 0; o < octaves; o++) layers.push([periodicNoise(base << o, seed + o * 131), base << o]);
  return (u, v) => {
    let a = 0.5, s = 0, t = 0;
    for (const [n, p] of layers) { s += a * n(u * p, v * p); t += a; a *= 0.5; }
    return s / t;
  };
}

/**
 * Build a colour map and a matching normal map from one function.
 * fn(u, v) -> [r, g, b, height]  (colour 0..255 sRGB, height 0..1, v points up)
 */
function makeMaps(size, fn, strength, aniso) {
  const col = new Uint8ClampedArray(size * size * 4);
  const hgt = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const o = fn((x + 0.5) / size, 1 - (y + 0.5) / size);
      const i = y * size + x;
      col[i * 4] = o[0]; col[i * 4 + 1] = o[1]; col[i * 4 + 2] = o[2]; col[i * 4 + 3] = 255;
      hgt[i] = o[3];
    }
  }
  const nrm = new Uint8ClampedArray(size * size * 4);
  const at = (x, y) => hgt[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;   // canvas y is down, v is up
      const l = Math.hypot(dx, dy, 1), i = (y * size + x) * 4;
      nrm[i] = (-dx / l * 0.5 + 0.5) * 255;
      nrm[i + 1] = (-dy / l * 0.5 + 0.5) * 255;
      nrm[i + 2] = (1 / l * 0.5 + 0.5) * 255;
      nrm[i + 3] = 255;
    }
  }
  const toTex = (data, srgb) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    c.getContext('2d').putImageData(new ImageData(data, size, size), 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = aniso;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { map: toTex(col, true), normalMap: toTex(nrm, false) };
}

function buildTextures(aniso) {
  const tex = {};

  // Roof: flat-profile tiles, two tiles by two courses per repeat, broken bond.
  {
    const n = tileFbm(8, 11), fine = tileFbm(32, 12, 3);
    const tint = lcg(5), tints = [tint(), tint(), tint(), tint(), tint(), tint()];
    tex.roof = makeMaps(512, (u, v) => {
      const cy = v * 2, row = Math.floor(cy), fy = cy - row;
      const cx = u * 2 + (row % 2) * 0.5, col = Math.floor(cx) % 2, fx = cx - Math.floor(cx);
      const side = Math.min(fx, 1 - fx);
      let h = 0.62 * (1 - fy);                       // each course steps down onto the next
      h -= 0.22 * (1 - smooth(0, 0.05, side));       // interlock groove between tiles
      h += 0.07 * Math.sin(Math.PI * fx) + 0.05 * fine(u, v);
      const lap = 1 - smooth(0, 0.07, fy);           // shadow line under each course
      const k = (0.86 + 0.2 * tints[row * 2 + col] + 0.16 * (n(u, v) - 0.5) + 0.1 * (fine(u, v) - 0.5))
              * (1 - 0.3 * lap) * (0.82 + 0.18 * smooth(0, 0.04, side));
      return [151 * k, 88 * k, 68 * k, h];
    }, 2.6, aniso);
  }

  // Painted render: fine stipple, very slight tonal drift.
  {
    const n = tileFbm(4, 21), fine = tileFbm(64, 22, 3);
    tex.render = makeMaps(256, (u, v) => {
      const k = 0.97 + 0.05 * (n(u, v) - 0.5) + 0.04 * (fine(u, v) - 0.5);
      return [233 * k, 228 * k, 218 * k, fine(u, v)];
    }, 1.1, aniso);
  }

  // Broom-finished concrete with a light aggregate speckle.
  {
    const n = tileFbm(4, 31), fine = tileFbm(64, 32, 3), spk = tileFbm(128, 33, 1);
    tex.concrete = makeMaps(512, (u, v) => {
      const s = smooth(0.72, 0.9, spk(u, v));
      const k = 0.94 + 0.12 * (n(u, v) - 0.5) + 0.08 * (fine(u, v) - 0.5) - 0.1 * s;
      return [190 * k, 186 * k, 177 * k, 0.6 * fine(u, v) + 0.25 * Math.sin(v * Math.PI * 2 * 90) * 0.5 + 0.2 * s];
    }, 1.4, aniso);
  }

  // Pavers: 4 by 4 per repeat with sand joints.
  {
    const n = tileFbm(8, 41), fine = tileFbm(64, 42, 3);
    const r = lcg(9), tints = Array.from({ length: 16 }, r);
    tex.paver = makeMaps(512, (u, v) => {
      const cx = u * 4, cy = v * 4, fx = cx - Math.floor(cx), fy = cy - Math.floor(cy);
      const edge = Math.min(Math.min(fx, 1 - fx), Math.min(fy, 1 - fy));
      const top = smooth(0.012, 0.05, edge);
      const k = (0.9 + 0.14 * tints[(Math.floor(cy) % 4) * 4 + (Math.floor(cx) % 4)] + 0.1 * (n(u, v) - 0.5)) * (0.62 + 0.38 * top);
      return [196 * k, 186 * k, 168 * k, 0.75 * top + 0.25 * fine(u, v)];
    }, 2.2, aniso);
  }

  // Timber: long grain along u.
  {
    const grain = tileFbm(4, 51, 3), fine = tileFbm(32, 52, 3);
    tex.timber = makeMaps(256, (u, v) => {
      const g = grain(u * 0.25, v * 6) * 0.65 + fine(u * 0.5, v * 4) * 0.35;
      const k = 0.78 + 0.42 * g;
      return [158 * k, 110 * k, 70 * k, g];
    }, 1.3, aniso);
  }

  // Fence palings: vertical boards with a gap line.
  {
    const grain = tileFbm(4, 61, 3);
    const r = lcg(13), tints = Array.from({ length: 4 }, r);
    tex.fence = makeMaps(256, (u, v) => {
      const cx = u * 4, fx = cx - Math.floor(cx);
      const edge = smooth(0, 0.07, Math.min(fx, 1 - fx));
      const g = grain(u * 6, v * 0.5);
      const k = (0.82 + 0.16 * tints[Math.floor(cx) % 4] + 0.2 * (g - 0.5)) * (0.5 + 0.5 * edge);
      return [142 * k, 124 * k, 102 * k, 0.8 * edge + 0.2 * g];
    }, 2.0, aniso);
  }

  // Lawn.
  {
    const n = tileFbm(4, 71), fine = tileFbm(64, 72, 3);
    tex.grass = makeMaps(512, (u, v) => {
      const a = n(u, v), b = fine(u, v);
      const k = 0.8 + 0.3 * a + 0.22 * (b - 0.5);
      return [84 * k, 122 * k + 10 * a, 54 * k, b];
    }, 1.8, aniso);
  }

  // Garage door: horizontal sectional panels.
  {
    const fine = tileFbm(32, 81, 2);
    tex.garage = makeMaps(256, (u, v) => {
      const fy = (v * 4) % 1;
      const groove = smooth(0, 0.035, Math.min(fy, 1 - fy));
      const rib = 0.5 + 0.5 * Math.sin(v * Math.PI * 2 * 16);
      const k = 0.9 + 0.1 * groove;
      return [92 * k, 98 * k, 105 * k, 0.75 * groove + 0.12 * rib + 0.05 * fine(u, v)];
    }, 1.6, aniso);
  }

  // Asphalt and mulch share one coarse grain.
  {
    const fine = tileFbm(64, 91, 3), n = tileFbm(8, 92);
    tex.grain = makeMaps(256, (u, v) => {
      const k = 0.8 + 0.4 * fine(u, v) * (0.8 + 0.4 * n(u, v));
      return [200 * k, 200 * k, 200 * k, fine(u, v)];
    }, 2.4, aniso);
  }
  return tex;
}

/* ───────────────────────── growth shader ───────────────────────── */

const gl3 = (hex) => { const c = new THREE.Color(hex); return `vec3(${c.r.toFixed(4)},${c.g.toFixed(4)},${c.b.toFixed(4)})`; };

const GROWTH_COMMON = /* glsl */`
uniform float uGrow;      // 0 clean .. 1 heavily affected
uniform float uTreat;     // 0 alive .. 1 treated (dead, browned off)
uniform float uWipe;      // world x of the rinse front
uniform float uWipeOn;    // 1 while the rinse front is on screen
uniform vec2  uShade;     // centre of persistent shade (world xz)
uniform vec4  uRect;      // slab bounds for ground surfaces (minX, minZ, maxX, maxZ)
uniform float uJoint;     // paver size in metres, 0 for none
varying vec3 gWPos;
varying vec2 gUv;

float gh12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2  gh22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float gvn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(gh12(i), gh12(i + vec2(1, 0)), f.x), mix(gh12(i + vec2(0, 1)), gh12(i + vec2(1, 1)), f.x), f.y); }
float gfbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++) { s += a * gvn(p); p = p * 2.03 + 17.1; a *= .5; } return s / .9375; }

// Round colonies. Each cell gets its own arrival time and final size.
float gSpots(vec2 p, float g, float early, float rmax){
  vec2 i = floor(p), f = fract(p); float m = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 c = vec2(float(x), float(y)); vec2 id = i + c; vec2 o = gh22(id);
    float arrive = gh12(id + 7.3) * .85 - early;
    float r = rmax * (.35 + .65 * gh12(id + 3.1)) * smoothstep(arrive, arrive + .4, g);
    float d = length(c + .15 + .7 * o - f) + (gvn(p * 7. + id) - .5) * .08;
    m = max(m, 1. - smoothstep(r * .55, r, d));
  }
  return m;
}

// What is left alive once the rinse front has passed.
float gLive(){ return smoothstep(uWipe - .5, uWipe + .9, gWPos.x + (gfbm(gWPos.xz * .8 + gWPos.y) - .5) * 1.6); }
vec3  gDead(vec3 c){ float l = dot(c, vec3(.3, .6, .1)); return mix(c, mix(vec3(l), ${gl3('#8a7a52')}, .7) * 1.15, uTreat * .85); }
`;

const GROWTH_KIND = {
  roof: /* glsl */`
vec4 gApply(inout vec3 base){
  float prox = exp(-dot(gWPos.xz - uShade, gWPos.xz - uShade) / 26.);
  float g = clamp(uGrow * (1. + .35 * prox), 0., 1.25);
  float live = gLive(), cover = 0.;
  // dark staining that follows the fall of the roof
  float st = gfbm(vec2(gUv.x * 2.4, gUv.y * .2) + 3.7);
  float dark = smoothstep(.66 - .34 * g, .9 - .3 * g, st) * smoothstep(.08, .7, g) * .66 * live;
  base = mix(base, gDead(${gl3('#23241f')}), dark); cover = max(cover, dark);
  // lichen: pale crusts with a few ochre colonies
  vec2 lw = gUv + (vec2(gfbm(gUv * 3.1), gfbm(gUv * 3.1 + 7.)) - .5) * .22;
  float patchy = smoothstep(.3, .62, gfbm(gUv * .55 + 21.) + .22 * prox);      // colonies cluster
  float big = gSpots(lw * 3.4, g * (.55 + .6 * patchy), .18 * prox, .47);
  float small = gSpots(lw * 9.5 + 4.2, g * (.5 + .7 * patchy) - .08, .2 * prox, .44);
  float lich = max(big, small * .85) * live;
  float och = smoothstep(.6, .72, gfbm(gUv * .9 + 40.)) * step(.45, gh12(floor(lw * 3.4) + 1.7));
  vec3 lc = mix(${gl3('#959d86')}, ${gl3('#a8842e')}, och * .85) * (.7 + .5 * gvn(gUv * 46.)) * (1.12 - .3 * lich);
  base = mix(base, gDead(lc), smoothstep(0., .7, lich) * .86); cover = max(cover, lich);
  // moss cushions that start along the tile laps
  float lap = (1. - smoothstep(0., .3, fract(gUv.y / .34))) * smoothstep(.35, .7, gvn(vec2(gUv.x * 2.6, floor(gUv.y / .34) * 7.3)));
  float ms = gfbm(gUv * 1.35 + 9.1) * .62 + lap * .26 + prox * .2 + gvn(gUv * 22.) * .12;
  float moss = smoothstep(1.06 - .5 * g, 1.14 - .47 * g, ms) * live;
  vec3 mc = mix(${gl3('#33491b')}, ${gl3('#6f8a2b')}, gvn(gUv * 30.));
  base = mix(base, gDead(mc), moss); cover = max(cover, moss);
  return vec4(cover, .95, moss, live);
}`,
  wall: /* glsl */`
vec4 gApply(inout vec3 base){
  float prox = exp(-dot(gWPos.xz - uShade, gWPos.xz - uShade) / 30.);
  float g = clamp(uGrow * (1. + .3 * prox), 0., 1.25);
  float live = gLive(), cover = 0.;
  float y = gWPos.y, along = gWPos.x + gWPos.z;
  vec2 q = vec2(along, y);
  float grit = .66 + .34 * smoothstep(.25, .8, gfbm(q * 11.));         // soft mottling, so it never reads as flat paint
  // green algae: a haze that climbs from the damp base of the wall
  float reach = .12 + 1.25 * g * (.55 + .75 * gfbm(vec2(along * .7, 3.)));
  float al = (1. - smoothstep(0., reach, y)) * (.5 + .5 * gfbm(q * vec2(2.2, 1.1) + 4.));
  al = smoothstep(.04, .5, al) * smoothstep(.03, .45, g) * grit * live;
  vec3 ac = mix(${gl3('#7c9544')}, ${gl3('#3d5223')}, smoothstep(.25, .9, al));
  base = mix(base, gDead(ac), al * .82); cover = max(cover, al);
  // run-off streaks below the eaves
  float sn = gfbm(vec2(along * 8., y * .22) + 5.);
  float stk = smoothstep(.6, .8, sn) * smoothstep(.7, 2.7, y) * smoothstep(.15, .85, g) * .34 * live;
  base = mix(base, gDead(${gl3('#3a3d33')}), stk); cover = max(cover, stk);
  // black mould: a speckled haze under the eaves, where the wall dries last
  float drop = 2.75 - (.2 + 1.15 * g * (.4 + .9 * gfbm(vec2(along * .9, 8.))));
  float mould = smoothstep(drop, 2.72, y) * (.35 + .65 * gfbm(q * vec2(3., 1.6) + 2.));
  mould = smoothstep(.1, .62, mould) * smoothstep(.1, .7, g) * grit * .78 * live;
  base = mix(base, gDead(${gl3('#20221e')}), mould); cover = max(cover, mould);
  return vec4(cover, .9, 0., live);
}`,
  ground: /* glsl */`
vec4 gApply(inout vec3 base){
  float prox = exp(-dot(gWPos.xz - uShade, gWPos.xz - uShade) / 40.);
  float g = clamp(uGrow * (1. + .25 * prox), 0., 1.25);
  float live = gLive(), cover = 0.;
  vec2 p = gWPos.xz;
  float edge = min(min(p.x - uRect.x, uRect.z - p.x), min(p.y - uRect.y, uRect.w - p.y));
  // black staining in broad blotches
  float bn = gfbm(p * .85 + 2.) * .8 + gfbm(p * 5.) * .2;
  float dark = smoothstep(.72 - .5 * g, .98 - .42 * g, bn) * smoothstep(.05, .6, g) * .7 * live;
  base = mix(base, gDead(${gl3('#25271f')}), dark); cover = max(cover, dark);
  // green film that creeps in from the edges and the joints
  float creep = 1. - smoothstep(0., .25 + 1.3 * g, edge);
  float joint = 0.;
  if (uJoint > 0.) { vec2 jf = abs(fract(p / uJoint) - .5); joint = smoothstep(.36, .5, max(jf.x, jf.y)); }
  float gn = gfbm(p * 1.6 + 11.) * .6 + creep * .5 + joint * .35;
  float film = smoothstep(1. - .52 * g, 1.16 - .46 * g, gn) * smoothstep(.02, .5, g) * live;
  vec3 fc = mix(${gl3('#5a7430')}, ${gl3('#2f4019')}, gvn(p * 12.));
  base = mix(base, gDead(fc), film * .86); cover = max(cover, film);
  return vec4(cover, .34, 0., live);
}`,
};

function growthMaterial(kind, uniforms, params, extra = {}) {
  const m = new THREE.MeshStandardMaterial(params);
  const own = {
    uRect: { value: extra.rect || new THREE.Vector4(-1e3, -1e3, 1e3, 1e3) },
    uJoint: { value: extra.joint || 0 },
    uGrow: uniforms[extra.grow || kind],
  };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms.shared, own);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 gWPos;\nvarying vec2 gUv;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n  gWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\n  gUv = uv;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + GROWTH_COMMON + GROWTH_KIND[kind])
      .replace('#include <map_fragment>', /* glsl */`#include <map_fragment>
  vec4 gInfo = gApply(diffuseColor.rgb);
  float gWet = (1. - gInfo.w) * smoothstep(uWipe - 7., uWipe - .5, gWPos.x);
  diffuseColor.rgb *= 1. - .13 * gWet;
  diffuseColor.rgb += uWipeOn * .22 * exp(-pow((gWPos.x - uWipe) / .45, 2.));`)
      .replace('#include <roughnessmap_fragment>', /* glsl */`#include <roughnessmap_fragment>
  roughnessFactor = mix(roughnessFactor, gInfo.y, gInfo.x * .85);
  roughnessFactor = mix(roughnessFactor, .22, gWet * .8);`);
  };
  m.customProgramCacheKey = () => 'growth-' + kind;
  return m;
}

/* ───────────────────────── sky ───────────────────────── */

function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uSun: { value: SUN_DIR.clone() } },
    vertexShader: /* glsl */`varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      varying vec3 vDir; uniform vec3 uSun;
      float h(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*n(p); p=p*2.02+9.; a*=.5; } return s; }
      void main(){
        vec3 d = normalize(vDir);
        float up = clamp(d.y, 0., 1.);
        vec3 zen = vec3(.13, .33, .68), hor = vec3(.62, .76, .9);
        vec3 col = mix(hor, zen, pow(up, .55));
        col = mix(col, vec3(.86, .88, .9), pow(1. - up, 9.));            // haze at the horizon
        float s = max(dot(d, uSun), 0.);
        col += vec3(1., .9, .7) * (pow(s, 600.) * 6. + pow(s, 12.) * .18);
        vec2 cp = d.xz / (d.y + .22) * 1.3;
        float c = smoothstep(.52, .86, fbm(cp + 2.)) * smoothstep(.02, .3, d.y);
        col = mix(col, vec3(1.), c * .7);
        if (d.y < 0.) col = mix(vec3(.5, .56, .5), vec3(.27, .33, .24), clamp(-d.y * 4., 0., 1.));
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(400, 48, 24), mat);
}

/* ───────────────────────── build ───────────────────────── */

export function createScene(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.preserve });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tex = buildTextures(aniso);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcfdbe6, 50, 190);
  const sky = makeSky(); scene.add(sky);

  // Image-based light from the same sky, so glass and wet surfaces reflect it.
  {
    const pm = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene(); envScene.add(makeSky());
    scene.environment = pm.fromScene(envScene, 0.03, 1, 1000).texture;
    scene.environmentIntensity = 0.7;
    pm.dispose();
  }

  const sun = new THREE.DirectionalLight(0xfff0d8, 3.3);
  sun.position.copy(SUN_DIR).multiplyScalar(60);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(opts.shadowSize || (small ? 2048 : 4096));
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 5, far: 130 });
  sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.035; sun.shadow.radius = 2.5;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0xc6dcff, 0x6c6a52, 0.5));

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.3, 600);

  const U = {
    shared: {
      uTreat: { value: 0 }, uWipe: { value: -40 }, uWipeOn: { value: 0 }, uShade: { value: SHADE },
    },
    roof: { value: 0 }, wall: { value: 0 }, ground: { value: 0 },
  };

  const std = (p) => new THREE.MeshStandardMaterial(p);
  const rep = (t, x, y) => { const o = {}; for (const k of ['map', 'normalMap']) { o[k] = t[k].clone(); o[k].repeat.set(x, y); o[k].needsUpdate = true; } return o; };
  const world = new THREE.Group(); scene.add(world);
  const add = (geo, mat, x = 0, y = 0, z = 0, o = {}) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    m.castShadow = o.cast !== false; m.receiveShadow = o.receive !== false;
    (o.parent || world).add(m); return m;
  };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  /* ground */
  const lawnMat = std({ ...rep(tex.grass, 110, 110), roughness: 1, normalScale: new THREE.Vector2(0.7, 0.7) });
  lawnMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 tPos;')
      .replace('#include <fog_vertex>', '#include <fog_vertex>\n  tPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 tPos;
float th(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float tn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(th(i), th(i + vec2(1, 0)), f.x), mix(th(i + vec2(0, 1)), th(i + vec2(1, 1)), f.x), f.y); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
  float tl = tn(tPos.xz * .16) * .55 + tn(tPos.xz * .5 + 4.) * .3 + tn(tPos.xz * 2.2) * .15;
  diffuseColor.rgb *= mix(vec3(.74, .8, .66), vec3(1.12, 1.1, 1.), smoothstep(.25, .75, tl));`);
  };
  const lawn = add(new THREE.CircleGeometry(320, 64), lawnMat, 0, 0, 0, { cast: false });
  lawn.rotation.x = -Math.PI / 2;

  const asphalt = std({ ...rep(tex.grain, 60, 4), color: 0x3d4043, roughness: 0.95 });
  const road = add(new THREE.PlaneGeometry(400, 9), asphalt, 0, 0.012, 20.2, { cast: false }); road.rotation.x = -Math.PI / 2;
  add(box(400, 0.16, 0.5), std({ ...rep(tex.concrete, 120, 0.3), roughness: 0.9 }), 0, 0.06, 15.45, { cast: false });
  // footpath beside the kerb
  add(box(400, 0.06, 1.3), std({ ...rep(tex.concrete, 110, 0.4), roughness: 0.92 }), 0, 0.02, 13.4, { cast: false });

  /* driveway: three slabs with real joints */
  const dw = { x0: -6.75, x1: -1.5, z0: 4.56, z1: 12.72 };
  const dwRect = new THREE.Vector4(dw.x0, dw.z0, dw.x1, 15.2);
  const dwMat = growthMaterial('ground', U, { ...rep(tex.concrete, 2.4, 1.3), roughness: 0.9 }, { rect: dwRect });
  for (let i = 0; i < 3; i++) {
    const len = (dw.z1 - dw.z0) / 3;
    add(box(dw.x1 - dw.x0, 0.1, len - 0.025), dwMat, (dw.x0 + dw.x1) / 2, 0.02, dw.z0 + len * (i + 0.5), { cast: false });
  }
  // crossover from the footpath to the road
  add(box(dw.x1 - dw.x0 + 0.6, 0.1, 2.5), growthMaterial('ground', U, { ...rep(tex.concrete, 2.6, 1.1), roughness: 0.9 }, { rect: dwRect }), (dw.x0 + dw.x1) / 2, 0.025, 13.98, { cast: false });

  /* front path (pavers) and door step */
  const pathRect = new THREE.Vector4(-1.5, 5.3, 1.6, 6.5);
  const paverMat = growthMaterial('ground', U, { ...rep(tex.paver, 3.1 / 1.6, 1.2 / 1.6), roughness: 0.88 }, { rect: pathRect, joint: 0.4 });
  add(box(3.1, 0.08, 1.2), paverMat, 0.05, 0.02, 5.9, { cast: false });
  const stepMat = growthMaterial('ground', U, { ...rep(tex.concrete, 0.8, 0.5), roughness: 0.9 }, { rect: new THREE.Vector4(-0.15, 4.5, 1.55, 5.3) });
  add(box(1.7, 0.14, 0.8), stepMat, 0.7, 0.07, 4.9);

  /* walls */
  const wallMat = growthMaterial('wall', U, { ...rep(tex.render, 9, 2), roughness: 0.86, normalScale: new THREE.Vector2(0.5, 0.5) });
  add(box(H.w, H.wall, H.d), wallMat, 0, H.wall / 2, 0);
  // plinth line at the base of the wall
  add(box(H.w + 0.04, 0.12, H.d + 0.04), std({ color: 0x8d8a84, roughness: 0.9 }), 0, 0.03, 0);

  /* eaves, fascia, gutters */
  const trim = std({ color: 0x2f3338, roughness: 0.5, metalness: 0.25 });
  const white = std({ color: 0xf1eee8, roughness: 0.8 });
  add(box(H.roofW - 0.04, 0.1, H.roofD - 0.04), white, 0, H.wall + 0.05, 0);
  const fy = H.eaveY - 0.07;
  add(box(H.roofW, 0.22, 0.04), trim, 0, fy, H.roofD / 2);
  add(box(H.roofW, 0.22, 0.04), trim, 0, fy, -H.roofD / 2);
  add(box(0.04, 0.22, H.roofD), trim, H.roofW / 2, fy, 0);
  add(box(0.04, 0.22, H.roofD), trim, -H.roofW / 2, fy, 0);
  const gy = H.eaveY - 0.03, gutterDark = std({ color: 0x15171a, roughness: 0.9 });
  const gutter = (w, d, x, z) => { add(box(w, 0.13, d), trim, x, gy, z); add(box(w - 0.03, 0.02, d - 0.03).translate(0, 0.062, 0), gutterDark, x, gy, z, { cast: false }); };
  gutter(H.roofW + 0.28, 0.14, 0, H.roofD / 2 + 0.09);
  gutter(H.roofW + 0.28, 0.14, 0, -H.roofD / 2 - 0.09);
  gutter(0.14, H.roofD + 0.28, H.roofW / 2 + 0.09, 0);
  gutter(0.14, H.roofD + 0.28, -H.roofW / 2 - 0.09, 0);
  for (const [x, z] of [[H.w / 2 + 0.07, H.d / 2 - 0.25], [-H.w / 2 - 0.07, H.d / 2 - 0.25]]) {
    add(new THREE.CylinderGeometry(0.045, 0.045, H.wall, 12), white, x, H.wall / 2, z);
  }

  /* roof */
  const roofMat = growthMaterial('roof', U, { ...rep(tex.roof, 1 / 0.66, 1 / 0.68), roughness: 0.78, normalScale: new THREE.Vector2(1.1, 1.1) });
  roofMat.shadowSide = THREE.DoubleSide;
  {
    const W = H.roofW / 2, D = H.roofD / 2, R = H.ridge / 2, y0 = H.eaveY, y1 = H.eaveY + H.rise, sl = D / COS;
    const P = [], UV = [];
    const tri = (...v) => { for (const [x, y, z, u, w] of v) { P.push(x, y, z); UV.push(u, w); } };
    // front (+z) and back (-z)
    tri([-W, y0, D, 0, 0], [W, y0, D, 2 * W, 0], [R, y1, 0, W + R, sl]);
    tri([-W, y0, D, 0, 0], [R, y1, 0, W + R, sl], [-R, y1, 0, W - R, sl]);
    tri([W, y0, -D, 0, 0], [-W, y0, -D, 2 * W, 0], [-R, y1, 0, W + R, sl]);
    tri([W, y0, -D, 0, 0], [-R, y1, 0, W + R, sl], [R, y1, 0, W - R, sl]);
    // hip ends
    tri([W, y0, D, 0, 0], [W, y0, -D, 2 * D, 0], [R, y1, 0, D, sl]);
    tri([-W, y0, -D, 0, 0], [-W, y0, D, 2 * D, 0], [-R, y1, 0, D, sl]);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(UV, 2));
    g.computeVertexNormals();
    add(g, roofMat);

    // ridge and hip capping
    const capMat = std({ color: 0x7d4636, roughness: 0.8 });
    const beam = (a, b) => {
      const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), len = va.distanceTo(vb);
      const m = add(new THREE.CylinderGeometry(0.115, 0.115, len + 0.1, 10, Math.round(len / 0.42), false), capMat);
      m.position.copy(va).add(vb).multiplyScalar(0.5); m.position.y += 0.01;
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.sub(va).normalize());
      m.scale.set(1, 1, 0.62);
      return m;
    };
    beam([-R, y1, 0], [R, y1, 0]);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) beam([sx * R, y1, 0], [sx * W, y0 + 0.02, sz * D]);
  }

  /* openings */
  const glass = std({ color: 0x9db0c0, metalness: 1, roughness: 0.1, envMapIntensity: 1.5 });
  const sillMat = std({ color: 0xe8e4dc, roughness: 0.8 });
  function opening(w, h, cx, cy, face, o = {}) {
    const g = new THREE.Group();
    const t = 0.07, dp = 0.07;
    const fm = o.frame || trim;
    add(box(w, h, 0.02), glass, 0, 0, 0.005, { parent: g, cast: false });
    add(box(w + 2 * t, t, dp), fm, 0, h / 2 + t / 2, dp / 2, { parent: g });
    add(box(w + 2 * t, t, dp), fm, 0, -h / 2 - t / 2, dp / 2, { parent: g });
    add(box(t, h, dp), fm, -w / 2 - t / 2, 0, dp / 2, { parent: g });
    add(box(t, h, dp), fm, w / 2 + t / 2, 0, dp / 2, { parent: g });
    for (let i = 1; i < (o.panes || 2); i++) add(box(0.05, h, 0.05), fm, -w / 2 + (w * i) / (o.panes || 2), 0, 0.03, { parent: g });
    if (o.sill !== false) add(box(w + 0.3, 0.06, 0.16), sillMat, 0, -h / 2 - t - 0.03, 0.08, { parent: g });
    if (face === 'front') g.position.set(cx, cy, H.d / 2 + 0.003);
    if (face === 'right') { g.position.set(H.w / 2 + 0.003, cy, cx); g.rotation.y = Math.PI / 2; }
    if (face === 'left') { g.position.set(-H.w / 2 - 0.003, cy, cx); g.rotation.y = -Math.PI / 2; }
    world.add(g); return g;
  }
  opening(2.1, 1.3, 3.05, 1.55, 'front', { panes: 3 });
  opening(1.9, 2.08, 5.85, 1.11, 'front', { panes: 2, sill: false });
  opening(1.8, 1.2, -1.0, 1.55, 'right');
  opening(1.2, 1.0, 2.6, 1.65, 'right', { panes: 1 });
  opening(1.5, 1.0, -1.5, 1.65, 'left');

  // garage door
  add(box(4.7, 2.3, 0.05), std({ ...rep(tex.garage, 1, 1), roughness: 0.55, metalness: 0.2 }), -4.1, 1.15, H.d / 2 + 0.012);
  add(box(4.94, 0.12, 0.09), white, -4.1, 2.36, H.d / 2 + 0.03);
  add(box(0.12, 2.36, 0.09), white, -6.51, 1.18, H.d / 2 + 0.03);
  add(box(0.12, 2.36, 0.09), white, -1.69, 1.18, H.d / 2 + 0.03);

  // front door, in the brand's deep blue
  add(box(0.96, 2.1, 0.06), std({ color: 0x0a4a82, roughness: 0.45 }), 0.7, 1.19, H.d / 2 + 0.02);
  add(box(1.16, 0.1, 0.1), white, 0.7, 2.29, H.d / 2 + 0.03);
  add(box(0.1, 2.24, 0.1), white, 0.17, 1.22, H.d / 2 + 0.03);
  add(box(0.1, 2.24, 0.1), white, 1.23, 1.22, H.d / 2 + 0.03);
  add(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 10), std({ color: 0xc9ccd0, metalness: 1, roughness: 0.25 }), 1.02, 1.2, H.d / 2 + 0.085);
  // wall light beside the door
  add(box(0.12, 0.22, 0.1), trim, 1.55, 1.95, H.d / 2 + 0.05);

  /* deck */
  const dk = { x0: 4.35, x1: 7.6, z0: 4.56, z1: 7.7, y: 0.26 };
  const deckRect = new THREE.Vector4(dk.x0, dk.z0 - 2, dk.x1, dk.z1);
  const boardMat = growthMaterial('ground', U, { ...rep(tex.timber, 1, 1), roughness: 0.82 }, { rect: deckRect });
  {
    const bw = 0.138, gap = 0.012, n = Math.floor((dk.z1 - dk.z0) / (bw + gap));
    const geo = box(dk.x1 - dk.x0, 0.03, bw);
    for (let i = 0; i < n; i++) {
      const b = add(geo, boardMat, (dk.x0 + dk.x1) / 2, dk.y - 0.015, dk.z0 + (bw + gap) * (i + 0.5));
      b.material = boardMat;
    }
    const skirt = std({ ...rep(tex.timber, 1, 0.3), color: 0xb9b0a2, roughness: 0.9 });
    add(box(dk.x1 - dk.x0, dk.y - 0.03, 0.03), skirt, (dk.x0 + dk.x1) / 2, (dk.y - 0.03) / 2, dk.z1 - 0.015);
    add(box(0.03, dk.y - 0.03, dk.z1 - dk.z0), skirt, dk.x0 + 0.015, (dk.y - 0.03) / 2, (dk.z0 + dk.z1) / 2);
    add(box(0.03, dk.y - 0.03, dk.z1 - dk.z0), skirt, dk.x1 - 0.015, (dk.y - 0.03) / 2, (dk.z0 + dk.z1) / 2);
    add(box(0.02, dk.y - 0.04, dk.z1 - dk.z0 - 0.1), std({ color: 0x111111 }), (dk.x0 + dk.x1) / 2, (dk.y - 0.04) / 2, (dk.z0 + dk.z1) / 2, { cast: false });
    add(box(1.4, 0.03, 0.3), boardMat, dk.x0 + 1.1, 0.115, dk.z1 + 0.16);
    add(box(1.4, 0.1, 0.28), skirt, dk.x0 + 1.1, 0.05, dk.z1 + 0.15);
  }

  /* planting */
  const leaf = [0x3f6a2c, 0x4d7a31, 0x35602a, 0x5a8436].map((c) => {
    const m = std({ color: c, roughness: 0.92 });
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 lPos;')
        .replace('#include <fog_vertex>', '#include <fog_vertex>\n  lPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 lPos;
float lh(vec3 p){ p = fract(p * .1031); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float ln(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(lh(i), lh(i + vec3(1,0,0)), f.x), mix(lh(i + vec3(0,1,0)), lh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(lh(i + vec3(0,0,1)), lh(i + vec3(1,0,1)), f.x), mix(lh(i + vec3(0,1,1)), lh(i + vec3(1,1,1)), f.x), f.y), f.z); }`)
        .replace('#include <map_fragment>', `#include <map_fragment>
  float lf = ln(lPos * 9.) * .6 + ln(lPos * 23.) * .4;
  diffuseColor.rgb *= .5 + 1.05 * smoothstep(.2, .85, lf);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(1.25, 1.2, .7), smoothstep(.62, .9, ln(lPos * 4.)) * .5);`);
    };
    m.customProgramCacheKey = () => 'leaf';
    return m;
  });
  const blobGeos = [0, 1, 2].map((s) => {
    const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position, r = lcg(100 + s);
    const n = periodicNoise(8, 200 + s);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const k = 0.78 + 0.5 * n((x + 2) * 2.1 + z, (y + 2) * 2.1 + z * 0.7) + 0.06 * r();
      p.setXYZ(i, x * k, y * k, z * k);
    }
    const nr = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) { const l = Math.hypot(p.getX(i), p.getY(i), p.getZ(i)); nr[i * 3] = p.getX(i) / l; nr[i * 3 + 1] = p.getY(i) / l; nr[i * 3 + 2] = p.getZ(i) / l; }
    g.setAttribute('normal', new THREE.BufferAttribute(nr, 3)); return g;
  });
  function foliage(x, y, z, rx, ry, rz, count, seed, o = {}) {
    const r = lcg(seed);
    for (let i = 0; i < count; i++) {
      const a = r() * Math.PI * 2, e = Math.acos(2 * r() - 1), d = Math.cbrt(r()) * 0.75;
      const s = (0.3 + 0.28 * r()) * Math.min(rx, ry, rz) * (o.blob || 1.25);
      const m = add(blobGeos[i % 3], leaf[Math.floor(r() * leaf.length)],
        x + Math.sin(e) * Math.cos(a) * rx * d, y + Math.cos(e) * ry * d, z + Math.sin(e) * Math.sin(a) * rz * d, { cast: o.cast !== false });
      m.scale.setScalar(s); m.rotation.set(r() * 6, r() * 6, r() * 6);
    }
  }
  const bark = std({ color: 0x5b4a3c, roughness: 1 });
  function tree(x, z, h, r, seed, o = {}) {
    const trunk = add(new THREE.CylinderGeometry(0.13 * r / 2.5, 0.24 * r / 2.5, h, 9), bark, x, h / 2, z, { cast: o.cast !== false });
    trunk.rotation.z = 0.03;
    foliage(x, h + r * 0.35, z, r, r * 0.72, r, o.count || 60, seed, o);
  }
  tree(11.4, 2.6, 3.6, 3.1, 7, { count: 70 });            // the shade tree
  tree(-12.6, -7.5, 4.2, 3.0, 19);
  tree(3.5, -11.5, 4.4, 3.2, 23);
  // garden beds
  const mulch = std({ ...rep(tex.grain, 3, 1), color: 0x4a3a2c, roughness: 1 });
  add(box(2.55, 0.1, 0.85), mulch, 2.95, 0.03, 4.95, { cast: false });
  for (const [x, z, s, sd] of [[2.1, 5.0, 0.36, 31], [2.85, 5.05, 0.44, 32], [3.65, 5.0, 0.38, 33], ]) {
    foliage(x, 0.1 + s * 0.8, z, s, s * 0.85, s, 7, sd);
  }
  // street trees and a soft backdrop of planting behind the fence line
  {
    const r = lcg(77);
    for (let i = 0; i < 60; i++) {
      const a = Math.PI * (0.92 + 1.16 * (i / 59)) + (r() - 0.5) * 0.08;   // behind and beside the house
      const d = 34 + r() * 60;
      tree(Math.cos(a) * d, Math.sin(a) * d, 3.5 + r() * 3.5, 3 + r() * 3, 300 + i, { cast: false, count: 22, blob: 1.6 });
    }
  }

  /* fence */
  const fenceMat = (len) => growthMaterial('wall', U, { ...rep(tex.fence, len / 0.42, 1), roughness: 0.92 });
  add(box(27, 1.8, 0.05), fenceMat(27), 0, 0.9, -11.5);
  add(box(0.05, 1.8, 17), fenceMat(17), 13.5, 0.9, -3);
  add(box(0.05, 1.8, 17), fenceMat(17), -13.5, 0.9, -3);

  /* letterbox */
  add(box(0.34, 0.9, 0.34), std({ ...rep(tex.render, 0.4, 0.8), roughness: 0.85 }), -7.6, 0.45, 12.3);
  add(box(0.42, 0.06, 0.42), trim, -7.6, 0.93, 12.3);

  /* moss and debris collecting in the front gutter */
  const debris = [];
  {
    const r = lcg(55), mat = [std({ color: 0x4d6a25, roughness: 1 }), std({ color: 0x3a4a22, roughness: 1 }), std({ color: 0x5a4a30, roughness: 1 })];
    for (let i = 0; i < 46; i++) {
      const x = -1 + r() * 8.4;
      const m = add(blobGeos[i % 3], mat[i % 3], x, gy + 0.065, H.roofD / 2 + 0.09 + (r() - 0.5) * 0.05, { cast: false });
      m.userData = { s: 0.035 + r() * 0.05, at: 0.3 + r() * 0.55, len: 1 + r() * 2.2 };
      m.rotation.y = r() * 6; debris.push(m);
    }
  }

  /* camera */
  const BASE_FOV = 34, BASE_ASPECT = 16 / 9;
  let width = 1, height = 1;
  function resize(w, h, dpr) {
    width = w; height = h;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the horizontal field of view of the 16:9 framing on taller screens.
    const hfov = 2 * Math.atan(Math.tan((BASE_FOV * Math.PI) / 360) * BASE_ASPECT);
    const v = (2 * Math.atan(Math.tan(hfov / 2) / camera.aspect) * 180) / Math.PI;
    camera.fov = clamp(v, BASE_FOV, 62);
    camera.updateProjectionMatrix();
  }

  const look = new THREE.Vector3(), tmp = new THREE.Vector3();

  /**
   * Draw one frame.
   * s = { cam:[x,y,z], look:[x,y,z], roof, wall, ground, treat, wipe, wipeOn, shift }
   */
  function update(s) {
    U.roof.value = s.roof; U.wall.value = s.wall; U.ground.value = s.ground;
    U.shared.uTreat.value = s.treat; U.shared.uWipe.value = s.wipe; U.shared.uWipeOn.value = s.wipeOn;
    for (const m of debris) {
      const k = smooth(m.userData.at, m.userData.at + 0.3, s.roof) * smooth(s.wipe - 0.4, s.wipe + 0.6, m.position.x);
      m.visible = k > 0.01;
      m.scale.set(m.userData.s * m.userData.len * k, m.userData.s * k, m.userData.s * k);
    }
    camera.position.fromArray(s.cam); look.fromArray(s.look); camera.lookAt(look);
    const px = Math.round((s.shift || 0) * width);
    if (px) camera.setViewOffset(width, height, px, 0, width, height); else camera.clearViewOffset();
    renderer.render(scene, camera);
  }

  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  /** Project a world point to stage fractions (0..1), or null when off camera. */
  function project(p) {
    tmp.fromArray(p).project(camera);
    if (tmp.z > 1 || tmp.z < -1) return null;
    return [tmp.x * 0.5 + 0.5, 0.5 - tmp.y * 0.5];
  }

  return { update, resize, project, renderer };
}
