// Barra inferior: 5 botões e posições idênticas depois de tocar em cada um, em 320/360/390/430 px.
// Uso: PW=... CHANNEL=chrome BASE=http://localhost:8127 node tests/barra-inferior.js
const { abrir, relator, BASE, LARGURAS } = require('./_lib');
const ORDEM = ['inicio', 'buscar', 'salvos', 'comunidade', 'perfil'];

(async () => {
  const ok = relator('barra inferior');
  for (const w of LARGURAS) {
    const { browser, page, erros } = await abrir({ largura: w });
    await page.goto(BASE + '/#/inicio');
    await page.waitForSelector('#hero .hero', { timeout: 8000 }).catch(() => {});
    const medir = () => page.evaluate(() => {
      const f = e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(x => Math.round(x * 10) / 10); };
      const d = document.querySelector('.bottom .dock');
      return { dock: f(d), nav: [...document.querySelectorAll('.bottom .nav')].map(e => ({ k: e.dataset.go, r: f(e), ico: f(e.querySelector('.ico')), lbl: f(e.querySelector('.lbl')) })) };
    });
    const base = await medir();
    ok(base.nav.length === 5, '5 botões @' + w, String(base.nav.length));
    ok(JSON.stringify(base.nav.map(n => n.k)) === JSON.stringify(ORDEM), 'ordem Início/Buscar/Salvos/Comunidade/Perfil @' + w, base.nav.map(n => n.k).join(','));
    ok(base.nav.every(n => n.r[0] >= 0 && n.r[0] + n.r[2] <= w + 0.5), 'botões dentro da largura @' + w);
    ok(base.nav.every(n => n.r[2] >= 44 && n.r[3] >= 44) || base.nav.every(n => n.r[2] >= 40 && n.r[3] >= 40), 'alvo de toque >= 40 px @' + w, base.nav.map(n => n.r[2] + 'x' + n.r[3]).join(' '));
    const pos = [];
    for (const k of ORDEM) {
      await page.click('.bottom .nav[data-go=' + k + ']');
      await page.waitForTimeout(450);
      const hash = await page.evaluate(() => location.hash);
      const ativo = await page.evaluate(() => [...document.querySelectorAll('.bottom .nav')].filter(e => e.classList.contains('active') || e.getAttribute('aria-current')).map(e => e.dataset.go));
      const m = await medir();
      const iguais = JSON.stringify(m.nav.map(n => n.r)) === JSON.stringify(base.nav.map(n => n.r)) && JSON.stringify(m.dock) === JSON.stringify(base.dock);
      const iconesIguais = JSON.stringify(m.nav.map(n => [n.ico, n.lbl])) === JSON.stringify(base.nav.map(n => [n.ico, n.lbl]));
      ok(hash.indexOf(k) >= 0, 'tocar em ' + k + ' leva à rota @' + w, hash);
      ok(ativo.length === 1 && ativo[0] === k, 'só ' + k + ' fica ativo @' + w, ativo.join(','));
      ok(iguais, 'posições dos botões idênticas após tocar em ' + k + ' @' + w, iguais ? '' : JSON.stringify(m.nav.map(n => n.r)) + ' vs ' + JSON.stringify(base.nav.map(n => n.r)));
      ok(iconesIguais, 'ícones e rótulos no mesmo lugar após ' + k + ' @' + w);
    }
    ok(erros.length === 0, 'sem erro de JavaScript @' + w, erros.join(' | '));
    await browser.close();
  }
  process.exit(ok.falhas() ? 1 : 0);
})();
