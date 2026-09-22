"use client";

import { useEffect, useState } from "react";

type Lead = {
  lead_id: string;
  company_name: string;
  website?: string;
  industry?: string;
  location?: string;
  contact_name?: string;
  email?: string;
  score: number;
  status: string;
  trigger?: string;
  service_fit?: string;
  next_follow_up_at?: string;
};

const API = process.env.NEXT_PUBLIC_CRM_API_URL ?? "";

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    if (!API) {
      setError("Configure NEXT_PUBLIC_CRM_API_URL and authentication before using the dashboard.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API + "/hot-leads", { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const body = await res.json();
      setLeads(body.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load CRM data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main>
      <aside>
        <div className="brand">PRAVIDH <span>CRM</span></div>
        <nav><a className="active">Dashboard</a><a>Leads</a><a>Pipeline</a><a>Activities</a><a>Follow-ups</a></nav>
      </aside>
      <section className="content">
        <header><div><p className="eyebrow">SALES OPERATIONS</p><h1>Command Center</h1><p className="muted">Turn qualified prospects into conversations and customers.</p></div><button onClick={load}>↻ Refresh</button></header>
        <div className="stats">
          <div><small>HOT LEADS</small><strong>{leads.length}</strong><span>Score ≥ 70</span></div>
          <div><small>PIPELINE</small><strong>—</strong><span>Connect API</span></div>
          <div><small>FOLLOW-UPS</small><strong>—</strong><span>Due today</span></div>
          <div><small>OPEN DEALS</small><strong>—</strong><span>Live CRM</span></div>
        </div>
        <div className="panel">
          <div className="panelHead"><div><h2>Priority leads</h2><p>High-intent prospects requiring sales action.</p></div></div>
          {loading && <div className="empty">Loading CRM…</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && leads.length === 0 && <div className="empty">No hot leads yet.</div>}
          {!loading && !error && leads.length > 0 && <div className="tableWrap"><table><thead><tr><th>Company</th><th>Contact</th><th>Trigger</th><th>Service fit</th><th>Score</th><th>Status</th></tr></thead><tbody>{leads.map(l => <tr key={l.lead_id}><td><b>{l.company_name}</b><small>{l.industry ?? "—"} · {l.location ?? "—"}</small></td><td>{l.contact_name ?? "—"}<small>{l.email ?? "—"}</small></td><td>{l.trigger ?? "—"}</td><td>{l.service_fit ?? "—"}</td><td><strong className="score">{l.score}</strong></td><td><span className="pill">{l.status}</span></td></tr>)}</tbody></table></div>}
        </div>
      </section>
    </main>
  );
}