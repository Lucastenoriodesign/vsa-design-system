import { NextResponse } from "next/server";
import { getProject, updateProject, readVersion, writeVersion } from "../../../../../lib/store";
import { runJob, analyze, direct, build, refine } from "../../../../../lib/pipeline";
import { setHidden, removeSection, moveSection, writeTokens, replaceText } from "../../../../../lib/html-ops";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  const { id, action } = await params;
  const p = getProject(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  try {
    switch (action) {
      case "analyze":
        runJob(id, "analyzing", () => analyze(id));
        break;
      case "direct":
        if (!p.strategy) throw new Error("Analise a fonte primeiro");
        runJob(id, "directing", () => direct(id));
        break;
      case "build":
        if (!p.directions) throw new Error("Gere as direções criativas primeiro");
        runJob(id, "building", () => build(id, body.directionId));
        break;
      case "refine": {
        const instruction = String(body.instruction ?? "").trim().slice(0, 4000);
        if (!instruction || !p.currentVersion) throw new Error("Nada para refinar");
        runJob(id, "refining", () => refine(id, instruction, body.sectionId || undefined, body.qa !== false));
        break;
      }
      case "restore": {
        const n = Number(body.version);
        if (!p.versions.some((v) => v.n === n)) throw new Error("Versão inexistente");
        const v = writeVersion(id, readVersion(id, n), `Restaurada a partir de v${n}`);
        updateProject(id, (pp) => pp.chat.push({ role: "studio", text: `v${n} restaurada como v${v}.`, at: new Date().toISOString(), version: v }));
        break;
      }
      case "section": {
        // deterministic edits: hide/show/remove/move/text
        const html = readVersion(id, p.currentVersion!);
        const sid = String(body.sectionId);
        const out =
          body.op === "hide" ? setHidden(html, sid, true) :
          body.op === "show" ? setHidden(html, sid, false) :
          body.op === "remove" ? removeSection(html, sid) :
          body.op === "up" ? moveSection(html, sid, -1) :
          body.op === "down" ? moveSection(html, sid, 1) :
          body.op === "text" ? replaceText(html, sid, String(body.from), String(body.to)) : null;
        if (out == null) throw new Error("Operação inválida");
        writeVersion(id, out, `Seção ${sid}: ${body.op}`);
        break;
      }
      case "tokens": {
        const html = readVersion(id, p.currentVersion!);
        writeVersion(id, writeTokens(html, body.tokens ?? {}), "Ajuste de tokens visuais");
        break;
      }
      case "select-direction":
        updateProject(id, (pp) => { pp.selectedDirectionId = String(body.directionId); });
        break;
      default:
        return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
