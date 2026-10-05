/*
 * "Ask about Yash" palette (Ctrl/Cmd+K): a combobox that searches every passage on the page
 * (elements marked data-search) plus quick actions, and jumps to + highlights the source passage.
 */
(function () {
  'use strict';

  var overlay = document.getElementById('palette-overlay');
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-list');
  var countEl = document.getElementById('palette-count');
  if (!overlay || !input || !list || !window.PortfolioSearch) return;

  var EMAIL = 'yashkamerkar1407@gmail.com';
  var lastFocus = null;

  var ACTIONS = [
    { label: 'Download resume (PDF)', keywords: 'resume cv pdf download', run: function () {
      var a = document.querySelector('a[download]'); if (a) a.click();
    } },
    { label: 'Copy email address', hint: EMAIL, keywords: 'email contact copy mail reach hire', run: function () {
      copy(EMAIL);
    } },
    { label: 'Open LinkedIn', keywords: 'linkedin profile contact connect', href: 'https://www.linkedin.com/in/yash-kamerkar-3ab6181a4' },
    { label: 'Open GitHub', keywords: 'github code repos repositories', href: 'https://github.com/YashKamerkar14' },
    { label: 'Read the FlightSense paper on arXiv', keywords: 'arxiv paper publication research flightsense', href: 'https://arxiv.org/abs/2605.07364' },
    { label: 'Take the tour with Nimbus', keywords: 'tour nimbus buddy agent guide show around demo', run: function () { window.Portfolio.startTour(); } },
    { label: 'Spot the bug puzzle', keywords: 'puzzle bug game code n+1 challenge', run: function () {
      window.Portfolio.scrollTo(document.getElementById('puzzle'));
    } },
    { label: 'Take a penalty', keywords: 'football penalty game manchester united ggmu', run: function () { window.Portfolio.openPenalty(); } }
  ];

  var SUGGESTIONS = ['RAG', 'Kubernetes', 'Java microservices', 'latency', 'LLM', 'paper'];

  // Index every tagged passage once, lazily, on first open.
  var passages = null;
  var index = null;
  var actionIndex = null;

  var INLINE_TAGS = /^(A|ABBR|B|CODE|EM|I|MARK|SPAN|STRONG|SUB|SUP|TIME)$/;

  /** Like textContent, but keeps a space between block-level children (e.g. skill tags in a list). */
  function readableText(node) {
    if (node.nodeType === 3) return node.data;
    if (node.nodeType !== 1) return '';
    if (node.getAttribute('aria-hidden') === 'true') return ''; // decorative, e.g. margin notes
    var sep = INLINE_TAGS.test(node.tagName) ? '' : ' ';
    var out = '';
    for (var child = node.firstChild; child; child = child.nextSibling) {
      var isBlock = child.nodeType === 1 && !INLINE_TAGS.test(child.tagName);
      out += (isBlock ? ' ' : '') + readableText(child) + (isBlock ? ' ' : '');
    }
    return sep + out + sep;
  }

  function buildIndex() {
    passages = Array.prototype.map.call(document.querySelectorAll('[data-search]'), function (el, i) {
      if (!el.id) el.id = 'passage-' + i;
      var title = el.getAttribute('data-search');
      return {
        id: el.id, el: el, title: title,
        text: readableText(el).replace(/\s+/g, ' ').trim(),
        // Skill lists are keyword-dense; prefer the bullet that shows the skill being used.
        boost: title === 'Skills' ? 0.6 : 1
      };
    });
    index = window.PortfolioSearch.createIndex(passages);
    actionIndex = window.PortfolioSearch.createIndex(ACTIONS.map(function (a, i) {
      return { id: 'action-' + i, title: a.label, text: a.keywords, action: a };
    }));
  }

  var results = [];
  var selected = 0;

  function open() {
    if (!index) buildIndex();
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add('palette-open');
    window.Portfolio.lockScroll(true);
    document.documentElement.dispatchEvent(new CustomEvent('paletteopen'));
    input.value = '';
    update();
    input.focus();
  }

  function close() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('palette-open');
    window.Portfolio.lockScroll(false);
    document.documentElement.dispatchEvent(new CustomEvent('paletteclose'));
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function update() {
    var q = input.value.trim();
    if (!q) {
      results = ACTIONS.slice(0, 5).map(function (a) { return { kind: 'action', action: a }; });
      selected = 0;
      render(q);
      countEl.textContent = 'Try: ' + SUGGESTIONS.join(' · ');
      return;
    }
    var actionHits = actionIndex.search(q, 3).filter(function (r) { return r.score > 0.8; })
      .map(function (r) { return { kind: 'action', action: r.doc.action }; });
    var passageHits = index.search(q, 8).map(function (r) { return { kind: 'passage', hit: r }; });
    var message;
    if (passageHits.length) {
      message = passageHits.length + ' passage' + (passageHits.length === 1 ? '' : 's') + ' found. Enter to jump.';
    } else if (!window.PortfolioSearch.tokenize(q).length) {
      // Questions made only of filler words ("who is Yash?") get the overview.
      passageHits = overview();
      message = 'Here is the short version. Try a skill, company or tool for specifics.';
    } else {
      message = 'Nothing on the page matches “' + q + '”. Try a skill, company or tool.';
    }
    results = passageHits.concat(actionHits);
    selected = 0;
    render(q);
    countEl.textContent = message;
  }

  function overview() {
    return passages.filter(function (p) { return p.title === 'About'; })
      .map(function (p) { return { kind: 'passage', hit: { doc: p, score: 0, terms: [] } }; });
  }

  function render() {
    list.textContent = '';
    results.forEach(function (r, i) {
      var li = document.createElement('li');
      li.id = 'palette-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === selected));
      li.className = 'palette-item' + (r.kind === 'action' ? ' is-action' : '');

      var tag = document.createElement('span');
      tag.className = 'palette-tag';
      tag.textContent = r.kind === 'action' ? (r.action.href ? 'Link' : 'Action') : r.hit.doc.title;
      li.appendChild(tag);

      var body = document.createElement('span');
      body.className = 'palette-text';
      if (r.kind === 'action') {
        body.textContent = r.action.label;
        if (r.action.hint) {
          var hint = document.createElement('span');
          hint.className = 'palette-hint';
          hint.textContent = r.action.hint;
          body.appendChild(hint);
        }
      } else {
        appendHighlighted(body, snippet(r.hit.doc.text, r.hit.terms), r.hit.terms);
      }
      li.appendChild(body);

      li.addEventListener('mousedown', function (e) { e.preventDefault(); choose(i); });
      li.addEventListener('mousemove', function () { if (selected !== i) { selected = i; syncSelection(); } });
      list.appendChild(li);
    });
    syncSelection();
  }

  function syncSelection() {
    Array.prototype.forEach.call(list.children, function (li, i) {
      li.setAttribute('aria-selected', String(i === selected));
    });
    if (results.length) {
      input.setAttribute('aria-activedescendant', 'palette-opt-' + selected);
      var el = list.children[selected];
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  /** Trims long passages to a window around the first matched word. */
  function snippet(text, terms) {
    var MAX = 180;
    if (text.length <= MAX) return text;
    var words = text.split(' ');
    var first = 0;
    for (var i = 0; i < words.length; i++) {
      if (isMatch(words[i], terms)) { first = i; break; }
    }
    var start = Math.max(0, first - 6);
    var out = words.slice(start).join(' ');
    if (out.length > MAX) out = out.slice(0, MAX).replace(/\s+\S*$/, '') + '…';
    return (start > 0 ? '…' : '') + out;
  }

  function isMatch(word, terms) {
    var t = window.PortfolioSearch.tokenize(word);
    return t.length > 0 && t.some(function (x) { return terms.indexOf(x) >= 0; });
  }

  /** Appends text to `parent`, wrapping matched words in <mark>. Uses text nodes only (no innerHTML). */
  function appendHighlighted(parent, text, terms) {
    text.split(/(\s+)/).forEach(function (part) {
      if (/\S/.test(part) && isMatch(part, terms)) {
        var m = document.createElement('mark');
        m.textContent = part;
        parent.appendChild(m);
      } else {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  function choose(i) {
    var r = results[i];
    if (!r) return;
    close();
    if (r.kind === 'action') {
      if (r.action.href) window.open(r.action.href, '_blank', 'noopener');
      else r.action.run();
      return;
    }
    jumpTo(r.hit.doc.el);
  }

  /** Scrolls to a passage, reveals it if it was inside a collapsed/hidden region, and flashes it. */
  function jumpTo(el) {
    var collapsed = el.closest('details');
    if (collapsed) collapsed.open = true; // results can live in "show more" lists
    el.classList.add('in'); // in case reveal-on-scroll has not fired yet
    var section = el.closest('.reveal');
    if (section) section.classList.add('in');
    window.Portfolio.scrollTo(el);
    el.classList.remove('search-hit');
    void el.offsetWidth; // restart the highlight animation if the same passage is chosen twice
    el.classList.add('search-hit');
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  function copy(text) {
    var done = function () { window.Portfolio.toast('Email copied: ' + text); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy email:', text); });
    } else {
      window.prompt('Copy email:', text);
    }
  }

  input.addEventListener('input', update);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, results.length - 1); syncSelection(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); syncSelection(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(selected); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); } // keep focus inside the modal; arrows navigate
  });
  overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.hidden) open(); else close();
    } else if (e.key === '/' && overlay.hidden) {
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      open();
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-open-palette]'), function (btn) {
    btn.addEventListener('click', open);
  });

  // Show the right shortcut for the platform.
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  if (isMac) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-shortcut]'), function (k) { k.textContent = '⌘K'; });
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.openPalette = open;
  window.Portfolio.closePalette = close;
})();
