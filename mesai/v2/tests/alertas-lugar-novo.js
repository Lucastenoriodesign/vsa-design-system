// Testa os alertas de lugar novo (Mesaí+) com servidor SIMULADO.
// Uso: (na pasta mesai/v2) python3 -m http.server 8124 &  depois  BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/alertas-lugar-novo.js
const { chromium, devices } = require(process.env.PW||'playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.BASE || 'http://localhost:8124';
const dados = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'estabelecimentos.json'), 'utf8'));
const linha = o => ({ id: o.id, name: o.n, category: o.g, category_source: o.c, region: o.r, address: o.e, description: o.d, phone: o.t, evidence: o.ev, published: true, source_url: o.f });
const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };
(async () => {
  const b = await chromium.launch({channel:process.env.CHANNEL||undefined});
  const p = await (await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' })).newPage();
  const err = []; p.on('pageerror', x => err.push('erro de página: ' + x.message));
  const ok = (c, m) => { if (!c) err.push('FALHA: ' + m); };
  let lista = dados.slice(0, -1).map(linha); // servidor começa sem o último lugar
  await p.addInitScript(() => { if (!sessionStorage.getItem('t')) { localStorage.setItem('mesai-onboarded', 'true'); sessionStorage.setItem('t', '1'); } });
  await p.route(u => /supabase\.co/.test(u.hostname), r => {
    const q = r.request().url();
    if (r.request().method() === 'OPTIONS') return r.fulfill({ status: 204, headers: cors });
    r.fulfill({ status: 200, headers: cors, body: JSON.stringify(/\/rest\/v1\/places/.test(q) ? lista : []) });
  });
  const estado = () => p.evaluate(() => ({ seen: JSON.parse(localStorage.getItem('mesai-seen-places') || 'null'), al: JSON.parse(localStorage.getItem('mesai-new-alerts') || '[]'), n: NOTIFS.filter(x => x.k === 'lugar').length }));
  // 1ª abertura: só marca o que já existe, sem alerta
  await p.goto(BASE + '/'); await p.waitForTimeout(1500);
  let e = await estado();
  ok(e.seen && e.seen.length === lista.length, 'baseline marcou ' + (e.seen && e.seen.length) + ' lugares');
  ok(e.al.length === 0, 'primeira abertura não deve gerar alerta');
  // O servidor publica um lugar novo; segunda abertura gera alerta
  lista = dados.map(linha);
  await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate(() => buildNotifs());
  e = await estado();
  ok(e.al.length === 1 && e.al[0].id === dados[dados.length - 1].id, 'deveria haver 1 alerta do lugar novo, veio ' + JSON.stringify(e.al));
  ok(e.n === 1, 'sino deveria listar 1 "Lugar novo"');
  // Reabrir sem novidade: não repete toast nem cria outro alerta
  await p.reload(); await p.waitForTimeout(1500);
  e = await estado(); ok(e.al.length === 1, 'sem novidade não cria alerta');
  // Preferência desligada: não aparece no sino
  await p.evaluate(() => { notif.novos = false; buildNotifs(); });
  e = await estado(); ok(e.n === 0, 'com preferência desligada o sino não mostra lugar novo');
  // Teste de 14 dias encerrado: alerta fica travado (Mesaí+)
  await p.evaluate(() => { notif.novos = true; trialStart = Date.now() - 20 * 86400000; buildNotifs(); });
  // Com os planos desligados (MESAI_CONFIG.planos === false) não há o que assinar, então o alerta segue liberado para todos.
  const planos = await p.evaluate(() => PLANOS);
  e = await estado(); ok(planos ? e.n === 0 : e.n > 0, planos ? 'depois do teste o alerta deve ficar travado' : 'sem planos, o alerta segue liberado depois do teste');
  await p.evaluate(() => { trialStart = Date.now(); buildNotifs(); });
  e = await estado(); ok(e.n === 1, 'durante o teste o alerta deve aparecer');
  console.log(err.length ? err.join('\n') : 'OK: alertas de lugar novo');
  await b.close(); process.exit(err.length ? 1 : 0);
})();
