/*
 * Paper-plane contact: the visitor writes a note, it folds into a paper plane that glides across the
 * clouds toward the moon, then their own email app opens with the note pre-filled (a mailto: link).
 * Nothing is sent by this site; the visitor stays in control of their email.
 */
(function () {
  'use strict';

  var copyBtn = document.getElementById('email-copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var address = copyBtn.getAttribute('data-email');
      var done = function () {
        copyBtn.querySelector('.copy-label').textContent = 'Copied!';
        if (window.Portfolio && window.Portfolio.toast) window.Portfolio.toast('Email copied: ' + address);
        setTimeout(function () { copyBtn.querySelector('.copy-label').textContent = 'Copy'; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(done, function () { window.prompt('Copy email:', address); });
      } else {
        window.prompt('Copy email:', address);
      }
    });
  }

  var form = document.getElementById('plane-form');
  if (!form) return;

  var EMAIL = 'yashkamerkar1407@gmail.com';
  var SUBJECT = 'Hello from your portfolio';
  var SIGN_OFF = '\n\n(Sent by paper plane from yashkamerkar14.github.io)';

  var note = document.getElementById('plane-note');
  var error = document.getElementById('plane-error');
  var status = document.getElementById('plane-status');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var flying = false;

  function mailtoFor(text) {
    return 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent(SUBJECT) +
      '&body=' + encodeURIComponent(text + SIGN_OFF);
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    note.setAttribute('aria-invalid', 'true');
    note.focus();
  }

  note.addEventListener('input', function () {
    if (!error.hidden) { error.hidden = true; note.removeAttribute('aria-invalid'); }
  });

  /** Builds the plane and flies it from the note toward the moon (top right). Resolves on landing. */
  function fly() {
    return new Promise(function (resolve) {
      var r = note.getBoundingClientRect();
      var start = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      var end = { x: window.innerWidth * 0.86, y: window.innerHeight * 0.1 };
      var mid = { x: (start.x + end.x) / 2 + 60, y: Math.min(start.y, end.y) + (start.y - end.y) * 0.15 - 80 };

      var plane = document.createElement('div');
      plane.className = 'paper-plane';
      plane.setAttribute('aria-hidden', 'true');
      plane.innerHTML = '<svg viewBox="0 0 24 24"><path class="pp-body" d="M2 11.5 22 3l-6.5 18-3.4-7.1z"/>' +
        '<path class="pp-fold" d="M22 3 12.1 13.9 11 20l1.1-6.1"/></svg>';
      document.body.appendChild(plane);

      // The note card folds away first…
      note.animate([
        { transform: 'none', opacity: 1 },
        { transform: 'scale(.25) rotate(-10deg)', opacity: 0 }
      ], { duration: 420, easing: 'cubic-bezier(.5, 0, .75, 0)', fill: 'forwards' });

      // …then the plane takes off with a gentle arc.
      var at = function (p, s, rot, o) {
        return { transform: 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%, -50%) scale(' + s + ') rotate(' + rot + 'deg)', opacity: o };
      };
      var flight = plane.animate([
        at(start, 0.4, -10, 0),
        at(start, 1.1, -18, 1),
        at(mid, 0.9, -32, 1),
        at(end, 0.25, -46, 0)
      ], { duration: 1900, delay: 300, easing: 'cubic-bezier(.45, .05, .35, 1)', fill: 'forwards' });

      setTimeout(function () { if (window.Sky) window.Sky.burst(mid.x, mid.y); }, 1200);
      flight.onfinish = function () { plane.remove(); resolve(); };
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (flying) return;
    var text = note.value.trim();
    if (!text) { showError('Write a few words first, then send your plane.'); return; }

    flying = true;
    status.textContent = '';
    if (window.Buddy) {
      window.Buddy.set('wave');
      window.Buddy.say('Bon voyage! ✈', { ms: 2600 });
    }

    var launch = reducedMotion.matches || !note.animate ? Promise.resolve() : fly();
    launch.then(function () {
      window.location.href = mailtoFor(text);
      note.getAnimations().forEach(function (a) { a.cancel(); });
      note.value = '';
      status.textContent = 'Your email app should open with your note ready to send. ' +
        'If nothing opened, email ' + EMAIL + '.';
      flying = false;
    });
  });
})();
