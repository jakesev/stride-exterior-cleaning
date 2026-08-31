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

  /* -------------------------------------------------------------- analytics */
  /* Vendor-agnostic. Pushes to dataLayer (GTM-compatible) and forwards to gtag
     if one is present. No SDK is bundled and no personal data is ever sent —
     only structural facts about where someone is in the funnel. */
  function track(event, params) {
    var payload = {};
    for (var k in (params || {})) if (params[k] !== undefined && params[k] !== '') payload[k] = params[k];
    payload.event = event;
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
    if (window.STRIDE_DEBUG) console.log('[stride]', event, params || {});
  }
  window.strideTrack = track;

  function trackCtas() {
    $$('a[href$="/quote/"], a[href*="/quote/"]').forEach(function (a) {
      a.addEventListener('click', function () {
        track('quote_cta_click', {
          placement: a.closest('.site-header') ? 'header'
            : a.classList.contains('mobile-cta') ? 'sticky_mobile'
              : a.closest('.hero') ? 'hero'
                : a.closest('.site-footer') ? 'footer' : 'body',
          cta_text: (a.textContent || '').trim().slice(0, 40)
        });
      });
    });
    $$('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        track('phone_click', { placement: a.closest('.site-header') ? 'header' : 'body' });
      });
    });
    $$('a[href$="/our-work/"]').forEach(function (a) {
      a.addEventListener('click', function () { track('before_after_click', {}); });
    });
  }

  /* ----------------------------------------------------------- quote form */
  function quoteForm() {
    var form = $('[data-quote]');
    if (!form) return;

    var cfg     = window.STRIDE_CONFIG || {};
    var Q       = window.StrideQualify;
    var steps   = $$('.step', form);
    var fill    = $('.progress-fill', form);
    var label   = $('[data-step-label]', form);
    var counter = $('[data-step-count]', form);
    var btnNext = $('[data-next]', form);
    var btnBack = $('[data-back]', form);
    var btnSend = $('[data-send]', form);
    var status  = $('[data-form-status]', form);
    var i = 0, first = true, files = [], area = null, outsideArea = false;

    var field = function (n) { return form.querySelector('[data-field="' + n + '"]'); };
    var val   = function (n) { var el = form.elements[n]; return el && el.value ? el.value.trim() : ''; };
    var esc   = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
      });
    };
    var picked = function () {
      return $$('input[name="services"]:checked', form).map(function (c) { return c.value; });
    };
    var pickedLabels = function () {
      return $$('input[name="services"]:checked', form).map(function (c) {
        var t = c.parentElement.textContent || c.value; return t.trim();
      });
    };
    var radio = function (n) { var el = form.querySelector('input[name="' + n + '"]:checked'); return el ? el.value : ''; };
    var radioLabel = function (n) {
      var el = form.querySelector('input[name="' + n + '"]:checked');
      return el ? (el.parentElement.textContent || '').trim() : '';
    };

    /* ---------------------------------------------------------- step view */
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

      if (i === steps.length - 1) qualify();

      var h = $('h2', steps[i]);
      if (h) { h.setAttribute('tabindex', '-1'); if (!first) h.focus({ preventScroll: true }); }
      if (!first) {
        var top = form.getBoundingClientRect().top + window.scrollY - 110;
        if (window.scrollY > top) window.scrollTo({ top: top, behavior: isReduced() ? 'auto' : 'smooth' });
        track('quote_step_view', { step_name: steps[i].getAttribute('data-label'), step_number: i + 1 });
      }
      first = false;
    }

    /* --------------------------------------------------------- validation */
    function clearErrors(scope) {
      $$('.field.has-error, fieldset.has-error', scope).forEach(function (f) { f.classList.remove('has-error'); });
      $$('.field-error', scope).forEach(function (e) { e.remove(); });
    }
    function fail(el, msg) {
      var wrap = el.closest('.field') || el.closest('fieldset') || el.parentElement;
      wrap.classList.add('has-error');
      var p = document.createElement('p');
      p.className = 'field-error'; p.textContent = msg;
      wrap.appendChild(p);
    }
    function validate() {
      var scope = steps[i];
      clearErrors(scope);
      var ok = true, firstBad = null;

      if (i === 0 && !picked().length) {
        var grid = $('.choice-grid', scope);
        var p = document.createElement('p');
        p.className = 'field-error'; p.setAttribute('data-choice-error', '');
        p.textContent = 'Pick at least one thing you would like us to look at.';
        grid.insertAdjacentElement('afterend', p);
        ok = false; firstBad = $('input', grid);
      }

      $$('[required]', scope).forEach(function (el) {
        if (el.offsetParent === null && el.type !== 'hidden') return;   // hidden branch
        var v = (el.value || '').trim();
        var bad = !v;
        if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        if (!bad && el.type === 'tel') bad = v.replace(/[^\d]/g, '').length < 8;
        if (!bad && el.hasAttribute('data-postcode')) bad = !/^\d{4}$/.test(v);
        if (bad) { fail(el, el.getAttribute('data-error') || 'This one is needed.'); ok = false; firstBad = firstBad || el; }
      });

      if (!ok && firstBad) firstBad.focus();
      return ok;
    }

    /* ------------------------------------------------------ service area */
    var pc = $('[data-postcode]', form);
    var areaOut = $('[data-area-result]', form);
    var afterPc = $('[data-after-postcode]', form);

    function checkPostcode() {
      if (!pc || !Q || !cfg.areas) return;
      var v = (pc.value || '').trim();
      if (!/^\d{4}$/.test(v)) { areaOut.hidden = true; if (afterPc) afterPc.hidden = true; outsideArea = false; return; }
      area = Q.resolveArea(v, cfg.areas);
      areaOut.hidden = false;
      areaOut.className = 'area-result area-' + area.tier;
      areaOut.textContent = area.label ? area.message + ' (' + area.label + ')' : area.message;
      outsideArea = (area.tier === 'excluded' || area.tier === 'unknown');
      if (afterPc) afterPc.hidden = outsideArea;
      if (btnNext) {
        btnNext.firstChild.nodeValue = outsideArea ? 'Leave my details ' : 'Continue';
      }
      track('postcode_check', { postcode_result: area.tier });
    }
    if (pc) {
      pc.addEventListener('input', checkPostcode);
      pc.addEventListener('blur', checkPostcode);
    }

    /* -------------------------------------------------- conditional steps */
    function revealConditionals() {
      var sel = picked();
      $$('[data-when]', form).forEach(function (fs) {
        fs.hidden = sel.indexOf(fs.getAttribute('data-when')) === -1;
      });
    }

    /* --------------------------------------------------------- upsells */
    var upsellBox = $('[data-upsell]', form);
    function renderUpsells() {
      if (!upsellBox || !cfg.flow || !cfg.flow.upsells) return;
      var sel = picked();
      if (!sel.length) { upsellBox.hidden = true; upsellBox.innerHTML = ''; return; }
      var all = (cfg.flow.services.primary || []).concat(cfg.flow.services.more || []);
      var byId = {}; all.forEach(function (s) { byId[s.id] = s; });

      var prompt = '', suggest = [];
      for (var k = 0; k < sel.length; k++) {
        var u = cfg.flow.upsells[sel[k]];
        if (!u) continue;
        var avail = u.suggest.filter(function (id) { return sel.indexOf(id) === -1 && byId[id]; });
        if (avail.length) { prompt = u.prompt; suggest = avail.slice(0, 3); break; }
      }
      if (!suggest.length) { upsellBox.hidden = true; upsellBox.innerHTML = ''; return; }

      upsellBox.hidden = false;
      upsellBox.innerHTML = '<p class="upsell-prompt">' + esc(prompt) + '</p>' +
        '<div class="upsell-row">' + suggest.map(function (id) {
          return '<button type="button" class="upsell-add" data-add="' + esc(id) + '">' +
            '<span aria-hidden="true">+</span> ' + esc(byId[id].label) + '</button>';
        }).join('') + '</div>';
      track('upsell_view', { primary_service: sel[0], suggested_service: suggest.join('+') });
    }
    if (upsellBox) {
      upsellBox.addEventListener('click', function (e) {
        var b = e.target.closest('[data-add]');
        if (!b) return;
        var id = b.getAttribute('data-add');
        var input = form.querySelector('input[name="services"][value="' + id + '"]');
        if (input) {
          input.checked = true;
          track('upsell_add', { added_service: id });
          renderUpsells();
        }
      });
    }
    $$('input[name="services"]', form).forEach(function (c) {
      c.addEventListener('change', function () {
        track('service_select', { service: c.value, selected: c.checked });
        renderUpsells();
        revealConditionals();
      });
    });

    /* ----------------------------------------------------------- photos */
    var input = $('[data-files]', form);
    var zone = $('.dropzone', form);
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
        rm.addEventListener('click', function () { files.splice(idx, 1); syncFiles(); renderThumbs(); });
        d.appendChild(img); d.appendChild(rm); thumbs.appendChild(d);
      });
      var c = $('[data-file-count]', form);
      if (c) c.textContent = files.length ? files.length + (files.length === 1 ? ' photo added' : ' photos added') : '';
      var pcField = field('photoCount');
      if (pcField) pcField.value = String(files.length);
    }
    function syncFiles() {
      if (!input || typeof DataTransfer === 'undefined') return;
      var dt = new DataTransfer();
      files.forEach(function (f) { dt.items.add(f); });
      input.files = dt.files;
    }
    function addFiles(list) {
      var before = files.length;
      Array.prototype.forEach.call(list, function (f) {
        if (!/^image\//.test(f.type)) { track('photo_upload_error', { error_type: 'wrong_type' }); return; }
        if (f.size > 12 * 1024 * 1024) { track('photo_upload_error', { error_type: 'too_large' }); return; }
        if (files.length >= 8) return;
        files.push(f);
      });
      syncFiles(); renderThumbs();
      if (files.length > before) track('photo_upload_success', { file_count: files.length });
    }
    if (input) input.addEventListener('change', function () {
      track('photo_upload_start', { file_count: input.files.length });
      files = []; addFiles(input.files);
    });
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

    /* ---------------------------------------------------- qualification */
    function collectFlags() {
      var flags = {};
      $$('input[type="radio"]:checked[data-flag]', form).forEach(function (r) {
        flags[r.getAttribute('data-flag')] = true;
      });
      return flags;
    }
    function leadShape() {
      return {
        postcode: val('postcode'),
        services: picked(),
        propertyType: radio('propertyType'),
        storeys: radio('storeys'),
        improve: radio('improve'),
        timing: radio('timing'),
        photoCount: files.length,
        flags: collectFlags()
      };
    }
    function qualify() {
      if (!Q || !cfg.areas) return null;
      var lead = leadShape();
      var res = Q.qualifyLead(lead, cfg);
      var score = Q.scoreLead(lead, cfg);
      if (field('qualification')) field('qualification').value = res.outcome;
      if (field('reasons')) field('reasons').value = res.reasons.join(', ');
      if (field('area')) field('area').value = res.area ? res.area.tier : '';
      if (field('priority')) field('priority').value = String(score);
      return res;
    }

    /* ---------------------------------------------------------- nav */
    if (btnNext) btnNext.addEventListener('click', function () {
      if (!validate()) return;
      track('quote_step_complete', { step_name: steps[i].getAttribute('data-label'), step_number: i + 1 });
      show(i + 1);
    });
    if (btnBack) btnBack.addEventListener('click', function () {
      track('quote_back', { from_step: i + 1 });
      show(i - 1);
    });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'file') {
        e.preventDefault();
        if (i < steps.length - 1 && validate()) show(i + 1);
      }
    });

    /* -------------------------------------------------------- submit */
    var submitting = false;
    form.addEventListener('submit', function (e) {
      if (submitting) { e.preventDefault(); return; }
      if (!validate()) { e.preventDefault(); return; }

      var res = qualify();
      track('quote_submit', { services_count: picked().length });
      if (res) {
        track('qualification_result', { qualification_result: res.outcome });
        if (res.outcome === 'ONSITE_ASSESSMENT') {
          track('assessment_recommended', { trigger_reason: res.reasons.join('|') });
        }
      }

      var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
      var mode = cfg.formMode || 'none';

      if (mode === 'netlify' && !local) { submitting = true; return; }   // real POST

      e.preventDefault();
      track('quote_submit_error', { error_type: local ? 'preview_mode' : 'delivery_not_configured' });
      if (status) {
        status.hidden = false;
        status.className = 'form-status form-status-warn';
        status.innerHTML = local
          ? '<strong>Preview mode.</strong> Enquiries are delivered once the site is published — nothing was sent just now.'
          : '<strong>Enquiry delivery isn’t connected on this address yet.</strong> Please email us at <a href="mailto:' +
            (cfg.email || '') + '">' + (cfg.email || '') + '</a> and we’ll pick it up from there.';
        status.scrollIntoView({ block: 'center', behavior: isReduced() ? 'auto' : 'smooth' });
      }
    });

    var optional = $('[data-optional-details]', form);
    if (optional) optional.addEventListener('toggle', function () {
      if (optional.open) track('optional_details_open', {});
    });

    track('quote_start', { entry_point: document.referrer ? 'internal' : 'direct' });
    renderUpsells();
    revealConditionals();
    show(0);
  }

  /* ---------------------------------------------------------------- misc */
  function year() {
    $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  function boot() {
    header(); mobileMenu(); stickyCta(); reveals(); parallax();
    beforeAfter(); accordions(); processLine(); quoteForm(); trackCtas(); year();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
