/**
 * Creative Intelligence Library — a vocabulary of techniques, not templates.
 *
 * Provenance: these are ORIGINAL implementations written for this studio. The 17 Behance
 * references could not be opened (Behance answers automated browsers with a bot challenge, see
 * creative-intelligence/references/*\/source.json), so no entry claims to be derived from them.
 * When reference material becomes available (exports/screenshots supplied by the user), new
 * entries should cite it in `inspiration`.
 */
export type Pattern = {
  id: string;
  name: string;
  category: "hero" | "typography" | "composition" | "material" | "background" | "cards" | "pricing" | "proof" | "transition" | "motion" | "cta" | "faq" | "navigation" | "footer";
  intents: string[]; // searchable visual intents (pt + en)
  fits: string[]; // brand situations where it shines
  avoidWhen: string;
  technique: string; // implementation notes the Frontend agent follows
  inspiration: string;
  demo: string; // self-contained HTML fragment rendered live in the gallery
};

const F = (fams: string) => `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fams}&display=swap">`;

export const PATTERNS: Pattern[] = [
  {
    id: "hero-editorial-split",
    name: "Hero editorial com fotografia protagonista",
    category: "hero",
    intents: ["hero editorial", "autoridade", "mentoria", "fotografia protagonista", "revista", "premium", "cinematográfico"],
    fits: ["mentoria premium", "especialista", "advocacia", "consultoria"],
    avoidWhen: "Não há fotografia real e de boa qualidade da pessoa/produto.",
    technique: "Grid 12 colunas: título monumental ocupa colunas 1-8 e invade a área da foto (z-index acima, mix de pesos). Foto em coluna 7-12 com máscara retangular alta e legenda tipo revista (número + rubrica). Kicker em versalete com tracking 0.2em. Fio fino (1px) como régua editorial.",
    inspiration: "Original — linguagem de capa de revista de negócios.",
    demo: `${F("family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Inter:wght@400;500")}
<style>.he{font-family:Inter,sans-serif;background:#f3efe7;color:#16130f;display:grid;grid-template-columns:repeat(12,1fr);gap:0 20px;padding:48px 40px;min-height:420px;position:relative;overflow:hidden}
.he .k{grid-column:1/7;font-size:11px;letter-spacing:.22em;text-transform:uppercase;border-top:1px solid #16130f;padding-top:10px}
.he h1{grid-column:1/9;grid-row:2;z-index:2;font-family:Fraunces,serif;font-weight:300;font-size:clamp(40px,7vw,86px);line-height:.92;letter-spacing:-.03em;margin:28px 0 0}
.he h1 b{font-weight:600;font-style:italic}
.he .ph{grid-column:8/13;grid-row:1/4;background:linear-gradient(160deg,#8a7a63,#2c241b);min-height:380px;position:relative}
.he .ph:after{content:"Nº 01 — Retrato";position:absolute;left:12px;bottom:10px;color:#f3efe7;font-size:10px;letter-spacing:.2em;text-transform:uppercase}
.he p{grid-column:1/6;font-size:15px;line-height:1.6;color:#4a4238;margin-top:24px}
@media(max-width:640px){.he{grid-template-columns:1fr;padding:28px 20px}.he>*{grid-column:1!important;grid-row:auto!important}.he .ph{min-height:240px;order:-1;margin-bottom:20px}}</style>
<div class="he"><div class="k">Programa de mentoria · Turma 2027</div><h1>Decisões <b>maiores</b> pedem outro repertório</h1><div class="ph"></div><p>Uma composição que trata o especialista como capa — não como avatar ao lado de um botão.</p></div>`,
  },
  {
    id: "type-monumental-outline",
    name: "Tipografia monumental com contraste de estilo",
    category: "typography",
    intents: ["tipografia de alto impacto", "título gigante", "manchete", "expressiva", "outline", "brutalista"],
    fits: ["lançamentos", "desafios", "cursos expressivos", "eventos"],
    avoidWhen: "Marcas jurídicas/médicas que pedem sobriedade.",
    technique: "Palavra-chave em tamanho clamp(64px,14vw,220px), line-height .82, tracking negativo. Alternar preenchido/contorno (-webkit-text-stroke) e itálico. Quebras de linha manuais por <span class=line>. No mobile reduzir para 15–17vw e manter no máx. 3 palavras por linha.",
    inspiration: "Original — cartazes tipográficos suíços + brutalismo controlado.",
    demo: `${F("family=Anton&family=Instrument+Serif:ital@1")}
<style>.tm{background:#0e0e0c;color:#ecebe4;padding:40px;overflow:hidden;min-height:380px}
.tm span{display:block;font-family:Anton,sans-serif;font-size:clamp(56px,13vw,180px);line-height:.84;text-transform:uppercase;letter-spacing:-.01em}
.tm .o{color:transparent;-webkit-text-stroke:1.5px #ecebe4}
.tm em{font-family:'Instrument Serif',serif;font-style:italic;text-transform:none;color:#d7ff3a;letter-spacing:0}
.tm small{display:flex;justify-content:space-between;font:12px/1.4 monospace;margin-top:20px;opacity:.7}</style>
<div class="tm"><span>Trinta</span><span class="o">dias para</span><span><em>virar</em> a chave</span><small><i>Desafio · 30 dias</i><i>01 / 07</i></small></div>`,
  },
  {
    id: "material-brushed-metal",
    name: "Superfície de metal escovado / cromo discreto",
    category: "material",
    intents: ["metal", "metálico", "cromado", "card premium", "acabamento metálico", "cartão de crédito", "luxo"],
    fits: ["finanças", "gateway de pagamento", "produtos premium", "membership"],
    avoidWhen: "Marcas acolhedoras/orgânicas; usar no máximo em 1–2 elementos por página.",
    technique: "Camadas: repeating-linear-gradient(90deg) de 1–2px com alfa baixo (escovado) + linear-gradient diagonal com 3 paradas claras/escuras (reflexo) + inset box-shadow para chanfro + borda 1px com gradient (border-image ou pseudo). Brilho que acompanha o mouse via --mx/--my em radial-gradient.",
    inspiration: "Original — estudo de materiais (alumínio anodizado).",
    demo: `<style>.mt{min-height:360px;display:grid;place-items:center;background:#0b0c0e}
.mt .c{width:min(340px,80vw);aspect-ratio:1.586;border-radius:16px;position:relative;padding:22px;color:#1c1d20;font:600 13px/1 system-ui;letter-spacing:.14em;
background:repeating-linear-gradient(90deg,rgba(255,255,255,.08) 0 1px,rgba(0,0,0,.05) 1px 3px),linear-gradient(115deg,#9ea3aa 0%,#eef0f2 28%,#a8adb4 46%,#dfe2e6 70%,#8d929a 100%);
box-shadow:inset 0 1px 0 rgba(255,255,255,.9),inset 0 -1px 0 rgba(0,0,0,.35),0 30px 60px -20px rgba(0,0,0,.8);transition:transform .4s}
.mt .c:hover{transform:rotateX(8deg) rotateY(-10deg)}
.mt .c:before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at var(--mx,30%) var(--my,20%),rgba(255,255,255,.55),transparent 40%);mix-blend-mode:overlay}
.mt .n{position:absolute;left:22px;bottom:22px;font-family:ui-monospace,monospace;letter-spacing:.2em}</style>
<div class="mt" style="perspective:900px"><div class="c" onmousemove="const r=this.getBoundingClientRect();this.style.setProperty('--mx',(event.clientX-r.left)+'px');this.style.setProperty('--my',(event.clientY-r.top)+'px')">GOLD · RESERVE<span class="n">•••• 2027</span></div></div>`,
  },
  {
    id: "material-frosted-glass",
    name: "Vidro jateado com luz de recorte",
    category: "material",
    intents: ["vidro", "glass", "transparência", "translúcido", "saas", "tecnologia"],
    fits: ["SaaS", "tecnologia", "dashboards"],
    avoidWhen: "Fundos lisos (o vidro só funciona sobre algo com detalhe por trás).",
    technique: "backdrop-filter: blur(18px) saturate(140%); fundo rgba 6–10%; borda 1px rgba branca 18%; highlight superior com linear-gradient em ::before; precisa de conteúdo colorido atrás (forma, gráfico, foto). Fallback @supports not(backdrop-filter) com fundo opaco.",
    inspiration: "Original.",
    demo: `<style>.gl{min-height:360px;position:relative;display:grid;place-items:center;background:#0a1020;overflow:hidden;font-family:system-ui;color:#e8eefc}
.gl:before{content:"";position:absolute;width:360px;height:360px;left:12%;top:8%;background:conic-gradient(from 200deg,#2de2a6,#2c6bff,#0a1020 70%);filter:blur(10px);border-radius:40% 60% 55% 45%}
.gl .p{position:relative;width:min(380px,84vw);padding:22px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(18px) saturate(140%)}
.gl .p:before{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.18),transparent 30%);pointer-events:none}
.gl b{font-size:34px;display:block;margin:6px 0}.gl i{font-style:normal;font-size:12px;opacity:.7;letter-spacing:.1em;text-transform:uppercase}
.gl .bar{height:6px;border-radius:3px;background:linear-gradient(90deg,#2de2a6 72%,rgba(255,255,255,.12) 0);margin-top:14px}</style>
<div class="gl"><div class="p"><i>Latência média</i><b>38 ms</b><span style="font-size:13px;opacity:.8">Dados reais da interface, não um mockup genérico.</span><div class="bar"></div></div></div>`,
  },
  {
    id: "bg-grain-light",
    name: "Granulação fotográfica + luz volumétrica",
    category: "background",
    intents: ["textura", "granulação", "grain", "luz volumétrica", "fundo com textura", "cinematográfico"],
    fits: ["qualquer marca com direção fotográfica", "páginas escuras"],
    avoidWhen: "Interfaces que pedem limpeza clínica absoluta.",
    technique: "SVG feTurbulence (baseFrequency .8, numOctaves 3) como data-URI em ::after com opacity .06–.12 e mix-blend-mode overlay. Luz: 2 radial-gradients elípticos grandes e de baixa saturação, um deles inclinado como feixe (linear-gradient rotacionado + blur).",
    inspiration: "Original — tratamento de cinema/filme.",
    demo: `<style>.gr{min-height:340px;position:relative;overflow:hidden;background:radial-gradient(120% 80% at 80% 0%,#3a2a1c,transparent 60%),radial-gradient(80% 60% at 0% 100%,#14202a,transparent 70%),#0d0b09;color:#efe6d8;display:grid;place-items:center;font:300 28px/1.2 Georgia,serif;text-align:center;padding:30px}
.gr:before{content:"";position:absolute;left:55%;top:-20%;width:180px;height:140%;background:linear-gradient(180deg,rgba(255,220,170,.22),transparent 80%);transform:rotate(18deg);filter:blur(24px)}
.gr:after{content:"";position:absolute;inset:0;opacity:.13;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}</style>
<div class="gr"><span style="position:relative;z-index:1">Luz como direção,<br><em>não como decoração.</em></span></div>`,
  },
  {
    id: "composition-asymmetric-benefits",
    name: "Benefícios em composição assimétrica numerada",
    category: "composition",
    intents: ["benefícios assimétricos", "seção de benefícios", "lista editorial", "sem cards", "numerada"],
    fits: ["cursos", "mentorias", "serviços"],
    avoidWhen: "Mais de 7 itens (vira lista longa; usar acordeão ou tabela).",
    technique: "Substitui 3 cards iguais: cada item é uma linha de grid com número grande (tabular-nums, fonte display) + título + texto; larguras e deslocamentos alternados (margin-left em %), fio 1px entre itens. Item destacado quebra o ritmo com fundo invertido.",
    inspiration: "Original — índice de livro/relatório anual.",
    demo: `<style>.ab{background:#f6f4ef;padding:36px 40px;font-family:system-ui;color:#1d1b18}
.ab .r{display:grid;grid-template-columns:90px 1fr 1.4fr;gap:20px;border-top:1px solid #1d1b18;padding:18px 0;align-items:baseline}
.ab .r:nth-child(2){margin-left:8%}.ab .r:nth-child(3){margin-left:16%;background:#1d1b18;color:#f6f4ef;padding:18px 16px}
.ab .n{font:300 44px/1 Georgia,serif;font-variant-numeric:tabular-nums}.ab h4{margin:0;font-size:18px}.ab p{margin:0;font-size:14px;line-height:1.55;opacity:.8}
@media(max-width:640px){.ab{padding:24px 18px}.ab .r{grid-template-columns:56px 1fr;margin-left:0!important}.ab .r p{grid-column:2}}</style>
<div class="ab"><div class="r"><span class="n">01</span><h4>Diagnóstico</h4><p>O que trava o crescimento hoje, com método.</p></div><div class="r"><span class="n">02</span><h4>Plano de 90 dias</h4><p>Prioridades em sequência, não uma lista de tarefas.</p></div><div class="r"><span class="n">03</span><h4>Acompanhamento</h4><p>Ajuste semanal com quem já fez.</p></div></div>`,
  },
  {
    id: "pricing-ticket",
    name: "Oferta como ingresso/certificado",
    category: "pricing",
    intents: ["card de oferta", "preço premium", "ingresso", "certificado", "hierarquia premium", "oferta"],
    fits: ["eventos", "imersões", "cursos", "mentorias"],
    avoidWhen: "Tabelas com 3+ planos comparáveis (usar tabela comparativa).",
    technique: "Card com recortes semicirculares laterais (radial-gradient mask) + linha picotada (border dashed) separando 'o que você recebe' do preço. Preço com parcelamento em destaque e valor à vista menor; selo de garantia circular em SVG com texto em textPath.",
    inspiration: "Original.",
    demo: `<style>.tk{background:#1b1f1a;padding:40px;display:grid;place-items:center;font-family:system-ui}
.tk .t{width:min(420px,86vw);background:#f2ead8;color:#1b1f1a;border-radius:10px;-webkit-mask:radial-gradient(circle 14px at 0 62%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 14px at 100% 62%,#0000 98%,#000) right/51% 100% no-repeat}
.tk .a{padding:22px 24px}.tk .a small{letter-spacing:.2em;text-transform:uppercase;font-size:10px}.tk .a h4{font:600 24px/1.1 Georgia,serif;margin:6px 0 10px}
.tk ul{margin:0;padding-left:18px;font-size:13px;line-height:1.7}.tk .b{border-top:2px dashed #1b1f1a55;padding:18px 24px;display:flex;align-items:end;justify-content:space-between}
.tk .p{font:700 34px/1 Georgia,serif}.tk .p small{font:400 12px system-ui;display:block;opacity:.7}.tk a{background:#1b1f1a;color:#f2ead8;padding:12px 16px;border-radius:4px;text-decoration:none;font-size:13px}</style>
<div class="tk"><div class="t"><div class="a"><small>Acesso · Turma única</small><h4>Imersão presencial</h4><ul><li>2 dias de conteúdo</li><li>Material impresso</li></ul></div><div class="b"><div class="p"><small>12x de</small>R$ 97<small>ou R$ 997 à vista</small></div><a href="#">Garantir vaga</a></div></div></div>`,
  },
  {
    id: "proof-quote-editorial",
    name: "Depoimento em pull-quote editorial",
    category: "proof",
    intents: ["depoimento", "prova social", "citação", "testemunho editorial"],
    fits: ["qualquer marca com depoimentos REAIS"],
    avoidWhen: "Não existem depoimentos reais na fonte — nunca inventar.",
    technique: "Uma citação por vez, grande (serif 28–40px), aspas tipográficas gigantes como elemento gráfico em cor de acento, atribuição com nome/cargo em versalete. Vários depoimentos: rolagem horizontal com scroll-snap, não carrossel automático.",
    inspiration: "Original.",
    demo: `<style>.pq{background:#eef0ea;padding:40px 48px;font-family:Georgia,serif;color:#1f2a24;position:relative;overflow:hidden}
.pq:before{content:"“";position:absolute;left:18px;top:-40px;font-size:220px;color:#c5d86d;line-height:1}
.pq blockquote{position:relative;margin:0;font-size:clamp(22px,3vw,34px);line-height:1.25;max-width:22ch}
.pq cite{display:block;margin-top:18px;font:600 11px system-ui;letter-spacing:.2em;text-transform:uppercase;font-style:normal}</style>
<div class="pq"><blockquote>Exemplo de layout — o conteúdo real vem da fonte, nunca é criado.</blockquote><cite>Nome real · Cargo real</cite></div>`,
  },
  {
    id: "transition-diagonal-clip",
    name: "Transição de seção por recorte angular",
    category: "transition",
    intents: ["transição de seção", "recorte", "diagonal", "clip-path", "ritmo"],
    fits: ["páginas longas que precisam de ritmo", "marcas dinâmicas", "telecom", "esporte"],
    avoidWhen: "Usar em toda seção (vira tique); máximo 1–2 por página.",
    technique: "clip-path: polygon(0 0,100% 0,100% calc(100% - 6vw),0 100%) na seção superior + margin-top negativo na seguinte. Alternativa orgânica: SVG path de onda absoluto no rodapé com fill igual à próxima seção.",
    inspiration: "Original.",
    demo: `<style>.dc .a{background:#ff4b1f;color:#fff;padding:40px 40px 90px;clip-path:polygon(0 0,100% 0,100% calc(100% - 60px),0 100%);font:800 32px system-ui}
.dc .b{background:#111;color:#eee;padding:80px 40px 40px;margin-top:-60px;font:15px system-ui}</style>
<div class="dc"><div class="a">Velocidade que se vê.</div><div class="b">A próxima seção entra pelo ângulo — o corte carrega a direção do movimento.</div></div>`,
  },
  {
    id: "motion-scroll-reveal-safe",
    name: "Reveal ao rolar (seguro)",
    category: "motion",
    intents: ["animação ao rolar", "reveal", "scroll", "entrada", "animação de texto ao rolar"],
    fits: ["todas, com parcimônia"],
    avoidWhen: "Conteúdo essencial do hero — deve estar visível sem JS.",
    technique: "Conteúdo VISÍVEL por padrão. JS adiciona .js na <html>; só então [data-reveal] começa com opacity:0/translateY(16px) e IntersectionObserver adiciona .in. @media (prefers-reduced-motion: reduce) desliga tudo. Fallback: timeout de 2.5s revela tudo.",
    inspiration: "Original — padrão de acessibilidade.",
    demo: `<style>.sr{background:#fafafa;padding:30px 40px;font:16px system-ui;height:340px;overflow:auto}
.js .sr [data-reveal]{opacity:0;transform:translateY(16px);transition:.7s cubic-bezier(.2,.7,.2,1)}.js .sr [data-reveal].in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.js .sr [data-reveal]{opacity:1;transform:none;transition:none}}
.sr div{padding:40px 0;border-bottom:1px solid #ddd;font-size:22px}</style>
<div class="sr" id="srb"><p>Role dentro da caixa ↓</p><div data-reveal>Primeiro bloco</div><div data-reveal>Segundo bloco</div><div data-reveal>Terceiro bloco</div><div data-reveal>Quarto bloco</div></div>
<script>document.documentElement.classList.add('js');{const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{root:document.getElementById('srb'),threshold:.2});document.querySelectorAll('#srb [data-reveal]').forEach(e=>io.observe(e))}</script>`,
  },
  {
    id: "motion-text-mask-rise",
    name: "Tipografia que surge por máscara",
    category: "motion",
    intents: ["motion typography", "texto animado", "máscara", "entrada do título"],
    fits: ["heros com título forte"],
    avoidWhen: "Textos longos.",
    technique: "Cada linha do título em <span class=l><span>…</span></span>; .l overflow:hidden; o span interno anima de translateY(105%) para 0 com stagger de 80ms via --i. Animação só com JS ativo e sem reduced-motion.",
    inspiration: "Original.",
    demo: `<style>.mr{background:#101418;color:#f1efe9;padding:50px 40px;font:700 clamp(36px,6vw,64px)/1 system-ui;letter-spacing:-.03em;min-height:300px}
.mr .l{display:block;overflow:hidden}.mr .l>span{display:block;animation:rise 1s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*90ms)}
@keyframes rise{from{transform:translateY(105%)}}@media (prefers-reduced-motion:reduce){.mr .l>span{animation:none}}</style>
<div class="mr" onclick="this.outerHTML=this.outerHTML"><span class="l"><span style="--i:0">Clique para</span></span><span class="l"><span style="--i:1">repetir a</span></span><span class="l"><span style="--i:2;color:#f2b84b">entrada.</span></span></div>`,
  },
  {
    id: "3d-css-product-stage",
    name: "Palco 3D em CSS para produto digital",
    category: "composition",
    intents: ["3d", "elemento 3d", "mockup", "produto", "isométrico", "composição 3d", "interface"],
    fits: ["SaaS", "apps", "cursos com plataforma real"],
    avoidWhen: "Não há interface/produto real para mostrar — 3D vazio é decoração.",
    technique: "Contêiner com perspective:1200px; telas como planos com transform: rotateX(55deg) rotateZ(-35deg) e translateZ escalonado (pilha isométrica); sombras projetadas por pseudo-elemento borrado no 'chão'. Conteúdo das telas = screenshots reais ou UI construída em HTML.",
    inspiration: "Original.",
    demo: `<style>.st{height:360px;background:#e9ecf2;display:grid;place-items:center;perspective:1200px;overflow:hidden}
.st .s{position:relative;width:260px;height:170px;transform:rotateX(55deg) rotateZ(-35deg);transform-style:preserve-3d}
.st .s i{position:absolute;inset:0;border-radius:8px;background:#fff;border:1px solid #cfd5e0;box-shadow:0 1px 0 #fff inset}
.st .s i:nth-child(1){transform:translateZ(0);background:#dfe5f0}.st .s i:nth-child(2){transform:translateZ(36px)}.st .s i:nth-child(3){transform:translateZ(72px);background:linear-gradient(#1f3cff 0 22%,#fff 0)}
.st .s:after{content:"";position:absolute;inset:10%;background:#1f2a4a;filter:blur(26px);opacity:.35;transform:translateZ(-10px)}</style>
<div class="st"><div class="s"><i></i><i></i><i></i></div></div>`,
  },
  {
    id: "cta-magnetic-underline",
    name: "CTA com sublinhado magnético e seta",
    category: "cta",
    intents: ["cta refinado", "botão premium", "botão", "microinteração"],
    fits: ["marcas sóbrias", "editoriais"],
    avoidWhen: "CTA principal de página popular/entrada (precisa de botão sólido evidente).",
    technique: "Link-botão com texto + seta SVG; ::after linha 1px que cresce com scaleX(0→1) origin left no hover/focus; seta desloca 4px. CTA primário continua sendo um bloco sólido de alto contraste com 48px de altura mínima.",
    inspiration: "Original.",
    demo: `<style>.cm{background:#f4f1ea;padding:60px 40px;display:flex;gap:28px;align-items:center;flex-wrap:wrap;font:500 15px system-ui}
.cm .p{background:#1b1a17;color:#f4f1ea;padding:16px 26px;text-decoration:none;display:inline-flex;gap:12px;align-items:center;transition:background .3s}.cm .p:hover{background:#7a2e1d}
.cm .s{color:#1b1a17;text-decoration:none;position:relative;display:inline-flex;gap:8px;align-items:center}
.cm .s:after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:1px;background:currentColor;transform:scaleX(.25);transform-origin:left;transition:transform .4s}.cm .s:hover:after,.cm .s:focus-visible:after{transform:scaleX(1)}
.cm svg{transition:transform .3s}.cm a:hover svg{transform:translateX(4px)}</style>
<div class="cm"><a class="p" href="#">Quero minha vaga <svg width="16" height="10" viewBox="0 0 16 10"><path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" fill="none"/></svg></a><a class="s" href="#">Ver o programa completo <svg width="16" height="10" viewBox="0 0 16 10"><path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" fill="none"/></svg></a></div>`,
  },
  {
    id: "faq-index-accordion",
    name: "FAQ como índice com <details>",
    category: "faq",
    intents: ["faq", "perguntas frequentes", "acordeão", "objeções"],
    fits: ["todas"],
    avoidWhen: "—",
    technique: "<details>/<summary> nativos (acessíveis, sem JS). Número da pergunta à esquerda, ícone + que gira 45°. Duas colunas no desktop: título da seção sticky à esquerda, perguntas à direita.",
    inspiration: "Original.",
    demo: `<style>.fq{display:grid;grid-template-columns:1fr 2fr;gap:30px;padding:36px 40px;background:#fff;font:15px system-ui;color:#191919}
.fq h3{font:400 34px/1 Georgia,serif;margin:0;position:sticky;top:20px}.fq details{border-top:1px solid #191919;padding:14px 0}
.fq summary{list-style:none;cursor:pointer;display:flex;gap:14px;font-weight:600}.fq summary::-webkit-details-marker{display:none}
.fq summary:after{content:"+";margin-left:auto;transition:transform .3s;font-weight:300;font-size:22px;line-height:.8}.fq details[open] summary:after{transform:rotate(45deg)}
.fq p{margin:10px 0 0 34px;line-height:1.6;opacity:.8}@media(max-width:640px){.fq{grid-template-columns:1fr;padding:24px 18px}}</style>
<div class="fq"><h3>Antes de decidir</h3><div><details open><summary><span>01</span>Para quem é?</summary><p>Resposta extraída da página original.</p></details><details><summary><span>02</span>Tem garantia?</summary><p>Só se a fonte informar.</p></details></div></div>`,
  },
  {
    id: "nav-minimal-progress",
    name: "Navegação mínima com progresso de leitura",
    category: "navigation",
    intents: ["navegação", "menu", "indicador de progresso", "sticky"],
    fits: ["páginas longas de vendas"],
    avoidWhen: "—",
    technique: "Barra fixa fina: marca à esquerda, CTA compacto à direita que aparece após o hero (IntersectionObserver), barra de progresso 2px via scroll-driven animation (animation-timeline: scroll()) com fallback JS.",
    inspiration: "Original.",
    demo: `<style>.nv{height:340px;overflow:auto;position:relative;font:14px system-ui;background:#f7f7f5}
.nv header{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;padding:14px 20px;background:rgba(247,247,245,.85);backdrop-filter:blur(8px);border-bottom:1px solid #0001}
.nv .bar{position:absolute;left:0;bottom:-1px;height:2px;width:100%;background:#e0482d;transform-origin:left;transform:scaleX(var(--p,0))}
.nv a{background:#111;color:#fff;padding:8px 14px;text-decoration:none;font-size:12px}.nv section{height:300px;padding:20px;border-bottom:1px dashed #0002}</style>
<div class="nv" onscroll="this.style.setProperty('--p',this.scrollTop/(this.scrollHeight-this.clientHeight))"><header><b>Marca</b><a href="#">Inscrever</a><i class="bar"></i></header><section>Role ↓</section><section>…</section><section>Fim</section></div>`,
  },
  {
    id: "footer-signature",
    name: "Rodapé assinatura com marca monumental",
    category: "footer",
    intents: ["rodapé", "footer", "assinatura", "fechamento"],
    fits: ["marcas com nome forte"],
    avoidWhen: "Nome muito longo (> 14 caracteres) — usar monograma.",
    technique: "Nome da marca em largura total (font-size em vw calculado para caber), cortado na base por overflow:hidden; acima, linha com dados legais reais (CNPJ, contato) em corpo pequeno.",
    inspiration: "Original.",
    demo: `<style>.fs{background:#151412;color:#e9e4da;padding:30px 30px 0;overflow:hidden;font:12px system-ui}
.fs .r{display:flex;justify-content:space-between;opacity:.7;border-bottom:1px solid #fff2;padding-bottom:14px}
.fs b{display:block;font:800 22vw/0.8 system-ui;letter-spacing:-.05em;margin-bottom:-3vw;white-space:nowrap}</style>
<div class="fs"><div class="r"><span>Dados legais reais da fonte</span><span>© 2027</span></div><b>marca</b></div>`,
  },
  {
    id: "bg-paper-texture",
    name: "Textura de papel e impressão",
    category: "background",
    intents: ["papel", "textura de papel", "editorial", "minimalista", "orgânico"],
    fits: ["advocacia", "educação", "marcas autorais", "saúde integrativa"],
    avoidWhen: "Tecnologia/SaaS de alta performance.",
    technique: "Fundo off-white (#f3efe6 a #ece6d9) + feTurbulence com baseFrequency baixo (.6) e cor sépia via feColorMatrix, opacity .25 multiply. Fios e números em tinta escura quente, nunca preto puro.",
    inspiration: "Original.",
    demo: `<style>.pp{min-height:320px;padding:40px;position:relative;background:#efe9dc;color:#2b2620;font:400 15px/1.6 Georgia,serif}
.pp:after{content:"";position:absolute;inset:0;mix-blend-mode:multiply;opacity:.35;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='p'%3E%3CfeTurbulence baseFrequency='.6' numOctaves='4'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .5 0 0 0 0 .42 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E")}
.pp h3{font-size:30px;font-weight:400;margin:0 0 10px;letter-spacing:-.01em}</style>
<div class="pp"><h3>Seriedade sem frieza</h3><p style="max-width:52ch">Textura sutil que dá materialidade a uma página sóbria — adequada a escritórios, educação e marcas autorais.</p></div>`,
  },
  {
    id: "composition-sticky-story",
    name: "Storytelling com coluna fixa",
    category: "composition",
    intents: ["sticky storytelling", "storytelling", "método", "etapas", "jornada", "módulos"],
    fits: ["métodos", "módulos de curso", "processos"],
    avoidWhen: "Menos de 3 etapas.",
    technique: "Duas colunas: esquerda position:sticky com título + indicador da etapa atual (atualizado por IntersectionObserver), direita rola as etapas. No mobile vira lista linear com número grande.",
    inspiration: "Original.",
    demo: `<style>.ss{height:360px;overflow:auto;display:grid;grid-template-columns:1fr 1.3fr;gap:24px;padding:0 30px;background:#0f1412;color:#e6ece8;font:15px system-ui}
.ss .l{position:sticky;top:0;align-self:start;padding:30px 0}.ss .l b{font:300 64px Georgia,serif;color:#9be3b9}.ss .r div{min-height:220px;padding:30px 0;border-bottom:1px solid #fff2}</style>
<div class="ss" onscroll="const i=Math.min(3,Math.floor(this.scrollTop/220)+1);this.querySelector('b').textContent='0'+i"><div class="l"><small>Método em 3 etapas</small><br><b>01</b></div><div class="r"><div>Etapa 1 — diagnóstico</div><div>Etapa 2 — construção</div><div>Etapa 3 — escala</div></div></div>`,
  },
  {
    id: "portrait-halo-glow",
    name: "Retrato com halo luminoso",
    category: "hero",
    intents: ["retrato", "autoridade", "glow", "halo", "especialista", "mentora", "hero com foto"],
    fits: ["advocacia", "especialistas", "cursos premium"],
    avoidWhen: "Não há foto recortada de boa qualidade.",
    technique: "Arco/círculo atrás do retrato: radial-gradient da cor de marca + anel com border e box-shadow de glow; foto PNG recortada sobrepõe a borda inferior do arco. Fundo escuro com vinheta.",
    inspiration: "Referência: advogada (Behance) — reinterpretado.",
    demo: `<style>.ph2{min-height:360px;background:radial-gradient(60% 70% at 70% 40%,#0f3a33,#06110f 70%);display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:30px;font-family:system-ui;color:#e6f5ef}
.ph2 .a{position:relative;height:300px;display:grid;place-items:end center}.ph2 .a:before{content:"";position:absolute;width:240px;height:240px;top:10px;border-radius:50%;border:10px solid #5fd3a6;box-shadow:0 0 60px #5fd3a680,inset 0 0 40px #5fd3a640}
.ph2 .a i{position:relative;width:180px;height:250px;border-radius:90px 90px 0 0;background:linear-gradient(#c9b8a4,#6b5a48)}.ph2 h3{font-size:26px;margin:0}.ph2 h3 b{color:#5fd3a6}</style>
<div class="ph2"><h3>Domine o tema que <b>decide grandes casos</b></h3><div class="a"><i></i></div></div>`,
  },
  {
    id: "ribbon-diagonal-marquee",
    name: "Fita diagonal com nome da marca",
    category: "transition",
    intents: ["fita", "marquee", "faixa diagonal", "transição", "lançamento", "energia"],
    fits: ["cursos expressivos", "lançamentos", "marcas jovens"],
    avoidWhen: "Marcas sóbrias (jurídico, médico).",
    technique: "Duas faixas rotacionadas (±3–5deg) cruzando a junção de seções; texto repetido em animação translateX infinita (pausada em reduced-motion). Uma faixa sólida, outra contorno/transparente.",
    inspiration: "Referências: metodo-karol-digital, pensae, paula-fukuda (Behance) — reinterpretado.",
    demo: `<style>.rb{height:260px;background:#121212;position:relative;overflow:hidden;font:800 18px system-ui;text-transform:uppercase}
.rb div{position:absolute;left:-10%;width:120%;white-space:nowrap;padding:10px 0}.rb .x{top:90px;background:#ff2f7d;color:#fff;transform:rotate(-4deg)}.rb .y{top:110px;color:#ff2f7d;border-block:1px solid #ff2f7d;transform:rotate(3deg)}
.rb span{display:inline-block;animation:mq 14s linear infinite}@keyframes mq{to{transform:translateX(-50%)}}@media(prefers-reduced-motion:reduce){.rb span{animation:none}}</style>
<div class="rb"><div class="y"><span>Método próprio · Método próprio · Método próprio · Método próprio · Método próprio · Método próprio · Método próprio · Método próprio ·</span></div><div class="x"><span>Método próprio ★ Método próprio ★ Método próprio ★ Método próprio ★ Método próprio ★ Método próprio ★ Método próprio ★</span></div></div>`,
  },
  {
    id: "compare-without-with",
    name: "Sem × Com (antes e depois)",
    category: "composition",
    intents: ["comparação", "antes e depois", "sem com", "transformação", "objeções"],
    fits: ["SaaS", "cursos", "serviços com transformação clara"],
    avoidWhen: "Não há diferença concreta e verificável para mostrar.",
    technique: "Duas colunas assimétricas: 'sem' menor, dessaturada, ícones ×; 'com' maior, cor da marca, ícones ✓, levemente elevada e sobreposta. No mobile, 'com' vem depois e ocupa a largura.",
    inspiration: "Referências: saas-ux-ui, giullya-becker, start-magnetico, lo-dias (Behance) — reinterpretado.",
    demo: `<style>.cw{display:grid;grid-template-columns:.9fr 1.1fr;gap:0;padding:36px;background:#f3f0fb;font:14px system-ui;align-items:center}
.cw div{padding:22px}.cw .s{background:#fff;color:#777;border:1px solid #ddd}.cw .c{background:#5b2ee6;color:#fff;margin-left:-14px;box-shadow:0 20px 40px -20px #5b2ee6;transform:translateY(-8px)}
.cw h4{margin:0 0 10px;font-size:18px}.cw li{margin:6px 0;list-style:none}@media(max-width:640px){.cw{grid-template-columns:1fr}.cw .c{margin:0}}</style>
<div class="cw"><div class="s"><h4>Sem o sistema</h4><ul style="padding:0"><li>× Planilhas soltas</li><li>× Faltas sem aviso</li></ul></div><div class="c"><h4>Com o sistema</h4><ul style="padding:0"><li>✓ Agenda que confirma sozinha</li><li>✓ Prontuário em um clique</li></ul></div></div>`,
  },
  {
    id: "guarantee-seal-ring",
    name: "Selo de garantia com texto circular",
    category: "proof",
    intents: ["garantia", "selo", "7 dias", "risco zero"],
    fits: ["qualquer oferta com garantia REAL"],
    avoidWhen: "A fonte não informa garantia — nunca inventar.",
    technique: "SVG com <textPath> em círculo (texto repetido) girando devagar; número grande no centro. Rotação desligada em reduced-motion.",
    inspiration: "Referências: metodo-karol-digital, lo-dias, advogada (Behance) — reinterpretado.",
    demo: `<style>.gs{display:flex;gap:24px;align-items:center;padding:36px;background:#fff;font:14px system-ui}.gs svg{width:150px;animation:sp 20s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.gs svg{animation:none}}</style>
<div class="gs"><div style="position:relative;display:grid;place-items:center"><svg viewBox="0 0 200 200"><defs><path id="cg" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/></defs><text font-size="15" letter-spacing="4" fill="#d11d6b"><textPath href="#cg">GARANTIA · 7 DIAS · GARANTIA · 7 DIAS ·</textPath></text></svg><b style="position:absolute;font-size:46px;color:#d11d6b">7</b></div><p style="max-width:28ch"><b>Teste por 7 dias.</b> Só exibir quando a garantia existe na oferta.</p></div>`,
  },
  {
    id: "taped-photo-collage",
    name: "Foto colada com fita (colagem)",
    category: "composition",
    intents: ["colagem", "polaroid", "fita adesiva", "autoral", "bio", "informal"],
    fits: ["criadores de conteúdo", "marcas pessoais informais"],
    avoidWhen: "Marcas corporativas/jurídicas.",
    technique: "Foto com borda branca, rotação leve (-3..4deg), sombra curta; pedaços de fita = retângulos semitransparentes rotacionados nos cantos (::before/::after).",
    inspiration: "Referência: pensae (Behance) — reinterpretado.",
    demo: `<style>.tp{background:#111;padding:40px;display:flex;gap:30px;align-items:center;color:#eee;font:14px system-ui}.tp figure{margin:0;position:relative;background:#fff;padding:10px 10px 30px;transform:rotate(-3deg);box-shadow:0 10px 20px #0008}
.tp figure i{display:block;width:180px;height:200px;background:linear-gradient(#e7b9d3,#7a4d68)}.tp figure:before,.tp figure:after{content:"";position:absolute;width:70px;height:22px;background:#f08cc4cc}.tp figure:before{top:-8px;left:-18px;transform:rotate(-30deg)}.tp figure:after{bottom:-6px;right:-20px;transform:rotate(-30deg)}</style>
<div class="tp"><figure><i></i></figure><div><b style="font-size:22px;text-decoration:underline">Quem sou eu na fila do pão?</b><p>Bio em tom de conversa.</p></div></div>`,
  },
  {
    id: "giant-word-faq",
    name: "FAQ com palavra gigante",
    category: "faq",
    intents: ["faq", "palavra gigante", "tipografia monumental", "dúvidas"],
    fits: ["marcas expressivas", "lançamentos"],
    avoidWhen: "Páginas minimalistas sóbrias.",
    technique: "Palavra 'FAQ' em condensada pesadíssima (clamp até 180px) com gradiente vertical para o fundo, ancorada à esquerda; acordeão <details> à direita com bordas finas.",
    inspiration: "Referências: giullya-becker, start-magnetico (Behance) — reinterpretado.",
    demo: `<style>.gf{background:#0c0c0a;display:grid;grid-template-columns:auto 1fr;gap:30px;align-items:center;padding:36px;color:#eee;font:13px system-ui}.gf b{font:900 clamp(70px,12vw,160px)/.8 Impact,'Anton',sans-serif;background:linear-gradient(#e8ff4a,#3a3d10);-webkit-background-clip:text;color:transparent}
.gf details{border-bottom:1px solid #333;padding:10px 0;text-transform:uppercase;font-weight:700}@media(max-width:640px){.gf{grid-template-columns:1fr}}</style>
<div class="gf"><b>FAQ</b><div><details open><summary>É ao vivo?</summary><p style="text-transform:none;font-weight:400">Resposta da fonte.</p></details><details><summary>Tem gravação?</summary></details><details><summary>Posso parcelar?</summary></details></div></div>`,
  },
  {
    id: "bento-inverted-modules",
    name: "Bento modular com blocos invertidos",
    category: "cards",
    intents: ["bento", "módulos", "recursos", "fintech", "saas", "grid"],
    fits: ["SaaS", "fintech", "plataformas"],
    avoidWhen: "Menos de 4 itens.",
    technique: "Grid de 6 colunas com spans diferentes; maioria em tom escuro; 1 bloco na cor de marca e 1 claro quebram o ritmo; imagens/UI reais sangram para fora do padding.",
    inspiration: "Referências: goldrex, usi-telecom, saas-ux-ui (Behance) — reinterpretado.",
    demo: `<style>.bi{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:30px;background:#11141b;font:13px system-ui;color:#dfe3ea}.bi div{background:#1b2030;padding:16px;min-height:110px;border-radius:6px}
.bi .a{grid-column:span 4}.bi .b{grid-column:span 2}.bi .g{grid-column:span 2;background:#d9b46a;color:#1b1406}.bi .c{grid-column:span 2}.bi .w{grid-column:span 2;background:#eceef2;color:#11141b}.bi h4{margin:0 0 6px;font-weight:500;font-size:17px}</style>
<div class="bi"><div class="a"><h4>Contas digitais</h4>UI real aqui</div><div class="b"><h4>Cobrança</h4></div><div class="g"><h4>Divisão de recebíveis</h4></div><div class="c"><h4>PIX</h4></div><div class="w"><h4>API</h4></div></div>`,
  },
  {
    id: "horizon-glow-arc",
    name: "Arco de luz no horizonte",
    category: "background",
    intents: ["arco de luz", "glow", "tecnologia", "portfólio", "palco", "destaque"],
    fits: ["tech", "portfólios", "lançamentos digitais"],
    avoidWhen: "Fundos claros.",
    technique: "Elipse grande (border-top com cor de marca) parcialmente visível na base do bloco + radial-gradient borrado acima; título centralizado sobre o arco. Funciona como 'palco' para um card ou CTA.",
    inspiration: "Referências: webdesigner, desafio-forza (Behance) — reinterpretado.",
    demo: `<style>.ha{height:320px;background:#05040b;position:relative;overflow:hidden;display:grid;place-items:center;color:#e9e4ff;font:300 26px system-ui;text-align:center}
.ha:before{content:"";position:absolute;width:140%;height:420px;left:-20%;top:200px;border-radius:50%;border-top:3px solid #b9a2ff;box-shadow:0 -30px 80px #7b55ff,inset 0 30px 60px #7b55ff55}</style>
<div class="ha"><span style="position:relative">O elemento mais importante<br><b style="color:#b9a2ff;font-weight:400">do seu funil</b></span></div>`,
  },
];

/** Simple intent search: scores patterns by token overlap with the query. */
export function searchPatterns(query: string, limit = 8): Pattern[] {
  const q = query.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const toks = q.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  const score = (p: Pattern) => {
    const hay = [p.name, p.category, ...p.intents, ...p.fits].join(" ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return toks.reduce((a, t) => a + (hay.includes(t) ? 1 : 0), 0) + (p.intents.some((i) => q.includes(i.normalize("NFD").replace(/[̀-ͯ]/g, ""))) ? 3 : 0);
  };
  return PATTERNS.map((p) => [p, score(p)] as const).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([p]) => p);
}

export function patternBrief(ps: Pattern[]) {
  return ps.map((p) => `- [${p.id}] ${p.name} (${p.category}) — usar quando: ${p.fits.join(", ")}; evitar quando: ${p.avoidWhen}\n  Técnica: ${p.technique}`).join("\n");
}
