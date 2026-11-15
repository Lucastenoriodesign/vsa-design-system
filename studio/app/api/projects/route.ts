import { NextResponse } from "next/server";
import fs from "node:fs";
import { createProject, listProjects, projectPath } from "../../../lib/store";
import { assertPublicUrl, assertPdf } from "../../../lib/security";
import { runJob, analyze } from "../../../lib/pipeline";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(listProjects());
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const url = String(fd.get("url") ?? "").trim();
    const brief = String(fd.get("brief") ?? "").trim();
    const file = fd.get("pdf");
    let p;
    if (file && typeof file !== "string" && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());
      assertPdf(buf, file.name);
      p = createProject({ kind: "pdf", fileName: file.name }, file.name.replace(/\.pdf$/i, ""));
      fs.writeFileSync(projectPath(p.id, "source.pdf"), buf);
    } else if (url) {
      const u = await assertPublicUrl(url);
      p = createProject({ kind: "url", url: u.toString() }, u.hostname + u.pathname);
    } else if (brief.length > 20) {
      p = createProject({ kind: "brief", brief: brief.slice(0, 20000) }, brief.slice(0, 60));
    } else {
      return NextResponse.json({ error: "Envie uma URL, um PDF ou um briefing com mais detalhes." }, { status: 400 });
    }
    runJob(p.id, "analyzing", () => analyze(p.id));
    return NextResponse.json({ id: p.id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
