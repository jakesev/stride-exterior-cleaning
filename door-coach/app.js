/* Stride Door Coach — interface. Renders every view into #app. */
(function () {
  'use strict';
  var DC = window.DC, C = DC.content, scene = DC.scene;
  var app = document.getElementById('app');
  var KEY = 'stride-door-coach-v1';

  /* ---------------- storage ---------------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ S: S, P: P })); } catch (e) { /* private mode */ } }
  var saved = load();
  var S = Object.assign({
    me: 'Jake', street: 'Wattle Street', neighbour: 'the Hendersons at number 14', runDay: '',
    service: 'windows', strategy: 'anchor', prices: {}, drop: 30, voice: true, level: 'read', ways: {}, sayFirst: false, pushback: true, example: true
  }, saved.S || {});
  var P = Object.assign({ days: {}, today: {}, simBest: {}, obj: {}, opener: 0, rehearsals: 0 }, saved.P || {});
  var todayKey = new Date().toISOString().slice(0, 10);
  if (P.today.date !== todayKey) P.today = { date: todayKey };
  function mark(k) { P.today[k] = true; P.days[todayKey] = true; save(); }
  function streak() {
    var n = 0, d = new Date();
    if (!P.days[todayKey]) d.setDate(d.getDate() - 1);
    while (P.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------------- dates: earliest run day after the cooling-off ---------------- */
  function earliestRun() {
    var d = new Date(), n = 0;
    while (n < 11) { d.setDate(d.getDate() + 1); var w = d.getDay(); if (w !== 0 && w !== 6) n++; }
    return d;
  }
  function ord(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function spokenDay(d) { return d.toLocaleDateString('en-AU', { weekday: 'long' }) + ' the ' + ord(d.getDate()); }

  /* ---------------- tokens ---------------- */
  var HONEST = {
    windows: "those white marks are sprinkler scale. They're in the glass, so they won't lift.",
    driveway: "that oil spot has soaked right in, so it'll lighten but it won't vanish.",
    house: "the paint that's already flaking up there may lift a bit more.",
    gutters: "that back corner up top I can't reach safely, so I've left it out."
  };
  function prices(svc) {
    var d = C.services[svc], p = S.prices[svc] || {};
    var callout = +p.callout || d.callout, saving = +p.saving || d.saving;
    var price = callout - saving, deal = price - (+S.drop || 30);
    return { callout: callout, saving: saving, price: price, deal: deal, floor: deal - 20 };
  }
  function ctx(strategy) {
    var sv = C.services[S.service], st = C.strategies[strategy || S.strategy], pr = prices(S.service);
    var t = {
      me: S.me || 'Jake', street: S.street || 'your street', neighbour: S.neighbour || 'your neighbours',
      runDay: S.runDay || spokenDay(earliestRun()), partner: 'My offsider',
      callout: pr.callout, saving: pr.saving, price: pr.price, deal: pr.deal, floor: pr.floor,
      noun: sv.noun, short: sv.short, spot: sv.spot, show: sv.show, count: sv.count, countTip: sv.countTip,
      stackLine: sv.stackLine, why: sv.why, fiddly: sv.fiddly, whole: sv.whole, scope: sv.scope, diy: sv.diy,
      guy: sv.guy, link: sv.link, throwIn: sv.throwIn, honestLine: HONEST[S.service],
      reason: st.reason, reasonLong: st.reasonLong, bridge: st.bridge
    };
    t.reasonCap = t.reason.charAt(0).toUpperCase() + t.reason.slice(1);
    return t;
  }
  function fill(s, strategy) {
    var t = ctx(strategy), out = String(s);
    for (var i = 0; i < 3; i++) out = out.replace(/\{(\w+)\}/g, function (m, k) { return t[k] !== undefined ? t[k] : m; });
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(s, strategy) { return esc(fill(s, strategy)).replace(/\s*\/\/\s*/g, ' <i class="pz" aria-hidden="true"></i> '); }
  function plain(s, strategy) { return fill(s, strategy).replace(/\s*\/\/\s*/g, ' … '); }
  function spoken(s, strategy) { return fill(s, strategy).replace(/\([^)]*\)\s*/g, '').replace(/\s*\/\/\s*/g, ', ').replace(/\$(\d+)/g, '$1 dollars').trim(); }
  function words(s) { return fill(s).replace(/\/\//g, ' ').split(/\s+/).filter(Boolean).length; }

  /* ---------------- icons ---------------- */
  var I = {
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18M14.5 12.5v.01"/>',
    walk: '<path d="M7 20c1.5 0 2.5-1.2 2.5-3S8.5 13 7 13s-2.5 1.800-2.500 4S5.5 20 7 20ZM16.500 11c1.500 0 2.500-1.200 2.500-3s-1-4-2.500-4S14 5.800 14 8s1 3 2.500 3ZM5 9.500h3.500M14.500 14.500H18"/>',
    script: '<path d="M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    whistle: '<path d="M3 9h10a5 5 0 1 1-4.900 6H6l-3-3zM13 9V6M9 9V7"/>',
    alert: '<path d="M12 4 2.500 20h19zM12 10v5M12 17.500v.01"/>',
    foot: '<path d="M4 16c0-2 1-3 3-3h3l2-6h3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z"/>',
    star: '<path d="m12 3 2.700 5.600 6.100.800-4.500 4.300 1.100 6.100L12 16.900 6.600 19.800l1.100-6.100L3.200 9.400l6.100-.800z" fill="currentColor"/>',
    sound: '<path d="M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.500-5.800M4 4v5h5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    scale: '<path d="M12 4v16M6 20h12M5 8h14M5 8l-2.500 6a3 3 0 0 0 5 0zM19 8l-2.500 6a3 3 0 0 0 5 0z"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n].replace(/(\d)\.(\d)00/g, '$1.$2') + '</svg>'; }
  var MARK = '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="#fff" d="M356.270,162.220 L300.200,181.520 C296.820,165.080 280.950,155.730 263.290,159.760 C245.630,163.800 231.770,179.940 231.050,197.310 C230.330,214.690 242.970,227.790 260.470,227.790 C306.590,227.790 339.930,262.330 338.030,308.140 C336.120,353.940 299.590,396.500 253.020,407.140 C206.460,417.770 164.640,393.120 155.730,349.780 L211.800,330.480 C215.180,346.920 231.050,356.270 248.710,352.240 C266.370,348.200 280.230,332.060 280.950,314.690 C281.670,297.310 269.030,284.210 251.530,284.210 C205.410,284.210 172.070,249.670 173.970,203.860 C175.880,158.060 212.410,115.500 258.980,104.860 C305.540,94.230 347.360,118.880 356.270,162.220 Z"/></svg>';

  /* ---------------- voice (homeowner speaks) ---------------- */
  var Voice = { tts: null, busy: false };
  if (window.claude && typeof window.claude.use === 'function') {
    try { window.claude.use('tts').then(function (t) { Voice.tts = t; }).catch(function () {}); } catch (e) { /* no viewer */ }
  }
  Voice.stop = function () {
    try { if (Voice.tts) Voice.tts.stop().catch(function () {}); else if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  };
  Voice.speak = function (text) {
    var fallbackMs = 700 + text.length * 48;
    if (!S.voice) return wait(fallbackMs);
    if (Voice.tts) {
      return Promise.race([Voice.tts.speak(text, { voice: 'rounded' }).catch(function () { return wait(fallbackMs); }), wait(fallbackMs + 9000)]);
    }
    var ss = window.speechSynthesis;
    if (!ss || typeof window.SpeechSynthesisUtterance !== 'function') return wait(fallbackMs);
    return Promise.race([new Promise(function (res) {
      try {
        ss.cancel();
        var u = new window.SpeechSynthesisUtterance(text);
        var vs = ss.getVoices().filter(function (v) { return /en[-_]AU/i.test(v.lang); });
        if (vs[0]) u.voice = vs[0];
        u.lang = 'en-AU'; u.rate = 1; u.onend = res; u.onerror = res;
        ss.speak(u);
      } catch (e) { res(); }
    }), wait(fallbackMs + 4000)]);
  };
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------------- stage ---------------- */
  var STAGE = {
    door: { chip: 'At the door', cls: '', vs: '<i class="dot you"></i>You <em>facing</em> <i class="dot them"></i>the homeowner' },
    pain: { chip: 'At the problem', cls: '', vs: '<i class="dot you"></i>You <em>and</em> <i class="dot them"></i>them <em>facing</em> <i class="dot dirt"></i>the dirt' },
    count: { chip: 'The count', cls: 'count', vs: '<i class="dot you"></i>You, alone, for thirty seconds' },
    shake: { chip: 'Booked', cls: 'back', vs: '<i class="dot you"></i>You <em>and</em> <i class="dot them"></i>them, same side' },
    leave: { chip: 'Leaving well', cls: 'back', vs: '<i class="dot you"></i>A wave, a name, the next door' },
    shut: { chip: 'Door closed', cls: 'count', vs: 'On to the next one' }
  };
  var GUARD = { hello: .82, bridge: .66, steps: .44, quick: .34, loop: .78, count: .3, back: .3, stack: .22, price: .3, stall: .5, book: .06, leave: .25 };
  function stageHTML() {
    return '<div class="stage" id="stage"><div class="stage-fallback" hidden>The 3D doorstep needs WebGL, which this browser has switched off. Everything else works.</div>' +
      '<div class="stage-ui"><span class="stage-chip" id="st-chip"><i></i><span></span></span>' +
      '<div class="guardbox" id="st-guard"><b><span>Their guard</span><span id="st-gv"></span></b><div class="guardbar"><i></i></div></div>' +
      '<div class="versus" id="st-vs"></div></div></div>';
  }
  function mountStage() {
    var el = document.getElementById('stage');
    if (!el) return;
    var ok = scene.mount(el);
    if (!ok || !scene.ok) el.querySelector('.stage-fallback').hidden = false;
    scene.setService(S.service);
  }
  function setStage(stage, guard, label, half) {
    var el = document.getElementById('stage');
    if (!el) return;
    var d = STAGE[stage] || STAGE.door;
    scene.setStage(stage, { guard: guard });
    scene.setGuard(guard);
    var chip = document.getElementById('st-chip');
    chip.className = 'stage-chip ' + (half === 'back' ? 'back' : half === 'count' ? 'count' : d.cls);
    chip.lastChild.textContent = label || d.chip;
    document.getElementById('st-vs').innerHTML = d.vs;
    setGuardUI(guard, stage === 'count' || stage === 'shut');
  }
  function setGuardUI(g, hide) {
    var box = document.getElementById('st-guard');
    if (!box) return;
    box.hidden = !!hide;
    box.classList.toggle('hot', g > .74); box.classList.toggle('low', g < .3);
    box.querySelector('.guardbar i').style.width = Math.round(Math.max(.04, g) * 100) + '%';
    document.getElementById('st-gv').textContent = g > .74 ? 'Up' : g < .3 ? 'Down' : 'Wary';
  }

  /* ---------------- shared bits ---------------- */
  function stepInfo(k) {
    if (k === 'out' || k === 'big') return { n: k === 'out' ? '✓' : '!', name: C.process[k].name, side: k };
    var side = k.charAt(0) === 'f' ? 'front' : 'back', i = +k.slice(1);
    return { n: i, name: C.process[side].steps[i - 1].name, side: side };
  }
  function stepTag(k) { var s = stepInfo(k); return '<span class="steptag"><b>' + s.n + '</b>' + esc(s.name) + '</span>'; }
  function litOf(lines) { var o = {}; lines.forEach(function (l) { var k = l.step || l[0]; if (k) o[k] = true; }); return o; }
  // compact strip of rungs; lit = map of step keys to highlight (omit to light none)
  function ladderHTML(side, lit) {
    var p = C.process[side];
    return '<ol class="ladder ' + side + '" aria-label="' + esc(p.title) + '">' + p.steps.map(function (st, i) {
      return '<li class="' + (lit && lit[st.k] ? 'on' : '') + '"><b>' + (i + 1) + '</b>' + esc(st.name) + '</li>';
    }).join('') + '</ol>';
  }
  // the full explainer: every rung, what it is, and the coach's own words
  function processHTML(side, lit) {
    var p = C.process[side];
    return '<section class="proc ' + side + '"><header><span class="tag ' + (side === 'front' ? 'blue' : 'good') + '">' + esc(p.when) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.line) + '</p></header>' +
      '<ol class="proc-steps">' + p.steps.map(function (st, i) {
        return '<li class="' + (lit && !lit[st.k] ? 'dim' : '') + '"><b>' + (i + 1) + '</b><div><strong>' + esc(st.name) + '</strong><span>' + esc(st.what) + '</span><em>' + esc(st.ex) + '</em></div></li>';
      }).join('') + '</ol><p class="proc-out">' + ico('door') + '<span>' + esc(p.out) + '</span></p></section>';
  }
  function sayOf(o) { return o.steps.map(function (s) { return s[1]; }).join(' // '); }
  function lineHTML(l, strategy) {
    if (l.who === 'move') return '<p class="line move">' + ico('foot') + '<span>' + fmt(l.t, strategy) + '</span></p>';
    return '<p class="line ' + l.who + (l.step ? ' stepped' : '') + '">' + (l.step ? stepTag(l.step) : '<span class="who">' + (l.who === 'you' ? 'You' : 'Homeowner') + '</span>') + fmt(l.t, strategy) +
      (l.cue ? '<span class="cue">' + esc(l.cue) + '</span>' : '') + '</p>';
  }
  function coachHTML(kind, title, text, cite) {
    var ic = kind === 'trap' ? 'alert' : kind === 'move' ? 'foot' : 'whistle';
    return '<div class="coach ' + kind + '"><span class="coach-ico">' + ico(ic) + '</span><div><h4>' + title + '</h4><p>' + fmt(text) + '</p>' +
      (cite ? '<cite>' + esc(cite) + '</cite>' : '') + '</div></div>';
  }
  function waysFor(b) { return (b.ways || []).filter(function (w) { return !w.only || w.only === S.strategy; }); }
  function wayIndex(b) { var i = S.ways[b.id]; return (i >= 0 && i < waysFor(b).length) ? i : -1; }
  function beatLines(b) { var i = wayIndex(b); return i < 0 ? b.lines : waysFor(b)[i].lines; }
  function halfName(h) { return h === 'front' ? 'Front half' : h === 'back' ? 'Back half' : 'The count'; }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 1900);
  }
  function strategySeg() {
    return '<div class="seg" role="group" aria-label="Strategy">' + Object.keys(C.strategies).map(function (k) {
      return '<button type="button" data-strategy="' + k + '" aria-pressed="' + (S.strategy === k) + '">' + C.strategies[k].label + '</button>';
    }).join('') + '</div>';
  }
  function serviceChips() {
    return '<div class="chips" role="group" aria-label="Service">' + Object.keys(C.services).map(function (k) {
      return '<button type="button" class="chip" data-service="' + k + '" aria-pressed="' + (S.service === k) + '">' + C.services[k].label + '</button>';
    }).join('') + '</div>';
  }

  /* ---------------- views ---------------- */
  var views = {}, after = {}, route = 'today';
  var TABS = [['today', 'Today', 'door'], ['walk', 'The walk', 'walk'], ['script', 'Script', 'script'], ['rehearse', 'Practice', 'target'], ['film', 'Film room', 'film']];
  var PRACTICE = [['rehearse', 'Rehearse'], ['sim', 'Door sim'], ['objections', 'Objections'], ['delivery', 'Delivery']];
  function tabOf(r) { return PRACTICE.some(function (p) { return p[0] === r; }) ? 'rehearse' : r; }

  function shell() {
    app.innerHTML = '<div class="shell"><header class="top"><div class="top-in">' +
      '<a class="brand" href="#today"><span class="brand-mark">' + MARK + '</span><span>Door Coach</span></a>' +
      '<nav class="nav" aria-label="Sections">' + TABS.map(function (t) { return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + t[1] + '</a>'; }).join('') + '</nav>' +
      '<button type="button" class="ctx" id="ctx" aria-label="Change your street details">' + ico('sliders') + '<span id="ctx-t"></span></button>' +
      '</div></header><main class="main" id="main"></main>' +
      '<nav class="tabbar" aria-label="Sections"><div class="tabbar-in">' + TABS.map(function (t) {
        return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + ico(t[2]) + '<span>' + t[1] + '</span></a>';
      }).join('') + '</div></nav></div>' +
      '<dialog class="sheet" id="sheet" aria-labelledby="sheet-title"></dialog>';
    document.getElementById('ctx').addEventListener('click', openSetup);
  }
  function chrome() {
    document.getElementById('ctx-t').innerHTML = esc(C.services[S.service].label) + '<span class="ctx-more"> · ' + esc(C.strategies[S.strategy].label) + '</span>';
    var tab = tabOf(route);
    document.querySelectorAll('[data-tab]').forEach(function (a) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function render() {
    Voice.stop(); RH.seq++; stopOpener();
    var h = (location.hash || '#today').slice(1);
    if (h === 'practice') h = 'rehearse';
    route = views[h] ? h : 'today';
    var main = document.getElementById('main');
    main.innerHTML = '<div class="view stack-lg" data-view="' + route + '">' + views[route]() + '</div>';
    chrome(); mountStage();
    if (after[route]) after[route]();
    window.scrollTo(0, 0);
  }

  /* ----- today ----- */
  views.today = function () {
    var pr = prices(S.service), n = streak();
    var reps = [
      ['walk', 'Walk the door', 'Twelve beats, about two minutes. See where everyone stands.', P.today.walk],
      ['rehearse', 'Rehearse out loud', 'The homeowner talks, you answer. Read it, then cue it, then go blind.', P.today.rehearse],
      ['sim', 'Run a door', 'Pick your reply and watch their guard move. The coach marks every choice.', P.today.sim],
      ['objections', 'Six objections', 'Build each answer on his process, out loud, before you flip the card.', P.today.obj]
    ];
    return '<section class="hero"><div class="hero-copy"><p class="eyebrow">Stride Door Coach' + (n > 1 ? ' · ' + n + ' days running' : '') + '</p>' +
      '<h1>Knock like a neighbour.</h1>' +
      '<p class="lede">Practise the door the way the coach teaches it: slow, back and forth, and standing at the dirt with the homeowner. Ten minutes before you knock.</p>' +
      '<div class="row"><a class="btn" href="#rehearse">' + ico('target') + 'Start today\'s reps</a><a class="btn ghost" href="#walk">Walk the door first</a></div></div>' +
      stageHTML() + '</section>' +
      '<section class="panel setup"><div class="setup-head"><h2>Your street today</h2><button type="button" class="btn ghost sm" data-open="setup">' + ico('sliders') + 'Edit details</button></div>' +
      '<div class="setup-grid"><span>Strategy</span>' + strategySeg() + '<span>Lead with</span>' + serviceChips() + '</div>' +
      '<p class="muted" style="font-size:.93rem">' + esc(C.strategies[S.strategy].blurb) + ' Lead with whichever surface looks worst from the footpath.</p>' +
      '<div class="summary"><span><b>' + esc(ctx().me) + '</b> on <b>' + esc(ctx().street) + '</b></span>' +
      (S.strategy === 'anchor' ? '<span>Booked: <b>' + esc(ctx().neighbour) + '</b></span>' : '') +
      '<span>Run day: <b>' + esc(ctx().runDay) + '</b></span><span>One-off <b>$' + pr.callout + '</b>, on the run <b>$' + pr.price + '</b></span>' +
      (S.example ? '<span class="tag warn">Example details</span>' : '') + '</div></section>' +
      '<div class="two"><section class="stack"><h2>Today\'s reps</h2><div class="reps">' + reps.map(function (r, i) {
        return '<a class="rep' + (r[3] ? ' done' : '') + '" href="#' + r[0] + '"><span class="rep-n">' + (r[3] ? ico('check') : (i + 1)) + '</span><span><h3>' + r[1] + '</h3><p>' + r[2] + '</p></span>' + ico('arrow') + '</a>';
      }).join('') + '</div></section>' +
      '<section class="stack"><h2>The door in five lines</h2><ol class="five">' +
      '<li><span><b>Human first.</b> Seven seconds before any of it is about you.</span></li>' +
      '<li><span><b>Two steps to the dirt.</b> You and them, facing the problem.</span></li>' +
      '<li><span><b>Go for the price.</b> The front half is only about getting to the count.</span></li>' +
      '<li><span><b>Parts, then price, with a reason.</b> Look at the surface when you say the number.</span></li>' +
      '<li><span><b>A decision today, a name, and leave well.</b></span></li></ol>' +
      '<p class="note">' + ico('scale') + '<span>The coach sells in the US. Queensland has its own door-knocking rules, and they change how you book the job. <button type="button" data-open="law" style="color:var(--accent);font-weight:750;text-decoration:underline;text-underline-offset:3px">Read the six rules</button></span></p></section></div>' +
      '<section class="stack"><div class="stack" style="gap:6px"><h2>When they say no</h2><p class="lede">He never argues an objection. Before there is a price he goes past it. After the price he guides them to a decision. Each one is a fixed set of steps.</p></div>' +
      '<div class="two">' + processHTML('front') + processHTML('back') + '</div>' +
      '<div class="row"><a class="btn" href="#objections">Drill the process' + ico('arrow') + '</a></div></section>';
  };
  after.today = function () { setStage('door', .7, 'At the door'); };

  /* ----- the walk ----- */
  var W = { i: 0 };
  views.walk = function () {
    return '<div class="split"><div class="split-stage">' + stageHTML() + '</div><div class="split-body" id="walk-body"></div></div>';
  };
  function walkRender() {
    var b = C.beats[W.i], body = document.getElementById('walk-body'), ws = waysFor(b), wi = wayIndex(b);
    var rail = C.beats.map(function (x, i) {
      var gap = i > 0 && C.beats[i - 1].half !== x.half;
      return '<button type="button" data-go="' + i + '" class="' + (gap ? 'gap ' : '') + (i < W.i ? 'past' : '') + '"' + (i === W.i ? ' aria-current="step"' : '') + ' aria-label="Beat ' + (i + 1) + ': ' + esc(x.title) + '"></button>';
    }).join('');
    body.innerHTML = '<div><div class="rail">' + rail + '</div><div class="rail-labels"><span>Front half</span><span>Count</span><span>Back half</span></div></div>' +
      '<article class="beat"><header class="beat-head"><p class="eyebrow">' + halfName(b.half) + ' · beat ' + (W.i + 1) + ' of ' + C.beats.length + ' · ' + esc(b.time) + '</p>' +
      '<h2>' + esc(b.title) + '</h2><p class="beat-goal">' + fmt(b.goal) + '</p>' +
      '<p class="feel"><b>They feel</b><q>' + esc(b.feel) + '</q></p></header>' +
      (ws.length ? '<div class="ways"><div class="ways-head"><b>Ways to say it</b><div class="chips"><button type="button" class="chip" data-way="-1" aria-pressed="' + (wi < 0) + '">The standard</button>' +
        ws.map(function (w, i) { return '<button type="button" class="chip" data-way="' + i + '" aria-pressed="' + (wi === i) + '">' + esc(w.name) + '</button>'; }).join('') + '</div></div>' +
        (wi >= 0 ? '<p class="way-note"><b>' + esc(ws[wi].by) + '.</b> ' + fmt(ws[wi].note) + '</p>' : '') + '</div>' : '') +
      (b.process ? processHTML(b.process, litOf(beatLines(b))) : '') +
      '<div class="convo">' + beatLines(b).map(function (l) { return lineHTML(l); }).join('') + '</div>' +
      coachHTML('move', 'Body', b.move) +
      coachHTML('why', 'Why it works', b.why + (b.strategyNote ? ' ' + C.strategies[S.strategy].coach : '')) +
      coachHTML('trap', 'The trap', b.trap, b.who) +
      '<div class="pager"><button type="button" class="btn ghost" data-go="' + (W.i - 1) + '"' + (W.i === 0 ? ' disabled' : '') + ' aria-label="Previous beat">' + ico('back') + '</button>' +
      (W.i < C.beats.length - 1 ? '<button type="button" class="btn" data-go="' + (W.i + 1) + '">Next: ' + esc(C.beats[W.i + 1].title) + ico('arrow') + '</button>'
        : '<a class="btn" href="#rehearse">Now say it out loud' + ico('arrow') + '</a>') + '</div></article>';
    setStage(b.stage, b.guard || GUARD[b.id], b.title, b.half);
    if (W.i === C.beats.length - 1) mark('walk');
  }
  after.walk = walkRender;

  /* ----- script ----- */
  views.script = function () {
    var out = '<header class="stack"><p class="eyebrow">Your script</p><h1 style="font-size:clamp(1.9rem,1.3rem + 2.4vw,2.9rem)">' + esc(C.services[S.service].label) + ', ' + esc(C.strategies[S.strategy].label.toLowerCase()) + '</h1>' +
      '<p class="lede">Learn the order and the reason for each beat. Then say it in your own words. The dotted marks are pauses, and they matter more than the words.</p>' +
      '<div class="script-tools"><div class="row">' + strategySeg() + '</div>' + serviceChips() + '</div>' +
      '<div class="row"><button type="button" class="btn ghost sm" id="copy">' + ico('copy') + 'Copy the script</button><button type="button" class="btn ghost sm" data-open="setup">' + ico('sliders') + 'Names and prices</button></div></header>';
    out += '<div class="script-col">';
    var last = '';
    C.beats.forEach(function (b, i) {
      if (b.half !== last) { out += '<h2 class="half-title">' + halfName(b.half) + '</h2>'; last = b.half; }
      var ws = waysFor(b), wi = wayIndex(b);
      out += '<section class="sbeat"><div class="sbeat-head"><span class="tag blue">' + (i + 1) + '</span><h3>' + esc(b.title) + '</h3><span class="muted" style="font-size:.86rem">' + esc(b.time) + '</span></div>' +
        (ws.length ? '<div class="chips"><button type="button" class="chip" data-way="-1" data-beat="' + b.id + '" aria-pressed="' + (wi < 0) + '">The standard</button>' +
          ws.map(function (w, k) { return '<button type="button" class="chip" data-way="' + k + '" data-beat="' + b.id + '" aria-pressed="' + (wi === k) + '">' + esc(w.by) + ': ' + esc(w.name) + '</button>'; }).join('') + '</div>' : '') +
        (b.process ? ladderHTML(b.process, litOf(beatLines(b))) : '') +
        '<div class="convo">' + beatLines(b).map(function (l) { return lineHTML(l); }).join('') + '</div>' +
        '<p class="why">' + (wi >= 0 ? fmt(ws[wi].note) : fmt(b.goal + ' ' + b.why.split('. ')[0] + '.')) + '</p></section>';
    });
    out += '</div><section class="stack"><h2>Same door, every surface</h2><p class="lede">The beats never change. Only three things do: where you stand, what you name, and why half a job is not enough.</p>' +
      '<div class="table-wrap"><table><thead><tr><th>Lead with</th><th>Stand at</th><th>Name the parts</th><th>Why the lot</th><th>Then link to</th></tr></thead><tbody>' +
      Object.keys(C.services).map(function (k) {
        var s = C.services[k];
        return '<tr class="' + (k === S.service ? 'on' : '') + '"><td>' + s.label + '</td><td>' + esc(s.spot.charAt(0).toUpperCase() + s.spot.slice(1)) + '</td><td>' + s.stack.map(esc).join('<br>') + '</td><td>' + esc(s.why) + '</td><td>' + esc(s.link.replace(/\s*\/\/\s*/g, ' ')) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="note">' + ico('alert') + '<span><b>Say the limit before the price.</b> ' + esc(C.services[S.service].honest) + '</span></p></section>';
    return out;
  };
  after.script = function () {
    document.getElementById('copy').addEventListener('click', function () {
      var txt = C.beats.map(function (b, i) {
        return (i + 1) + '. ' + b.title.toUpperCase() + '\n' + beatLines(b).map(function (l) {
          return (l.who === 'you' ? 'You: ' : l.who === 'them' ? 'Them: ' : '[') + plain(l.t) + (l.who === 'move' ? ']' : '');
        }).join('\n');
      }).join('\n\n');
      var done = function () { toast('Script copied'); }, fail = function () { toast('Copy is blocked here. Select the text instead.'); };
      try { navigator.clipboard.writeText(txt).then(done, fail); } catch (e) { fail(); }
    });
  };

  /* ----- practice: shared header ----- */
  function practiceNav() {
    return '<div class="subnav"><div class="seg" role="group" aria-label="Practice mode">' + PRACTICE.map(function (p) {
      return '<button type="button" data-route="' + p[0] + '" aria-pressed="' + (route === p[0]) + '">' + p[1] + '</button>';
    }).join('') + '</div><button type="button" class="toggle" id="voice" aria-pressed="' + !!S.voice + '"><i></i>Homeowner voice</button></div>';
  }

  /* ----- rehearse ----- */
  var RH = { i: -1, lines: [], seq: 0, hist: [], fast: 0, t0: 0, start: 0 };
  function rhLines() {
    var out = [];
    C.beats.forEach(function (b) {
      if (b.id === 'leave' || (b.process && !S.pushback)) return;
      beatLines(b).forEach(function (l) {
        if (S.pushback && l.easy) return; // the easy yes is replaced by the pushback beat
        out.push({ b: b, who: l.who, t: l.t, cue: l.cue, step: l.step });
      });
    });
    return out;
  }
  views.rehearse = function () {
    return practiceNav() + '<div class="split"><div class="split-stage">' + stageHTML() + '</div><div class="split-body" id="rh"></div></div>';
  };
  after.rehearse = function () { RH.i = -1; RH.lines = rhLines(); rhIntro(); };
  function levelSeg() {
    return '<div class="seg" role="group" aria-label="Difficulty">' + [['read', 'Read it'], ['cue', 'Cues only'], ['blind', 'From memory']].map(function (l) {
      return '<button type="button" data-level="' + l[0] + '" aria-pressed="' + (S.level === l[0]) + '">' + l[1] + '</button>';
    }).join('') + '</div>';
  }
  function rhIntro() {
    setStage('door', .82, 'At the door');
    document.getElementById('rh').innerHTML = '<header class="stack"><p class="eyebrow">Rehearse</p><h2>Say the whole door out loud</h2>' +
      '<p class="lede">The homeowner speaks. You answer out loud, standing up, then tap. Take every pause mark. If it sounds like a script, slow down.</p></header>' +
      levelSeg() +
      '<button type="button" class="toggle" id="pushback" aria-pressed="' + !!S.pushback + '"><i></i>Include pushback: one brush-off before the price, one stall after it</button>' +
      '<ul class="checks"><li>' + ico('check') + '<span>Short lines. Hand it back after each one.</span></li><li>' + ico('check') + '<span>Eyes on the surface when you say the price.</span></li><li>' + ico('check') + '<span>The app times you. Past about 185 words a minute it flags the line as rushed.</span></li></ul>' +
      '<button type="button" class="btn big" id="rh-go">' + ico('door') + 'Knock</button>' +
      (P.rehearsals ? '<p class="muted" style="text-align:center;font-size:.9rem">' + P.rehearsals + ' full run' + (P.rehearsals > 1 ? 's' : '') + ' so far</p>' : '');
    document.getElementById('rh-go').addEventListener('click', function () { RH.hist = []; RH.fast = 0; RH.start = Date.now(); rhStep(0); });
  }
  function rhPrompt(l) {
    var full = fmt(l.t);
    if (l.who === 'move' || S.level === 'read') return full;
    if (S.level === 'cue') { if (l.step) return '<span class="muted">Your words for this step</span>'; var w = plain(l.t).split(/\s+/); return esc(w.slice(0, 3).join(' ')) + ' …'; }
    return '<span class="muted">' + esc(l.b.title) + '</span>';
  }
  function rhStep(i) {
    var seq = ++RH.seq; RH.i = i;
    var el = document.getElementById('rh');
    if (!el) return;
    if (i >= RH.lines.length) return rhDone();
    var l = RH.lines[i], b = l.b;
    setStage(b.stage, b.guard || GUARD[b.id], b.title, b.half);
    var hist = RH.hist.map(function (h) {
      return h.who === 'move' ? '' : '<p class="line ' + h.who + '">' + fmt(h.t) + (h.fast ? ' <span class="tag bad">Rushed · ' + h.wpm + ' wpm</span>' : '') + '</p>';
    }).join('');
    var mine = l.who !== 'them';
    el.innerHTML = '<div class="meter"><span>' + esc(halfName(b.half)) + ' · ' + esc(b.title) + '</span><div class="meter-bar"><i style="width:' + Math.round(i / RH.lines.length * 100) + '%"></i></div></div>' +
      '<div class="history" id="rh-hist">' + hist + '</div>' +
      '<div class="turn ' + (mine ? 'yours' : 'theirs') + '"><h4><span>' + (l.who === 'them' ? 'Homeowner' : l.who === 'move' ? 'Do this' : l.step ? stepTag(l.step) : 'Your line') + '</span>' +
      (l.who === 'them' ? '<span class="speaking" aria-hidden="true"><i></i><i></i><i></i></span>' : '') + '</h4>' +
      (l.step && l.b.process ? ladderHTML(l.b.process, litOf([l])) : '') +
      '<p class="say">' + rhPrompt(l) + '</p>' +
      (l.who === 'you' ? '<p class="hint">' + (S.level === 'read' ? (l.cue ? esc(l.cue) + '. ' : '') + esc(b.goal) : esc(b.goal)) + '</p>' : '') + '</div>' +
      '<button type="button" class="btn big' + (mine ? '' : ' ghost') + '" id="rh-next">' + (l.who === 'them' ? 'Skip' : l.who === 'move' ? 'Done' : 'Said it') + '</button>';
    var hEl = document.getElementById('rh-hist'); hEl.scrollTop = hEl.scrollHeight;
    RH.t0 = Date.now();
    var next = function () {
      if (seq !== RH.seq) return;
      var rec = { who: l.who, t: l.t };
      if (l.who === 'you') {
        var n = words(l.t), mins = (Date.now() - RH.t0) / 60000;
        rec.wpm = Math.round(n / Math.max(mins, .001));
        if (n >= 7 && mins > 0.02 && rec.wpm > 185) { rec.fast = true; RH.fast++; }
      }
      RH.hist.push(rec); Voice.stop(); rhStep(i + 1);
    };
    document.getElementById('rh-next').addEventListener('click', next);
    if (l.who === 'them') Voice.speak(spoken(l.t)).then(function () { return wait(380); }).then(next);
  }
  function rhDone() {
    P.rehearsals++; mark('rehearse');
    setStage('shake', .05, 'Booked', 'back');
    var secs = Math.round((Date.now() - RH.start) / 1000), said = RH.hist.filter(function (h) { return h.who === 'you'; }).length;
    var nextLevel = S.level === 'read' ? 'cue' : S.level === 'cue' ? 'blind' : null;
    document.getElementById('rh').innerHTML = '<div class="result panel"><p class="eyebrow">Run complete</p><p class="big">' + Math.floor(secs / 60) + ':' + ('0' + secs % 60).slice(-2) + '</p>' +
      '<p class="lede" style="text-align:center">' + said + ' lines. ' + (RH.fast ? '<b>' + RH.fast + ' rushed.</b> Run it again and breathe at every pause mark.' : 'None rushed. That is a conversation.') + '</p>' +
      '<ul class="checks"><li>' + ico('whistle') + '<span>Did you wait for their answer after "have you seen us"?</span></li><li>' + ico('whistle') + '<span>Did you name each part of the job in its own breath?</span></li><li>' + ico('whistle') + '<span>Did you stop talking after the price?</span></li></ul>' +
      '<div class="row" style="justify-content:center">' + (nextLevel ? '<button type="button" class="btn" data-level="' + nextLevel + '" data-again="1">' + (nextLevel === 'cue' ? 'Again, cues only' : 'Again, from memory') + '</button>' : '') +
      '<button type="button" class="btn ghost" data-again="1">' + ico('redo') + 'Run it again</button><a class="btn ghost" href="#sim">Try a door sim</a></div></div>';
  }

  /* ----- door sim ----- */
  var M = { scn: null };
  views.sim = function () {
    return practiceNav() + '<div class="split"><div class="split-stage">' + stageHTML() + '</div><div class="split-body" id="sim"></div></div>';
  };
  after.sim = function () { M.scn = null; simList(); };
  function simList() {
    setStage('door', .7, 'Pick a door');
    document.getElementById('sim').innerHTML = '<header class="stack"><p class="eyebrow">Door sim</p><h2>Pick your reply. Watch their guard.</h2>' +
      '<p class="lede">Each door is built from one the coach reviewed. Every choice moves the homeowner\'s guard, and he tells you why.</p>' +
      '<button type="button" class="toggle" id="sayfirst" aria-pressed="' + !!S.sayFirst + '"><i></i>Say my line out loud before I see the options</button></header>' +
      '<div class="scn-list">' + C.scenarios.map(function (s) {
        var best = P.simBest[s.id];
        return '<button type="button" class="scn" data-scn="' + s.id + '"><span class="tag ' + (s.strategy === 'anchor' ? 'blue' : '') + '">' + esc(s.level) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.blurb) + '</p>' +
          '<span class="scn-foot"><span>From: ' + esc(s.based) + '</span>' + (best !== undefined ? '<span class="tag ' + (best >= 80 ? 'good' : best >= 50 ? 'warn' : 'bad') + '">Best ' + best + '%</span>' : '<span>' + s.nodes.length + ' moments</span>') + '</span></button>';
      }).join('') + '</div>';
  }
  function simStart(id) {
    var s = C.scenarios.filter(function (x) { return x.id === id; })[0];
    M = { scn: s, i: 0, guard: s.guard, score: 0, reply: null, strat: s.strategy === 'anchor' ? 'anchor' : undefined };
    simNode();
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function simNode() {
    var s = M.scn, n = s.nodes[M.i], el = document.getElementById('sim');
    if (s.independent) M.guard = s.guard;
    setStage(n.stage, M.guard / 100, s.title);
    var them = n.them;
    M.order = shuffle(n.choices.map(function (c, i) { return i; }));
    el.innerHTML = '<div class="meter"><button type="button" class="btn ghost sm" data-simback="1">' + ico('back') + 'Doors</button><span>' + (M.i + 1) + ' of ' + s.nodes.length + '</span><div class="meter-bar"><i style="width:' + Math.round(M.i / s.nodes.length * 100) + '%"></i></div></div>' +
      '<div class="convo">' + lineHTML({ who: 'them', t: them }, M.strat) + '</div>' +
      '<div id="sim-choices">' + (S.sayFirst ? '<div class="well stack"><p><b>Say your reply out loud.</b> Then see which option was closest.</p><button type="button" class="btn" id="sim-show">I\'ve said it</button></div>' : simChoices()) + '</div><div id="sim-verdict"></div>';
    if (S.sayFirst) document.getElementById('sim-show').addEventListener('click', function () { document.getElementById('sim-choices').innerHTML = simChoices(); });
    Voice.speak(spoken(them, M.strat));
  }
  function simChoices() {
    var n = M.scn.nodes[M.i];
    return '<div class="choices">' + M.order.map(function (k) { return '<button type="button" class="choice" data-pick="' + k + '">' + fmt(n.choices[k].t, M.strat) + '</button>'; }).join('') + '</div>';
  }
  function simPick(k) {
    var s = M.scn, n = s.nodes[M.i], c = n.choices[k];
    Voice.stop();
    M.score += c.v === 'best' ? 2 : c.v === 'ok' ? 1 : 0;
    M.guard = Math.max(0, Math.min(100, M.guard + c.g));
    scene.setGuard(M.guard / 100); setGuardUI(M.guard / 100); scene.pulse(c.v === 'miss' ? 'bad' : 'good');
    document.querySelectorAll('.choice').forEach(function (b) {
      b.disabled = true;
      var idx = +b.dataset.pick;
      if (idx === k) b.classList.add('picked', c.v);
      else if (n.choices[idx].v === 'best') b.classList.add('reveal');
    });
    var label = c.v === 'best' ? ['good', 'The coach\'s move'] : c.v === 'ok' ? ['warn', 'It works, but'] : ['bad', 'That cost you'];
    var last = M.i === s.nodes.length - 1, shut = M.guard >= 100 && !s.independent;
    document.getElementById('sim-verdict').innerHTML = '<div class="verdict"><div class="convo">' + lineHTML({ who: 'them', t: c.reply }, M.strat) + '</div>' +
      '<div class="coach ' + (c.v === 'miss' ? 'trap' : 'why') + '"><span class="coach-ico">' + ico('whistle') + '</span><div><h4>' + label[1] + '</h4><p>' + fmt(c.c, M.strat) + '</p></div></div>' +
      (n.obj ? '<div class="well stack" style="gap:8px"><p style="font-size:.86rem;font-weight:750;color:var(--text-2)">That was an objection ' + (n.obj === 'front' ? 'before the price. He goes past it:' : 'after the price. He guides them through it:') + '</p>' + ladderHTML(n.obj) + '</div>' : '') +
      '<button type="button" class="btn big" id="sim-next">' + (last || shut ? 'See how it ended' : 'Next moment') + ico('arrow') + '</button></div>';
    document.getElementById('sim-next').addEventListener('click', function () { if (last || shut) simEnd(shut); else { M.i++; simNode(); } });
    document.getElementById('sim-verdict').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function simEnd(shut) {
    var s = M.scn, max = s.nodes.length * 2, pct = Math.round(M.score / max * 100);
    var kind = shut ? 'lose' : s.independent ? (pct >= 80 ? 'win' : pct >= 50 ? 'mid' : 'lose') : (M.guard <= s.win ? 'win' : M.guard >= 92 ? 'lose' : 'mid');
    var e = s.endings[kind], stars = pct >= 85 ? 3 : pct >= 60 ? 2 : pct >= 35 ? 1 : 0;
    if (P.simBest[s.id] === undefined || pct > P.simBest[s.id]) P.simBest[s.id] = pct;
    mark('sim');
    setStage(kind === 'win' ? (s.independent ? 'leave' : 'shake') : kind === 'lose' ? 'shut' : 'leave', kind === 'win' ? .05 : .6, e.title.replace(/\$\{deal\}/, ''), 'back');
    document.getElementById('st-chip').lastChild.textContent = fill(e.title, M.strat);
    document.getElementById('sim').innerHTML = '<div class="result panel"><span class="tag ' + (kind === 'win' ? 'good' : kind === 'mid' ? 'warn' : 'bad') + '">' + fmt(e.title, M.strat) + '</span>' +
      '<p class="big">' + pct + '%</p><div class="stars" role="img" aria-label="' + stars + ' of 3 stars">' + [0, 1, 2].map(function (i) { return '<span class="' + (i < stars ? 'lit' : '') + '">' + ico('star') + '</span>'; }).join('') + '</div>' +
      '<p class="lede" style="text-align:center">' + fmt(e.text, M.strat) + '</p>' +
      '<div class="row" style="justify-content:center"><button type="button" class="btn" data-scn="' + s.id + '">' + ico('redo') + 'Run it again</button><button type="button" class="btn ghost" data-simback="1">Another door</button></div></div>';
  }

  /* ----- objections ----- */
  var O = { filter: 'all', order: [], i: 0, flipped: false };
  function objOrder() {
    var list = C.objections.filter(function (o) { return O.filter === 'all' || o.stage === O.filter; });
    var rank = function (o) { var r = P.obj[o.id]; return r === undefined ? -1 : r; };
    return shuffle(list).sort(function (a, b) { return rank(a) - rank(b); });
  }
  views.objections = function () {
    return practiceNav() + '<div class="split"><div class="split-stage">' + stageHTML() + '</div><div class="split-body" id="obj"></div></div>';
  };
  after.objections = function () { O.order = objOrder(); O.i = 0; O.flipped = false; objRender(); };
  function objRender() {
    var el = document.getElementById('obj');
    if (!O.order.length) return;
    var o = O.order[O.i % O.order.length];
    setStage(o.stage === 'front' ? 'door' : 'pain', o.hard ? .95 : o.stage === 'front' ? .75 : .5, o.stage === 'front' ? 'Front half: no offer yet' : 'Back half: price is out', o.stage);
    var nailed = C.objections.filter(function (x) { return P.obj[x.id] === 2; }).length;
    var lit = litOf(o.steps), side = o.stage;
    var segs = '<ol class="segs">' + o.steps.map(function (st) {
      var inf = stepInfo(st[0]);
      return '<li class="' + inf.side + '"><b>' + inf.n + '</b><div><strong>' + esc(inf.name) + '</strong><span>' + fmt(st[1]) + '</span></div></li>';
    }).join('') + '</ol>';
    el.innerHTML = '<header class="stack"><p class="eyebrow">Objections</p><h2>Build your answer on his process</h2>' +
      '<p class="muted" style="font-size:.95rem">' + esc(C.process[side].line) + ' <button type="button" data-open="process" style="color:var(--accent);font-weight:750;text-decoration:underline;text-underline-offset:3px">See both ladders</button></p>' +
      '<div class="row" style="justify-content:space-between"><div class="seg" role="group" aria-label="Filter">' + [['all', 'All'], ['front', 'Front half'], ['back', 'Back half']].map(function (f) {
        return '<button type="button" data-ofilter="' + f[0] + '" aria-pressed="' + (O.filter === f[0]) + '">' + f[1] + '</button>';
      }).join('') + '</div><span class="tag good">' + nailed + ' of ' + C.objections.length + ' nailed</span></div>' +
      '<div class="pips">' + O.order.map(function (x, i) { var r = P.obj[x.id]; return '<i class="' + (r !== undefined ? 'r' + r : '') + (i === O.i % O.order.length ? ' now' : '') + '"></i>'; }).join('') + '</div></header>' +
      '<div class="flip' + (O.flipped ? ' flipped' : '') + '" id="flip"><div class="flip-in">' +
      '<div class="face front"><div class="row" style="justify-content:space-between"><span class="tag ' + (o.stage === 'front' ? 'blue' : 'good') + '">' + (o.stage === 'front' ? 'Front half' : 'Back half') + '</span>' +
      '<button type="button" class="btn ghost sm" id="obj-say" aria-label="Hear it">' + ico('sound') + 'Hear it</button></div>' +
      '<p class="obj-q">“' + fmt(o.them) + '”</p>' +
      (o.hard ? '<p class="muted" style="font-size:.9rem">Is this one a smokescreen, or real?</p>' : '<div class="stack" style="gap:8px"><p class="muted" style="font-size:.86rem;font-weight:750">Say it out loud, one step at a time:</p>' + ladderHTML(side) + '</div>') +
      '<button type="button" class="btn big" id="obj-flip"' + (O.flipped ? ' tabindex="-1"' : '') + '>I\'ve answered. Show me the coach\'s</button></div>' +
      '<div class="face back"' + (O.flipped ? '' : ' inert') + '><p class="feel"><b>What it means</b><span>' + esc(o.means) + '</span></p>' +
      (o.hard ? '' : ladderHTML(side, lit)) + segs +
      '<div class="coach why"><span class="coach-ico">' + ico('whistle') + '</span><div><h4>Why</h4><p>' + fmt(o.why) + '</p><cite>' + esc(o.by) + '</cite></div></div>' +
      '<div class="rate" role="group" aria-label="How did you go?"><button type="button" class="r0" data-rate="0">Missed it</button><button type="button" class="r1" data-rate="1">Close</button><button type="button" class="r2" data-rate="2">Nailed it</button></div></div>' +
      '</div></div>';
    document.getElementById('obj-flip').addEventListener('click', function () {
      O.flipped = true; Voice.stop();
      document.getElementById('flip').classList.add('flipped');
      document.querySelector('.face.back').removeAttribute('inert');
      if (o.hard) setStage('leave', .5, 'A real no: leave well', 'front'); else { scene.setGuard(.25); setGuardUI(.25); }
    });
    document.getElementById('obj-say').addEventListener('click', function () { var was = S.voice; S.voice = true; Voice.speak(spoken(o.them)); S.voice = was; });
  }

  /* ----- delivery ----- */
  var D = { cue: 0, raf: 0, pace: 0, t0: 0, running: false, wpm: null };
  function stopOpener() { if (D.raf) cancelAnimationFrame(D.raf); D.raf = 0; }
  function paceLines() {
    return [
      ['Who you are', C.strategies[S.strategy].bridge],
      ['The quick price', C.beats[3].lines[0].t + ' ' + C.beats[3].lines[1].t],
      ['The parts', '{stackLine} {why}'],
      ['The price', C.beats[8].lines[0].t + ' ' + C.beats[8].lines[1].t + ' ' + C.beats[8].lines[3].t],
      ['"Let me think about it"', sayOf(C.objections.filter(function (o) { return o.id === 'think'; })[0])]
    ];
  }
  views.delivery = function () {
    D.cue = Math.floor(Math.random() * C.cues.length);
    var R = 2 * Math.PI * 54;
    return practiceNav() + '<header class="stack"><p class="eyebrow">Delivery</p><h2>The coach\'s most repeated note is "slow down"</h2>' +
      '<p class="lede">Two drills for the two things the words cannot fix: the first seven seconds, and your pace.</p></header>' +
      '<div class="two"><section class="panel stack"><h3>Seven seconds of being a person</h3>' +
      '<p class="muted">You get a doorstep. Start the clock and open on what you see. Nothing about Stride until the ring turns green.</p>' +
      '<div class="well cue-card"><span class="eyebrow">What you see</span><q id="cue">' + esc(C.cues[D.cue]) + '</q></div>' +
      '<div class="ring-wrap" id="ring"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="54" stroke-dasharray="' + R.toFixed(1) + '" stroke-dashoffset="' + R.toFixed(1) + '"/></svg>' +
      '<div class="ring-center"><b id="ring-n">7</b><span id="ring-t">Be a person</span></div></div>' +
      '<div class="row" style="justify-content:center"><button type="button" class="btn" id="op-go">Start the clock</button><button type="button" class="btn ghost" id="op-new">' + ico('redo') + 'New doorstep</button></div>' +
      '<p class="muted" style="text-align:center;font-size:.88rem" id="op-count">' + (P.opener ? P.opener + ' openers practised' : 'Aim for five different doorsteps') + '</p></section>' +
      '<section class="panel stack"><h3>Pace check</h3><p class="muted">Tap start, say the line the way you would on a doorstep, tap stop. Conversational is about 120 to 165 words a minute.</p>' +
      '<div class="chips" id="pace-pick">' + paceLines().map(function (p, i) { return '<button type="button" class="chip" data-pace="' + i + '" aria-pressed="' + (D.pace === i) + '">' + esc(p[0]) + '</button>'; }).join('') + '</div>' +
      '<div id="pace"></div></section></div>';
  };
  function paceRender() {
    var p = paceLines()[D.pace], n = words(p[1]), np = (fill(p[1]).match(/\/\//g) || []).length, lo = Math.round(n / 165 * 60), hi = Math.round(n / 120 * 60);
    var res = '';
    if (D.wpm) {
      var z = D.wpm > 165 ? ['bad', 'Rushing', 'Take every pause mark and let the line land before the next one.'] : D.wpm < 120 ? ['warn', 'Dragging a bit', 'Fine for a calm homeowner. Keep some energy in it.'] : ['good', 'Conversational', 'That is the pace. Now do it without reading.'];
      res = '<div class="gauge"><i style="left:' + Math.max(2, Math.min(98, (D.wpm - 80) / 160 * 100)) + '%"></i></div><div class="gauge-labels"><span>Slow</span><span>120 to 165</span><span>Rushing</span></div>' +
        '<p style="margin-top:12px"><span class="tag ' + z[0] + '">' + D.wpm + ' words a minute · ' + z[1] + '</span></p><p class="muted" style="font-size:.92rem;margin-top:6px">' + z[2] + '</p>';
    }
    document.getElementById('pace').innerHTML = '<div class="stack"><p class="pace-line">' + fmt(p[1]) + '</p>' +
      '<p class="muted" style="font-size:.88rem">' + n + ' words, ' + np + (np === 1 ? ' pause' : ' pauses') + '. On a doorstep that is ' + lo + ' to ' + hi + ' seconds.</p>' +
      '<button type="button" class="btn big' + (D.running ? ' ghost' : '') + '" id="pace-go">' + (D.running ? 'Stop' : D.wpm ? 'Go again' : 'Start') + '</button>' + res + '</div>';
    document.getElementById('pace-go').addEventListener('click', function () {
      if (!D.running) { D.running = true; D.wpm = null; D.t0 = Date.now(); }
      else { D.running = false; D.wpm = Math.round(n / Math.max((Date.now() - D.t0) / 60000, .001)); mark('delivery'); }
      paceRender();
    });
  }
  after.delivery = function () {
    D.running = false; D.wpm = null; paceRender();
    var R = 2 * Math.PI * 54, fg = document.getElementById('ring-fg'), nEl = document.getElementById('ring-n'), tEl = document.getElementById('ring-t'), ring = document.getElementById('ring');
    function reset() { stopOpener(); fg.style.strokeDashoffset = R; nEl.textContent = '7'; tEl.textContent = 'Be a person'; ring.classList.remove('phase2'); document.getElementById('op-go').textContent = 'Start the clock'; }
    document.getElementById('op-new').addEventListener('click', function () {
      D.cue = (D.cue + 1 + Math.floor(Math.random() * (C.cues.length - 1))) % C.cues.length;
      document.getElementById('cue').textContent = C.cues[D.cue]; reset();
    });
    document.getElementById('op-go').addEventListener('click', function () {
      if (D.raf) return reset();
      var t0 = performance.now();
      document.getElementById('op-go').textContent = 'Reset';
      (function tick(now) {
        var s = (now - t0) / 1000;
        if (s < 7) { fg.style.strokeDashoffset = R * (1 - s / 7); nEl.textContent = Math.ceil(7 - s); tEl.textContent = 'Be a person'; }
        else if (s < 15) { ring.classList.add('phase2'); fg.style.strokeDashoffset = R * (1 - (s - 7) / 8); nEl.textContent = Math.ceil(15 - s); tEl.textContent = 'Now: who you are, as a question'; }
        else { P.opener++; mark('delivery'); nEl.textContent = '✓'; tEl.textContent = 'Then: two steps'; document.getElementById('op-count').textContent = P.opener + ' openers practised'; D.raf = 0; document.getElementById('op-go').textContent = 'Again'; return; }
        D.raf = requestAnimationFrame(tick);
      })(t0);
    });
  };

  /* ----- film room ----- */
  views.film = function () {
    return '<header class="stack"><p class="eyebrow">Film room</p><h1 style="font-size:clamp(1.9rem,1.3rem + 2.4vw,2.9rem)">What the coach saw at each door</h1>' +
      '<p class="lede">Sixteen doors from three sessions. For each one: what worked, what it cost, and the fix he gave.</p></header>' +
      '<section class="stack"><div class="stack" style="gap:6px"><h2>How he handles a no</h2><p class="lede">Watch any of his doors and it is the same steps each time. Before the price he goes past the objection. After the price he guides them to a decision.</p></div>' +
      '<div class="two">' + processHTML('front') + processHTML('back') + '</div></section>' +
      '<section class="stack"><h2>His ten rules</h2><ol class="rules">' + C.rules.map(function (r) { return '<li><div><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></div></li>'; }).join('') + '</ol></section>' +
      C.film.map(function (f) {
        return '<section class="stack"><div><h2>' + esc(f.title) + '</h2><p class="muted">' + esc(f.sub) + '</p></div><div class="reel">' + f.reps.map(function (r) {
          return '<article class="clip"><div class="clip-head"><h3>' + esc(r.who) + '</h3><span class="tag ' + (r.win ? 'good' : '') + '">' + esc(r.result) + '</span></div>' +
            '<blockquote>' + esc(r.line) + '</blockquote><ul class="marks">' +
            r.good.map(function (g) { return '<li class="g">' + ico('check') + '<span>' + esc(g) + '</span></li>'; }).join('') +
            r.cost.map(function (g) { return '<li class="c">' + ico('alert') + '<span>' + esc(g) + '</span></li>'; }).join('') +
            '</ul><p class="fix"><b>The coach</b>' + esc(r.fix) + '</p></article>';
        }).join('') + '</div></section>';
      }).join('');
  };

  /* ---------------- sheets ---------------- */
  function sheet(title, body, foot) {
    var d = document.getElementById('sheet');
    d.innerHTML = '<div class="sheet-head"><h2 id="sheet-title" style="font-size:1.4rem">' + title + '</h2><button type="button" class="x" data-close="1" aria-label="Close">' + ico('x') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div>' + (foot ? '<div class="sheet-foot">' + foot + '</div>' : '');
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  }
  function closeSheet() { var d = document.getElementById('sheet'); if (d.open && d.close) d.close(); else d.removeAttribute('open'); }
  function openSetup() {
    var pr = prices(S.service), er = earliestRun();
    function f(id, label, val, extra) { return '<div class="field"><label for="f-' + id + '">' + label + '</label><input id="f-' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || '') + '></div>'; }
    sheet('Your street', '<form id="setup-form" class="stack">' +
      '<div class="fields-2">' + f('me', 'Your first name', S.me, 'autocomplete="given-name"') + f('street', 'Street you are knocking', S.street) + '</div>' +
      f('neighbour', 'Booked neighbour (job on the street)', S.neighbour, 'placeholder="the Hendersons at number 14"') +
      '<div class="field"><label for="f-runDay">Run day, as you would say it</label><input id="f-runDay" name="runDay" value="' + esc(S.runDay) + '" placeholder="' + esc(spokenDay(er)) + '">' +
      '<small>If you knock today, the earliest day you can do the work is ' + esc(er.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })) + ': ten business days of cooling-off first. Public holidays push it later. Leave blank to use that date.</small></div>' +
      '<div class="field"><label>Prices for ' + esc(C.services[S.service].label.toLowerCase()) + '</label><div class="fields-3">' +
      '<div class="field"><input id="f-callout" name="callout" inputmode="numeric" value="' + pr.callout + '" aria-label="One-off call-out price"><small>One-off price</small></div>' +
      '<div class="field"><input id="f-saving" name="saving" inputmode="numeric" value="' + pr.saving + '" aria-label="Street-run saving"><small>Off on the run</small></div>' +
      '<div class="field"><input id="f-drop" name="drop" inputmode="numeric" value="' + S.drop + '" aria-label="Extra you can drop with a reason"><small>Extra, with a reason</small></div></div>' +
      '<small>Use the price you really charge for a one-off. The saving has to be real.</small></div></form>',
      '<button type="button" class="btn big" id="setup-save">Save</button>');
    document.getElementById('setup-save').addEventListener('click', function () {
      var fd = new FormData(document.getElementById('setup-form'));
      ['me', 'street', 'neighbour', 'runDay'].forEach(function (k) { S[k] = String(fd.get(k) || '').trim(); });
      var c = parseInt(fd.get('callout'), 10), sv = parseInt(fd.get('saving'), 10), dr = parseInt(fd.get('drop'), 10);
      if (c > 0 && sv >= 0 && sv < c) S.prices[S.service] = { callout: c, saving: sv };
      if (dr >= 0) S.drop = dr;
      S.example = false; save(); closeSheet(); render(); toast('Saved');
    });
  }
  function openLaw() {
    sheet('Knocking in Queensland', '<p class="muted">' + esc(C.qld.intro) + '</p><ul class="law">' +
      C.qld.points.map(function (p) { return '<li><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="stack" style="gap:6px">' + C.qld.links.map(function (l) { return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a>'; }).join('') + '</div>');
  }

  function openProcess() {
    sheet('How he handles a no', '<p class="muted">He never argues an objection. Which ladder you use depends on one thing: is there a price on the table yet?</p>' + processHTML('front') + processHTML('back'));
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a');
    if (!t) { if (e.target.id === 'sheet') closeSheet(); return; }
    var d = t.dataset;
    if (d.close) return closeSheet();
    if (d.open === 'setup') return openSetup();
    if (d.open === 'law') return openLaw();
    if (d.open === 'process') return openProcess();
    if (t.id === 'pushback') { S.pushback = !S.pushback; save(); t.setAttribute('aria-pressed', S.pushback); RH.lines = rhLines(); return; }
    if (d.strategy) { S.strategy = d.strategy; save(); return render(); }
    if (d.service) { S.service = d.service; save(); return render(); }
    if (d.route) { location.hash = d.route; return; }
    if (d.go !== undefined) { var g = +d.go; if (g >= 0 && g < C.beats.length) { W.i = g; walkRender(); document.querySelector('.split-body').scrollIntoView({ block: 'nearest' }); } return; }
    if (d.way !== undefined) {
      var bid = d.beat || C.beats[W.i].id; S.ways[bid] = +d.way; save();
      if (route === 'walk') walkRender(); else { var y = window.scrollY; render(); window.scrollTo(0, y); }
      return;
    }
    if (d.level) { S.level = d.level; save(); if (d.again) { RH.lines = rhLines(); RH.hist = []; RH.fast = 0; RH.start = Date.now(); return rhStep(0); } return rhIntro(); }
    if (d.again) { RH.lines = rhLines(); RH.hist = []; RH.fast = 0; RH.start = Date.now(); return rhStep(0); }
    if (d.scn) return simStart(d.scn);
    if (d.simback) return simList();
    if (d.pick !== undefined) return simPick(+d.pick);
    if (d.ofilter) { O.filter = d.ofilter; O.order = objOrder(); O.i = 0; O.flipped = false; return objRender(); }
    if (d.rate !== undefined) {
      var o = O.order[O.i % O.order.length]; P.obj[o.id] = +d.rate;
      O.n = (O.n || 0) + 1; if (O.n >= 6) mark('obj'); else save();
      O.i++; O.flipped = false;
      if (O.i >= O.order.length) { O.order = objOrder(); O.i = 0; }
      return objRender();
    }
    if (d.pace !== undefined) { D.pace = +d.pace; D.running = false; D.wpm = null; document.querySelectorAll('[data-pace]').forEach(function (b) { b.setAttribute('aria-pressed', b === t); }); return paceRender(); }
    if (t.id === 'voice') { S.voice = !S.voice; save(); t.setAttribute('aria-pressed', S.voice); if (!S.voice) Voice.stop(); return; }
    if (t.id === 'sayfirst') { S.sayFirst = !S.sayFirst; save(); t.setAttribute('aria-pressed', S.sayFirst); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (document.getElementById('sheet').open || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (route === 'walk' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      var g = W.i + (e.key === 'ArrowRight' ? 1 : -1);
      if (g >= 0 && g < C.beats.length) { W.i = g; walkRender(); }
    }
    if (route === 'rehearse' && e.key === ' ' && e.target === document.body) {
      var b = document.getElementById('rh-next') || document.getElementById('rh-go');
      if (b) { e.preventDefault(); b.click(); }
    }
  });
  window.addEventListener('hashchange', render);

  shell(); render();
})();
