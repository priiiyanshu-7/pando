import { useState } from "react";
import { useApp } from "../store.jsx";
import { Logo } from "./Primitives.jsx";
import { credsFor } from "../lib/format.js";
import { supabase, supaEnabled } from "../lib/supabase.js";

export default function Login() {
  const { app, dispatch } = useApp();
  const [busy, setBusy] = useState(null); // member id currently signing in
  const [err, setErr] = useState("");

  // Everyone across all trips, de-duped by name.
  const roster = [];
  const seen = new Set();
  app.trips.forEach((t) => t.members.forEach((m) => { if (!seen.has(m.name)) { seen.add(m.name); roster.push(m); } }));

  const signIn = async (m) => {
    const c = credsFor(m);
    if (!supaEnabled) {
      dispatch({ type: "login", user: { id: m.id, name: m.name, username: c.username } });
      return;
    }
    setBusy(m.id); setErr("");
    const email = `${c.username}@pando.app`;
    let { error } = await supabase.auth.signInWithPassword({ email, password: c.password });
    if (error) {
      const res = await supabase.auth.signUp({ email, password: c.password, options: { data: { name: m.name, username: c.username } } });
      error = res.error;
    }
    setBusy(null);
    if (error) setErr(error.message);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--grad)" }}>
      <div className="card" style={{ width: "100%", maxWidth: 600, padding: 30 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <Logo size={56} radius={16} />
          <div style={{ textAlign: "center" }}>
            <div className="serif" style={{ fontSize: 24, fontWeight: 800 }}>Pando</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Tap your name to sign in</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {roster.map((m) => {
            const initials = m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
            const loading = busy === m.id;
            return (
              <button key={m.id} onClick={() => signIn(m)} disabled={!!busy}
                style={{
                  display: "flex", alignItems: "center", gap: 11, padding: "12px 13px", borderRadius: 14,
                  border: "1.5px solid var(--line)", background: "var(--panel)", textAlign: "left", minWidth: 0,
                  opacity: busy && !loading ? 0.5 : 1, transition: "border-color .15s, box-shadow .15s",
                }}
                onMouseEnter={(e) => { if (!busy) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "var(--shadow)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {loading ? "…" : initials}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 600, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
              </button>
            );
          })}
        </div>

        {err && <div style={{ fontSize: 12, color: "#E0556B", fontWeight: 600, marginTop: 14, textAlign: "center" }}>{err}</div>}
      </div>
    </div>
  );
}
