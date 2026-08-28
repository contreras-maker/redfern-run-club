// Redfern Run Club — scroll reveal + count-up (progressive enhancement)

(function () {
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el) { el.classList.add('reveal-init'); });

  var trackDivider = document.querySelector('.track-divider');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
  if (trackDivider) observer.observe(trackDivider);

  // Count-up stats
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
