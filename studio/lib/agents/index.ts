import { completeJson, complete, extractHtml } from "../llm";
import { fenceUntrusted } from "../security";
import { PageIntelligenceReport, ConversionStrategy, CreativeDirections, DesignSpec, QAReport, type CreativeDirection } from "../schemas";
import type { Extraction } from "../ingest/types";
import { STUDIO_ETHOS, ANTI_GENERIC } from "./prompts";
import { searchPatterns, patternBrief, PATTERNS } from "../library/patterns";

const j = (o: unknown) => JSON.stringify(o, null, 1);

function extractionDigest(x: Extraction) {
  const text = x.blocks.map((b) => `[s${b.section}|${b.tag}] ${b.text}`).join("\n").slice(0, 60000);
  return [
    `Título: ${x.title}`, x.finalUrl ? `URL: ${x.finalUrl}` : "", `Meta: ${j(x.meta)}`,
    `Seções detectadas: ${x.sections.map((s) => `s${s.index}: ${s.heading}`).join(" | ")}`,
    `Preços encontrados (regex): ${x.prices.join(" | ") || "nenhum"}`,
    `Links: ${x.links.filter((l) => l.kind !== "internal").slice(0, 60).map((l) => `${l.kind}: ${l.text} -> ${l.href}`).join("\n")}`,
    `Imagens: ${x.images.slice(0, 40).map((i) => `${i.src} (${i.w}x${i.h}, alt="${i.alt}")`).join("\n")}`,
    `Vídeos: ${x.videos.join(", ") || "nenhum"}`, `Formulários: ${j(x.forms)}`,
    `Fontes da origem: ${x.fonts.join(", ")}`, `Cores da origem: ${x.colors.join(", ")}`,
    `Limitações da captura: ${x.limitations.join(" | ") || "nenhuma"}`,
    `Texto em ordem de leitura:\n${text}`,
  ].join("\n");
}

/** AGENT 1 — Research Intelligence */
export async function researchAgent(x: Extraction, shots: string[], pdfPath?: string, brief?: string) {
  return completeJson(PageIntelligenceReport, {
    label: "research",
    system: `${STUDIO_ETHOS}\nVocê é o agente RESEARCH INTELLIGENCE: analista de negócio e funil. Produz o Page Intelligence Report.`,
    images: shots.map((path) => ({ path, mediaType: "image/jpeg" as const })),
    pdfPath,
    prompt: `Analise a fonte e produza o Page Intelligence Report.
Para cada Fact: status "found" (está literalmente na fonte, cite em evidence), "inferred" (dedução sua — explique) ou "missing".
Em pricing/proofs inclua SOMENTE o que existe na fonte, com evidence literal. Liste em missingInformation o que uma boa página precisaria e não existe.
Campos: brand, segment, product, audience, corePromise, valueProposition (Fact {value,status,confidence 0..1,evidence?}); funnel; primaryCta {label,href|null,status}; secondaryCtas[{label,href|null}]; essentialContent[]; pricing[{label,value,conditions?,evidence}]; objections[]; proofs[{kind,content,evidence}]; media[{src,role}]; sections[{name,purpose,summary}]; opportunities[]; legalConstraints[]; missingInformation[]; emotionalTarget; pricePositioning; sophisticationLevel ("entry"|"mid"|"premium"|"luxury"); nicheConventions; differentiationOpportunity.
${brief ? fenceUntrusted("briefing do usuário", brief) : ""}
${fenceUntrusted("extração da página", extractionDigest(x))}`,
  });
}

/** AGENT 2 — Conversion Strategist */
export async function strategyAgent(report: PageIntelligenceReport) {
  return completeJson(ConversionStrategy, {
    label: "strategy",
    system: `${STUDIO_ETHOS}\nVocê é o CONVERSION STRATEGIST: copywriter de resposta direta sênior. Melhora clareza, ordem argumentativa e CTAs sem alterar fatos.`,
    prompt: `Com base no Page Intelligence Report, defina a nova sequência de seções e a copy.
- sectionPlan: 7 a 12 seções, id em kebab-case, cada uma com goal, content (somente fatos do relatório) e copy {headline, sub, cta} quando fizer sentido.
- Headlines podem ser reescritas; fatos não. Não crie seção de depoimentos se não houver provas reais (use outra forma de credibilidade verificável).
- preserved: lista dos fatos/links que devem aparecer exatamente.
Campos: diagnosis[], sectionPlan[{id,name,goal,content,copy?}], ctaPlan, copyNotes[], preserved[].
Relatório:\n${j(report)}`,
  });
}

/** AGENT 3 — Creative Director: 3 genuinely distinct directions with real previews. */
export async function creativeDirectorAgent(report: PageIntelligenceReport, strategy: ConversionStrategy, avoid: string[] = []) {
  const lib = searchPatterns(`${report.segment.value} ${report.sophisticationLevel} ${report.emotionalTarget} ${report.product.value}`, 10);
  const hero = strategy.sectionPlan[0];
  return completeJson(CreativeDirections, {
    label: "creative-director",
    maxTokens: 48000,
    system: `${STUDIO_ETHOS}\nVocê é o CREATIVE DIRECTOR de uma agência de elite. Pensa como diretor de arte de revista, campanha e produto.\n${ANTI_GENERIC}`,
    prompt: `Proponha EXATAMENTE 3 direções visuais realmente distintas para esta marca (conceito, sensação, composição, tipografia e materiais diferentes — não a mesma página com outra paleta).
Responda internamente antes: quem é a marca, o que vende, para quem, qual emoção, que percepção construir, como o nicho costuma se apresentar (${report.nicheConventions}) e como fugir disso (${report.differentiationOpportunity}).
Use fontes do Google Fonts escolhidas pela personalidade (justifique). Dê scores 0-10 (originality, brandFit, legibility, conversion) com honestidade e escolha recommendedId por critério.
${avoid.length ? `Evite repetir estas direções já usadas: ${avoid.join("; ")}` : ""}
previewHtml: fragmento autocontido (<link> Google Fonts + <style> com classes prefixadas pelo id da direção + markup) mostrando o HERO real desta direção em 1200x720, com a headline "${hero?.copy?.headline ?? report.corePromise.value}" e o CTA "${hero?.copy?.cta ?? report.primaryCta.label}". Sem JS, sem imagens externas (use CSS/SVG para fotografia/objetos: blocos, gradientes, formas, tipografia). Cada preview precisa parecer de um projeto diferente.
Vocabulário técnico disponível na Creative Intelligence Library (ponto de partida, não limite; combine e transforme):
${patternBrief(lib.length ? lib : PATTERNS.slice(0, 8))}
Campos de cada direção: id (kebab), name, concept, feeling, languageReferences[], palette[{name,hex #RRGGBB,role}] (3-7), typography{display,text,accent?,rationale}, photography, materials[], customComponents[], iconSystem, motion, heroComposition, sectionTreatment, differentiators[], risks[], scores{originality,brandFit,legibility,conversion}, previewHtml.
Topo: {directions:[3], recommendedId, rationale}.
Relatório:\n${j(report)}\nEstratégia:\n${j(strategy)}`,
  });
}

/** AGENT 4 — Visual Designer: direction → design system contract. */
export async function visualDesignerAgent(report: PageIntelligenceReport, strategy: ConversionStrategy, d: CreativeDirection) {
  const { previewHtml, ...dir } = d;
  return completeJson(DesignSpec, {
    label: "visual-designer",
    system: `${STUDIO_ETHOS}\nVocê é o VISUAL DESIGNER sênior. Transforma uma direção de arte em sistema visual preciso e específico do projeto.\n${ANTI_GENERIC}`,
    prompt: `Crie a especificação de design (contrato para o frontend e motion) desta direção, específica para este projeto.
tokens: colors (nomes semânticos -> hex), fonts {display,text,accent?,googleFontsUrl (URL css2 completa com os pesos usados)}, typeScale (ex.: display-xl "clamp(...)"), space, radius.
grid, rhythm (alternância de densidades entre seções), components[{name,spec}] (componentes próprios do projeto), sections[{id (mesmos ids da estratégia),layout,visual,motion,mobile}] — cada seção com composição DIFERENTE da anterior, imagery, motionSystem (inclua regras de reduced-motion), accessibility[].
Direção escolhida:\n${j(dir)}\nPreview do hero aprovado (referência visual):\n${previewHtml}\nEstratégia:\n${j(strategy)}\nFatos (relatório):\n${j({ brand: report.brand, product: report.product, pricing: report.pricing, proofs: report.proofs, media: report.media })}`,
  });
}

const BUILD_RULES = `Requisitos de implementação (AGENTES 5 FRONTEND ARCHITECT + 6 MOTION DESIGNER):
- Documento HTML ÚNICO, completo e autocontido: <!doctype html>, <html lang>, <head> com meta viewport, <title>, meta description, Google Fonts via <link>, todo CSS em <style>, todo JS vanilla em <script> no fim do body. Sem frameworks/CDNs de JS.
- Design tokens como CSS custom properties em :root dentro de <style id="tokens"> (cores --c-*, fontes --f-*). O restante do CSS usa as variáveis.
- Cada seção top-level é <section id="{id}" data-section="{id}" data-label="{nome}"> (header/nav e footer também com data-section). Ids = sectionPlan.
- HTML semântico, um único <h1>, hierarquia correta, alt descritivo, foco visível, contraste AA, alvos de toque ≥ 44px.
- Responsivo planejado: mobile-first com breakpoints próprios; nada de overflow horizontal em 360px; títulos com clamp(); reorganize composições no mobile (não só empilhar).
- Imagens: use SOMENTE URLs de mídia listadas no relatório (são da própria marca) ou composições CSS/SVG originais. Nunca imagens de banco, nunca logos inventados. Toda <img> com width/height ou aspect-ratio e object-fit para evitar layout shift.
- Motion: conteúdo visível por padrão; animações só após document.documentElement.classList.add('js'); IntersectionObserver para reveals; respeitar @media (prefers-reduced-motion: reduce); revelar tudo após 2.5s como fallback. Microinterações em hover/focus. Sem bibliotecas.
- Links: CTAs usam os hrefs reais de checkout/WhatsApp do relatório; sem href="#" em CTA de conversão (se não houver link real, use âncora para a seção de oferta).
- Não inclua scripts de rastreamento/pixels da página original.
- Nenhum texto lorem ipsum, nenhum depoimento/número inventado.`;

/** AGENTS 5+6 — Frontend Architect + Motion Designer: full page build. */
export async function buildAgent(report: PageIntelligenceReport, strategy: ConversionStrategy, d: CreativeDirection, spec: DesignSpec) {
  const { previewHtml, ...dir } = d;
  const text = await complete({
    label: "frontend-build",
    maxTokens: 64000,
    system: `${STUDIO_ETHOS}\nVocê é ao mesmo tempo FRONTEND ARCHITECT sênior e MOTION DESIGNER. Constrói o site real, fiel à direção de arte, com acabamento de agência.\n${ANTI_GENERIC}`,
    prompt: `Construa a página COMPLETA. Atenção especial às seções intermediárias: cada uma deve ter composição própria e manter a identidade do hero — páginas de IA costumam ficar genéricas depois da primeira dobra; esta não pode.
${BUILD_RULES}
Responda somente com o documento HTML dentro de um bloco \`\`\`html.
Direção:\n${j(dir)}\nHero aprovado (preview que deve ser respeitado e elevado):\n${previewHtml}\nEspecificação de design:\n${j(spec)}\nEstratégia de seções e copy:\n${j(strategy)}\nFatos verificados:\n${j(report)}`,
  });
  return extractHtml(text);
}

/** AGENT 7 — Visual QA Director: inspects real screenshots + objective checks. */
export async function qaAgent(d: CreativeDirection, spec: DesignSpec, images: string[], checks: string) {
  const { previewHtml, ...dir } = d;
  return completeJson(QAReport, {
    label: "visual-qa",
    images: images.map((path) => ({ path, mediaType: "image/jpeg" as const })),
    system: `${STUDIO_ETHOS}\nVocê é o VISUAL QA DIRECTOR: crítico implacável de uma agência premiada. Tem autorização para reprovar. Avalia somente o que está VISÍVEL nas capturas reais e nos testes objetivos.\n${ANTI_GENERIC}`,
    prompt: `As imagens são capturas reais da página renderizada: primeiro fatias do desktop (1440px, de cima para baixo), depois fatias do mobile (390px).
Avalie de 0 a 100 (seja exigente: 70 = competente porém genérico; 85 = nível agência; 95 = premiado): identity, composition, typography, coherence, imagery, mobile, conversion, finish.
Liste genericSignals (o que parece template/IA) e issues com severity, area, sectionId (id data-section quando identificável), problem, evidence (o que se vê na captura) e fix (instrução concreta de CSS/HTML/composição).
Verifique também: desalinhamentos, espaçamentos irregulares, seções repetitivas, contraste, proporções, excesso de efeitos, diferenças entre a direção e o render, problemas mobile.
verdict: "approved" somente se não houver issue critical/major. summary: 2-3 frases.
Testes objetivos automatizados:\n${checks}\nDireção pretendida:\n${j(dir)}\nSpec (resumo): grid=${spec.grid}; ritmo=${spec.rhythm}`,
  });
}

/** Refinement: whole page or a single section (keeps the rest byte-identical). */
export async function refineAgent(opts: { html: string; instruction: string; sectionHtml?: string; sectionId?: string; context: string }) {
  const scoped = !!opts.sectionHtml;
  const text = await complete({
    label: scoped ? "refine-section" : "refine-page",
    maxTokens: 64000,
    system: `${STUDIO_ETHOS}\nVocê é o time de direção de arte + frontend do estúdio aplicando um pedido de alteração em uma página existente. Mantenha a direção de arte, os fatos e os links, salvo pedido explícito.\n${ANTI_GENERIC}`,
    prompt: scoped
      ? `Pedido para a seção "${opts.sectionId}": ${opts.instruction}
Devolva SOMENTE o novo elemento <section ... data-section="${opts.sectionId}"> (mesmo id/data-section) e, se precisar de CSS/JS novos, um <style data-for="${opts.sectionId}"> e/ou <script data-for="${opts.sectionId}"> logo após a section, tudo dentro de um bloco \`\`\`html. Use as variáveis de :root existentes.
${BUILD_RULES}
Contexto do projeto:\n${opts.context}\nSeção atual:\n${opts.sectionHtml}\nCSS global atual (referência):\n${(opts.html.match(/<style[\s\S]*?<\/style>/gi) ?? []).join("\n").slice(0, 30000)}`
      : `Pedido: ${opts.instruction}
Altere apenas o necessário para atender o pedido e devolva o documento HTML COMPLETO atualizado num bloco \`\`\`html.
${BUILD_RULES}
Contexto do projeto:\n${opts.context}\nDocumento atual:\n${opts.html}`,
  });
  if (scoped) {
    const m = text.match(/```html\s*([\s\S]*?)```/i);
    const frag = (m ? m[1] : text).trim();
    if (!frag.includes(`data-section="${opts.sectionId}"`)) throw new Error("A IA não devolveu a seção pedida");
    return frag;
  }
  return extractHtml(text);
}

/** QA-driven fix pass: applies the ranked issues to the page. */
export async function fixAgent(html: string, qa: QAReport, context: string) {
  const issues = qa.issues.filter((i) => i.severity !== "minor").concat(qa.issues.filter((i) => i.severity === "minor").slice(0, 4));
  return refineAgent({
    html,
    context,
    instruction: `Corrija os problemas encontrados pelo Visual QA nas capturas reais, em ordem de impacto, sem trocar a direção de arte:\n${issues.map((i, n) => `${n + 1}. [${i.severity}] (${i.sectionId ?? i.area}) ${i.problem} — evidência: ${i.evidence} — correção: ${i.fix}`).join("\n")}\nSinais genéricos a eliminar: ${qa.genericSignals.join("; ")}`,
  });
}
