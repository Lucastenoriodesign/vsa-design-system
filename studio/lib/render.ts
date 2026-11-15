import { chromium, type Page } from "playwright";
import fs from "node:fs";
import type { RenderChecks } from "./store";

export const TEST_WIDTHS = [360, 390, 768, 1024, 1440, 1920];

async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.evaluate(async () => {
    await document.fonts?.ready;
    const step = innerHeight * 0.7;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

/**
 * Renders a generated page in a real browser, runs objective checks at all test widths
 * and captures the screenshots the Visual QA Director inspects.
 */
export async function renderAndCheck(htmlFile: string, outDir: string, tag: string) {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const shots: Record<string, string> = {};
  const qaImages: string[] = [];
  const consoleErrors: string[] = [];
  const brokenImages = new Set<string>();
  const widths: RenderChecks["widths"] = [];
  let links: RenderChecks["links"] = [];
  let invisibleTextBlocks = 0;
  let cls = 0;
  let reducedMotionOk = true;
  try {
    for (const width of TEST_WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      page.on("console", (m) => m.type() === "error" && consoleErrors.push(`[${width}] ${m.text().slice(0, 200)}`));
      page.on("pageerror", (e) => consoleErrors.push(`[${width}] ${e.message.slice(0, 200)}`));
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        try {
          new PerformanceObserver((l) => l.getEntries().forEach((e) => { const ls = e as unknown as { value: number; hadRecentInput: boolean }; if (!ls.hadRecentInput) (window as unknown as { __cls: number }).__cls += ls.value; })).observe({ type: "layout-shift", buffered: true });
        } catch {}
      });
      await page.goto("file://" + htmlFile, { waitUntil: "load" });
      await settle(page);
      const m = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        h: document.documentElement.scrollHeight,
        broken: Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        invisible: Array.from(document.querySelectorAll("h1,h2,h3,p,li,a,button")).filter((el) => {
          const s = getComputedStyle(el);
          return (el as HTMLElement).innerText?.trim() && (Number(s.opacity) < 0.1 || s.visibility === "hidden") && !el.closest("[aria-hidden=true],details:not([open]),[hidden]");
        }).length,
        cls: (window as unknown as { __cls: number }).__cls,
        links: Array.from(document.querySelectorAll("a[href]")).map((a) => ({ href: a.getAttribute("href") || "", text: (a as HTMLElement).innerText.trim().slice(0, 80) })),
      }));
      widths.push({ width, overflowX: m.sw > width + 1, scrollWidth: m.sw, height: m.h });
      m.broken.forEach((b) => brokenImages.add(b));
      if (width === 1440) {
        invisibleTextBlocks = m.invisible;
        cls = Math.round(m.cls * 1000) / 1000;
        links = m.links;
        const full = `${tag}-desktop.jpg`;
        await page.screenshot({ path: `${outDir}/${full}`, fullPage: true, type: "jpeg", quality: 72, clip: { x: 0, y: 0, width, height: Math.min(m.h, 16000) } });
        shots.desktop = full;
        // Segments for the QA model (a full tall page is downscaled into illegibility otherwise)
        const seg = 1600;
        for (let i = 0, y = 0; y < m.h && i < 8; i++, y += seg) {
          const f = `${outDir}/${tag}-qa-d${i}.jpg`;
          await page.screenshot({ path: f, type: "jpeg", quality: 70, fullPage: true, clip: { x: 0, y, width, height: Math.min(seg, m.h - y) } });
          qaImages.push(f);
        }
      }
      if (width === 390) {
        const full = `${tag}-mobile.jpg`;
        await page.screenshot({ path: `${outDir}/${full}`, fullPage: true, type: "jpeg", quality: 72, clip: { x: 0, y: 0, width, height: Math.min(m.h, 16000) } });
        shots.mobile = full;
        const seg = 2400;
        for (let i = 0, y = 0; y < m.h && i < 4; i++, y += seg) {
          const f = `${outDir}/${tag}-qa-m${i}.jpg`;
          await page.screenshot({ path: f, type: "jpeg", quality: 70, fullPage: true, clip: { x: 0, y, width, height: Math.min(seg, m.h - y) } });
          qaImages.push(f);
        }
      }
      await ctx.close();
    }
    // Reduced motion: content must be readable without scrolling animations.
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("file://" + htmlFile, { waitUntil: "load" });
    await page.waitForTimeout(600);
    const hidden = await page.evaluate(() => Array.from(document.querySelectorAll("h1,h2,h3,p")).filter((el) => (el as HTMLElement).innerText?.trim() && Number(getComputedStyle(el).opacity) < 0.1 && !el.closest("[aria-hidden=true],details:not([open])")).length);
    reducedMotionOk = hidden === 0;
    await ctx.close();
  } finally {
    await browser.close();
  }
  const checks: RenderChecks = { widths, consoleErrors: consoleErrors.slice(0, 30), brokenImages: [...brokenImages], links, invisibleTextBlocks, reducedMotionOk, cls };
  return { checks, shots, qaImages };
}

export function checksSummary(c: RenderChecks) {
  const lines = [
    ...c.widths.map((w) => `${w.width}px: ${w.overflowX ? `OVERFLOW HORIZONTAL (scrollWidth ${w.scrollWidth})` : "sem overflow"}, altura ${w.height}px`),
    `Erros de console: ${c.consoleErrors.length ? c.consoleErrors.join(" | ") : "nenhum"}`,
    `Imagens quebradas: ${c.brokenImages.length ? c.brokenImages.join(", ") : "nenhuma"}`,
    `Blocos de texto invisíveis após scroll completo: ${c.invisibleTextBlocks}`,
    `Movimento reduzido: ${c.reducedMotionOk ? "conteúdo legível" : "há conteúdo oculto com prefers-reduced-motion"}`,
    `CLS: ${c.cls}`,
    `Links: ${c.links.length} (${c.links.filter((l) => !l.href || l.href === "#").length} vazios/"#")`,
  ];
  return lines.join("\n");
}
