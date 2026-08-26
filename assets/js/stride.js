/* Stride Exterior Cleaning — interaction layer.
   Vanilla, no dependencies, ~7KB. Everything degrades without JS. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isReduced = function () { return reduced.matches; };
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------- header */
  function header() {
    var el = $('.site-header');
    if (!el) return;
    var stuck = false;
    var onScroll = function () {
      var next = window.scrollY > 12;
      if (next !== stuck) { stuck = next; el.classList.toggle('is-stuck', stuck); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------- mobile menu */
  function mobileMenu() {
    var btn  = $('.nav-toggle');
    var menu = $('.mobile-menu');
    if (!btn || !menu) return;
    var lastFocus = null;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (open) {
        lastFocus = document.activeElement;
        $$('.mobile-nav a', menu).forEach(function (a, i) {
          a.style.animationDelay = (60 + i * 45) + 'ms';
        });
        var first = $('a, button', menu);
        if (first) setTimeout(function () { first.focus(); }, 60);
      } else if (lastFocus) {
        lastFocus.focus();
      }
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });
    // keep focus inside while open
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled])', menu).filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && menu.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------- sticky mobile CTA */
  function stickyCta() {
    var el = $('.mobile-cta');
    if (!el) return;
    var onScroll = function () {
      var past = window.scrollY > window.innerHeight * 0.7;
      var footer = $('.site-footer');
      var nearEnd = footer && footer.getBoundingClientRect().top < window.innerHeight - 40;
      el.classList.toggle('is-visible', past && !nearEnd);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------------------------------------------------- reveals */
  function reveals() {
    var nodes = $$('[data-reveal], [data-stagger]');
    if (!nodes.length) return;
    if (isReduced() || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });

    // Safety net: anything already on screen when the page settles is revealed
    // outright, so a missed observer callback can never leave content hidden.
    var sweep = function () {
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        if (n.classList.contains('is-in')) return;
        var r = n.getBoundingClientRect();
        if (r.top < vh * 0.95 && r.bottom > 0) { n.classList.add('is-in'); io.unobserve(n); }
      });
    };
    window.addEventListener('load', sweep);
    setTimeout(sweep, 1200);

    // Start fetching imagery a screen early. Masked reveals clip their children
    // to nothing until they fire, which would otherwise hold back the fetch and
    // leave the reveal animating over an empty frame.
    var early = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('img[loading="lazy"]', e.target).forEach(function (img) { img.loading = 'eager'; });
        early.unobserve(e.target);
      });
    }, { rootMargin: '700px 0px 700px 0px', threshold: 0 });
    nodes.forEach(function (n) { if ($('img', n)) early.observe(n); });
  }

  /* ------------------------------------------------------------- parallax */
  function parallax() {
    var nodes = $$('[data-parallax]');
    if (!nodes.length || isReduced()) return;
    var ticking = false;
    function frame() {
      var vh = window.innerHeight;
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var amount = parseFloat(n.getAttribute('data-parallax')) || 8;
        var progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
        n.style.transform = 'translate3d(0,' + (progress * amount * -1).toFixed(2) + '%,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }, { passive: true });
    frame();
  }

  /* ------------------------------------------------------- before / after */
  function beforeAfter() {
    $$('[data-ba]').forEach(function (root) {
      var range = $('.ba-range', root);
      if (!range) return;
      var set = function (v) { root.style.setProperty('--pos', v + '%'); };
      set(range.value);
      range.addEventListener('input', function () { set(range.value); });

      // one-time nudge so the control reads as draggable
      if (isReduced() || !('IntersectionObserver' in window)) return;
      var hinted = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting || hinted) return;
          hinted = true; io.disconnect();
          var start = performance.now(), from = 50, keys = [[0, 50], [0.38, 70], [0.72, 36], [1, 50]];
          var dur = 1700;
          (function step(now) {
            var t = Math.min(1, (now - start) / dur);
            var e2 = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            var v = from;
            for (var i = 1; i < keys.length; i++) {
              if (e2 <= keys[i][0]) {
                var span = keys[i][0] - keys[i - 1][0];
                var local = span ? (e2 - keys[i - 1][0]) / span : 0;
                var sm = local * local * (3 - 2 * local);
                v = keys[i - 1][1] + (keys[i][1] - keys[i - 1][1]) * sm;
                break;
              }
            }
            set(v.toFixed(1)); range.value = Math.round(v);
            if (t < 1) requestAnimationFrame(step);
          })(start);
        });
      }, { threshold: 0.55 });
      io.observe(root);
    });
  }

  /* ------------------------------------------------------------ accordion */
  function accordions() {
    $$('.faq details').forEach(function (d) {
      var summary = $('summary', d);
      var body = $('.faq-body', d);
      if (!summary || !body) return;
      body.style.height = d.open ? 'auto' : '0px';

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        var opening = !d.open;
        if (isReduced()) { d.open = opening; body.style.height = opening ? 'auto' : '0px'; return; }
        if (opening) {
          d.open = true;
          var h = body.scrollHeight;
          body.style.height = '0px';
          body.animate([{ height: '0px' }, { height: h + 'px' }],
            { duration: 380, easing: 'cubic-bezier(.22,.61,.36,1)' })
            .onfinish = function () { body.style.height = 'auto'; };
        } else {
          var h2 = body.scrollHeight;
          body.style.height = h2 + 'px';
          var a = body.animate([{ height: h2 + 'px' }, { height: '0px' }],
            { duration: 300, easing: 'cubic-bezier(.22,.61,.36,1)' });
          a.onfinish = function () { body.style.height = '0px'; d.open = false; };
        }
      });
    });
  }

  /* -------------------------------------------------------- process line */
  function processLine() {
    var track = $('[data-process]');
    if (!track) return;
    var line = $('.process-line', track);
    var steps = $$('.process-step', track);
    function frame() {
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.78 - r.top) / Math.max(1, r.height);
      p = Math.max(0, Math.min(1, p));
      if (line) line.style.setProperty('--progress', p.toFixed(3));
      steps.forEach(function (s, i) {
        var own = (i + 0.4) / steps.length;
        s.classList.toggle('is-in', p >= own);
      });
    }
    if (isReduced()) {
      if (line) line.style.setProperty('--progress', '1');
      steps.forEach(function (s) { s.classList.add('is-in'); });
      return;
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { frame(); ticking = false; }); }
    }, { passive: true });
    frame();
  }

  /* ----------------------------------------------------------- quote form */
  function quoteForm() {
    var form = $('[data-quote]');
    if (!form) return;

    var steps    = $$('.step', form);
    var fill     = $('.progress-fill', form);
    var label    = $('[data-step-label]', form);
    var counter  = $('[data-step-count]', form);
    var btnNext  = $('[data-next]', form);
    var btnBack  = $('[data-back]', form);
    var btnSend  = $('[data-send]', form);
    var status   = $('[data-form-status]', form);
    var cfg      = window.STRIDE_CONFIG || {};
    var i = 0;
    var files = [];

    var first = true;
    function show(n) {
      i = Math.max(0, Math.min(steps.length - 1, n));
      steps.forEach(function (s, idx) {
        s.classList.toggle('is-active', idx === i);
        s.hidden = idx !== i;
      });
      if (fill) fill.style.width = ((i + 1) / steps.length * 100) + '%';
      if (label) label.textContent = steps[i].getAttribute('data-label') || '';
      if (counter) counter.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
      if (btnBack) btnBack.hidden = i === 0;
      if (btnNext) btnNext.hidden = i === steps.length - 1;
      if (btnSend) btnSend.hidden = i !== steps.length - 1;
      if (i === steps.length - 1) buildSummary();
      var h = $('h2', steps[i]);
      if (h) {
        h.setAttribute('tabindex', '-1');
        if (!first) h.focus({ preventScroll: true });   // not on first paint
      }
      if (!first) {
        var top = form.getBoundingClientRect().top + window.scrollY - 110;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: isReduced() ? 'auto' : 'smooth' });
      }
      first = false;
    }

    function clearErrors(scope) {
      $$('.field.has-error', scope).forEach(function (f) { f.classList.remove('has-error'); });
      $$('.field-error', scope).forEach(function (e) { e.remove(); });
      $$('[data-choice-error]', scope).forEach(function (e) { e.remove(); });
    }

    function fail(field, msg) {
      var wrap = field.closest('.field') || field.parentElement;
      wrap.classList.add('has-error');
      var p = document.createElement('p');
      p.className = 'field-error'; p.textContent = msg;
      wrap.appendChild(p);
    }

    function validate() {
      var scope = steps[i];
      clearErrors(scope);
      var ok = true, firstBad = null;

      var group = $$('input[type="checkbox"][name="services"]', scope);
      if (group.length && !group.some(function (c) { return c.checked; })) {
        var p = document.createElement('p');
        p.className = 'field-error'; p.setAttribute('data-choice-error', '');
        p.textContent = 'Pick at least one area so we know what to quote.';
        $('.choice-grid', scope).insertAdjacentElement('afterend', p);
        ok = false; firstBad = group[0];
      }

      $$('[required]', scope).forEach(function (el) {
        var v = (el.value || '').trim();
        var bad = !v;
        if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        if (!bad && el.type === 'tel')  bad = v.replace(/[^\d]/g, '').length < 8;
        if (bad) {
          fail(el, el.getAttribute('data-error') || 'This one is needed.');
          ok = false; firstBad = firstBad || el;
        }
      });
      if (!ok && firstBad) firstBad.focus();
      return ok;
    }

    if (btnNext) btnNext.addEventListener('click', function () { if (validate()) show(i + 1); });
    if (btnBack) btnBack.addEventListener('click', function () { show(i - 1); });

    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'file') {
        e.preventDefault();
        if (i < steps.length - 1) { if (validate()) show(i + 1); }
      }
    });

    /* ---- photos ---- */
    var input = $('[data-files]', form);
    var zone  = $('.dropzone', form);
    var thumbs = $('.thumbs', form);

    function renderThumbs() {
      if (!thumbs) return;
      thumbs.innerHTML = '';
      files.forEach(function (f, idx) {
        var d = document.createElement('div');
        d.className = 'thumb';
        var img = document.createElement('img');
        img.alt = ''; img.src = URL.createObjectURL(f);
        img.onload = function () { URL.revokeObjectURL(img.src); };
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.setAttribute('aria-label', 'Remove photo ' + (idx + 1));
        rm.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
        rm.addEventListener('click', function () { files.splice(idx, 1); syncInput(); renderThumbs(); });
        d.appendChild(img); d.appendChild(rm); thumbs.appendChild(d);
      });
      var c = $('[data-file-count]', form);
      if (c) c.textContent = files.length ? files.length + (files.length === 1 ? ' photo added' : ' photos added') : '';
    }

    function syncInput() {
      if (!input || typeof DataTransfer === 'undefined') return;
      var dt = new DataTransfer();
      files.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
    }

    function addFiles(list) {
      Array.prototype.forEach.call(list, function (f) {
        if (!/^image\//.test(f.type)) return;
        if (f.size > 12 * 1024 * 1024) return;
        if (files.length >= 8) return;
        files.push(f);
      });
      syncInput(); renderThumbs();
    }

    if (input) input.addEventListener('change', function () { files = []; addFiles(input.files); });
    if (zone) {
      ['dragenter', 'dragover'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add('is-over'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove('is-over'); });
      });
      zone.addEventListener('drop', function (e) {
        if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
      });
    }

    /* ---- summary ---- */
    function buildSummary() {
      var list = $('[data-summary]', form);
      if (!list) return;
      var picked = $$('input[name="services"]:checked', form).map(function (c) {
        return (c.closest('.choice') && c.closest('.choice').textContent || c.value).trim();
      });
      var rows = [
        ['Cleaning', picked.join(', ') || '—'],
        ['Property', [val('suburb'), val('address')].filter(Boolean).join(' · ') || '—'],
        ['Photos', files.length ? files.length + ' attached' : 'None attached'],
        ['Contact', [val('name'), val('phone'), val('email')].filter(Boolean).join(' · ') || '—']
      ];
      list.innerHTML = rows.map(function (r) {
        return '<div class="summary-row"><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>';
      }).join('');
    }
    function val(n) { var el = form.elements[n]; return el ? (el.value || '').trim() : ''; }
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

    /* ---- submit ---- */
    form.addEventListener('submit', function (e) {
      if (!validate()) { e.preventDefault(); return; }
      var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
      var mode = cfg.formMode || 'none';

      if (mode === 'netlify' && !local) return;             // let the browser POST to Netlify

      e.preventDefault();
      if (status) {
        status.hidden = false;
        status.className = 'form-status form-status-warn';
        status.innerHTML = local && mode === 'netlify'
          ? '<strong>Preview mode.</strong> Enquiries are delivered once the site is published — nothing was sent just now.'
          : '<strong>Enquiries aren’t connected yet.</strong> Email us at <a href="mailto:' +
            (cfg.email || '') + '">' + (cfg.email || '') + '</a> and we’ll pick it up from there.';
        status.focus && status.focus();
        status.scrollIntoView({ block: 'center', behavior: isReduced() ? 'auto' : 'smooth' });
      }
    });

    show(0);
  }

  /* ---------------------------------------------------------------- misc */
  function year() {
    $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  function boot() {
    header(); mobileMenu(); stickyCta(); reveals(); parallax();
    beforeAfter(); accordions(); processLine(); quoteForm(); year();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
