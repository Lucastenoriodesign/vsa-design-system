import { getProject, readVersion } from "../../../../../../lib/store";
import { exportZip } from "../../../../../../lib/export";

export const runtime = "nodejs";

const EDIT_SCRIPT = `<script>(()=>{const s=document.createElement('style');s.textContent='[data-section]{outline-offset:-2px}[data-section].__h{outline:2px dashed #ff6a3d}[data-section].__s{outline:2px solid #ff6a3d}';document.head.appendChild(s);
const top=e=>{let el=e.target.closest('[data-section]');while(el&&el.parentElement&&el.parentElement.closest('[data-section]'))el=el.parentElement.closest('[data-section]');return el};
document.addEventListener('mouseover',e=>{document.querySelectorAll('.__h').forEach(x=>x.classList.remove('__h'));const el=top(e);el&&el.classList.add('__h')});
document.addEventListener('click',e=>{const el=top(e);if(!el)return;e.preventDefault();document.querySelectorAll('.__s').forEach(x=>x.classList.remove('__s'));el.classList.add('__s');parent.postMessage({type:'studio:select',id:el.dataset.section},'*')},true);
addEventListener('message',e=>{if(e.data&&e.data.type==='studio:scroll'){const el=document.querySelector('[data-section="'+e.data.id+'"]');el&&el.scrollIntoView({behavior:'smooth'})}});})();</script>`;

export async function GET(req: Request, { params }: { params: Promise<{ id: string; n: string }> }) {
  const { id, n } = await params;
  const p = getProject(id);
  const v = Number(n);
  if (!p || !p.versions.some((x) => x.n === v)) return new Response("not found", { status: 404 });
  const url = new URL(req.url);
  const dl = url.searchParams.get("download");
  if (dl === "static" || dl === "next") {
    const buf = await exportZip(id, v, dl);
    return new Response(new Uint8Array(buf), { headers: { "content-type": "application/zip", "content-disposition": `attachment; filename="${id}-v${v}-${dl}.zip"` } });
  }
  let html = readVersion(id, v);
  if (url.searchParams.get("edit") === "1") html = html.replace(/<\/body>/i, EDIT_SCRIPT + "</body>");
  // Generated code runs sandboxed: no same-origin access to the studio.
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": "sandbox allow-scripts allow-popups", "x-content-type-options": "nosniff" } });
}
