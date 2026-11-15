"use client";
import { useEffect, useMemo, useState } from "react";
import type { Pattern } from "../lib/library/patterns";

const doc = (html: string) => `<!doctype html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>${html}</body></html>`;

function Comp({ p }: { p: Pattern }) {
  const [vw, setVw] = useState<"d" | "m">("d");
  const [code, setCode] = useState(p.demo);
  const [live, setLive] = useState(p.demo);
  useEffect(() => { const t = setTimeout(() => setLive(code), 400); return () => clearTimeout(t); }, [code]);
  return (
    <article className="comp">
      <div className="comp-head">
        <div><div className="meta">{p.category} · {p.id}</div><h3>{p.name}</h3></div>
        <div className="seg"><button className={vw === "d" ? "on" : ""} onClick={() => setVw("d")}>Desktop</button><button className={vw === "m" ? "on" : ""} onClick={() => setVw("m")}>Mobile</button></div>
      </div>
      <div className="frame"><iframe title={p.name} sandbox="allow-scripts" srcDoc={doc(live)} style={{ width: vw === "d" ? "100%" : 375 }} /></div>
      <details><summary>Técnica e uso</summary>
        <p>{p.technique}</p>
        <p><b>Combina com:</b> {p.fits.join(", ")}<br /><b>Evitar quando:</b> {p.avoidWhen}<br /><b>Intenções:</b> {p.intents.join(" · ")}<br /><b>Origem:</b> {p.inspiration}</p>
      </details>
      <details><summary>Código editável</summary><textarea spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} aria-label={`Código de ${p.name}`} /></details>
    </article>
  );
}

export default function Library() {
  const [all, setAll] = useState<Pattern[]>([]);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Pattern[] | null>(null);
  const [cat, setCat] = useState("");
  useEffect(() => { fetch("/api/library").then((r) => r.json()).then(setAll); }, []);
  useEffect(() => {
    if (!q.trim()) { setHits(null); return; }
    const t = setTimeout(() => fetch(`/api/library?q=${encodeURIComponent(q)}`).then((r) => r.json()).then(setHits), 250);
    return () => clearTimeout(t);
  }, [q]);
  const cats = useMemo(() => Array.from(new Set(all.map((p) => p.category))), [all]);
  const list = (hits ?? all).filter((p) => !cat || p.category === cat);
  return (
    <main className="lib">
      <header className="lib-head">
        <div><div className="kicker">Creative Intelligence Library</div><h1>Vocabulário, não templates.</h1></div>
        <div>
          <p style={{ marginBottom: 12 }}>Técnicas originais e funcionais que os agentes consultam e transformam a cada projeto. Busque por intenção visual.</p>
          <input className="search" placeholder="ex.: hero cinematográfico, card com acabamento metálico…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar por intenção" />
        </div>
      </header>
      <div className="cats chips">
        <button className={!cat ? "on" : ""} onClick={() => setCat("")} style={!cat ? { color: "var(--paper)", borderColor: "var(--signal)" } : {}}>todas ({(hits ?? all).length})</button>
        {cats.map((c) => <button key={c} onClick={() => setCat(c)} style={cat === c ? { color: "var(--paper)", borderColor: "var(--signal)" } : {}}>{c}</button>)}
      </div>
      <div className="lib-grid">{list.map((p) => <Comp key={p.id} p={p} />)}{!list.length && <p className="empty">Nada encontrado para essa intenção.</p>}</div>
    </main>
  );
}
