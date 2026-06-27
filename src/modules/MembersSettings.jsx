import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useStore } from "../store.jsx";
import { Intro, Modal, Field } from "../components/Primitives.jsx";
import { settlement, inr, credsFor } from "../lib/format.js";
import { DESTINATIONS } from "../data/trip.js";

const initials = (name) => name.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

export function Members() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(null);
  const set = settlement(state);
  return (
    <div>
      <Intro kicker="Travellers"
        right={<button className="btn dark sm" onClick={() => setEditing({ _new: true, name: "" })}><Plus size={14} /> Add traveller</button>}>
        Everyone on the trip — owners and payers.
      </Intro>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {state.members.map((m, i) => {
          const bal = set.balances[m.id] || 0;
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 18px", borderBottom: i < state.members.length - 1 ? "1px solid var(--lineSoft)" : "none" }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14 }}>{m.initials}</span>
              <button onClick={() => setEditing(m)} style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}{m.you && <span style={{ color: "var(--faint)", fontWeight: 400 }}> · you</span>}</div>
                <div className="tnum" style={{ fontSize: 11.5, color: "var(--muted)" }}>login: {credsFor(m).username} · {credsFor(m).password}</div>
              </button>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: bal > 1 ? "var(--ready)" : bal < -1 ? "var(--warn)" : "var(--muted)" }}>
                {bal > 1 ? `is owed ${inr(bal)}` : bal < -1 ? `owes ${inr(-bal)}` : "settled"}
              </span>
              {!m.you && <button className="iconbtn warn" title="Remove" onClick={() => dispatch({ type: "remove", coll: "members", id: m.id })}><Trash2 size={14} /></button>}
            </div>
          );
        })}
      </div>
      {editing && <MemberEditor editing={editing} dispatch={dispatch} onClose={() => setEditing(null)} />}
    </div>
  );
}

function MemberEditor({ editing, dispatch, onClose }) {
  const [name, setName] = useState(editing.name);
  const valid = name.trim().length > 0;
  const save = () => {
    if (!valid) return;
    const fields = { name: name.trim(), initials: initials(name) };
    if (editing._new) dispatch({ type: "add", coll: "members", item: fields });
    else dispatch({ type: "patch", coll: "members", id: editing.id, fields });
    onClose();
  };
  return (
    <Modal title={editing._new ? "Add traveller" : "Edit traveller"} onClose={onClose}
      footer={<>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      <Field label="Name" placeholder="e.g. Priya" value={name} onChange={(e) => setName(e.target.value)} autoFocus
        onKeyDown={(e) => e.key === "Enter" && save()} />
    </Modal>
  );
}

export function Settings() {
  const { state, dispatch } = useStore();
  const t = state.trip;
  const patch = (fields) => dispatch({ type: "editTrip", fields });

  const onDates = (key) => (e) => {
    const next = { ...t, [key]: e.target.value };
    const nights = Math.max(0, Math.round((new Date(next.end) - new Date(next.start)) / 86400000));
    patch({ [key]: e.target.value, nights: Number.isFinite(nights) ? nights : t.nights });
  };

  return (
    <div>
      <Intro kicker="Settings">Name, destination, dates — saved automatically.</Intro>

      <div className="card" style={{ display: "grid", gap: 16, marginBottom: 18 }}>
        <Field label="Trip name" value={t.name} onChange={(e) => patch({ name: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field as="select" label="Destination" value={t.destinationKey} onChange={(e) => patch({ destinationKey: e.target.value })}>
            {Object.entries(DESTINATIONS).map(([k, d]) => <option key={k} value={k}>{d.flag} {d.label}</option>)}
          </Field>
          <Field label="Cities (· separated)" value={t.cities} onChange={(e) => patch({ cities: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Start" type="date" value={t.start} onChange={onDates("start")} />
          <Field label="End" type="date" value={t.end} onChange={onDates("end")} />
          <Field label="Nights" type="number" min="0" value={t.nights} onChange={(e) => patch({ nights: Number(e.target.value) || 0 })} hint={`${t.nights} nights to cover`} />
        </div>
        <Field label="Planning window (days)" type="number" min="1" value={t.planningWindowDays} onChange={(e) => patch({ planningWindowDays: Number(e.target.value) || 1 })} hint="Comfortable lead-time target for Readiness" />
      </div>

      <div className="card" style={{ padding: "4px 20px", marginBottom: 18 }}>
        {[["Travellers", `${state.members.length} on this trip`], ["Total spent", inr(state.expenses.reduce((s, e) => s + e.amount, 0))]].map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: i === 0 ? "1px solid var(--lineSoft)" : "none" }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{k}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>

      <button className="btn danger sm" onClick={() => { if (confirm(`Delete “${t.name}”? This can't be undone.`)) dispatch({ type: "deleteTrip", id: state.id }); }}>
        <Trash2 size={14} /> Delete this trip
      </button>
    </div>
  );
}
