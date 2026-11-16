import path from "node:path";
import fs from "node:fs";

/** Index of the 17 studied references (images live in creative-intelligence/references/<slug>/sheet.jpg — study only). */
export type Ref = { slug: string; niche: string; mood: string; keywords: string[] };

export const REFS: Ref[] = [
  { slug: "metodo-karol-digital", niche: "curso TikTok Shop", mood: "escuro, magenta/ciano, ícones 3D glossy, fitas diagonais", keywords: ["tiktok", "shop", "afiliado", "curso", "digital", "renda", "creator"] },
  { slug: "start-magnetico", niche: "curso de conteúdo + IA", mood: "preto + amarelo-limão, condensada pesada, glow", keywords: ["conteúdo", "ia", "instagram", "curso", "roteiro", "creator", "renda"] },
  { slug: "antonni", niche: "curso de vendas", mood: "preto + verde neon, cards UI flutuantes, palavra gigante", keywords: ["vendas", "curso", "roteiro", "whatsapp", "infoproduto"] },
  { slug: "alan-nicolas", niche: "academia de IA", mood: "preto + laranja incandescente, faíscas, mono técnica", keywords: ["ia", "inteligência", "automação", "negócio", "tecnologia"] },
  { slug: "usi-telecom", niche: "telecom / revenda", mood: "preto + verde-limão neon, chip 3D, feixes diagonais", keywords: ["telecom", "chip", "revenda", "renda", "plano", "internet"] },
  { slug: "lo-dias", niche: "curso CapCut", mood: "preto + gradiente laranja-amarelo, glow no retrato", keywords: ["capcut", "edição", "vídeo", "curso", "creator", "tiktok"] },
  { slug: "desafio-forza", niche: "workshop CapCut", mood: "roxo/ciano, ícones vítreos 3D, piso em grade", keywords: ["workshop", "capcut", "instagram", "evento", "vídeo"] },
  { slug: "giullya-becker", niche: "imersão de conteúdo", mood: "creme + amarelo + preto, condensada caixa alta", keywords: ["conteúdo", "imersão", "evento", "instagram", "creator"] },
  { slug: "pensae", niche: "curso de conteúdo", mood: "rosa + preto, colagem com fita, informal", keywords: ["conteúdo", "curso", "creator", "instagram"] },
  { slug: "paula-fukuda", niche: "captura influencer", mood: "lúdico, amarelo/rosa, doodles", keywords: ["influencer", "conteúdo", "captura", "evento"] },
  { slug: "viviane-martinello", niche: "comunidade feminina cristã", mood: "café + dourado, luz quente, serif", keywords: ["comunidade", "mulheres", "fé", "mentoria", "assinatura"] },
  { slug: "advogada", niche: "curso jurídico", mood: "verde-petróleo + menta, halo no retrato, selo dourado", keywords: ["jurídico", "direito", "advogado", "curso", "premium"] },
  { slug: "clinica-medica", niche: "clínica médica", mood: "navy + dourado, fotografia real", keywords: ["médico", "clínica", "saúde", "consulta"] },
  { slug: "consultor-financeiro", niche: "consultoria patrimonial", mood: "branco + azul royal, corporativo", keywords: ["finanças", "investimento", "consultoria", "patrimônio"] },
  { slug: "goldrex", niche: "fintech B2B", mood: "grafite + dourado, bento, 3D", keywords: ["pagamento", "fintech", "api", "empresa", "gateway"] },
  { slug: "saas-ux-ui", niche: "SaaS", mood: "lavanda/violeta, produto real, Inter", keywords: ["saas", "sistema", "software", "app", "assinatura"] },
  { slug: "webdesigner", niche: "portfólio web", mood: "preto + violeta, ícones 3D, arco de luz", keywords: ["design", "site", "portfólio", "landing", "serviço"] },
];

const REF_DIR = process.env.REFERENCES_DIR || path.join(process.cwd(), "..", "creative-intelligence", "references");

export function refSheet(slug: string) {
  const f = path.join(REF_DIR, slug, "sheet.jpg");
  return fs.existsSync(f) ? f : null;
}

/** Picks the references whose niche best matches the offer. */
export function pickRefs(text: string, n = 3): Ref[] {
  const t = text.toLowerCase();
  return REFS.map((r) => [r, r.keywords.reduce((a, k) => a + (t.includes(k) ? 1 : 0), 0)] as const)
    .sort((a, b) => b[1] - a[1]).slice(0, n).map(([r]) => r).filter((r) => refSheet(r.slug));
}
