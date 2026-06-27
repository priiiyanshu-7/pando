import { useState } from "react";
import { LogIn, ChevronDown } from "lucide-react";
import { useApp } from "../store.jsx";
import { Logo, Field } from "./Primitives.jsx";
import { credsFor } from "../lib/format.js";
import { supabase, supaEnabled } from "../lib/supabase.js";

export default function Login() {
  const { app, dispatch } = useApp();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  // The roster to authenticate against — everyone across all trips, de-duped by name.
  const roster = [];
  const seen = new Set();
  app.trips.forEach((t) => t.members.forEach((m) => { if (!seen.has(m.name)) { seen.add(m.name); roster.push(m); } }));

  const submit = async () => {
    const user = u.trim().toLowerCase();
    const match = roster.find((m) => { const c = credsFor(m); return c.username === user && c.password === p.trim(); });
    if (!match) { setErr("Wrong username or password"); return; }
    const c = credsFor(match);

    if (!supaEnabled) {
      dispatch({ type: "login", user: { id: match.id, name: match.name, username: c.username } });
      return;
    }
    // Real auth: sign in, or create the account on first use (the store flips the route).
    setBusy(true); setErr("");
    const email = `${c.username}@pando.app`;
    let { error } = await supabase.auth.signInWithPassword({ email, password: p.trim() });
    if (error) {
      const res = await supabase.auth.signUp({ email, password: p.trim(), options: { data: { name: match.name, username: c.username } } });
      error = res.error;
    }
    setBusy(false);
    if (error) setErr(error.message);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--grad)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 380, padding: 28 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <Logo size={56} radius={16} />
          <div style={{ textAlign: "center" }}>
            <div className="serif" style={{ fontSize: 24, fontWeight: 800 }}>Pando</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Sign in to your trip</div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <Field label="Username" placeholder="firstname.lastname" value={u} autoFocus
            onChange={(e) => { setU(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <Field label="Password" type="password" placeholder="••••••" value={p}
            onChange={(e) => { setP(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && submit()} />
          {err && <div style={{ fontSize: 12, color: "#E0556B", fontWeight: 600 }}>{err}</div>}
          <button className="btn dark" style={{ justifyContent: "center", marginTop: 4, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}><LogIn size={15} /> {busy ? "Signing in…" : "Sign in"}</button>
        </div>

        <button onClick={() => setShowAccounts((v) => !v)} style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 5, width: "100%", justifyContent: "center" }}>
          Group accounts <ChevronDown size={13} style={{ transform: showAccounts ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </button>
        {showAccounts && (
          <div style={{ marginTop: 10, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
            {roster.map((m) => {
              const c = credsFor(m);
              return (
                <button key={m.id} onClick={() => { setU(c.username); setP(c.password); setErr(""); }}
                  style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "9px 12px", fontSize: 12, borderBottom: "1px solid var(--lineSoft)", textAlign: "left" }}>
                  <span style={{ fontWeight: 600 }}>{m.name}</span>
                  <span className="tnum" style={{ color: "var(--muted)" }}>{c.username} · {c.password}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
