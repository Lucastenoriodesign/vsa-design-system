// Varredura de elementos fora da tela: rotas + folha de filtros + filtros inline, em 320/360/390/430 px.
// Uso: PW=... CHANNEL=chrome BASE=http://localhost:8127 node tests/fora-da-tela.js
const { abrir, relator, BASE, LARGURAS } = require('./_lib');
const ROTAS = ['inicio', 'buscar', 'comunidade', 'em-alta', 'perfil'];

// Roda dentro da página. Devolve elementos visíveis que passam das bordas da janela.
// Ignora: conteúdo de carrosséis com rolagem horizontal própria, overlays fechados, itens ocultos.
function varrer(raiz) {
  const vw = document.documentElement.clientWidth, out = [];
  const R = raiz ? document.querySelector(raiz) : document.body;
  if (!R) return ['raiz não existe: ' + raiz];
  const rolaH = el => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const s = getComputedStyle(a); if (/(auto|scroll)/.test(s.overflowX) && a.scrollWidth > a.clientWidth + 1) return true; } return false; };
  const fechado = el => { const o = el.closest('.overlay'); return o && !o.classList.contains('open') && !(raiz && R.closest('.overlay') === o); };
  const nome = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ((el.textContent || '').trim().slice(0, 24) ? ' "' + el.textContent.trim().slice(0, 24) + '"' : '');
  if (document.documentElement.scrollWidth > vw + 1) out.push('rolagem horizontal da página: scrollWidth ' + document.documentElement.scrollWidth + ' > ' + vw);
  for (const el of R.querySelectorAll('*')) {
    if (/^(SCRIPT|STYLE|PATH|CIRCLE|RECT|LINE|G|DEFS|TITLE)$/i.test(el.tagName)) continue;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
    if (el.closest('[hidden]') || fechado(el) || rolaH(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right < -5000) continue; // texto só para leitor de tela (.sr)
    if (r.right > vw + 1 || r.left < -1) out.push(nome(el) + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + '] vw=' + vw);
  }
  return out.slice(0, 8);
}

(async () => {
  const ok = relator('fora da tela');
  for (const w of LARGURAS) {
    const { browser, page, erros } = await abrir({ largura: w });
    await page.goto(BASE + '/#/inicio');
    await page.waitForSelector('#hero .hero', { timeout: 8000 }).catch(() => {});
    for (const rota of ROTAS) {
      await page.goto(BASE + '/#/' + rota);
      await page.waitForTimeout(500);
      const v = await page.evaluate(varrer);
      ok(v.length === 0, rota + ' @' + w, v.join(' | '));
    }
    // filtros inline da tela Buscar
    await page.goto(BASE + '/#/buscar'); await page.waitForTimeout(300);
    await page.click('#filtBtn'); await page.waitForTimeout(300);
    let v = await page.evaluate(varrer);
    ok(v.length === 0, 'buscar com filtros inline abertos @' + w, v.join(' | '));
    // folha de filtros (home)
    await page.goto(BASE + '/#/inicio'); await page.waitForTimeout(400);
    await page.click('#homeFilt'); await page.waitForTimeout(500);
    v = await page.evaluate(varrer, '#infoOverlay');
    ok(v.length === 0, 'folha de filtros @' + w, v.join(' | '));
    const bar = await page.evaluate(() => { const b = document.querySelector('[data-fapply]'); if (!b) return null; const r = b.getBoundingClientRect(); return { b: r.bottom, vh: innerHeight }; });
    ok(bar && bar.b <= bar.vh + 1, 'botão "Ver N lugares" visível na folha @' + w, JSON.stringify(bar));
    ok(erros.length === 0, 'sem erro de JavaScript @' + w, erros.join(' | '));
    await browser.close();
  }
  process.exit(ok.falhas() ? 1 : 0);
})();
