/*
 * Loaded synchronously in <head>: flags that JavaScript is running before first paint, so
 * reveal-on-scroll content can start hidden without a flash (no-JS visitors see everything).
 */
document.documentElement.classList.add('js');
