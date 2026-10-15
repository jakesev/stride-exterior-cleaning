/* Stride — "The Maquette".
 *
 * A white-clay architectural model of a typical Redlands home, weathered the
 * way South-East Queensland weathers houses: lichen-dark roof tiles, algae on
 * the render, a mould-blackened driveway, dusty glass and solar.
 *
 * Everything the scroll story needs is driven through setState():
 *   cam      camera orbit (az, el, dist, target) — eased internally
 *   sweep    the diagonal "clean pass" (at the angle of the Stride S)
 *   kinds    per-surface cleaning progress 0..1 (roof, wall, concrete, pavers, glass)
 *   drive    rotary surface-cleaner progress over the driveway, in lanes
 *   explode  0..1 lifts the house apart floor by floor
 *   xray     0..1 strength of the "grime vision" lens; lens = {x, y, r} in CSS px
 *
 * Grime is procedural (no textures to download). Patterns are computed in each
 * layer's rest frame, so they stay fixed to surfaces when the house explodes.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BoxGeometry, PlaneGeometry,
  CylinderGeometry, BufferGeometry, BufferAttribute, Float32BufferAttribute,
  MeshStandardMaterial, MeshPhysicalMaterial, HemisphereLight, DirectionalLight, Vector2, Vector3, Vector4,
  Raycaster, CanvasTexture, PCFSoftShadowMap, NeutralToneMapping, SRGBColorSpace, PMREMGenerator,
  Points, ShaderMaterial, NormalBlending, MathUtils, LinearFilter, IcosahedronGeometry, TorusGeometry
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const PLOT = { minX: -13, maxX: 13, minZ: -9.5, maxZ: 10.5 };
const PLOT_W = PLOT.maxX - PLOT.minX, PLOT_D = PLOT.maxZ - PLOT.minZ;
const SWEEP_DIR = new Vector2(Math.cos(MathUtils.degToRad(-24)), Math.sin(MathUtils.degToRad(-24))).normalize();
const CLAY = 0xf7f8f9, CLAY_SHADE = 0xeef1f4, GLASS = 0xbfd6ea, NAVY = 0x0b1d33, BLUE = 0x0076d1;
export const SWEEP_FROM = -18, SWEEP_TO = 20, SWEEP_ALL = 60;
const LIFT = [0, 2.6, 5.8, 9.6, 12.8];        // per-layer lift at explode = 1

const DRIVE = { x0: 3.55, x1: 8.45, z0: 2.9, z1: 10.5, lanes: 3 };

/* What the lens reports for each surface kind. */
export const SURFACE_INFO = {
  roof: { name: 'Roof tiles', growth: 'Lichen, moss & black streaking', method: 'Soft wash · low pressure', href: '/services/roof-cleaning/' },
  gutter: { name: 'Gutters & fascia', growth: 'Leaf litter, grit & staining', method: 'Cleared by hand · flushed', href: '/services/gutter-cleaning/' },
  wall: { name: 'Rendered walls', growth: 'Algae & mould, worst on shaded sides', method: 'Soft wash · fan-tip rinse', href: '/services/house-washing/' },
  concrete: { name: 'Concrete driveway', growth: 'Black mould, tyre marks & grime', method: 'Rotary surface cleaner', href: '/services/driveway-cleaning/' },
  pavers: { name: 'Pavers & pool surround', growth: 'Slippery film & joint growth', method: 'Stone-safe clean · low pressure', href: '/services/pool-surround-cleaning/' },
  glass: { name: 'Windows & glass', growth: 'Salt film & mineral spotting', method: 'Pure water · no pressure', href: '/services/window-cleaning/' },
  solar: { name: 'Solar panels', growth: 'Dust, pollen & droppings', method: 'Deionised water · soft brush', href: '/services/solar-panel-cleaning/' }
};

export function mountMaquette(root, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'maquette-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  root.appendChild(canvas);

  const isPoster = !!opts.poster;
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  const dprCap = isPoster ? (opts.dpr || 1) : (coarse ? 1.5 : 1.75);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: isPoster, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0xffffff, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.38;

  const camera = new PerspectiveCamera(20, 1, 1, 400);
  scene.add(new HemisphereLight(0xffffff, 0xc4ceda, 0.6));
  const sun = new DirectionalLight(0xfffdf8, 4.4);
  sun.position.set(-22, 30, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 26, bottom: -22, near: 1, far: 90 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
  scene.add(sun);

  /* ----------------------------------------------------- shared uniforms */
  const brushCanvas = document.createElement('canvas');
  brushCanvas.width = 512; brushCanvas.height = Math.round(512 * PLOT_D / PLOT_W);
  const bctx = brushCanvas.getContext('2d');
  bctx.fillStyle = '#000'; bctx.fillRect(0, 0, brushCanvas.width, brushCanvas.height);
  const brushTex = new CanvasTexture(brushCanvas);
  brushTex.minFilter = LinearFilter; brushTex.magFilter = LinearFilter; brushTex.generateMipmaps = false;

  const U = {
    uSweep: { value: SWEEP_FROM },
    uBrush: { value: brushTex },
    uPlot: { value: new Vector2(PLOT.minX, PLOT.minZ) },
    uPlotSize: { value: new Vector2(PLOT_W, PLOT_D) },
    uDir: { value: SWEEP_DIR.clone() },
    uKA: { value: new Vector4(0, 0, 0, 0) },      // roof, wall, concrete, pavers
    uKG: { value: 0 },                             // glass + solar
    uDrive: { value: 0 },
    uXray: { value: 0 },
    uLens: { value: new Vector3(-999, -999, 120) }
  };

  const NOISE = `
    float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
    float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(h21(i),h21(i+vec2(1,0)),u.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x), u.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int k=0;k<5;k++){ v+=a*vnoise(p); p=p*2.03+17.1; a*=0.5; } return v; }
    vec3 heat(float t){ t = clamp(t,0.0,1.0);
      vec3 a = vec3(0.04,0.16,0.42), b = vec3(0.0,0.46,0.82), c = vec3(0.30,0.85,0.92), d = vec3(1.0,0.86,0.30), e = vec3(0.98,0.42,0.18);
      return t < 0.25 ? mix(a,b,t/0.25) : t < 0.5 ? mix(b,c,(t-0.25)/0.25) : t < 0.75 ? mix(c,d,(t-0.5)/0.25) : mix(d,e,(t-0.75)/0.25); }
  `;

  /* kind: 0 roof, 1 wall, 2 concrete, 3 pavers, 4 glass/solar */
  function grime(base, kind, lift, params = {}, physical = false) {
    const mat = new (physical ? MeshPhysicalMaterial : MeshStandardMaterial)(Object.assign({ color: base, roughness: 0.82, metalness: 0 }, params));
    const uLift = { value: lift };
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U, { uLift });
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
        .replace('#include <project_vertex>', '#include <project_vertex>\nvWP = (modelMatrix * vec4(transformed,1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec3 vWP; varying vec3 vWN;
          uniform float uSweep; uniform sampler2D uBrush; uniform vec2 uPlot; uniform vec2 uPlotSize; uniform vec2 uDir;
          uniform vec4 uKA; uniform float uKG; uniform float uDrive; uniform float uXray; uniform vec3 uLens; uniform vec3 uLift;
          ${NOISE}
          float gWet = 0.0; vec3 gLensCol = vec3(0.0); float gLens = 0.0;`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          {
            vec3 p = vWP - uLift; vec3 n = normalize(vWN);
            float horiz = abs(n.z) > abs(n.x) ? p.x : p.z;
            float dirt = 0.0; vec3 dcol = vec3(0.0);
            float nz = fbm(p.xz*0.7 + p.y*0.2) - 0.5;
            ${kind === 0 ? `
              float streak = fbm(vec2(horiz*5.0, p.y*0.5 + 2.0));
              float patchy = fbm(p.xz*0.5 + 3.0);
              float lichen = smoothstep(0.64, 0.76, fbm(p.xz*3.4 + 1.0));
              dirt = clamp(0.62 + smoothstep(0.45, 0.7, streak)*0.25 + smoothstep(0.5,0.7,patchy)*0.2, 0.0, 1.0);
              dcol = mix(vec3(0.07,0.075,0.075), vec3(0.24,0.245,0.22), smoothstep(0.35,0.75, streak*0.6 + patchy*0.6));
              dcol = mix(dcol, vec3(0.42,0.46,0.30), lichen*0.75);
              float kp = uKA.x; float ks = p.x + nz*2.2;` : ''}
            ${kind === 1 ? `
              float climb = 1.0 - smoothstep(0.0, 2.6, p.y);
              float streak = fbm(vec2(horiz*3.4, p.y*0.5 + 7.0));
              float blot = fbm(vec2(horiz, p.y)*0.9 + 11.0);
              dirt = clamp(0.28 + climb*0.75*smoothstep(0.2,0.6,blot+0.1) + smoothstep(0.5,0.75,streak)*0.5 + smoothstep(0.55,0.8,blot)*0.3, 0.0, 1.0);
              dcol = mix(vec3(0.33,0.38,0.24), vec3(0.17,0.19,0.14), fbm(vec2(horiz, p.y)*2.1));
              float kp = uKA.y; float ks = p.x + nz*2.2;` : ''}
            ${kind === 2 ? `
              float big = fbm(p.xz*0.32 + 5.0);
              float fine = fbm(p.xz*2.4);
              float tyre = smoothstep(0.55, 0.0, abs(p.x - 4.55)) + smoothstep(0.55, 0.0, abs(p.x - 6.95));
              dirt = clamp(0.38 + smoothstep(0.3, 0.68, big*0.7 + fine*0.45)*0.65 + tyre*0.35*smoothstep(0.3,0.7,fine), 0.0, 1.0);
              dcol = mix(vec3(0.06,0.065,0.06), vec3(0.24,0.25,0.21), smoothstep(0.25,0.75,fine));
              float kp = uKA.z; float ks = -p.z + nz*2.0;` : ''}
            ${kind === 3 ? `
              vec2 g = fract(p.xz*vec2(2.0, 4.0));
              float joint = 1.0 - smoothstep(0.0, 0.08, min(min(g.x, 1.0-g.x), min(g.y, 1.0-g.y)));
              float big = fbm(p.xz*0.5 + 9.0);
              dirt = clamp(0.35 + smoothstep(0.35, 0.65, big)*0.6 + joint*0.6, 0.0, 1.0);
              dcol = mix(vec3(0.09,0.11,0.08), vec3(0.27,0.30,0.21), fbm(p.xz*3.0));
              float kp = uKA.w; float ks = p.x + nz*2.0;` : ''}
            ${kind === 4 ? `
              float dust = fbm(p.xz*1.3 + p.y*0.7 + 2.0);
              dirt = smoothstep(0.25, 0.85, dust) * 0.9;
              dcol = vec3(0.55,0.52,0.45);
              float kp = uKG; float ks = p.x + nz*2.0;` : ''}
            float rawDirt = dirt;

            vec2 uv = (p.xz - uPlot) / uPlotSize;
            float brush = texture2D(uBrush, uv).r;
            float s = dot(p.xz, uDir) + nz * 2.2;
            float e = uSweep - s;
            float clean = max(smoothstep(0.0, 0.35, e), smoothstep(0.15, 0.7, brush));
            float ke = mix(-17.0, 17.0, kp) - ks;
            clean = max(clean, smoothstep(0.0, 0.35, ke) * step(0.001, kp));
            float wet = max(smoothstep(-0.1, 0.25, e) * (1.0 - smoothstep(0.6, 3.4, e)), smoothstep(0.1,0.5,brush)*(1.0-smoothstep(0.75,1.0,brush))*0.85);
            wet = max(wet, smoothstep(-0.1, 0.25, ke) * (1.0 - smoothstep(0.5, 2.8, ke)) * step(0.001, kp) * step(kp, 0.999));
            ${kind === 2 ? `
              // rotary cleaner lanes across the driveway
              if (p.x > ${DRIVE.x0.toFixed(2)} && p.x < ${DRIVE.x1.toFixed(2)} && p.z > ${DRIVE.z0.toFixed(2)}) {
                float lw = ${((DRIVE.x1 - DRIVE.x0) / DRIVE.lanes).toFixed(4)};
                float lane = floor((p.x - ${DRIVE.x0.toFixed(2)}) / lw);
                float along = (p.z - ${DRIVE.z0.toFixed(2)}) / ${(DRIVE.z1 - DRIVE.z0).toFixed(2)};
                along = mod(lane, 2.0) < 0.5 ? 1.0 - along : along;
                float pos = lane + along;
                float de = uDrive * ${DRIVE.lanes.toFixed(1)} - pos;
                clean = max(clean, smoothstep(0.0, 0.02, de) * step(0.0001, uDrive));
                wet = max(wet, smoothstep(0.0, 0.02, de) * (1.0 - smoothstep(0.02, 0.35, de)) * step(0.0001, uDrive) * step(uDrive, 0.999));
              }` : ''}
            dirt *= 1.0 - clean;
            diffuseColor.rgb = mix(diffuseColor.rgb, dcol, dirt * ${kind === 4 ? '0.6' : '0.92'});
            ${kind === 1 ? 'diffuseColor.rgb *= mix(0.84, 1.0, smoothstep(0.0, 0.7, p.y));' : ''}
            ${kind === 0 ? 'diffuseColor.rgb *= mix(0.86, 1.0, smoothstep(0.0, 0.09, fract(p.y*3.4)));' : ''}
            gWet = wet;
            diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.80, 0.88, 0.97), gWet * 0.75);

            // Grime vision: inside the lens, show where growth takes hold.
            if (uXray > 0.001) {
              float d = distance(gl_FragCoord.xy, uLens.xy);
              gLens = (1.0 - smoothstep(uLens.z - 1.5, uLens.z, d)) * uXray;
              float risk = clamp(rawDirt * (0.65 + 0.35 * (1.0 - smoothstep(0.0, 3.0, p.y))) + (n.z < -0.5 ? 0.15 : 0.0), 0.0, 1.0);
              gLensCol = heat(risk);
              diffuseColor.rgb = mix(diffuseColor.rgb, gLensCol * 0.35, gLens);
            }
          }`)
        .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor, 0.12, gWet);`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          totalEmissiveRadiance += gLensCol * gLens * 0.85;`);
    };
    mat.customProgramCacheKey = () => 'grime' + kind + (physical ? 'p' : '');
    return mat;
  }

  const shared = {
    trim: new MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }),
    plinth: new MeshStandardMaterial({ color: CLAY_SHADE, roughness: 0.95 }),
    lawn: new MeshStandardMaterial({ color: 0xeef2ef, roughness: 1 }),
    tree: new MeshStandardMaterial({ color: 0xf4f6f7, roughness: 0.9, flatShading: true }),
    water: new MeshPhysicalMaterial({ color: BLUE, roughness: 0.05, opacity: 0.9, transparent: true, envMapIntensity: 1.6, clearcoat: 1 }),
    navy: new MeshStandardMaterial({ color: NAVY, roughness: 0.4 })
  };

  /* --------------------------------------------------------------- layers */
  const world = new Group();
  scene.add(world);
  const layers = LIFT.map(() => { const g = new Group(); world.add(g); return g; });
  const mats = layers.map((g) => ({
    ...shared,
    wall: grime(CLAY, 1, g.position),
    roof: grime(0xf2f4f6, 0, g.position, { roughness: 0.7 }),
    concrete: grime(0xf0f2f4, 2, g.position, { roughness: 0.9 }),
    pavers: grime(0xf3f4f5, 3, g.position, { roughness: 0.88 }),
    solar: grime(NAVY, 4, g.position, { roughness: 0.22, metalness: 0.35 }),
    glass: grime(GLASS, 4, g.position, { roughness: 0.08, metalness: 0.1, envMapIntensity: 1.4 }, true),
    gutter: grime(0xe9edf1, 1, g.position, { roughness: 0.5 })
  }));
  const pickable = [];
  let L = 0;                                    // current layer while building
  const M = () => mats[L];

  function add(mesh, surface, { cast = true } = {}) {
    mesh.castShadow = cast; mesh.receiveShadow = true;
    if (surface) { mesh.userData.surface = surface; pickable.push(mesh); }
    layers[L].add(mesh);
    return mesh;
  }
  function box(w, h, d, mat, x, y, z, surface, o = {}) {
    const m = new Mesh(new BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    return add(m, surface, o);
  }
  function hipRoof(w, d, h, cx, y0, cz) {
    const hw = w / 2, hd = d / 2, ridge = Math.max(0, (w - d) / 2);
    const v = [[-hw, 0, -hd], [hw, 0, -hd], [hw, 0, hd], [-hw, 0, hd], [-ridge, h, 0], [ridge, h, 0]];
    const tris = [[3, 2, 5], [3, 5, 4], [1, 0, 4], [1, 4, 5], [0, 3, 4], [2, 1, 5]];
    const pos = [];
    tris.forEach((t) => t.forEach((i) => pos.push(...v[i])));
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    const m = new Mesh(g, M().roof);
    m.position.set(cx, y0, cz);
    add(m, 'roof');
    const t = 0.16;
    box(w + 0.02, t, t * 1.3, M().gutter, cx, y0 - 0.04, cz + hd, 'gutter', { cast: false });
    box(w + 0.02, t, t * 1.3, M().gutter, cx, y0 - 0.04, cz - hd, 'gutter', { cast: false });
    box(t * 1.3, t, d, M().gutter, cx - hw, y0 - 0.04, cz, 'gutter', { cast: false });
    box(t * 1.3, t, d, M().gutter, cx + hw, y0 - 0.04, cz, 'gutter', { cast: false });
  }

  const H = { x: -2.6, z: -2.2, w: 11, d: 7.2, h1: 3.1, h2: 6.0 };
  const G = { x: 6.0, z: -0.9, w: 5.4, d: 7.6, h: 3.2 };
  const hf = H.z + H.d / 2 + 0.01;
  const gFront = G.z + G.d / 2;

  // L0 — site: plinth, lawn, driveway, paths, pool, boundary, trees
  L = 0;
  const plinth = new Mesh(new BoxGeometry(PLOT_W + 1.2, 0.9, PLOT_D + 1.2), shared.plinth);
  plinth.position.set(0, -0.45, (PLOT.minZ + PLOT.maxZ) / 2);
  add(plinth, null, { cast: false });
  const lawn = new Mesh(new PlaneGeometry(PLOT_W, PLOT_D), shared.lawn);
  lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, 0.002, (PLOT.minZ + PLOT.maxZ) / 2);
  add(lawn, null, { cast: false });
  box(DRIVE.x1 - DRIVE.x0, 0.08, PLOT.maxZ - gFront, M().concrete, G.x, 0.04, (gFront + PLOT.maxZ) / 2, 'concrete', { cast: false });
  box(1.4, 0.07, 3.4, M().concrete, -0.6, 0.035, hf + 2.7, 'concrete', { cast: false });
  box(5.9, 0.07, 1.3, M().concrete, 1.75, 0.035, hf + 3.4, 'concrete', { cast: false });
  box(9.6, 0.09, 6.4, M().pavers, -6.4, 0.045, 6.0, 'pavers', { cast: false });
  box(6.0, 0.14, 0.32, M().pavers, -6.4, 0.12, 4.15, 'pavers', { cast: false });
  box(6.0, 0.14, 0.32, M().pavers, -6.4, 0.12, 7.75, 'pavers', { cast: false });
  box(0.32, 0.14, 3.92, M().pavers, -9.24, 0.12, 5.95, 'pavers', { cast: false });
  box(0.32, 0.14, 3.92, M().pavers, -3.56, 0.12, 5.95, 'pavers', { cast: false });
  const water = new Mesh(new PlaneGeometry(5.36, 3.3), shared.water);
  water.rotation.x = -Math.PI / 2; water.position.set(-6.4, 0.1, 5.95);
  add(water, null, { cast: false });
  box(PLOT.maxX - (G.x + 2.6) - 0.1, 0.9, 0.3, M().wall, (PLOT.maxX + G.x + 2.6) / 2, 0.45, PLOT.maxZ - 0.15, 'wall');
  box((G.x - 2.6) - PLOT.minX - 0.1, 0.9, 0.3, M().wall, (G.x - 2.6 + PLOT.minX) / 2, 0.45, PLOT.maxZ - 0.15, 'wall');
  box(0.3, 0.9, PLOT_D - 0.3, M().wall, PLOT.minX + 0.15, 0.45, (PLOT.minZ + PLOT.maxZ) / 2 - 0.15, 'wall');
  const canopyGeo = new IcosahedronGeometry(1, 1);
  [[-11, -6.5, 1.6], [10.6, -6.8, 1.9], [11.2, 6.2, 1.3], [-11.2, 9.0, 1.0], [2.6, -8.0, 1.2]].forEach(([x, z, s]) => {
    const stem = new Mesh(new CylinderGeometry(0.08 * s, 0.11 * s, 2.4 * s, 6), shared.tree);
    stem.position.set(x, 1.2 * s, z); add(stem);
    const c = new Mesh(canopyGeo, shared.tree);
    c.scale.setScalar(1.3 * s); c.position.set(x, 2.9 * s, z); c.rotation.set(s, s * 2, 0); add(c);
  });

  // L1 — ground floor + garage
  L = 1;
  box(H.w, H.h1, H.d, M().wall, H.x, H.h1 / 2, H.z, 'wall');
  box(G.w, G.h, G.d, M().wall, G.x, G.h / 2, G.z, 'wall');
  box(4.2, 2.4, 0.08, shared.trim, G.x, 1.2, gFront + 0.04, null);
  for (let k = 0; k < 5; k++) box(4.2, 0.03, 0.1, shared.plinth, G.x, 0.45 + k * 0.45, gFront + 0.06, null, { cast: false });
  box(4.4, 2.3, 0.06, M().glass, -5.0, 1.45, hf + 0.02, 'glass', { cast: false });
  for (let k = 0; k < 3; k++) box(0.06, 2.3, 0.1, shared.trim, -6.1 + k * 1.1, 1.45, hf + 0.05, null, { cast: false });
  box(1.2, 2.4, 0.08, shared.navy, -0.6, 1.2, hf + 0.03, null, { cast: false });
  box(2.6, 0.14, 1.6, shared.trim, -0.6, 2.7, hf + 0.8, null);
  box(0.16, 2.7, 0.16, shared.trim, 0.55, 1.35, hf + 1.5, null);
  box(0.06, 1.6, 1.4, M().glass, H.x - H.w / 2 - 0.02, 1.5, H.z + 1.2, 'glass', { cast: false });
  [[H.x - H.w / 2 + 0.2, H.z + H.d / 2 + 0.15], [H.x + H.w / 2 - 0.2, H.z - H.d / 2 - 0.15]].forEach(([x, z]) => {
    const p = new Mesh(new CylinderGeometry(0.07, 0.07, H.h1, 8), shared.trim); p.position.set(x, H.h1 / 2, z); add(p);
  });

  // L2 — upper floor
  L = 2;
  box(H.w, H.h2 - H.h1, H.d, M().wall, H.x, (H.h1 + H.h2) / 2, H.z, 'wall');
  box(H.w + 0.12, 0.18, H.d + 0.12, shared.trim, H.x, H.h1 + 0.09, H.z, null);
  [-6.4, -4.2, -1.0, 1.2].forEach((x) => {
    box(1.5, 1.6, 0.06, M().glass, x, 4.6, hf + 0.02, 'glass', { cast: false });
    box(1.7, 0.1, 0.18, shared.trim, x, 3.75, hf + 0.06, null);
  });
  box(0.06, 1.6, 1.4, M().glass, H.x - H.w / 2 - 0.02, 4.6, H.z + 1.2, 'glass', { cast: false });
  [[H.x - H.w / 2 + 0.2, H.z + H.d / 2 + 0.15], [H.x + H.w / 2 - 0.2, H.z - H.d / 2 - 0.15]].forEach(([x, z]) => {
    const p = new Mesh(new CylinderGeometry(0.07, 0.07, H.h2 - H.h1, 8), shared.trim); p.position.set(x, (H.h1 + H.h2) / 2, z); add(p);
  });

  // L3 — roofs and gutters
  L = 3;
  hipRoof(H.w + 0.9, H.d + 0.9, 2.3, H.x, H.h2, H.z);
  hipRoof(G.w + 0.8, G.d + 0.8, 1.5, G.x, G.h, G.z);

  // L4 — solar array
  L = 4;
  {
    const slope = Math.atan2(2.3, (H.d + 0.9) / 2), run = (H.d + 0.9) / 2;
    const arr = new Group();
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const panel = new Mesh(new BoxGeometry(1.05, 0.06, 1.6), M().solar);
      panel.position.set((c - 1.5) * 1.13, 0, (r - 0.5) * 1.68);
      panel.castShadow = true; panel.receiveShadow = true;
      panel.userData.surface = 'solar'; pickable.push(panel);
      arr.add(panel);
    }
    arr.rotation.x = slope;
    arr.position.set(H.x + 1.4, H.h2 + 1.23, H.z + run * 0.5);
    layers[4].add(arr);
  }

  /* --------------------------------------------------- rotary cleaner */
  const rotary = new Group();
  const deck = new Mesh(new CylinderGeometry(0.62, 0.66, 0.16, 40), shared.navy);
  deck.position.y = 0.16; deck.castShadow = true;
  const ring = new Mesh(new TorusGeometry(0.64, 0.035, 8, 48), new MeshStandardMaterial({ color: BLUE, roughness: 0.3 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.1;
  const handle = new Mesh(new CylinderGeometry(0.035, 0.035, 2.2, 8), shared.navy);
  handle.position.set(0, 1.05, 0.7); handle.rotation.x = -0.65; handle.castShadow = true;
  rotary.add(deck, ring, handle);
  rotary.visible = false;
  layers[0].add(rotary);

  /* ------------------------------------------------------------ particles */
  const N = coarse ? 320 : 640;
  const pPos = new Float32Array(N * 3), pVel = new Float32Array(N * 3), pLife = new Float32Array(N);
  const pGeo = new BufferGeometry();
  pGeo.setAttribute('position', new BufferAttribute(pPos, 3));
  pGeo.setAttribute('life', new BufferAttribute(pLife, 1));
  const pMat = new ShaderMaterial({
    transparent: true, depthWrite: false, blending: NormalBlending,
    uniforms: { uScale: { value: renderer.getPixelRatio() * 26.0 } },
    vertexShader: `attribute float life; varying float vL; uniform float uScale;
      void main(){ vL = life; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
      gl_PointSize = uScale * (0.35 + life*0.65) / -mv.z * 6.0; }`,
    fragmentShader: `varying float vL; void main(){ vec2 c = gl_PointCoord-0.5; float d = length(c);
      if(d>0.5) discard; float a = smoothstep(0.5,0.1,d) * vL * 0.6; gl_FragColor = vec4(mix(vec3(0.0,0.46,0.82), vec3(0.75,0.9,1.0), 1.0-vL), a); }`
  });
  const points = new Points(pGeo, pMat);
  points.frustumCulled = false;
  scene.add(points);
  let pHead = 0, particlesAlive = 0;
  function emit(x, y, z, spread, up, side = 2.2) {
    const i = pHead; pHead = (pHead + 1) % N;
    pPos[i * 3] = x + (Math.random() - 0.5) * spread; pPos[i * 3 + 1] = y; pPos[i * 3 + 2] = z + (Math.random() - 0.5) * spread;
    pVel[i * 3] = (Math.random() - 0.5) * side; pVel[i * 3 + 1] = up * (0.6 + Math.random()); pVel[i * 3 + 2] = (Math.random() - 0.5) * side;
    pLife[i] = 1;
  }
  function stepParticles(dt) {
    let alive = 0;
    for (let i = 0; i < N; i++) {
      if (pLife[i] <= 0) continue;
      alive++;
      pVel[i * 3 + 1] -= 9.0 * dt;
      pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
      if (pPos[i * 3 + 1] < 0.02) { pPos[i * 3 + 1] = 0.02; pVel[i * 3 + 1] *= -0.25; }
      pLife[i] -= dt * 1.3;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.life.needsUpdate = true;
    return alive;
  }

  /* --------------------------------------------------------------- state */
  const target = {
    cam: { az: 30, el: 31, dist: 74, tx: 0, ty: 1.2, tz: 0.6 },
    sweep: SWEEP_FROM, kinds: { roof: 0, wall: 0, concrete: 0, pavers: 0, glass: 0 },
    drive: 0, explode: 0, xray: 0, lens: { x: -999, y: -999, r: 120 }, rotary: false, look: true
  };
  const cur = JSON.parse(JSON.stringify(target));
  const look = { x: 0, y: 0, tx: 0, ty: 0 };

  function placeCamera() {
    const c = cur.cam;
    const az = MathUtils.degToRad(c.az) + (target.look ? look.x * 0.1 : 0);
    const el = MathUtils.degToRad(c.el) + (target.look ? look.y * 0.04 : 0);
    camera.position.set(c.tx + c.dist * Math.cos(el) * Math.sin(az), c.ty + c.dist * Math.sin(el), c.tz + c.dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(c.tx, c.ty, c.tz);
  }
  function applyUniforms() {
    U.uSweep.value = cur.sweep;
    U.uKA.value.set(cur.kinds.roof, cur.kinds.wall, cur.kinds.concrete, cur.kinds.pavers);
    U.uKG.value = cur.kinds.glass;
    U.uDrive.value = cur.drive;
    U.uXray.value = cur.xray;
    const dpr = renderer.getPixelRatio();
    const h = canvas.height;
    U.uLens.value.set(cur.lens.x * dpr, h - cur.lens.y * dpr, cur.lens.r * dpr);
    const e = cur.explode;
    const ease = e * e * (3 - 2 * e);
    layers.forEach((g, i) => { g.position.y = LIFT[i] * ease; });
    // rotary cleaner rides the lanes
    rotary.visible = !!target.rotary && cur.drive > 0.001 && cur.drive < 0.999;
    if (rotary.visible) {
      const P = Math.min(DRIVE.lanes - 1e-4, cur.drive * DRIVE.lanes);
      const lane = Math.floor(P), t = P - lane;
      const lw = (DRIVE.x1 - DRIVE.x0) / DRIVE.lanes;
      const along = lane % 2 === 0 ? 1 - t : t;
      rotary.position.set(DRIVE.x0 + (lane + 0.5) * lw, 0, DRIVE.z0 + along * (DRIVE.z1 - DRIVE.z0));
      rotary.rotation.y = lane % 2 === 0 ? 0 : Math.PI;
    }
  }

  /* -------------------------------------------------------------- loop */
  let raf = 0, visible = true, last = performance.now(), auto = null;
  const near = (a, b, eps = 0.0005) => Math.abs(a - b) < eps;
  function invalidate() { if (!raf && visible && !isPoster) raf = requestAnimationFrame(frame); }

  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const k = 1 - Math.pow(0.0009, dt);        // frame-rate independent easing (~fast)
    const kc = 1 - Math.pow(0.02, dt);         // camera: softer
    let moving = false;
    const ease = (o, t, key, f) => { if (!near(o[key], t[key])) { o[key] += (t[key] - o[key]) * f; moving = true; } else o[key] = t[key]; };
    for (const key in target.cam) ease(cur.cam, target.cam, key, kc);
    for (const key in target.kinds) ease(cur.kinds, target.kinds, key, k);
    ease(cur, target, 'drive', k); ease(cur, target, 'explode', kc); ease(cur, target, 'xray', k);
    cur.lens.x = target.lens.x; cur.lens.y = target.lens.y; ease(cur.lens, target.lens, 'r', k);
    if (auto) {
      const t = Math.min(1, (now - auto.t0) / auto.dur);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      target.sweep = cur.sweep = auto.from + (auto.to - auto.from) * e;
      if (t >= 1) auto = null;
      moving = true;
    } else ease(cur, target, 'sweep', k);
    look.x += (look.tx - look.x) * 0.06; look.y += (look.ty - look.y) * 0.06;
    if (!near(look.x, look.tx, 0.001) || !near(look.y, look.ty, 0.001)) moving = true;

    // spray along whichever front is moving
    if (auto || (!near(cur.sweep, target.sweep, 0.05))) {
      const v = cur.sweep;
      for (let i = 0; i < 6; i++) {
        const al = (Math.random() - 0.5) * 30;
        const px = SWEEP_DIR.x * v - SWEEP_DIR.y * al, pz = SWEEP_DIR.y * v + SWEEP_DIR.x * al;
        if (px > PLOT.minX && px < PLOT.maxX && pz > PLOT.minZ && pz < PLOT.maxZ) emit(px, 0.1 + Math.random() * 0.4, pz, 0.6, 2.2);
      }
    }
    if (rotary.visible && !near(cur.drive, target.drive, 0.0005)) {
      deck.rotation.y += dt * 30;
      for (let i = 0; i < 5; i++) emit(rotary.position.x, 0.15, rotary.position.z, 1.2, 1.6, 3.4);
    }
    if (!near(cur.kinds.roof, target.kinds.roof, 0.002) && cur.kinds.roof < 0.99) {
      const fx = MathUtils.lerp(-17, 17, cur.kinds.roof);
      for (let i = 0; i < 4; i++) emit(fx + (Math.random() - 0.5), 7 + Math.random() * 1.5 + layers[3].position.y, H.z + (Math.random() - 0.5) * 7, 0.4, 1.4);
    }
    particlesAlive = stepParticles(dt);
    if (particlesAlive) moving = true;

    applyUniforms();
    placeCamera();
    renderer.render(scene, camera);
    if (opts.onFrame) opts.onFrame(api);
    if (moving && visible) raf = requestAnimationFrame(frame);
  }

  /* --------------------------------------------------------------- input */
  const ray = new Raycaster();
  const ndc = new Vector2();
  function pick(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(pickable.concat([lawn]), false);
    return hits[0] || null;
  }
  let brushedArea = 0;
  function paintAt(x, z, r = 1.25) {
    const uu = (x - PLOT.minX) / PLOT_W * brushCanvas.width, vv = (z - PLOT.minZ) / PLOT_D * brushCanvas.height;
    const rad = r / PLOT_W * brushCanvas.width;
    const g = bctx.createRadialGradient(uu, vv, 0, uu, vv, rad);
    g.addColorStop(0, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    bctx.globalCompositeOperation = 'lighter';
    bctx.fillStyle = g; bctx.beginPath(); bctx.arc(uu, vv, rad, 0, Math.PI * 2); bctx.fill();
    brushTex.needsUpdate = true; brushedArea++;
  }
  let lastHit = null;
  function brushTo(clientX, clientY) {
    const h = pick(clientX, clientY);
    if (!h) { lastHit = null; return false; }
    const lift = h.object.parent === layers[0] || !h.object.userData.surface ? 0 : 0;
    const p = h.point.clone(); p.y -= lift;
    if (lastHit) {
      const steps = Math.ceil(Math.hypot(p.x - lastHit.x, p.z - lastHit.z) / 0.5);
      for (let s = 1; s <= steps; s++) paintAt(lastHit.x + (p.x - lastHit.x) * s / steps, lastHit.z + (p.z - lastHit.z) * s / steps);
    } else paintAt(p.x, p.z);
    for (let i = 0; i < 4; i++) emit(h.point.x, h.point.y + 0.05, h.point.z, 0.4, 3.0);
    lastHit = p;
    invalidate();
    return true;
  }
  function splash(clientX, clientY) {
    const h = pick(clientX, clientY);
    if (!h) return false;
    for (let i = 0; i < 46; i++) emit(h.point.x, h.point.y + 0.1, h.point.z, 0.3, 4.6, 4.2);
    invalidate();
    return true;
  }

  // With refAspect, the camera frames a reference rectangle (contain-fit and
  // centred in the canvas) exactly as the poster was rendered, while the
  // canvas itself spans the whole stage — so nothing is clipped at the frame.
  const frameRect = { x: 0, y: 0, w: 1, h: 1 };
  function resize() {
    const w = root.clientWidth || 800, h = root.clientHeight || 600;
    renderer.setSize(w, h, false);
    if (opts.refAspect) {
      const fw = Math.min(w, h * opts.refAspect), fh = fw / opts.refAspect;
      Object.assign(frameRect, { x: (w - fw) / 2, y: (h - fh) / 2, w: fw, h: fh });
      camera.aspect = opts.refAspect;
      camera.setViewOffset(fw, fh, (fw - w) / 2, (fh - h) / 2, w, h);
    } else {
      Object.assign(frameRect, { x: 0, y: 0, w, h });
      camera.aspect = w / h;
    }
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = renderer.getPixelRatio() * 26.0;
    if (isPoster) return;
    invalidate();
  }
  if (!isPoster) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) invalidate(); }).observe(root);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(root); else addEventListener('resize', resize);
  }

  const tmp = new Vector3();
  const api = {
    canvas, renderer, frameRect,
    set(partial) {
      if (partial.cam) Object.assign(target.cam, partial.cam);
      if (partial.kinds) Object.assign(target.kinds, partial.kinds);
      if (partial.lens) Object.assign(target.lens, partial.lens);
      for (const key of ['sweep', 'drive', 'explode', 'xray', 'rotary', 'look']) if (key in partial) target[key] = partial[key];
      if ('sweep' in partial) auto = null;
      invalidate();
    },
    jump() { Object.assign(cur.cam, target.cam); Object.assign(cur.kinds, target.kinds); Object.assign(cur, { sweep: target.sweep, drive: target.drive, explode: target.explode, xray: target.xray }); Object.assign(cur.lens, target.lens); applyUniforms(); placeCamera(); renderer.render(scene, camera); },
    animateSweep(to, dur) { auto = { from: cur.sweep, to, t0: performance.now(), dur }; invalidate(); },
    lookAt(nx, ny) { look.tx = nx; look.ty = ny; invalidate(); },
    brushTo, endBrush() { lastHit = null; }, splash,
    resetBrush() { bctx.globalCompositeOperation = 'source-over'; bctx.fillStyle = '#000'; bctx.fillRect(0, 0, brushCanvas.width, brushCanvas.height); brushTex.needsUpdate = true; brushedArea = 0; invalidate(); },
    get brushed() { return brushedArea; },
    get sweepNow() { return cur.sweep; },
    pick(clientX, clientY) { const h = pick(clientX, clientY); return h && h.object.userData.surface ? { surface: h.object.userData.surface, info: SURFACE_INFO[h.object.userData.surface] } : null; },
    project(at, layer = 0) {
      tmp.set(at[0], at[1] + (layers[layer] ? layers[layer].position.y : 0), at[2]).project(camera);
      return { x: (tmp.x + 1) / 2, y: (1 - tmp.y) / 2, behind: tmp.z > 1 };
    },
    renderNow() { applyUniforms(); placeCamera(); renderer.render(scene, camera); },
    invalidate, resize,
    dispose() { cancelAnimationFrame(raf); renderer.dispose(); }
  };

  if (opts.state) { api.set(opts.state); }
  resize();
  api.jump();
  return api;
}
