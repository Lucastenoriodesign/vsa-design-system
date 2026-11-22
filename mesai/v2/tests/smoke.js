// Teste de fumaça do Mesaí v2.
// Uso: (na pasta mesai/v2) python3 -m http.server 8124 &  depois  BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/smoke.js
// Com o Chrome instalado: PW=/caminho/playwright-core CHANNEL=chrome (ver tests/rodar-tudo.sh).
const { chromium, devices } = require(process.env.PW || 'playwright');
const BASE = process.env.BASE || 'http://localhost:8124';
(async () => {
  const b = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const p = await (await b.newContext({ ...devices['iPhone 13'] })).newPage();
  const err = [];
  p.on('pageerror', x => err.push('erro de página: ' + x.message));
  const ok = (c, m) => { if (!c) err.push('FALHA: ' + m); };
  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  // Modo local (js/data.js): o servidor é bloqueado para o resultado não depender da rede.
  // O modo com servidor (inclusive check-in que pede login) fica em tests/servidor-simulado.js.
  await p.route(u => /supabase\.co/.test(u.hostname), r => r.abort());
  await p.goto(BASE + '/');
  await p.waitForTimeout(300);
  ok(await p.$('#hero .hero'), 'lugar do dia aparece');
  await p.click('.nav[data-go=buscar]');
  // contagens esperadas vêm dos próprios dados (js/data.js), não de números fixos
  const esp = await p.evaluate(() => {
    const P = pubPlaces(), txt = x => (x.n + ' ' + x.g + ' ' + x.c + ' ' + x.d + ' ' + x.e + ' ' + x.r).toLowerCase();
    return { n: P.length, tel: P.filter(x => x.t).length, burg: P.filter(x => txt(x).includes('burg')).length };
  });
  ok((await p.$$('#list .place')).length === esp.n && esp.n > 0, esp.n + ' lugares publicados');
  await p.click('#filtBtn');
  await p.click('[data-flag=tel]');
  ok((await p.$$('#list .place')).length === esp.tel && esp.tel > 0, 'filtro "tem telefone" (' + esp.tel + ')');
  await p.click('[data-flag=tel]');
  await p.fill('#searchInput', 'burg');
  ok((await p.$$('#list .place')).length === esp.burg && esp.burg > 0, 'busca por "burg" (' + esp.burg + ')');
  await p.click('#list .place');
  ok(await p.$('a[href^="tel:"]'), 'botão ligar no detalhe');
  await p.click('[data-checkin]');
  await p.keyboard.press('Escape');
  await p.click('.nav[data-go=perfil]');
  // check-in vale 10 pontos por lugar/dia (points() = checkins * 10)
  ok((await p.textContent('#rvPts')) === '10', 'sem servidor, check-in vale 10 pontos neste aparelho');
  await p.click('.nav[data-go=inicio]');
  ok((await p.$$('#recentList .rtile')).length === 1, 'lugar aberto aparece em Vistos recentemente');
  await p.goto(BASE + '/#/comunidade');
  await p.fill('#postText', 'teste');
  await p.click('#postForm .btn');
  await p.goto(BASE + '/#/admin');
  ok((await p.$$('[data-approve]')).length === 0, 'comentário limpo é publicado na hora (moderação automática, sem fila)');
  console.log(err.length ? err : 'OK');
  await b.close();
  process.exit(err.length ? 1 : 0);
})();
