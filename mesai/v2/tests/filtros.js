// Filtros da folha: cozinha, dias da semana e "Aberto agora", conferindo a contagem do botão "Ver N lugares"
// e a lista da tela Buscar contra o cálculo direto dos dados (pubPlaces + match).
// Uso: PW=... CHANNEL=chrome BASE=http://localhost:8127 node tests/filtros.js
const { abrir, relator, BASE } = require('./_lib');

(async () => {
  const ok = relator('filtros');
  const { browser, page, erros } = await abrir({ largura: 390 });
  await page.goto(BASE + '/#/inicio');
  await page.waitForSelector('#hero .hero', { timeout: 8000 });
  const total = await page.evaluate(() => pubPlaces().length);
  ok(total > 0, 'há lugares publicados (' + total + ')');

  const abrirFolha = async () => { if (!(await page.isVisible('#homeFilt'))) await page.click('.bottom .nav[data-go=inicio]'); await page.click('#homeFilt'); await page.waitForSelector('[data-fapply]'); };
  const botao = async () => (await page.textContent('[data-fapply]')).trim();
  const esperado = () => page.evaluate(() => pubPlaces().filter(match).length);
  const texto = n => n ? 'Ver ' + n + (n === 1 ? ' lugar' : ' lugares') : 'Nenhum lugar com esses filtros';

  async function testar(flag, rotulo) {
    await abrirFolha();
    const el = await page.$('[data-fflag="' + flag + '"]');
    const off = el ? await el.isDisabled() : true;
    if (!el || off) { console.log('  PULOU  ' + rotulo + ' (sem dado, chip desativado)'); await page.keyboard.press('Escape'); return; }
    const chip = await page.evaluate(f => { const b = document.querySelector('[data-fflag="' + f + '"] i'); return b ? +b.textContent : null; }, flag);
    await page.click('[data-fflag="' + flag + '"]');
    const n = await esperado();
    ok((await botao()) === texto(n), rotulo + ': botão mostra a contagem real (' + n + ')', await botao());
    if (chip !== null && (flag.indexOf('day:') === 0 || flag.indexOf('ck:') === 0)) ok(chip === n, rotulo + ': número no chip (' + chip + ') = resultado (' + n + ')');
    await page.click('[data-fapply]');
    await page.waitForSelector('#list .place, #list .empty', { timeout: 4000 }).catch(() => {});
    ok((await page.$$('#list .place')).length === n, rotulo + ': lista da Buscar tem ' + n + ' lugares');
    // limpar
    await abrirFolha(); await page.click('[data-fclear]');
    ok((await botao()) === texto(total), rotulo + ': "Limpar tudo" volta a ' + total);
    await page.keyboard.press('Escape'); await page.waitForTimeout(200);
    await page.click('.bottom .nav[data-go=inicio]'); await page.waitForTimeout(300);
  }

  const cozinhas = await page.evaluate(() => COZ.map(c => [c[0], c[1]]));
  const dias = await page.evaluate(() => DIAS.slice());
  for (const [k, nome] of cozinhas) await testar('ck:' + k, 'cozinha ' + nome);
  for (let i = 0; i < dias.length; i++) await testar('day:' + i, 'dia ' + dias[i]);
  await testar('open', 'Aberto agora');

  // combinação: cozinha + aberto agora nunca pode exceder cada filtro sozinho
  await abrirFolha();
  const a = await page.evaluate(() => { S.flags = ['open']; return pubPlaces().filter(match).length; });
  const c = await page.evaluate(() => { S.flags = ['ck:' + COZ[0][0]]; return pubPlaces().filter(match).length; });
  const ac = await page.evaluate(() => { S.flags = ['open', 'ck:' + COZ[0][0]]; return pubPlaces().filter(match).length; });
  ok(ac <= Math.min(a, c), 'combinar filtros só reduz (aberto ' + a + ', ' + cozinhas[0][1] + ' ' + c + ', ambos ' + ac + ')');

  ok(erros.length === 0, 'sem erro de JavaScript', erros.join(' | '));
  await browser.close();
  process.exit(ok.falhas() ? 1 : 0);
})();
