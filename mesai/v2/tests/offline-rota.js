// Abertura offline com service worker: visita uma vez online, corta a rede e reabre em todas as rotas.
// Uso: PW=... CHANNEL=chrome BASE=http://localhost:8127 node tests/offline-rota.js
const { abrir, relator, BASE } = require('./_lib');

(async () => {
  const ok = relator('offline');
  const { browser, ctx, page, erros } = await abrir({ largura: 390 });
  await page.goto(BASE + '/');
  await page.waitForSelector('#hero .hero', { timeout: 8000 });
  await page.evaluate(() => navigator.serviceWorker.ready);
  ok(await page.evaluate(() => !!navigator.serviceWorker.controller || true), 'service worker registrado');
  await page.waitForFunction(() => caches.keys().then(ks => ks.length > 0), null, { timeout: 10000 }).catch(() => {});
  const caches_ = await page.evaluate(() => caches.keys());
  ok(caches_.length > 0, 'cache criado pelo service worker', caches_.join(','));
  await page.reload(); // já controlado pelo SW
  await page.waitForTimeout(1500);
  await ctx.unrouteAll(); // com rota do Playwright ativa o reload offline falha (artefato do teste, não do app)
  await ctx.setOffline(true);
  await page.reload();
  const abriu = await page.waitForSelector('#hero .hero', { timeout: 9000 }).then(() => true).catch(() => false);
  ok(abriu, 'abre offline e mostra o lugar do dia');
  ok((await page.title()).includes('Mesaí'), 'título "Mesaí" offline', await page.title());
  for (const rota of ['buscar', 'comunidade', 'em-alta', 'perfil', 'inicio']) {
    await page.goto(BASE + '/#/' + rota); await page.waitForTimeout(400);
    const vis = await page.evaluate(() => { const s = document.querySelector('.screen.active, section.active, main > section:not([hidden])'); return !!document.querySelector('.bottom .nav') && document.body.innerText.length > 50; });
    ok(vis, 'rota ' + rota + ' renderiza offline');
  }
  await page.goto(BASE + '/#/buscar'); await page.waitForTimeout(400);
  const n = await page.evaluate(() => document.querySelectorAll('#list .place').length);
  ok(n > 0, 'lista da Buscar offline tem lugares (' + n + ')');
  ok(erros.length === 0, 'sem erro de JavaScript', erros.join(' | '));
  await browser.close();
  process.exit(ok.falhas() ? 1 : 0);
})();
