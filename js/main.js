/* =========================================================
   Gold Tier Event Hall — site behaviour
   Progressive enhancement only: every feature below is
   optional, and the page works fully without JavaScript.
   ========================================================= */
(function () {
  'use strict';

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/644b17105177b805e35a689041f248f4';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Hidden _page field (so visitors return here) ---------- */
  var pageField = document.getElementById('pageField');
  if (pageField) {
    pageField.value = window.location.href;
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav || !toggle) { return; }
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeNav(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) { return; }
      if (!nav.contains(e.target) && !toggle.contains(e.target)) { closeNav(); }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) { return; }
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Active nav link highlighting ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('main section[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('#primaryNav a[href^="#"]')
  );

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var alertBox = document.getElementById('formAlert');
  var errorBox = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');

  function showConfirmation(scroll) {
    if (!alertBox) { return; }
    alertBox.hidden = false;
    if (errorBox) { errorBox.hidden = true; }
    if (scroll) {
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showError(message) {
    if (!errorBox) { return; }
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  /* Plain (no-JS style) submissions come back with ?submitted=1 */
  function hasSubmittedParam() {
    try {
      return new URLSearchParams(window.location.search).get('submitted') === '1';
    } catch (err) {
      return /[?&]submitted=1(&|$)/.test(window.location.search);
    }
  }

  if (hasSubmittedParam()) {
    showConfirmation(true);
    if (form) { form.reset(); }
  }

  function validate() {
    var ok = true;
    var firstBad = null;
    var required = ['name', 'phone', 'email'];

    required.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) { return; }
      var value = el.value.trim();
      var valid = value.length > 0;

      if (valid && id === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (valid && id === 'phone') {
        valid = (value.replace(/\D/g, '').length >= 7);
      }

      el.classList.toggle('invalid', !valid);
      if (!valid) {
        ok = false;
        if (!firstBad) { firstBad = el; }
      }
    });

    if (!ok && firstBad) { firstBad.focus(); }
    return ok;
  }

  if (form) {
    ['name', 'phone', 'email'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', function () { el.classList.remove('invalid'); });
      }
    });

    form.addEventListener('submit', function (e) {
      // Always keep _page current at submit time.
      if (pageField) { pageField.value = window.location.href; }

      if (!validate()) {
        e.preventDefault();
        showError('Please add your name, phone number and a valid email address so we can reply.');
        return;
      }

      // Honeypot: silently drop bot submissions.
      var gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        e.preventDefault();
        return;
      }

      if (!window.fetch) {
        // No fetch support: let the browser do a normal POST.
        return;
      }

      e.preventDefault();

      var data = new FormData(form);
      var payload = {};
      data.forEach(function (value, key) { payload[key] = value; });
      payload._page = window.location.href;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (errorBox) { errorBox.hidden = true; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) { throw new Error('Request failed: ' + res.status); }
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (json) {
          if (json && json.ok === false) { throw new Error('Submission rejected'); }
          form.reset();
          if (pageField) { pageField.value = window.location.href; }
          showConfirmation(true);
        })
        .catch(function () {
          showError(
            'Sorry — that didn’t go through. Please call us at (772) 555-0137 or email ' +
            'events@goldtiereventhall.com and we’ll take care of you right away.'
          );
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send my request';
          }
        });
    });
  }
})();
