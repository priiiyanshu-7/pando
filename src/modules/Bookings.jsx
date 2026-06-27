import { useState } from "react";
import { Plane, Hotel, Car, Compass, Plus, Trash2, Check } from "lucide-react";
import { useStore } from "../store.jsx";
import { Intro, Modal, Field } from "../components/Primitives.jsx";
import { inr } from "../lib/format.js";
import { STATUS_CYCLE, BOOKED } from "../data/trip.js";

const TYPES = ["Flight", "Hotel", "Transit", "Activity"];
const bIcon = (t) => (t === "Flight" ? Plane : t === "Hotel" ? Hotel : t === "Transit" ? Car : Compass);
const sColor = (s) => (s === "Cancelled" ? "var(--dim)" : s === "Planned" ? "var(--warn)" : "var(--ready)");

const BLANK_BOOKING = { _new: true, type: "Hotel", title: "", date: "", cost: 0, status: "Planned", nights: 1, essential: false };

export default function Bookings() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(null);
  // Only confirmed bookings have a real cost — planned prices stay dynamic until booked.
  const total = state.bookings.filter((b) => BOOKED.includes(b.status)).reduce((s, b) => s + (Number(b.cost) || 0), 0);

  return (
    <div>
      <Intro
        kicker="Every reservation, one place"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div className="serif tnum" style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{inr(total)}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>booked · {state.bookings.length} reservations</div>
            </div>
            <button className="btn dark sm" onClick={() => setEditing(BLANK_BOOKING)}><Plus size={14} /> Add reservation</button>
          </div>
        }
      >
        Tap a status to advance it. Flights and beds feed readiness.
      </Intro>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {state.bookings.map((b, i) => {
          const Icon = bIcon(b.type);
          return (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < state.bookings.length - 1 ? "1px solid var(--lineSoft)" : "none" }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 }}><Icon size={16} /></span>
              <button onClick={() => setEditing(b)} style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.type} · {b.date}{b.essential && " · essential"}</div>
              </button>
              <div className="tnum" style={{ fontSize: 13.5, color: BOOKED.includes(b.status) ? "var(--muted)" : "var(--faint)", marginRight: 4, minWidth: 52, textAlign: "right" }}>
                {BOOKED.includes(b.status) ? inr(b.cost) : "TBC"}
              </div>
              <button onClick={() => dispatch({ type: "cycleBooking", id: b.id })} className="pill"
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 11px", minWidth: 96, justifyContent: "center", fontWeight: 600, fontSize: 12, border: `1px solid ${sColor(b.status)}33`, background: `${sColor(b.status)}12`, color: sColor(b.status) }}>
                <span className="dot" style={{ background: sColor(b.status) }} />{b.status}
              </button>
              <button className="iconbtn warn" title="Remove" onClick={() => dispatch({ type: "remove", coll: "bookings", id: b.id })}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>

      {editing && <BookingEditor editing={editing} dispatch={dispatch} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BookingEditor({ editing, dispatch, onClose }) {
  const [f, setF] = useState({ ...editing });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.title.trim().length > 0;

  const save = () => {
    if (!valid) return;
    const fields = {
      type: f.type, title: f.title.trim(), date: f.date.trim(), cost: Number(f.cost) || 0,
      status: f.status, nights: Number(f.nights) || 0, essential: !!f.essential,
      outbound: f.type === "Flight" && !!f.essential ? f.outbound : f.outbound,
    };
    if (editing._new) dispatch({ type: "add", coll: "bookings", item: fields });
    else dispatch({ type: "patch", coll: "bookings", id: editing.id, fields });
    onClose();
  };

  return (
    <Modal
      title={editing._new ? "New reservation" : "Edit reservation"}
      onClose={onClose}
      footer={
        <>
          {!editing._new && <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "bookings", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>}
          <button className="btn ghost sm" onClick={onClose}>Cancel</button>
          <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
        </>
      }
    >
      <Field label="What is it?" placeholder="e.g. Hanoi · La Sinfonia del Rey" value={f.title} onChange={set("title")} autoFocus />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field as="select" label="Type" value={f.type} onChange={set("type")}>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Field>
        <Field as="select" label="Status" value={f.status} onChange={set("status")}>
          {STATUS_CYCLE.map((s) => <option key={s} value={s}>{s}</option>)}
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label="Dates" placeholder="2–5 Oct" value={f.date} onChange={set("date")} />
        <Field label="Cost (₹)" type="number" min="0" value={f.cost} onChange={set("cost")} />
        {f.type === "Hotel" ? <Field label="Nights" type="number" min="0" value={f.nights} onChange={set("nights")} /> : <div />}
      </div>
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Toggle label="Essential (counts toward Readiness)" checked={!!f.essential} onChange={(v) => setF({ ...f, essential: v })} />
        {f.type === "Flight" && <Toggle label="Outbound leg" checked={!!f.outbound} onChange={(v) => setF({ ...f, outbound: v })} />}
      </div>
    </Modal>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13 }}>
      <span className={"cbox" + (checked ? " on" : "")} style={{ width: 18, height: 18 }}>{checked && <Check size={11} color="#fff" strokeWidth={3} />}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ display: "none" }} />
      {label}
    </label>
  );
}
