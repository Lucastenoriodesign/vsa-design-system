import { parse, type HTMLElement } from "node-html-parser";

/** Deterministic document operations used by the editor (no AI involved). */
const opts = { comment: true, blockTextElements: { script: true, style: true, noscript: true, pre: true } };

export function listSections(html: string) {
  const root = parse(html, opts);
  return root.querySelectorAll("[data-section]").filter((el) => !el.parentNode?.closest?.("[data-section]")).map((el) => ({
    id: el.getAttribute("data-section")!,
    label: el.getAttribute("data-label") || el.getAttribute("data-section")!,
    tag: el.tagName.toLowerCase(),
    hidden: el.hasAttribute("hidden"),
  }));
}

function sectionEl(root: HTMLElement, id: string) {
  const el = root.querySelector(`[data-section="${id.replace(/"/g, "")}"]`);
  if (!el) throw new Error(`Seção ${id} não encontrada`);
  return el;
}

export function getSectionHtml(html: string, id: string) {
  return sectionEl(parse(html, opts), id).outerHTML;
}

/** Replaces a section with an AI fragment (section + optional <style data-for>/<script data-for>). */
export function replaceSection(html: string, id: string, fragment: string) {
  const root = parse(html, opts);
  // drop styles/scripts previously generated for this section
  root.querySelectorAll(`style[data-for="${id}"],script[data-for="${id}"]`).forEach((n) => n.remove());
  const frag = parse(fragment, opts);
  const sec = frag.querySelector(`[data-section="${id}"]`);
  if (!sec) throw new Error("Fragmento sem a seção");
  const extras = frag.querySelectorAll(`style[data-for],script[data-for]`);
  const el = sectionEl(root, id);
  el.replaceWith(sec.outerHTML + extras.map((e) => e.outerHTML).join(""));
  return root.toString();
}

export function setHidden(html: string, id: string, hidden: boolean) {
  const root = parse(html, opts);
  const el = sectionEl(root, id);
  if (hidden) el.setAttribute("hidden", "");
  else el.removeAttribute("hidden");
  return root.toString();
}

export function removeSection(html: string, id: string) {
  const root = parse(html, opts);
  sectionEl(root, id).remove();
  root.querySelectorAll(`style[data-for="${id}"],script[data-for="${id}"]`).forEach((n) => n.remove());
  return root.toString();
}

export function moveSection(html: string, id: string, dir: -1 | 1) {
  const root = parse(html, opts);
  const el = sectionEl(root, id);
  const parent = el.parentNode as HTMLElement;
  const sibs = parent.childNodes.filter((n) => (n as HTMLElement).getAttribute?.("data-section")) as HTMLElement[];
  const i = sibs.indexOf(el);
  const j = i + dir;
  if (j < 0 || j >= sibs.length) return html;
  const other = sibs[j];
  const a = el.outerHTML, b = other.outerHTML;
  el.replaceWith("<!--swap-a-->");
  other.replaceWith("<!--swap-b-->");
  return root.toString().replace("<!--swap-a-->", b).replace("<!--swap-b-->", a);
}

/** Reads and writes :root custom properties in <style id="tokens">. */
export function readTokens(html: string): Record<string, string> {
  const m = html.match(/<style[^>]*id=["']tokens["'][^>]*>([\s\S]*?)<\/style>/i);
  const out: Record<string, string> = {};
  if (!m) return out;
  for (const t of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[t[1]] = t[2].trim();
  return out;
}

export function writeTokens(html: string, patch: Record<string, string>) {
  return html.replace(/(<style[^>]*id=["']tokens["'][^>]*>)([\s\S]*?)(<\/style>)/i, (_all, a, body: string, c) => {
    let b = body;
    for (const [k, v] of Object.entries(patch)) {
      if (!/^--[\w-]+$/.test(k) || /[;{}<>]/.test(v)) continue;
      const re = new RegExp(`(${k.replace(/[-]/g, "\\-")}\\s*:\\s*)([^;]+)(;)`);
      b = re.test(b) ? b.replace(re, `$1${v}$3`) : b.replace(/:root\s*\{/, `:root{${k}:${v};`);
    }
    return a + b + c;
  });
}

/** Replace a text node exactly (used by inline text editing). */
export function replaceText(html: string, id: string, from: string, to: string) {
  const root = parse(html, opts);
  const el = sectionEl(root, id);
  const before = el.innerHTML;
  if (!before.includes(from)) throw new Error("Texto não encontrado na seção");
  el.set_content(before.replace(from, to.replace(/</g, "&lt;")));
  return root.toString();
}

/** Removes trackers and cookie/consent UI copied from the source page (code-level guard, not just a prompt rule). */
export function sanitizeGenerated(html: string) {
  const root = parse(html, opts);
  root.querySelectorAll("script").forEach((s) => {
    const src = s.getAttribute("src") || "";
    if (/fbq\(|gtag\(|googletagmanager|google-analytics|clarity\.ms|hotjar|tiktok\.com\/i18n\/pixel|connect\.facebook\.net/i.test(src + s.innerHTML)) s.remove();
  });
  root.querySelectorAll("noscript").forEach((n) => { if (/facebook\.com\/tr|googletagmanager/i.test(n.innerHTML)) n.remove(); });
  root.querySelectorAll("[id],[class],[aria-label]").forEach((el) => {
    const k = `${el.getAttribute("id") ?? ""} ${el.getAttribute("class") ?? ""} ${el.getAttribute("aria-label") ?? ""}`;
    if (/(^|[\s_-])(cookie|cookies|consent|lgpd|gdpr)([\s_-]|$)/i.test(k) && !el.closest("[data-section]")?.getAttribute("data-section")?.match(/faq|privac/)) el.remove();
  });
  return root.toString();
}
