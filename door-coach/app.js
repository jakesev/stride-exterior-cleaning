/* Stride Door Coach — interface. Renders every view into #app.
   Four views: Today (the rep log), Process (the staged script), Drills, Film room. */
(function () {
  'use strict';
  var DC = window.DC, C = DC.content;
  var app = document.getElementById('app');
  var KEY = 'stride-door-coach-v2', MIN = 20, ELITE = 100;

  /* ---------------- storage ---------------- */
  function read(k) { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }
  var saved = read(KEY), old = saved.S ? {} : read('stride-door-coach-v1');
  var S = Object.assign({
    me: 'Jake', street: 'Wattle Street', neighbour: 'the Hendersons at number 14', runDay: '',
    service: 'windows', strategy: 'anchor', prices: {}, drop: 30, voice: true, level: 'read', ways: {},
    sayFirst: true, pushback: true, example: true
  }, old.S || {}, saved.S || {});
  var L = saved.L || {};                                   // rep log: { 'YYYY-MM-DD': { n, by: { kind: n } } }
  var P = Object.assign({ obj: {}, sim: {} }, saved.P || {}); // ratings
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ S: S, L: L, P: P })); } catch (e) { /* private mode */ } }

  /* ---------------- the rep log ---------------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dkey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function ago(n) { var d = new Date(); d.setDate(d.getDate() - n); return d; }
  function repsOn(k) { return (L[k] && L[k].n) || 0; }
  function today() { return repsOn(dkey(new Date())); }
  var KINDS = [['door', 'Full door'], ['stage', 'Single stage'], ['obj', 'Objections'], ['numbers', 'Numbers'], ['scenario', 'Real doors']];
  function addRep(kind, n) {
    n = n || 1;
    var k = dkey(new Date()), before = repsOn(k);
    if (!L[k]) L[k] = { n: 0, by: {} };
    L[k].n += n; L[k].by[kind] = (L[k].by[kind] || 0) + n;
    save(); chrome();
    if (before < ELITE && L[k].n >= ELITE) toast(ELITE + ' reps. Elite day.');
    else if (before < MIN && L[k].n >= MIN) toast(MIN + ' reps. Minimum hit.');
  }
  function streak() {
    var n = 0, i = today() >= MIN ? 0 : 1;
    while (repsOn(dkey(ago(i))) >= MIN) { n++; i++; }
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
    gutters: "that back corner up top I can't reach safely, so I've left it out.",
    roof: "there are a couple of cracked tiles up there. I'll photograph them for you, but they're a job for a roofer.",
    solar: "I can't tell you how much more power you'll get. It depends how dirty they were, so I won't put a number on it."
  };
  // objections a practice door can throw: ones he rolls past (front) and ones that end in a yes (back)
  var THROW = { front: ['guy', 'guy2', 'done', 'diy', 'busy', 'nothanks'], back: ['card', 'think', 'price', 'notnow', 'later'] };
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
      reason: st.reason, reasonLong: st.reasonLong, bridge: st.bridge, what: st.what
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
    log: '<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
    process: '<path d="M5 5h14M5 12h14M5 19h9"/><circle cx="19" cy="19" r="1.4"/>',
    drill: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    alert: '<path d="M12 4 2.5 20h19zM12 10v5M12 17.5v.01"/>',
    sound: '<path d="M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    redo: '<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v5h5"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    scale: '<path d="M12 4v16M6 20h12M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'
  };
  function ico(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>'; }
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
    hintEl = document.createElement('div'); hintEl.className = 'hint'; hintEl.setAttribute('role', 'tooltip');
    hintEl.innerHTML = '<b>Why</b>' + esc(el.dataset.note);
    document.body.appendChild(hintEl);
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
  function ladderHTML(side, lit) {
    var p = C.process[side];
    return '<ol class="ladder ' + side + '" aria-label="' + esc(p.title) + '">' + p.steps.map(function (st, i) {
      return '<li class="' + (lit && lit[st.k] ? 'on' : '') + '"><b>' + (i + 1) + '</b>' + esc(st.name) + '</li>';
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
  // one line of the script; lines with a note can be held to see why
  function row(l, o) {
    o = o || {};
    var note = o.noNote ? '' : noteOf(l, o.fallback), cls = 'ln ' + l.who + (l.silent ? ' silent' : '');
    if (l.step) cls += ' ' + stepInfo(l.step).side + '-step';
    return '<div class="' + cls + (note ? ' has-note" tabindex="0" data-note="' + esc(fill(note, o.strategy, o.service)) : '') + '"><span class="sp">' + labelOf(l) + '</span><p>' +
      fmt(l.t, o.strategy, o.service) + (l.extra || '') + '</p>' + (note ? '<span class="q" aria-hidden="true">?</span>' : '') + '</div>';
  }
  function scriptHTML(lines, o) { return '<div class="script">' + lines.map(function (l) { return row(l, o); }).join('') + '</div>'; }
  function waysFor(b) { return (b.ways || []).filter(function (w) { return !w.only || w.only === S.strategy; }); }
  function wayIndex(b) { var i = S.ways[b.id]; return (i >= 0 && i < waysFor(b).length) ? i : -1; }
  function beatLines(b) { var i = wayIndex(b); return i < 0 ? b.lines : waysFor(b)[i].lines; }
  function beatById(id) { return C.beats.filter(function (b) { return b.id === id; })[0]; }
  function halfName(h) { return h === 'front' ? 'Front half' : h === 'back' ? 'Back half' : 'The count'; }
  function speaks(b) { return b.lines.some(function (l) { return l.who === 'you'; }); }
  function sayOf(o) { return o.steps.map(function (s) { return s[1]; }).join(' // '); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2400);
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
  function levelSeg() {
    return '<div class="seg" role="group" aria-label="How much of the line you see">' + [['read', 'Read it'], ['cue', 'Cues only'], ['blind', 'From memory']].map(function (l) {
      return '<button type="button" data-level="' + l[0] + '" aria-pressed="' + (S.level === l[0]) + '">' + l[1] + '</button>';
    }).join('') + '</div>';
  }
  function setupPanel() {
    var t = ctx(), pr = prices(S.service);
    return '<section class="panel stack"><div class="row between"><h2>Your street</h2><button type="button" class="btn ghost sm" data-open="setup">' + ico('sliders') + 'Names and prices</button></div>' +
      '<div class="setup-grid"><span>Strategy</span>' + strategySeg() + '<span>Lead with</span>' + serviceChips() + '</div>' +
      '<p class="muted small">' + esc(C.strategies[S.strategy].blurb) + '</p>' +
      '<div class="summary"><span><b>' + esc(t.me) + '</b> on <b>' + esc(t.street) + '</b></span>' +
      (S.strategy === 'anchor' ? '<span>Booked: <b>' + esc(t.neighbour) + '</b></span>' : '') +
      '<span>Run day: <b>' + esc(t.runDay) + '</b></span><span>One-off <b>$' + pr.callout + '</b>, on the run <b>$' + pr.price + '</b></span>' +
      (S.example ? '<span class="tag warn">Example details</span>' : '') + '</div></section>';
  }

  /* ---------------- shell and routing ---------------- */
  var views = {}, after = {}, route = 'today';
  var TABS = [['today', 'Today', 'log'], ['process', 'Process', 'process'], ['drill', 'Drills', 'drill'], ['film', 'Film room', 'film']];
  var LEGACY = { walk: 'process', script: 'process', rehearse: 'drill', sim: 'drill', objections: 'drill', delivery: 'drill', practice: 'drill' };
  function shell() {
    app.innerHTML = '<div class="shell"><header class="top"><div class="top-in">' +
      '<a class="brand" href="#today"><span class="brand-mark">' + MARK + '</span><span>Door Coach</span></a>' +
      '<nav class="nav" aria-label="Sections">' + TABS.map(function (t) { return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + t[1] + '</a>'; }).join('') + '</nav>' +
      '<a class="count" id="count" href="#today" aria-label="Reps today"></a>' +
      '</div></header><main class="main" id="main"></main>' +
      '<nav class="tabbar" aria-label="Sections"><div class="tabbar-in">' + TABS.map(function (t) {
        return '<a href="#' + t[0] + '" data-tab="' + t[0] + '">' + ico(t[2]) + '<span>' + t[1] + '</span></a>';
      }).join('') + '</div></nav></div><dialog class="sheet" id="sheet" aria-labelledby="sheet-title"></dialog>';
  }
  function chrome() {
    var n = today(), c = document.getElementById('count');
    if (!c) return;
    c.className = 'count' + (n >= MIN ? ' min' : '');
    c.innerHTML = '<b>' + n + '</b><span>/ ' + (n >= MIN ? ELITE : MIN) + ' today</span>';
    document.querySelectorAll('[data-tab]').forEach(function (a) {
      if (a.dataset.tab === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function render(keepScroll) {
    Voice.stop(); hideHint(); R.seq++;
    var h = (location.hash || '#today').slice(1);
    h = LEGACY[h] || h;
    route = views[h] ? h : 'today';
    var y = window.scrollY;
    document.getElementById('main').innerHTML = '<div class="view" data-view="' + route + '">' + views[route]() + '</div>';
    chrome();
    if (after[route]) after[route]();
    window.scrollTo(0, keepScroll ? y : 0);
  }

  /* ---------------- today: the rep log ---------------- */
  views.today = function () {
    var n = today(), now = new Date(), k = dkey(now), by = (L[k] && L[k].by) || {};
    var status = n >= ELITE ? 'Elite day.' : n >= MIN ? 'Minimum hit. ' + (ELITE - n) + ' more for an elite day.' : (MIN - n) + ' more to hit today\'s minimum.';
    var days = '', week = 0, best = 0, all = 0;
    for (var i = 13; i >= 0; i--) {
      var d = ago(i), v = repsOn(dkey(d));
      if (i < 7) week += v;
      days += '<div class="day' + (v >= ELITE ? ' elite' : v >= MIN ? ' min' : v ? ' some' : '') + (i === 0 ? ' now' : '') + '"><span>' + d.toLocaleDateString('en-AU', { weekday: 'short' }).slice(0, 2) + '</span><b>' + v + '</b></div>';
    }
    Object.keys(L).forEach(function (x) { all += L[x].n; if (L[x].n > best) best = L[x].n; });
    var perDoor = doorBeats().filter(speaks).length;
    var framed = false; try { framed = window.self !== window.top; } catch (e) { framed = true; }
    return '<section class="tally"><p class="eyebrow">' + esc(now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>' +
      '<div class="tally-n"><b>' + n + '</b><span>reps today</span></div>' +
      '<div><div class="track' + (n >= MIN ? ' min' : '') + '" role="img" aria-label="' + n + ' of ' + ELITE + ' reps"><i style="width:' + Math.min(100, n / ELITE * 100) + '%"></i><u></u></div>' +
      '<div class="track-l"><span>0</span><span>' + MIN + ' minimum</span><span>' + ELITE + ' elite</span></div></div>' +
      '<p class="lede">' + status + '</p>' +
      '<div class="row"><button type="button" class="btn" data-startdoor="1">' + ico('drill') + 'Practise a door</button><a class="btn ghost" href="#drill">All drills</a></div>' +
      (all ? '' : '<p class="well small"><b>Just starting?</b> Tap Practise a door, pick what the house needs, and read each line out loud. That is all there is to it. The rest of the app is there when you want it.</p>') + '</section>' +
      '<section class="stack"><h2>Last 14 days</h2><div class="days">' + days + '</div>' +
      '<div class="stats"><div><b>' + streak() + '</b><span>days in a row at ' + MIN + ' or more</span></div><div><b>' + week + '</b><span>last 7 days</span></div><div><b>' + best + '</b><span>best day</span></div><div><b>' + all + '</b><span>all time</span></div></div></section>' +
      '<section class="stack"><h2>What counts as a rep</h2><p class="lede">One rep is one stage of the door, or one objection, said out loud start to finish. A full door is ' + perDoor + ' reps. Twenty a day keeps it sharp. A hundred is how it becomes automatic and starts to sound like a conversation.</p>' +
      '<dl class="kv">' + KINDS.map(function (x) { return '<dt>' + x[1] + '</dt><dd>' + (by[x[0]] || 0) + '</dd>'; }).join('') + '</dl>' +
      '<div class="row"><button type="button" class="btn ghost sm" id="copylog">' + ico('copy') + 'Copy my log</button></div></section>' +
      setupPanel() +
      '<section class="stack"><p class="note-row">' + ico('scale') + '<span>The coach sells in the US. Queensland has its own door-knocking rules, and they change how you book the job. <button type="button" class="link" data-open="law">Read the six rules</button></span></p>' +
      (framed ? '' : '<p class="note-row">' + ico('phone') + '<span><b>Put it on your phone.</b> iPhone: open this page in Safari, tap Share, then Add to Home Screen. Android: open it in Chrome, tap the menu, then Install app. It then opens like an app and works without signal.</span></p>') +
      '</section>';
  };
  after.today = function () {
    document.getElementById('copylog').addEventListener('click', function () {
      var txt = 'Stride Door Coach, reps per day\n' + Object.keys(L).sort().map(function (k) {
        return k + ', ' + L[k].n + ' (' + KINDS.filter(function (x) { return L[k].by[x[0]]; }).map(function (x) { return x[1] + ' ' + L[k].by[x[0]]; }).join(', ') + ')';
      }).join('\n');
      var ok = function () { toast('Log copied'); }, no = function () { toast('Copy is blocked here.'); };
      try { navigator.clipboard.writeText(txt).then(ok, no); } catch (e) { no(); }
    });
  };

  /* ---------------- process: the staged script ---------------- */
  views.process = function () {
    var num = {}; C.beats.forEach(function (b, i) { num[b.id] = i + 1; });
    function jump(b) { return '<li><button type="button" data-jump="s-' + b.id + '" class="' + (b.process ? 'opt' : '') + '"><b>' + num[b.id] + '</b><span>' + esc(b.title) + '</span></button></li>'; }
    function phase(h, objective) {
      return '<div class="phase"><h4>' + halfName(h) + '</h4><p>' + objective + '</p><ol>' + C.beats.filter(function (b) { return b.half === h; }).map(jump).join('') + '</ol></div>';
    }
    var out = '<header class="stack"><p class="eyebrow">The sales process</p><h1>' + esc(C.services[S.service].label) + ', ' + esc(C.strategies[S.strategy].label.toLowerCase()) + '</h1>' +
      '<p class="lede">Twelve stages in three phases. Each stage has one objective and a clear point where it is done. Learn the order and the reason for every line, then say it your own way.</p>' +
      '<p class="well small"><b>Hold any line</b> marked <span class="tag">?</span> to see why it is there. The dotted marks are pauses.</p>' +
      '<div class="row between">' + strategySeg() + serviceChips() + '</div></header>' +
      '<div class="phases">' + phase('front', 'Objective: get to the price. You are not selling the job yet.') + phase('count', 'Objective: a number and a spot.') + phase('back', 'Objective: a decision today.') + '</div>';
    C.beats.forEach(function (b) {
      var ws = waysFor(b), wi = wayIndex(b), lines = beatLines(b);
      out += '<section class="stage" id="s-' + b.id + '"><div class="stage-head"><span class="num">Stage ' + num[b.id] + ' · ' + halfName(b.half) + (b.process ? ' · if needed' : '') + '</span><h2>' + esc(b.title) + '</h2><span class="when">' + esc(b.time) + '</span></div>' +
        '<dl class="spec"><dt>Objective</dt><dd class="obj">' + fmt(b.goal) + '</dd><dt>Done when</dt><dd>' + fmt(b.done) + '</dd><dt>Body</dt><dd>' + fmt(b.move) + '</dd></dl>' +
        (b.pattern ? '<div class="stack-s"><h4>The pattern, and how he breaks it</h4>' + patternHTML() + '</div>' : '') +
        (b.process ? processHTML(b.process, litOf(lines)) : '') +
        (ws.length ? '<div class="stack-s"><h4>Ways to say it</h4><div class="chips"><button type="button" class="chip" data-way="-1" data-beat="' + b.id + '" aria-pressed="' + (wi < 0) + '">The standard</button>' +
          ws.map(function (w, k) { return '<button type="button" class="chip" data-way="' + k + '" data-beat="' + b.id + '" aria-pressed="' + (wi === k) + '">' + esc(w.name) + '</button>'; }).join('') + '</div>' +
          (wi >= 0 ? '<p class="way-note"><b>' + esc(ws[wi].by) + '.</b> ' + fmt(ws[wi].note) + '</p>' : '') + '</div>' : '') +
        scriptHTML(lines) +
        '<details class="more"><summary>Why, and the mistake to avoid</summary><div class="in"><div><h4>Why it works</h4><p>' + fmt(b.why + (b.strategyNote ? ' ' + C.strategies[S.strategy].coach : '')) + '</p></div>' +
        '<div><h4>The mistake</h4><p>' + fmt(b.trap) + '</p><cite>' + esc(b.who) + '</cite></div></div></details>' +
        (speaks(b) ? '<div class="row"><button type="button" class="btn ghost sm" data-drillstage="' + b.id + '">' + ico('drill') + 'Drill this stage</button></div>' : '') + '</section>';
    });
    out += '<section class="stage"><div class="stage-head"><h2>Same process, every surface</h2></div><p class="lede">The stages never change. Three things do: where you stand, what you name, and why half a job is not enough.</p>' +
      '<div class="table-wrap"><table><thead><tr><th>Lead with</th><th>Stand at</th><th>Name the parts</th><th>Why the lot</th><th>Then link to</th></tr></thead><tbody>' +
      Object.keys(C.services).map(function (k) {
        var s = C.services[k];
        return '<tr class="' + (k === S.service ? 'on' : '') + '"><td>' + s.label + '</td><td>' + esc(s.spot.charAt(0).toUpperCase() + s.spot.slice(1)) + '</td><td>' + s.stack.map(esc).join('<br>') + '</td><td>' + esc(s.why) + '</td><td>' + esc(s.link.replace(/\s*\/\/\s*/g, ' ')) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="note-row">' + ico('alert') + '<span><b>Say the limit before the price.</b> ' + esc(C.services[S.service].honest) + '</span></p>' +
      '<div class="row"><button type="button" class="btn ghost sm" id="copy">' + ico('copy') + 'Copy the script</button><button type="button" class="btn ghost sm" data-open="setup">' + ico('sliders') + 'Names and prices</button></div></section>';
    return out;
  };
  after.process = function () {
    document.getElementById('copy').addEventListener('click', function () {
      var txt = C.beats.map(function (b, i) {
        return (i + 1) + '. ' + b.title.toUpperCase() + '\n' + beatLines(b).map(function (l) {
          return (l.who === 'you' ? 'You: ' : l.who === 'them' ? (l.silent ? 'Them: [' : 'Them: ') : '[') + plain(l.t) + (l.who === 'move' || l.silent ? ']' : '');
        }).join('\n');
      }).join('\n\n');
      var ok = function () { toast('Script copied'); }, no = function () { toast('Copy is blocked here. Select the text instead.'); };
      try { navigator.clipboard.writeText(txt).then(ok, no); } catch (e) { no(); }
    });
  };

  /* ---------------- drills ---------------- */
  var R = { seq: 0 }, O = { filter: 'all' }, N = {}, M = {}, pending = null;
  views.drill = function () { return '<div id="drill"></div>'; };
  after.drill = function () { var p = pending; pending = null; if (p === 'door') doorPicker(); else if (p) startRun('stage', p); else drillMenu(); };
  function box() { return document.getElementById('drill'); }
  function topBar(label, right) {
    return '<div class="drill-top"><button type="button" class="btn ghost sm" data-menu="1">' + ico('back') + 'Drills</button><span>' + label + '</span>' + (right ? '<span>' + right + '</span>' : '') + '</div>';
  }
  function drillMenu() {
    R.seq++; Voice.stop();
    var perDoor = doorBeats().filter(speaks).length;
    var modes = [
      ['door', 'Full door', 'Pick what the house needs, then the whole conversation with an objection thrown in each half. ' + perDoor + ' reps.'],
      ['stage', 'One stage on repeat', 'Pick a stage and say it until it is automatic. One rep a pass.'],
      ['obj', 'Objections', 'Sixteen of them. Build each answer on his process. One rep each.'],
      ['numbers', 'Numbers', 'Your prices for every surface, said cold. One rep each.'],
      ['scenario', 'Real doors', 'Five doors from his videos. Say your reply, then see what he did. One rep a moment.']
    ];
    box().innerHTML = '<div class="stack" style="gap:26px"><header class="stack"><p class="eyebrow">Drills</p><h1>Say it until it is automatic</h1>' +
      '<p class="lede">Out loud, standing up. Start by reading, move to cues, then go from memory. The words stop sounding like a script somewhere past the fiftieth rep.</p></header>' +
      '<div class="modes">' + modes.map(function (m) { return '<button type="button" class="mode" data-mode="' + m[0] + '"><h3>' + m[1] + '</h3><p>' + m[2] + '</p>' + ico('arrow') + '</button>'; }).join('') + '</div>' +
      '<section class="panel stack"><h2>How you drill</h2><div class="setup-grid"><span>You see</span>' + levelSeg() + '<span>Strategy</span>' + strategySeg() + '<span>Lead with</span>' + serviceChips() + '</div>' +
      '<div class="stack-s"><button type="button" class="toggle" id="voice" aria-pressed="' + !!S.voice + '"><i></i>The homeowner speaks their lines</button>' +
      '<button type="button" class="toggle" id="pushback" aria-pressed="' + !!S.pushback + '"><i></i>Full door includes one brush-off and one stall</button>' +
      '<button type="button" class="toggle" id="sayfirst" aria-pressed="' + !!S.sayFirst + '"><i></i>Real doors: say my reply before I see the options</button></div></section></div>';
  }
  function doorBeats() { return C.beats.filter(function (b) { return b.id !== 'leave' && (S.pushback || !b.process); }); }

  /* --- run engine: full door, or one stage on repeat --- */
  function startRun(kind, beatId) {
    var same = R.kind === 'stage' && kind === 'stage' && R.beatId === beatId;
    var beats = kind === 'door' ? doorBeats() : [beatById(beatId)], lines = [];
    beats.forEach(function (b, bi) {
      var src = b.process && wayIndex(b) < 0 ? thrown(b.process) : beatLines(b);
      if (src.id) R['last' + b.process] = src.id;
      src.forEach(function (l) { if (kind === 'door' && S.pushback && l.easy) return; lines.push({ b: b, l: l, bi: bi }); });
    });
    var lastF = R.lastfront, lastB = R.lastback;
    R = { seq: R.seq + 1, lastfront: lastF, lastback: lastB, kind: kind, beatId: beatId, beats: beats, lines: lines, hist: [], start: Date.now(), fast: 0, reps: 0,
      pass: same ? R.pass + 1 : 1, ms: 0, w: 0, cue: beatId === 'hello' ? C.cues[Math.floor(Math.random() * C.cues.length)] : '' };
    runStep(0);
  }
  // turn a random objection into script lines, so every door throws a different one
  function thrown(side) {
    var ids = THROW[side].filter(function (id) { return id !== R['last' + side]; });
    var id = ids[Math.floor(Math.random() * ids.length)], o = C.objections.filter(function (x) { return x.id === id; })[0];
    var out = [{ who: 'them', t: o.them }].concat(o.steps.map(function (s) { return { who: 'you', step: s[0], t: s[1] }; }));
    out.push(side === 'front' ? { who: 'move', t: 'Nod and go before they answer.', n: 'You asked for thirty seconds, nothing more. A second no, or "please go", is real: thank them and leave.' }
      : { who: 'them', t: "…Okay. Let's do it." });
    out.id = id;
    return out;
  }
  function doorPicker() {
    box().innerHTML = '<div class="drill">' + topBar('Full door') + '<h2>What does this house need?</h2>' +
      '<p class="lede">Pick the surface that looks worst from the footpath. That is what you lead with, and where you will both stand.</p>' +
      '<div class="modes">' + Object.keys(C.services).map(function (k) {
        var s = C.services[k];
        return '<button type="button" class="mode" data-doorsvc="' + k + '"><h3>' + esc(s.label) + '</h3><p>' + esc(s.see) + '</p>' + ico('arrow') + '</button>';
      }).join('') + '</div><p class="muted small">Each door throws a different brush-off before the price and a different stall after it. Turn that off under Drills if you want the clean run first.</p></div>';
  }
  function promptOf(l, b) {
    if (l.who !== 'you' || S.level === 'read') return fmt(l.t);
    if (S.level === 'cue') { if (l.step) return '<span class="muted">Your words for: ' + esc(stepInfo(l.step).name) + '</span>'; return esc(plain(l.t).split(/\s+/).slice(0, 3).join(' ')) + ' …'; }
    return '<span class="muted">' + esc(l.step ? stepInfo(l.step).name : b.title) + '</span>';
  }
  function runStep(i) {
    var seq = ++R.seq, el = box();
    if (!el) return;
    if (i >= R.lines.length) return runDone();
    var x = R.lines[i], l = x.l, b = x.b, mine = l.who !== 'them', note = noteOf(l, l.who === 'you' ? b.goal : '');
    var label = R.kind === 'door' ? esc(C.services[S.service].label) + ' · ' + (x.bi + 1) + ' of ' + R.beats.length + ' · ' + esc(b.title) : esc(b.title) + ' · pass ' + R.pass;
    var head = l.who === 'them' ? 'Homeowner' : l.who === 'move' ? 'Do this' : l.step ? labelOf(l) : 'Your line';
    el.innerHTML = '<div class="drill">' + topBar(label) + '<div class="bar"><i style="width:' + Math.round(i / R.lines.length * 100) + '%"></i></div>' +
      (R.cue ? '<p class="well small"><b>At this door:</b> ' + esc(R.cue.toLowerCase()) + '. Open on that instead of the dog.</p>' : '') +
      '<div class="hist script" id="hist">' + R.hist.map(function (h) { return row(h, { noNote: true }); }).join('') + '</div>' +
      '<div class="now ' + (mine ? (l.who === 'move' ? 'move' : 'yours') : 'theirs') + (l.silent ? ' silent' : '') + '"><div class="now-h"><span>' + head + '</span>' +
      (l.who === 'them' && !l.silent && S.voice ? '<span class="speaking" aria-hidden="true"><i></i><i></i><i></i></span>' : '') + '</div>' +
      (l.step && b.process ? ladderHTML(b.process, litOf([l])) : '') +
      '<p class="say' + (note ? ' has-note" tabindex="0" data-note="' + esc(fill(note)) : '') + '">' + promptOf(l, b) + '</p>' +
      (l.who === 'you' ? '<p class="sub">' + (S.level === 'read' ? 'Hold the line to see why it is there.' : esc(l.cue || b.goal)) + '</p>' : l.silent ? '<p class="sub">Wait. Let them look.</p>' : '') + '</div>' +
      '<button type="button" class="btn big' + (mine ? '' : ' ghost') + '" id="go">' + (l.who === 'them' ? 'Skip' : l.who === 'move' ? 'Done' : 'Said it') + '</button></div>';
    var hist = document.getElementById('hist'); hist.scrollTop = hist.scrollHeight;
    var t0 = Date.now();
    var next = function () {
      if (seq !== R.seq) return;
      var rec = { who: l.who, t: l.t, step: l.step, silent: l.silent };
      if (l.who === 'you') {
        var n = words(l.t), ms = Date.now() - t0;
        if (ms > 600) { R.ms += ms; R.w += n; }
        if (n >= 7 && ms > 1200 && n / (ms / 60000) > 185) { R.fast++; rec.extra = ' <span class="tag bad">Rushed</span>'; }
      }
      R.hist.push(rec); Voice.stop();
      var last = i === R.lines.length - 1 || R.lines[i + 1].b !== b;
      if (last && speaks(b)) { R.reps++; addRep(R.kind === 'door' ? 'door' : 'stage'); }
      runStep(i + 1);
    };
    document.getElementById('go').addEventListener('click', next);
    if (l.who === 'them') (l.silent ? wait(1900) : Voice.speak(spoken(l.t)).then(function () { return wait(350); })).then(next);
  }
  function runDone() {
    var secs = Math.round((Date.now() - R.start) / 1000), wpm = R.ms > 0 ? Math.round(R.w / (R.ms / 60000)) : 0;
    var pace = !wpm ? '' : wpm > 165 ? '<span class="tag bad">' + wpm + ' words a minute · rushing</span>' : wpm < 110 ? '<span class="tag warn">' + wpm + ' words a minute · slow</span>' : '<span class="tag good">' + wpm + ' words a minute · conversational</span>';
    var up = S.level === 'read' ? ['cue', 'Again, cues only'] : S.level === 'cue' ? ['blind', 'Again, from memory'] : null;
    var html;
    if (R.kind === 'stage') {
      var list = C.beats.filter(speaks), at = list.indexOf(beatById(R.beatId)), nx = list[(at + 1) % list.length];
      html = topBar(esc(beatById(R.beatId).title)) +
        '<div class="panel done"><p class="eyebrow">Pass ' + R.pass + ' done</p><div class="row">' + pace + '<span class="tag">' + secs + ' seconds</span></div>' +
        '<p class="muted small">' + (wpm > 165 ? 'Take every pause mark and let each line land before the next.' : 'Say it again. Change one word so it stays yours.') + '</p>' +
        '<button type="button" class="btn big" id="go" data-run="stage" data-beat="' + R.beatId + '">' + ico('redo') + 'Again</button>' +
        '<div class="row">' + (up ? '<button type="button" class="btn ghost sm" data-run="stage" data-beat="' + R.beatId + '" data-setlevel="' + up[0] + '">' + up[1] + '</button>' : '') +
        '<button type="button" class="btn ghost sm" data-run="stage" data-beat="' + nx.id + '">Next stage: ' + esc(nx.title) + '</button></div></div>';
    } else {
      html = topBar('Full door') +
        '<div class="panel done"><p class="eyebrow">Door complete</p><p class="n">' + R.reps + ' reps</p><div class="row">' + pace + '<span class="tag">' + Math.floor(secs / 60) + ':' + pad(secs % 60) + '</span>' + (R.fast ? '<span class="tag bad">' + R.fast + ' lines rushed</span>' : '') + '</div>' +
        '<ul class="checks"><li>' + ico('check') + '<span>Did the first seven seconds sound like a salesman, or like someone who popped over?</span></li>' +
        '<li>' + ico('check') + '<span>Did you wait through the silences, or fill them?</span></li><li>' + ico('check') + '<span>Did you stop talking after the price?</span></li></ul>' +
        '<button type="button" class="btn big" id="go" data-run="door"' + (up ? ' data-setlevel="' + up[0] + '"' : '') + '>' + ico('redo') + (up ? up[1] : 'Again') + '</button>' +
        '<div class="row">' + (up ? '<button type="button" class="btn ghost sm" data-run="door">Again, same level</button>' : '') + '<button type="button" class="btn ghost sm" data-mode="door">Another house</button></div></div>';
    }
    box().innerHTML = '<div class="drill">' + html + '</div>';
  }
  function stagePicker() {
    box().innerHTML = '<div class="drill">' + topBar('One stage on repeat') + '<h2>Which stage?</h2><div class="modes">' + C.beats.filter(speaks).map(function (b) {
      return '<button type="button" class="mode" data-run="stage" data-beat="' + b.id + '"><h3>' + esc(b.title) + '</h3><p>' + halfName(b.half) + (b.process ? ' · if needed' : '') + ' · ' + esc(b.time) + '</p>' + ico('arrow') + '</button>';
    }).join('') + '</div></div>';
  }

  /* --- objections --- */
  function objOrder() {
    var list = C.objections.filter(function (o) { return O.filter === 'all' || o.stage === O.filter; });
    var rank = function (o) { var r = P.obj[o.id]; return r === undefined ? -1 : r; };
    return shuffle(list).sort(function (a, b) { return rank(a) - rank(b); });
  }
  function objStart() { O.order = objOrder(); O.i = 0; O.shown = false; objRender(); }
  function objRender() {
    var o = O.order[O.i], side = o.stage, lit = litOf(o.steps);
    var nailed = C.objections.filter(function (x) { return P.obj[x.id] === 2; }).length;
    box().innerHTML = '<div class="drill">' + topBar('Objections · ' + (O.i + 1) + ' of ' + O.order.length, nailed + ' nailed') +
      '<div class="row between"><div class="seg" role="group" aria-label="Filter">' + [['all', 'All'], ['front', 'Before the price'], ['back', 'After the price']].map(function (f) {
        return '<button type="button" data-ofilter="' + f[0] + '" aria-pressed="' + (O.filter === f[0]) + '">' + f[1] + '</button>';
      }).join('') + '</div></div>' +
      '<div class="pips">' + O.order.map(function (x, i) { var r = P.obj[x.id]; return '<i class="' + (r !== undefined ? 'r' + r : '') + (i === O.i ? ' cur' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="panel stack"><div class="row between"><span class="tag ' + (side === 'front' ? 'blue' : 'good') + '">' + esc(C.process[side].when) + '</span>' +
      '<button type="button" class="btn ghost sm" id="hear">' + ico('sound') + 'Hear it</button></div>' +
      '<p class="obj-q">“' + fmt(o.them) + '”</p>' +
      (O.shown
        ? '<p class="muted small"><b>What it means.</b> ' + esc(o.means) + '</p>' + (o.hard ? '' : ladderHTML(side, lit)) +
          scriptHTML(o.steps.map(function (s) { return { who: 'you', step: s[0], t: s[1] }; })) +
          '<details class="more"><summary>Why he handles it this way</summary><div class="in"><p>' + fmt(o.why) + '</p><cite>' + esc(o.by) + '</cite></div></details>' +
          '<div class="stack-s"><h4>How close were you?</h4><div class="rate"><button type="button" data-rate="0">Missed it</button><button type="button" data-rate="1">Close</button><button type="button" data-rate="2">Nailed it</button></div></div>'
        : (o.hard ? '<p class="muted small">Is this one a smokescreen, or real? Say what you would do.</p>' : '<div class="stack-s"><p class="muted small"><b>Answer out loud, one step at a time.</b> ' + esc(C.process[side].line) + '</p>' + ladderHTML(side) + '</div>') +
          '<button type="button" class="btn big" id="go" data-oshow="1">I\'ve answered. Show his.</button>') +
      '</div><p class="muted small"><button type="button" class="link" data-open="process">See both processes in full</button></p></div>';
    document.getElementById('hear').addEventListener('click', function () { Voice.speak(spoken(o.them), true); });
  }

  /* --- numbers --- */
  function numStart(prev) {
    var keys = Object.keys(C.services).filter(function (k) { return k !== prev; });
    N = { svc: keys[Math.floor(Math.random() * keys.length)], shown: false, count: (N.count || 0) }; numRender();
  }
  function numRender() {
    var pr = prices(N.svc), sv = C.services[N.svc], price = beatById('price'), o = { service: N.svc };
    box().innerHTML = '<div class="drill">' + topBar('Numbers', N.count ? N.count + ' this session' : '') +
      '<div class="panel stack"><span class="tag blue">' + esc(C.strategies[S.strategy].label) + '</span><p class="obj-q">' + esc(sv.label) + '</p>' +
      (N.shown
        ? '<div class="figs"><div><b>$' + pr.callout + '</b><span>One-off price</span></div><div><b>$' + pr.saving + '</b><span>Off on the run</span></div><div><b>$' + pr.price + '</b><span>Run price</span></div><div><b>$' + pr.deal + '</b><span>Lowest, with a reason</span></div></div>' +
          scriptHTML(price.lines.filter(function (l) { return l.who === 'you'; }), o) +
          '<div class="stack-s"><h4>Did you have every number?</h4><div class="rate" style="grid-template-columns:1fr 1fr"><button type="button" data-num="0">Missed one</button><button type="button" data-num="1">Every one</button></div></div>'
        : '<p class="lede">Say the whole price line out loud: the one-off price, the reason it drops, the saving, the run price, and the guarantee.</p>' +
          '<button type="button" class="btn big" id="go" data-nshow="1">I\'ve said it. Check.</button>') +
      '</div><p class="muted small">These are your prices. <button type="button" class="link" data-open="setup">Change them</button> (the sheet edits ' + esc(C.services[S.service].label.toLowerCase()) + ').</p></div>';
  }

  /* --- real doors --- */
  function simList() {
    box().innerHTML = '<div class="drill">' + topBar('Real doors') + '<h2>Five doors from his videos</h2>' +
      '<p class="lede">Say your reply out loud, then pick the option closest to it. He tells you what each one does to the homeowner\'s guard.</p>' +
      '<div class="modes">' + C.scenarios.map(function (s) {
        var best = P.sim[s.id];
        return '<button type="button" class="mode" data-scn="' + s.id + '"><h3>' + esc(s.title) + '</h3><p>' + esc(s.blurb) + ' From: ' + esc(s.based) + '.' + (best !== undefined ? ' Best: ' + best + ' of ' + s.nodes.length + '.' : '') + '</p>' + ico('arrow') + '</button>';
      }).join('') + '</div></div>';
  }
  function simStart(id) {
    var s = C.scenarios.filter(function (x) { return x.id === id; })[0];
    M = { scn: s, i: 0, guard: s.guard, right: 0, strat: s.strategy === 'anchor' ? 'anchor' : undefined };
    simNode();
  }
  function simChoices() {
    var n = M.scn.nodes[M.i];
    return '<div class="choices">' + M.order.map(function (k) { return '<button type="button" class="choice" data-pick="' + k + '">' + fmt(n.choices[k].t, M.strat) + '</button>'; }).join('') + '</div>';
  }
  function simNode() {
    var s = M.scn, n = s.nodes[M.i];
    if (s.independent) M.guard = s.guard;
    M.order = shuffle(n.choices.map(function (c, i) { return i; }));
    box().innerHTML = '<div class="drill">' + topBar(esc(s.title) + ' · ' + (M.i + 1) + ' of ' + s.nodes.length) +
      '<div class="bar"><i style="width:' + Math.round(M.i / s.nodes.length * 100) + '%"></i></div>' +
      scriptHTML([{ who: 'them', t: n.them }], { strategy: M.strat }) +
      '<div id="sim-c">' + (S.sayFirst ? '<div class="well stack"><p><b>Say your reply out loud.</b> Then see which option was closest.</p><button type="button" class="btn" id="go" data-sshow="1">I\'ve said it</button></div>' : simChoices()) + '</div><div id="sim-v"></div></div>';
    Voice.speak(spoken(n.them, M.strat));
  }
  function simPick(k) {
    var s = M.scn, n = s.nodes[M.i], c = n.choices[k];
    Voice.stop(); addRep('scenario');
    if (c.v === 'best') M.right++;
    M.guard = Math.max(0, Math.min(100, M.guard + c.g));
    document.querySelectorAll('.choice').forEach(function (b) {
      b.disabled = true; var idx = +b.dataset.pick;
      if (idx === k) b.classList.add('picked', c.v); else if (n.choices[idx].v === 'best') b.classList.add('reveal');
    });
    var kind = c.v === 'best' ? ['good', 'His move'] : c.v === 'ok' ? ['warn', 'It works, but'] : ['bad', 'That costs you'];
    var last = M.i === s.nodes.length - 1, shut = M.guard >= 100 && !s.independent;
    document.getElementById('sim-v').innerHTML = '<div class="verdict">' + scriptHTML([{ who: 'them', t: c.reply, silent: /^\(/.test(c.reply) && !/\)\s*\S/.test(c.reply) }], { strategy: M.strat }) +
      '<div class="coach ' + kind[0] + '"><h4>' + kind[1] + ' · their guard ' + (c.g < 0 ? 'comes down' : c.g > 3 ? 'goes up' : 'stays put') + '</h4><p>' + fmt(c.c, M.strat) + '</p></div>' +
      (n.obj ? '<div class="well stack-s"><p class="small" style="font-weight:750">That was an objection ' + (n.obj === 'front' ? 'before the price. He goes past it:' : 'after the price. He guides them through it:') + '</p>' + ladderHTML(n.obj) + '</div>' : '') +
      '<button type="button" class="btn big" id="go" data-snext="' + (last || shut ? 'end' : 'next') + '" data-shut="' + (shut ? 1 : '') + '">' + (last || shut ? 'How it ended' : 'Next moment') + ico('arrow') + '</button></div>';
    document.getElementById('sim-v').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function simEnd(shut) {
    var s = M.scn, ratio = M.right / s.nodes.length;
    var kind = shut ? 'lose' : s.independent ? (ratio >= .8 ? 'win' : ratio >= .5 ? 'mid' : 'lose') : (M.guard <= s.win ? 'win' : M.guard >= 92 ? 'lose' : 'mid');
    var e = s.endings[kind];
    if (P.sim[s.id] === undefined || M.right > P.sim[s.id]) { P.sim[s.id] = M.right; save(); }
    box().innerHTML = '<div class="drill">' + topBar(esc(s.title)) + '<div class="panel done"><span class="tag ' + (kind === 'win' ? 'good' : kind === 'mid' ? 'warn' : 'bad') + '" style="align-self:flex-start">' + fmt(e.title, M.strat) + '</span>' +
      '<p class="n">' + M.right + ' of ' + s.nodes.length + '</p><p class="muted small">moments where you chose his move</p><p>' + fmt(e.text, M.strat) + '</p>' +
      '<button type="button" class="btn big" id="go" data-scn="' + s.id + '">' + ico('redo') + 'Run it again</button><div class="row"><button type="button" class="btn ghost sm" data-mode="scenario">Another door</button></div></div></div>';
  }

  /* ---------------- film room ---------------- */
  views.film = function () {
    return '<header class="stack"><p class="eyebrow">Film room</p><h1>What the coach saw at each door</h1>' +
      '<p class="lede">The method in this app comes from three of his videos. For every door in them: what worked, what it cost, and the fix he gave.</p>' +
      '<dl class="kv">' + C.sources.map(function (s) { return '<dt><b style="color:var(--ink)">' + esc(s[0]) + '</b><br><span class="small">' + esc(s[1]) + '</span></dt><dd></dd>'; }).join('') + '</dl></header>' +
      '<section class="stack"><h2>The pattern he breaks</h2><p class="lede">His words for it are "avoiding sales patterns". Anything a homeowner expects a salesman to say or do, he replaces.</p>' + patternHTML() + '</section>' +
      '<section class="stack"><h2>How he handles a no</h2><p class="lede">It is the same steps at every door. Before the price he goes past the objection. After the price he guides them to a decision.</p><div class="two">' + processHTML('front') + processHTML('back') + '</div></section>' +
      '<section class="stack"><h2>His ten rules</h2><ol class="rules">' + C.rules.map(function (r) { return '<li><div><b>' + esc(r.t) + '</b><span>' + esc(r.d) + '</span></div></li>'; }).join('') + '</ol></section>' +
      C.film.map(function (f) {
        return '<section class="stack"><div><h2>' + esc(f.title) + '</h2><p class="muted">' + esc(f.sub) + '</p></div><div>' + f.reps.map(function (r) {
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
    d.innerHTML = '<div class="sheet-head"><h2 id="sheet-title">' + title + '</h2><button type="button" class="x" data-close="1" aria-label="Close">' + ico('x') + '</button></div>' +
      '<div class="sheet-body">' + body + '</div>' + (foot ? '<div class="sheet-foot">' + foot + '</div>' : '');
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  }
  function closeSheet() { var d = document.getElementById('sheet'); if (d.open && d.close) d.close(); else d.removeAttribute('open'); }
  function openSetup() {
    var pr = prices(S.service), er = earliestRun();
    function f(id, label, val, extra) { return '<div class="field"><label for="f-' + id + '">' + label + '</label><input id="f-' + id + '" name="' + id + '" value="' + esc(val) + '" ' + (extra || '') + '></div>'; }
    sheet('Names and prices', '<form id="setup-form" class="stack">' +
      '<div class="fields-2">' + f('me', 'Your first name', S.me, 'autocomplete="given-name"') + f('street', 'Street you are knocking', S.street) + '</div>' +
      f('neighbour', 'Booked neighbour (job on the street)', S.neighbour, 'placeholder="the Hendersons at number 14"') +
      '<div class="field"><label for="f-runDay">Run day, as you would say it</label><input id="f-runDay" name="runDay" value="' + esc(S.runDay) + '" placeholder="' + esc(spokenDay(er)) + '">' +
      '<small>If you knock today, the earliest day you can do the work is ' + esc(er.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })) + ': ten business days of cooling-off first. Public holidays push it later. Leave blank to use that date.</small></div>' +
      '<div class="field"><label>Prices for ' + esc(C.services[S.service].label.toLowerCase()) + '</label><div class="fields-3">' +
      '<div class="field"><input id="f-callout" name="callout" inputmode="numeric" value="' + pr.callout + '" aria-label="One-off price"><small>One-off price</small></div>' +
      '<div class="field"><input id="f-saving" name="saving" inputmode="numeric" value="' + pr.saving + '" aria-label="Off on the run"><small>Off on the run</small></div>' +
      '<div class="field"><input id="f-drop" name="drop" inputmode="numeric" value="' + S.drop + '" aria-label="Extra, with a reason"><small>Extra, with a reason</small></div></div>' +
      '<small>Use the price you really charge for a one-off. The saving has to be real.</small></div></form>',
      '<button type="button" class="btn big" id="setup-save">Save</button>');
    document.getElementById('setup-save').addEventListener('click', function () {
      var fd = new FormData(document.getElementById('setup-form'));
      ['me', 'street', 'neighbour', 'runDay'].forEach(function (k) { S[k] = String(fd.get(k) || '').trim(); });
      var c = parseInt(fd.get('callout'), 10), sv = parseInt(fd.get('saving'), 10), dr = parseInt(fd.get('drop'), 10);
      if (c > 0 && sv >= 0 && sv < c) S.prices[S.service] = { callout: c, saving: sv };
      if (dr >= 0) S.drop = dr;
      S.example = false; save(); closeSheet(); render(true); toast('Saved');
    });
  }
  function openLaw() {
    sheet('Knocking in Queensland', '<p class="muted">' + esc(C.qld.intro) + '</p><ul class="law">' +
      C.qld.points.map(function (p) { return '<li><b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span></li>'; }).join('') + '</ul>' +
      '<div class="stack-s">' + C.qld.links.map(function (l) { return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + '</a>'; }).join('') + '</div>');
  }
  function openProcess() {
    sheet('How he handles a no', '<p class="muted">He never argues an objection. Which process you use depends on one thing: is there a price on the table yet?</p>' + processHTML('front') + processHTML('back'));
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
    if (d.strategy) { S.strategy = d.strategy; save(); return render(true); }
    if (d.service) { S.service = d.service; save(); return render(true); }
    if (d.jump) { var s = document.getElementById(d.jump); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (d.way !== undefined) { S.ways[d.beat] = +d.way; save(); return render(true); }
    if (d.drillstage) { pending = d.drillstage; if (route === 'drill') render(); else location.hash = 'drill'; return; }
    if (d.startdoor) { pending = 'door'; if (route === 'drill') render(); else location.hash = 'drill'; return; }
    if (d.menu) return drillMenu();
    if (d.setlevel) { S.level = d.setlevel; save(); }
    if (d.level) { S.level = d.level; save(); document.querySelectorAll('[data-level]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.level === S.level); }); return; }
    if (d.mode) {
      if (d.mode === 'door') return doorPicker();
      if (d.mode === 'stage') return stagePicker();
      if (d.mode === 'obj') return objStart();
      if (d.mode === 'numbers') { N = {}; return numStart(); }
      return simList();
    }
    if (d.doorsvc) { S.service = d.doorsvc; save(); return startRun('door'); }
    if (d.run) return startRun(d.run, d.beat);
    if (d.oshow) { O.shown = true; Voice.stop(); return objRender(); }
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
    if (d.sshow) { document.getElementById('sim-c').innerHTML = simChoices(); return; }
    if (d.pick !== undefined) return simPick(+d.pick);
    if (d.snext) { if (d.snext === 'end') return simEnd(!!d.shut); M.i++; return simNode(); }
    if (t.id === 'voice') { S.voice = !S.voice; save(); t.setAttribute('aria-pressed', S.voice); if (!S.voice) Voice.stop(); return; }
    if (t.id === 'pushback') { S.pushback = !S.pushback; save(); return drillMenu(); }
    if (t.id === 'sayfirst') { S.sayFirst = !S.sayFirst; save(); t.setAttribute('aria-pressed', S.sayFirst); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (document.getElementById('sheet').open || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var note = e.target.closest && e.target.closest('.has-note');
    if (note && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (heldEl === note) hideHint(); else showHint(note); return; }
    if (e.key === 'Escape') hideHint();
    if (route === 'drill' && e.key === ' ' && e.target === document.body) {
      var b = document.getElementById('go');
      if (b) { e.preventDefault(); b.click(); }
    }
  });
  window.addEventListener('hashchange', function () { render(); });

  shell(); render();
})();
