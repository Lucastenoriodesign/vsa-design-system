import fs from "node:fs";
import { getProject, updateProject, projectPath, writeVersion, readVersion, versionFile, type Project } from "./store";
import { ingestUrl } from "./ingest/url";
import { ingestPdf } from "./ingest/pdf";
import { researchAgent, strategyAgent, creativeDirectorAgent, visualDesignerAgent, buildAgent, qaAgent, fixAgent, refineAgent } from "./agents";
import { renderAndCheck, checksSummary } from "./render";
import { drainUsage } from "./llm";
import { weightedScore } from "./schemas";
import { getSectionHtml, replaceSection } from "./html-ops";
import type { Extraction } from "./ingest/types";
import { pickRefs, refSheet } from "./library/references";

function visualRefs(p: Project) {
  const refs = pickRefs(`${p.report?.segment.value} ${p.report?.product.value} ${p.report?.nicheConventions}`, 3);
  return { images: refs.map((r) => refSheet(r.slug)!), brief: refs.map((r) => `${r.slug} (${r.niche}: ${r.mood})`).join("; ") };
}
function brandHint(p: Project) {
  const x = p.extraction;
  if (!x || x.kind !== "url") return undefined;
  const logo = x.images.find((i) => /logo/i.test(i.src + i.alt));
  return `cores dominantes da página atual: ${x.colors.slice(0, 6).join(", ")}; fontes: ${x.fonts.slice(0, 3).join(", ")}${logo ? `; logo: ${logo.src}` : ""}; fotos reais disponíveis: ${x.images.filter((i) => i.w > 300).slice(0, 12).map((i) => i.src).join(" , ")}`;
}

const running = new Set<string>();

async function step<T>(id: string, key: string, label: string, fn: () => Promise<T>): Promise<T> {
  updateProject(id, (p) => {
    const s = p.steps.find((x) => x.key === key);
    const v = { key, label, status: "running" as const, startedAt: new Date().toISOString() };
    if (s) Object.assign(s, v, { endedAt: undefined, detail: undefined });
    else p.steps.push(v);
  });
  try {
    const r = await fn();
    updateProject(id, (p) => {
      const s = p.steps.find((x) => x.key === key)!;
      s.status = "done";
      s.endedAt = new Date().toISOString();
      p.usage.push(...drainUsage());
    });
    return r;
  } catch (e) {
    updateProject(id, (p) => {
      const s = p.steps.find((x) => x.key === key)!;
      s.status = "error";
      s.endedAt = new Date().toISOString();
      s.detail = (e as Error).message;
      p.usage.push(...drainUsage());
    });
    throw e;
  }
}

/** Fire-and-forget job runner with per-project lock; errors land on the project. */
export function runJob(id: string, status: Project["status"], fn: () => Promise<void>) {
  if (running.has(id)) throw new Error("Já existe uma etapa em execução neste projeto");
  running.add(id);
  updateProject(id, (p) => { p.status = status; p.error = undefined; });
  fn().catch((e) => updateProject(id, (p) => { p.status = "error"; p.error = (e as Error).message; }))
    .finally(() => running.delete(id));
}
export const isRunning = (id: string) => running.has(id);

export async function analyze(id: string) {
  const p = getProject(id)!;
  const shotsDir = projectPath(id, "shots");
  let x: Extraction;
  let pdfPath: string | undefined;
  if (p.source.kind === "url") {
    x = await step(id, "extract", "Captura e extração (navegador)", () => ingestUrl(p.source.url!, shotsDir));
  } else if (p.source.kind === "pdf") {
    pdfPath = projectPath(id, "source.pdf");
    x = await step(id, "extract", "Leitura do PDF", () => ingestPdf(fs.readFileSync(pdfPath!), p.source.fileName ?? "source.pdf"));
  } else {
    x = { kind: "brief", title: p.name, meta: {}, blocks: [{ tag: "p", text: p.source.brief ?? "", y: 0, section: 0 }], sections: [], links: [], images: [], videos: [], forms: [], prices: [], fonts: [], colors: [], screenshots: {}, limitations: ["Projeto iniciado do zero a partir de briefing."] };
  }
  updateProject(id, (pp) => { pp.extraction = x; if (x.title && pp.source.kind !== "brief") pp.name = x.title.slice(0, 80); });
  const shots = [x.screenshots.desktop, x.screenshots.mobile].filter(Boolean).map((f) => `${shotsDir}/${f}`);
  const report = await step(id, "research", "Research Intelligence — Page Intelligence Report", () => researchAgent(x, shots, pdfPath, p.source.brief));
  updateProject(id, (pp) => { pp.report = report; });
  const strategy = await step(id, "strategy", "Conversion Strategist — sequência e copy", () => strategyAgent(report));
  updateProject(id, (pp) => { pp.strategy = strategy; pp.status = "analyzed"; });
}

export async function direct(id: string) {
  const p = getProject(id)!;
  const prev = p.directions?.directions.map((d) => d.name) ?? [];
  const dirs = await step(id, "direction", "Creative Director — 3 direções", () => creativeDirectorAgent(p.report!, p.strategy!, prev, visualRefs(p), brandHint(p), p.extraction?.screenshots.desktop ? projectPath(id, "shots", p.extraction.screenshots.desktop) : undefined));
  updateProject(id, (pp) => { pp.directions = dirs; pp.selectedDirectionId = dirs.recommendedId; pp.status = "directed"; });
}

const maxIter = () => Math.max(0, Number(process.env.QA_MAX_ITERATIONS ?? 2));
const target = () => Number(process.env.QA_TARGET_SCORE ?? 80);

async function qaVersion(id: string, n: number, label: string) {
  const p = getProject(id)!;
  const d = p.directions!.directions.find((x) => x.id === p.selectedDirectionId)!;
  const { checks, shots, qaImages } = await step(id, `render-v${n}`, `Render real v${n} (6 larguras)`, () => renderAndCheck(versionFile(id, n), projectPath(id, "shots"), `v${n}`));
  const report = await step(id, `qa-v${n}`, `${label} — inspeção visual v${n}`, () => qaAgent(d, p.spec!, qaImages, checksSummary(checks)));
  // Objective failures cap the subjective score: a broken page cannot pass on looks.
  let score = weightedScore(report.scores);
  if (checks.widths.some((w) => w.overflowX)) score = Math.min(score, 60);
  if (!checks.reducedMotionOk || checks.invisibleTextBlocks > 0) score = Math.min(score, 65);
  if (checks.brokenImages.length) score = Math.min(score, 70);
  updateProject(id, (pp) => { const v = pp.versions.find((x) => x.n === n)!; v.qa = { score, report, checks, shots }; });
  return { score, report };
}

export async function build(id: string, directionId?: string) {
  if (directionId) updateProject(id, (p) => { p.selectedDirectionId = directionId; });
  const p = getProject(id)!;
  const d = p.directions!.directions.find((x) => x.id === p.selectedDirectionId);
  if (!d) throw new Error("Direção não encontrada");
  const spec = await step(id, "spec", "Visual Designer — design system do projeto", () => visualDesignerAgent(p.report!, p.strategy!, d));
  updateProject(id, (pp) => { pp.spec = spec; });
  const html = await step(id, "build", "Frontend Architect + Motion — construção", () => buildAgent(p.report!, p.strategy!, d, spec, visualRefs(p), brandHint(p)));
  let n = writeVersion(id, html, `Primeira construção — direção "${d.name}"`);
  let { score, report } = await qaVersion(id, n, "Visual QA Director");
  const context = projectContext(getProject(id)!);
  for (let i = 0; i < maxIter() && (score < target() || report.verdict !== "approved"); i++) {
    const fixed = await step(id, `fix-${i + 1}`, `Refinamento automático ${i + 1}`, () => fixAgent(readVersion(id, n), report, context));
    const m = writeVersion(id, fixed, `Refinamento automático ${i + 1} (QA: ${score}/100)`);
    const r = await qaVersion(id, m, "Visual QA Director");
    // keep the best version as current
    if (r.score >= score) { n = m; score = r.score; report = r.report; }
    else updateProject(id, (pp) => { pp.currentVersion = n; });
  }
  updateProject(id, (pp) => {
    pp.status = "ready";
    pp.chat.push({ role: "studio", at: new Date().toISOString(), version: n, text: `Versão v${n} pronta. Creative Quality Gate: ${score}/100 (${report.verdict}). ${report.summary}` });
  });
}

export function projectContext(p: Project) {
  const d = p.directions?.directions.find((x) => x.id === p.selectedDirectionId);
  const { previewHtml, ...dir } = d ?? ({} as Record<string, unknown>);
  return JSON.stringify({ marca: p.report?.brand.value, produto: p.report?.product.value, direcao: dir, preservar: p.strategy?.preserved, fatos: { pricing: p.report?.pricing, proofs: p.report?.proofs, cta: p.report?.primaryCta } });
}

export async function refine(id: string, instruction: string, sectionId?: string, runQa = true) {
  const p = getProject(id)!;
  const base = p.currentVersion!;
  const html = readVersion(id, base);
  const ctx = projectContext(p);
  updateProject(id, (pp) => { pp.chat.push({ role: "user", text: sectionId ? `[${sectionId}] ${instruction}` : instruction, at: new Date().toISOString() }); });
  const out = await step(id, `refine-${Date.now()}`, sectionId ? `Redesign da seção ${sectionId}` : "Alteração na página", async () => {
    if (sectionId) return replaceSection(html, sectionId, await refineAgent({ html, instruction, sectionId, sectionHtml: getSectionHtml(html, sectionId), context: ctx }));
    return refineAgent({ html, instruction, context: ctx });
  });
  const n = writeVersion(id, out, sectionId ? `Seção ${sectionId}: ${instruction}` : instruction, instruction);
  let note = "";
  if (runQa && p.spec) {
    const { score, report } = await qaVersion(id, n, "Visual QA");
    note = ` QA: ${score}/100 — ${report.summary}`;
  }
  updateProject(id, (pp) => { pp.status = "ready"; pp.chat.push({ role: "studio", at: new Date().toISOString(), version: n, text: `Aplicado em v${n} (a partir de v${base}).${note}` }); });
}
