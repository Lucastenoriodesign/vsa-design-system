"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Row = { id: string; name: string; status: string };
const I = {
  plus: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M8 2v12M2 8h12" /></svg>,
  grid: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2" y="2" width="5" height="5" /><rect x="9" y="2" width="5" height="5" /><rect x="2" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></svg>,
  book: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M3 2.5h7a3 3 0 0 1 3 3v8H6a3 3 0 0 1-3-3z" /><path d="M6 5.5h4" /></svg>,
  side: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><rect x="2" y="2.5" width="12" height="11" /><path d="M6 2.5v11" /></svg>,
};

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [prov, setProv] = useState("");
  useEffect(() => {
    try { setCollapsed(localStorage.getItem("sb") === "1"); } catch {}
    fetch("/api/projects").then((r) => r.json()).then(setRows).catch(() => {});
    fetch("/api/library?info=1").then((r) => r.json()).then((j) => setProv(`${j.provider} · ${j.model}`)).catch(() => {});
  }, [path]);
  const toggle = () => { setCollapsed((c) => { try { localStorage.setItem("sb", c ? "0" : "1"); } catch {} return !c; }); };
  return (
    <div className={`shell ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <Link href="/" className="brand"><span className="brand-mark" /><div><b>Page Studio</b><i>creative direction</i></div></Link>
        <Link href="/" className={`nav-item ${path === "/" ? "on" : ""}`}>{I.plus}<span>Novo projeto</span></Link>
        <Link href="/#projetos" className="nav-item">{I.grid}<span>Projetos</span></Link>
        <Link href="/library" className={`nav-item ${path.startsWith("/library") ? "on" : ""}`}>{I.book}<span>Creative Library</span></Link>
        <div className="nav-label">Histórico</div>
        <div className="recent">{rows.slice(0, 14).map((r) => <Link key={r.id} href={`/p/${r.id}`}>{r.name}</Link>)}</div>
        <div className="grow" />
        <button className="nav-item" onClick={toggle} aria-label="Recolher barra lateral">{I.side}<span>Recolher</span></button>
        <div className="provider" title="Modelo configurado">{prov}</div>
      </aside>
      {children}
    </div>
  );
}
