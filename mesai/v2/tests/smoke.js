// Teste de fumaça do Mesaí v2.
// Uso: (na pasta mesai/v2) python3 -m http.server 8124 &  depois  BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/smoke.js
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8124';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
  const err = [];
  p.on('pageerror', x => err.push('erro de página: ' + x.message));
  const ok = (c, m) => { if (!c) err.push('FALHA: ' + m); };
  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  await p.goto(BASE + '/');
  await p.waitForTimeout(300);
  ok(await p.$('#hero .hero'), 'lugar do dia aparece');
  await p.click('.nav[data-go=buscar]');
  ok((await p.$$('#list .place')).length === 19, '19 lugares publicados');
  await p.click('[data-flag=tel]');
  ok((await p.$$('#list .place')).length === 18, 'filtro "tem telefone"');
  await p.click('[data-flag=tel]');
  await p.fill('#searchInput', 'burg');
  ok((await p.$$('#list .place')).length === 5, 'busca por "burg"');
  await p.click('#list .place');
  ok(await p.$('a[href^="tel:"]'), 'botão ligar no detalhe');
  await p.click('[data-checkin]');
  await p.keyboard.press('Escape');
  await p.click('.nav[data-go=perfil]');
  ok((await p.textContent('#rvPts')) === '10', 'check-in rende 10 pontos');
  await p.goto(BASE + '/#/comunidade');
  await p.fill('#postText', 'teste');
  await p.click('#postForm .btn');
  await p.goto(BASE + '/#/admin');
  ok((await p.$$('[data-approve]')).length === 1, 'comentário aguarda aprovação');
  console.log(err.length ? err : 'OK');
  await b.close();
  process.exit(err.length ? 1 : 0);
})();
