# QA e Testes: bateria reutilizável (22/11/2026)

Rodar tudo: `v2/tests/rodar-tudo.sh` (sobe `http.server 8127` em `v2/`, usa Chrome via playwright-core, imprime OK/FALHA). Supabase é interceptado (abortado), então roda sempre com os dados locais (38 lugares).

## Resultado real da última execução: 5 de 6 arquivos OK, 215 verificações OK, 2 FALHAS
| Arquivo | Resultado |
|---|---|
| smoke.js | OK |
| alertas-lugar-novo.js | OK |
| fora-da-tela.js | **FALHA** (2) |
| filtros.js | OK |
| barra-inferior.js | OK |
| offline-rota.js | OK |

## Falha real encontrada (app, não corrigida: não é meu setor)
- Início em 320 px e 360 px: o botão "Surpreenda-me" (`.hero-act .btn.ghost`, ao lado de "Ver detalhes") vai de x=196 até x=371, passando da borda da tela. Em 390 e 430 está OK. Dono: `dev-app` / `ui-design`.

## O que cada arquivo cobre
- fora-da-tela.js: rotas #/inicio #/buscar #/comunidade #/em-alta #/perfil, filtros inline da Buscar e folha de filtros (`#infoOverlay`, incluindo o botão "Ver N lugares" visível), em 320/360/390/430; rolagem horizontal da página; ignora carrosséis com rolagem própria e texto só para leitor de tela.
- filtros.js: cada chip de cozinha (9), dia (7) e "Aberto agora": o botão "Ver N lugares" bate com o cálculo direto dos dados, o número no chip bate com o resultado, a lista da Buscar tem N itens e "Limpar tudo" volta ao total; combinar filtros só reduz. Chips sem dado ficam como PULOU.
- barra-inferior.js: 5 botões, ordem, dentro da largura, alvo de toque, rota certa, só um ativo, e posições do dock, botões, ícones e rótulos idênticas após tocar em cada um, nas 4 larguras.
- offline-rota.js: service worker + cache, reabre offline, as 5 rotas renderizam e a Buscar lista lugares.
- smoke.js: ajustado só o teste. As "2 falhas antigas" (check-in de 10 pontos e moderação manual) já passavam com o app atual; as falhas reais eram contagens fixas (24/20/5) que não valem mais com 38 lugares. Agora as contagens vêm de `pubPlaces()`. Também aceita `PW` e `CHANNEL`.

## Observações
- Offline com rota do Playwright ativa faz o reload offline falhar (artefato do teste: o `offline-rota.js` remove as rotas antes de cortar a rede). Sem a rota, o app abre offline normalmente.
- Erros de JavaScript (`pageerror`): nenhum em nenhum teste.

## Não testado
- Dados reais do Supabase, login, check-in logado, `servidor-simulado.js` (não está no runner), app nativo Capacitor, iOS/Safari (só Chrome), orientação paisagem, telas de detalhe/Planos/boas-vindas na varredura de elementos, teclado virtual, acessibilidade, desempenho, e "Aberto agora" depende do horário em que o teste roda.
