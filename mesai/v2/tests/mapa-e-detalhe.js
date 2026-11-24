const { chromium, devices } = require('playwright');
const D = require('os').tmpdir() + '/mesai-';
(async () => {
  const b = await chromium.launch();
  // posição falsa no meio dos lugares cadastrados (Cidade Universitária), só para o teste
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1, serviceWorkers: 'block', geolocation: { latitude: -9.5506, longitude: -35.7536 }, permissions: ['geolocation'] });
  const p = await ctx.newPage();
  const err = [];
  p.on('pageerror', x => err.push(x.message));
  p.on('console', m => { if (m.type() === 'error' && !/tile|openstreetmap|ERR_|net::/i.test(m.text())) err.push('console: ' + m.text()); });
  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  await p.route(u => /supabase\.co/.test(u.hostname), r => r.abort());
  const ok = (c, m) => console.log((c ? 'OK    ' : 'FALHA ') + m);
  const url = (process.env.BASE || 'http://localhost:8124') + '/' + (process.env.CSP ? '?csp=1' : '') + '#/buscar';
  await p.goto(url);
  await p.waitForTimeout(800);

  // 1) selo Aberto agora bate com o horário
  const ab = await p.evaluate(() => {
    const vis = [...document.querySelectorAll('#list .openb.on')].filter(e => !e.hidden).length;
    const esp = pubPlaces().filter(match).filter(x => openNow(x) === true).length;
    return { vis, esp, semHorarioComSelo: [...document.querySelectorAll('#list .openb')].filter(e => !e.hidden && !byId(e.dataset.ob).h).length, fechados: [...document.querySelectorAll('#list .openb.off')].filter(e => !e.hidden).length };
  });
  ok(ab.vis === ab.esp, 'selo "Aberto agora" em ' + ab.vis + ' lugares (esperado ' + ab.esp + ' pelo horário de agora)');
  ok(ab.semHorarioComSelo === 0, 'nenhum lugar sem horário mostra o selo');
  // muda o relógio de mentira: fecha todos e atualiza sozinho
  await p.evaluate(() => { window.__on = openNow; openNow = () => false; refreshOpen(); });
  ok((await p.$$eval('#list .openb.on', a => a.filter(e => !e.hidden).length)) === 0 && (await p.$$eval('#list .openb.off', a => a.filter(e => !e.hidden).length)) > 0, 'atualização automática troca para "Fechado" quando fecha');
  await p.evaluate(() => { openNow = window.__on; refreshOpen(); });
  await p.screenshot({ path: D + 'm-lista.png' });

  // 2) mapa real com pins
  await p.click('#modeMap');
  await p.waitForSelector('.leaflet-container', { timeout: 8000 });
  await p.waitForTimeout(800);
  const pins = await p.$$eval('.mpin', a => a.length);
  const esperados = await p.evaluate(() => pubPlaces().filter(match).filter(valid).length);
  ok(pins === esperados && pins > 0, 'mapa com ' + pins + ' pins (lugares com localização: ' + esperados + ')');
  console.log('texto do mapa:', await p.textContent('#mapInfo'));
  await p.click('#mapMe');
  await p.waitForTimeout(1200);
  ok(await p.$('path.leaflet-interactive'), 'ponto azul "Você está aqui" aparece');
  await p.screenshot({ path: D + 'm-mapa.png' });
  const idx = await p.evaluate(() => { const m = document.getElementById('lmap').getBoundingClientRect(); return [...document.querySelectorAll('.mpin')].findIndex(e => { const r = e.getBoundingClientRect(); return r.top > m.top + 20 && r.bottom < m.bottom - 20 && r.left > m.left + 20 && r.right < m.right - 20 && r.top > 0 && r.bottom < innerHeight - 120; }); });
  ok(idx > -1, 'há pin visível perto de você');
  await p.locator('.mpin').nth(idx).click();
  await p.waitForTimeout(500);
  ok(await p.$('.mpop'), 'toque no pin abre o resumo do lugar');
  await p.screenshot({ path: D + 'm-mapa-pop.png' });
  await p.click('.mpop .btn');
  await p.waitForTimeout(600);
  ok(await p.$eval('#detailOverlay', e => e.classList.contains('open')), '"Ver lugar" abre o detalhe');

  // 3) detalhe em tela cheia
  const tela = await p.evaluate(() => { const s = document.querySelector('#detailOverlay .sheet').getBoundingClientRect(); return { top: Math.round(s.top), h: Math.round(s.height), vh: innerHeight }; });
  ok(tela.top === 0 && tela.h >= tela.vh - 1, 'detalhe ocupa a tela inteira (' + JSON.stringify(tela) + ')');
  await p.screenshot({ path: D + 'm-detalhe-topo.png' });

  // 4) marcar Ambiente não pula para cima
  await p.evaluate(() => { const s = document.querySelector('#detailOverlay .sheet'); s.scrollTop = s.scrollHeight; });
  await p.waitForTimeout(300);
  const antes = await p.evaluate(() => document.querySelector('#detailOverlay .sheet').scrollTop);
  await p.click('.amb >> text=Bom para grupos');
  await p.waitForTimeout(400);
  const depois = await p.evaluate(() => document.querySelector('#detailOverlay .sheet').scrollTop);
  ok(Math.abs(depois - antes) < 5 && antes > 100, 'marcar "Bom para grupos" mantém a rolagem (' + antes + ' → ' + depois + ')');
  ok(await p.$eval('.amb.on', e => /grupos/.test(e.textContent)), 'marcação ficou ligada');
  await p.screenshot({ path: D + 'm-detalhe-amb.png' });
  console.log('erros:', err);
  await b.close();
})();
