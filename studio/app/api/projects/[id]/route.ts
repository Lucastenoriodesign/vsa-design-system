import { NextResponse } from "next/server";
import { getProject, readVersion } from "../../../../lib/store";
import { isRunning } from "../../../../lib/pipeline";
import { listSections, readTokens } from "../../../../lib/html-ops";
import { providerInfo } from "../../../../lib/llm";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProject(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  let sections: ReturnType<typeof listSections> = [], tokens = {};
  if (p.currentVersion) {
    const html = readVersion(id, p.currentVersion);
    sections = listSections(html);
    tokens = readTokens(html);
  }
  const { provider, model } = providerInfo();
  return NextResponse.json({ ...p, running: isRunning(id), sections, tokens, provider, model });
}
