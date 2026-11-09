# Mesaí v2

Estrutura:
- `index.html` — marcação das telas
- `css/tokens.css` — todas as cores, raios, sombras e espaços (só tema branco)
- `css/app.css` — estilos que usam os tokens
- `js/data.js` — cadastro dos 23 estabelecimentos
- `js/app.js` — lógica do app
- `sw.js` — service worker (abre o app sem internet depois da primeira visita)
- `tools/build-standalone.py` — gera um HTML único com tudo embutido
- `tests/smoke.js`, `tests/offline.js` — testes (Playwright)

Rodar: `python3 -m http.server 8124` nesta pasta e abrir http://localhost:8124.
Testes: `BASE=http://localhost:8124 NODE_PATH=$(npm root -g) node tests/smoke.js` (e `offline.js`).
Arquivo único: `python3 tools/build-standalone.py dist/mesai.html`.
