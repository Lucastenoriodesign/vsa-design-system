# Agência Mesaí

Cada setor do app tem um agente (subagente do Claude Code) em `.claude/agents/`. A sessão principal do Claude Code é a **coordenação**: recebe o pedido do Lucas, escolhe o setor, junta os resultados e pede confirmação nas decisões dele.

| Setor | Agente | Cuida de |
|---|---|---|
| Dados e curadoria | `dados-lugares` | novos lugares, horários, telefones, coordenadas, planilhas, `data.js` |
| Fotos | `fotos-ambiente` | capas de ambiente, recorte 4:3, créditos |
| Desenvolvimento | `dev-app` | código do app `v2/`, versões, publicação |
| QA e testes | `qa-testes` | Playwright, vazamento de tela, smoke, relatório honesto |
| Design e marca | `design-marca` | telas, cores, tipografia, acessibilidade |
| Backend | `backend-supabase` | tabelas, RLS, migrações, sincronização |
| Comunidade | `comunidade-moderacao` | posts reais, diretrizes, filtro de palavras |
| Marketing | `marketing-conteudo` | Instagram, WhatsApp, prévia do link, textos de loja |
| Legal e financeiro | `legal-financeiro` | termos, LGPD, Mesaí+, regras Apple/Google |
| App nativo e lojas | `lojas-nativo` | Capacitor, APK, iOS, push, publicação |

## Como usar
- Peça normalmente ("complete as fotos do Pátio", "revise os termos") e a coordenação chama o agente certo; ou diga o nome: "use o dados-lugares para...".
- Tarefa que cruza setores segue uma ordem: **dados → fotos → dev → qa → publicar**. Ninguém publica sem o `qa-testes` reportar.
- Regras de todos: nunca inventar dados, confirmar com o Lucas antes de conta/cobrança/apagar/lojas/identidade visual, sem commit/push sem pedido.

## Contratar um agente novo
Crie `.claude/agents/<nome>.md` com `name`, `description` (quando usar) e `tools` (só o necessário), mais o corpo com função, pastas e regras. Candidatos futuros: `suporte-usuarios` (dúvidas e denúncias), `parcerias-restaurantes` (contato com donos), `analytics` (métricas de uso).
