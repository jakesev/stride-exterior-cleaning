/* Stride — site interaction layer. Vanilla, no dependencies. Everything
 * degrades to a working page without JavaScript. */
(function () {
  'use strict';
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var BASE = window.STRIDE_BASE || '';

  /* ------------------------------------------------------------ analytics */
  /* Vendor-agnostic: pushes to dataLayer (GTM-compatible) and forwards to gtag
     if present. Never sends personal data — only funnel structure. */
  function track(event, params) {
    var payload = { event: event };
    for (var k in (params || {})) if (params[k] !== undefined && params[k] !== '') payload[k] = params[k];
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
    if (window.STRIDE_DEBUG) console.log('[stride]', event, params || {});
  }
  window.strideTrack = track;

  /* First-touch attribution, attached to any lead sent this session. */
  try {
    if (!sessionStorage.getItem('stride-src')) {
      var q = new URLSearchParams(location.search), src = { landing: location.pathname, referrer: document.referrer ? new URL(document.referrer).hostname : '' };
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) { if (q.get(k)) src[k] = q.get(k).slice(0, 120); });
      sessionStorage.setItem('stride-src', JSON.stringify(src));
    }
  } catch (e) {}

  /* --------------------------------------------------------------- header */
  var hdr = $('[data-hdr]');
  var mbar = $('[data-mbar]');
  var footer = $('.ftr');
  function onScroll() {
    var y = scrollY;
    if (hdr) hdr.classList.toggle('is-stuck', y > 8);
    if (mbar) {
      var nearEnd = footer && footer.getBoundingClientRect().top < innerHeight - 40;
      mbar.classList.toggle('is-visible', y > innerHeight * 0.6 && !nearEnd);
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------- mobile menu */
  var menuBtn = $('[data-menu]'), sheet = $('[data-sheet]'), lastFocus = null;
  function setMenu(open) {
    if (!menuBtn || !sheet) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) { lastFocus = document.activeElement; setTimeout(function () { var a = $('a', sheet); if (a) a.focus(); }, 60); }
    else if (lastFocus) lastFocus.focus();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('is-open')) setMenu(false); });
    sheet.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button', sheet).concat([menuBtn]);
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    addEventListener('resize', function () { if (innerWidth > 1080 && sheet.classList.contains('is-open')) setMenu(false); });
  }

  /* -------------------------------------------------------------- reveals */
  var nodes = $$('[data-reveal],[data-stagger]');
  if (reduced.matches || !('IntersectionObserver' in window)) nodes.forEach(function (n) { n.classList.add('is-in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    nodes.forEach(function (n) { io.observe(n); });
    // Safety net: never leave content hidden if an observer callback is missed.
    setTimeout(function () { nodes.forEach(function (n) { var r = n.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) n.classList.add('is-in'); }); }, 1400);
  }

  /* ------------------------------------------------------- before / after */
  $$('[data-ba]').forEach(function (root) {
    var range = $('input[type=range]', root);
    if (!range) return;
    var set = function (v) { root.style.setProperty('--pos', v + '%'); range.setAttribute('aria-valuetext', Math.round(v) + '% after'); };
    range.addEventListener('input', function () { set(range.value); });
    range.addEventListener('change', function () { track('before_after_drag', {}); }, { once: true });
    set(range.value);
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    var nudge = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      nudge.disconnect();
      var start = performance.now(), keys = [50, 68, 36, 50];
      (function step(now) {
        var t = Math.min(1, (now - start) / 1600), seg = Math.min(2, Math.floor(t * 3)), lt = t * 3 - seg;
        var e = lt * lt * (3 - 2 * lt), v = keys[seg] + (keys[seg + 1] - keys[seg]) * e;
        set(v); range.value = Math.round(v);
        if (t < 1) requestAnimationFrame(step);
      })(start);
    }, { threshold: 0.6 });
    nudge.observe(root);
  });
  $$('[data-ba-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      var id = b.getAttribute('data-ba-tab');
      $$('[data-ba-tab]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('[data-ba-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-ba-panel') !== id; });
      $$('[data-ba-meta]').forEach(function (p) { p.hidden = p.getAttribute('data-ba-meta') !== id; });
      track('before_after_switch', { set: id });
    });
  });

  /* ------------------------------------------------------------ accordions */
  $$('.faq details').forEach(function (d) {
    var s = $('summary', d), body = $('.faq-body', d);
    if (!s || !body) return;
    s.addEventListener('click', function (e) {
      if (reduced.matches || !body.animate) return;
      e.preventDefault();
      if (!d.open) {
        d.open = true;
        var h = body.scrollHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,.61,.36,1)' });
        track('faq_open', { q: s.textContent.trim().slice(0, 60) });
      } else {
        var h2 = body.scrollHeight;
        body.animate([{ height: h2 + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.22,.61,.36,1)' }).onfinish = function () { d.open = false; };
      }
    });
  });
  if (location.hash) { var target = $(location.hash); if (target && target.tagName === 'DETAILS') target.open = true; }

  /* --------------------------------------------------------- process line */
  var proc = $('[data-process]');
  if (proc) {
    var line = $('.process-line', proc), steps = $$('.step', proc);
    var pf = function () {
      var r = proc.getBoundingClientRect();
      var p = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.8 - r.top) / Math.max(1, r.height)));
      if (line) line.style.setProperty('--progress', p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle('is-in', p >= (i + 0.3) / steps.length); });
    };
    addEventListener('scroll', pf, { passive: true }); pf();
  }

  /* ----------------------------------------------------------- index peek */
  var peek = $('[data-index-peek]');
  if (peek && matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    var pimg = $('img', peek), px = 0, py = 0, raf = 0;
    var move = function () { raf = 0; peek.style.left = px + 'px'; peek.style.top = py + 'px'; };
    $$('.index-row[data-peek]').forEach(function (row) {
      row.addEventListener('mouseenter', function () { pimg.src = row.getAttribute('data-peek'); peek.classList.add('is-on'); });
      row.addEventListener('mouseleave', function () { peek.classList.remove('is-on'); });
      row.addEventListener('mousemove', function (e) { px = e.clientX + 180; py = e.clientY; if (!raf) raf = requestAnimationFrame(move); });
    });
  }

  /* ---------------------------------------------------------- learn filter */
  var filter = $('[data-filter]');
  if (filter) {
    filter.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      var cat = b.getAttribute('data-cat');
      $$('[data-cat]', filter).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      $$('[data-filter-list] .arow').forEach(function (r) { r.hidden = cat !== 'all' && r.getAttribute('data-cat') !== cat; });
      track('learn_filter', { category: cat });
    });
  }

  /* ------------------------------------------------------------ faq search */
  var fs = $('[data-faq-search]');
  if (fs) {
    var count = $('[data-faq-count]');
    var items = $$('.faq details');
    var run = function () {
      var q = fs.value.trim().toLowerCase(), n = 0;
      items.forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) > -1;
        d.hidden = !hit; if (hit) n++;
        if (q && hit && q.length > 3) d.open = true;
      });
      $$('[data-faq-group]').forEach(function (g) { g.hidden = !$$('details:not([hidden])', g).length; });
      if (count) count.textContent = q ? n + (n === 1 ? ' question matches' : ' questions match') : '';
    };
    fs.addEventListener('input', run);
    fs.addEventListener('change', function () { if (fs.value.trim()) track('faq_search', { length: fs.value.trim().length }); });
  }

  /* ------------------------------------------------------------ toc active */
  var toc = $$('.toc a');
  if (toc.length && 'IntersectionObserver' in window) {
    var map = {};
    toc.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        toc.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[e.target.id]; if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    $$('.prose h2[id]').forEach(function (h) { tio.observe(h); });
  }

  /* ------------------------------------------------------------- tracking */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var where = a.closest('.hdr') ? 'header' : a.closest('.mbar') ? 'sticky_mobile' : a.closest('.story') ? 'hero' : a.closest('.ftr') ? 'footer' : a.closest('.cta') ? 'cta_band' : 'body';
    if (/\/quote\/$/.test(href)) track('quote_cta_click', { placement: where });
    else if (/\/book\/$/.test(href)) track('book_cta_click', { placement: where });
    else if (a.hasAttribute('data-guide')) track('guide_download', { guide: a.getAttribute('data-guide'), placement: where });
    else if (/^tel:/.test(href)) track('phone_click', { placement: where });
    else if (/^mailto:/.test(href)) track('email_click', { placement: where });
    else if (a.classList.contains('hot')) track('hotspot_click', { surface: a.getAttribute('data-hot') });
  });

  /* ------------------------------------------------------- the clean pass */
  /* Hero photo: a diagonal clean pass sweeps the pavers on arrival, scrolling
     finishes the job, and dragging hands control to the visitor. A light mist
     of droplets rides the leading edge. */
  var pass = $('[data-pass]');
  if (pass) {
    var range = $('[data-pass-range]', pass), mist = $('[data-pass-mist]', pass);
    var pos = parseFloat(range.value) || 34, shown = pos, user = false, auto = null, last = performance.now();
    var ctx = mist && mist.getContext ? mist.getContext('2d') : null, parts = [], rafP = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    var setPos = function (v) { shown = v; pass.style.setProperty('--pos', v.toFixed(2) + '%'); range.value = Math.round(v); range.setAttribute('aria-valuetext', Math.round(v) + '% cleaned'); };
    var size = function () { if (!ctx) return; mist.width = pass.clientWidth * dpr; mist.height = pass.clientHeight * dpr; };
    size(); addEventListener('resize', size);
    var emit = function (n) {
      if (!ctx || reduced.matches) return;
      var W = pass.clientWidth, H = pass.clientHeight, slope = Math.tan(24 * Math.PI / 180) * 0.58;
      for (var k = 0; k < n; k++) {
        var y = Math.random() * H, x = shown / 100 * W + (H * 0.58 - y) * slope;
        parts.push({ x: x + (Math.random() - 0.3) * 18, y: y, vx: 40 + Math.random() * 140, vy: -30 + Math.random() * 60, r: 0.6 + Math.random() * 2.2, life: 1 });
      }
      if (parts.length > 700) parts.splice(0, parts.length - 700);
    };
    var tick = function (now) {
      rafP = 0;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var moving = false;
      if (auto) {
        var t = Math.min(1, (now - auto.t0) / auto.dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        setPos(auto.from + (auto.to - auto.from) * e); emit(10); moving = true; if (t >= 1) { pos = auto.to; auto = null; }
      } else if (Math.abs(pos - shown) > 0.05) { setPos(shown + (pos - shown) * Math.min(1, dt * 9)); emit(6); moving = true; }
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, mist.width, mist.height);
        for (var k = parts.length - 1; k >= 0; k--) {
          var q = parts[k];
          q.life -= dt * 1.1; if (q.life <= 0) { parts.splice(k, 1); continue; }
          q.vy += 160 * dt; q.x += q.vx * dt; q.y += q.vy * dt;
          ctx.globalAlpha = q.life * 0.75;
          ctx.fillStyle = q.r > 1.8 ? '#ffffff' : '#cfe7fa';
          ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fill();
        }
        if (parts.length) moving = true;
      }
      if (moving) rafP = requestAnimationFrame(tick);
    };
    var kick = function () { if (!rafP) { last = performance.now(); rafP = requestAnimationFrame(tick); } };
    range.addEventListener('input', function () { user = true; auto = null; pos = parseFloat(range.value); setPos(pos); emit(8); kick(); });
    range.addEventListener('change', function () { track('hero_pass_drag', { value: Math.round(pos) }); }, { once: true });
    if (!reduced.matches) {
      setTimeout(function () { if (!user) { auto = { from: shown, to: 68, t0: performance.now(), dur: 2600 }; kick(); } }, 700);
      addEventListener('scroll', function () {
        if (user || auto) return;
        var r = pass.getBoundingClientRect(), p = Math.max(0, Math.min(1, -r.top / (r.height * 0.55)));
        var target = 68 + 32 * p;
        if (target > pos + 0.2 || target < pos - 0.2) { pos = Math.max(68, target); kick(); }
      }, { passive: true });
    } else { pos = 60; setPos(60); }
  }
})();
