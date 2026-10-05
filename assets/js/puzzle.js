/*
 * "Spot the bug": each code line is a button. The correct line is the N+1 query inside the loop.
 * Wrong picks get a hint (and, after two misses, a "show me" option); the right pick reveals the
 * explanation, the fix and the real result from Yash's Dell work. Nimbus reacts via a 'puzzle' event.
 */
(function () {
  'use strict';

  var puzzle = document.querySelector('[data-puzzle]');
  if (!puzzle) return;

  var lines = Array.prototype.slice.call(puzzle.querySelectorAll('[data-line]'));
  var status = puzzle.querySelector('[data-puzzle-status]');
  var answer = puzzle.querySelector('[data-puzzle-answer]');
  var reveal = puzzle.querySelector('[data-puzzle-reveal]');
  var reset = puzzle.querySelector('[data-puzzle-reset]');
  var misses = 0;
  var solved = false;

  var HINTS = [
    'Not that one. Hint: count how many times this function talks to the database.',
    'Close, but no. Think about what happens when there are 10,000 orders.'
  ];

  function emit(detail) {
    document.documentElement.dispatchEvent(new CustomEvent('puzzle', { detail: detail }));
  }

  function solve(byReveal) {
    solved = true;
    lines.forEach(function (l) {
      l.disabled = true;
      l.classList.toggle('is-bug', l.hasAttribute('data-bug'));
    });
    status.textContent = byReveal ? 'Here it is: line 5.' : 'You got it! Line 5 is the bug.';
    answer.hidden = false;
    reveal.hidden = true;
    reset.hidden = false;
    emit({ solved: true, byReveal: !!byReveal });
  }

  lines.forEach(function (line) {
    line.addEventListener('click', function () {
      if (solved) return;
      if (line.hasAttribute('data-bug')) { solve(false); return; }
      misses++;
      line.classList.remove('is-miss');
      void line.offsetWidth; // restart the shake animation on repeated misses
      line.classList.add('is-miss');
      status.textContent = HINTS[Math.min(misses, HINTS.length) - 1];
      if (misses >= 2) reveal.hidden = false;
      emit({ solved: false, misses: misses });
    });
  });

  reveal.addEventListener('click', function () { solve(true); });

  reset.addEventListener('click', function () {
    solved = false;
    misses = 0;
    lines.forEach(function (l) { l.disabled = false; l.classList.remove('is-bug', 'is-miss'); });
    status.textContent = '';
    answer.hidden = true;
    reveal.hidden = true;
    reset.hidden = true;
    lines[0].focus();
  });
})();
