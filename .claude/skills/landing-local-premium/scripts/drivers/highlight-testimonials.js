/* Standalone driver for HighlightTestimonialSection in the static export:
 * autoplay, dots, arrows and the highlight sweep, using the snapshot markup. */
(function () {
  var data = window.__LP_TESTIMONIALS || [];
  var root = document.querySelector('[data-slot="highlight-testimonial-section"]');
  if (!root || !data.length) return;
  var h2 = root.querySelector('[data-promoted]'), q = root.querySelector('[data-quote]');
  var author = root.querySelector('[data-author]'), role = author && author.nextElementSibling;
  var avatar = root.querySelector('figcaption span[aria-hidden="true"]');
  var dots = [].slice.call(root.querySelectorAll('[data-dot]'));
  var mark0 = q.querySelector('mark'), markCls = mark0 ? mark0.className : '';
  var act = '', inact = '';
  dots.forEach(function (d) { if (d.getAttribute('aria-pressed') === 'true') act = d.className; else inact = d.className; });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, cur = 0, paused = false;
  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function split(t, h) { var at = h ? t.toLowerCase().indexOf(h.toLowerCase()) : -1; return at < 0 ? [t, '', ''] : [t.slice(0, at), t.slice(at, at + h.length), t.slice(at + h.length)]; }
  function initials(n) { return n.split(/\s+/).filter(Boolean).slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join(''); }
  var authorBox = author.closest('div') && author.closest('div').parentElement;
  var busy = false;
  function render(i) {
    cur = (i + data.length) % data.length;
    var t = data[cur], p = split(t.quote, t.highlight);
    if (h2) { h2.textContent = '\u201c' + (p[1] || t.quote) + '\u201d'; h2.style.opacity = ''; }
    q.innerHTML = esc(p[0]) + (p[1] ? '<mark data-highlight class="' + markCls + '">' + esc(p[1]) + '</mark>' : '') + esc(p[2]);
    author.textContent = t.author; if (role) role.textContent = t.role || ''; if (avatar) avatar.textContent = initials(t.author);
    dots.forEach(function (d, k) { if (act && inact) d.className = k === cur ? act : inact; d.setAttribute('aria-pressed', String(k === cur)); });
  }
  function sweep() {
    var m = q.querySelector('mark'); if (!m) return;
    if (reduce || !m.animate) { m.style.backgroundSize = '100% 100%'; return; }
    m.animate([{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 700, delay: 150, easing: EASE, fill: 'both' });
  }
  function show(i, animate) {
    if (busy) return;
    var parts = [h2, q, authorBox].filter(Boolean);
    if (!animate || reduce || !q.animate) { render(i); sweep(); return; }
    busy = true;
    var outs = parts.map(function (el) { return el.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }); });
    outs[0].onfinish = function () {
      render(i);
      outs.forEach(function (a) { a.cancel(); });
      parts.forEach(function (el, k) { el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: k * 60, easing: EASE, fill: 'backwards' }); });
      sweep(); busy = false;
    };
  }
  dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k, true); }); });
  var prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
  if (prev) prev.addEventListener('click', function () { show(cur - 1, true); });
  if (next) next.addEventListener('click', function () { show(cur + 1, true); });
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });
  show(0, false);
  if (!reduce && data.length > 1) setInterval(function () { if (!paused) show(cur + 1, true); }, 6000);
})();
