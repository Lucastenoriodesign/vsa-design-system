# Creative Intelligence Library

Base de conhecimento visual e técnica consultada pelos agentes do Page Studio (`studio/`).

## Estado do acervo (17 referências do Behance)

Imagens coletadas pelo navegador do usuário (Claude in Chrome) e analisadas visualmente. Nenhum site do produto publicado foi encontrado, então **não houve extração de código**: tudo é reconstrução visual original. Material em `screenshots/` é apenas para estudo — não redistribuir.

| Referência | Site publicado | Código público inspecionado | Resultado | Estado |
|---|---|---|---|---|
| Advogada — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: halo luminoso atrás do retrato, preço com centavos sobrescritos, selo-moeda de garantia | Analisada |
| Alan Nicolas — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: tipografia mono técnica, glow incandescente, bio como post social | Analisada |
| Antonni — Landing Page | nenhum encontrado | não (só imagens) | 6 imagens analisadas; padrões: palavra gigante atrás do conteúdo, objeções em cards, oferta com timer | Analisada |
| Clínica & Médico — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: título com segunda linha em acento, faz/não faz, recorte em degrau entre seções | Analisada |
| Consultor Financeiro — Página de Vendas | nenhum encontrado | não (só imagens) | 2 imagens analisadas; padrões: processo com escurecimento progressivo, hero split cor/foto, FAQ duas colunas | Analisada |
| Desafio Forza — Página de Vendas (Projeto Fictício) | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: piso em grade de perspectiva, ícones vítreos 3D, faixa gradiente secundária | Analisada |
| Giullya Becker — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: palavra FAQ gigante, antes vs depois em colunas, barra de lote/vagas | Analisada |
| Goldrex — Página de Vendas (Finanças/Gateway) | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: bento modular com blocos invertidos, tags em cards, CTA duplo pill | Analisada |
| Lo Dias — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: faixa gradiente com cards pretos, métricas flutuantes no retrato, tradicional vs curso | Analisada |
| MKD Método Karol Digital — Landing Page | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: fitas diagonais cruzadas, selo circular com texto, marquee | Analisada |
| Paula Fukuda — Landing Page | nenhum encontrado | não (só imagens) | 5 imagens analisadas; padrões: fita diagonal repetida, foto recortada com moldura de app social, cards de etapa coloridos | Analisada |
| Pensae — Landing Page | nenhum encontrado | não (só imagens) | 15 imagens analisadas; padrões: foto colada com fita, linhas alternadas de bônus, preço riscado | Analisada |
| SaaS UX/UI Design — Landing Page | nenhum encontrado | não (só imagens) | 12 imagens analisadas; padrões: produto real como hero, sem vs com, toggle mensal/anual | Analisada |
| Start Magnético — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: demo de IA em chat, CTA duplo comprar/falar, glow amarelo atrás da oferta | Analisada |
| Usi Telecom — Página de Vendas | nenhum encontrado | não (só imagens) | 2 imagens analisadas; padrões: listras de luz diagonais, bento de benefícios, plano destacado elevado | Analisada |
| Viviane Martinello — Página de Vendas | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: plano recomendado em dourado sólido, capas de módulo pôster, mosaico de prova | Analisada |
| WebDesigner — Landing Page/Website | nenhum encontrado | não (só imagens) | 1 imagens analisadas; padrões: arco de luz horizonte, comparação nós vs outros, ícones 3D vítreos | Analisada |

## O que existe hoje

- `studio/lib/library/patterns.ts` — 26 técnicas **originais** (8 inspiradas diretamente nas referências, com `inspiration` citando a fonte) e funcionais (hero editorial,
  tipografia monumental, metal escovado, vidro, granulação/luz volumétrica, benefícios assimétricos,
  oferta-ingresso, pull-quote, transição por recorte, reveal seguro, texto por máscara, palco 3D em CSS,
  CTA magnético, FAQ com `<details>`, navegação com progresso, rodapé-assinatura, textura de papel,
  storytelling sticky). Cada uma tem técnica, contextos de uso, quando evitar e demo renderizável.
- Galeria interativa em `/library` no app: preview real, desktop/mobile, busca por intenção,
  código editável com preview ao vivo.
- O Creative Director recebe, a cada geração, os padrões mais relevantes para a marca (busca por
  segmento, sofisticação e emoção-alvo) como **vocabulário** — com instrução explícita de combinar
  e transformar, não copiar.
