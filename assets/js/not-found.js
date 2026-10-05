/* 404 page: Nimbus looks sad, then points the visitor home. */
(function () {
  'use strict';
  if (!window.Buddy) return;
  window.Buddy.set('sad');
  window.Buddy.say('I looked everywhere. Try the homepage?', { ms: 6000 });
  setTimeout(function () { window.Buddy.set('idle'); }, 4000);
})();
