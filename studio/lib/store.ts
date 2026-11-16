import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { sanitizeGenerated } from "./html-ops";
import type { PageIntelligenceReport, ConversionStrategy, CreativeDirections, DesignSpec, QAReport } from "./schemas";
import type { Extraction } from "./ingest/types";

/**
 * File-based persistence (data/projects/<id>). Interface kept narrow so a Supabase
 * implementation (DB rows + Storage bucket) can replace it without touching the pipeline.
 */
export const DATA_DIR = process.env.STUDIO_DATA_DIR || path.join(process.cwd(), "data");

export type StepStatus = "pending" | "running" | "done" | "error" | "skipped";
export type Step = { key: string; label: string; status: StepStatus; startedAt?: string; endedAt?: string; detail?: string };
export type Version = {
  n: number;
  createdAt: string;
  reason: string;
  prompt?: string;
  qa?: { score: number; report: QAReport; checks: RenderChecks; shots: Record<string, string> };
};
export type RenderChecks = {
  widths: { width: number; overflowX: boolean; scrollWidth: number; height: number }[];
  consoleErrors: string[];
  brokenImages: string[];
  links: { href: string; text: string }[];
  invisibleTextBlocks: number;
  reducedMotionOk: boolean;
  cls: number;
};
export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  source: { kind: "url" | "pdf" | "brief"; url?: string; fileName?: string; brief?: string };
  status: "created" | "analyzing" | "analyzed" | "directing" | "directed" | "building" | "ready" | "refining" | "error";
  error?: string;
  steps: Step[];
  extraction?: Extraction;
  report?: PageIntelligenceReport;
  strategy?: ConversionStrategy;
  directions?: CreativeDirections;
  selectedDirectionId?: string;
  spec?: DesignSpec;
  versions: Version[];
  currentVersion?: number;
  chat: { role: "user" | "studio"; text: string; at: string; version?: number }[];
  usage: { label: string; provider: string; model: string; ms: number; costUsd?: number; inputTokens?: number; outputTokens?: number }[];
};

const projDir = (id: string) => {
  if (!/^[a-z0-9-]{6,40}$/.test(id)) throw new Error("invalid project id");
  return path.join(DATA_DIR, "projects", id);
};
export const projectPath = (id: string, ...p: string[]) => path.join(projDir(id), ...p);

export function createProject(source: Project["source"], name: string): Project {
  const id = crypto.randomBytes(5).toString("hex") + "-" + Date.now().toString(36);
  fs.mkdirSync(projectPath(id, "versions"), { recursive: true });
  fs.mkdirSync(projectPath(id, "shots"), { recursive: true });
  const now = new Date().toISOString();
  const p: Project = { id, name, createdAt: now, updatedAt: now, source, status: "created", steps: [], versions: [], chat: [], usage: [] };
  saveProject(p);
  return p;
}

export function getProject(id: string): Project | null {
  try {
    return JSON.parse(fs.readFileSync(projectPath(id, "project.json"), "utf8"));
  } catch {
    return null;
  }
}

export function saveProject(p: Project) {
  p.updatedAt = new Date().toISOString();
  const f = projectPath(p.id, "project.json");
  fs.writeFileSync(f + ".tmp", JSON.stringify(p, null, 2));
  fs.renameSync(f + ".tmp", f);
}

/** Read-modify-write so concurrent step updates don't clobber each other's fields. */
export function updateProject(id: string, fn: (p: Project) => void): Project {
  const p = getProject(id);
  if (!p) throw new Error("project not found");
  fn(p);
  saveProject(p);
  return p;
}

export function listProjects(): Pick<Project, "id" | "name" | "status" | "updatedAt" | "source" | "currentVersion">[] {
  const dir = path.join(DATA_DIR, "projects");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((id) => getProject(id))
    .filter((p): p is Project => !!p)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(({ id, name, status, updatedAt, source, currentVersion }) => ({ id, name, status, updatedAt, source, currentVersion }));
}

export const versionFile = (id: string, n: number) => projectPath(id, "versions", `v${n}.html`);
export function readVersion(id: string, n: number) {
  return fs.readFileSync(versionFile(id, n), "utf8");
}
export function writeVersion(id: string, html: string, reason: string, prompt?: string): number {
  let n = 0;
  updateProject(id, (p) => {
    n = (p.versions.at(-1)?.n ?? 0) + 1;
    fs.writeFileSync(versionFile(id, n), sanitizeGenerated(html));
    p.versions.push({ n, createdAt: new Date().toISOString(), reason, prompt });
    p.currentVersion = n;
  });
  return n;
}
