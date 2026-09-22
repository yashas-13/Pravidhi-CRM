"use client";

import { FormEvent, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Configure Supabase environment variables first.");
      const res = await fetch(SUPABASE_URL + "/auth/v1/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
        body: JSON.stringify({ email, create_user: false })
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage("If this account is registered, a sign-in link/code has been sent.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to start sign-in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="authPage">
      <section className="authCard">
        <p className="eyebrow">PRAVIDH SOLUTIONS</p>
        <h1>Pravidh CRM</h1>
        <p className="muted">Secure sales operations workspace.</p>
        <form onSubmit={signIn}>
          <label>Business email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
          <button disabled={busy}>{busy ? "Sending…" : "Send sign-in link"}</button>
        </form>
        {message && <p className="authMessage">{message}</p>}
      </section>
    </main>
  );
}