/*
 * Site-wide behaviour: smooth (weighted) scrolling, mobile menu, scroll progress /
 * active nav, reveal-on-scroll, cursor parallax + magnetic buttons, the architecture disclosure and a
 * toast helper. Shared helpers are exposed on window.Portfolio for the other scripts.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var NAV_OFFSET = -84;

  var Portfolio = window.Portfolio = window.Portfolio || {};

  /* ---------- Smooth scrolling (Lenis) ----------
     Native scrolling is kept for reduced-motion users and touch devices (Lenis leaves touch alone). */
  var lenis = null;
  if (window.Lenis && !reducedMotion.matches) {
    lenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: NAV_OFFSET }
    });
  }

  /**
   * Scrolls to an element or y-position and resolves when the scroll has settled.
   * @param {Element|number} target
   * @param {{immediate?: boolean}} [opts]
   */
  Portfolio.scrollTo = function (target, opts) {
    var immediate = (opts && opts.immediate) || reducedMotion.matches;
    return new Promise(function (resolve) {
      if (lenis) {
        lenis.scrollTo(target, {
          offset: typeof target === 'number' ? 0 : NAV_OFFSET,
          duration: immediate ? 0 : 1.2,
          immediate: immediate,
          force: true,
          onComplete: function () { resolve(); }
        });
        if (immediate) resolve();
        return;
      }
      var y = typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.pageYOffset + NAV_OFFSET;
      window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
      waitForScrollEnd().then(resolve);
    });
  };

  /** Resolves once the native scroll position has stopped changing (fallback when Lenis is off). */
  function waitForScrollEnd() {
    return new Promise(function (resolve) {
      var last = -1, still = 0;
      (function check() {
        var y = window.pageYOffset;
        still = y === last ? still + 1 : 0;
        last = y;
        if (still >= 6) resolve(); else setTimeout(check, 50);
      })();
    });
  }

  Portfolio.lockScroll = function (locked) {
    if (lenis) { if (locked) lenis.stop(); else lenis.start(); }
  };

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var navLinks = document.getElementById('nav-links');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  // Tapping anywhere outside the open menu closes it.
  document.addEventListener('pointerdown', function (e) {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---------- Scroll progress, back-to-top ---------- */
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('to-top');
  var ticking = false;

  function onScroll() {
    ticking = false;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
    toTop.classList.toggle('show', h.scrollTop > 600);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { Portfolio.scrollTo(0); });

  /* ---------- Active nav link + current agent step ---------- */
  var navMap = {};
  Array.prototype.forEach.call(navLinks.querySelectorAll('a[href^="#"]'), function (a) {
    navMap[a.getAttribute('href').slice(1)] = a;
  });
  var stepSections = document.querySelectorAll('[data-step]');
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        Object.keys(navMap).forEach(function (key) {
          navMap[key].classList.toggle('active', key === id);
          if (key === id) navMap[key].setAttribute('aria-current', 'true');
          else navMap[key].removeAttribute('aria-current');
        });
        root.dispatchEvent(new CustomEvent('stepchange', {
          detail: { step: entry.target.getAttribute('data-step'), section: id }
        }));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Array.prototype.forEach.call(stepSections, function (s) { sectionObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .mask-reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    // Map each observed element to the elements it reveals. Mask-reveal headings start fully
    // clipped (zero visible area), so they are triggered by their unclipped parent instead.
    var triggers = new Map();
    Array.prototype.forEach.call(revealEls, function (el) {
      var watch = el.classList.contains('mask-reveal') ? el.parentElement : el;
      if (!triggers.has(watch)) triggers.set(watch, []);
      triggers.get(watch).push(el);
    });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        triggers.get(entry.target).forEach(function (el) { el.classList.add('in'); });
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    triggers.forEach(function (_, watch) { revealObserver.observe(watch); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('in'); });
  }

  /* ---------- Cursor parallax + magnetic buttons (fine pointers only) ---------- */
  if (finePointer.matches && !reducedMotion.matches) {
    var depthEls = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    var target = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var parallaxRunning = false;

    window.addEventListener('pointermove', function (e) {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
      if (!parallaxRunning) { parallaxRunning = true; requestAnimationFrame(parallax); }
    }, { passive: true });

    // Eased toward the pointer so the motion feels weighted rather than twitchy; stops when settled.
    var parallax = function () {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      depthEls.forEach(function (el) {
        var d = Number(el.getAttribute('data-depth'));
        el.style.transform = 'translate3d(' + (current.x * d).toFixed(2) + 'px,' + (current.y * d).toFixed(2) + 'px,0)';
      });
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.0005) requestAnimationFrame(parallax);
      else parallaxRunning = false;
    };

    Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (dx * 10).toFixed(1) + 'px,' + (dy * 8).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Architecture disclosure ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.arch-toggle'), function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (lenis) lenis.resize();
    });
  });

  /* ---------- Toast ---------- */
  var toastEl = null;
  var toastTimer = 0;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  Portfolio.toast = toast;
  Portfolio.lenis = lenis;
})();
