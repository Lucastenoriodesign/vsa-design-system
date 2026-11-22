/* Segurança do cliente: CSP ativa (?csp=1), sem violações nas rotas, script injetado não roda, imagem quebrada cai no tratamento certo, anti-spam e honeypot. */
const { chromium, devices } = require(process.env.PW || 'playwright-core');
const BASE = process.env.BASE || 'http://localhost:8124';
let ok = 0, bad = 0; const t = (c, m) => { c ? ok++ : (bad++, console.log('  FALHA', m)); if (c) console.log('  OK    ' + m); };
(async () => {
  const b = await chromium.launch({ channel: process.env.CHANNEL || 'chrome' });
  const p = await (await b.newContext({ ...devices['iPhone 13'], serviceWorkers: 'block' })).newPage();
  const viol = [], errs = []; p.on('console', m => { if (/Content Security Policy|Refused to/i.test(m.text())) viol.push(m.text().slice(0, 140)); }); p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  await p.route(u => /supabase\.co/.test(u.hostname), r => r.abort());
  await p.goto(BASE + '/?csp=1#/inicio'); await p.waitForTimeout(900);
  t(await p.evaluate(() => !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')), 'meta CSP ativa com ?csp=1');
  for (const r of ['inicio', 'buscar', 'comunidade', 'em-alta', 'perfil']) { await p.goto(BASE + '/?csp=1#/' + r); await p.waitForTimeout(500); }
  await p.click('#homeFilt').catch(() => {}); await p.waitForTimeout(300);
  t(viol.length === 0, 'nenhuma violação de CSP nas 5 rotas' + (viol.length ? ': ' + viol[0] : ''));
  t(errs.length === 0, 'sem erro de JavaScript com CSP' + (errs.length ? ': ' + errs[0] : ''));
  await p.goto(BASE + '/?csp=1#/inicio'); await p.waitForTimeout(500);
  const ran = await p.evaluate(() => { window.__x = 0; const s = document.createElement('script'); s.textContent = 'window.__x=1'; document.body.appendChild(s); return window.__x; });
  t(ran === 0, 'script inline injetado é bloqueado pela CSP');
  const vp = await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = '<span class="vph"><img src="/nao-existe.jpg" data-oe="vph"></span>'; document.body.appendChild(d); return new Promise(r => setTimeout(() => r(d.querySelector('.vph').className + '|' + d.querySelectorAll('img').length), 600)); });
  t(/empty/.test(vp) && /\|0$/.test(vp), 'imagem quebrada (data-oe) remove a img e marca vazio: ' + vp);
  // anti-spam
  await p.goto(BASE + '/#/comunidade'); await p.waitForTimeout(600);
  const sp = await p.evaluate(() => { localStorage.removeItem('mesai-rl-post'); const a = spamOk('post', 'teste um'), b = spamOk('post', 'teste dois'), c = (localStorage.removeItem('mesai-rl-post'), spamOk('post', 'igual'), localStorage.setItem('mesai-rl-post', JSON.stringify([{ t: Date.now() - 40000, h: 'igual' }])), spamOk('post', 'igual')); localStorage.removeItem('mesai-rl-post'); return [a, b, c]; });
  t(sp[0] === true && sp[1] === false, 'segundo envio em menos de 30 s é barrado');
  t(sp[2] === false, 'texto repetido na última hora é barrado');
  const hp = await p.evaluate(() => { localStorage.removeItem('mesai-rl-post'); const f = document.getElementById('postForm'); f.website.value = 'robo'; document.getElementById('postText').value = 'oi'; const n0 = (localStorage.getItem('mesai-posts') || '').length; f.dispatchEvent(new Event('submit', { cancelable: true })); return (localStorage.getItem('mesai-posts') || '').length === n0; });
  t(hp, 'campo-isca preenchido: envio ignorado em silêncio');
  console.log('\n' + ok + ' OK, ' + bad + ' FALHA'); await b.close(); process.exit(bad ? 1 : 0);
})();
