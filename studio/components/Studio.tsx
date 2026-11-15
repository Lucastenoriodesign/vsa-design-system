"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "../lib/store";
import type { Fact } from "../lib/schemas";

type Data = Project & { running: boolean; sections: { id: string; label: string; hidden: boolean }[]; tokens: Record<string, string>; provider: string; model: string };
type View = "analysis" | "directions" | "editor";
const DEVICES = { desktop: 1440, tablet: 820, mobile: 390 } as const;
const QUICK = ["Deixe mais premium", "Essa seção ficou genérica", "Hero mais cinematográfico", "Deixe mais minimalista", "Melhore apenas o mobile", "Tipografia mais expressiva", "Crie uma composição mais autoral"];

async function post(id: string, action: string, body: object = {}) {
  const r = await fetch(`/api/projects/${id}/${action}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error);
  return j;
}

function F({ f, label }: { f: Fact; label: string }) {
  return <><dt>{label}</dt><dd>{f.value}<span className={`tag ${f.status}`}>{f.status === "found" ? "fonte" : f.status === "inferred" ? "inferido" : "ausente"}</span></dd></>;
}

function Steps({ p }: { p: Data }) {
  return (
    <div className="steps">
      {p.steps.map((s) => (
        <div className="step" key={s.key}>
          <span className={`dot ${s.status}`} />
          <span>{s.label}</span>
          <small>{s.endedAt && s.startedAt ? `${Math.round((+new Date(s.endedAt) - +new Date(s.startedAt)) / 1000)}s` : s.status === "running" ? "em andamento" : ""}</small>
          {s.detail && <span className="det">{s.detail}</span>}
        </div>
      ))}
      {!p.steps.length && <p className="empty">Aguardando início…</p>}
    </div>
  );
}

function DirectionCard({ d, on, rec, onClick }: { d: NonNullable<Project["directions"]>["directions"][number]; on: boolean; rec: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / 1200));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const doc = `<!doctype html><html><head><meta charset=utf-8><style>html,body{margin:0;width:1200px;height:720px;overflow:hidden}</style></head><body>${d.previewHtml}</body></html>`;
  return (
    <article className={`dir ${on ? "on" : ""}`} onClick={onClick} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()} aria-pressed={on}>
      <div className="pv" ref={ref} style={{ ["--k" as string]: k }}><iframe title={d.name} sandbox="" srcDoc={doc} tabIndex={-1} /></div>
      <div className="info">
        {rec && <span className="rec">Recomendada pelo Creative Director</span>}
        <h3>{d.name}</h3>
        <p>{d.concept}</p>
        <div className="swatches">{d.palette.map((c) => <i key={c.hex} style={{ background: c.hex }} title={`${c.name} ${c.hex} — ${c.role}`} />)}</div>
        <p><b style={{ color: "var(--paper)" }}>{d.typography.display}</b> + {d.typography.text}{d.typography.accent ? ` + ${d.typography.accent}` : ""}</p>
        <p>{d.feeling}</p>
        <div className="meta">orig {d.scores.originality} · marca {d.scores.brandFit} · leitura {d.scores.legibility} · conv {d.scores.conversion}</div>
      </div>
    </article>
  );
}

export default function Studio({ id }: { id: string }) {
  const [p, setP] = useState<Data | null>(null);
  const [view, setView] = useState<View>("analysis");
  const [err, setErr] = useState("");
  const [device, setDevice] = useState<keyof typeof DEVICES>("desktop");
  const [zoom, setZoom] = useState(0);
  const [compare, setCompare] = useState(false);
  const [rpOpen, setRpOpen] = useState(true);
  const [tab, setTab] = useState<"assist" | "props" | "qa" | "versions">("assist");
  const [sel, setSel] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [chosen, setChosen] = useState("");
  const [frameKey, setFrameKey] = useState(0);
  const iframe = useRef<HTMLIFrameElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(1000);

  const load = useCallback(async () => {
    const r = await fetch(`/api/projects/${id}`);
    if (!r.ok) { setErr("Projeto não encontrado"); return; }
    const j: Data = await r.json();
    setP((old) => {
      if (old?.currentVersion !== j.currentVersion) setFrameKey((k) => k + 1);
      return j;
    });
    setTokens(j.tokens);
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!p?.running) return;
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, [p?.running, load]);
  // pick the view that matches the project stage once
  const stage: View = p?.versions.length ? "editor" : p?.directions ? "directions" : "analysis";
  const lastStage = useRef<View | null>(null);
  useEffect(() => { if (p && lastStage.current !== stage) { setView(stage); lastStage.current = stage; } }, [p, stage]);
  useEffect(() => { if (p?.selectedDirectionId && !chosen) setChosen(p.selectedDirectionId); }, [p?.selectedDirectionId, chosen]);
  useEffect(() => {
    const on = (e: MessageEvent) => { if (e.data?.type === "studio:select") { setSel(e.data.id); setTab((t) => (t === "versions" || t === "qa" ? "assist" : t)); } };
    addEventListener("message", on);
    return () => removeEventListener("message", on);
  }, []);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCw(el.clientWidth - 52));
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, compare]);

  const act = async (action: string, body: object = {}) => {
    setErr("");
    try { await post(id, action, body); await load(); } catch (e) { setErr((e as Error).message); }
  };

  const cur = p?.versions.find((v) => v.n === p.currentVersion);
  const fit = useMemo(() => Math.min(1, cw / DEVICES[device]), [cw, device]);
  const scale = zoom || fit;
  const height = 900;

  if (!p) return <main className="stage">{err || "Carregando…"}</main>;
  const busy = p.running;
  const r = p.report;

  const toolbar = (
    <div className="toolbar">
      <span className="title" title={p.name}>{p.name}</span>
      <div className="seg" role="tablist" aria-label="Etapas">
        <button className={view === "analysis" ? "on" : ""} onClick={() => setView("analysis")}>Análise</button>
        <button className={view === "directions" ? "on" : ""} onClick={() => setView("directions")} disabled={!p.directions}>Direções</button>
        <button className={view === "editor" ? "on" : ""} onClick={() => setView("editor")} disabled={!p.versions.length}>Editor</button>
      </div>
      <span className="sp" />
      {busy && <span className="pill run">{p.status}…</span>}
      {p.status === "error" && <span className="pill error" title={p.error}>erro</span>}
      {view === "editor" && <>
        <div className="seg" aria-label="Dispositivo">{(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((d) => <button key={d} className={device === d ? "on" : ""} onClick={() => { setDevice(d); setZoom(0); }}>{d}</button>)}</div>
        <div className="seg" aria-label="Zoom"><button onClick={() => setZoom(Math.max(0.25, +(scale - 0.1).toFixed(2)))}>−</button><button onClick={() => setZoom(0)}>{Math.round(scale * 100)}%</button><button onClick={() => setZoom(Math.min(1.5, +(scale + 0.1).toFixed(2)))}>+</button></div>
        {p.extraction?.screenshots.desktop && <button className={`icon-btn ${compare ? "on" : ""}`} onClick={() => setCompare((c) => !c)}>{compare ? "Fechar comparação" : "Antes / depois"}</button>}
        <a className="icon-btn" href={`/api/projects/${id}/version/${p.currentVersion}`} target="_blank" rel="noreferrer">Abrir ↗</a>
      </>}
      <button className="icon-btn" onClick={() => setRpOpen((o) => !o)} aria-label="Alternar painel">{rpOpen ? "⇥" : "⇤"}</button>
    </div>
  );

  // ---------- stage views ----------
  let center: React.ReactNode;
  if (view === "analysis") {
    center = (
      <div className="stage">
        <div className="kicker">{p.source.kind === "url" ? p.source.url : p.source.kind === "pdf" ? p.source.fileName : "Briefing"}</div>
        <h2>{r ? "O que a página realmente diz." : "Lendo a fonte com atenção."}</h2>
        {err && <p className="err">{err}</p>}
        {p.error && <p className="err">Erro: {p.error} <button className="btn ghost" onClick={() => act("analyze")}>Tentar de novo</button></p>}
        {!r && <Steps p={p} />}
        {r && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn signal" disabled={busy} onClick={() => act("direct")}>{p.directions ? "Gerar novas direções" : "Propor 3 direções criativas →"}</button>
              {p.directions && <button className="btn ghost" onClick={() => setView("directions")}>Ver direções</button>}
            </div>
            <div className="report-grid">
              <div>
                <div className="card-plain"><h3>Page Intelligence Report</h3>
                  <dl className="kv">
                    <F f={r.brand} label="Marca" /><F f={r.segment} label="Segmento" /><F f={r.product} label="Produto" /><F f={r.audience} label="Público" />
                    <F f={r.corePromise} label="Promessa" /><F f={r.valueProposition} label="Proposta" />
                    <dt>CTA principal</dt><dd>{r.primaryCta.label} {r.primaryCta.href && <span className="meta">→ {r.primaryCta.href}</span>}</dd>
                    <dt>Funil</dt><dd>{r.funnel}</dd>
                    <dt>Posicionamento</dt><dd>{r.pricePositioning} · {r.sophisticationLevel}</dd>
                    <dt>Emoção-alvo</dt><dd>{r.emotionalTarget}</dd>
                  </dl>
                </div>
                <div className="card-plain" style={{ marginTop: 24 }}><h3>Preços e condições</h3>{r.pricing.length ? <ul>{r.pricing.map((x, i) => <li key={i}><b>{x.label}:</b> {x.value} {x.conditions} <span className="meta">“{x.evidence}”</span></li>)}</ul> : <p className="empty">Nenhum preço encontrado na fonte.</p>}</div>
                <div className="card-plain" style={{ marginTop: 24 }}><h3>Provas reais</h3>{r.proofs.length ? <ul>{r.proofs.map((x, i) => <li key={i}><b>{x.kind}:</b> {x.content}</li>)}</ul> : <p className="empty">Nenhuma prova social encontrada — o estúdio não criará depoimentos.</p>}</div>
              </div>
              <div>
                <div className="card-plain"><h3>Seções identificadas</h3><ul>{r.sections.map((s, i) => <li key={i}><b>{s.name}</b> — {s.purpose}</li>)}</ul></div>
                <div className="card-plain" style={{ marginTop: 24 }}><h3>Oportunidades</h3><ul>{r.opportunities.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                <div className="card-plain" style={{ marginTop: 24 }}><h3>Ausente na fonte</h3><ul>{r.missingInformation.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                {p.strategy && <div className="card-plain" style={{ marginTop: 24 }}><h3>Nova sequência (Conversion Strategist)</h3><ol style={{ paddingLeft: 18, color: "var(--paper-dim)" }}>{p.strategy.sectionPlan.map((s) => <li key={s.id}><b style={{ color: "var(--paper)" }}>{s.name}</b> — {s.goal}</li>)}</ol></div>}
                {!!p.extraction?.limitations.length && <div className="card-plain" style={{ marginTop: 24 }}><h3>Limitações da captura</h3><ul>{p.extraction.limitations.map((s, i) => <li key={i}>{s}</li>)}</ul></div>}
              </div>
            </div>
            <div className="h-label" style={{ marginTop: 40 }}>Registro de execução</div><Steps p={p} />
          </>
        )}
      </div>
    );
  } else if (view === "directions" && p.directions) {
    const building = p.status === "building";
    center = (
      <div className="stage">
        <div className="kicker">Creative Director</div>
        <h2>Três caminhos. Um critério.</h2>
        <details style={{ color: "var(--paper-dim)", maxWidth: "80ch", marginBottom: 20 }}><summary style={{ cursor: "pointer", color: "var(--paper)" }}>Por que a recomendação</summary><p>{p.directions.rationale}</p></details>
        {err && <p className="err">{err}</p>}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn signal" disabled={busy || !chosen} onClick={() => act("build", { directionId: chosen })}>{p.versions.length ? "Reconstruir com esta direção" : "Construir a página com esta direção →"}</button>
          <button className="btn ghost" disabled={busy} onClick={() => act("direct")}>Gerar outras 3 direções</button>
        </div>
        <div className="dirs">{p.directions.directions.map((d) => <DirectionCard key={d.id} d={d} on={chosen === d.id} rec={p.directions!.recommendedId === d.id} onClick={() => setChosen(d.id)} />)}</div>
        {(building || p.status === "error") && <><div className="h-label" style={{ marginTop: 40 }}>Construção</div><Steps p={p} /></>}
      </div>
    );
  } else {
    const src = `/api/projects/${id}/version/${p.currentVersion}?edit=1`;
    const w = DEVICES[device];
    center = (
      <>
        <div className="canvas" ref={canvas}>
          {compare ? (
            <div className="compare">
              <figure><figcaption>Original ({device === "mobile" ? "mobile" : "desktop"})</figcaption><img alt="Captura da página original" src={`/api/projects/${id}/file/shots/${device === "mobile" ? p.extraction!.screenshots.mobile : p.extraction!.screenshots.desktop}`} /></figure>
              <figure><figcaption>Reconstrução v{p.currentVersion}</figcaption>{cur?.qa?.shots[device === "mobile" ? "mobile" : "desktop"] ? <img alt="Captura da reconstrução" src={`/api/projects/${id}/file/shots/${cur.qa.shots[device === "mobile" ? "mobile" : "desktop"]}`} /> : <p className="empty">Sem captura desta versão.</p>}</figure>
            </div>
          ) : (
            <div style={{ width: w * scale, height: height * scale + 2000 * 0, flex: "none" }}>
              <div className="device" style={{ width: w, height: `calc((100vh - 160px) / ${scale})`, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
                <iframe key={frameKey} ref={iframe} title="Prévia da página" src={src} sandbox="allow-scripts allow-popups" />
              </div>
            </div>
          )}
        </div>
        <div className="sections-bar" aria-label="Seções">
          {p.sections.map((s) => <button key={s.id} className={`${sel === s.id ? "on" : ""} ${s.hidden ? "hid" : ""}`} onClick={() => { setSel(s.id); iframe.current?.contentWindow?.postMessage({ type: "studio:scroll", id: s.id }, "*"); }}>{s.label}</button>)}
        </div>
      </>
    );
  }

  // ---------- right panel ----------
  const panel = (
    <aside className="panel" aria-label="Painel criativo">
      <div className="panel-tabs">
        {([["assist", "Assistente"], ["props", "Propriedades"], ["qa", "Qualidade"], ["versions", "Versões"]] as const).map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === "assist" && (
        <>
          <div className="panel-body">
            {!p.versions.length && <p className="empty">O assistente fica disponível depois da primeira construção. Até lá, acompanhe a análise e escolha uma direção.</p>}
            <div className="chat">{p.chat.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}</div>
            {busy && <div style={{ marginTop: 16 }}><Steps p={{ ...p, steps: p.steps.filter((s) => s.status === "running") } as Data} /></div>}
          </div>
          <div className="composer-mini">
            <div className="target"><span>{sel ? `Alvo: seção ${sel}` : "Alvo: página inteira"}</span>{sel && <button className="icon-btn" style={{ height: 20 }} onClick={() => setSel("")}>limpar</button>}</div>
            <div className="chips">{QUICK.map((q) => <button key={q} onClick={() => setPrompt(q)}>{q}</button>)}</div>
            <textarea placeholder={sel ? "O que mudar nesta seção?" : "Peça uma alteração à direção criativa…"} value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={!p.versions.length}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt.trim()) { act("refine", { instruction: prompt, sectionId: sel }); setPrompt(""); } }} />
            {err && <div className="err" style={{ border: 0, padding: 0 }}>{err}</div>}
            <button className="btn signal" disabled={busy || !prompt.trim() || !p.versions.length} onClick={() => { act("refine", { instruction: prompt, sectionId: sel }); setPrompt(""); }}>{sel ? "Redesenhar seção" : "Aplicar à página"}</button>
          </div>
        </>
      )}
      {tab === "props" && (
        <div className="panel-body">
          {!p.versions.length ? <p className="empty">Sem página ainda.</p> : <>
            <div className="h-label">Seção selecionada</div>
            {sel ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button className="icon-btn" disabled={busy} onClick={() => act("section", { sectionId: sel, op: "up" })}>↑ subir</button>
                <button className="icon-btn" disabled={busy} onClick={() => act("section", { sectionId: sel, op: "down" })}>↓ descer</button>
                <button className="icon-btn" disabled={busy} onClick={() => act("section", { sectionId: sel, op: p.sections.find((s) => s.id === sel)?.hidden ? "show" : "hide" })}>{p.sections.find((s) => s.id === sel)?.hidden ? "mostrar" : "ocultar"}</button>
                <button className="icon-btn" disabled={busy} onClick={() => confirm(`Remover a seção ${sel}?`) && act("section", { sectionId: sel, op: "remove" })}>remover</button>
                <button className="icon-btn" disabled={busy} onClick={() => act("refine", { instruction: "Gere uma variação claramente diferente desta seção, mantendo conteúdo e direção de arte.", sectionId: sel })}>gerar variação</button>
                <button className="icon-btn" disabled={busy} onClick={() => act("refine", { instruction: "Redesenhe esta seção com uma composição mais autoral e menos previsível.", sectionId: sel })}>redesign</button>
              </div>
            ) : <p className="empty">Clique numa seção na prévia para selecioná-la.</p>}
            {sel && <TextEdit onApply={(from, to) => act("section", { sectionId: sel, op: "text", from, to })} />}
            <div className="h-label">Tokens visuais</div>
            {Object.entries(tokens).map(([k, v]) => (
              <div className="token-row" key={k}>
                {/^#[0-9a-f]{6}$/i.test(v) ? <input type="color" value={v} onChange={(e) => setTokens({ ...tokens, [k]: e.target.value })} aria-label={k} /> : <span />}
                <span title={k} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{k}</span>
                <input type="text" value={v} onChange={(e) => setTokens({ ...tokens, [k]: e.target.value })} aria-label={`${k} valor`} />
              </div>
            ))}
            {!Object.keys(tokens).length && <p className="empty">Nenhum token encontrado em &lt;style id=&quot;tokens&quot;&gt;.</p>}
            <button className="btn" style={{ marginTop: 10 }} disabled={busy || JSON.stringify(tokens) === JSON.stringify(p.tokens)} onClick={() => act("tokens", { tokens })}>Salvar como nova versão</button>
            <div className="h-label">Exportar v{p.currentVersion}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <a className="btn ghost" href={`/api/projects/${id}/version/${p.currentVersion}?download=static`}>HTML/CSS/JS estático (.zip)</a>
              <a className="btn ghost" href={`/api/projects/${id}/version/${p.currentVersion}?download=next`}>Projeto Next.js (.zip)</a>
              <span className="meta">WordPress/Elementor e publicação com link: ainda não implementados.</span>
            </div>
          </>}
        </div>
      )}
      {tab === "qa" && (
        <div className="panel-body">
          {!cur?.qa ? <p className="empty">Sem inspeção para esta versão. A inspeção roda após cada construção ou refinamento.</p> : <>
            <div className="h-label">Creative Quality Gate · v{cur.n}</div>
            <div className="score">{cur.qa.score}<span style={{ fontSize: 18, color: "var(--mute)" }}>/100</span></div>
            <p style={{ color: "var(--paper-dim)" }}>{cur.qa.report.summary}</p>
            <div className="bars">{Object.entries(cur.qa.report.scores).map(([k, v]) => <div key={k}><span>{k}</span><i style={{ ["--v" as string]: `${v}%` }} /><span>{v}</span></div>)}</div>
            <div className="h-label">Testes objetivos</div>
            <div className="meta" style={{ lineHeight: 1.8 }}>
              {cur.qa.checks.widths.map((w) => <div key={w.width}>{w.width}px — {w.overflowX ? <span style={{ color: "var(--bad)" }}>overflow ({w.scrollWidth}px)</span> : "ok"}</div>)}
              <div>console: {cur.qa.checks.consoleErrors.length} erro(s) · imagens quebradas: {cur.qa.checks.brokenImages.length}</div>
              <div>texto invisível: {cur.qa.checks.invisibleTextBlocks} · reduced-motion: {cur.qa.checks.reducedMotionOk ? "ok" : "falha"} · CLS {cur.qa.checks.cls}</div>
            </div>
            {!!cur.qa.report.genericSignals.length && <><div className="h-label">Sinais genéricos</div><ul style={{ paddingLeft: 18, color: "var(--paper-dim)", margin: 0 }}>{cur.qa.report.genericSignals.map((g, i) => <li key={i}>{g}</li>)}</ul></>}
            <div className="h-label">Problemas</div>
            {cur.qa.report.issues.map((i, k) => <div className="issue" key={k}><span className={`sev ${i.severity}`}>{i.severity}</span><b>{i.sectionId ?? i.area}</b> — {i.problem}<div className="meta" style={{ marginTop: 4 }}>{i.fix}</div></div>)}
            <button className="btn signal" style={{ marginTop: 14 }} disabled={busy} onClick={() => act("refine", { instruction: `Corrija estes problemas do QA visual:\n${cur.qa!.report.issues.map((i) => `- (${i.sectionId ?? i.area}) ${i.problem} → ${i.fix}`).join("\n")}` })}>Aplicar correções do QA</button>
          </>}
        </div>
      )}
      {tab === "versions" && (
        <div className="panel-body">
          {[...p.versions].reverse().map((v) => (
            <div className={`ver ${v.n === p.currentVersion ? "cur" : ""}`} key={v.n}>
              <b>v{v.n}</b>
              <div>{v.reason}<div className="meta">{new Date(v.createdAt).toLocaleString("pt-BR")}{v.qa ? ` · QA ${v.qa.score}` : ""}</div></div>
              {v.n !== p.currentVersion && <button className="icon-btn" disabled={busy} onClick={() => act("restore", { version: v.n })}>restaurar</button>}
            </div>
          ))}
          {!p.versions.length && <p className="empty">Nenhuma versão ainda.</p>}
          {!!p.usage.length && <><div className="h-label">Uso do modelo</div><div className="meta">{p.usage.length} chamadas · {Math.round(p.usage.reduce((a, u) => a + u.ms, 0) / 1000)}s{p.usage.some((u) => u.costUsd) ? ` · US$ ${p.usage.reduce((a, u) => a + (u.costUsd ?? 0), 0).toFixed(2)}` : ""} · {p.model}</div></>}
        </div>
      )}
    </aside>
  );

  return (
    <div className={`studio ${rpOpen ? "" : "rp-collapsed"}`}>
      <div className="center">{toolbar}{center}</div>
      {panel}
    </div>
  );
}

function TextEdit({ onApply }: { onApply: (from: string, to: string) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
      <div className="h-label" style={{ margin: "6px 0 0" }}>Alterar texto (exato)</div>
      <input className="search" style={{ padding: 8, fontSize: 12.5 }} placeholder="Texto atual" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input className="search" style={{ padding: 8, fontSize: 12.5 }} placeholder="Novo texto" value={to} onChange={(e) => setTo(e.target.value)} />
      <button className="icon-btn" disabled={!from || !to} onClick={() => { onApply(from, to); setFrom(""); setTo(""); }}>Substituir</button>
    </div>
  );
}
