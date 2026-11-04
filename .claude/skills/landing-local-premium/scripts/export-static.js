#!/usr/bin/env node
/*
 * Export the running Next.js page as ONE self-contained HTML file to paste into a
 * WordPress/Elementor HTML widget.
 *
 *   npm run build && npx next start -p 3100 &
 *   NODE_PATH=$(npm root -g) node export-static.js config.json
 *
 * What it does (each step fixes a real problem seen in production):
 *  - snapshots the hydrated DOM at 1440x900 and inlines every stylesheet;
 *  - removes Next.js scripts (they cannot run outside the app) but keeps JSON-LD;
 *  - removes favicon links (would 404 on the WordPress domain);
 *  - empties the 3D product band (the vanilla driver rebuilds it for any screen size);
 *  - inlines images as data URIs and DEDUPES them (first copy keeps the data,
 *    later copies borrow it on load);
 *  - injects the vanilla drivers for the 3D band and the testimonial carousel.
 *
 * Config (see references/export-config.example.json):
 *  url, publicDir, out, sitePrefix ("/sites/<slug>/"),
 *  bandImages [paths], band {...TiltedGridHero props, root},
 *  testimonials [...]  OR  testimonialsFromTsx { file, constName }
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const DRIVERS = path.join(__dirname, "drivers");
const TYPES = { svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const dataUri = (u) =>
  "data:" + TYPES[u.split(".").pop().toLowerCase()] + ";base64," + fs.readFileSync(path.join(cfg.publicDir, u)).toString("base64");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function loadTestimonials() {
  if (cfg.testimonials) return cfg.testimonials;
  if (!cfg.testimonialsFromTsx) return [];
  const { file, constName = "TESTIMONIALS" } = cfg.testimonialsFromTsx;
  const tsx = fs.readFileSync(file, "utf8");
  const start = tsx.indexOf("const " + constName);
  if (start < 0) return [];
  const lit = tsx.slice(start, tsx.indexOf("];", start) + 1).replace(/^const [^=]*=/, "");
  return new Function("return " + lit)();
}

(async () => {
  const base = new URL(cfg.url);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(cfg.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const bandRoot = (cfg.band && cfg.band.root) || ".q-hero-tilted";
  let html = await page.evaluate((root) => {
    const band = document.querySelector(root + " > div[aria-hidden]");
    if (band) band.innerHTML = "";
    return document.documentElement.outerHTML;
  }, bandRoot);

  for (const m of [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]) {
    const css = await (await fetch(new URL(m[1].replace(/&amp;/g, "&"), base))).text();
    html = html.replace(m[0], "<style>" + css + "</style>");
  }
  html = html
    .replace(/<script(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]+rel="(preload|modulepreload)"[^>]*>/g, "")
    .replace(/<link[^>]+rel="(icon|apple-touch-icon|shortcut icon)"[^>]*>/g, "");

  const prefix = cfg.sitePrefix || "/sites/";
  const re = new RegExp(esc(prefix) + "[^\"'\\\\ )]+\\.(svg|png|jpe?g|webp)", "gi");
  for (const u of new Set([...html.matchAll(re)].map((m) => m[0]))) html = html.split(u).join(dataUri(u));

  // Dedupe repeated <img> data URIs.
  const seen = new Map();
  let n = 0;
  html = html.replace(/<img([^>]*?)src="(data:image\/[^"]+)"/g, (m, pre, uri) => {
    if (!seen.has(uri)) { seen.set(uri, { id: n++, used: false }); return m; }
    const e = seen.get(uri); e.used = true;
    return '<img' + pre + 'src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-lp-dup="' + e.id + '"';
  });
  for (const [uri, e] of seen) if (e.used) html = html.replace('src="' + uri + '"', 'data-lp-img="' + e.id + '" src="' + uri + '"');
  const dedupeJs =
    "document.querySelectorAll('img[data-lp-dup]').forEach(function(i){var o=document.querySelector('img[data-lp-img=\"'+i.getAttribute('data-lp-dup')+'\"]');if(o)i.src=o.src;});";

  let scripts = "<script>" + dedupeJs + "</script>";
  if (cfg.bandImages && cfg.bandImages.length) {
    scripts += "<script>window.__LP_BAND_CFG=" + JSON.stringify(cfg.band || {}) + ";window.__LP_IMAGES=" +
      JSON.stringify(cfg.bandImages.map(dataUri)) + ";" + fs.readFileSync(path.join(DRIVERS, "tilted-band.js"), "utf8") + "</script>";
  }
  const testimonials = loadTestimonials();
  if (testimonials.length) {
    scripts += "<script>window.__LP_TESTIMONIALS=" + JSON.stringify(testimonials) + ";" +
      fs.readFileSync(path.join(DRIVERS, "highlight-testimonials.js"), "utf8") + "</script>";
  }
  html = "<!doctype html>" + html.replace("</body>", scripts + "</body>");
  fs.mkdirSync(path.dirname(cfg.out), { recursive: true });
  fs.writeFileSync(cfg.out, html);
  console.log("written", cfg.out, (html.length / 1024).toFixed(0) + " KB", "| dedupe ids", n);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
