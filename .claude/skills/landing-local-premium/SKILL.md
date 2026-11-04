---
name: landing-local-premium
description: Cria landing pages premium para negócios locais (loja, serviço de entrega, oficina, socorro, clínica, etc.) no padrão visual "site foda" — hero com faixa 3D de produtos, abertura animada com a logo, dobras com ícones, depoimentos reais do Google, mapa, SEO local e performance 90+ no celular — e entrega como HTML único pronto para colar no WordPress/Elementor. Use sempre que pedirem "faz um site/landing para [negócio]", "página para colar no Elementor", "site de [serviço] em [cidade]", ou quiserem adaptar uma página clonada para um novo nicho.
---

# Landing page premium para negócio local

Objetivo: entregar uma página que **impressiona, converte no WhatsApp, abre rápido no celular e ranqueia no Google local** — e que funcione colada dentro de um widget HTML do Elementor, onde o tema do WordPress tenta quebrar tudo.

Este fluxo foi destilado de um projeto real (Júnior Bateria, Maceió). Siga a ordem: cada etapa existe porque algo quebrou sem ela.

## 0. Base técnica

- Projeto Next.js 16 + Tailwind v4 + shadcn (template `ai-website-cloner-template`). Componentes da página em `src/components/sites/<slug>/`, componentes genéricos em `src/components/ui/`, imagens em `public/sites/<slug>/`.
- `src/app/page.tsx` só importa a página e o CSS dela. **Remova as web fontes do template** (`next/font` em `layout.tsx`): use a pilha de fontes do sistema — zero download e zero 404 no WordPress.
- Ponto de partida visual: o CSS em `references/base-tokens.css` (tokens escuros, botões pill, eyebrows, ícones em blocos).
- A entrega final **não é o app Next**: é um HTML único gerado por `scripts/export-static.js`. Tudo que depende de JavaScript do React **não roda** nesse HTML (veja §6).

## 1. Briefing — confirme antes de construir

Peça/confirme e trate como fonte da verdade o que o cliente mandar:

1. **Copy** por dobra (aceite listas soltas e organize; remova restos de outros sites, ex.: um depoimento em inglês de outra empresa).
2. **Marca**: arquivo da logo e cor. Tire a cor da própria logo com PIL (pixel mais frequente da cor de destaque).
3. **Contatos (NAP)**: nome, endereço, telefone/WhatsApp. Se achar divergência (Google, Instagram, CEP, "107" vs "107 A"), **pergunte uma vez**, depois use exatamente o que o cliente disser e padronize em página, mapa e JSON-LD.
4. **Imagens**: peça como **arquivo anexado**. Imagem colada no chat é só visual — não vira arquivo no disco.
5. **Depoimentos**: só reais (prints do Google/WhatsApp). Ver §8.
6. Rede: se precisar baixar algo (site de referência, logos), o domínio tem que estar liberado na política de rede do **ambiente** (menu do título da sessão → Edit cloud environment → Network access), não só nas configurações da conta. A mudança costuma valer só em sessão nova.

## 2. Arquitetura de dobras (alternar claro/escuro)

| # | Dobra | Fundo | Conteúdo |
|---|---|---|---|
| 0 | Abertura (intro) | escuro | logo + produtos voando em túnel 3D, ≤1,4 s, só CSS |
| 1 | Hero | **branco** | header com logo escura; H1 com serviço + cidade; faixa curva 3D de produtos (TiltedGridHero); subtítulo; CTA dourado + botão WhatsApp pulsando |
| 2 | Faixa de confiança | escuro | 4 itens com ícone dourado |
| 3 | Como funciona | escuro | 3 passos: ícone, número grande "01", setas douradas entre cards |
| 4 | Benefícios | escuro | 4 cards com ícone + marquee infinito com logos das marcas |
| 5 | Diferencial tangível | **branco** | ex.: "Não precisa rebocar" → mapa estilizado com veículo andando até o cliente, números grandes (40 MIN / 100%), lista ✕/✓ |
| 6 | Soluções | escuro | painel de diagnóstico animado (barras + checks) + 3 cards com "Fale Conosco" |
| 7 | Depoimentos | **branco** | HighlightTestimonialSection + selo de nota real do Google com link |
| 8 | Endereço | escuro | card de endereço, "Como chegar" (rota), WhatsApp, mapa Google embed |
| 9 | CTA final | escuro | headline forte + 2 botões |
| 10 | Rodapé | escuro | logo clara, nome · cidade, CNPJ |

Regras de copy/layout:
- Não repetir a mesma frase em subtítulo e cards (ex.: "na rua, no trabalho, em casa" 3×).
- Nunca texto amarelo/dourado sobre branco (contraste). Dourado só em fundo escuro, em botões (com texto preto) e detalhes.
- Logo: gerar versão **escura** (branco → preto) para fundo branco e manter a **clara** para fundo escuro (`scripts/images.py logo`).

## 3. Sistema visual

- Botões: pill, altura **60–62 px** (desktop e mobile), texto 16 px; primário dourado com texto preto; WhatsApp branco com ícone oficial verde + anel verde pulsando (`references/base-tokens.css`).
- Estrela que percorre a borda dos botões (`offset-path: inset(0 round 999px)`).
- Ícones: `lucide-react` (confira os nomes na versão instalada; na 1.x use `CircleCheck`, `CircleX`). Ícone dentro de bloco 52 px com fundo dourado 12%.
- Títulos de seção em 2 linhas: linha 1 branca, linha 2 dourada.
- H1 do hero: `clamp(56px, 5vw, 76px)` no desktop; ajuste a altura da dobra para a faixa de produtos não encostar.

## 4. Movimento

- **CSS primeiro.** Intro, marquee, pulsos, barras, estrela: tudo em `@keyframes`.
- Componentes que precisam de JS (faixa 3D, carrossel) precisam de **driver vanilla** para o HTML exportado (`scripts/drivers/`).
- `prefers-reduced-motion`: **pausar**, não remover. Uma regra global `animation: none` desmonta layouts que dependem de animação (a faixa 3D vira uma pilha com uma imagem só). Exclua da regra global os elementos que precisam pausar (`.jb-tile`, `[class*="tgh-t-"]`, intro) e esconda enfeites (estrela). Muita gente (incluindo clientes) tem "Reduzir movimento" ligado no Mac.
- Intro: overlay `position:fixed`, `pointer-events:none`, some sozinho com `visibility:hidden` no fim; atrase a entrada do H1 para coincidir com a saída.

## 5. Imagens de produto

Use `scripts/images.py`:
- `removebg`: flood fill a partir das bordas (tolerância baixa, ~10) — tolerância alta "vaza" para dentro de rótulos brancos. Se a imagem já tem alfa, **mantenha o alfa** (não converta para RGB).
- `crop`: recorte pelo **maior bloco contínuo** de linhas/colunas opacas — linhas soltas na borda da foto geram bbox da imagem inteira e desalinham o produto.
- `pad`: normalize todas para a mesma proporção (~1,56) com margem transparente; senão as fotos "quadradas" aparecem maiores.
- `resize`: ao tamanho exibido (faixa 640 px, logos 160–300 px, intro 300 px), WebP.
- Na faixa 3D, cards transparentes + `object-fit: contain` (sobrescreva com CSS de maior especificidade + `!important`).
- Confira o alinhamento capturando a faixa em 4 momentos da animação e montando uma imagem só.

## 6. Entrega no WordPress/Elementor

`node scripts/export-static.js <config.json>` (ver `references/export-config.example.json`):
- Captura o DOM renderizado, embute CSS e imagens (data URI), **remove scripts do Next** (mantém `application/ld+json`), remove favicon, esvazia a faixa 3D e injeta os drivers vanilla.
- **Deduplica imagens**: a primeira cópia fica, as demais pegam o `src` no carregamento (ganhou ~170 KB).
- O `<head>` do HTML colado é ignorado pelo Google no Elementor — título/descrição vão no Yoast/Rank Math.

CSS obrigatório (`references/wordpress-hardening.css`):
- **Full-bleed**: `.page{width:100vw;margin-left:calc(50% - 50vw)}` + `html,body{overflow-x:hidden}` — o container "boxed" do Elementor corta a página.
- **Blindagem contra o tema**: o tema força `img{height:auto;max-width:100%}`, botões rosa (Hello Elementor `#c36`), `figcaption` itálico e margem em `p`. Tailwind v4 usa `@layer`, e **CSS sem layer (o do tema) vence qualquer utility do Tailwind**. Logo: tamanhos de imagem com seletor específico + `!important`; botões de componentes com `all: unset` e estilo próprio.
- Oriente o cliente: container "Largura total", padding 0; página "Elementor Canvas" se o header do tema aparecer.

## 7. QA (obrigatório antes de enviar)

`node scripts/qa.js <arquivo.html>` roda em 1440, 1280, 820, 768, 390 e 360 px **com CSS que imita o tema WordPress** e reporta:
- elementos fora da tela (medição por elemento — `overflow-x:hidden` esconde o problema do scrollWidth);
- alvos de toque < 44 px; texto < 12 px; imagens sem alt/quebradas; erros de console.

Depois:
- Capturas por seção em tablet e celular (montagem lado a lado) e olhe de verdade.
- Lighthouse antes/depois (servir com `python3 -m http.server`; `CHROME_PATH=/opt/pw-browsers/chromium npx -y lighthouse@12.6.0 ...`). Meta: **celular ≥ 90, acessibilidade 100, SEO 100**. 404 de `/favicon.ico` no servidor local é esperado.
- Portas: não use 6000 (Chromium bloqueia — ERR_UNSAFE_PORT).

## 8. SEO local e ética

Na página:
- Um único H1 com serviço + cidade; H2 por dobra; `alt` descritivo; `lang="pt-BR"`.
- JSON-LD `LocalBusiness` (ex.: `AutoPartsStore`) com nome, endereço (PostalAddress), telefone, `areaServed`, `hasMap`, `sameAs` (Instagram), marcas. **Não** inclua `aggregateRating` copiado do Google (avaliações autodeclaradas não geram estrela).
- Mapa: `https://maps.google.com/maps?q=<nome+endereço>&z=16&hl=pt-BR&output=embed`, `loading="lazy"`; "Como chegar": `https://www.google.com/maps/dir/?api=1&destination=<nome+endereço>`.

Fora da página (entregue como checklist ao cliente):
1. Publicar no **domínio do cliente**; página de teste em domínio de agência com `noindex`.
2. Título (≤60) e descrição (≤155) no Yoast/Rank Math.
3. Perfil da Empresa no Google: link do site, categoria certa, fotos, pedir e responder avaliações.
4. NAP idêntico em site, Google e Instagram.
5. Search Console + favicon (logo) em Aparência → Personalizar.
6. Nunca prometa "primeiro lugar": a página fica tecnicamente pronta; o ranking local depende de perfil, avaliações e proximidade.

**Depoimentos inventados: não.** Em site de empresa real é propaganda enganosa (CDC) e quebra confiança. Use avaliações reais do Google (texto como está, só pontuação mínima) e, se faltar, entregue uma mensagem pronta para o cliente pedir depoimentos. Mesmo raciocínio para não publicar como link próprio um clone com marca/depoimentos de terceiros.

## 9. Arquivos da skill

| Arquivo | Para quê |
|---|---|
| `references/example-junior-bateria/` | Página completa de referência (TSX + CSS + layout) — copie e adapte |
| `references/components/tilted-grid-hero.tsx` | Faixa curva 3D de produtos do hero → `src/components/ui/` |
| `references/components/highlight-testimonial-section.tsx` | Carrossel de depoimentos com destaque → `src/components/ui/` |
| `references/base-tokens.css` | Tokens, botões, marquee, intro, reduced motion |
| `references/wordpress-hardening.css` | Full-bleed + blindagem contra o tema |
| `references/export-config.example.json` | Config do exportador |
| `scripts/export-static.js` | Gera o HTML único para o Elementor |
| `scripts/drivers/*.js` | Versões sem React da faixa 3D e do carrossel (injetadas pelo exportador) |
| `scripts/qa.js` | QA em 6 larguras com tema simulado (sai com código 1 se houver problema) |
| `scripts/images.py` | `product`, `logo`, `color`, `check` |

Comandos (a partir do projeto Next):
```bash
npm run check && npx next start -p 3100 &
NODE_PATH=$(npm root -g) node .claude/skills/landing-local-premium/scripts/export-static.js config.json
NODE_PATH=$(npm root -g) node .claude/skills/landing-local-premium/scripts/qa.js /caminho/saida.html --shots /caminho/shots
```
(ajuste o caminho da skill se ela estiver em outro repositório)

## 10. Como responder ao cliente

- Português, direto, sem jargão; diga o que mudou, o que conferiu e como (medidas reais), e o que ficou pendente.
- Sempre reenviar o HTML final com `SendUserFile` (anexo) e explicar como colar no widget HTML do Elementor.
- Antes de enviar: reler os prints do cliente, comparar com as capturas e conferir de novo o que ele reclamou. "Revise antes de me enviar" é regra, não pedido.
