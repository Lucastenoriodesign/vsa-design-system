import { NextResponse } from "next/server";
import { PATTERNS, searchPatterns } from "../../../lib/library/patterns";
import { providerInfo } from "../../../lib/llm";

export async function GET(req: Request) {
  const u = new URL(req.url);
  if (u.searchParams.get("info")) { const { provider, model } = providerInfo(); return NextResponse.json({ provider, model }); }
  const q = u.searchParams.get("q");
  return NextResponse.json(q ? searchPatterns(q, 50) : PATTERNS);
}
