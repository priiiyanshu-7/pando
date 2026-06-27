import { useState } from "react";
import { Plus, Check, MapPin, ArrowRight, LogOut } from "lucide-react";
import { useApp } from "../store.jsx";
import { Ring, Modal, Field, Logo } from "./Primitives.jsx";
import { computeReadiness, daysUntil } from "../engine/readiness.js";
import { DESTINATIONS } from "../data/trip.js";

const fmt = (d) => { const x = new Date(d); return Number.isNaN(+x) ? "" : x.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

export default function Home() {
  const { app, dispatch } = useApp();
  const [creating, setCreating] = useState(false);

  return (
    <div style={{ minHeight: "100vh", padding: "clamp(28px, 6vw, 64px)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={40} radius={12} />
          <span className="serif" style={{ fontSize: 30, fontWeight: 800 }}>Pando</span>
          <span style={{ fontSize: 13, color: "var(--faint)" }} className="hide-sm">every trip is a project</span>
        </div>
        {app.auth && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>
              {app.auth.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }} className="hide-sm">{app.auth.name}</span>
            <button className="btn ghost sm" onClick={() => dispatch({ type: "logout" })}><LogOut size={14} /> Sign out</button>
          </div>
        )}
      </div>
      <h1 className="serif" style={{ fontSize: "clamp(34px, 6vw, 52px)", fontWeight: 800, letterSpacing: "-.03em", margin: "10px 0 30px" }}>Your trips</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {app.trips.map((t) => {
          const dest = DESTINATIONS[t.trip.destinationKey] || {};
          const R = computeReadiness(t);
          const out = daysUntil(t.trip.start);
          return (
            <button key={t.id} onClick={() => dispatch({ type: "openTrip", id: t.id })}
              className="card" style={{ textAlign: "left", padding: 0, overflow: "hidden", cursor: "pointer", transition: "transform .15s, box-shadow .15s", display: "flex", flexDirection: "column" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
              <div style={{ height: 96, background: "var(--grad)", position: "relative", display: "flex", alignItems: "flex-end", padding: 16 }}>
                <span style={{ fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.25))" }}>{dest.flag || "🧳"}</span>
                <div style={{ position: "absolute", top: 14, right: 14 }}>
                  <div style={{ background: "rgba(255,255,255,.9)", borderRadius: 999, padding: 3 }}><Ring size={40} stroke={4} pct={R.score} mini /></div>
                </div>
              </div>
              <div style={{ padding: "16px 18px", flex: 1 }}>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700 }}>{t.trip.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={12} />{t.trip.cities || dest.label || "—"}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{fmt(t.trip.start)} → {fmt(t.trip.end)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {out > 0 ? `${out}d out` : "now"} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        <button onClick={() => setCreating(true)} className="add-row" style={{ minHeight: 230, borderRadius: 20, flexDirection: "column", gap: 12, justifyContent: "center" }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Plus size={22} /></span>
          New trip
        </button>
      </div>

      {creating && <NewTrip dispatch={dispatch} onClose={() => setCreating(false)} />}
    </div>
  );
}

function NewTrip({ dispatch, onClose }) {
  const [f, setF] = useState({ name: "", destinationKey: "goa", cities: "", start: "", end: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.start && f.end && new Date(f.end) >= new Date(f.start);
  const create = () => {
    if (!valid) return;
    dispatch({ type: "newTrip", trip: { ...f, name: f.name.trim() } });
    onClose();
  };
  return (
    <Modal title="New trip" onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={create} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Create</button>
      </>}>
      <Field label="Trip name" placeholder="e.g. Goa with the crew" value={f.name} onChange={set("name")} autoFocus />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field as="select" label="Destination" value={f.destinationKey} onChange={set("destinationKey")}>
          {Object.entries(DESTINATIONS).map(([k, d]) => <option key={k} value={k}>{d.flag} {d.label}</option>)}
        </Field>
        <Field label="Cities (· separated)" placeholder="Panaji · Anjuna" value={f.cities} onChange={set("cities")} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Start" type="date" value={f.start} onChange={set("start")} />
        <Field label="End" type="date" value={f.end} onChange={set("end")} />
      </div>
    </Modal>
  );
}
