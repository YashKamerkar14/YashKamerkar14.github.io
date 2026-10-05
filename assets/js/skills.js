/*
 * Skills as constellations.
 *
 * The skill cards in the HTML stay the source of truth (searchable, readable without JS). This script
 * reads them and draws each group as a constellation on an SVG star map. A star's brightness reflects
 * evidence, not self-rating: it grows with the number of roles/projects on this page where the skill
 * was actually used (USED_AT). Hover or tap a constellation (or its card button) to light it up.
 */
(function () {
  'use strict';

  var map = document.querySelector('[data-starmap]');
  if (!map) return;
  var svg = map.querySelector('svg');
  var tip = map.querySelector('.star-tip');
  var caption = document.getElementById('starmap-caption');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.skill-card[data-constellation]'));
  var SVG_NS = 'http://www.w3.org/2000/svg';

  // Where each skill appears in the experience and projects on this page (resume-sourced).
  var USED_AT = {
    'Python': ['Universal Courier', 'Dell', 'FlightSense', 'Earnings Analyzer'],
    'Java': ['Uber', 'Dell'],
    'SQL': ['Dell', 'InsightAgent', 'Earnings Analyzer'],
    'LangChain': ['Uber', 'Universal Courier'],
    'LangGraph': ['InsightAgent'],
    'OpenAI API': ['Uber', 'Universal Courier'],
    'Retrieval-Augmented Generation (RAG)': ['Uber', 'InsightAgent'],
    'Large Language Models (LLMs)': ['Uber', 'Universal Courier'],
    'BERT': ['Earnings Analyzer'],
    'scikit-learn': ['Universal Courier'],
    'Vector databases': ['Uber'],
    'FastAPI': ['Universal Courier', 'InsightAgent'],
    'Spring Boot': ['Uber', 'Dell'],
    'Spring MVC': ['Dell'],
    'Hibernate ORM': ['Dell'],
    'Pandas': ['Universal Courier', 'Dell'],
    'React.js': ['InsightAgent'],
    'JUnit 5': ['Dell'],
    'Mockito': ['Dell'],
    'PostgreSQL': ['Dell', 'InsightAgent'],
    'Oracle': ['Dell'],
    'Pinecone': ['Uber'],
    'Amazon Web Services (AWS)': ['FlightSense'],
    'Microsoft Azure': ['Universal Courier'],
    'Docker': ['Universal Courier', 'Dell'],
    'Kubernetes (K8s)': ['Dell'],
    'Jenkins': ['Universal Courier'],
    'CI/CD Pipelines': ['Universal Courier'],
    'REST APIs': ['Universal Courier', 'Dell'],
    'Microservices Architecture': ['Uber', 'Dell']
  };

  var groups = cards.map(function (card, i) {
    return {
      index: i,
      card: card,
      name: card.getAttribute('data-constellation'),
      category: card.querySelector('.skill-cat').textContent.trim(),
      button: card.querySelector('.constellation-btn'),
      skills: Array.prototype.map.call(card.querySelectorAll('.tag'), function (t) { return t.textContent.trim(); })
    };
  });

  var pinned = 1;   // start on the AI/ML constellation
  var shown = -1;
  var nodes = [];   // per group: { g }

  /** Small deterministic PRNG so the sky looks the same on every visit. */
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function el(name, attrs) {
    var n = document.createElementNS(SVG_NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  function usedAt(skill) { return USED_AT[skill] || []; }

  /** Lays out every constellation as a seeded random walk inside its own cell of the map. */
  function build() {
    var narrow = map.clientWidth < 640;
    var cols = narrow ? 2 : 3;
    var rows = Math.ceil(groups.length / cols);
    var cellW = narrow ? 300 : 340, cellH = narrow ? 250 : 230;
    var W = cols * cellW, H = rows * cellH;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (svg.lastChild && svg.lastChild.nodeName !== 'title') svg.removeChild(svg.lastChild);
    nodes = [];

    groups.forEach(function (g, gi) {
      var col = gi % cols, row = Math.floor(gi / cols);
      var x0 = col * cellW, y0 = row * cellH;
      var pad = 34;
      var rand = rng((gi + 1) * 9973);

      // Random walk that turns gently and stays inside the cell.
      var pts = [];
      var x = x0 + pad + rand() * cellW * 0.2, y = y0 + cellH * (0.35 + rand() * 0.35);
      var angle = -0.4 + rand() * 0.8;
      for (var i = 0; i < g.skills.length; i++) {
        pts.push({ x: x, y: y });
        angle += (rand() - 0.5) * 2.1;
        var step = 40 + rand() * 32;
        var nx = x + Math.cos(angle) * step, ny = y + Math.sin(angle) * step;
        if (nx < x0 + pad || nx > x0 + cellW - pad) { angle = Math.PI - angle; nx = x + Math.cos(angle) * step; }
        if (ny < y0 + pad + 24 || ny > y0 + cellH - pad) { angle = -angle; ny = y + Math.sin(angle) * step; }
        x = Math.min(x0 + cellW - pad, Math.max(x0 + pad, nx));
        y = Math.min(y0 + cellH - pad, Math.max(y0 + pad + 24, ny));
      }

      var group = el('g', { 'class': 'constellation', 'data-i': gi });

      // Lines: the walk itself plus a couple of cross-links so it reads as a figure, not a squiggle.
      var d = 'M' + pts.map(function (p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' L');
      for (var b = 3; b < pts.length; b += 4) {
        d += ' M' + pts[b].x.toFixed(1) + ' ' + pts[b].y.toFixed(1) + ' L' + pts[b - 3].x.toFixed(1) + ' ' + pts[b - 3].y.toFixed(1);
      }
      var path = el('path', { d: d, 'class': 'c-lines', pathLength: '1' });
      group.appendChild(path);

      pts.forEach(function (p, si) {
        var skill = g.skills[si];
        var evidence = usedAt(skill).length;
        var star = el('circle', {
          cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: (2.2 + Math.min(evidence, 4) * 1.15).toFixed(2),
          'class': 'c-star' + (evidence ? ' is-used' : '')
        });
        star.style.animationDelay = (rand() * 4).toFixed(2) + 's'; // CSSOM, so the CSP allows it
        star.dataset.skill = skill;
        group.appendChild(star);
        // Larger invisible hit area so small stars are easy to hover.
        var hit = el('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 12, 'class': 'c-hit' });
        hit.dataset.skill = skill;
        group.appendChild(hit);
      });

      var label = el('text', { x: x0 + pad, y: y0 + pad, 'class': 'c-name' });
      label.textContent = g.name;
      group.appendChild(label);
      svg.appendChild(group);
      nodes.push({ g: group });

      group.addEventListener('pointerenter', function () { show(gi); });
      group.addEventListener('click', function () { pin(gi); });
    });
    show(pinned, true);
  }

  function summary(g) {
    var places = [];
    g.skills.forEach(function (s) {
      usedAt(s).forEach(function (p) { if (places.indexOf(p) < 0) places.push(p); });
    });
    return g.name + ' · ' + g.category + ' · ' + g.skills.length + ' skills' +
      (places.length ? ' · used at ' + places.join(', ') : '');
  }

  function show(i, force) {
    if (i === shown && !force) return;
    shown = i;
    nodes.forEach(function (n, ni) { n.g.classList.toggle('is-active', ni === i); });
    groups.forEach(function (g, gi) {
      g.card.classList.toggle('is-active', gi === i);
      g.button.setAttribute('aria-pressed', String(gi === pinned));
    });
    caption.textContent = summary(groups[i]);
  }

  function pin(i) {
    pinned = i;
    show(i, true);
  }

  map.addEventListener('pointerleave', function () { hideTip(); show(pinned); });

  groups.forEach(function (g, gi) {
    g.button.addEventListener('click', function () { pin(gi); });
    g.card.addEventListener('pointerenter', function () { show(gi); });
    g.card.addEventListener('pointerleave', function () { show(pinned); });
  });

  /* ---------- Star tooltip ---------- */
  function hideTip() { tip.hidden = true; }
  svg.addEventListener('pointerover', function (e) {
    var skill = e.target.dataset && e.target.dataset.skill;
    if (!skill) return;
    var used = usedAt(skill);
    tip.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = skill;
    var sub = document.createElement('span');
    sub.textContent = used.length ? 'Used at ' + used.join(' · ') : 'In my toolkit';
    tip.appendChild(strong);
    tip.appendChild(sub);
    tip.hidden = false;
    var box = map.getBoundingClientRect();
    var r = e.target.getBoundingClientRect();
    var x = r.left + r.width / 2 - box.left, y = r.top - box.top;
    tip.style.left = Math.min(box.width - 10, Math.max(10, x)) + 'px';
    tip.style.top = y + 'px';
    tip.classList.toggle('flip', x > box.width - 160);
  });
  svg.addEventListener('pointerout', function (e) {
    if (e.target.dataset && e.target.dataset.skill) hideTip();
  });

  /* ---------- Draw the lines in when the map first scrolls into view ---------- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { map.classList.add('drawn'); obs.disconnect(); }
    }, { threshold: 0.25 }).observe(map);
  } else {
    map.classList.add('drawn');
  }

  var lastNarrow = null;
  function maybeRebuild() {
    var narrow = map.clientWidth < 640;
    if (narrow !== lastNarrow) { lastNarrow = narrow; build(); }
  }
  window.addEventListener('resize', maybeRebuild);
  maybeRebuild();
})();
