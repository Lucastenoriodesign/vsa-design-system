import Anthropic from "@anthropic-ai/sdk";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { z } from "zod";

export type LlmImage = { path: string; mediaType: "image/png" | "image/jpeg" };
export type LlmRequest = {
  system: string;
  prompt: string;
  images?: LlmImage[];
  pdfPath?: string;
  maxTokens?: number;
  label: string; // for logs
};

export type LlmUsage = { label: string; provider: string; model: string; ms: number; inputTokens?: number; outputTokens?: number; costUsd?: number };
const usageLog: LlmUsage[] = [];
export const drainUsage = () => usageLog.splice(0);

export function providerInfo() {
  const provider = process.env.LLM_PROVIDER || (process.env.ANTHROPIC_API_KEY ? "anthropic" : "claude-cli");
  const model = process.env.LLM_MODEL || "claude-opus-5-5";
  return { provider, model, effort: (process.env.LLM_EFFORT || "high") as "low" | "medium" | "high" | "xhigh" | "max" };
}

async function viaAnthropic(req: LlmRequest): Promise<string> {
  const { model, effort } = providerInfo();
  const client = new Anthropic();
  const content: Anthropic.ContentBlockParam[] = [];
  if (req.pdfPath) content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: fs.readFileSync(req.pdfPath).toString("base64") } });
  for (const img of req.images ?? []) content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: fs.readFileSync(img.path).toString("base64") } });
  content.push({ type: "text", text: req.prompt });
  const t0 = Date.now();
  const stream = client.messages.stream({
    model,
    max_tokens: req.maxTokens ?? 64000,
    thinking: { type: "adaptive" },
    output_config: { effort },
    system: req.system,
    messages: [{ role: "user", content }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error(`Model refused (${req.label})`);
  if (msg.stop_reason === "max_tokens") throw new Error(`Output truncated at max_tokens (${req.label})`);
  usageLog.push({ label: req.label, provider: "anthropic", model, ms: Date.now() - t0, inputTokens: msg.usage.input_tokens, outputTokens: msg.usage.output_tokens });
  return msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
}

/** Dev provider: the local Claude Code CLI (`claude -p`). Images/PDF are passed as file paths read with its Read tool. */
async function viaCli(req: LlmRequest): Promise<string> {
  const { model, effort } = providerInfo();
  const files = [...(req.images ?? []).map((i) => i.path), ...(req.pdfPath ? [req.pdfPath] : [])];
  const prompt = (files.length ? `Before answering, open and inspect these files with the Read tool (they are the visual evidence):\n${files.map((f) => `- ${f}`).join("\n")}\n\n` : "") + req.prompt;
  const args = ["-p", "--output-format", "json", "--model", model, "--effort", effort, "--no-session-persistence", "--system-prompt", req.system, "--tools", files.length ? "Read" : "", "--max-turns", String(files.length + 3)];
  if (files.length) args.push("--allowedTools", "Read");
  const t0 = Date.now();
  const out = await new Promise<string>((resolve, reject) => {
    const p = spawn("claude", args, { stdio: ["pipe", "pipe", "pipe"], env: process.env });
    let so = "", se = "";
    p.stdout.on("data", (d) => (so += d));
    p.stderr.on("data", (d) => (se += d));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve(so) : reject(new Error(`claude CLI exit ${code}: ${se.slice(0, 500) || so.slice(0, 500)}`))));
    p.stdin.end(prompt);
  });
  const j = JSON.parse(out);
  if (j.is_error) throw new Error(`claude CLI error: ${String(j.result).slice(0, 300)}`);
  usageLog.push({ label: req.label, provider: "claude-cli", model, ms: Date.now() - t0, inputTokens: j.usage?.input_tokens, outputTokens: j.usage?.output_tokens, costUsd: j.total_cost_usd });
  return String(j.result ?? "");
}

export async function complete(req: LlmRequest): Promise<string> {
  return providerInfo().provider === "anthropic" ? viaAnthropic(req) : viaCli(req);
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("No JSON object in model output");
  return JSON.parse(body.slice(start, end + 1));
}

/** Structured output validated by a zod schema, with one repair round. */
export async function completeJson<T extends z.ZodTypeAny>(schema: T, req: LlmRequest): Promise<z.infer<T>> {
  let schemaText = "";
  try { schemaText = JSON.stringify(z.toJSONSchema(schema, { unrepresentable: "any" })); } catch {}
  const sys = `${req.system}\n\nOutput contract: reply with ONE JSON object only (no prose, no markdown fences) that validates against this JSON Schema:\n${schemaText}`;
  let text = await complete({ ...req, system: sys });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = schema.safeParse(extractJson(text));
      if (parsed.success) return parsed.data;
      if (attempt === 1) throw new Error(parsed.error.message);
      text = await complete({ ...req, system: sys, images: undefined, pdfPath: undefined, label: `${req.label}:repair`, prompt: `Your previous JSON failed validation:\n${parsed.error.message.slice(0, 3000)}\n\nPrevious output:\n${text}\n\nReturn the corrected full JSON object only.` });
    } catch (e) {
      if (attempt === 1) throw e;
      text = await complete({ ...req, system: sys, images: undefined, pdfPath: undefined, label: `${req.label}:repair`, prompt: `Your previous output was not parseable JSON (${(e as Error).message}). Return ONLY the full JSON object.\n\nPrevious output:\n${text}` });
    }
  }
  throw new Error("unreachable");
}

/** Extracts a full HTML document from model output. */
export function extractHtml(text: string): string {
  const fenced = text.match(/```html\s*([\s\S]*?)```/i);
  const body = (fenced ? fenced[1] : text).trim();
  const i = body.search(/<!doctype html|<html/i);
  const j = body.toLowerCase().lastIndexOf("</html>");
  if (i < 0 || j < 0) throw new Error("Model did not return a complete HTML document");
  return body.slice(i, j + 7);
}
