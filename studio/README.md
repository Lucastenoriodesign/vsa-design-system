# AI Creative Page Studio

Estúdio que lê uma página existente (URL ou PDF) ou um briefing, entende a oferta, propõe três
direções de arte, constrói a página, **renderiza no navegador, inspeciona as capturas e se corrige**.

## Rodar

```bash
cd studio
npm install
cp .env.example .env.local   # configure o provedor
npm run build && npm start   # http://localhost:3100
```

Requer o Chromium do Playwright (`npx playwright install chromium` fora deste ambiente).

### Provedor de modelo

| `LLM_PROVIDER` | Uso | Requisito |
|---|---|---|
| `anthropic` | produção | `ANTHROPIC_API_KEY` (SDK oficial, streaming, thinking adaptativo, imagens/PDF em base64) |
| `claude-cli` | desenvolvimento local | Claude Code CLI autenticado (`claude -p`); imagens lidas pela ferramenta Read |

`LLM_MODEL` (padrão `claude-opus-5-5`), `LLM_EFFORT` (padrão `high`), `QA_MAX_ITERATIONS` (padrão 2),
`QA_TARGET_SCORE` (padrão 80) controlam qualidade e custo.

## Pipeline

```
Source Input → Content Extraction → Business Intelligence → Conversion Strategy → Creative Concepts
→ Design Specification → Code Generation → Browser Render → Visual QA → Refinement → Export
```

| Etapa | Arquivo | Saída (validada por zod) |
|---|---|---|
| Extração URL (Playwright, scroll controlado, acordeões abertos, capturas desktop/mobile) | `lib/ingest/url.ts` | `Extraction` |
| Extração PDF (texto por página; PDF digitalizado vai ao modelo como documento) | `lib/ingest/pdf.ts` | `Extraction` |
| 1 Research Intelligence | `lib/agents/index.ts` | `PageIntelligenceReport` (cada fato: found / inferred / missing + evidência) |
| 2 Conversion Strategist | idem | `ConversionStrategy` |
| 3 Creative Director (3 direções + preview HTML real do hero) | idem | `CreativeDirections` |
| 4 Visual Designer | idem | `DesignSpec` (contrato para o frontend) |
| 5+6 Frontend Architect + Motion Designer | idem | documento HTML único, seções `data-section`, tokens em `<style id="tokens">` |
| Render + testes objetivos (360/390/768/1024/1440/1920) | `lib/render.ts` | overflow, console, imagens quebradas, texto invisível, reduced-motion, CLS, links |
| 7 Visual QA Director (vê as capturas reais) | `lib/agents/index.ts` | `QAReport` com notas ponderadas e problemas por seção |
| Creative Quality Gate | `lib/pipeline.ts` | nota ponderada; falhas objetivas limitam a nota; loop de correção até a meta ou o limite |

O preview no editor é o **mesmo arquivo** exportado (`data/projects/<id>/versions/vN.html`), servido em
iframe com `sandbox` + CSP `sandbox allow-scripts`.

## Editor

- Prévia desktop/tablet/mobile, zoom, navegação por seção, comparação antes/depois com as capturas.
- Clique numa seção da prévia → alvo do assistente; redesign/variação por IA só daquela seção
  (o resto do documento fica intacto).
- Operações determinísticas: subir/descer, ocultar, remover, trocar texto, editar tokens (cores/fontes).
- Toda alteração gera nova versão; qualquer versão pode ser restaurada.
- Exportação: ZIP estático e ZIP Next.js mínimo. **WordPress/Elementor e link publicado: não implementados.**

## Segurança

- URLs validadas; bloqueio de IPs privados/localhost/metadata (SSRF), inclusive em sub-requisições do navegador.
- PDF: tipo, assinatura e tamanho (20 MB) validados.
- Conteúdo de origem envolvido em `<untrusted_source>` e tratado como dado.
- Código gerado roda isolado (iframe sandbox sem same-origin).
- Scripts de rastreamento da origem não são copiados (regra do gerador).

## Limitações conhecidas

- Persistência em arquivo (`data/`); a interface `store.ts` foi desenhada para trocar por Supabase,
  mas a integração **não foi feita**. Não há autenticação/controle de acesso por usuário.
- Jobs rodam no processo do servidor (bom para local/servidor próprio; na Vercel exigiria fila/worker).
- Sem serviço de geração de imagens configurado: a página usa mídias da própria origem ou composições CSS/SVG.
- Tailwind não foi usado: a interface usa CSS próprio com tokens (menos dependências).
