/*
 * Night-clouds background (fixed canvas behind the page).
 *
 * Three depth layers of soft moonlit clouds drift slowly to the right. The night deepens as you
 * scroll and turns to sunrise at the Contact section. Nearer layers move faster and
 * shift more with scroll (parallax); the cursor gently parts nearby clouds. A faint moon glow and a few
 * static stars sit behind them. Each cloud is pre-rendered once to an offscreen sprite, so a frame is
 * just a handful of drawImage calls.
 *
 * window.Sky: gather(x, y) / release() pull clouds toward a point (Nimbus napping), burst(x, y) puffs
 * them away (celebrations). Reduced motion: drawn once, still.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('sky');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var CLOUD_RGB = '226, 222, 240';   // moonlit lavender-white
  var LAYERS = [                      // far → near
    { speed: 6, parallax: 0.04, alpha: 0.55, scale: 0.7 },
    { speed: 11, parallax: 0.09, alpha: 0.75, scale: 1 },
    { speed: 18, parallax: 0.16, alpha: 1, scale: 1.35 }
  ];
  var PART_RADIUS = 200;              // how far the cursor's influence reaches

  var W = 0, H = 0, dpr = 1;
  var clouds = [], stars = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var anchor = null;
  var running = false, rafId = 0, last = 0;

  function isStatic() {
    return reducedMotion.matches;
  }

  /**
   * Renders one cloud onto its own small canvas: many small soft puffs inside a flattened ellipse,
   * brighter toward the top (moonlit) and cut off along a soft, flat base like real cumulus.
   */
  function makeSprite(width, height) {
    var s = document.createElement('canvas');
    s.width = Math.ceil(width);
    s.height = Math.ceil(height);
    var g = s.getContext('2d');
    var puffs = 12 + Math.floor(Math.random() * 7);
    for (var i = 0; i < puffs; i++) {
      // Random point inside an ellipse, biased toward the middle.
      var a = Math.random() * Math.PI * 2;
      var d = Math.pow(Math.random(), 0.7);
      var px = width / 2 + Math.cos(a) * d * width * 0.36;
      var py = height * 0.55 + Math.sin(a) * d * height * 0.22 - (1 - Math.abs(px / width - 0.5) * 2) * height * 0.12;
      var r = height * (0.24 + Math.random() * 0.18) * (1 - d * 0.3);
      var lit = 1 - (py / height);                     // higher puffs catch more moonlight
      var core = (0.04 + lit * 0.05).toFixed(3);
      var grad = g.createRadialGradient(px, py - r * 0.25, 0, px, py, r);
      grad.addColorStop(0, 'rgba(' + CLOUD_RGB + ', ' + core + ')');
      grad.addColorStop(0.6, 'rgba(' + CLOUD_RGB + ', ' + (core * 0.45).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(' + CLOUD_RGB + ', 0)');
      g.fillStyle = grad;
      g.fillRect(px - r, py - r, r * 2, r * 2);
    }
    // Soft flat base: fade out the bottom quarter.
    g.globalCompositeOperation = 'destination-out';
    var base = g.createLinearGradient(0, height * 0.68, 0, height);
    base.addColorStop(0, 'rgba(0,0,0,0)');
    base.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = base;
    g.fillRect(0, height * 0.68, width, height * 0.32);
    return s;
  }

  function populate() {
    var compact = W < 760;
    var perLayer = compact ? [3, 3, 2] : [5, 5, 4];
    clouds = [];
    LAYERS.forEach(function (layer, li) {
      for (var i = 0; i < perLayer[li]; i++) {
        var w = (compact ? 280 : 460) * layer.scale * (0.75 + Math.random() * 0.5);
        var h = w * (0.38 + Math.random() * 0.12);
        clouds.push({
          layer: layer, sprite: makeSprite(w, h), w: w, h: h,
          x: Math.random() * (W + w) - w,
          baseY: Math.random() * (H + h) - h / 2,
          ox: 0, oy: 0, vx: 0, vy: 0
        });
      }
    });
    stars = [];
    for (var s = 0; s < (compact ? 40 : 90); s++) {
      stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 0.9 + 0.2, ph: Math.random() * 6 });
    }
  }

  function resize() {
    var first = !W;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var widthChanged = Math.abs(window.innerWidth - W) > 80;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (first || widthChanged) populate();
    if (isStatic()) draw(0);
  }

  /** On-screen y of a cloud after scroll parallax, wrapped so the sky never runs out. */
  function screenY(c) {
    var span = H + c.h * 2;
    var y = (c.baseY - window.pageYOffset * c.layer.parallax) % span;
    if (y < -c.h) y += span;
    return y;
  }

  function step(dt) {
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      c.x += c.layer.speed * dt;
      if (c.x > W + 20) c.x = -c.w - 20;

      // Cursor parts the clouds; a gather point draws them in. Springs pull offsets back to rest.
      var cx = c.x + c.ox + c.w / 2, cy = screenY(c) + c.oy + c.h / 2;
      var target = anchor || (pointer.active ? pointer : null);
      if (target) {
        var dx = cx - target.x, dy = cy - target.y, d = Math.hypot(dx, dy) || 1;
        if (anchor) {
          if (d > 120) { c.vx -= dx / d * 14 * dt; c.vy -= dy / d * 10 * dt; }
        } else if (d < PART_RADIUS + c.w / 3) {
          var push = (1 - d / (PART_RADIUS + c.w / 3)) * 160 * c.layer.scale;
          c.vx += dx / d * push * dt;
          c.vy += dy / d * push * dt;
        }
      }
      c.vx += -c.ox * 1.2 * dt;
      c.vy += -c.oy * 1.2 * dt;
      c.vx *= 0.92;
      c.vy *= 0.92;
      c.ox += c.vx * dt * 6;
      c.oy += c.vy * dt * 6;
    }
  }

  function smoothstep(a, b, x) {
    var t = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  /**
   * The page tells a small story: the night deepens as you scroll, then dawn breaks as the
   * Contact section ("Let's build something that ships.") comes into view.
   */
  var contact = document.getElementById('contact');
  function skyMood() {
    var doc = document.documentElement;
    var progress = window.pageYOffset / Math.max(1, doc.scrollHeight - H);
    var dawn = 0;
    if (contact) {
      var top = contact.getBoundingClientRect().top;
      dawn = smoothstep(H * 0.95, H * 0.05, top);
    }
    return { deep: smoothstep(0.08, 0.7, progress) * (1 - dawn), dawn: dawn };
  }

  var layer = document.createElement('canvas');
  var lctx = layer.getContext('2d');

  function draw(t) {
    var mood = skyMood();
    ctx.clearRect(0, 0, W, H);

    // Deep-night wash: the sky slowly gets bluer and deeper mid-page.
    if (mood.deep > 0.01) {
      ctx.fillStyle = 'rgba(16, 20, 46, ' + (0.42 * mood.deep).toFixed(3) + ')';
      ctx.fillRect(0, 0, W, H);
    }

    // Dawn: a warm horizon glow and a sun rising from below the fold.
    if (mood.dawn > 0.01) {
      var horizon = ctx.createLinearGradient(0, H, 0, H * 0.25);
      horizon.addColorStop(0, 'rgba(255, 150, 100, ' + (0.34 * mood.dawn).toFixed(3) + ')');
      horizon.addColorStop(0.45, 'rgba(240, 120, 150, ' + (0.13 * mood.dawn).toFixed(3) + ')');
      horizon.addColorStop(1, 'rgba(240, 120, 150, 0)');
      ctx.fillStyle = horizon;
      ctx.fillRect(0, 0, W, H);

      var sx = W * 0.5, sy = H + 170 - 250 * mood.dawn, sr = Math.max(W, H) * 0.32;
      var sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      sun.addColorStop(0, 'rgba(255, 214, 160, ' + (0.55 * mood.dawn).toFixed(3) + ')');
      sun.addColorStop(0.25, 'rgba(255, 176, 120, ' + (0.22 * mood.dawn).toFixed(3) + ')');
      sun.addColorStop(1, 'rgba(255, 176, 120, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, W, H);
    }

    // Moon glow, top right; it fades as the sun comes up.
    var night = 1 - mood.dawn;
    var mx = W * 0.82, my = H * 0.12;
    var moon = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(W, H) * 0.45);
    moon.addColorStop(0, 'rgba(232, 226, 245, ' + (0.07 * night).toFixed(3) + ')');
    moon.addColorStop(1, 'rgba(232, 226, 245, 0)');
    ctx.fillStyle = moon;
    ctx.fillRect(0, 0, W, H);

    // Stars (behind clouds), barely twinkling; they fade out at dawn.
    ctx.fillStyle = '#EEE8DC';
    for (var s = 0; s < stars.length; s++) {
      var st = stars[s];
      var tw = isStatic() ? 0.5 : 0.35 + 0.3 * Math.sin(t * 1.3 + st.ph);
      ctx.globalAlpha = tw * night;
      ctx.fillRect(st.x * W, (st.y * H - window.pageYOffset * 0.02 % H + H) % H, st.r, st.r);
    }
    ctx.globalAlpha = 1;

    // Clouds, far layer first. At dawn they're drawn on their own layer and tinted peach.
    var target = mood.dawn > 0.01 ? lctx : ctx;
    if (target === lctx) {
      if (layer.width !== canvas.width || layer.height !== canvas.height) {
        layer.width = canvas.width;
        layer.height = canvas.height;
      }
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, W, H);
    }
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      target.globalAlpha = c.layer.alpha;
      target.drawImage(c.sprite, c.x + c.ox, screenY(c) + c.oy, c.w, c.h);
    }
    target.globalAlpha = 1;
    if (target === lctx) {
      lctx.globalCompositeOperation = 'source-atop';
      lctx.fillStyle = 'rgba(255, 178, 140, ' + (0.6 * mood.dawn).toFixed(3) + ')';
      lctx.fillRect(0, 0, W, H);
      lctx.globalCompositeOperation = 'source-over';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(layer, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  // Battery: the sky drifts slowly, so 30fps is plenty while the visitor interacts and ~12fps
  // is plenty once they've been idle for a few seconds.
  var lastInput = performance.now();
  ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, function () { lastInput = performance.now(); }, { passive: true });
  });

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    var interval = now - lastInput > 5000 ? 1000 / 12 : 1000 / 30;
    if (last && now - last < interval) return;
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
    last = now;
    step(dt);
    draw(now / 1000);
  }

  function start() {
    if (running || isStatic() || document.hidden) return;
    running = true;
    last = 0;
    rafId = requestAnimationFrame(frame);
  }
  function stop() { cancelAnimationFrame(rafId); running = false; }
  function refresh() { if (isStatic()) { stop(); draw(0); } else start(); }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });
  document.addEventListener('pointerleave', function () { pointer.active = false; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else refresh(); });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', refresh);
  window.addEventListener('scroll', function () { if (isStatic()) draw(0); }, { passive: true });

  // Sprites are built from canvas gradients sized to the viewport, so build them after layout.
  resize();
  refresh();

  window.Sky = {
    gather: function (x, y) { anchor = { x: x, y: y }; },
    release: function () { anchor = null; },
    /** Puffs nearby clouds outward from a point. */
    burst: function (x, y) {
      clouds.forEach(function (c) {
        var dx = c.x + c.w / 2 - x, dy = screenY(c) + c.h / 2 - y, d = Math.hypot(dx, dy) || 1;
        if (d < 600) { c.vx += dx / d * 120; c.vy += dy / d * 80; }
      });
    }
  };
})();
