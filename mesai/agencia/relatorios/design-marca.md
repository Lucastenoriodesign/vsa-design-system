# Auditoria Design e Marca — contraste, toque, fonte e foco

Data: 22/11/2026. Só leitura: nenhum arquivo do app, nem a logo, foi alterado. Medido em `tokens.css` e `app.css` e no app real (iPhone 13, 390 px, http://localhost:8124). Capturas em `agencia/relatorios/img-design/` (`home.png`, `home2.png`, `aba1..4.png`, `foco.png`, `notificacoes.png`).
Critério: WCAG 2.1 AA (texto 4,5:1; texto grande e ícones/componentes 3:1; alvo de toque 44 px, regra do próprio projeto `--touch`).

## Resumo
Base boa: texto de leitura passa com folga (muted 5,2 a 5,5:1; coral-dark 5,4 a 5,7:1; chip ativo branco sobre ink 14,4:1) e o foco é visível. Falhas reais concentradas em: **texto branco sobre coral claro**, **gradiente do botão principal**, **alvos de toque de 30 a 34 px nos atalhos e chips** e **textos de 10,5 a 11 px**.

## ALTA

1. **Branco sobre `--coral` #e87558 = 2,95:1 (falha AA, texto e ícone).**
   Onde: ícone branco do cartão de notificação (`.nico`, inclusive o do teste grátis), usos de `--on-accent` sobre `--coral`. Nota: no menu inferior o item ativo já usa `--coral-dark` (ok); o risco é qualquer texto/ícone branco sobre `--coral`.
   Correção: onde houver texto ou ícone branco, trocar o fundo por `--coral-dark` #a84a34 (5,68:1) ou, se quiser manter um salmão mais vivo para fundos grandes, `#c2573e` (4,44:1, ainda abaixo para texto pequeno; serve só para ícone/texto 18px+). Regra: `--coral` #e87558 só para decoração/indicador (barrinha do menu, pin), nunca com texto branco.

2. **Botão principal `.btn` (Ver detalhes, Traçar rota, Publicar...): gradiente começa em #b96e5d.**
   Branco sobre o canto claro = 3,85:1 (falha); sob o texto fica por volta de 4,5:1 (limite); no fim do gradiente #a84a34 passa (5,68:1). `app.css` linha 736: `color-mix(in srgb,var(--coral-dark) 80%,#fff)`.
   Correção: começar em `color-mix(in srgb,var(--coral-dark) 92%,#fff)` (aprox. #ad5540, 5,0:1) ou tirar o gradiente e usar `--coral-dark` chapado. Visual quase igual, AA garantido. (Alinha com a preferência do Lucas por salmão em poucos lugares.)

3. **Alvos de toque abaixo de 44 px (medido no app):**
   - Atalhos da home `.qk` (Filtros, Aberto agora, Perto de mim, Surpreenda-me, Mapa, Shopping): **34 px** de altura (`app.css` 508 e 515 sobrescrevem `--touch`).
   - Chips de categoria `.chip` na aba Buscar: **30 px** (`#view-buscar .chip`, linha 518) e **32 px** na home (linha 513).
   - Filtros do `#fsheet .filter`: **34 px** (linha 526).
   - Barra de rolagem horizontal com 6 atalhos empilhados em duas linhas aumenta o erro de toque.
   Correção: manter o visual compacto e aumentar só a área clicável: `min-height:44px` com `padding-block` que mantenha a pílula de 34 px visível via pseudo-elemento, por exemplo `.qk,.chip,#fsheet .filter{position:relative}` e `::after{content:"";position:absolute;inset:-5px -2px}` (área de 44 px sem mudar o desenho). Alternativa aceitável pela WCAG 2.2 (24 px + espaçamento): hoje 30 e 34 px com 8 px de espaço passam o mínimo 2.5.8, mas não o padrão do projeto (44).

## MÉDIA

4. **Fontes pequenas.** Medido no app: rótulos da barra inferior **11 px** (linha 555; `--fs-xs` é 12), `.pn-h` **10,5 px** (linha 714), `.dact .btn.act` **11 px** em telas até 374 px (linha 733), chips **12 a 12,5 px**, `.qk` 13 px. A maioria do corpo está em 14 px, bom.
   Correção: barra inferior 12 px (`.nav .lbl{font-size:var(--fs-xs)}`, com `letter-spacing:-.01em` se faltar largura; "Comunidade" é o rótulo mais largo, cabe a 12 px em 390); `.pn-h` 12 px; `.act` 12 px; mínimo geral do app = 12 px.

5. **Ícones e bordas de controle abaixo de 3:1 (WCAG 1.4.11).**
   - `--icon-dim` #8a8379 sobre branco = 3,75:1 (ok), sobre creme 3,54:1 (ok, limite). Sem ação.
   - Interruptor desligado `.toggle input` #d9d2c7 sobre branco = **1,50:1** (falha). Correção: `#8d867b` (3,60:1).
   - Borda de campos/cartões `--line` #e8e5e0 = 1,26:1 e `--line-strong` #d5cec3 = 1,56:1. Para cartões decorativos é tolerável (não são o único identificador), mas **campos de formulário** (`.form input`, `.composer textarea`, `.search`) dependem da borda: usar `#8d867b` (3,60:1) ou `--ink-3` com 1px nesses campos, ou fundo `--fill` para diferenciar.

6. **Notificação do teste grátis (`.nitem.k-trial`/`.unread`, fundo `--coral-bg` #fbe4de):** título `--coral-ink` #a3412c = 5,15:1 (ok); subtítulo `--muted` #6f685f = **4,52:1** (passa por pouco, sem folga em tela com brilho baixo). Correção: texto do `.np` com `--ink-3` #5c564e (sobre coral-bg ≈ 5,7:1). O ícone `.nico` é o item 1 (2,95:1).
   Observação: em captura com dados de teste a data saiu "NaN/aN" porque eu simulei o `mesai-trial` de forma errada; não é bug confirmado do app.

7. **Marcador não lido** (bolinha #e87558 sobre #fbe4de) e barrinha do menu ativo (#e87558 sobre branco 2,95:1): elementos só decorativos acompanhados de texto/negrito, aceitável. Se quiser indicar estado só pela cor, usar `--coral-dark`.

## BAIXA

8. **Foco visível: ok.** `:focus-visible{outline:2px solid var(--coral-dark);outline-offset:2px}` (5,68:1 sobre branco; 4,67:1 sobre coral-bg), confirmado por Tab no app (`foco.png`: contorno sólido 2px rgb(168,74,52)). Única exceção medida: o `<input>` da busca tem `outline:0`, mas o contêiner `.search:focus-within` troca a borda para coral-dark + halo `--coral-bg` (borda 1px muda de cor 1,26 para 5,68:1; aceitável, melhoraria com 2px).
   Pequeno ajuste sugerido: `.search:focus-within{border-width:2px}` (compensando padding em 1px para não pular o layout).

9. **`<input>` com 24 px de altura** (busca) dentro de contêiner de 44+ px: o toque no contêiner foca o campo? Se não, a área útil é só 24 px. Não verifiquei o clique na borda; vale testar. Sugestão: `.search{cursor:text}` e `label` ou `onclick` focando o input.

10. **Textos que dependem de camada:** `Ver detalhes` e `Publicar` aparecem como 1,00:1 no verificador automático porque o fundo é `background-image` (gradiente); não é erro real, é o item 2.

## Pares que passam (referência)

| Par | Razão |
|---|---|
| branco sobre coral-dark #a84a34 (botão, skip-link, mapa) | 5,68 |
| coral-dark sobre branco / creme / fill (links, "N lugares") | 5,68 / 5,36 / 4,83 |
| coral-ink #a3412c sobre coral-bg | 5,15 |
| coral-dark sobre coral-bg | 4,67 |
| muted #6f685f sobre branco / creme / fill | 5,50 / 5,18 / 4,67 |
| ink-3 sobre creme | 6,84 |
| ink-2 sobre branco | 8,78 |
| branco sobre ink (chip e filtro ativos, toast) | 14,38 |
| ink #292a2b sobre coral (pin) | 4,87 |
| green sobre green-bg / branco | 4,66 / 5,32 |
| amber-ink sobre amber-bg | 6,13 |
| ink-warm-2 e #6b5a52 (onboarding) sobre branco | 6,40 / 6,54 |

Observação de marca: a barra inferior usa ícone e texto em ink (#292a2b) com a marca coral só numa barrinha de 3px acima do item ativo (linha 579), equilibrado e de acordo com a preferência de usar salmão em poucos lugares; contraste ok. O botão do coração: 44x44 com disco 32 px, ok.

## Verificações sem problema
- Nada vazando da tela nas abas Buscar, Em alta, Comunidade e Perfil. Na home só o carrossel horizontal intencional (`.cw`, `.hcard`) passa da borda.
- Botões `.btn`, `.heart`, `.close`, `.profile-btn`, `.nav` (54 px de altura), `.seg`: todos 44 px ou mais.

## Não testado
- Detalhe do lugar e boas-vindas: a auditoria automática parou ao voltar da aba Perfil (sem captura); contraste desses textos foi calculado pelos tokens, não pixel a pixel.
- Leitor de tela, zoom 200%, modo escuro (o app não tem) e telas pequenas (320 px) não foram testados.
- Contraste sobre fotos (selos `.pill` sobre imagem) varia com a foto; recomendo garantir fundo sólido ou degradê escuro nos selos.
