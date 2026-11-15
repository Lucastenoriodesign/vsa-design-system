import { chromium } from "playwright";
import { assertPublicUrl, isPrivateIp } from "../security";
import net from "node:net";
import type { Extraction } from "./types";

const CHECKOUT = /(hotmart|kiwify|eduzz|monetizze|pay\.|checkout|perfectpay|ticto|stripe|pagar\.me|mercadopago|greenn|braip|lastlink|doppus|guru)/i;

export async function ingestUrl(raw: string, shotsDir: string): Promise<Extraction> {
  const url = await assertPublicUrl(raw);
  const limitations: string[] = [];
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR", javaScriptEnabled: true, acceptDownloads: false });
    // Block literal private-IP subrequests and non-page schemes from inside the page.
    await ctx.route("**/*", (route) => {
      const u = new URL(route.request().url());
      if (!/^https?:$|^data:$|^blob:$/.test(u.protocol)) return route.abort();
      if (net.isIP(u.hostname.replace(/^\[|\]$/g, "")) && isPrivateIp(u.hostname.replace(/^\[|\]$/g, ""))) return route.abort();
      return route.continue();
    });
    const page = await ctx.newPage();
    const resp = await page.goto(url.toString(), { waitUntil: "domcontentloaded", timeout: 45000 });
    const status = resp?.status() ?? 0;
    if (status >= 400) throw new Error(`A página respondeu HTTP ${status}. Ela pode exigir login ou bloquear acesso automatizado — envie um PDF ou capturas de tela.`);
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => limitations.push("A rede não ficou ociosa em 15s; conteúdo tardio pode faltar."));
    // Controlled scroll to trigger lazy content.
    await page.evaluate(async () => {
      const step = innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight && y < 40000; y += step) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 180));
      }
      scrollTo(0, 0);
    });
    // Open collapsed content (FAQ accordions) so answers are extracted too.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => ((d as HTMLDetailsElement).open = true)));
    for (const t of (await page.$$("[aria-expanded=false]")).slice(0, 40)) await t.click({ timeout: 800 }).catch(() => {});
    await page.waitForTimeout(1200);
    const data = await page.evaluate(() => {
      const vis = (el: Element) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0.05 && r.width > 2 && r.height > 2;
      };
      const sy = scrollY;
      const blocks: { tag: string; text: string; y: number; section: number }[] = [];
      const seen = new Set<string>();
      const sel = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,button,a,summary,dt,dd,td,th,label,span,strong";
      document.querySelectorAll(sel).forEach((el) => {
        if (!vis(el)) return;
        // keep leaf-ish text: skip containers whose text is fully covered by a matched child
        if (["SPAN", "STRONG", "A"].includes(el.tagName) && el.closest("h1,h2,h3,h4,h5,h6,p,li,button,blockquote")) return;
        const t = (el as HTMLElement).innerText?.replace(/\s+/g, " ").trim();
        if (!t || t.length < 2 || t.length > 1200 || seen.has(t)) return;
        seen.add(t);
        blocks.push({ tag: el.tagName.toLowerCase(), text: t, y: Math.round(el.getBoundingClientRect().top + sy), section: 0 });
      });
      blocks.sort((a, b) => a.y - b.y);
      const secEls = Array.from(document.querySelectorAll("section, [class*=section], [id*=section], main > div, body > div > div")).filter((e) => {
        const r = e.getBoundingClientRect();
        return vis(e) && r.height > 200 && r.width > innerWidth * 0.6;
      });
      const tops = Array.from(new Set(secEls.map((e) => Math.round(e.getBoundingClientRect().top + sy)))).sort((a, b) => a - b).filter((y, i, arr) => i === 0 || y - arr[i - 1] > 150);
      const sections = tops.map((y, i) => ({ index: i, y, height: (tops[i + 1] ?? document.documentElement.scrollHeight) - y, heading: "" }));
      for (const b of blocks) {
        let idx = 0;
        for (const s of sections) if (b.y >= s.y) idx = s.index;
        b.section = idx;
      }
      for (const s of sections) s.heading = blocks.find((b) => b.section === s.index && /^h[1-4]$/.test(b.tag))?.text ?? blocks.find((b) => b.section === s.index)?.text?.slice(0, 80) ?? "";
      const links = Array.from(document.querySelectorAll("a[href]")).map((a) => ({ href: (a as HTMLAnchorElement).href, text: (a as HTMLElement).innerText.replace(/\s+/g, " ").trim().slice(0, 120) }));
      const images = Array.from(document.images).filter((i) => i.naturalWidth > 80 && vis(i)).map((i) => ({ src: i.currentSrc || i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, y: Math.round(i.getBoundingClientRect().top + sy) }));
      const bg: { src: string; alt: string; w: number; h: number; y: number }[] = [];
      document.querySelectorAll("section, div, header").forEach((el) => {
        const m = getComputedStyle(el).backgroundImage.match(/url\("?(.*?)"?\)/);
        const r = el.getBoundingClientRect();
        if (m && r.width > 300 && r.height > 200) bg.push({ src: m[1], alt: "background", w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + sy) });
      });
      const videos = Array.from(document.querySelectorAll("video source, video[src], iframe[src*=youtube], iframe[src*=vimeo], iframe[src*=panda], iframe[src*=vturb], iframe[src*=wistia]")).map((v) => (v as HTMLIFrameElement).src).filter(Boolean);
      const forms = Array.from(document.forms).map((f) => ({ action: f.action, fields: Array.from(f.elements).map((e) => (e as HTMLInputElement).name || (e as HTMLInputElement).type).filter(Boolean), submit: (f.querySelector("[type=submit],button") as HTMLElement)?.innerText ?? "" }));
      const fonts = new Set<string>(), colors = new Map<string, number>();
      document.querySelectorAll("h1,h2,h3,p,a,button,section").forEach((el) => {
        const s = getComputedStyle(el);
        fonts.add(s.fontFamily.split(",")[0].replace(/["']/g, "").trim());
        for (const c of [s.color, s.backgroundColor]) if (c && c !== "rgba(0, 0, 0, 0)") colors.set(c, (colors.get(c) ?? 0) + 1);
      });
      const meta: Record<string, string> = {};
      document.querySelectorAll("meta[name], meta[property]").forEach((m) => {
        const k = m.getAttribute("name") || m.getAttribute("property");
        const v = m.getAttribute("content");
        if (k && v && /description|title|og:|twitter:/.test(k)) meta[k] = v.slice(0, 400);
      });
      return {
        title: document.title, lang: document.documentElement.lang, meta, blocks, sections, links,
        images: [...images, ...bg].slice(0, 80), videos: Array.from(new Set(videos)), forms,
        fonts: Array.from(fonts).slice(0, 10), colors: Array.from(colors.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([c]) => c),
        pageHeight: document.documentElement.scrollHeight,
      };
    });
    const allText = data.blocks.map((b) => b.text).join("\n");
    const prices = Array.from(new Set(allText.match(/(?:\d+\s?x\s?(?:de\s)?)?R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/gi) ?? []));
    const origin = new URL(page.url()).origin;
    const links = Array.from(new Map(data.links.filter((l) => l.href).map((l) => [l.href + "|" + l.text, l])).values()).map((l) => ({
      ...l,
      kind: (l.href.startsWith(origin + new URL(page.url()).pathname + "#") ? "anchor" : /wa\.me|whatsapp/i.test(l.href) ? "whatsapp" : CHECKOUT.test(l.href) ? "checkout" : l.href.startsWith(origin) ? "internal" : "external") as Extraction["links"][number]["kind"],
    })).slice(0, 150);
    if (data.pageHeight > 30000) limitations.push(`Página muito longa (${data.pageHeight}px); capturas limitadas a 16000px.`);
    const clip = (h: number) => ({ x: 0, y: 0, width: page.viewportSize()!.width, height: Math.min(h, 16000) });
    await page.screenshot({ path: `${shotsDir}/source-desktop.jpg`, type: "jpeg", quality: 70, clip: clip(data.pageHeight), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(800);
    const mh = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: `${shotsDir}/source-mobile.jpg`, type: "jpeg", quality: 65, clip: { x: 0, y: 0, width: 390, height: Math.min(mh, 16000) }, fullPage: true });
    if (!data.blocks.length) limitations.push("Nenhum texto visível foi extraído (página pode ser renderizada em canvas/imagem).");
    return {
      kind: "url", finalUrl: page.url(), ...data, links, prices, limitations,
      screenshots: { desktop: "source-desktop.jpg", mobile: "source-mobile.jpg" },
    };
  } finally {
    await browser.close();
  }
}
