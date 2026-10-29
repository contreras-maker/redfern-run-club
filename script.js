// Redfern Run Club — count-up for the hero stats (progressive enhancement)

(function () {
  var statEls = document.querySelectorAll('.stat-number[data-count]');
  var statObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start = null;

        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 }
  );
  statEls.forEach(function (el) { statObserver.observe(el); });
})();

// Hero flow: a spring-chained ribbon that follows the pointer (drifts on its own when idle).
// Drawn at 1/4 size; CSS blurs and scales it up, so it stays cheap on phones.

(function () {
  var hero = document.querySelector('.hero-frame');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'flow-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.insertBefore(canvas, hero.firstChild);
  var ctx = canvas.getContext('2d');

  var SCALE = 0.25;
  var POINTS = 40;
  var SPRING = 0.15;
  var FRICTION = 0.25;
  var w = 0, h = 0, visible = true, moved = false;
  var pointer = { x: 0, y: 0 };
  var trail = [];
  for (var i = 0; i < POINTS; i++) trail.push({ x: 0, y: 0, dx: 0, dy: 0 });

  function resize() {
    var r = hero.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.round(r.width * SCALE));
    h = canvas.height = Math.max(1, Math.round(r.height * SCALE));
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a8a10');
    grad.addColorStop(0.75, '#fcff61');
    ctx.strokeStyle = grad;
    ctx.lineCap = 'round';
    trail.forEach(function (p) { p.x = w / 2; p.y = h / 2; p.dx = p.dy = 0; });
  }

  function aim(clientX, clientY) {
    var r = hero.getBoundingClientRect();
    pointer.x = (clientX - r.left) * SCALE;
    pointer.y = (clientY - r.top) * SCALE;
    moved = true;
  }
  window.addEventListener('mousemove', function (e) { aim(e.clientX, e.clientY); });
  window.addEventListener('touchmove', function (e) { aim(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  window.addEventListener('resize', resize);
  new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(hero);

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    if (!moved) {
      pointer.x = (0.5 + 0.3 * Math.cos(0.0006 * t) * Math.sin(0.0013 * t)) * w;
      pointer.y = (0.5 + 0.25 * Math.cos(0.0009 * t) + 0.1 * Math.cos(0.0021 * t)) * h;
    }
    ctx.clearRect(0, 0, w, h);
    trail.forEach(function (p, idx) {
      var prev = idx === 0 ? pointer : trail[idx - 1];
      var k = idx === 0 ? 0.4 * SPRING : SPRING;
      p.dx = (p.dx + (prev.x - p.x) * k) * FRICTION;
      p.dy = (p.dy + (prev.y - p.y) * k) * FRICTION;
      p.x += p.dx;
      p.y += p.dy;
    });
    var px = trail[0].x, py = trail[0].y;
    for (var i = 1; i < POINTS - 1; i++) {
      var xc = 0.5 * (trail[i].x + trail[i + 1].x);
      var yc = 0.5 * (trail[i].y + trail[i + 1].y);
      ctx.lineWidth = 3 * (POINTS - i);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      ctx.stroke();
      px = xc; py = yc;
    }
  }

  resize();
  requestAnimationFrame(frame);
})();
