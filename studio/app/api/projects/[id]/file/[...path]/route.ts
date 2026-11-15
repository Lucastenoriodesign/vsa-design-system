import fs from "node:fs";
import path from "node:path";
import { projectPath } from "../../../../../../lib/store";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string; path: string[] }> }) {
  const { id, path: parts } = await params;
  if (parts.length !== 2 || parts[0] !== "shots" || !/^[\w.-]+\.(jpg|png)$/.test(parts[1])) return new Response("bad path", { status: 400 });
  const f = projectPath(id, "shots", path.basename(parts[1]));
  if (!fs.existsSync(f)) return new Response("not found", { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(f)), { headers: { "content-type": f.endsWith(".png") ? "image/png" : "image/jpeg", "cache-control": "no-cache" } });
}
