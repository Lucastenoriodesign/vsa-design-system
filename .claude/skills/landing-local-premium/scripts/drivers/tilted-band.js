/* Standalone re-implementation of TiltedGridHero's band for the static export.
 * Config: window.__LP_BAND_CFG (same values as the React props), images: window.__LP_IMAGES.
 * Same math as src/components/ui/tilted-grid-hero.tsx; re-renders on resize. */
(function () {
  var SLICES = 16, CAMERA = 1.6, MAX_WIDTH = 55;
  var cfg = Object.assign({ speed: 4, tileHeight: 28, aspect: 4 / 3, gap: 8, axis: 50, curve: 55, root: '.q-hero-tilted', tileBg: 'transparent' }, window.__LP_BAND_CFG || {});
  var images = window.__LP_IMAGES || [];
  var root = document.querySelector(cfg.root);
  if (!root || !images.length) return;
  var band = root.querySelector(':scope > div[aria-hidden]');
  if (!band) return;
  function arc(b) { return (CAMERA - 1 + Math.cos(b)) / (2 * CAMERA * Math.sin(b)); }
  function measure(width, height, tile, aspect, gap, bend) {
    var h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
    var radius = width * arc(bend);
    if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
    var deg = function (r) { return (r * 180) / Math.PI; };
    var unit = deg(h / radius), pitch = (aspect + gap / 100) * unit, limit = deg(bend) + (aspect * unit) / 2;
    var columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
    var round = function (n) { return +n.toFixed(4); };
    var sweep = round((columns * pitch) / 2);
    return { columns: columns, sweep: sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
  }
  var style = document.createElement('style');
  document.head.appendChild(style);
  function render() {
    var rect = root.getBoundingClientRect();
    var bend = (Math.min(85, Math.max(5, cfg.curve)) * Math.PI) / 180;
    var m = measure(rect.width, rect.height, cfg.tileHeight, cfg.aspect, cfg.gap, bend);
    var u = function (n) { return 'calc(' + (+n.toFixed(4)) + ' * min(' + cfg.tileHeight + 'cqh, ' + (+(MAX_WIDTH / cfg.aspect).toFixed(4)) + 'cqw))'; };
    var r = 100 * arc(bend), radius = (+r.toFixed(3)) + 'cqw';
    var turn = function (d) { return 'translateZ(' + radius + ') rotateY(' + (+d.toFixed(4)) + 'deg) translateZ(-' + radius + ')'; };
    var hide = +(((m.sweep - m.limit) / (2 * m.sweep || 1)) * 100).toFixed(4);
    style.textContent = '@keyframes jb-orbit{from{transform:' + turn(-m.sweep) + '}to{transform:' + turn(m.sweep) + '}' +
      '0%,' + hide + '%,' + (100 - hide) + '%,100%{visibility:hidden}' + (hide + 0.001) + '%,' + (100 - hide - 0.001) + '%{visibility:visible}}' +
      '@media(prefers-reduced-motion:reduce){.jb-tile{animation-play-state:paused}}';
    band.style.perspective = (+(r * CAMERA).toFixed(3)) + 'cqw';
    band.style.perspectiveOrigin = '50% ' + cfg.axis + '%';
    band.style.opacity = '1';
    var share = cfg.aspect / SLICES, duration = m.columns * cfg.speed;
    band.innerHTML = '';
    for (var t = 0; t < m.columns; t++) (function (t) {
      var first = m.columns - 1 - t;
      var tile = document.createElement('div');
      tile.className = 'jb-tile';
      Object.assign(tile.style, { position: 'absolute', left: 'calc(50% - ' + u(cfg.aspect / 2) + ')', top: 'calc(' + cfg.axis + '% - ' + u(0.5) + ')',
        width: u(cfg.aspect), height: u(1), transformStyle: 'preserve-3d', animation: 'jb-orbit ' + duration + 's linear ' + (-t * cfg.speed) + 's infinite' });
      var imgs = [];
      for (var k = 0; k < SLICES; k++) {
        var s = document.createElement('div');
        Object.assign(s.style, { position: 'absolute', top: '0', overflow: 'hidden', background: cfg.tileBg, left: u((cfg.aspect - share) / 2),
          width: k === SLICES - 1 ? u(share) : 'calc(' + u(share) + ' + 1px)', height: u(1), transform: turn((cfg.aspect / 2 - (k + 0.5) * share) * m.unit) });
        if (k === 0) s.style.borderRadius = '8px 0 0 8px';
        if (k === SLICES - 1) s.style.borderRadius = '0 8px 8px 0';
        var im = document.createElement('img');
        im.src = images[first % images.length]; im.alt = ''; im.draggable = false;
        Object.assign(im.style, { position: 'absolute', top: '0', maxWidth: 'none', objectFit: 'cover', left: u(-k * share), width: u(cfg.aspect), height: u(1) });
        s.appendChild(im); imgs.push(im); tile.appendChild(s);
      }
      tile.addEventListener('animationiteration', function (e) {
        var lap = Math.round(e.elapsedTime / duration), src = images[(lap * m.columns + first) % images.length];
        imgs.forEach(function (i) { i.src = src; });
      });
      band.appendChild(tile);
    })(t);
  }
  var last = '';
  new ResizeObserver(function () {
    var rc = root.getBoundingClientRect(), key = Math.round(rc.width) + 'x' + Math.round(rc.height);
    if (key !== last) { last = key; render(); }
  }).observe(root);
})();
