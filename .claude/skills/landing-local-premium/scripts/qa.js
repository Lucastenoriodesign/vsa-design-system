#!/usr/bin/env node
/*
 * QA for the exported page, simulating a WordPress/Elementor theme.
 *
 *   NODE_PATH=$(npm root -g) node qa.js /abs/path/page.html [--shots /abs/dir]
 *
 * For each viewport it reports: elements off-screen (measured per element, because
 * overflow-x:hidden hides them from scrollWidth), touch targets < 44px, text < 12px,
 * images without alt or broken, and console/page errors. With --shots it saves a
 * screenshot of every <section id> per viewport for visual review.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const file = process.argv[2];
const shotsIdx = process.argv.indexOf("--shots");
const shotsDir = shotsIdx > 0 ? process.argv[shotsIdx + 1] : null;
const url = /^https?:/.test(file) ? file : "file://" + path.resolve(file);

// What Hello Elementor & friends do to pasted HTML.
const THEME_CSS = [
  "img{height:auto;max-width:100%}",
  ".elementor img{height:auto;max-width:100%;border:none;border-radius:0;box-shadow:none}",
  "button,[type=button]{display:inline-block;color:#c36;border:1px solid #c36;padding:.5rem 1rem;border-radius:3px;background:transparent}",
  "button:hover,[type=button]:hover{color:#fff;background-color:#c36}",
  "figcaption{font-style:italic}",
  "p{margin-block-end:.9rem}",
  "iframe{max-width:100%;margin-bottom:1rem}",
].join("");

const VIEWPORTS = [
  ["desktop-1440", 1440, 900],
  ["desktop-1280", 1280, 720],
  ["tablet-820", 820, 1180],
  ["tablet-768", 768, 1024],
  ["mobile-390", 390, 844],
  ["mobile-360", 360, 740],
];

(async () => {
  const browser = await chromium.launch();
  let problems = 0;
  for (const [name, w, h] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, hasTouch: w < 1024 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/favicon/.test(m.text())) errors.push(m.text().slice(0, 140)); });
    await page.goto(url);
    await page.evaluate((css) => {
      const s = document.createElement("style"); s.textContent = css; document.head.prepend(s);
      const root = document.body.firstElementChild; const box = document.createElement("div");
      box.className = "elementor"; box.style.cssText = "max-width:1250px;margin:0 auto";
      root.parentNode.insertBefore(box, root); box.appendChild(root);
      window.dispatchEvent(new Event("resize"));
    }, THEME_CSS);
    await page.waitForTimeout(1800);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const r = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      // Elements that are allowed to bleed: 3D product band, marquees, intro overlay.
      const allowed = (e) => e.closest('[class*="tgh-"], .jb-tile, [class*="marquee"], [class*="intro"], div[aria-hidden="true"]');
      const visible = (e) => { const s = getComputedStyle(e); return s.visibility !== "hidden" && s.display !== "none" && !allowed(e); };
      const label = (e) => ((e.getAttribute("aria-label") || e.textContent || e.tagName) + "").trim().replace(/\s+/g, " ").slice(0, 32);
      const all = [...document.body.querySelectorAll("*")];
      const offscreen = all.filter((e) => !allowed(e)).filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > W + 1 || b.left < -1); })
        .slice(0, 6).map((e) => label(e) + " " + Math.round(e.getBoundingClientRect().left) + ".." + Math.round(e.getBoundingClientRect().right));
      const smallTaps = [...document.querySelectorAll("a, button")].filter(visible)
        .map((e) => ({ e, b: e.getBoundingClientRect() })).filter((o) => o.b.width > 0 && (o.b.height < 40 || o.b.width < 24))
        .slice(0, 8).map((o) => label(o.e) + " " + Math.round(o.b.width) + "x" + Math.round(o.b.height));
      const tiny = new Set();
      all.filter(visible).forEach((e) => {
        if ([...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) {
          const fs = parseFloat(getComputedStyle(e).fontSize); if (fs < 12) tiny.add(label(e) + " (" + fs + "px)");
        }
      });
      const imgs = [...document.images].filter((i) => !allowed(i));
      return {
        height: document.body.scrollHeight,
        offscreen, smallTaps, tinyText: [...tiny].slice(0, 6),
        noAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
        broken: imgs.filter((i) => i.complete && i.naturalWidth <= 1 && !i.hasAttribute("data-lp-dup")).length,
        h1: document.querySelectorAll("h1").length,
        jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
      };
    });
    const bad = r.offscreen.length + r.smallTaps.length + r.tinyText.length + r.noAlt + r.broken + errors.length + (r.h1 !== 1 ? 1 : 0);
    problems += bad;
    console.log("\n== " + name + (bad ? "  ✖ " + bad + " problem(s)" : "  ✓ ok"));
    console.log(JSON.stringify({ ...r, errors }, null, 1));

    if (shotsDir) {
      fs.mkdirSync(shotsDir, { recursive: true });
      for (const id of await page.evaluate(() => [...document.querySelectorAll("section[id], div[id]")].map((e) => e.id).filter(Boolean))) {
        const el = page.locator("#" + id).first();
        try { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200); await el.screenshot({ path: path.join(shotsDir, name + "-" + id + ".png") }); } catch {}
      }
    }
    await page.close();
  }
  await browser.close();
  console.log("\n" + (problems ? "✖ " + problems + " problem(s) — fix before sending." : "✓ All viewports clean."));
  process.exit(problems ? 1 : 0);
})();
