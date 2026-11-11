// Testa a ligação do app com o Supabase usando um servidor SIMULADO em memória (sem rede).
// Uso: (na pasta mesai/v2) python3 -m http.server 8124 &  depois  BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/servidor-simulado.js
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.env.BASE || 'http://localhost:8124';
const HOST = 'https://qheadmopevmckkmugugy.supabase.co';

const dados = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'estabelecimentos.json'), 'utf8'));
const places = dados.map(o => ({ id: o.id, name: o.n, category: o.g, category_source: o.c, region: o.r, address: o.e, description: o.d, phone: o.t, evidence: o.ev, published: !!o.pub, source_url: o.f, maps_url: o.m, lat: null, lng: null, photo_url: null, photo_source: null, hours: null }));

const db = { comments: [], checkins: [], saved: [], amb: [], points: 0, users: { 'admin@mesai.com': { id: 'u-admin', admin: true }, 'ana@mesai.com': { id: 'u-ana', admin: false } } };
let quem = null; // usuário atual (pelo token)

function filtro(q, campo) { const v = q.get(campo); return v && v.startsWith('eq.') ? v.slice(3) : null; }

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' });
  const p = await ctx.newPage();
  const err = [];
  p.on('pageerror', x => err.push('erro de página: ' + x.message));
  const ok = (c, m) => { if (!c) err.push('FALHA: ' + m); };
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };

  await p.route(HOST + '/**', async route => {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    const url = new URL(req.url());
    const q = url.searchParams;
    const auth = (req.headers()['authorization'] || '').replace('Bearer ', '');
    const eu = Object.entries(db.users).find(([e, u]) => 'tok-' + u.id === auth);
    const email = eu && eu[0], user = eu && eu[1];
    const body = req.postData() ? JSON.parse(req.postData()) : {};
    const J = (obj, status = 200) => route.fulfill({ status, headers: cors, body: JSON.stringify(obj) });
    const P = url.pathname;

    if (P === '/auth/v1/signup' || P === '/auth/v1/token') {
      const e = body.email; const u = db.users[e] || (db.users[e] = { id: 'u-' + e.split('@')[0], admin: false });
      return J({ access_token: 'tok-' + u.id, refresh_token: 'ref', expires_in: 3600, user: { id: u.id, email: e } });
    }
    if (P === '/auth/v1/logout') return J({});
    if (P === '/rest/v1/places') return J(places);
    if (P === '/rest/v1/profiles') return J(user ? [{ display_name: email.split('@')[0], points: db.points }] : []);
    if (P === '/rest/v1/admins') return J(user && user.admin ? [{ user_id: user.id }] : []);
    if (P === '/rest/v1/saved_places') {
      if (req.method() === 'GET') return J(db.saved.filter(s => user && s.user_id === user.id).map(s => ({ place_id: s.place_id })));
      if (req.method() === 'POST') { db.saved.push(body); return J({}, 201); }
      if (req.method() === 'DELETE') { const id = filtro(q, 'place_id'); db.saved = db.saved.filter(s => s.place_id !== id); return J({}, 204); }
    }
    if (P === '/rest/v1/ambience_marks') {
      if (req.method() === 'GET') return J(db.amb);
      if (req.method() === 'POST') { db.amb.push(body); return J({}, 201); }
      if (req.method() === 'DELETE') { db.amb = db.amb.filter(m => !(m.place_id === filtro(q, 'place_id') && m.tag === filtro(q, 'tag'))); return J({}, 204); }
    }
    if (P === '/rest/v1/checkins' && req.method() === 'POST') {
      if (db.checkins.some(c => c.user_id === body.user_id && c.place_id === body.place_id)) return J({ message: 'duplicate key' }, 409);
      db.checkins.push(body); db.points += 10; return J({}, 201);
    }
    if (P === '/rest/v1/comments') {
      if (req.method() === 'POST') { db.comments.push({ id: 'c' + (db.comments.length + 1), created_at: new Date().toISOString(), status: 'pendente', reviewed_at: null, body: body.body, kind: body.kind, place_id: body.place_id, user_id: body.user_id, flags: body.flags }); return J({}, 201); }
      if (req.method() === 'PATCH') { const id = filtro(q, 'id'); const c = db.comments.find(x => x.id === id); if (user && user.admin && c) c.status = body.status; return J({}, 204); }
      if (req.method() === 'DELETE') { const id = filtro(q, 'id'); db.comments = db.comments.filter(x => x.id !== id); return J({}, 204); }
      if (req.method() === 'GET') {
        const st = filtro(q, 'status'), uid = filtro(q, 'user_id');
        let rows = db.comments;
        if (st) rows = rows.filter(c => c.status === st);
        if (uid) rows = rows.filter(c => c.user_id === uid);
        if (st === 'pendente' && !(user && user.admin)) rows = rows.filter(c => user && c.user_id === user.id);
        return J(rows);
      }
    }
    return J({ message: 'rota não simulada: ' + P }, 404);
  });

  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  await p.goto(BASE + '/#/comunidade');
  await p.waitForTimeout(600);

  // 0) servidor sem coordenada: o app aproveita a do cadastro local (js/data.js) e não inventa nas demais
  const geo = await p.evaluate(() => ({ on: S2.on, comLocal: BASE.filter(x => { var d = DATA.filter(q => q.id === x.id)[0]; return d && typeof d.lat === 'number'; }).every(x => typeof x.lat === 'number' && typeof x.lng === 'number'), semLocal: BASE.filter(x => { var d = DATA.filter(q => q.id === x.id)[0]; return !d || d.lat == null; }).every(x => x.lat === null && x.lng === null), n: BASE.filter(x => typeof x.lat === 'number').length }));
  ok(geo.on && geo.n > 0 && geo.comLocal, 'lugar do servidor sem coordenada usa a do cadastro local');
  ok(geo.semLocal, 'lugar sem coordenada em lugar nenhum continua sem pin');

  // 0b) sem conta, com servidor: check-in pede login e não rende pontos
  await p.goto(BASE + '/#/buscar');
  await p.waitForTimeout(300);
  ok((await p.$$('#list .skel')).length === 0 && (await p.$$('#list .place')).length > 0, 'lista sai do estado de carregamento');
  await p.click('#list .place');
  await p.click('[data-checkin]');
  await p.waitForTimeout(300);
  ok(await p.$('#authForm'), 'check-in sem conta pede para entrar');
  ok(db.checkins.length === 0, 'check-in sem conta não é gravado');
  await p.goto(BASE + '/#/comunidade');
  await p.waitForTimeout(300);

  // 1) sem conta: não dá para comentar
  await p.fill('#postText', 'Gostei do ambiente');
  await p.click('#postForm .btn');
  await p.waitForTimeout(300);
  ok(await p.$('#authForm'), 'pede para entrar antes de comentar');

  // 2) cria conta e comenta
  await p.click('#authSwitch');
  await p.fill('#authForm [name=email]', 'ana@mesai.com');
  await p.fill('#authForm [name=password]', 'segredo123');
  await p.click('#authGo');
  await p.waitForTimeout(600);
  await p.goto(BASE + '/#/comunidade');
  await p.waitForTimeout(300);
  await p.fill('#postText', 'Gostei do ambiente');
  await p.click('#postForm .btn');
  await p.waitForTimeout(500);
  ok(await p.$('.post .badge'), 'comentário aparece como aguardando aprovação');
  ok(db.comments.length === 1 && db.comments[0].status === 'pendente', 'comentário gravado como pendente no servidor');

  // 3) check-in vale ponto, repetir não
  await p.goto(BASE + '/#/buscar');
  await p.waitForTimeout(300);
  await p.click('#list .place');
  await p.click('[data-checkin]');
  await p.waitForTimeout(400);
  ok(db.checkins.length === 1 && db.points === 10, 'check-in gravado e +10 pontos');
  await p.click('[data-checkin]');
  await p.waitForTimeout(400);
  ok(db.checkins.length === 1, 'segundo check-in no mesmo dia é recusado');
  await p.keyboard.press('Escape');

  // 4) ana não consegue moderar; admin consegue
  await p.goto(BASE + '/#/admin');
  await p.waitForTimeout(300);
  ok((await p.$$('[data-reject]')).length === 0, 'usuária comum não vê botão de moderação');
  await p.evaluate(() => { localStorage.setItem('mesai-session', JSON.stringify({ access_token: 'tok-u-admin', refresh_token: 'ref', expires_at: Date.now() + 3600000, user: { id: 'u-admin', email: 'admin@mesai.com' } })); });
  await p.reload();
  await p.waitForTimeout(800);
  await p.goto(BASE + '/#/admin');
  await p.waitForTimeout(400);
  // O painel não tem mais botão de aprovar (a triagem é automática); a moderadora só remove.
  ok((await p.$$('[data-approve]')).length === 0, 'painel sem botão de aprovar');
  ok((await p.$$('[data-reject]')).length === 1, 'moderadora vê o comentário na fila');
  await p.click('[data-reject]');
  await p.waitForTimeout(500);
  ok(db.comments[0].status === 'rejeitado', 'remoção gravada no servidor');

  console.log(err.length ? err : 'OK');
  await b.close();
  process.exit(err.length ? 1 : 0);
})();
