/*
 * Nimbus, the fuzzy buddy: a small SVG character that lives in the bottom-left corner.
 *
 * window.Buddy API
 *   set(state)            idle | wave | typing | reading | party | sad | sleep | fly
 *   say(text, opts)       speech bubble; opts.ms (auto-hide, default 3800), opts.sticky, opts.actions (Node)
 *   hush()                hide the bubble
 *   moveTo(rect | null)   fly next to a DOMRect (or back home); resolves when it arrives
 *   center()              current centre point in viewport coordinates
 *
 * The character is decorative (aria-hidden); the wrapping button opens Nimbus's quick actions (agent.js).
 */
(function () {
  'use strict';

  var host = document.getElementById('buddy');
  if (!host) return;

  var NAME = 'Nimbus';
  var STATES = ['idle', 'wave', 'typing', 'reading', 'party', 'sad', 'sleep', 'fly'];
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MOVE_MS = 900;

  /* ---------- Markup ---------- */
  function fuzz() {
    // A ring of overlapping circles around the body reads as fluffy fur without any filters.
    var out = '';
    for (var i = 0; i < 46; i++) {
      var a = i / 46 * Math.PI * 2;
      out += '<circle cx="' + (150 + Math.cos(a) * 74).toFixed(1) + '" cy="' + (170 + Math.sin(a) * 68).toFixed(1) +
        '" r="' + (9 + (i * 7) % 5) + '"/>';
    }
    return out;
  }

  host.innerHTML =
    '<div class="buddy-bubble" id="buddy-bubble" role="status" hidden><p class="buddy-text"></p><div class="buddy-actions"></div></div>' +
    '<button type="button" class="buddy-btn" aria-label="' + NAME + ', Yash\'s buddy: quick actions" aria-expanded="false" aria-controls="buddy-bubble">' +
    '<svg class="buddy-svg" viewBox="40 60 220 210" aria-hidden="true" focusable="false">' +
      '<ellipse class="b-shadow" cx="150" cy="262" rx="58" ry="7"/>' +
      '<g class="b-fig"><g class="b-body">' +
        '<g class="b-fur">' + fuzz() + '</g>' +
        '<ellipse class="b-core" cx="150" cy="170" rx="74" ry="68"/>' +
        '<g class="b-eyes-open"><g class="b-pupils">' +
          '<ellipse class="b-eye" cx="126" cy="160" rx="7" ry="10"/><ellipse class="b-eye" cx="174" cy="160" rx="7" ry="10"/>' +
          '<circle class="b-shine" cx="128" cy="156" r="2.4"/><circle class="b-shine" cx="176" cy="156" r="2.4"/>' +
        '</g></g>' +
        '<g class="b-eyes-closed"><path d="M118 162 Q126 168 134 162"/><path d="M166 162 Q174 168 182 162"/></g>' +
        '<g class="b-eyes-happy"><path d="M118 164 Q126 152 134 164"/><path d="M166 164 Q174 152 182 164"/></g>' +
        '<g class="b-brows"><path d="M115 147 Q124 140 134 140"/><path d="M185 147 Q176 140 166 140"/></g>' +
        '<ellipse class="b-cheek" cx="108" cy="182" rx="12" ry="7"/><ellipse class="b-cheek" cx="192" cy="182" rx="12" ry="7"/>' +
        '<path class="b-mouth b-m-smile" d="M140 184 Q150 194 160 184"/>' +
        '<path class="b-mouth b-m-open" d="M138 182 Q150 204 162 182 Z"/>' +
        '<path class="b-mouth b-m-sad" d="M140 192 Q150 182 160 192"/>' +
        '<path class="b-mouth b-m-sleep" d="M145 189 Q150 191 155 189"/>' +
        '<ellipse class="b-limb b-arm-l" cx="78" cy="190" rx="12" ry="18"/>' +
        '<ellipse class="b-limb b-arm-r" cx="222" cy="186" rx="12" ry="18"/>' +
        '<ellipse class="b-limb" cx="124" cy="236" rx="16" ry="9"/><ellipse class="b-limb" cx="176" cy="236" rx="16" ry="9"/>' +
      '</g>' +
      '<g class="b-prop b-laptop"><path class="b-device" d="M92 222 L208 222 L222 246 L78 246 Z"/>' +
        '<rect class="b-keys" x="100" y="226" width="100" height="4" rx="2"/><rect class="b-keys" x="104" y="234" width="92" height="4" rx="2"/>' +
        '<ellipse class="b-limb b-tap" cx="118" cy="222" rx="12" ry="9"/><ellipse class="b-limb b-tap b-tap-2" cx="182" cy="222" rx="12" ry="9"/></g>' +
      '<g class="b-prop b-paper"><g transform="rotate(-6 150 224)"><rect class="b-sheet" x="104" y="196" width="92" height="56" rx="6"/>' +
        '<rect class="b-line b-line-accent" x="114" y="208" width="60" height="4" rx="2"/><rect class="b-line" x="114" y="218" width="70" height="4" rx="2"/>' +
        '<rect class="b-line" x="114" y="228" width="50" height="4" rx="2"/></g>' +
        '<ellipse class="b-limb" cx="104" cy="226" rx="11" ry="9"/><ellipse class="b-limb" cx="196" cy="218" rx="11" ry="9"/></g>' +
      '<g class="b-prop b-confetti"><circle cx="60" cy="96" r="6"/><circle cx="244" cy="86" r="6"/><circle cx="232" cy="134" r="5"/><circle cx="72" cy="142" r="5"/><circle cx="150" cy="76" r="5"/></g>' +
      '<g class="b-prop b-zz"><text x="212" y="112">z</text><text x="230" y="92">z</text></g>' +
      '<g class="b-prop b-tear"><path d="M198 168 Q203 178 198 182 Q193 178 198 168 Z"/></g>' +
      '</g>' +
    '</svg></button>';

  var bubble = host.querySelector('.buddy-bubble');
  var text = host.querySelector('.buddy-text');
  var actions = host.querySelector('.buddy-actions');
  var pupils = host.querySelector('.b-pupils');

  /* ---------- State ---------- */
  var state = 'idle';
  function set(next) {
    if (STATES.indexOf(next) < 0) return;
    state = next;
    host.setAttribute('data-state', next);
  }
  set('idle');

  /* ---------- Speech ---------- */
  var hideTimer = 0, talkTimer = 0;
  function say(message, opts) {
    opts = opts || {};
    text.textContent = message;
    actions.textContent = '';
    if (opts.actions) actions.appendChild(opts.actions);
    bubble.hidden = false;
    placeBubble();
    host.classList.add('talking');
    clearTimeout(talkTimer);
    talkTimer = setTimeout(function () { host.classList.remove('talking'); }, Math.min(2200, 300 + message.length * 28));
    clearTimeout(hideTimer);
    if (!opts.sticky) hideTimer = setTimeout(hush, opts.ms || 3800);
  }
  function hush() {
    clearTimeout(hideTimer);
    bubble.hidden = true;
    host.classList.remove('talking');
  }

  /**
   * Desktop: the bubble opens toward the middle of the screen.
   * Phones: it spans the screen width (minus a margin), above or below Nimbus, so it never overflows.
   */
  function placeBubble() {
    var c = center();
    var vw = window.innerWidth;
    if (isCompact()) {
      var EDGE = 12;
      host.classList.add('bubble-wide');
      host.classList.remove('bubble-left');
      host.classList.toggle('bubble-below', c.y < window.innerHeight / 2);
      bubble.style.left = Math.round(EDGE - (c.x - size() / 2)) + 'px';
      bubble.style.width = (vw - EDGE * 2) + 'px';
      return;
    }
    host.classList.remove('bubble-wide');
    bubble.style.left = '';
    bubble.style.width = '';
    // Away from home (tour), the bubble sits beside Nimbus at the same height.
    host.classList.toggle('bubble-side', !!pos);
    host.classList.toggle('bubble-left', c.x > vw * 0.6);
    host.classList.toggle('bubble-below', !pos && c.y < 220);
  }

  /* ---------- Position ---------- */
  var pos = null; // null = home
  var HOME_MARGIN = 14;
  var navActions = document.querySelector('.nav-actions');
  var navBar = document.querySelector('.site-nav');
  function size() { return host.offsetWidth || 84; }
  function isCompact() { return window.innerWidth < 760; }

  // Always positioned with a transform from the top-left, so flying home animates smoothly.
  function place(x, y) { host.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)'; }

  /**
   * Home is the bottom-left corner on larger screens. On phones (when the page has a nav bar) Nimbus
   * docks in the sticky nav, just left of the search/menu buttons, so it never covers any content.
   */
  function home() {
    var s = size();
    if (isCompact() && navActions && navBar) {
      return { x: navActions.getBoundingClientRect().left - s - 6, y: (navBar.offsetHeight - s) / 2, docked: true };
    }
    return { x: HOME_MARGIN, y: window.innerHeight - s - HOME_MARGIN, docked: false };
  }
  function goHome() {
    var h = home();
    host.classList.toggle('docked', h.docked);
    place(h.x, h.y);
  }

  function moveTo(rect) {
    return new Promise(function (resolve) {
      if (!rect) {
        pos = null;
        host.classList.remove('away');
        goHome();
      } else {
        var s = size(), vw = window.innerWidth, vh = window.innerHeight;
        // Perch just below the target (or above it if there's no room), so Nimbus and its bubble
        // never cover what they're pointing at.
        var x = Math.min(vw - s - 8, Math.max(8, rect.left - 6));
        var y = rect.bottom + 10;
        if (y + s > vh - 8) y = rect.top - s - 10;
        if (y < 76) y = Math.min(vh - s - 8, Math.max(76, rect.top + 12)); // very tall target
        pos = { x: x, y: y };
        host.classList.remove('docked');
        host.classList.add('away');
        place(x, y);
      }
      var prev = state;
      if (!reducedMotion.matches) set('fly');
      setTimeout(function () {
        if (state === 'fly') set(prev === 'fly' ? 'idle' : prev);
        if (!bubble.hidden) placeBubble();
        resolve();
      }, reducedMotion.matches ? 0 : MOVE_MS);
    });
  }

  /** Centre of where Nimbus is (or is flying to), so layout never depends on a transition mid-flight. */
  function center() {
    var s = size();
    var at = pos || home();
    return { x: at.x + s / 2, y: at.y + s / 2 };
  }

  /* ---------- Eyes follow the cursor ---------- */
  var look = { x: 0, y: 0 };
  var lookQueued = false;
  window.addEventListener('pointermove', function (e) {
    var c = center();
    look.x = Math.max(-1, Math.min(1, (e.clientX - c.x) / 260));
    look.y = Math.max(-1, Math.min(1, (e.clientY - c.y) / 260));
    if (!lookQueued) {
      lookQueued = true;
      requestAnimationFrame(function () {
        lookQueued = false;
        pupils.setAttribute('transform', 'translate(' + (look.x * 6).toFixed(1) + ' ' + (look.y * 5).toFixed(1) + ')');
      });
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (pos === null) goHome();
    if (!bubble.hidden) placeBubble();
  });
  goHome();
  // Enable movement transitions only after the first placement, so it doesn't fly in on load.
  setTimeout(function () { host.classList.add('ready'); }, 60);

  window.Buddy = {
    name: NAME,
    el: host,
    button: host.querySelector('.buddy-btn'),
    set: set,
    get state() { return state; },
    say: say,
    hush: hush,
    moveTo: moveTo,
    center: center,
    isHome: function () { return pos === null; },
    isCompact: isCompact
  };
})();
