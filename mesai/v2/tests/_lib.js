// Ajudantes comuns da bateria de QA (não é um teste).
const { chromium, devices } = require(process.env.PW || 'playwright');
const BASE = process.env.BASE || 'http://localhost:8127';
const LARGURAS = [320, 360, 390, 430];
const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };

async function abrir(opts = {}) {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const larg = opts.largura || 390;
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: larg, height: opts.altura || 844 }, ...(opts.ctx || {}) });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', e => erros.push('erro de JavaScript: ' + e.message));
  await page.addInitScript(() => localStorage.setItem('mesai-onboarded', 'true'));
  // Supabase interceptado: sempre falha, o app cai nos dados locais (js/data.js) e o teste é determinístico.
  await ctx.route(u => /supabase\.co/.test(u.hostname), r => r.abort());
  return { browser, ctx, page, erros };
}

// Relator simples: imprime OK/FALHA por verificação e devolve o total de falhas.
function relator(nome) {
  let falhas = 0;
  const r = (cond, msg, ev) => { if (cond) console.log('  OK     ' + msg); else { falhas++; console.log('  FALHA  ' + msg + (ev ? '  -> ' + ev : '')); } };
  r.falhas = () => falhas;
  console.log('[' + nome + ']');
  return r;
}

module.exports = { abrir, relator, BASE, LARGURAS, cors };
