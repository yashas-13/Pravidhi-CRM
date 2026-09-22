"use client";

import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
          emailRedirectTo: window.location.origin + "/auth/callback"
        }
      });
      if (error) throw error;
      setMessage("If this account is registered, a secure sign-in link has been sent.");
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
          <label htmlFor="email">Business email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" required />
          <button disabled={busy}>{busy ? "Sending…" : "Send sign-in link"}</button>
        </form>
        {message && <p className="authMessage">{message}</p>}
        <p className="muted authHint">Only registered CRM team members can access the workspace.</p>
      </section>
    </main>
  );
}