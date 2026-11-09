/* Stride Exterior Cleaning — results experience.
   Category filtering, full-screen comparison viewer, media parallax.
   Reads everything from the card markup (data-* attributes), so publishing a
   new job means adding one <article class="result-card">. Vanilla, no deps.
   Requires stride.js (window.StrideCompare) to load first. */
(function () {
  'use strict';

  var reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return reducedMq.matches; };
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var track = function (e, p) { if (window.strideTrack) window.strideTrack(e, p || {}); };
  var EASE = 'cubic-bezier(.16,.84,.44,1)';
  var EASE_OUT = 'cubic-bezier(.22,.61,.36,1)';
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var cancelAnims = function (el) { if (el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); };

  var ICON = {
    prev:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    next:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    knob:  '<span class="ba-knob"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></span>'
  };

  /* ------------------------------------------------------------ card data */
  function readCard(card) {
    var d = card.dataset;
    return {
      el: card,
      id: d.result,
      cats: (d.cats || '').split(/\s+/).filter(Boolean),
      catLabel: d.catLabel || '',
      title: d.title || '',
      desc: d.desc || '',
      place: d.place || '',
      kind: d.kind === 'job' ? 'job' : 'illustration',
      w: +d.w || 16, h: +d.h || 10,
      before: d.before, after: d.after,
      widths: (d.widths || '').split(',').map(Number).filter(Boolean),
      alt: d.alt || d.title || ''
    };
  }

  /* --------------------------------------------------------------- filters */
  function gallery() {
    var root = $('[data-results]');
    if (!root) return null;
    var grid = $('.results-grid', root);
    var cards = $$('.result-card', grid);
    var buttons = $$('[data-filter]', root);
    var scroller = $('.filters-scroll', root);
    var group = $('.filters', root);
    var pill = $('.filter-pill', root);
    var status = $('[data-filter-status]', root);
    var live = $('[data-filter-live]', root);
    var empty = $('[data-empty]', root);
    var bar = $('.filter-bar', root);
    var current = 'all', token = 0;

    var matches = function (card, cat) {
      return cat === 'all' || (card.dataset.cats || '').split(/\s+/).indexOf(cat) !== -1;
    };
    var labelFor = function (cat) {
      var b = buttons.filter(function (x) { return x.dataset.filter === cat; })[0];
      return b ? (b.dataset.label || b.firstChild.nodeValue.trim()) : '';
    };

    // counts come from the markup, so they can never drift from the cards
    buttons.forEach(function (b) {
      var n = cards.filter(function (c) { return matches(c, b.dataset.filter); }).length;
      var badge = $('.filter-count', b);
      if (badge) badge.textContent = n;
    });

    function movePill(instant) {
      var b = buttons.filter(function (x) { return x.getAttribute('aria-pressed') === 'true'; })[0];
      if (!b || !pill) return;
      if (instant) group.classList.add('no-pill');
      pill.style.setProperty('--x', b.offsetLeft + 'px');
      pill.style.setProperty('--w', b.offsetWidth + 'px');
      if (instant) { void pill.offsetWidth; group.classList.remove('no-pill'); }
      // keep the active chip in view on narrow screens
      if (scroller && scroller.scrollWidth > scroller.clientWidth) {
        var target = b.offsetLeft - (scroller.clientWidth - b.offsetWidth) / 2;
        scroller.scrollTo({ left: Math.max(0, target), behavior: instant || reduced() ? 'auto' : 'smooth' });
      }
    }

    function layoutWide(visible) {
      cards.forEach(function (c) { c.classList.remove('is-wide'); });
      if (visible.length % 2 === 1) visible[0].classList.add('is-wide');
    }

    function setStatus(n, cat) {
      var what = cat === 'all' ? '' : ' in ' + labelFor(cat);
      if (status) status.innerHTML = '<strong>' + n + '</strong> ' + (n === 1 ? 'result' : 'results') + what;
      if (live) live.textContent = n + (n === 1 ? ' result' : ' results') + what;
    }

    function syncUrl(cat) {
      try {
        var u = new URL(location.href);
        if (cat === 'all') u.searchParams.delete('service'); else u.searchParams.set('service', cat);
        history.replaceState(history.state, '', u.pathname + u.search + u.hash);
      } catch (_) {}
    }

    function apply(cat, animate) {
      var my = ++token;
      current = cat;
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === cat)); });
      movePill(!animate);

      var before = cards.filter(function (c) { return !c.hidden; });
      var after = cards.filter(function (c) { return matches(c, cat); });
      var leaving = before.filter(function (c) { return after.indexOf(c) === -1; });
      var staying = after.filter(function (c) { return before.indexOf(c) !== -1; });
      var entering = after.filter(function (c) { return before.indexOf(c) === -1; });
      var emptyWasShown = empty && !empty.hidden;

      setStatus(after.length, cat);
      if (empty) {
        var e1 = $('[data-empty-cat]', empty);
        var chip = buttons.filter(function (x) { return x.dataset.filter === cat; })[0];
        if (e1) e1.textContent = chip && chip.dataset.noun ? chip.dataset.noun : (labelFor(cat) || '').toLowerCase();
      }

      if (!animate || reduced()) {
        cards.forEach(function (c) { cancelAnims(c); c.hidden = after.indexOf(c) === -1; c.style.opacity = ''; });
        layoutWide(after);
        if (empty) empty.hidden = after.length > 0;
        return Promise.resolve();
      }

      // First: where the survivors are now
      var first = new Map();
      staying.forEach(function (c) { cancelAnims(c); first.set(c, c.getBoundingClientRect()); });

      var out = leaving.map(function (c) {
        cancelAnims(c);
        return c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.975)' }],
          { duration: 220, easing: EASE_OUT, fill: 'forwards' }).finished.catch(function () {});
      });
      if (emptyWasShown && after.length) {
        out.push(empty.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).finished.catch(function () {}));
      }

      return Promise.all(out).then(function () {
        if (my !== token) return;
        leaving.forEach(function (c) { c.hidden = true; cancelAnims(c); });
        entering.forEach(function (c) { c.hidden = false; });
        layoutWide(after);
        if (empty) { cancelAnims(empty); empty.hidden = after.length > 0; }

        // Last + Invert + Play for the survivors. A card that changed size
        // (wide <-> half) re-enters instead — scaling a photo would distort it.
        var delay = 0;
        staying.forEach(function (c) {
          var a = first.get(c), b = c.getBoundingClientRect();
          if (Math.abs(a.width - b.width) > 2) { entering.push(c); return; }
          var dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
            { duration: 620, easing: EASE });
        });
        entering.sort(function (x, y) { return cards.indexOf(x) - cards.indexOf(y); });
        entering.forEach(function (c) {
          c.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }],
            { duration: 700, delay: delay, easing: EASE, fill: 'backwards' });
          delay += 80;
        });
        if (empty && !empty.hidden && !emptyWasShown) {
          empty.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
            { duration: 560, easing: EASE });
        }
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.dataset.filter;
        if (cat === current) return;
        apply(cat, true);
        syncUrl(cat);
        track('results_filter', { service: cat });
        // bring the grid top into view if the visitor has scrolled deep into it
        var top = grid.getBoundingClientRect().top;
        var offset = (bar ? bar.offsetHeight : 0) + 90;
        if (top < 0) window.scrollTo({ top: window.scrollY + top - offset, behavior: reduced() ? 'auto' : 'smooth' });
      });
    });
    $$('[data-filter-reset]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var all = buttons.filter(function (x) { return x.dataset.filter === 'all'; })[0];
        if (all) { all.click(); all.focus({ preventScroll: true }); }
      });
    });
    // arrow-key movement between chips (one tab stop for the group)
    if (group) group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      var n = buttons[(i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length];
      n.focus(); n.click();
    });

    // sticky bar shadow
    if (bar && 'IntersectionObserver' in window) {
      var sentinel = document.createElement('div');
      sentinel.setAttribute('aria-hidden', 'true');
      sentinel.style.cssText = 'height:1px;margin-bottom:-1px';
      bar.parentNode.insertBefore(sentinel, bar);
      new IntersectionObserver(function (es) {
        bar.classList.toggle('is-stuck', !es[0].isIntersecting && es[0].boundingClientRect.top < 120);
      }, { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);
    }

    // initial state from ?service=
    var start = 'all';
    try {
      var q = new URL(location.href).searchParams.get('service');
      if (q && buttons.some(function (b) { return b.dataset.filter === q; })) start = q;
    } catch (_) {}
    apply(start, false);
    window.addEventListener('resize', function () { movePill(true); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(true); });

    return { visible: function () { return cards.filter(function (c) { return !c.hidden; }); } };
  }

  /* ---------------------------------------------------------------- viewer */
  function buildSources(item, fmt) {
    var list = function (base) {
      return item.widths.map(function (w) { return base + '-' + w + '.' + fmt + ' ' + w + 'w'; }).join(', ');
    };
    var biggest = function (base) { return base + '-' + item.widths[item.widths.length - 1] + '.' + fmt; };
    return { before: list(item.before), after: list(item.after), beforeSrc: biggest(item.before), afterSrc: biggest(item.after) };
  }

  function viewer(gal) {
    var openers = $$('[data-open]');
    if (!openers.length) return;

    var dlg = document.createElement('dialog');
    dlg.className = 'viewer';
    dlg.setAttribute('aria-labelledby', 'viewer-title');
    dlg.innerHTML =
      '<div class="viewer-bg" data-close-zone></div>' +
      '<div class="viewer-shell" tabindex="-1">' +
        '<div class="viewer-top">' +
          '<p class="viewer-count" aria-live="polite"><b data-v-i>1</b> / <span data-v-n>1</span></p>' +
          '<span class="spacer"></span>' +
          '<div class="viewer-nav">' +
            '<button type="button" class="viewer-btn" data-v-prev aria-label="Previous result">' + ICON.prev + '</button>' +
            '<button type="button" class="viewer-btn" data-v-next aria-label="Next result">' + ICON.next + '</button>' +
          '</div>' +
          '<button type="button" class="viewer-btn" data-v-close aria-label="Close full screen view">' + ICON.close + '</button>' +
        '</div>' +
        '<div class="viewer-stage" data-close-zone>' +
          '<div class="ba viewer-ba" data-viewer-ba>' +
            '<img class="ba-before" alt="" decoding="async">' +
            '<img class="ba-after" alt="" decoding="async">' +
            '<input class="ba-range" type="range" min="0" max="100" value="50" step="1" aria-label="Before and after comparison">' +
            '<div class="ba-handle" aria-hidden="true">' + ICON.knob + '</div>' +
            '<span class="ba-tag ba-tag-before">Before</span>' +
            '<span class="ba-tag ba-tag-after">After</span>' +
          '</div>' +
        '</div>' +
        '<div class="viewer-info">' +
          '<div><p class="viewer-cat" data-v-cat></p><h2 id="viewer-title" data-v-title></h2></div>' +
          '<div><p class="viewer-desc" data-v-desc></p><p class="viewer-flag" data-v-flag></p>' +
          '<p class="viewer-hint">Drag the handle to compare · ← → to move between results · Esc to close</p></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(dlg);

    var bg = $('.viewer-bg', dlg), shell = $('.viewer-shell', dlg);
    var stage = $('.viewer-stage', dlg), ba = $('[data-viewer-ba]', dlg);
    var top = $('.viewer-top', dlg), info = $('.viewer-info', dlg);
    var imgB = $('.ba-before', ba), imgA = $('.ba-after', ba);
    var btnPrev = $('[data-v-prev]', dlg), btnNext = $('[data-v-next]', dlg);
    var cmp = window.StrideCompare ? window.StrideCompare.init(ba, { intro: false }) : null;

    var items = [], index = 0, opener = null, busy = false;

    function cardsInScope() {
      if (gal) return gal.visible();
      return $$('.result-card[data-result]');
    }
    function fmtFor(card) {
      var img = card ? $('.ba-after', card) : null;
      var src = img && (img.currentSrc || '');
      if (/\.avif(\?|$)/.test(src)) return 'avif';
      return 'webp';
    }

    function fill(i) {
      index = (i + items.length) % items.length;
      var card = items[index], it = readCard(card);
      var fmt = fmtFor(card), s = buildSources(it, fmt);
      var cardBefore = $('.ba-before', card), cardAfter = $('.ba-after', card);

      ba.style.setProperty('--ar', (it.w / it.h).toFixed(4));
      // Fresh elements every time: an <img> whose src changes keeps painting the
      // OLD photo until the new one arrives, which could pair one job's "before"
      // with another job's "after" for a moment.
      var nb = freshImg('ba-before'), na = freshImg('ba-after');
      imgB.replaceWith(nb); imgA.replaceWith(na); imgB = nb; imgA = na;
      // show what's already loaded in the card instantly; the sharper file loads over it
      imgB.style.backgroundImage = cardBefore && cardBefore.currentSrc ? 'url("' + cardBefore.currentSrc + '")' : '';
      imgA.style.backgroundImage = cardAfter && cardAfter.currentSrc ? 'url("' + cardAfter.currentSrc + '")' : '';
      [imgB, imgA].forEach(function (im) { im.width = it.w; im.height = it.h; im.sizes = '100vw'; });
      imgB.srcset = s.before; imgB.src = s.beforeSrc; imgB.alt = (cardBefore && cardBefore.alt) || it.alt + ' — before';
      imgA.srcset = s.after;  imgA.src = s.afterSrc;  imgA.alt = (cardAfter && cardAfter.alt) || it.alt + ' — after';
      $('.ba-range', ba).setAttribute('aria-label', 'Compare before and after: ' + it.title);

      $('[data-v-i]', dlg).textContent = String(index + 1).padStart(2, '0');
      $('[data-v-n]', dlg).textContent = String(items.length).padStart(2, '0');
      $('[data-v-title]', dlg).textContent = it.title;
      $('[data-v-cat]', dlg).textContent = [it.catLabel, it.place].filter(Boolean).join(' · ');
      $('[data-v-desc]', dlg).textContent = it.desc;
      var flag = $('[data-v-flag]', dlg);
      flag.classList.toggle('is-job', it.kind === 'job');
      flag.textContent = it.kind === 'job'
        ? 'Stride job — photographed on site, before and after, from the same position.'
        : 'Illustration — one licensed stock photo with the “before” simulated. Not a Stride job.';
      var multi = items.length > 1;
      btnPrev.hidden = btnNext.hidden = !multi;

      // warm the neighbours
      if (multi) [index - 1, index + 1].forEach(function (k) {
        var n = readCard(items[(k + items.length) % items.length]), ns = buildSources(n, fmt);
        [ns.beforeSrc, ns.afterSrc].forEach(function (u) { var p = new Image(); p.src = u; });
      });
      try { history.replaceState(history.state, '', location.pathname + location.search + '#result-' + it.id); } catch (_) {}
      var dec = function (im) { return im.decode ? im.decode().catch(function () {}) : Promise.resolve(); };
      it.ready = Promise.race([Promise.all([dec(imgB), dec(imgA)]), wait(1400)]);
      return it;
    }

    function freshImg(cls) {
      var im = document.createElement('img');
      im.className = cls; im.decoding = 'async'; im.draggable = false; im.alt = '';
      return im;
    }

    function frameOf(card) { return card ? ($('.result-frame', card) || $('.ba', card)) : null; }
    function onScreen(r) { return r && r.bottom > 0 && r.top < window.innerHeight && r.width > 0; }

    function open(card, how) {
      if (busy || dlg.open) return;
      items = cardsInScope();
      var i = items.indexOf(card);
      if (i === -1) { items = [card]; i = 0; }
      opener = how && how.focusBack ? how.focusBack : document.activeElement;
      var startPos = card._compare ? card._compare.get() : ($('.ba', card) && $('.ba', card)._compare ? $('.ba', card)._compare.get() : 50);
      var it = fill(i);
      if (cmp) cmp.set(startPos);

      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', sbw + 'px');
      document.documentElement.classList.add('viewer-open');
      dlg.showModal();
      shell.focus({ preventScroll: true });
      track('results_viewer_open', { result: it.id });

      if (reduced()) return;
      busy = true;
      var from = frameOf(card), a = from && from.getBoundingClientRect(), b = ba.getBoundingClientRect();
      var anims = [
        bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EASE_OUT }),
        top.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'none' }], { duration: 520, delay: 160, easing: EASE, fill: 'backwards' }),
        info.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: 200, easing: EASE, fill: 'backwards' })
      ];
      if (onScreen(a) && b.width) {
        // grow out of the card: uniform scale only, so the photo never stretches
        var s = Math.max(a.width / b.width, a.height / b.height);
        var dx = (a.left + a.width / 2) - (b.left + b.width / 2);
        var dy = (a.top + a.height / 2) - (b.top + b.height / 2);
        anims.push(ba.animate([
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', borderRadius: (16 / s) + 'px' },
          { transform: 'none', borderRadius: '16px' }
        ], { duration: 640, easing: EASE }));
      } else {
        anims.push(ba.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 560, easing: EASE }));
      }
      Promise.all(anims.map(function (x) { return x.finished.catch(function () {}); })).then(function () { busy = false; });
    }

    function finishClose() {
      dlg.close();
      document.documentElement.classList.remove('viewer-open');
      document.documentElement.style.removeProperty('--sbw');
      try { history.replaceState(history.state, '', location.pathname + location.search); } catch (_) {}
      var card = items[index];
      var cardBa = card && $('.ba', card);
      if (cardBa && cardBa._compare && cmp) { cardBa._compare.interrupt(); cardBa._compare.set(cmp.get()); }
      var back = (card && $('.ba-expand', card)) || opener;
      if (back && back.focus) back.focus({ preventScroll: true });
      busy = false;
    }

    function close() {
      if (!dlg.open || busy) return;
      if (reduced()) { finishClose(); return; }
      busy = true;
      var card = items[index], to = frameOf(card);
      var a = to && to.getBoundingClientRect(), b = ba.getBoundingClientRect();
      var anims = [
        bg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, delay: 80, easing: EASE_OUT, fill: 'forwards' }),
        top.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }),
        info.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' })
      ];
      if (onScreen(a) && b.width) {
        var s = Math.max(a.width / b.width, a.height / b.height);
        var dx = (a.left + a.width / 2) - (b.left + b.width / 2);
        var dy = (a.top + a.height / 2) - (b.top + b.height / 2);
        anims.push(ba.animate([
          { transform: 'none', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 1, offset: .88 },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')', opacity: 0 }
        ], { duration: 560, easing: EASE, fill: 'forwards' }));
      } else {
        anims.push(ba.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.95)' }], { duration: 320, easing: EASE_OUT, fill: 'forwards' }));
      }
      Promise.all(anims.map(function (x) { return x.finished.catch(function () {}); })).then(function () {
        finishClose();
        anims.forEach(function (x) { x.cancel(); });
      });
    }

    function go(dir) {
      if (busy || items.length < 2) return;
      track('results_viewer_nav', { direction: dir > 0 ? 'next' : 'prev' });
      if (reduced()) { fill(index + dir); if (cmp) cmp.set(50); return; }
      busy = true;
      var outA = ba.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(' + (-dir * 36) + 'px)' }],
        { duration: 200, easing: EASE_OUT, fill: 'forwards' });
      var outI = info.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
      outA.finished.catch(function () {}).then(function () {
        var it = fill(index + dir);
        if (cmp) cmp.set(50);
        return it.ready;
      }).then(function () {
        outA.cancel(); outI.cancel();
        ba.animate([{ opacity: 0, transform: 'translateX(' + (dir * 44) + 'px)' }, { opacity: 1, transform: 'none' }],
          { duration: 520, easing: EASE });
        info.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
          { duration: 480, delay: 60, easing: EASE, fill: 'backwards' });
        busy = false;
      });
    }

    // wiring
    openers.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var card = b.closest('.result-card');
        if (card) open(card, { focusBack: b });
      });
    });
    btnPrev.addEventListener('click', function () { go(-1); });
    btnNext.addEventListener('click', function () { go(1); });
    $('[data-v-close]', dlg).addEventListener('click', close);
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    dlg.addEventListener('click', function (e) { if (e.target.hasAttribute && e.target.hasAttribute('data-close-zone')) close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.target.classList && e.target.classList.contains('ba-range')) return;   // slider owns its arrows
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });

    // deep link: /our-work/#result-<id> opens straight into the viewer
    var m = location.hash.match(/^#result-([\w-]+)$/);
    if (m) {
      var target = $('.result-card[data-result="' + m[1] + '"]');
      if (target && !target.hidden) {
        var go1 = function () { open(target, {}); };
        if (document.readyState === 'complete') setTimeout(go1, 200); else window.addEventListener('load', function () { setTimeout(go1, 200); });
      }
    }
  }

  /* ------------------------------------------------------- media parallax */
  function mediaParallax() {
    var nodes = $$('[data-ba-parallax]');
    if (!nodes.length || reduced()) return;
    var ticking = false;
    function frame() {
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 .. 1
        p = Math.max(-1, Math.min(1, p));
        n.style.setProperty('--py', (p * r.height * 0.06).toFixed(1) + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    window.addEventListener('resize', frame);
    frame();
  }

  function boot() {
    var gal = gallery();
    viewer(gal);
    mediaParallax();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
