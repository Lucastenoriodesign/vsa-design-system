import JSZip from "jszip";
import { readVersion, getProject } from "./store";

export async function exportZip(id: string, n: number, format: "static" | "next") {
  const p = getProject(id)!;
  const html = readVersion(id, n);
  const zip = new JSZip();
  const remote = Array.from(new Set(html.match(/https?:\/\/[^"')\s]+\.(?:png|jpe?g|webp|gif|svg|avif)/gi) ?? []));
  const readme = `# ${p.name} — v${n}\n\nGerado pelo AI Creative Page Studio em ${new Date().toISOString()}.\n\n` +
    `- Página única autocontida (HTML + CSS + JS vanilla). Fontes: Google Fonts.\n` +
    (remote.length ? `- Imagens referenciadas remotamente (da marca de origem). Confirme o direito de uso e, se quiser, baixe-as para /assets:\n${remote.map((r) => `  - ${r}`).join("\n")}\n` : "") +
    `- Revise links de checkout/WhatsApp antes de publicar.\n`;
  if (format === "static") {
    zip.file("index.html", html);
    zip.file("README.md", readme + "\nHospede a pasta em qualquer servidor estático (Vercel, Netlify, S3, cPanel).\n");
  } else {
    zip.file("public/page.html", html);
    zip.file("package.json", JSON.stringify({ name: p.id, private: true, scripts: { dev: "next dev", build: "next build", start: "next start" }, dependencies: { next: "^15.5.0", react: "^19.0.0", "react-dom": "^19.0.0" } }, null, 2));
    zip.file("next.config.mjs", `export default { async rewrites() { return [{ source: "/", destination: "/page.html" }]; } };\n`);
    zip.file("app/layout.tsx", `export default function L({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }\n`);
    zip.file("README.md", readme + "\nProjeto Next.js mínimo que serve a página em `/` (public/page.html via rewrite). `npm i && npm run dev`.\nA página continua sendo HTML/CSS/JS; a conversão para componentes React ainda não é feita pelo estúdio.\n");
  }
  return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}
