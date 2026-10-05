/*
 * Nimbus's behaviour: a quick-actions menu when clicked, reactions to what the visitor does
 * (sections, search, penalties, idling), and the "show me around" tour that flies to each highlight.
 * Everything is scripted and local; nothing is sent anywhere. Depends on buddy.js (window.Buddy).
 */
(function () {
  'use strict';

  var Buddy = window.Buddy;
  if (!Buddy) return;

  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var Portfolio = window.Portfolio = window.Portfolio || {};
  var sky = function () { return window.Sky || { gather: function () {}, release: function () {}, burst: function () {} }; };
  var touring = false;

  /* =====================================================================
     Quick actions (click Nimbus)
     ===================================================================== */
  // Every fact comes straight from the resume or the page, so Nimbus never makes things up.
  var FACTS = [
    'Yash\'s RAG assistant at Uber searches 12,000 compliance documents in under 50 seconds.',
    'FlightSense learned from 7.07 million real flights.',
    'At Dell, Yash made a slow database query 6× faster: 2.1 s down to 340 ms.',
    'Yash\'s support assistant at Universal Courier answers 420 questions a month on its own.',
    'Yash built a football analysis system with YOLO that tracks players and the ball.',
    'Yash\'s ETL pipeline normalised 180 GB of shipment data every single day.',
    'Yash is a die-hard Manchester United fan. GGMU!'
  ];
  var factIndex = Math.floor(Math.random() * FACTS.length);
  var menuOpen = false;

  function chip(label, run) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'buddy-chip';
    b.textContent = label;
    b.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); run(); });
    return b;
  }

  function openMenu() {
    menuOpen = true;
    Buddy.button.setAttribute('aria-expanded', 'true');
    var wrap = document.createElement('div');
    wrap.className = 'buddy-menu';
    wrap.appendChild(chip('Show me around', function () { Portfolio.startTour(); }));
    wrap.appendChild(chip('Ask a question', function () { Portfolio.openPalette(); }));
    wrap.appendChild(chip('Tell me a fun fact', funFact));
    wrap.appendChild(chip('Contact Yash', function () {
      Portfolio.scrollTo(document.getElementById('contact')).then(function () {
        var note = document.getElementById('plane-note');
        if (note) note.focus({ preventScroll: true });
      });
    }));
    Buddy.set('wave');
    Buddy.say('Hi! What would you like to do?', { sticky: true, actions: wrap });
    wrap.firstChild.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    Buddy.button.setAttribute('aria-expanded', 'false');
    Buddy.hush();
    if (Buddy.state === 'wave') Buddy.set('idle');
  }

  function funFact() {
    factIndex = (factIndex + 1) % FACTS.length;
    Buddy.set('wave');
    Buddy.say(FACTS[factIndex], { ms: 6000 });
    settle('wave', 3000);
  }

  Buddy.button.addEventListener('click', function () {
    if (touring) return;
    if (menuOpen) closeMenu(); else openMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) { closeMenu(); Buddy.button.focus(); }
  });
  document.addEventListener('pointerdown', function (e) {
    if (menuOpen && !Buddy.el.contains(e.target)) closeMenu();
  });

  /* =====================================================================
     Reacting to the visitor
     ===================================================================== */
  // What Nimbus says the first time each section comes into view (once per visit, so it never nags).
  var SECTION_LINES = {
    top: ['wave', 'Hi! I\'m ' + Buddy.name + ', Yash\'s buddy. Click me anytime!'],
    about: ['reading', 'Short version: 3 years of backend + AI work.'],
    experience: ['reading', 'Uber RAG: 15 min → under 50 s. Nice.'],
    projects: ['wave', 'FlightSense got published on arXiv!'],
    skills: ['typing', 'Counting tools… 54 of them!'],
    'off-the-clock': ['wave', 'GGMU! Fancy a penalty?'],
    contact: ['wave', 'Send Yash a paper plane! ✈']
  };
  var seen = {};

  function settle(stateName, ms) {
    setTimeout(function () { if (!touring && Buddy.state === stateName) Buddy.set('idle'); }, ms || 3000);
  }

  root.addEventListener('stepchange', function (e) {
    var id = e.detail.section;
    if (touring || menuOpen || seen[id] || !SECTION_LINES[id]) return;
    seen[id] = true;
    var line = SECTION_LINES[id];
    // Stay quiet on phones: a speech bubble would cover the content there.
    if (Buddy.state === 'sleep' || Buddy.isCompact()) return;
    Buddy.set(line[0]);
    Buddy.say(line[1]);
    settle(line[0], 3600);
  });

  // Search palette: Nimbus types while you search.
  root.addEventListener('paletteopen', function () {
    if (!touring) { Buddy.hush(); Buddy.set('typing'); }
  });
  root.addEventListener('paletteclose', function () {
    if (!touring && Buddy.state === 'typing') Buddy.set('idle');
  });

  // Penalties: celebrate goals, sulk at saves.
  root.addEventListener('penalty', function (e) {
    var d = e.detail;
    var c = Buddy.center();
    if (d.goal) {
      Buddy.set('party');
      sky().burst(c.x, c.y);
      if (!touring) Buddy.say(d.done && d.goals === d.taken ? 'Perfect five! GGMU!' : 'GOAL!', { ms: 2000 });
    } else {
      Buddy.set('sad');
      if (!touring) Buddy.say('Noooo. Next one!', { ms: 2000 });
    }
    settle(Buddy.state, 2200);
  });

  // Spot-the-bug puzzle: cheer a solve, wince at a miss.
  root.addEventListener('puzzle', function (e) {
    if (touring) return;
    if (e.detail.solved) {
      Buddy.set(e.detail.byReveal ? 'wave' : 'party');
      Buddy.say(e.detail.byReveal ? 'Sneaky one, right? Now you know!' : 'Nice catch! You\'d make a great code reviewer.', { ms: 3200 });
      if (!e.detail.byReveal) { var c = Buddy.center(); sky().burst(c.x, c.y); }
      settle(Buddy.state, 2600);
    } else if (e.detail.misses === 1) {
      Buddy.set('sad');
      Buddy.say('Hmm, not that one!', { ms: 1800 });
      settle('sad', 1800);
    }
  });

  // Idle for a while → Nimbus dozes off and the clouds drift in around it. Any activity wakes it.
  var IDLE_MS = 30000;
  var idleTimer = 0;
  function wake() {
    if (Buddy.state === 'sleep') {
      Buddy.set('idle');
      sky().release();
      Buddy.say('Oh! I\'m up, I\'m up.', { ms: 1800 });
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(doze, IDLE_MS);
  }
  function doze() {
    if (touring || menuOpen) return;
    Buddy.hush();
    Buddy.set('sleep');
    var c = Buddy.center();
    sky().gather(c.x, c.y - 20);
  }
  ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, wake, { passive: true });
  });
  wake();

  /* =====================================================================
     "Show me around" tour
     ===================================================================== */
  var startBtn = document.getElementById('tour-start');
  if (!startBtn) return;

  var STEPS = [
    { target: '#tour-start', state: 'wave',
      say: 'Hi! I\'m ' + Buddy.name + '. Let me show you the best bits of Yash\'s work. Scroll or press Esc to take over anytime.' },
    { target: '#hl-uber', state: 'reading',
      say: 'Headline result: at Uber, Yash\'s RAG assistant cut policy lookups from 15 minutes to under 50 seconds.' },
    { target: '#uber-rag', state: 'reading',
      say: 'How: retrieval-augmented generation with LangChain, the OpenAI API and Pinecone, over 12,000 compliance documents.' },
    { target: '#paper-link', state: 'wave',
      say: 'He also co-authored FlightSense on arXiv: a flight-delay model with 0.879 AUC on 7.07 million flights.' },
    { action: 'search', state: 'typing',
      say: 'Got a specific question? The page can answer it. Watch me search for "kubernetes".' },
    { action: 'penalty', state: 'wave',
      say: 'Off the clock, Yash is a Manchester United fan. My turn to take a penalty!' },
    { target: '#plane-note', state: 'wave',
      say: 'That\'s the tour! Your move: write Yash a note and send it as a paper plane ✈' }
  ];

  var cancelled = false;

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, reducedMotion.matches ? Math.min(ms, 1500) : ms); });
  }
  function guard() { if (cancelled) throw new Error('tour-cancelled'); }
  function readingTime(t) { return Math.max(2800, t.length * 50); }

  var focused = null;
  function focusOn(el) {
    if (focused) focused.classList.remove('tour-focus');
    focused = el;
    if (el) el.classList.add('tour-focus');
  }

  var stopBtn = null;
  function controls(index) {
    var wrap = document.createElement('div');
    wrap.className = 'buddy-tour';
    var stepLabel = document.createElement('span');
    stepLabel.className = 'buddy-step';
    stepLabel.textContent = (index + 1) + ' / ' + STEPS.length;
    stopBtn = document.createElement('button');
    stopBtn.type = 'button';
    stopBtn.className = 'mini-btn';
    stopBtn.textContent = 'Stop tour';
    stopBtn.addEventListener('click', function () { endTour(true); });
    wrap.appendChild(stepLabel);
    wrap.appendChild(stopBtn);
    return wrap;
  }

  function narrate(index, message, stateName) {
    Buddy.set(stateName);
    Buddy.say(message, { sticky: true, actions: controls(index) });
  }

  async function visit(selector, index, step) {
    var el = document.querySelector(selector);
    if (!el) return;
    Buddy.hush();
    var r = el.getBoundingClientRect();
    var comfortablyVisible = r.top > 90 && r.bottom < window.innerHeight - 120;
    if (!comfortablyVisible) { await Portfolio.scrollTo(el); guard(); }
    focusOn(el);
    await Buddy.moveTo(el.getBoundingClientRect()); guard();
    narrate(index, step.say, step.state);
    await wait(readingTime(step.say)); guard();
  }

  async function runSearch(index, step) {
    focusOn(null);
    Buddy.hush();
    await Buddy.moveTo(null); guard();
    narrate(index, step.say, 'typing');
    await wait(2400); guard();
    Portfolio.openPalette();
    Buddy.set('typing');
    var input = document.getElementById('palette-input');
    var query = 'kubernetes';
    for (var i = 1; i <= query.length; i++) {
      input.value = query.slice(0, i);
      input.dispatchEvent(new Event('input'));
      await wait(120); guard();
    }
    await wait(2800); guard();
    Portfolio.closePalette();
  }

  async function runPenalty(index, step) {
    Buddy.hush();
    Portfolio.openPenalty({ focus: false });
    await Portfolio.scrollTo(document.getElementById('off-the-clock')); guard();
    focusOn(null);
    await Buddy.moveTo(document.querySelector('.pk-pitch').getBoundingClientRect()); guard();
    narrate(index, step.say, 'wave');
    await wait(2600); guard();
    var zones = document.querySelectorAll('[data-zone]');
    zones[Math.random() < 0.5 ? 0 : 2].click(); // aim for a top corner
    await wait(1400); guard();
    var scored = /GOAL/.test(document.querySelector('[data-status]').textContent);
    narrate(index, scored ? 'Top bins! Did you see that?!' : 'Saved! Even buddies miss sometimes.', scored ? 'party' : 'sad');
    await wait(2600); guard();
  }

  async function runTour() {
    if (touring) return;
    touring = true;
    cancelled = false;
    closeMenu();
    root.classList.add('touring');
    // Let the click that started the tour finish before treating input as "visitor took over".
    setTimeout(function () { if (touring) addInterruptListeners(); }, 0);

    try {
      for (var i = 0; i < STEPS.length; i++) {
        var s = STEPS[i];
        if (s.action === 'search') await runSearch(i, s);
        else if (s.action === 'penalty') await runPenalty(i, s);
        else await visit(s.target, i, s);
        if (i === 0 && stopBtn) stopBtn.focus({ preventScroll: true });
      }
      endTour(false);
    } catch (err) {
      if (!err || err.message !== 'tour-cancelled') throw err;
    }
  }

  function endTour(byUser) {
    if (!touring) return;
    var hadFocus = stopBtn && document.activeElement === stopBtn;
    touring = false;
    cancelled = true;
    removeInterruptListeners();
    root.classList.remove('touring');
    if (!document.getElementById('palette-overlay').hidden) Portfolio.closePalette();
    focusOn(null);
    Buddy.hush();
    Buddy.moveTo(null).then(function () {
      Buddy.set('wave');
      Buddy.say(byUser ? 'Okay, you drive! Click me anytime.' : 'Thanks for touring with me!', { ms: 3000 });
      settle('wave', 3000);
    });
    if (hadFocus || document.activeElement === document.body) startBtn.focus({ preventScroll: true });
  }

  /* The visitor can take over at any moment: scrolling, touching, clicking or pressing a key. */
  function onInterrupt(e) {
    if (e.type === 'keydown' && e.key !== 'Escape' && !/^(Arrow|Page|Home|End| )/.test(e.key)) return;
    if (e.type === 'pointerdown' && Buddy.el.contains(e.target)) return;
    endTour(true);
  }
  var INTERRUPTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  function addInterruptListeners() {
    INTERRUPTS.forEach(function (t) { window.addEventListener(t, onInterrupt, { capture: true, passive: true }); });
  }
  function removeInterruptListeners() {
    INTERRUPTS.forEach(function (t) { window.removeEventListener(t, onInterrupt, { capture: true, passive: true }); });
  }

  startBtn.addEventListener('click', runTour);
  window.addEventListener('resize', function () { if (touring && focused) Buddy.moveTo(focused.getBoundingClientRect()); });

  Portfolio.startTour = runTour;
})();
