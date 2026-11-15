# Creative Intelligence Library

Base de conhecimento visual e técnica consultada pelos agentes do Page Studio (`studio/`).

## Estado do acervo (17 referências do Behance)

| Referência | Site publicado | Código público inspecionado | Componentes reconstruídos | Estado |
|---|---|---|---|---|
| Paula Fukuda | não verificável | não | 0 | Bloqueada |
| Clínica Médico | não verificável | não | 0 | Bloqueada |
| Advogada | não verificável | não | 0 | Bloqueada |
| Usi Telecom | não verificável | não | 0 | Bloqueada |
| Antonni | não verificável | não | 0 | Bloqueada |
| Consultor Financeiro | não verificável | não | 0 | Bloqueada |
| Método Karol Digital | não verificável | não | 0 | Bloqueada |
| Viviane Martinello | não verificável | não | 0 | Bloqueada |
| Pensae | não verificável | não | 0 | Bloqueada |
| Alan Nicolas | não verificável | não | 0 | Bloqueada |
| Desafio Forza | não verificável | não | 0 | Bloqueada |
| Goldrex | não verificável | não | 0 | Bloqueada |
| Giullya Becker | não verificável | não | 0 | Bloqueada |
| WebDesigner | não verificável | não | 0 | Bloqueada |
| Lô Dias | não verificável | não | 0 | Bloqueada |
| SaaS UX/UI | não verificável | não | 0 | Bloqueada |
| Start Magnético | não verificável | não | 0 | Bloqueada |

**Por quê:** o Behance responde a navegadores automatizados com um desafio anti-bot em JavaScript
(HTTP 403 → HTTP 400 após o reload). O desafio **não foi contornado**. Nenhuma imagem, módulo ou link
externo desses projetos foi visto, então nenhuma análise visual foi registrada para eles. Cada pasta em
`references/` guarda apenas o `source.json` com essa constatação.

**Como destravar:** colocar em `references/<slug>/screenshots/` as imagens exportadas de cada projeto
(ou um PDF), ou informar a URL do site publicado. Com isso, o pipeline de ingestão do estúdio
(captura, extração, Research Intelligence) pode ser apontado para cada material e os
componentes passam a citar a referência em `inspiration`.

## O que existe hoje

- `studio/lib/library/patterns.ts` — 18 técnicas **originais** e funcionais (hero editorial,
  tipografia monumental, metal escovado, vidro, granulação/luz volumétrica, benefícios assimétricos,
  oferta-ingresso, pull-quote, transição por recorte, reveal seguro, texto por máscara, palco 3D em CSS,
  CTA magnético, FAQ com `<details>`, navegação com progresso, rodapé-assinatura, textura de papel,
  storytelling sticky). Cada uma tem técnica, contextos de uso, quando evitar e demo renderizável.
- Galeria interativa em `/library` no app: preview real, desktop/mobile, busca por intenção,
  código editável com preview ao vivo.
- O Creative Director recebe, a cada geração, os padrões mais relevantes para a marca (busca por
  segmento, sofisticação e emoção-alvo) como **vocabulário** — com instrução explícita de combinar
  e transformar, não copiar.
