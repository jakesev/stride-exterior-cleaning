/* Stride Door Coach — the 3D doorstep.
   A small low-poly Queensland house. Two figures (you and the homeowner),
   a "guard" shield that shrinks as their defence drops, and a marker on the
   pain point for the chosen service. Driven by DC.scene.setStage(). */
(function () {
  'use strict';
  var DC = (window.DC = window.DC || {});
  var T = window.THREE;

  var api = {
    ok: false,
    mount: function () {}, setStage: function () {}, setService: function () {},
    setGuard: function () {}, pulse: function () {}, resize: function () {}
  };
  DC.scene = api;

  var canWebGL = (function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  })();
  if (!T || !canWebGL) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer, scene, camera, host = null, raf = 0, clock = new T.Clock();
  var you, them, shield, shieldWire, marker, door, trail = [], sparkles = [];
  var grime = {}; // per service: array of materials whose opacity fades on clean
  var state = {
    service: 'windows', stage: 'door', guard: 0.6, guardShown: 0.6,
    clean: 0, cleanTarget: 0, countT: 0, pulse: 0, pulseKind: 'good',
    drag: 0, dragTarget: 0, t: 0
  };

  var C = {
    grass: 0x6f9f5c, grassDark: 0x55824a, soil: 0x6b5847, concrete: 0xcfd3d6, path: 0xdcd7cc,
    wall: 0xf3efe6, wallShade: 0xe2ddd2, roof: 0x39424c, trim: 0xffffff, door: 0x0a6dc4,
    glass: 0x8fc4e8, garage: 0xd9dde2, road: 0x3d444c, kerb: 0xb9bec4,
    blue: 0x0a6dc4, bright: 0x4fb0f7, navy: 0x071523, skin: 0xe8b996, skin2: 0xc98f6b,
    shirtThem: 0xf2c14e, pants: 0x3b4a5a, amber: 0xf2a43a, red: 0xe5533d, green: 0x2fa36b,
    algae: 0x4f8a3a, dirt: 0x4a3f33
  };

  /* Where the two of you stand for each service, and what you look at. */
  var SPOTS = {
    windows: { look: [2.7, 1.55, 1.6], you: [3.7, 0, 3.7], them: [2.0, 0, 3.6], cam: [7.4, 3.3, 10.2] },
    driveway: { look: [7.0, 0.1, 5.4], you: [5.2, 0, 6.6], them: [5.1, 0, 4.7], cam: [12.6, 5.0, 12.4] },
    house: { look: [-3.5, 0.9, 1.6], you: [-2.5, 0, 3.8], them: [-4.3, 0, 3.7], cam: [1.2, 3.2, 10.6] },
    gutters: { look: [1.2, 3.1, 2.0], you: [2.1, 0, 5.2], them: [0.4, 0, 5.1], cam: [5.4, 2.4, 12.4] }
  };
  var DOOR = { them: [-1.2, 0.22, 2.25], you: [-0.2, 0, 5.3], look: [-1.2, 1.3, 1.6], cam: [4.2, 4.6, 13.6] };
  var COUNT_PATH = [[10.4, 2.4], [10.4, -6.6], [-6.4, -6.6], [-6.4, 2.6]];

  function mat(color, opts) {
    var o = { color: color, flatShading: true };
    if (opts) for (var k in opts) o[k] = opts[k];
    return new T.MeshLambertMaterial(o);
  }
  function box(w, h, d, m, x, y, z, parent, shadow) {
    var g = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    g.position.set(x, y, z);
    if (shadow !== false) { g.castShadow = true; g.receiveShadow = true; }
    (parent || scene).add(g);
    return g;
  }

  function buildWorld() {
    // slab
    box(23, 0.8, 21, mat(C.soil), 1.6, -0.42, 1.6, null).castShadow = false;
    box(23, 0.06, 21, mat(C.grass), 1.6, 0.0, 1.6).castShadow = false;
    // street
    box(23, 0.07, 2.6, mat(C.road), 1.6, 0.0, 10.8).castShadow = false;
    box(23, 0.14, 0.25, mat(C.kerb), 1.6, 0.04, 9.4);
    // driveway + path
    box(3.8, 0.08, 8.5, mat(C.concrete), 7.0, 0.01, 5.2).castShadow = false;
    box(1.2, 0.08, 6.6, mat(C.path), -1.2, 0.01, 6.2).castShadow = false;
    // house body
    box(10, 3, 7, mat(C.wall), 0, 1.5, -2);
    box(4.2, 2.7, 6, mat(C.wallShade), 7.0, 1.35, -2.0);
    // hip roofs (4-sided cone, scaled)
    var r1 = new T.Mesh(new T.ConeGeometry(1, 1, 4, 1), mat(C.roof));
    r1.rotation.y = Math.PI / 4; r1.scale.set(8.0, 2.3, 5.9); r1.position.set(0, 4.15, -2);
    r1.castShadow = true; scene.add(r1);
    var r2 = new T.Mesh(new T.ConeGeometry(1, 1, 4, 1), mat(C.roof));
    r2.rotation.y = Math.PI / 4; r2.scale.set(3.6, 1.6, 5.0); r2.position.set(7.0, 3.5, -2);
    r2.castShadow = true; scene.add(r2);
    // fascia + gutter along the front eave
    box(10.9, 0.2, 0.2, mat(C.trim), 0, 3.0, 2.05);
    box(10.9, 0.12, 0.34, mat(0xbfc6cc), 0, 3.12, 2.2);
    // porch + door
    box(2.6, 0.22, 1.5, mat(C.path), -1.2, 0.11, 2.2);
    box(1.3, 2.3, 0.1, mat(C.trim), -1.2, 1.37, 1.52);
    var hinge = new T.Group(); hinge.position.set(-1.75, 0.22, 1.6); scene.add(hinge);
    door = box(1.1, 2.1, 0.08, mat(C.door), 0.55, 1.05, 0, hinge);
    box(0.08, 0.08, 0.1, mat(0xf2c14e), 0.95, 1.05, 0.06, hinge, false);
    door.userData.hinge = hinge;
    // garage door
    box(3.2, 2.2, 0.08, mat(C.garage), 7.0, 1.1, 1.04);
    for (var i = 0; i < 4; i++) box(3.2, 0.03, 0.1, mat(0xb8bfc6), 7.0, 0.45 + i * 0.5, 1.06, null, false);

    // --- the window (windows pain point) ---
    box(2.5, 1.6, 0.12, mat(C.trim), 2.7, 1.6, 1.52);
    var glass = box(2.2, 1.3, 0.06, new T.MeshPhongMaterial({ color: C.glass, shininess: 90, specular: 0xffffff }), 2.7, 1.6, 1.58, null, false);
    box(0.06, 1.3, 0.08, mat(C.trim), 2.7, 1.6, 1.6, null, false);
    box(2.7, 0.1, 0.3, mat(C.trim), 2.7, 0.78, 1.62);
    var gW = mat(C.dirt, { transparent: true, opacity: 0.55, depthWrite: false });
    var gPlane = new T.Mesh(new T.PlaneGeometry(2.2, 1.3), gW); gPlane.position.set(2.7, 1.6, 1.63); scene.add(gPlane);
    var gSill = mat(C.dirt, { transparent: true, opacity: 0.8, depthWrite: false });
    var sillDirt = new T.Mesh(new T.PlaneGeometry(2.6, 0.26), gSill);
    sillDirt.rotation.x = -Math.PI / 2; sillDirt.position.set(2.7, 0.835, 1.64); scene.add(sillDirt);
    grime.windows = [[gW, 0.55], [gSill, 0.8]];
    // a second, smaller window for balance
    box(1.5, 1.2, 0.12, mat(C.trim), -3.6, 1.9, 1.52);
    box(1.25, 0.95, 0.06, new T.MeshPhongMaterial({ color: C.glass, shininess: 90 }), -3.6, 1.9, 1.58, null, false);

    // --- driveway stains ---
    grime.driveway = [];
    var stainSpots = [[6.6, 5.6, 1.3, 0.5], [7.6, 4.2, 0.9, 0.42], [6.2, 7.4, 0.8, 0.36], [7.8, 6.9, 1.0, 0.4], [7.1, 2.6, 0.7, 0.34]];
    stainSpots.forEach(function (s) {
      var m = mat(0x23282d, { transparent: true, opacity: s[3], depthWrite: false });
      var c = new T.Mesh(new T.CircleGeometry(s[2], 9), m);
      c.rotation.x = -Math.PI / 2; c.scale.set(1, 1.5, 1); c.position.set(s[0], 0.06, s[1]); scene.add(c);
      grime.driveway.push([m, s[3]]);
    });
    var edge = mat(C.algae, { transparent: true, opacity: 0.6, depthWrite: false });
    var ed = new T.Mesh(new T.PlaneGeometry(0.5, 8.3), edge); ed.rotation.x = -Math.PI / 2; ed.position.set(5.36, 0.062, 5.2); scene.add(ed);
    grime.driveway.push([edge, 0.6]);

    // --- algae on the front-left wall (house wash) ---
    grime.house = [];
    [[-3.6, 0.7, 2.6, 1.3, 0.55], [-4.4, 1.3, 1.0, 1.4, 0.4], [-2.4, 0.45, 1.2, 0.8, 0.4]].forEach(function (a) {
      var m = mat(C.algae, { transparent: true, opacity: a[4], depthWrite: false });
      var p = new T.Mesh(new T.PlaneGeometry(a[2], a[3]), m); p.position.set(a[0], a[1], 1.515); scene.add(p);
      grime.house.push([m, a[4]]);
    });

    // --- gutter litter + overflow stains (gutters) ---
    grime.gutters = [];
    for (var j = 0; j < 12; j++) {
      var lm = mat(j % 3 === 0 ? 0x8a6a3a : 0x5c8f3f, { transparent: true, opacity: 1 });
      var leaf = new T.Mesh(new T.TetrahedronGeometry(0.16 + (j % 4) * 0.035), lm);
      leaf.position.set(-4.8 + j * 0.86 + ((j * 37) % 5) * 0.06, 3.26, 2.2);
      leaf.rotation.set(j, j * 2, j * 3); scene.add(leaf);
      grime.gutters.push([lm, 1]);
    }
    [[0.6, 0.5], [1.6, 0.8], [2.4, 0.4], [-2.8, 0.6]].forEach(function (s) {
      var sm = mat(0x4b4338, { transparent: true, opacity: 0.45, depthWrite: false });
      var st = new T.Mesh(new T.PlaneGeometry(0.16, s[1]), sm); st.position.set(s[0], 2.9 - s[1] / 2, 1.515); scene.add(st);
      grime.gutters.push([sm, 0.45]);
    });

    // --- garden: trees, hedge, letterbox ---
    function tree(x, z, s) {
      box(0.28 * s, 1.5 * s, 0.28 * s, mat(0x6e5139), x, 0.75 * s, z);
      var f = new T.Mesh(new T.IcosahedronGeometry(1.15 * s, 0), mat(C.grassDark));
      f.position.set(x, 2.1 * s, z); f.castShadow = true; scene.add(f);
      var f2 = new T.Mesh(new T.IcosahedronGeometry(0.8 * s, 0), mat(0x6fa35c));
      f2.position.set(x + 0.5 * s, 2.8 * s, z - 0.2); f2.castShadow = true; scene.add(f2);
    }
    tree(-7.4, 6.2, 1.2); tree(-8.2, -5.4, 1.5); tree(11.2, -6.2, 1.3);
    box(4.2, 0.7, 0.6, mat(C.grassDark), -6.0, 0.36, 1.9);
    box(0.14, 0.9, 0.14, mat(0x8a8f95), 0.2, 0.45, 8.9);
    box(0.5, 0.3, 0.34, mat(C.trim), 0.2, 1.0, 8.9);

    // --- the Stride ute, parked on the street ---
    var ute = new T.Group(); ute.position.set(-5.2, 0.05, 10.7); scene.add(ute);
    box(3.6, 0.55, 1.5, mat(C.trim), 0, 0.62, 0, ute);
    box(1.5, 0.6, 1.4, mat(C.trim), 0.5, 1.18, 0, ute);
    box(1.3, 0.42, 1.42, new T.MeshPhongMaterial({ color: 0x24384a, shininess: 80 }), 0.5, 1.2, 0, ute, false);
    box(1.5, 0.3, 1.52, mat(C.blue), -1.0, 0.74, 0, ute, false);
    box(1.4, 0.5, 1.1, mat(0x9aa3ab), -1.0, 1.1, 0, ute); // tank
    [[-1.15, 0.78], [1.15, 0.78], [-1.15, -0.78], [1.15, -0.78]].forEach(function (w) {
      var wh = new T.Mesh(new T.CylinderGeometry(0.34, 0.34, 0.24, 10), mat(0x1b1f24));
      wh.rotation.x = Math.PI / 2; wh.position.set(w[0], 0.34, w[1]); ute.add(wh);
    });

    // --- count trail dots ---
    var dotM = mat(C.bright, { transparent: true, opacity: 0.9 });
    for (var k = 0; k < 40; k++) {
      var dd = new T.Mesh(new T.SphereGeometry(0.11, 6, 5), dotM);
      dd.visible = false; scene.add(dd); trail.push(dd);
    }
  }

  function person(shirt, isYou) {
    var g = new T.Group();
    var legs = new T.Mesh(new T.CylinderGeometry(0.2, 0.17, 0.72, 8), mat(isYou ? C.navy : C.pants));
    legs.position.y = 0.36; legs.castShadow = true; g.add(legs);
    var body = new T.Mesh(new T.CylinderGeometry(0.27, 0.23, 0.72, 8), mat(shirt));
    body.position.y = 1.06; body.castShadow = true; g.add(body);
    var sh = new T.Mesh(new T.SphereGeometry(0.27, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(shirt));
    sh.position.y = 1.42; g.add(sh);
    var head = new T.Mesh(new T.SphereGeometry(0.2, 10, 8), mat(isYou ? C.skin : C.skin2));
    head.position.y = 1.72; head.castShadow = true; g.add(head);
    var arm = new T.Group(); arm.position.set(0.3, 1.36, 0);
    var a = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.62, 6), mat(isYou ? C.skin : C.skin2));
    a.position.y = -0.31; arm.add(a); g.add(arm);
    g.userData.arm = arm;
    if (isYou) {
      var cap = new T.Mesh(new T.SphereGeometry(0.215, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mat(C.navy));
      cap.position.y = 1.76; g.add(cap);
      var brim = new T.Mesh(new T.BoxGeometry(0.26, 0.03, 0.2), mat(C.navy)); brim.position.set(0, 1.78, 0.24); g.add(brim);
      var logo = new T.Mesh(new T.BoxGeometry(0.16, 0.12, 0.02), mat(C.trim)); logo.position.set(0.1, 1.22, 0.26); g.add(logo);
    } else {
      var hair = new T.Mesh(new T.SphereGeometry(0.212, 10, 6, 0, Math.PI * 2, 0, Math.PI / 1.9), mat(0x6b5a4a));
      hair.position.y = 1.75; hair.rotation.x = -0.25; g.add(hair);
    }
    g.userData.pos = new T.Vector3(); g.userData.target = new T.Vector3();
    g.userData.face = new T.Vector3(0, 0, 1); g.userData.yaw = 0; g.userData.wave = 0;
    scene.add(g);
    return g;
  }

  function buildActors() {
    you = person(C.blue, true);
    them = person(C.shirtThem, false);
    // the guard: a curved amber shield in front of the homeowner
    var sg = new T.SphereGeometry(1.25, 14, 10, -Math.PI * 0.42, Math.PI * 0.84, Math.PI * 0.18, Math.PI * 0.6);
    shield = new T.Mesh(sg, new T.MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false }));
    shieldWire = new T.Mesh(sg, new T.MeshBasicMaterial({ color: C.amber, wireframe: true, transparent: true, opacity: 0.55 }));
    shield.add(shieldWire); scene.add(shield);
    // pain-point marker: a ring that always faces the camera
    marker = new T.Group();
    var ring = new T.Mesh(new T.TorusGeometry(0.62, 0.045, 8, 40), new T.MeshBasicMaterial({ color: C.bright, transparent: true, opacity: 0.95, depthTest: false }));
    var ring2 = new T.Mesh(new T.TorusGeometry(0.9, 0.02, 6, 40), new T.MeshBasicMaterial({ color: C.bright, transparent: true, opacity: 0.5, depthTest: false }));
    marker.add(ring); marker.add(ring2); marker.renderOrder = 5; scene.add(marker);
    // sparkles for the clean
    var sm = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    for (var i = 0; i < 14; i++) {
      var s = new T.Mesh(new T.OctahedronGeometry(0.09), sm.clone());
      s.userData.seed = i * 1.7; scene.add(s); sparkles.push(s);
    }
  }

  function v3(a) { return new T.Vector3(a[0], a[1], a[2]); }
  var camPos = new T.Vector3(), camLook = new T.Vector3(), camPosT = new T.Vector3(), camLookT = new T.Vector3();

  function pathPoint(t) {
    // t 0..1 along: pain spot -> round the house -> pain spot
    var s = SPOTS[state.service];
    var pts = [[s.you[0], s.you[2]]].concat(COUNT_PATH).concat([[s.you[0], s.you[2]]]);
    var segs = [], total = 0, i;
    for (i = 0; i < pts.length - 1; i++) {
      var dx = pts[i + 1][0] - pts[i][0], dz = pts[i + 1][1] - pts[i][1], l = Math.sqrt(dx * dx + dz * dz);
      segs.push(l); total += l;
    }
    var d = t * total;
    for (i = 0; i < segs.length; i++) {
      if (d <= segs[i] || i === segs.length - 1) {
        var f = Math.min(1, d / segs[i]);
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
      }
      d -= segs[i];
    }
    return pts[0];
  }

  function applyStage(instant) {
    var s = SPOTS[state.service], st = state.stage;
    var y = you.userData, h = them.userData;
    var doorOpen = true, markerOn = false, look = v3(DOOR.look), cam = v3(DOOR.cam);
    state.cleanTarget = 0;
    h.wave = 0; y.wave = 0;

    if (st === 'door' || st === 'shut') {
      y.target.copy(v3(DOOR.you)); h.target.copy(v3(DOOR.them));
      y.face.copy(v3(DOOR.them)); h.face.copy(v3(DOOR.you));
      if (st === 'shut') { doorOpen = false; h.target.set(-1.2, 0.22, 0.6); }
    } else if (st === 'pain' || st === 'shake') {
      y.target.copy(v3(s.you)); h.target.copy(v3(s.them));
      look = v3(s.look); cam = v3(s.cam); markerOn = st === 'pain';
      if (st === 'shake') {
        y.face.copy(v3(s.them)); h.face.copy(v3(s.you)); state.cleanTarget = 1; y.wave = 0.6; h.wave = 0.6;
        look = new T.Vector3((s.you[0] + s.them[0]) / 2, 1.2, s.you[2] - 0.6);
      } else { y.face.copy(v3(s.look)); h.face.copy(v3(s.look)); }
    } else if (st === 'count') {
      h.target.set(-1.2, 0.22, 2.5); h.face.set(4, 1, 8);
      look = new T.Vector3(1.6, 0.8, -1.2); cam = new T.Vector3(13.5, 13.5, 15.5);
      state.countT = 0;
    } else if (st === 'leave') {
      y.target.set(-1.2, 0, 8.6); y.face.set(-1.2, 1, 2); y.wave = 1;
      h.target.copy(v3(DOOR.them)); h.face.set(-1.2, 1, 9); h.wave = 1;
      cam = new T.Vector3(5.4, 4.2, 15.4); look = new T.Vector3(-0.8, 1.2, 4.6);
    }
    door.userData.open = doorOpen;
    marker.userData.on = markerOn;
    marker.position.copy(v3(s.look));
    trail.forEach(function (d) { d.visible = false; });
    camPosT.copy(cam); camLookT.copy(look);
    if (instant || reduce) {
      y.pos.copy(y.target); h.pos.copy(h.target);
      camPos.copy(framed(camPosT, camLookT)); camLook.copy(camLookT);
      state.clean = state.cleanTarget; state.guardShown = state.guard;
    }
  }

  // pull the camera back on tall, narrow stages so the scene still fits
  function framed(pos, look) {
    var aspect = camera.aspect || 1.6;
    var k = aspect < 1.5 ? Math.min(1.9, 1.5 / aspect) : 1;
    return look.clone().add(pos.clone().sub(look).multiplyScalar(k));
  }

  function stepActor(g, dt, isYou) {
    var u = g.userData, before = u.pos.clone();
    if (isYou && state.stage === 'count') {
      state.countT = Math.min(1, state.countT + dt / 7);
      var p = pathPoint(state.countT);
      u.pos.set(p[0], 0, p[1]);
      var n = Math.floor(state.countT * trail.length);
      for (var i = 0; i < trail.length; i++) {
        if (i < n && !trail[i].visible) { var q = pathPoint(i / trail.length); trail[i].position.set(q[0], 0.14, q[1]); trail[i].visible = true; }
      }
      var ahead = pathPoint(Math.min(1, state.countT + 0.02));
      u.face.set(ahead[0], 1, ahead[1]);
    } else {
      u.pos.lerp(u.target, 1 - Math.exp(-dt * 3.2));
    }
    var speed = u.pos.distanceTo(before) / Math.max(dt, 0.001);
    var bob = speed > 0.25 ? Math.abs(Math.sin(state.t * 11)) * 0.07 : Math.sin(state.t * 2 + (isYou ? 0 : 1.6)) * 0.012;
    g.position.set(u.pos.x, u.pos.y + bob, u.pos.z);
    var moving = speed > 0.4 && !(isYou && state.stage === 'count');
    var fx = (moving ? u.target.x : u.face.x) - u.pos.x, fz = (moving ? u.target.z : u.face.z) - u.pos.z;
    if (Math.abs(fx) + Math.abs(fz) > 0.05) {
      var want = Math.atan2(fx, fz), d = want - u.yaw;
      while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      u.yaw += d * (1 - Math.exp(-dt * 7));
    }
    g.rotation.y = u.yaw;
    // arm: point / wave
    var arm = u.arm, target = 0;
    if (u.wave > 0.9) target = -2.6 + Math.sin(state.t * 9) * 0.35;
    else if (u.wave > 0) target = -1.3;
    else if (isYou && state.stage === 'pain') target = -1.15 + Math.sin(state.t * 2.2) * 0.08;
    arm.rotation.x += (target - arm.rotation.x) * (1 - Math.exp(-dt * 8));
  }

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!host || document.hidden) return;
    var dt = Math.min(0.05, clock.getDelta());
    state.t += dt;
    stepActor(you, dt, true); stepActor(them, dt, false);

    // door swing
    var hinge = door.userData.hinge, want = door.userData.open ? -1.9 : 0;
    hinge.rotation.y += (want - hinge.rotation.y) * (1 - Math.exp(-dt * 6));

    // guard shield sits between them and you
    state.guardShown += (state.guard - state.guardShown) * (1 - Math.exp(-dt * 5));
    var gs = state.stage === 'shut' || state.stage === 'count' ? 0 : state.guardShown;
    var tp = them.userData.pos, yp = you.userData.pos;
    shield.position.set(tp.x, tp.y + 0.2, tp.z);
    shield.rotation.y = Math.atan2(yp.x - tp.x, yp.z - tp.z) + Math.PI / 2;
    var sc = 0.25 + gs * 0.95;
    shield.scale.set(sc, sc * 1.25, sc);
    shield.visible = gs > 0.06;
    var hot = gs > 0.75 ? C.red : C.amber;
    shield.material.color.setHex(hot); shieldWire.material.color.setHex(hot);
    shield.material.opacity = 0.08 + gs * 0.22 + (state.pulse > 0 && state.pulseKind === 'bad' ? state.pulse * 0.3 : 0);
    shieldWire.material.opacity = 0.2 + gs * 0.5;

    // marker
    var mOn = marker.userData.on ? 1 : 0;
    marker.visible = mOn > 0;
    marker.quaternion.copy(camera.quaternion);
    var ms = 1 + Math.sin(state.t * 3) * 0.08;
    marker.children[0].scale.setScalar(ms);
    marker.children[1].scale.setScalar(1 + ((state.t * 0.6) % 1) * 0.5);
    marker.children[1].material.opacity = 0.5 * (1 - ((state.t * 0.6) % 1));

    // grime fade + sparkles
    state.clean += (state.cleanTarget - state.clean) * (1 - Math.exp(-dt * 1.6));
    Object.keys(grime).forEach(function (k) {
      var on = k === state.service ? 1 - state.clean : 1;
      grime[k].forEach(function (g) { g[0].opacity = g[1] * on; });
    });
    var sl = SPOTS[state.service].look, sp = state.cleanTarget ? Math.sin(Math.min(1, state.clean) * Math.PI) : 0;
    sparkles.forEach(function (s, i) {
      var a = s.userData.seed + state.t * 1.4;
      s.position.set(sl[0] + Math.cos(a) * (0.6 + (i % 4) * 0.35), sl[1] + 0.2 + Math.sin(a * 1.3) * 0.7 + (i % 3) * 0.2, sl[2] + 0.35 + Math.sin(a) * 0.4);
      s.rotation.y = a * 2; s.material.opacity = sp * (0.5 + 0.5 * Math.sin(a * 3));
      s.scale.setScalar(0.6 + sp);
    });

    if (state.pulse > 0) state.pulse = Math.max(0, state.pulse - dt * 1.6);

    // camera: eased, with a little drag-to-look and a slow drift
    state.drag += (state.dragTarget - state.drag) * (1 - Math.exp(-dt * 5));
    var goal = framed(camPosT, camLookT);
    camPos.lerp(goal, 1 - Math.exp(-dt * 2.4)); camLook.lerp(camLookT, 1 - Math.exp(-dt * 2.8));
    var ang = state.drag * 0.5 + (reduce ? 0 : Math.sin(state.t * 0.25) * 0.045);
    var off = camPos.clone().sub(camLook), cs = Math.cos(ang), sn = Math.sin(ang);
    camera.position.set(camLook.x + off.x * cs + off.z * sn, camPos.y, camLook.z - off.x * sn + off.z * cs);
    camera.lookAt(camLook);
    renderer.render(scene, camera);
  }

  function init() {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'stage-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    scene = new T.Scene();
    camera = new T.PerspectiveCamera(34, 1.6, 0.5, 120);
    scene.add(new T.HemisphereLight(0xffffff, 0xb9b2a4, 0.62));
    var sun = new T.DirectionalLight(0xfff3df, 0.62);
    sun.position.set(9, 15, 11); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    var sc = sun.shadow.camera; sc.left = -16; sc.right = 16; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 50;
    sun.shadow.bias = -0.0015;
    scene.add(sun);
    buildWorld(); buildActors();
    applyStage(true);

    var el = renderer.domElement, sx = null;
    el.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    window.addEventListener('pointermove', function (e) {
      if (sx !== null) state.dragTarget = Math.max(-1, Math.min(1, (e.clientX - sx) / 220));
    });
    window.addEventListener('pointerup', function () { sx = null; state.dragTarget = 0; });
    window.addEventListener('resize', api.resize);
    api.ok = true;
  }

  api.mount = function (el) {
    if (!renderer) { try { init(); } catch (e) { api.ok = false; return false; } }
    if (host === el) return true;
    host = el;
    el.insertBefore(renderer.domElement, el.firstChild);
    api.resize();
    if (!raf) { clock.getDelta(); frame(); }
    return true;
  };
  api.resize = function () {
    if (!host || !renderer) return;
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  api.setService = function (key) {
    if (!SPOTS[key] || !renderer) return;
    state.service = key; applyStage(false);
  };
  api.setStage = function (stage, opts) {
    if (!renderer) return;
    opts = opts || {};
    var same = state.stage === stage;
    state.stage = stage;
    if (typeof opts.guard === 'number') state.guard = opts.guard;
    if (!same || opts.force) applyStage(!!opts.instant);
  };
  api.setGuard = function (g) { state.guard = Math.max(0, Math.min(1, g)); };
  api.pulse = function (kind) { state.pulse = 1; state.pulseKind = kind || 'good'; };
})();
