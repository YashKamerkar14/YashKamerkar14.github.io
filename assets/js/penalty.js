/*
 * Penalty shootout mini-game (#GGMU).
 *
 * Six aim zones are real <button>s, so the game works with mouse, touch and keyboard.
 * The keeper commits to a column before the shot (like a real keeper guessing a side);
 * shots into the same column are saved, and top-corner shots occasionally clip the bar.
 */
(function () {
  'use strict';

  var game = document.querySelector('[data-penalty]');
  if (!game) return;

  var SHOTS = 5;
  var BAR_MISS_CHANCE = 0.15;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var ball = game.querySelector('[data-ball]');
  var keeper = game.querySelector('[data-keeper]');
  var zones = Array.prototype.slice.call(game.querySelectorAll('[data-zone]'));
  var scoreEl = game.querySelector('[data-score]');
  var dotsEl = game.querySelector('[data-dots]');
  var statusEl = game.querySelector('[data-status]');
  var resetBtn = game.querySelector('[data-reset]');

  // Target coordinates (SVG user units) for each zone: col 0..2, row 0 (top) / 1 (bottom).
  var ZONE_X = [70, 160, 250];
  var ZONE_Y = [52, 102];
  var KEEPER_X = [-78, 0, 78];
  var BALL_HOME = { x: 160, y: 190 };

  var state;

  function reset() {
    state = { taken: 0, goals: 0, busy: false, results: [] };
    render();
    statusEl.textContent = 'Pick a spot and shoot. ' + SHOTS + ' penalties.';
    placeBall(BALL_HOME.x, BALL_HOME.y, 1, false);
    moveKeeper(1, false);
    resetBtn.hidden = true;
    zones.forEach(function (z) { z.disabled = false; });
  }

  function render() {
    scoreEl.textContent = state.goals + ' / ' + state.taken;
    dotsEl.innerHTML = '';
    for (var i = 0; i < SHOTS; i++) {
      var dot = document.createElement('span');
      var r = state.results[i];
      dot.className = 'pk-dot' + (r === true ? ' is-goal' : r === false ? ' is-miss' : '');
      dotsEl.appendChild(dot);
    }
  }

  function placeBall(x, y, scale, animate) {
    ball.style.transition = animate && !reducedMotion.matches ? '' : 'none';
    ball.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
  }

  function moveKeeper(col, animate) {
    keeper.style.transition = animate && !reducedMotion.matches ? '' : 'none';
    var tilt = col === 1 ? 0 : col === 0 ? -28 : 28;
    keeper.style.transform = 'translate(' + KEEPER_X[col] + 'px,0) rotate(' + tilt + 'deg)';
  }

  function shoot(zone) {
    if (state.busy || state.taken >= SHOTS) return;
    state.busy = true;
    zones.forEach(function (z) { z.disabled = true; });

    var col = Number(zone.getAttribute('data-col'));
    var row = Number(zone.getAttribute('data-row'));
    var keeperCol = Math.floor(Math.random() * 3);
    var overBar = row === 0 && col !== 1 && Math.random() < BAR_MISS_CHANCE;
    var saved = !overBar && keeperCol === col;
    var goal = !overBar && !saved;

    moveKeeper(keeperCol, true);
    placeBall(ZONE_X[col], overBar ? 18 : ZONE_Y[row], 0.55, true);

    var delay = reducedMotion.matches ? 0 : 520;
    setTimeout(function () {
      state.taken++;
      if (goal) state.goals++;
      state.results.push(goal);
      render();
      statusEl.textContent = goal ? 'GOAL! Top bins.' : saved ? 'Saved! The keeper guessed right.' : 'Over the bar…';
      document.documentElement.dispatchEvent(new CustomEvent('penalty', {
        detail: { goal: goal, goals: state.goals, taken: state.taken, done: state.taken >= SHOTS }
      }));
      if (state.taken >= SHOTS) return finish();
      setTimeout(nextShot, reducedMotion.matches ? 0 : 900);
    }, delay);
  }

  function nextShot() {
    placeBall(BALL_HOME.x, BALL_HOME.y, 1, false);
    moveKeeper(1, false);
    state.busy = false;
    zones.forEach(function (z) { z.disabled = false; });
  }

  function finish() {
    var g = state.goals;
    var verdict = g === SHOTS ? 'Perfect. Glory Glory Man United!'
      : g >= 4 ? 'Clinical. Sir Alex would approve.'
      : g >= 3 ? 'Through on penalties. Just about.'
      : 'Unlucky. There\'s always next season.';
    statusEl.textContent = 'Full time: ' + g + ' of ' + SHOTS + '. ' + verdict;
    resetBtn.hidden = false;
    resetBtn.focus({ preventScroll: true });
  }

  zones.forEach(function (zone) {
    zone.addEventListener('click', function () { shoot(zone); });
  });
  resetBtn.addEventListener('click', reset);

  // The game stays collapsed until asked for, so it never gets in a skimming reader's way.
  var openBtn = document.getElementById('pk-open');

  function openGame(message, opts) {
    if (game.hidden) {
      game.hidden = false;
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      if (window.Portfolio.lenis) window.Portfolio.lenis.resize();
    }
    if (message) statusEl.textContent = message;
    if (opts && opts.focus === false) return;
    window.Portfolio.scrollTo(document.getElementById('off-the-clock'));
    zones[1].focus({ preventScroll: true });
  }

  if (openBtn) {
    openBtn.addEventListener('click', function () {
      var opening = game.hidden;
      game.hidden = !opening;
      openBtn.setAttribute('aria-expanded', String(opening));
      if (window.Portfolio.lenis) window.Portfolio.lenis.resize();
      if (opening) zones[1].focus({ preventScroll: true });
    });
  }

  // Easter egg: typing "ggmu" anywhere (outside form fields) jumps to the game.
  var buffer = '';
  document.addEventListener('keydown', function (e) {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-4);
    if (buffer === 'ggmu') {
      buffer = '';
      openGame('GGMU! Step up and take one.');
    }
  });

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.openPenalty = function (opts) {
    openGame(null, opts);
  };

  reset();
})();
