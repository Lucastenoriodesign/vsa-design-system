import { z } from "zod";

/** Every commercial fact carries provenance so missing data never becomes invented data. */
export const Fact = z.object({
  value: z.string(),
  status: z.enum(["found", "inferred", "missing"]),
  confidence: z.number().min(0).max(1),
  evidence: z.string().optional().describe("Quote or location in the source"),
});
export type Fact = z.infer<typeof Fact>;

export const PageIntelligenceReport = z.object({
  brand: Fact,
  segment: Fact,
  product: Fact,
  audience: Fact,
  corePromise: Fact,
  valueProposition: Fact,
  funnel: z.string(),
  primaryCta: z.object({ label: z.string(), href: z.string().nullable(), status: z.enum(["found", "inferred", "missing"]) }),
  secondaryCtas: z.array(z.object({ label: z.string(), href: z.string().nullable() })),
  essentialContent: z.array(z.string()),
  pricing: z.array(z.object({ label: z.string(), value: z.string(), conditions: z.string().optional(), evidence: z.string() })),
  objections: z.array(z.string()),
  proofs: z.array(z.object({ kind: z.string(), content: z.string(), evidence: z.string() })).describe("Only proofs that literally exist in the source"),
  media: z.array(z.object({ src: z.string(), role: z.string() })),
  sections: z.array(z.object({ name: z.string(), purpose: z.string(), summary: z.string() })),
  opportunities: z.array(z.string()),
  legalConstraints: z.array(z.string()),
  missingInformation: z.array(z.string()),
  emotionalTarget: z.string(),
  pricePositioning: z.string(),
  sophisticationLevel: z.enum(["entry", "mid", "premium", "luxury"]),
  nicheConventions: z.string(),
  differentiationOpportunity: z.string(),
});
export type PageIntelligenceReport = z.infer<typeof PageIntelligenceReport>;

export const ConversionStrategy = z.object({
  diagnosis: z.array(z.string()),
  sectionPlan: z.array(z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    goal: z.string(),
    content: z.string().describe("What goes here, using only verified facts"),
    copy: z.object({ headline: z.string().optional(), sub: z.string().optional(), cta: z.string().optional() }).optional(),
  })).min(4),
  ctaPlan: z.string(),
  copyNotes: z.array(z.string()),
  preserved: z.array(z.string()).describe("Facts/links that must survive verbatim"),
});
export type ConversionStrategy = z.infer<typeof ConversionStrategy>;

export const CreativeDirection = z.object({
  id: z.string(),
  name: z.string(),
  concept: z.string(),
  feeling: z.string(),
  languageReferences: z.array(z.string()),
  palette: z.array(z.object({ name: z.string(), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/), role: z.string() })).min(3).max(7),
  typography: z.object({ display: z.string(), text: z.string(), accent: z.string().optional(), rationale: z.string() }),
  photography: z.string(),
  materials: z.array(z.string()),
  customComponents: z.array(z.string()),
  iconSystem: z.string(),
  motion: z.string(),
  heroComposition: z.string(),
  sectionTreatment: z.string(),
  differentiators: z.array(z.string()),
  risks: z.array(z.string()),
  scores: z.object({ originality: z.number(), brandFit: z.number(), legibility: z.number(), conversion: z.number() }),
  previewHtml: z.string().describe("Self-contained HTML fragment (<style> + markup) of this direction's hero at 1200x720"),
});
export type CreativeDirection = z.infer<typeof CreativeDirection>;

export const CreativeDirections = z.object({
  directions: z.array(CreativeDirection).length(3),
  recommendedId: z.string(),
  rationale: z.string(),
});
export type CreativeDirections = z.infer<typeof CreativeDirections>;

export const DesignSpec = z.object({
  tokens: z.object({
    colors: z.record(z.string(), z.string()),
    fonts: z.object({ display: z.string(), text: z.string(), accent: z.string().optional(), googleFontsUrl: z.string() }),
    typeScale: z.record(z.string(), z.string()),
    space: z.record(z.string(), z.string()),
    radius: z.record(z.string(), z.string()),
  }),
  grid: z.string(),
  rhythm: z.string(),
  components: z.array(z.object({ name: z.string(), spec: z.string() })),
  sections: z.array(z.object({ id: z.string(), layout: z.string(), visual: z.string(), motion: z.string(), mobile: z.string() })),
  imagery: z.string(),
  motionSystem: z.string(),
  accessibility: z.array(z.string()),
});
export type DesignSpec = z.infer<typeof DesignSpec>;

export const QAIssue = z.object({
  severity: z.enum(["critical", "major", "minor"]),
  area: z.string(),
  sectionId: z.string().nullable(),
  problem: z.string(),
  evidence: z.string().describe("What is visible in the screenshot"),
  fix: z.string(),
});
export const QAReport = z.object({
  scores: z.object({
    identity: z.number().min(0).max(100),
    composition: z.number().min(0).max(100),
    typography: z.number().min(0).max(100),
    coherence: z.number().min(0).max(100),
    imagery: z.number().min(0).max(100),
    mobile: z.number().min(0).max(100),
    conversion: z.number().min(0).max(100),
    finish: z.number().min(0).max(100),
  }),
  genericSignals: z.array(z.string()),
  issues: z.array(QAIssue),
  verdict: z.enum(["approved", "needs-refinement", "rejected"]),
  summary: z.string(),
});
export type QAReport = z.infer<typeof QAReport>;

export const QA_WEIGHTS: Record<keyof QAReport["scores"], number> = {
  identity: 0.2, composition: 0.2, typography: 0.15, coherence: 0.1, imagery: 0.1, mobile: 0.1, conversion: 0.1, finish: 0.05,
};
export function weightedScore(s: QAReport["scores"]) {
  return Math.round(Object.entries(QA_WEIGHTS).reduce((a, [k, w]) => a + s[k as keyof typeof s] * w, 0));
}
