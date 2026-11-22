# Revisão técnica do app (somente leitura) — 22/11/2026

Escopo: v2/js/app.js (433 linhas, 72 KB), v2/js/sync.js, v2/css/app.css (748 linhas, 81 KB), v2/index.html. Nada foi editado. `node --check` passa em app.js e sync.js. Não rodei o Playwright (tarefa de leitura). Os números de linha são do estado atual da árvore, que tem alterações não commitadas.

## ALTO

1. **Backup `v2/js/app.js.backup-20261120-142346` (382 linhas, não rastreado pelo Git)**
   - Tem erro de sintaxe: `var ICP={"x": "<path d="M6...` na linha 2, com aspas sem escape. Não funciona nem como ponto de restauração.
   - Não é referenciado por index.html nem sw.js. Se entrar num commit, vai para o GitHub Pages e para `native/www` pelo `npm run sync`.
   - Sugestão: apagar. O histórico do Git é o backup de verdade (o HEAD tem a versão boa). Se o Lucas quiser guardar, mover para fora de `v2/` ou pôr `*.backup-*` no `.gitignore`. Esforço: 1 min. Apagar exige confirmação do Lucas.

2. **Galeria: foto que falha ao carregar desalinha pontos e tela cheia** (app.js:389 e 396-404)
   - O `onerror` faz `b.remove()` no slide, mas os pontos (`.gal-dots i`) continuam com o total original. Os índices `data-galopen` também ficam desatualizados.
   - Efeito: pontos sobrando, e o `lbOpen` usa `indexOf` entre os botões restantes, então a posição pode divergir. Se todas as fotos falham, sobra uma área vazia sem a capa de fallback (`photo(p,'dph')`).
   - Sugestão: no `onerror`, remover também o ponto correspondente e reindexar. Se o trilho ficar vazio, mostrar o fallback. Esforço: 30 a 45 min.

3. **Lista "Lugares cadastrados" oculta ainda é montada** (index.html:40-43; app.js:110-112)
   - A `<section hidden>` tem `#homeList` e `#homeCount`. A cada `render` o app monta 6 cartões (`byComplete(pp).slice(0,6).map(placeCard)`) e pede 6 imagens.
   - O `#homeList` está dentro de uma seção `hidden`, mas as imagens têm `loading="lazy"`, então talvez não baixem. Não confirmei no navegador. O trabalho de DOM é desperdiçado de qualquer forma.
   - Também há `skel(3)` e `aria-busy` nesse container (linha 110) e o botão "Ver todos (N)" invisível.
   - Sugestão: apagar a section e as 3 linhas do JS. Conferir `tests/smoke.js` por `#homeList`; o grep não achou referência. Esforço: 15 min.

4. **Foco de teclado e leitor de tela nos modais** (index.html:127-131; app.js, 6 chamadas de `focus()`)
   - Os overlays têm `role="dialog" aria-modal="true"`, mas não há armadilha de foco nem `inert` no fundo. Tab sai do diálogo para a página atrás.
   - O Esc só fecha a galeria (app.js:401), não os outros diálogos. Verificar se existe um handler geral. Não encontrei.
   - Esforço: 1 a 2 h (`inert` no `.app` quando houver overlay, Esc geral, devolver o foco ao botão de origem).

## MÉDIO

5. **CSS morto (classes sem uso em index.html, app.js e sync.js)**
   - `.quickcats` (css:14, 255, 262, 358, 461-469, 508). A home atual usa `.quick-row` e `.qk`. Sobraram ~10 regras, incluindo um bloco inteiro de carrossel em 467-469.
   - `.nav-logo` (css:558-576). São 15 regras sobrescrevendo umas às outras (padding-bottom 8, 0, 11, 6, 12, 0) para um botão que não existe mais no dock. É o caso mais claro de append em cascata.
   - `.o-hero`, `.o-price`, `.o-pills`, `.o-plans`, `.o-fine`, `.onb-v`, `.onb-btn`, `.tagc`, `.mc`, `.mc2`, `.n3` (css:82, 91, 120-135, 345-350). São restos das boas-vindas v1. A tela atual é `.onb.o2`.
   - `.featured`, `.fcard`, `.fphoto`, `.fbody`, `.fname`, `.fmeta`, `.pill`, `.tagline`, `.tiles`, `.map-label`, `.map-card`, `.map-empty`, `.prof-head`, `.detail-img`, `.as-card`, `.op-x`, `.cat-all-icon`.
   - `.credit` (css:73) deixou de ser usado: o aviso de crédito saiu do detalhe nesta rodada. Se a foto de terceiro precisa de crédito (regra do CLAUDE.md), conferir se o crédito ainda aparece em algum lugar.
   - `.k-*` (`k-pontos`, `k-lugar`, `k-comentario`, `k-plus`, `k-trial`, `k-Reclama`, `k-Elogio`) provavelmente são montadas dinamicamente (`'k-'+k`), então **não remover sem testar**. `k-Reclama` e `k-Elogio` parecem legado.
   - `@media(min-width:99999px)` (css:61 e 72) nunca dispara: bloco desativado de propósito, pode sair.
   - Ganho estimado: 8 a 12 KB e menos confusão. Esforço: 1 a 2 h com Playwright em 390 e 320 px. Mapa feito por script de substring, então falsos positivos são possíveis.

6. **Sobreposição por append (candidatas a consolidar)**
   - O CSS tem comentários de "Rodada" e "Hub" que reabrem os mesmos seletores. Repetições (contagem de blocos): `.app` 6, `.place` 6, `.nav` 6, `.bslide img` 6, `.list` 5, `.bottom` 5, `.nav.active` 5, `.btn`/`.sheet`/`.dock`/`.main` 4.
   - Home: `body.is-home .top-row`, `.where`, `.cat`, `.cat img` aparecem 4 vezes cada (css:225, 248, 271, 276, 250, 265, 272, 364, 256, 263, 264, 359, 257, 438, 470, 471).
   - `#view-buscar .chips` 4 vezes (155, 380, 517, 519). `#fsheet .fgroup` e `.flabel` 4 vezes (499 a 548). `.composer .row select` 4 vezes (51, 356, 457, 458). `.onb.o2 .onb-s h2` 4 vezes (318, 345, 348, 350).
   - Tema duas vezes: css:130-136 "Tema padrão: fundo branco" sobrescreve o fundo definido antes (linha 115, 136 e 237). Há ainda o arquivo órfão `v2/tema-branco.css` (não carregado em index.html nem no sw.js).
   - Hoje existem 14 `!important`. Vários vêm da guerra de cascata (`.nav*`, `.bottom` em 72).
   - Sugestão: consolidar por componente (dock/nav, hub da home, onboarding o2, filtros) depois de remover o morto (item 5). Esforço: 4 a 6 h, com risco visual. Fazer só com bateria visual do qa-testes.

7. **`MutationObserver` no `document.body` com `subtree`** (app.js:431, "ícones automáticos nos botões")
   - Roda `querySelectorAll('.btn…')` e testa regex no texto a cada mutação do DOM, incluindo a troca de abas e a galeria. A flag `busy` não evita nada, porque `run` é síncrono.
   - Também há um `MutationObserver` em `#detail` (app.js:405) que reinicia o `setInterval` da galeria a cada `innerHTML`.
   - Sugestão: aplicar `deco` nos pontos onde o HTML é montado, ou observar só os containers de overlay. Esforço: 1 a 2 h.

8. **Dois `setInterval` que nunca param** (app.js:381 placeholder rotativo; app.js:391 galeria)
   - O da galeria se auto-limpa só quando `#detail` some. Com o app em segundo plano, continua acordando a cada 3,5 s. Falta `document.hidden`.
   - Sugestão: checar `document.hidden` e limpar no fechamento do detalhe. Esforço: 20 min.

9. **Handlers inline `onerror=` em imagens** (app.js:68, 79, 389 e outras, cerca de 6)
   - Funcionam, mas impedem uma CSP sem `unsafe-inline`. Pedem migração para um listener `error` com captura no documento. Esforço: 1 h.

10. **Chave publishable do Supabase em `js/config.js`** — é o esperado (chave pública, RLS ativo). Sem ação, só confirmar que nenhuma `service_role` entra em v2. O grep não achou `eyJ` nem `service_role`.

11. **Sem `Content-Security-Policy`** em index.html. Muito `innerHTML` (26 usos em app.js e sync.js, escapados com `esc()` em 28 pontos). Conferir se todo dado vindo do Supabase (comentários, nomes, sugestões) passa por `esc()`. Amostra OK, não auditei todos os 26 usos. Esforço: 1 a 2 h.

## BAIXO

12. **Acessibilidade**
   - `<meta viewport>` está sem `user-scalable=no`, o que é correto. Manter.
   - Cartões e botões usam `<button>`, bom. Há `aria-live` em `#count` e `#authMsg`. `pushNotify` usa `role="status"`.
   - `pushNotify` (app.js:411-417) some em 6 s. Para quem usa leitor de tela ou precisa de mais tempo é curto; é um botão que abre a central. Considerar pausar com foco ou toque.
   - O arrastar para cima para dispensar existe só no toque. Falta equivalente no teclado (Esc).
   - Há 2 `font-size` abaixo de 12 px (grep `font-size:9|10|11px`). Conferir contraste e tamanho no iPhone.
   - A galeria automática respeita `prefers-reduced-motion` (app.js:388). O CSS também tem a regra global (css:62). OK.
   - Alvos de toque dos `.qk` na home têm `min-height:34px` (css:508, 515), abaixo dos 44 px recomendados.
   - `alt=""` nas imagens dos cartões é aceitável, porque o nome do lugar está em texto ao lado.

13. **Performance**
   - app.css tem 81 KB e app.js 72 KB sem minificação, carregados em série com `?v=` e service worker rede-primeiro. Dá para fazer a minificação no `npm run sync` do native, sem build no site. Ganho moderado.
   - `sw.js` CASCO lista `assets/cat-*.jpg`, mas não lista `img/logo-app.png`, usado em notificações e na central. Offline esse ícone falha. Esforço: 5 min.
   - Imagens de lugar: o primeiro slide da galeria carrega sem `lazy` (correto). Verificar `width/height` para evitar salto de layout.

14. **Versionamento**: index.html está em `?v=159` e o sw.js em `mesai-rede-primeiro-144`. São contadores separados por convenção, então não é bug. Só garantir que ambos subam juntos a cada mudança. O diff atual (não commitado) já traz os dois.

15. **`tests/smoke.js`**: o CLAUDE.md já avisa de duas falhas antigas (check-in de 10 pontos e moderação manual). Falta cobertura para galeria, `pushNotify`, teste grátis e a notificação `trial-start`. Pedir ao qa-testes.

## Ordem sugerida
1. Apagar o backup (1) e a section oculta com seu JS (3). 20 min, risco baixo.
2. Corrigir a galeria (2) e `document.hidden` (8). 1 h.
3. Remover CSS morto (5) com bateria visual em 390 e 320 px.
4. Foco nos modais (4).
5. Consolidar CSS por componente (6), só depois do item 5.
