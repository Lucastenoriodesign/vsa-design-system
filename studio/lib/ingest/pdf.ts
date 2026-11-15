import { extractText, getDocumentProxy } from "unpdf";
import type { Extraction } from "./types";

export async function ingestPdf(buf: Buffer, fileName: string): Promise<Extraction> {
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = text as string[];
  const limitations: string[] = [];
  const blocks: Extraction["blocks"] = [];
  pages.forEach((t, i) => {
    t.split(/\n{1,}/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length > 1).forEach((s, j) => blocks.push({ tag: "p", text: s, y: i * 10000 + j, section: i }));
  });
  const scanned = pages.filter((p) => p.replace(/\s/g, "").length < 40).length;
  if (scanned) limitations.push(`${scanned} de ${totalPages} página(s) sem texto extraível (provavelmente digitalizadas/imagem). O PDF original é enviado ao modelo como documento para leitura visual.`);
  const all = pages.join("\n");
  const prices = Array.from(new Set(all.match(/(?:\d+\s?x\s?(?:de\s)?)?R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/gi) ?? []));
  const urls = Array.from(new Set(all.match(/https?:\/\/[^\s)]+/g) ?? []));
  return {
    kind: "pdf", title: fileName.replace(/\.pdf$/i, ""), meta: {}, blocks,
    sections: pages.map((p, i) => ({ index: i, heading: p.trim().split("\n")[0]?.slice(0, 80) ?? `Página ${i + 1}`, y: i * 10000, height: 10000 })),
    links: urls.map((href) => ({ href, text: "", kind: /wa\.me|whatsapp/i.test(href) ? "whatsapp" : /hotmart|kiwify|eduzz|checkout|pay\./i.test(href) ? "checkout" : "external" })),
    images: [], videos: [], forms: [], prices, fonts: [], colors: [], screenshots: {}, limitations, pages: totalPages,
  };
}
