"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Row = { id: string; name: string; status: string; updatedAt: string; source: { kind: string }; currentVersion?: number };
const RUN = ["analyzing", "directing", "building", "refining"];

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<"url" | "pdf" | "brief">("url");
  const [url, setUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const inp = useRef<HTMLInputElement>(null);
  useEffect(() => { fetch("/api/projects").then((r) => r.json()).then(setRows).catch(() => {}); }, []);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErr(""); setBusy(true);
    const fd = new FormData();
    if (tab === "url") fd.set("url", url);
    if (tab === "pdf" && file) fd.set("pdf", file);
    if (tab === "brief") fd.set("brief", brief);
    const r = await fetch("/api/projects", { method: "POST", body: fd });
    const j = await r.json();
    if (!r.ok) { setErr(j.error); setBusy(false); return; }
    router.push(`/p/${j.id}`);
  }
  const ready = (tab === "url" && url.trim()) || (tab === "pdf" && file) || (tab === "brief" && brief.trim().length > 20);

  return (
    <main className="home">
      <div className="home-inner">
        <div className="kicker">AI Creative Page Studio</div>
        <h1>Sua próxima página não precisa parecer com <em>nenhuma outra.</em></h1>
        <p className="lede">Envie uma página existente. Nossa IA entende a oferta, redefine a direção criativa e constrói uma nova experiência digital — e depois inspeciona o próprio trabalho até ele merecer ser entregue.</p>

        <form className="composer" onSubmit={submit}>
          <div className="tabs" role="tablist">
            {([["url", "URL"], ["pdf", "PDF"], ["brief", "Do zero"]] as const).map(([k, l]) => (
              <button type="button" role="tab" aria-selected={tab === k} key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
          <div className="composer-body">
            {tab === "url" && <input className="url-input" type="url" placeholder="https://suapagina.com.br/oferta" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="URL da página" />}
            {tab === "pdf" && (
              <div className={`drop ${over ? "over" : ""}`} onClick={() => inp.current?.click()} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}>
                <input ref={inp} type="file" accept="application/pdf" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                {file ? <><b>{file.name}</b> · {(file.size / 1e6).toFixed(1)} MB</> : <>Arraste o PDF da página aqui ou clique para escolher · até 20 MB</>}
              </div>
            )}
            {tab === "brief" && <textarea className="url-input" placeholder="Marca, produto, público, preço, provas reais, links de checkout… Quanto mais fatos, menos suposições." value={brief} onChange={(e) => setBrief(e.target.value)} />}
            <button className="go" disabled={!ready || busy}>{busy ? "Enviando…" : "Criar projeto"}<svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 6h16M11 1l5 5-5 5" /></svg></button>
          </div>
          {err && <div className="err" role="alert">{err}</div>}
        </form>

        <div className="pipeline-strip" aria-label="Etapas">
          {["Extração real", "Inteligência da oferta", "3 direções de arte", "Construção", "QA visual nas capturas", "Refino e exportação"].map((t, i) => (
            <div key={t}><b>0{i + 1}</b><span>{t}</span></div>
          ))}
        </div>

        <section className="proj-list" id="projetos">
          <h2>Projetos</h2>
          {!rows.length && <p className="empty">Nenhum projeto ainda.</p>}
          {rows.map((r) => (
            <Link key={r.id} href={`/p/${r.id}`} className="proj-row">
              <span className="pn">{r.name}</span>
              <span className="meta">{r.source.kind.toUpperCase()}{r.currentVersion ? ` · v${r.currentVersion}` : ""}</span>
              <span className={`pill ${r.status === "ready" ? "ready" : r.status === "error" ? "error" : RUN.includes(r.status) ? "run" : ""}`}>{r.status}</span>
              <span className="meta">{new Date(r.updatedAt).toLocaleString("pt-BR")}</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
