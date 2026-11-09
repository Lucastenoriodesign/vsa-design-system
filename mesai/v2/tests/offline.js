// Verifica que o app abre sem internet depois da primeira visita (service worker).
// Uso: BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/offline.js
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:8124';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  await p.goto(BASE + '/');
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.waitForTimeout(800);
  await ctx.setOffline(true);
  await p.reload();
  await p.waitForTimeout(500);
  const ok = !!(await p.$('#hero .hero')) && (await p.title()).includes('Mesaí');
  console.log(ok ? 'OK: abre offline' : 'FALHA: não abriu offline');
  await b.close();
  process.exit(ok ? 0 : 1);
})();
