/* Stride Door Coach — interface. Renders every view into #app.
   Practise (home) · Process · Coach · Log, plus a full-screen focus mode for every drill. */
(function () {
  'use strict';
  var DC = window.DC, C = DC.content;
  var app = document.getElementById('app');
  var KEY = 'stride-door-coach-v2', MIN = 20, ELITE = 100;

  /* ---------------- storage ---------------- */
  function read(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  var saved = read(KEY);
  var S = Object.assign({
    me: 'Jake', street: 'Wattle Street', neighbour: 'the Hendersons at number 14', runDay: '',
    service: 'windows', strategy: 'anchor', prices: {}, drop: 30, voice: true, level: 'read', ways: {},
    sayFirst: true, pushback: true, sayStride: false, example: true
  }, saved.S || {});
  // one-off resets: an earlier version could leave you in cues-only, and added the business name to his script
  if (S.v !== 5) { if (S.v !== 4) S.level = 'read'; S.sayStride = false; S.v = 5; }
  if (!C.services[S.service]) S.service = 'windows';
  var L = saved.L || {};                                      // rep log: { 'YYYY-MM-DD': { n, by: { kind: n } } }
  var P = Object.assign({ obj: {}, sim: {} }, saved.P || {}); // ratings
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ S: S, L: L, P: P })); } catch (e) { /* private mode */ } }

  /* ---------------- the rep log ---------------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function ago(n) { var d = new Date(); d.setDate(d.getDate() - n); return d; }
  function repsOn(k) { return (L[k] && L[k].n) || 0; }
  function today() { return repsOn(dkey(new Date())); }
  var KINDS = [['door', 'Full door'], ['stage', 'One stage'], ['obj', 'Objections'], ['numbers', 'Numbers'], ['scenario', 'Real doors']];
  function addRep(kind, n) {
    n = n || 1;
    var k = dkey(new Date()), before = repsOn(k);
    if (!L[k]) L[k] = { n: 0, by: {} };
    L[k].n += n; L[k].by[kind] = (L[k].by[kind] || 0) + n;
    save(); focusCount(true);
    if (before < ELITE && L[k].n >= ELITE) toast(ELITE + ' reps. Elite day.');
    else if (before < MIN && L[k].n >= MIN) toast(MIN + ' reps. Minimum hit.');
  }
  function streak() {
    var n = 0, i = today() >= MIN ? 0 : 1;
    while (repsOn(dkey(ago(i))) >= MIN) { n++; i++; }
    return n;
  }
  function statusLine(n) {
    return n >= ELITE ? 'Elite day.' : n >= MIN ? 'Minimum hit. ' + (ELITE - n) + ' more for an elite day.' : (MIN - n) + ' more to hit today\'s minimum.';
  }
  function trackHTML(n) {
    return '<div><div class="track' + (n >= MIN ? ' min' : '') + '" role="img" aria-label="' + n + ' of ' + ELITE + ' reps"><i style="width:' + Math.min(100, n / ELITE * 100) + '%"></i><u></u></div>' +
      '<div class="track-l"><span>0</span><span>' + MIN + ' minimum</span><span>' + ELITE + ' elite</span></div></div>';
  }
  function daysHTML(count) {
    var out = '';
    for (var i = count - 1; i >= 0; i--) {
      var d = ago(i), v = repsOn(dkey(d));
      out += '<div class="day' + (v >= ELITE ? ' elite' : v >= MIN ? ' min' : v ? ' some' : '') + (i === 0 ? ' now' : '') + '"><span>' + d.toLocaleDateString('en-AU', { weekday: 'short' }).slice(0, 2) + '</span><b>' + v + '</b></div>';
    }
    return out;
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
    gutters: "that back corner up top I can't reach safely, so I've left it out.",
    roof: "there are a couple of cracked tiles up there. I'll photograph them for you, but they're a job for a roofer.",
    solar: "I can't tell you how much more power you'll get. It depends how dirty they were, so I won't put a number on it."
  };
  // objections a practice door can throw: ones he rolls past (front) and ones that end in a yes (back)
  var THROW = { front: ['guy', 'guy2', 'done', 'diy', 'busy', 'nothanks'], back: ['card', 'think', 'price', 'notnow', 'later'] };
  var LEVELS = [['read', 'Read it'], ['cue', 'Cues only'], ['blind', 'From memory']];
  function levelName() { return LEVELS.filter(function (l) { return l[0] === S.level; })[0][1]; }
  function prices(svc) {
    var d = C.services[svc], p = S.prices[svc] || {};
    var callout = +p.callout || d.callout, saving = +p.saving || d.saving;
    var price = callout - saving, deal = price - (+S.drop || 30);
    return { callout: callout, saving: saving, price: price, deal: deal, floor: deal - 20 };
  }
  function ctx(strategy, service) {
    var key = service || S.service, sv = C.services[key], st = C.strategies[strategy || S.strategy], pr = prices(key);
    var t = {
      me: S.me || 'Jake', street: S.street || 'your street', neighbour: S.neighbour || 'your neighbours',
      runDay: S.runDay || spokenDay(earliestRun()), partner: 'My offsider',
      callout: pr.callout, saving: pr.saving, price: pr.price, deal: pr.deal, floor: pr.floor,
      noun: sv.noun, short: sv.short, spot: sv.spot, show: sv.show, count: sv.count, countTip: sv.countTip,
      stackLine: sv.stackLine, why: sv.why, fiddly: sv.fiddly, whole: sv.whole, scope: sv.scope, diy: sv.diy,
      guy: sv.guy, link: sv.link, throwIn: sv.throwIn, honestLine: HONEST[key],
      reason: st.reason, reasonLong: st.reasonLong, bridge: st.bridge,
      what: S.sayStride ? "We're from Stride // " + st.what : st.what.charAt(0).toUpperCase() + st.what.slice(1)
    };
    t.reasonCap = t.reason.charAt(0).toUpperCase() + t.reason.slice(1);
    return t;
  }
  function fill(s, strategy, service) {
    var t = ctx(strategy, service), out = String(s);
    for (var i = 0; i < 3; i++) out = out.replace(/\{(\w+)\}/g, function (m, k) { return t[k] !== undefined ? t[k] : m; });
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(s, strategy, service) { return esc(fill(s, strategy, service)).replace(/\s*\/\/\s*/g, ' <i class="pz" aria-hidden="true"></i> '); }
  function plain(s) { return fill(s).replace(/\s*\/\/\s*/g, ' … '); }
  function spoken(s, strategy) { return fill(s, strategy).replace(/\([^)]*\)\s*/g, '').replace(/\s*\/\/\s*/g, ', ').replace(/\$(\d+)/g, '$1 dollars').trim(); }
  function words(s) { return fill(s).replace(/\/\//g, ' ').split(/\s+/).filter(Boolean).length; }

  /* ---------------- icons ---------------- */
  var I = {
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18M14.5 12.5v.01"/>',
    process: '<path d="M5 6h14M5 12h14M5 18h8"/>',
    coach: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    log: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    gear: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    repeat: '<path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4"/>',
    shield: '<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z"/>',
    dollar: '<path d="M12 3v18M16.500 7.500c-.8-1.200-2.300-2-4.500-2-2.500 0-4 1.200-4 3s1.500 2.700 4 3.200 4.500 1.300 4.500 3.300-1.800 3.200-4.500 3.200c-2.300 0-4-.9-4.800-2.200"/>',
    house: '<path d="M4 11 12 4l8 7M6 10v10h12V10M10 20v-6h4v6"/>',
    check: '<path d="m5 12.500 4.500 4.500L19 7.500"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    alert: '<path d="M12 4 2.500 20h19zM12 10v5M12 17.500v.01"/>',
    sound: '<path d="M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.500-5.800M4 4v5h5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n].replace(/(\.\d)00/g, '$1') + '</svg>'; }
  var MARK = '<svg viewBox="0 0 512 512" aria-hidden="true"><path fill="#fff" d="M356.27,162.22 L300.2,181.52 C296.82,165.08 280.95,155.73 263.29,159.76 C245.63,163.8 231.77,179.94 231.05,197.31 C230.33,214.69 242.97,227.79 260.47,227.79 C306.59,227.79 339.93,262.33 338.03,308.14 C336.12,353.94 299.59,396.5 253.02,407.14 C206.46,417.77 164.64,393.12 155.73,349.78 L211.8,330.48 C215.18,346.92 231.05,356.27 248.71,352.24 C266.37,348.2 280.23,332.06 280.95,314.69 C281.67,297.31 269.03,284.21 251.53,284.21 C205.41,284.21 172.07,249.67 173.97,203.86 C175.88,158.06 212.41,115.5 258.98,104.86 C305.54,94.23 347.36,118.88 356.27,162.22 Z"/></svg>';

  /* ---------------- voice (the homeowner speaks) ---------------- */
  var Voice = { tts: null };
  if (window.claude && typeof window.claude.use === 'function') {
    try { window.claude.use('tts').then(function (t) { Voice.tts = t; }).catch(function () {}); } catch (e) { /* no viewer */ }
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  Voice.stop = function () {
    try { if (Voice.tts) Voice.tts.stop().catch(function () {}); else if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  };
  Voice.speak = function (text, force) {
    var fallbackMs = 600 + text.length * 45;
    if (!text) return wait(1400);
    if (!S.voice && !force) return wait(fallbackMs);
    if (Voice.tts) return Promise.race([Voice.tts.speak(text, { voice: 'rounded' }).catch(function () { return wait(fallbackMs); }), wait(fallbackMs + 9000)]);
    var ss = window.speechSynthesis;
    if (!ss || typeof window.SpeechSynthesisUtterance !== 'function') return wait(fallbackMs);
    return Promise.race([new Promise(function (res) {
      try {
        ss.cancel();
        var u = new window.SpeechSynthesisUtterance(text);
        var vs = ss.getVoices().filter(function (v) { return /en[-_]AU/i.test(v.lang); });
        if (vs[0]) u.voice = vs[0];
        u.lang = 'en-AU'; u.onend = res; u.onerror = res; ss.speak(u);
      } catch (e) { res(); }
    }), wait(fallbackMs + 4000)]);
  };

  /* ---------------- hold a line to see why it is there ---------------- */
  var hintEl = null, holdT = 0, heldEl = null;
  function hideHint() {
    clearTimeout(holdT);
    if (hintEl) { hintEl.remove(); hintEl = null; }
    if (heldEl) { heldEl.classList.remove('held'); heldEl = null; }
  }
  function showHint(el) {
    hideHint();
    heldEl = el; el.classList.add('held');
    hintEl = document.createElement('div'); hintEl.className = 'hint' + (el.closest('.focus') ? ' inv' : ''); hintEl.setAttribute('role', 'tooltip');
    hintEl.innerHTML = '<b>Why</b>' + esc(el.dataset.note);
    // a modal sheet is in the top layer, so the hint has to live inside it to be seen
    var host = el.closest('dialog') || document.body;
    host.appendChild(hintEl);
    var r = el.getBoundingClientRect(), h = hintEl.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var left = Math.max(12, Math.min(r.left + 8, vw - h.width - 12)), top = r.top - h.height - 10;
    if (top < 66) top = Math.min(r.bottom + 10, window.innerHeight - h.height - 12);
    hintEl.style.left = left + 'px'; hintEl.style.top = top + 'px';
  }
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest && e.target.closest('.has-note');
    hideHint();
    if (el) holdT = setTimeout(function () { showHint(el); }, 170);
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) { document.addEventListener(ev, hideHint); });
  window.addEventListener('scroll', hideHint, true);
  document.addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('.has-note')) e.preventDefault(); });
  document.addEventListener('focusout', function (e) { if (e.target === heldEl) hideHint(); });

  /* ---------------- shared pieces ---------------- */
  function stepInfo(k) {
    if (k === 'out' || k === 'big') return { n: k === 'out' ? '✓' : '!', name: C.process[k].name, side: 'out', what: k === 'out' ? 'A real no. Thank them, get the name, and go.' : 'A buying question. Answer it big and never say "just".' };
    var side = k.charAt(0) === 'f' ? 'front' : 'back', i = +k.slice(1), st = C.process[side].steps[i - 1];
    return { n: i, name: st.name, side: side, what: st.what };
  }
  function litOf(lines) { var o = {}; lines.forEach(function (l) { var k = l.step || l[0]; if (k) o[k] = true; }); return o; }
  function ladderHTML(side, lit, compact) {
    var p = C.process[side];
    return '<ol class="ladder ' + side + (compact ? ' compact' : '') + '" aria-label="' + esc(p.title) + '">' + p.steps.map(function (st, i) {
      return '<li class="' + (lit && lit[st.k] ? 'on' : '') + '"><b>' + (i + 1) + '</b><span>' + esc(st.name) + '</span></li>';
    }).join('') + '</ol>';
  }
  function processHTML(side, lit) {
    var p = C.process[side];
    return '<section class="proc ' + side + '"><header><span class="tag ' + (side === 'front' ? 'blue' : 'good') + '">' + esc(p.when) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.line) + '</p></header>' +
      '<ol class="proc-steps">' + p.steps.map(function (st, i) {
        return '<li class="' + (lit && !lit[st.k] ? 'dim' : '') + '"><b>' + (i + 1) + '</b><div><strong>' + esc(st.name) + '</strong><span>' + esc(st.what) + '</span><em>' + esc(st.ex) + '</em></div></li>';
      }).join('') + '</ol><p class="proc-out">' + esc(p.out) + '</p></section>';
  }
  function patternHTML() {
    return '<div class="pat"><div class="pat-head"><span>They expect a salesman to</span><span>So he does this</span></div><ol>' + C.patterns.map(function (p) {
      return '<li><span class="exp">' + esc(p[0]) + '</span><span class="does">' + esc(p[1]) + '</span></li>';
    }).join('') + '</ol></div>';
  }
  function noteOf(l, fallback) { return l.n || (l.step ? stepInfo(l.step).what : fallback) || ''; }
  function labelOf(l) {
    if (l.step) { var s = stepInfo(l.step); return '<b>' + s.n + '</b>' + esc(s.name); }
    return l.who === 'you' ? 'You' : l.who === 'them' ? 'Them' : 'Do';
  }
  function noteAttr(note, o) { o = o || {}; return note ? ' has-note" tabindex="0" data-note="' + esc(fill(note, o.strategy, o.service)) : ''; }
  // one line of the script; lines with a note can be held to see why
  function row(l, o) {
    o = o || {};
    var cls = 'ln ' + l.who + (l.silent ? ' silent' : '');
    if (l.step) cls += ' ' + stepInfo(l.step).side + '-step';
    return '<div class="' + cls + noteAttr(o.noNote ? '' : noteOf(l), o) + '"><span class="sp">' + labelOf(l) + '</span><div class="tx"><p>' + fmt(l.t, o.strategy, o.service) + '</p>' + (l.do ? '<p class="do">' + fmt(l.do, o.strategy, o.service) + '</p>' : '') + '</div></div>';
  }
  function scriptHTML(lines, o) { return '<div class="script">' + lines.map(function (l) { return row(l, o); }).join('') + '</div>'; }
  function waysFor(b) { return (b.ways || []).filter(function (w) { return !w.only || w.only === S.strategy; }); }
  function wayIndex(b) { var i = S.ways[b.id]; return (i >= 0 && i < waysFor(b).length) ? i : -1; }
  function beatLines(b) { var i = wayIndex(b); return i < 0 ? b.lines : waysFor(b)[i].lines; }
  function beatById(id) { return C.beats.filter(function (b) { return b.id === id; })[0]; }
  function halfName(h) { return h === 'front' ? 'Front half' : h === 'back' ? 'Back half' : 'The count'; }
  function speaks(b) { return b.lines.some(function (l) { return l.who === 'you'; }); }
  function doorBeats() { return C.beats.filter(function (b) { return b.id !== 'leave' && (S.pushback || !b.process); }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    (document.querySelector('dialog[open]') || document.body).appendChild(t); setTimeout(function () { t.remove(); }, 2400);
  }
  function copyText(txt, okMsg) {
    var ok = function () { toast(okMsg); }, no = function () { toast('Copy is blocked here.'); };
    try { navigator.clipboard.writeText(txt).then(ok, no); } catch (e) { no(); }
  }
  function strategySeg() {
    return '<div class="seg" role="group" aria-label="Strategy">' + Object.keys(C.strategies).map(function (k) {
      return '<button type="button" data-strategy="' + k + '" aria-pressed="' + (S.strategy === k) + '">' + C.strategies[k].label + '</button>';
    }).join('') + '</div>';
  }
  function levelSeg() {
    return '<div class="seg" role="group" aria-label="How much of each line you see">' + LEVELS.map(function (l) {
      return '<button type="button" data-level="' + l[0] + '" aria-pressed="' + (S.level === l[0]) + '">' + l[1] + '</button>';
    }).join('') + '</div>';
  }
  function surfacePicks() {
    return '<div class="picks" role="group" aria-label="Surface">' + Object.keys(C.services).map(function (k) {
      var s = C.services[k];
      return '<button type="button" class="pick" data-service="' + k + '" aria-pressed="' + (S.service === k) + '"><h3>' + esc(s.label) + '</h3><p>' + esc(s.see) + '</p></button>';
    }).join('') + '</div>';
  }
  function toggleHTML(id, on, label) { return '<button type="button" class="toggle" id="' + id + '" aria-pressed="' + !!on + '"><span>' + label + '</span><i></i></button>'; }

  /* ---------------- shell and routing ---------------- */
  var views = {}, after = {}, route = 'practise', OPEN = 'hello';
  var TABS = [['practise', 'Practise', 'door'], ['process', 'Process', 'process'], ['coach', 'Coach', 'coach'], ['log', 'Log', 'log']];
  var LEGACY = { today: 'practise', drill: 'practise', walk: 'process', script: 'process', film: 'coach', rehearse: 'practise', sim: 'practise', objections: 'practise', delivery: 'practise', practice: 'practise' };
  var FOCUS = null;
  function shell() {
    app.innerHTML = '<div class="shell"><header class="top"><div class="top-in">' +
      '<a class="brand" href="#practise"><span class="brand-mark">' + MARK + '</span><span>Door Coach</span></a>' +
      '<nav class="nav" aria-label="Sections">' + TABS.map(function (t) { return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + t[1] + '</a>'; }).join('') + '</nav>' +
      '<button type="button" class="icon-btn" data-open="settings" aria-label="Settings">' + ico('gear') + '</button>' +
      '</div></header><main class="main" id="main"></main>' +
      '<nav class="tabbar" aria-label="Sections"><div class="tabbar-in">' + TABS.map(function (t) {
        return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + ico(t[2]) + '<span>' + t[1] + '</span></a>';
      }).join('') + '</div></nav></div><div class="focus" id="focus" hidden></div><dialog class="sheet" id="sheet" aria-labelledby="sheet-title"></dialog>';
    FOCUS = document.getElementById('focus');
  }
  function render(keepScroll) {
    hideHint();
    var h = (location.hash || '#practise').slice(1);
    h = LEGACY[h] || h;
    route = views[h] ? h : 'practise';
    var y = window.scrollY;
    document.getElementById('main').innerHTML = '<div class="view" data-view="' + route + '">' + views[route]() + '</div>';
    document.querySelectorAll('[data-tab]').forEach(function (a) {
      if (a.dataset.tab === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (after[route]) after[route]();
    window.scrollTo(0, keepScroll ? y : 0);
  }

  /* ---------------- practise: the tally and the one action ---------------- */
  views.practise = function () {
    var n = today(), now = new Date(), all = 0, s = streak();
    Object.keys(L).forEach(function (x) { all += L[x].n; });
    var tier = n >= ELITE ? '<span class="tag good">Elite day</span>' : n >= MIN ? '<span class="tag good">Minimum hit</span>' : '';
    var tiles = [
      ['stage', 'repeat', 'One stage', 'Say one stage until it is automatic'],
      ['obj', 'shield', 'Objections', 'He never argues one. Learn how'],
      ['numbers', 'dollar', 'Numbers', 'Your prices, said cold'],
      ['scenario', 'house', 'Real doors', 'Five doors from his videos']
    ];
    return '<section class="board"><div class="board-top"><span>' + esc(now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })) + '</span>' + tier + '</div>' +
      '<div class="board-n"><b>' + n + '</b><span>reps today</span></div>' + trackHTML(n) +
      '<p class="board-s">' + statusLine(n) + '</p>' +
      '<button type="button" class="btn light big" data-open="door">Practise a door' + ico('arrow') + '</button></section>' +
      (all ? '' : '<p class="card small"><b>Just starting?</b> Tap Practise a door, pick what the house needs, and read each line out loud. That is the whole job. Everything else is here when you want it.</p>') +
      '<section class="sec"><h4>Or drill one thing</h4><div class="tiles">' + tiles.map(function (t) {
        return '<button type="button" class="tile" data-mode="' + t[0] + '">' + ico(t[1]) + '<h3>' + t[2] + '</h3><p>' + t[3] + '</p></button>';
      }).join('') + '</div></section>' +
      '<section class="sec"><div class="row between"><h4>Last 7 days</h4><a class="link small" href="#log">Full log</a></div><div class="week">' + daysHTML(7) + '</div>' +
      '<p class="muted small">' + (s ? s + (s === 1 ? ' day' : ' days') + ' in a row at ' + MIN + ' or more.' : 'One rep is one stage or one objection said out loud. ' + MIN + ' a day is the minimum. ' + ELITE + ' is elite.') + '</p></section>';
  };

  /* ---------------- process: phases and tap-to-open stages ---------------- */
  views.process = function () {
    var num = {}; C.beats.forEach(function (b, i) { num[b.id] = i + 1; });
    var objectives = { front: 'Objective: get to the price. You are not selling the job yet.', count: 'Objective: a number, and the spot you will both stand at.', back: 'Objective: a decision today.' };
    function stage(b) {
      var open = OPEN === b.id, html = '<div class="st' + (open ? ' open' : '') + (b.process ? ' opt' : '') + '" id="s-' + b.id + '"><button type="button" class="st-h" data-stage="' + b.id + '" aria-expanded="' + open + '"><span class="n">' + num[b.id] + '</span><h3>' + esc(b.title) + '</h3>' + ico('chev') +
        '<p>' + (b.process ? 'Only if needed. ' : '') + esc(b.time) + '</p></button>';
      if (!open) return html + '</div>';
      var ws = waysFor(b), wi = wayIndex(b), lines = beatLines(b);
      return html + '<div class="st-b"><p class="kvl"><b>Objective</b>' + fmt(b.goal) + '</p><p class="kvl"><b>Done when</b>' + fmt(b.done) + '</p>' +
        (b.process ? processHTML(b.process, litOf(lines)) : '') +
        (ws.length ? '<div class="stack-s"><h4>Ways to say it</h4><div class="chips"><button type="button" class="chip" data-way="-1" data-beat="' + b.id + '" aria-pressed="' + (wi < 0) + '">The standard</button>' +
          ws.map(function (w, k) { return '<button type="button" class="chip" data-way="' + k + '" data-beat="' + b.id + '" aria-pressed="' + (wi === k) + '">' + esc(w.name) + '</button>'; }).join('') + '</div>' +
          (wi >= 0 ? '<p class="way-note"><b>' + esc(ws[wi].by) + '.</b> ' + fmt(ws[wi].note) + '</p>' : '') + '</div>' : '') +
        scriptHTML(lines) + '<p class="kvl"><b>Body</b>' + fmt(b.move) + '</p>' +
        (b.pattern ? '<details class="more"><summary>The pattern he is breaking</summary><div class="in">' + patternHTML() + '</div></details>' : '') +
        '<details class="more"><summary>Why, and the mistake to avoid</summary><div class="in"><div><h4>Why it works</h4><p>' + fmt(b.why + (b.strategyNote ? ' ' + C.strategies[S.strategy].coach : '')) + '</p></div>' +
        '<div><h4>The mistake</h4><p>' + fmt(b.trap) + '</p><cite>' + esc(b.who) + '</cite></div></div></details>' +
        (speaks(b) ? '<div class="row"><button type="button" class="btn sm" data-run="stage" data-beat="' + b.id + '">' + ico('repeat') + 'Drill this stage</button></div>' : '') + '</div></div>';
    }
    return '<header class="sec"><h1>The sales process</h1><p class="lede">' + C.beats.length + ' stages in three phases. Each has one objective and a clear point where it is done. Tap a stage to open it, and hold any of your lines to see why it is there.</p>' +
      '<div class="row"><button type="button" class="ctx" data-open="settings">' + ico('gear') + esc(C.services[S.service].label) + ' · ' + esc(C.strategies[S.strategy].label) + '</button></div></header>' +
      ['front', 'count', 'back'].map(function (h) {
        return '<section class="sec"><div class="phase-h"><h2>' + halfName(h) + '</h2><p>' + objectives[h] + '</p></div><div class="list">' + C.beats.filter(function (b) { return b.half === h; }).map(stage).join('') + '</div></section>';
      }).join('') +
      '<div class="row"><button type="button" class="btn ghost sm" id="copy">' + ico('copy') + 'Copy the whole script</button></div>';
  };
  after.process = function () {
    document.getElementById('copy').addEventListener('click', function () {
      copyText(C.beats.map(function (b, i) {
        return (i + 1) + '. ' + b.title.toUpperCase() + '\n' + beatLines(b).map(function (l) {
          return (l.who === 'you' ? 'You: ' : l.who === 'them' ? (l.silent ? 'Them: [' : 'Them: ') : '[') + plain(l.t) + (l.who === 'move' || l.silent ? ']' : '');
        }).join('\n');
      }).join('\n\n'), 'Script copied');
    });
  };

  /* ---------------- coach: what the method is built from ---------------- */
  views.coach = function () {
    var secs = [['c-pattern', 'The pattern'], ['c-no', 'Handling a no'], ['c-rules', 'Ten rules'], ['c-surfaces', 'Every surface'], ['c-doors', 'The doors']];
    return '<header class="sec"><h1>What the coach teaches</h1><p class="lede">Everything here comes from three of his videos: three doors broken down, an afternoon knocking with Drew, and live training with Gabe.</p></header>' +
      '<div class="jump">' + secs.map(function (s) { return '<button type="button" data-jump="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<section class="sec anchor" id="c-pattern"><h2>The pattern he breaks</h2><p class="lede">A homeowner has a script for salespeople, and "not interested" is the end of it. Anything they expect a salesman to say or do, he replaces.</p>' + patternHTML() + '</section>' +
      '<section class="sec anchor" id="c-no"><h2>How he handles a no</h2><p class="lede">The same steps at every door. Before the price he goes past the objection. After the price he guides them to a decision.</p><div class="two">' + processHTML('front') + processHTML('back') + '</div></section>' +
      '<section class="sec anchor" id="c-rules"><h2>His ten rules</h2><ol class="rules list">' + C.rules.map(function (r) { return '<li><div><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></div></li>'; }).join('') + '</ol></section>' +
      '<section class="sec anchor" id="c-surfaces"><h2>Same process, every surface</h2><p class="lede">He only sells windows. For Stride the stages stay the same and three things change: where you stand, what you name, and why half a job is not enough.</p>' +
      '<div class="table-wrap"><table><thead><tr><th>Lead with</th><th>Stand at</th><th>Name the parts</th><th>Why the lot</th><th>Say before the price</th></tr></thead><tbody>' +
      Object.keys(C.services).map(function (k) {
        var s = C.services[k];
        return '<tr class="' + (k === S.service ? 'on' : '') + '"><td>' + s.label + '</td><td>' + esc(s.spot.charAt(0).toUpperCase() + s.spot.slice(1)) + '</td><td>' + s.stack.map(esc).join('<br>') + '</td><td>' + esc(s.why) + '</td><td>' + esc(s.honest) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>' +
      '<div class="anchor" id="c-doors"></div>' + C.film.map(function (f) {
        return '<section class="sec"><div class="phase-h"><h2>' + esc(f.title) + '</h2><p>' + esc(f.sub) + '</p></div><div class="list">' + f.reps.map(function (r) {
          return '<article class="clip"><div class="clip-head"><h3>' + esc(r.who) + '</h3><span class="tag ' + (r.win ? 'good' : '') + '">' + esc(r.result) + '</span></div>' +
            '<blockquote>' + esc(r.line) + '</blockquote><ul class="marks">' +
            r.good.map(function (g) { return '<li class="g">' + ico('check') + '<span>' + esc(g) + '</span></li>'; }).join('') +
            r.cost.map(function (g) { return '<li class="c">' + ico('alert') + '<span>' + esc(g) + '</span></li>'; }).join('') +
            '</ul><p class="fix"><b>The coach</b>' + esc(r.fix) + '</p></article>';
        }).join('') + '</div></section>';
      }).join('');
  };

  /* ---------------- log ---------------- */
  views.log = function () {
    var n = today(), k = dkey(new Date()), by = (L[k] && L[k].by) || {}, week = 0, best = 0, all = 0;
    for (var i = 0; i < 7; i++) week += repsOn(dkey(ago(i)));
    Object.keys(L).forEach(function (x) { all += L[x].n; if (L[x].n > best) best = L[x].n; });
    return '<header class="sec"><h1>Rep log</h1><p class="lede">One rep is one stage of the door, or one objection, said out loud start to finish. ' + MIN + ' a day keeps it sharp. ' + ELITE + ' is how it becomes automatic and starts to sound like a conversation.</p></header>' +
      '<section class="sec"><h4>Last 14 days</h4><div class="week">' + daysHTML(14) + '</div></section>' +
      '<div class="stats"><div><b>' + n + '</b><span>today</span></div><div><b>' + streak() + '</b><span>days in a row at ' + MIN + '+</span></div><div><b>' + week + '</b><span>last 7 days</span></div><div><b>' + best + '</b><span>best day</span></div></div>' +
      '<section class="sec"><h4>Today, by drill</h4><dl class="kv list">' + KINDS.map(function (x) { return '<dt>' + x[1] + '</dt><dd>' + (by[x[0]] || 0) + '</dd>'; }).join('') + '<dt>All time</dt><dd>' + all + '</dd></dl></section>' +
      '<div class="row"><button type="button" class="btn ghost sm" id="copylog">' + ico('copy') + 'Copy my log</button></div>' +
      '<p class="muted small">The log is kept on this device. Copy it to send your numbers to someone else.</p>';
  };
  after.log = function () {
    document.getElementById('copylog').addEventListener('click', function () {
      copyText('Stride Door Coach, reps per day\n' + Object.keys(L).sort().map(function (k) {
        return k + ', ' + L[k].n + ' (' + KINDS.filter(function (x) { return L[k].by[x[0]]; }).map(function (x) { return x[1] + ' ' + L[k].by[x[0]]; }).join(', ') + ')';
      }).join('\n'), 'Log copied');
    });
  };

  /* ---------------- focus mode: the frame every drill runs in ---------------- */
  var R = { seq: 0 }, O = { filter: 'all' }, N = {}, M = {};
  function focusCount(tick) {
    var el = document.getElementById('f-count');
    if (!el) return;
    var n = today();
    el.className = 'f-count' + (n >= MIN ? ' min' : '');
    el.innerHTML = '<b' + (tick ? ' class="tick"' : '') + '>' + n + '</b><span>of ' + (n >= MIN ? ELITE : MIN) + ' today</span>';
  }
  function focus(o) {
    hideHint();
    FOCUS.innerHTML = '<header class="f-top"><button type="button" class="f-x" data-fclose="1" aria-label="End practice">' + ico('x') + '</button>' +
      '<div class="f-meta"><b>' + o.name + '</b><span>' + (o.meta || '') + '</span></div><div class="f-count" id="f-count"></div></header>' +
      '<div class="f-bar"><i style="width:' + Math.round((o.pct || 0) * 100) + '%"></i></div>' +
      '<div class="f-body" id="f-body"><div class="f-inner">' + o.body + '</div></div><footer class="f-foot">' + (o.foot || '') + '</footer>';
    focusCount();
    if (FOCUS.hidden) { FOCUS.hidden = false; document.documentElement.classList.add('focus-open'); }
    var body = document.getElementById('f-body'); body.scrollTop = o.top ? 0 : body.scrollHeight;
  }
  function focusClose() {
    R.seq++; Voice.stop(); hideHint();
    FOCUS.hidden = true; FOCUS.innerHTML = ''; document.documentElement.classList.remove('focus-open');
    render(true);
  }

  /* --- full door, or one stage on repeat --- */
  // turn a random objection into script lines, so every door throws a different one
  function thrown(side) {
    var ids = THROW[side].filter(function (id) { return id !== R['last' + side]; });
    var id = ids[Math.floor(Math.random() * ids.length)], o = C.objections.filter(function (x) { return x.id === id; })[0];
    var out = [{ who: 'them', t: o.them }].concat(o.steps.map(function (st, k) {
      var ln = { who: 'you', step: st[0], t: st[1] };
      if (side === 'front' && k === o.steps.length - 1) ln.do = 'Nod and go before they answer.';
      return ln;
    }));
    if (side === 'back') out.push({ who: 'them', t: "All right. I'll go ahead and do it." });
    out.id = id;
    return out;
  }
  function startRun(kind, beatId) {
    closeSheet();
    var same = R.kind === 'stage' && kind === 'stage' && R.beatId === beatId;
    var beats = kind === 'door' ? doorBeats() : [beatById(beatId)], lines = [];
    beats.forEach(function (b, bi) {
      var src = b.process && wayIndex(b) < 0 ? thrown(b.process) : beatLines(b);
      if (src.id) R['last' + b.process] = src.id;
      src.forEach(function (l) { if (kind === 'door' && S.pushback && l.easy) return; lines.push({ b: b, l: l, bi: bi }); });
    });
    R = { seq: R.seq + 1, lastfront: R.lastfront, lastback: R.lastback, kind: kind, beatId: beatId, beats: beats, lines: lines, hist: [], counted: {}, end: 0, start: Date.now(), fast: 0, reps: 0,
      pass: same ? R.pass + 1 : 1, ms: 0, w: 0, cue: beatId === 'hello' ? C.cues[Math.floor(Math.random() * C.cues.length)] : '' };
    runStep(0);
  }
  function promptOf(l, b) {
    if (l.who !== 'you' || S.level === 'read') return fmt(l.t);
    if (S.level === 'cue') { if (l.step) return '<span class="dim">Your words for: ' + esc(stepInfo(l.step).name) + '</span>'; return esc(plain(l.t).split(/\s+/).slice(0, 3).join(' ')) + ' <span class="dim">…</span>'; }
    return '<span class="dim">' + esc(l.step ? stepInfo(l.step).name : b.title) + '</span>';
  }
  function prevHTML() {
    var rows = R.hist.filter(function (h) { return h.who !== 'move'; }).slice(-2);
    if (!rows.length) return '';
    return '<div class="pv">' + rows.map(function (h) {
      return '<p class="' + (h.silent ? 'q' : '') + '"><b>' + (h.who === 'you' ? 'You' : 'Them') + '</b>' + fmt(h.t) + (h.fast ? ' <span class="tag bad">Rushed</span>' : '') + '</p>';
    }).join('') + '</div>';
  }
  function runStep(i) {
    var seq = ++R.seq;
    if (i >= R.lines.length) return runDone();
    var x = R.lines[i], l = x.l, b = x.b, mine = l.who !== 'them', quiet = l.who === 'move' || l.silent;
    var note = noteOf(l, l.who === 'you' ? b.goal : '');
    var head = l.who === 'them' ? 'Homeowner' : l.who === 'move' ? 'Do this' : 'Your line';
    var hidden = l.who === 'you' && S.level !== 'read';
    var first = l.who === 'you' && !R.told; if (first) R.told = true;
    var lvl = S.level === 'read' ? '' : ' · ' + levelName().toLowerCase();
    focus({
      name: R.kind === 'door' ? esc(C.services[S.service].label) : 'One stage',
      meta: (R.kind === 'door' ? esc(b.title) + ' · ' + (x.bi + 1) + ' of ' + R.beats.length : esc(b.title) + ' · pass ' + R.pass) + lvl,
      pct: i / R.lines.length,
      body: (R.cue && i === 0 ? '<p class="f-well"><b>At this door:</b> ' + esc(R.cue.toLowerCase()) + '. React to it once, then carry on with the opener.</p>' : '') + prevHTML() +
        '<div class="f-now ' + (mine ? 'yours' : 'theirs') + (quiet ? ' quiet' : '') + '">' +
        (l.step && b.process ? ladderHTML(b.process, litOf([l]), true) : '<div class="f-label"><span>' + head + '</span>' +
          (l.who === 'them' && !l.silent && S.voice ? '<span class="speaking" aria-hidden="true"><i></i><i></i><i></i></span>' : '') + '</div>') +
        '<p id="f-line" class="f-line' + noteAttr(note) + '">' + promptOf(l, b) + '</p>' +
        (l.do ? '<p class="f-do"><b>Do</b>' + fmt(l.do) + '</p>' : '') +
        (l.silent ? '<p class="f-sub">Wait. Let them look.</p>' : first ? '<p class="f-sub">Hold any line to see why it is there.</p>' : '') + '</div>',
      foot: '<div class="go-row"><button type="button" class="btn ghost back" id="back" aria-label="Back one line"' + (prevMine(i) < 0 ? ' disabled' : '') + '>' + ico('back') + '</button>' +
        '<button type="button" class="btn big ' + (mine ? 'light' : 'ghost') + '" id="go">' + (l.who === 'them' ? 'Skip' : l.who === 'move' ? 'Done' : 'Said it') + '</button></div>' +
        (hidden ? '<button type="button" class="btn ghost" id="peek">Show me the line</button>' : '')
    });
    document.getElementById('back').addEventListener('click', function () { runBack(i); });
    var t0 = Date.now(), peek = document.getElementById('peek');
    if (peek) peek.addEventListener('click', function () { document.getElementById('f-line').innerHTML = fmt(l.t); peek.remove(); });
    var next = function () {
      if (seq !== R.seq) return;
      var rec = { who: l.who, t: l.t, silent: l.silent };
      if (l.who === 'you') {
        var n = words(l.t), ms = Date.now() - t0;
        if (ms > 600) { R.ms += ms; R.w += n; }
        if (n >= 7 && ms > 1200 && n / (ms / 60000) > 185) { R.fast++; rec.fast = true; }
      }
      R.hist.push(rec); Voice.stop();
      var last = i === R.lines.length - 1 || R.lines[i + 1].b !== b;
      if (last && speaks(b) && !R.counted[i]) { R.counted[i] = true; R.reps++; addRep(R.kind === 'door' ? 'door' : 'stage'); }
      runStep(i + 1);
    };
    document.getElementById('go').addEventListener('click', next);
    if (l.who === 'them') (l.silent ? wait(1900) : Voice.speak(spoken(l.t)).then(function () { return wait(350); })).then(next);
  }
  // the last line before i that is yours (homeowner lines play themselves, so going back to one would bounce you forward)
  function prevMine(i) { for (var j = i - 1; j >= 0; j--) if (R.lines[j].l.who !== 'them') return j; return -1; }
  function runBack(i) {
    var j = prevMine(i);
    if (j < 0) return;
    R.seq++; Voice.stop();
    R.hist.length = j;
    runStep(j);
  }
  // the whole door you just ran, objections included, to read back
  function runReview() {
    var out = '', last = null;
    R.lines.forEach(function (x) {
      if (x.b !== last) { if (last) out += '</div>'; out += '<h4 class="rv-h">' + esc(x.b.title) + '</h4><div class="script">'; last = x.b; }
      out += row(x.l);
    });
    focus({ name: R.kind === 'door' ? esc(C.services[S.service].label) : 'One stage', meta: 'The whole ' + (R.kind === 'door' ? 'door' : 'stage') + ', to read back', pct: 1, top: true,
      body: '<p class="f-sub">Hold any of your lines to see why it is there.</p>' + out + '</div>',
      foot: '<div class="pair"><button type="button" class="btn ghost" data-rvback="1">' + ico('back') + 'Results</button><button type="button" class="btn light" data-run="' + R.kind + '"' + (R.beatId ? ' data-beat="' + R.beatId + '"' : '') + '>' + ico('redo') + 'Again</button></div>' });
  }
  function paceTag(wpm) {
    return !wpm ? '' : wpm > 165 ? '<span class="tag bad">' + wpm + ' words a minute · rushing</span>' : wpm < 110 ? '<span class="tag warn">' + wpm + ' words a minute · slow</span>' : '<span class="tag good">' + wpm + ' words a minute · conversational</span>';
  }
  function runDone() {
    if (!R.end) R.end = Date.now();
    var secs = Math.round((R.end - R.start) / 1000), wpm = R.ms > 0 ? Math.round(R.w / (R.ms / 60000)) : 0;
    // the level never changes on its own: you choose it here, and Again repeats what you just did
    var level = '<div class="stack-s"><p class="f-sub">Next time, you see</p>' + levelSeg() + '</div>';
    if (R.kind === 'stage') {
      var list = C.beats.filter(speaks), nx = list[(list.indexOf(beatById(R.beatId)) + 1) % list.length];
      return focus({ name: 'One stage', meta: esc(beatById(R.beatId).title), pct: 1,
        body: '<div class="f-now"><div class="f-label"><span>Pass ' + R.pass + ' done</span></div><p class="f-big">' + esc(beatById(R.beatId).title) + '</p>' +
          '<div class="row">' + paceTag(wpm) + '<span class="tag">' + secs + ' seconds</span></div>' +
          '<p class="f-sub">' + (wpm > 165 ? 'Take every pause mark and let each line land before the next.' : 'Say it again. Change one word so it stays yours.') + '</p>' +
          '<button type="button" class="btn ghost sm" data-review="1">Read it back</button></div>' + level,
        foot: '<button type="button" class="btn big light" id="go" data-run="stage" data-beat="' + R.beatId + '">' + ico('redo') + 'Again</button><div class="pair">' +
          '<button type="button" class="btn ghost" data-run="stage" data-beat="' + nx.id + '">Next stage</button><button type="button" class="btn ghost" data-fclose="1">Done</button></div>' });
    }
    focus({ name: esc(C.services[S.service].label), meta: 'Door complete', pct: 1,
      body: '<div class="f-now"><div class="f-label"><span>Door complete</span></div><p class="f-n">' + R.reps + '<span class="f-sub" style="font-size:1rem;font-weight:700;letter-spacing:0"> reps</span></p>' +
        '<div class="row">' + paceTag(wpm) + '<span class="tag">' + Math.floor(secs / 60) + ':' + pad(secs % 60) + '</span>' + (R.fast ? '<span class="tag bad">' + R.fast + ' lines rushed</span>' : '') + '</div>' +
        '<ul class="checks"><li>' + ico('check') + '<span>Did the opener sound like a salesman, or like someone who popped over?</span></li>' +
        '<li>' + ico('check') + '<span>Did you wait through the silences, or fill them?</span></li><li>' + ico('check') + '<span>Did you stop talking after the price?</span></li></ul>' +
        '<button type="button" class="btn ghost sm" data-review="1">Read the whole door</button></div>' + level,
      foot: '<button type="button" class="btn big light" id="go" data-run="door">' + ico('redo') + 'Again</button>' +
        '<div class="pair"><button type="button" class="btn ghost" data-open="door">Another house</button><button type="button" class="btn ghost" data-fclose="1">Done</button></div>' });
  }

  /* --- objections --- */
  function objOrder() {
    var list = C.objections.filter(function (o) { return O.filter === 'all' || o.stage === O.filter; });
    var rank = function (o) { var r = P.obj[o.id]; return r === undefined ? -1 : r; };
    return shuffle(list).sort(function (a, b) { return rank(a) - rank(b); });
  }
  function objStart() { O.order = objOrder(); O.i = 0; O.shown = false; objRender(); }
  function objRender() {
    var o = O.order[O.i], side = o.stage;
    var seg = '<div class="seg" role="group" aria-label="Which objections">' + [['all', 'All'], ['front', 'Before the price'], ['back', 'After it']].map(function (f) {
      return '<button type="button" data-ofilter="' + f[0] + '" aria-pressed="' + (O.filter === f[0]) + '">' + f[1] + '</button>';
    }).join('') + '</div>';
    focus({ name: 'Objections', meta: (O.i + 1) + ' of ' + O.order.length + ' · ' + esc(C.process[side].when.toLowerCase()), pct: O.i / O.order.length, top: O.shown,
      body: (O.shown ? '' : seg) + '<div class="f-now ' + (O.shown ? '' : 'theirs') + '"><div class="f-label"><span>They say</span></div><p class="f-big">“' + fmt(o.them) + '”</p>' +
        (O.shown
          ? '<p class="f-sub"><b>What it means.</b> ' + esc(o.means) + '</p>' +
            scriptHTML(o.steps.map(function (s) { return { who: 'you', step: s[0], t: s[1] }; })) +
            '<details class="more"><summary>Why he handles it this way</summary><div class="in"><p>' + fmt(o.why) + '</p><cite>' + esc(o.by) + '</cite></div></details>'
          : (o.hard ? '<p class="f-sub">Is this one a smokescreen, or real? Say what you would do.</p>' : '<p class="f-sub">' + esc(C.process[side].line) + ' Answer out loud, one step at a time.</p>' + ladderHTML(side)) +
            '<div class="row"><button type="button" class="btn ghost sm" id="hear">' + ico('sound') + 'Hear it</button><button type="button" class="link small" data-open="process">See both processes</button></div>') +
        '</div>',
      foot: O.shown ? '<div class="trio' + (O.i ? ' with-back' : '') + '">' + (O.i ? '<button type="button" class="btn ghost back" data-oprev="1" aria-label="Previous objection">' + ico('back') + '</button>' : '') + '<button type="button" class="btn ghost" data-rate="0">Missed it</button><button type="button" class="btn ghost" data-rate="1">Close</button><button type="button" class="btn light" data-rate="2">Nailed it</button></div>'
        : '<div class="go-row">' + '<button type="button" class="btn ghost back" data-oprev="1" aria-label="Previous objection"' + (O.i ? '' : ' disabled') + '>' + ico('back') + '</button>' +
          '<button type="button" class="btn big light" id="go" data-oshow="1">I\'ve answered. Show his.</button></div>' });
    var hear = document.getElementById('hear');
    if (hear) hear.addEventListener('click', function () { Voice.speak(spoken(o.them), true); });
  }

  /* --- numbers --- */
  function numStart(prev) {
    var keys = Object.keys(C.services).filter(function (k) { return k !== prev; });
    N = { svc: keys[Math.floor(Math.random() * keys.length)], shown: false, count: N.count || 0 }; numRender();
  }
  function numRender() {
    var pr = prices(N.svc), sv = C.services[N.svc], o = { service: N.svc };
    focus({ name: 'Numbers', meta: esc(C.strategies[S.strategy].label) + (N.count ? ' · ' + N.count + ' done' : ''), pct: 0, top: N.shown,
      body: '<div class="f-now"><div class="f-label"><span>The price for</span></div><p class="f-big">' + esc(sv.label) + '</p>' +
        (N.shown
          ? '<div class="figs"><div><b>$' + pr.callout + '</b><span>One-off price</span></div><div><b>$' + pr.saving + '</b><span>Off on the run</span></div><div><b>$' + pr.price + '</b><span>Run price</span></div><div><b>$' + pr.deal + '</b><span>Lowest, with a reason</span></div></div>' +
            scriptHTML(beatById('price').lines.filter(function (l) { return l.who === 'you'; }), o)
          : '<p class="f-sub">Say the whole price line out loud: the one-off price, the reason it drops, the saving, the run price and the guarantee.</p>') + '</div>',
      foot: N.shown ? '<div class="pair"><button type="button" class="btn ghost" data-num="0">Missed one</button><button type="button" class="btn light" data-num="1">Had every number</button></div>'
        : '<button type="button" class="btn big light" id="go" data-nshow="1">I\'ve said it. Check.</button>' });
  }

  /* --- real doors --- */
  function simStart(id) {
    closeSheet();
    var s = C.scenarios.filter(function (x) { return x.id === id; })[0];
    M = { scn: s, i: 0, guard: s.guard, right: 0, strat: s.strategy === 'anchor' ? 'anchor' : undefined };
    simNode();
  }
  function simChoices() {
    var n = M.scn.nodes[M.i];
    return '<div class="choices">' + M.order.map(function (k) { return '<button type="button" class="choice" data-pick="' + k + '">' + fmt(n.choices[k].t, M.strat) + '</button>'; }).join('') + '</div>';
  }
  function simFrame(body, foot, top) {
    var s = M.scn;
    focus({ name: esc(s.title), meta: 'Moment ' + (M.i + 1) + ' of ' + s.nodes.length, pct: M.i / s.nodes.length, body: body, foot: foot, top: top });
  }
  function simNode() {
    var s = M.scn, n = s.nodes[M.i];
    if (s.independent) M.guard = s.guard;
    M.order = shuffle(n.choices.map(function (c, i) { return i; }));
    M.them = '<div class="f-now theirs"><div class="f-label"><span>Homeowner</span></div><p class="f-line">' + fmt(n.them, M.strat) + '</p></div>';
    if (S.sayFirst) simFrame(M.them + '<p class="f-sub">Say your reply out loud. Then see which option was closest.</p>', '<button type="button" class="btn big light" id="go" data-sshow="1">I\'ve said it</button>');
    else simFrame(M.them + simChoices(), '');
    Voice.speak(spoken(n.them, M.strat));
  }
  function simPick(k) {
    var s = M.scn, n = s.nodes[M.i], c = n.choices[k];
    Voice.stop(); addRep('scenario');
    if (c.v === 'best') M.right++;
    M.guard = Math.max(0, Math.min(100, M.guard + c.g));
    var kind = c.v === 'best' ? ['good', 'His move'] : c.v === 'ok' ? ['warn', 'It works, but'] : ['bad', 'That costs you'];
    var last = M.i === s.nodes.length - 1, shut = M.guard >= 100 && !s.independent;
    var picked = '<div class="choices">' + M.order.map(function (idx) {
      var cls = idx === k ? ' picked ' + c.v : n.choices[idx].v === 'best' ? ' reveal' : '';
      return '<button type="button" class="choice' + cls + '" disabled>' + fmt(n.choices[idx].t, M.strat) + '</button>';
    }).join('') + '</div>';
    simFrame(M.them + picked +
      '<div class="pv" style="opacity:1"><p class="' + (/^\([^)]*\)$/.test(c.reply) ? 'q' : '') + '"><b>Them</b>' + fmt(c.reply, M.strat) + '</p></div>' +
      '<div class="coach ' + kind[0] + '"><h4>' + kind[1] + ' · their guard ' + (c.g < 0 ? 'comes down' : c.g > 3 ? 'goes up' : 'stays put') + '</h4><p>' + fmt(c.c, M.strat) + '</p></div>' +
      (n.obj ? '<div class="stack-s"><p class="f-sub">That was an objection ' + (n.obj === 'front' ? 'before the price. He goes past it:' : 'after the price. He guides them through it:') + '</p>' + ladderHTML(n.obj) + '</div>' : ''),
      '<button type="button" class="btn big light" id="go" data-snext="' + (last || shut ? 'end' : 'next') + '" data-shut="' + (shut ? 1 : '') + '">' + (last || shut ? 'How it ended' : 'Next moment') + ico('arrow') + '</button>');
  }
  function simEnd(shut) {
    var s = M.scn, ratio = M.right / s.nodes.length;
    var kind = shut ? 'lose' : s.independent ? (ratio >= .8 ? 'win' : ratio >= .5 ? 'mid' : 'lose') : (M.guard <= s.win ? 'win' : M.guard >= 92 ? 'lose' : 'mid');
    var e = s.endings[kind];
    if (P.sim[s.id] === undefined || M.right > P.sim[s.id]) { P.sim[s.id] = M.right; save(); }
    focus({ name: esc(s.title), meta: 'How it ended', pct: 1,
      body: '<div class="f-now"><div class="row"><span class="tag ' + (kind === 'win' ? 'good' : kind === 'mid' ? 'warn' : 'bad') + '">' + fmt(e.title, M.strat) + '</span></div>' +
        '<p class="f-n">' + M.right + '<span class="f-sub" style="font-size:1rem;font-weight:700;letter-spacing:0"> of ' + s.nodes.length + ' were his move</span></p><p>' + fmt(e.text, M.strat) + '</p></div>',
      foot: '<button type="button" class="btn big light" id="go" data-scn="' + s.id + '">' + ico('redo') + 'Run it again</button><div class="pair"><button type="button" class="btn ghost" data-mode="scenario">Another door</button><button type="button" class="btn ghost" data-fclose="1">Done</button></div>' });
  }

  /* ---------------- sheets ---------------- */
  var SHEET = '';
  function sheet(kind, title, body, foot) {
    var d = document.getElementById('sheet'), y = d.open && SHEET === kind ? d.querySelector('.sheet-body').scrollTop : 0;
    SHEET = kind;
    d.innerHTML = '<div class="sheet-head"><h2 id="sheet-title">' + title + '</h2><button type="button" class="x" data-close="1" aria-label="Close">' + ico('x') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div>' + (foot ? '<div class="sheet-foot">' + foot + '</div>' : '');
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    d.querySelector('.sheet-body').scrollTop = y;
  }
  function closeSheet() { var d = document.getElementById('sheet'); if (!d) return; SHEET = ''; if (d.open && d.close) d.close(); else d.removeAttribute('open'); }
  function openDoor() {
    var n = doorBeats().filter(speaks).length;
    sheet('door', 'Practise a door', '<div class="sec"><h4>What does this house need?</h4>' + surfacePicks() + '</div>' +
      '<div class="sec"><h4>How much of each line you see</h4>' + levelSeg() + '</div>' +
      '<div class="list" style="padding:0 16px">' + toggleHTML('pushback', S.pushback, 'Throw an objection in each half') + '</div>',
      '<button type="button" class="btn big" data-run="door">Start · ' + n + ' reps</button>');
  }
  function openStages() {
    sheet('stages', 'Which stage?', ['front', 'back'].map(function (h) {
      return '<div class="sec"><h4>' + halfName(h) + '</h4><div class="list">' + C.beats.filter(function (b) { return b.half === h && speaks(b); }).map(function (b) {
        return '<button type="button" class="item" data-run="stage" data-beat="' + b.id + '"><h3>' + esc(b.title) + '</h3><p>' + (b.process ? 'A different objection every pass' : esc(b.time)) + '</p>' + ico('chev') + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '<div class="sec"><h4>How much of each line you see</h4>' + levelSeg() + '</div>');
  }
  function openDoors() {
    sheet('doors', 'Real doors', '<p class="lede">Say your reply out loud, then pick the option closest to it. He tells you what each one does to the homeowner\'s guard.</p><div class="list">' + C.scenarios.map(function (s) {
      var best = P.sim[s.id];
      return '<button type="button" class="item" data-scn="' + s.id + '"><h3>' + esc(s.title) + '</h3><p>' + esc(s.blurb) + (best !== undefined ? ' Best: ' + best + ' of ' + s.nodes.length + '.' : '') + '</p>' + ico('chev') + '</button>';
    }).join('') + '</div>');
  }
  function openSettings() {
    var pr = prices(S.service), er = earliestRun(), framed = false;
    try { framed = window.self !== window.top; } catch (e) { framed = true; }
    function f(id, label, val, extra) { return '<div class="field"><label for="f-' + id + '">' + label + '</label><input id="f-' + id + '" data-set="' + id + '" value="' + esc(val) + '" ' + (extra || '') + '></div>'; }
    sheet('settings', 'Settings', '<div class="sec"><h4>Surface you lead with</h4>' + surfacePicks() + '</div>' +
      '<div class="sec"><h4>Strategy</h4>' + strategySeg() + '<p class="muted small">' + esc(C.strategies[S.strategy].blurb) + '</p></div>' +
      '<div class="sec"><h4>Your details' + (S.example ? ' <span class="tag warn">Examples</span>' : '') + '</h4><div class="fields-2">' + f('me', 'First name', S.me, 'autocomplete="given-name"') + f('street', 'Street', S.street) + '</div>' +
      (S.strategy === 'anchor' ? f('neighbour', 'Booked neighbour', S.neighbour, 'placeholder="the Hendersons at number 14"') : '') +
      '<div class="field"><label for="f-runDay">Run day, as you would say it</label><input id="f-runDay" data-set="runDay" value="' + esc(S.runDay) + '" placeholder="' + esc(spokenDay(er)) + '">' +
      '<small>Knock today and the earliest you can do the work is ' + esc(er.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })) + ' (ten business days of cooling-off). Leave blank to use that.</small></div></div>' +
      '<div class="sec"><h4>Prices for ' + esc(C.services[S.service].label.toLowerCase()) + '</h4><div class="fields-3">' +
      '<div class="field"><input id="f-callout" data-set="callout" inputmode="numeric" value="' + pr.callout + '" aria-label="One-off price"><small>One-off</small></div>' +
      '<div class="field"><input id="f-saving" data-set="saving" inputmode="numeric" value="' + pr.saving + '" aria-label="Off on the run"><small>Off on the run</small></div>' +
      '<div class="field"><input id="f-drop" data-set="drop" inputmode="numeric" value="' + S.drop + '" aria-label="Extra, with a reason"><small>Extra, with a reason</small></div></div>' +
      '<p class="muted small">Run price $' + pr.price + '. Use the price you really charge for a one-off. The saving has to be real.</p></div>' +
      '<div class="sec"><h4>Practice</h4><div class="list" style="padding:0 16px">' + toggleHTML('voice', S.voice, 'The homeowner speaks their lines') + toggleHTML('pushback', S.pushback, 'Full door throws an objection in each half') + toggleHTML('sayfirst', S.sayFirst, 'Real doors: say my reply before I see options') + toggleHTML('saystride', S.sayStride, 'Add "We\'re from Stride" to the script') + '</div>' +
      '<p class="muted small">Off by default, because the coach never names his company at the door. Queensland expects you to say who you are before you sell, so this is here if you want it.</p></div>' +
      '<div class="sec"><h4>Good to know</h4><div class="list"><button type="button" class="item" data-open="law"><h3>Knocking in Queensland</h3><p>Six rules that change how you book the job</p>' + ico('chev') + '</button></div>' +
      (framed ? '' : '<p class="muted small"><b>Put it on your phone.</b> iPhone: open this page in Safari, tap Share, then Add to Home Screen. Android: open it in Chrome, tap the menu, then Install app. It then opens like an app and works without signal.</p>') + '</div>',
      '<button type="button" class="btn big" data-close="1">Done</button>');
  }
  function openLaw() {
    sheet('law', 'Knocking in Queensland', '<p class="muted">' + esc(C.qld.intro) + '</p><ul class="law list">' +
      C.qld.points.map(function (p) { return '<li><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="stack-s">' + C.qld.links.map(function (l) { return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a>'; }).join('') + '</div>');
  }
  function openProcess() {
    sheet('process', 'How he handles a no', '<p class="muted">He never argues an objection. Which process you use depends on one thing: is there a price on the table yet?</p>' + processHTML('front') + processHTML('back'));
  }
  var OPENERS = { door: openDoor, stages: openStages, doors: openDoors, settings: openSettings, law: openLaw, process: openProcess };
  function refresh() { if (SHEET && OPENERS[SHEET]) OPENERS[SHEET](); if (FOCUS.hidden) render(true); }

  /* ---------------- events ---------------- */
  document.addEventListener('input', function (e) {
    var k = e.target.dataset && e.target.dataset.set;
    if (!k) return;
    var v = e.target.value.trim();
    if (k === 'callout' || k === 'saving') {
      var pr = prices(S.service), c = k === 'callout' ? parseInt(v, 10) : pr.callout, sv = k === 'saving' ? parseInt(v, 10) : pr.saving;
      if (c > 0 && sv >= 0 && sv < c) S.prices[S.service] = { callout: c, saving: sv };
    } else if (k === 'drop') { var dr = parseInt(v, 10); if (dr >= 0) S.drop = dr; }
    else { S[k] = v; if (k !== 'runDay') S.example = false; }
    save();
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button, a');
    if (!t) { if (e.target.id === 'sheet') { closeSheet(); if (FOCUS.hidden) render(true); } return; }
    var d = t.dataset;
    if (d.close) { closeSheet(); if (FOCUS.hidden) render(true); return; }
    if (d.fclose) return focusClose();
    if (d.open) { if (d.open === 'door' && !FOCUS.hidden) { R.seq++; Voice.stop(); } return OPENERS[d.open](); }
    if (d.strategy) { S.strategy = d.strategy; save(); return refresh(); }
    if (d.service) { S.service = d.service; save(); return refresh(); }
    if (d.level) { S.level = d.level; save(); document.querySelectorAll('[data-level]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.level === S.level); }); return; }
    if (d.jump) { var s = document.getElementById(d.jump); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (d.stage) {
      OPEN = OPEN === d.stage ? '' : d.stage; render(true);
      var el = document.getElementById('s-' + d.stage); if (el && OPEN) el.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (d.way !== undefined) { S.ways[d.beat] = +d.way; save(); return render(true); }
    if (d.setlevel) { S.level = d.setlevel; save(); }
    if (d.mode) {
      if (d.mode === 'stage') return openStages();
      if (d.mode === 'obj') return objStart();
      if (d.mode === 'numbers') { N = {}; return numStart(); }
      return openDoors();
    }
    if (d.run) return startRun(d.run, d.beat);
    if (d.oshow) { O.shown = true; Voice.stop(); return objRender(); }
    if (d.oprev) { if (O.i > 0) { O.i--; O.shown = true; Voice.stop(); objRender(); } return; }
    if (d.review) return runReview();
    if (d.rvback) return runDone();
    if (d.ofilter) { O.filter = d.ofilter; return objStart(); }
    if (d.rate !== undefined) {
      P.obj[O.order[O.i].id] = +d.rate; addRep('obj');
      O.i++; O.shown = false;
      if (O.i >= O.order.length) { O.order = objOrder(); O.i = 0; }
      return objRender();
    }
    if (d.nshow) { N.shown = true; return numRender(); }
    if (d.num !== undefined) { N.count++; addRep('numbers'); return numStart(N.svc); }
    if (d.scn) return simStart(d.scn);
    if (d.sshow) return simFrame(M.them + simChoices(), '');
    if (d.pick !== undefined) return simPick(+d.pick);
    if (d.snext) { if (d.snext === 'end') return simEnd(!!d.shut); M.i++; return simNode(); }
    if (t.id === 'voice') { S.voice = !S.voice; save(); t.setAttribute('aria-pressed', S.voice); if (!S.voice) Voice.stop(); return; }
    if (t.id === 'pushback') { S.pushback = !S.pushback; save(); return refresh(); }
    if (t.id === 'saystride') { S.sayStride = !S.sayStride; save(); return refresh(); }
    if (t.id === 'sayfirst') { S.sayFirst = !S.sayFirst; save(); t.setAttribute('aria-pressed', S.sayFirst); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var note = e.target.closest && e.target.closest('.has-note');
    if (note && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (heldEl === note) hideHint(); else showHint(note); return; }
    if (e.key === 'Escape') hideHint();
    if (!FOCUS.hidden && !document.getElementById('sheet').open && e.key === 'ArrowLeft') { var bk = document.getElementById('back') || document.querySelector('[data-oprev]'); if (bk && !bk.disabled) { e.preventDefault(); bk.click(); } return; }
    if (!FOCUS.hidden && !document.getElementById('sheet').open && e.key === ' ' && e.target === document.body) {
      var b = document.getElementById('go');
      if (b) { e.preventDefault(); b.click(); }
    }
  });
  document.getElementById('app').addEventListener('close', function () { if (SHEET) { SHEET = ''; if (FOCUS.hidden) render(true); } }, true);
  window.addEventListener('hashchange', function () { if (!FOCUS.hidden) { R.seq++; Voice.stop(); FOCUS.hidden = true; FOCUS.innerHTML = ''; document.documentElement.classList.remove('focus-open'); } closeSheet(); render(); });

  shell(); render();
})();
