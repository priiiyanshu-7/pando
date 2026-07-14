import { useState } from "react";
import {
  Plus, Clock, MapPin, Trash2, Check, ArrowRight, Map as MapIcon, List,
  Landmark, Utensils, Building2, Mountain, Waves, ShoppingBag, Wine, BedDouble, Car,
  Plane, TrainFront, Bus, Bike, Ship, Footprints,
} from "lucide-react";
import { useStore } from "../store.jsx";
import { Modal, Field } from "../components/Primitives.jsx";
import TripMap from "../components/TripMap.jsx";
import { PLACE_CATEGORIES, PLACE_CATEGORY_KEYS, TRANSFER_MODE_KEYS } from "../data/trip.js";
import { inr } from "../lib/format.js";

const CAT_ICONS = { Landmark, Utensils, Building2, Mountain, Waves, ShoppingBag, Wine, BedDouble, Car };
const MODE_ICONS = { Plane, TrainFront, Bus, Car, Taxi: Car, Scooter: Bike, Ferry: Ship, Walk: Footprints };
const catIcon = (c) => CAT_ICONS[PLACE_CATEGORIES[c]?.icon] || Landmark;
const catTone = (c) => PLACE_CATEGORIES[c]?.tone || "var(--muted)";
const modeIcon = (m) => MODE_ICONS[m] || Car;
const byTime = (a, b) => (a.time || "99").localeCompare(b.time || "99");

export default function Itinerary() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState("timeline");
  const MONTH = (() => { const d = new Date(state.trip.start); return Number.isNaN(+d) ? "" : d.toLocaleString("en-US", { month: "short" }); })();

  const places = state.places || [];
  const scheduled = places.filter((p) => p.dayD != null);
  const cost = places.reduce((s, p) => s + (Number(p.cost) || 0), 0);
  const placeCount = places.filter((p) => p.type !== "transfer").length;
  const firstDay = state.days[0]?.d ?? null;

  const openPlace = (dayD) => setEditing({ _new: true, type: "place", name: "", category: "Sight", dayD: dayD ?? firstDay, time: "", area: "", cost: 0, notes: "", booked: false, lat: null, lng: null });
  const openTransfer = (dayD) => setEditing({ _new: true, type: "transfer", mode: "Taxi", from: "", to: "", dayD: dayD ?? firstDay, time: "", cost: 0, notes: "" });

  return (
    <div>
      {/* one compact toolbar: view switch on the left, actions on the right */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div className="seg viewseg">
          <button className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}><List size={14} style={{ verticalAlign: "middle", marginRight: 5 }} />Timeline</button>
          <button className={view === "map" ? "on" : ""} onClick={() => setView("map")}><MapIcon size={14} style={{ verticalAlign: "middle", marginRight: 5 }} />Map</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{placeCount} places · {inr(cost)}</span>
          <button className="btn ghost sm" onClick={() => openTransfer()}><Plus size={13} /> Transfer</button>
          <button className="btn dark sm" onClick={() => openPlace()}><Plus size={14} /> Add place</button>
        </div>
      </div>

      {view === "map" ? (
        <TripMap places={places} days={state.days} />
      ) : (
        <>
          {/* DAY-BY-DAY */}
          <div style={{ display: "grid", gap: 14 }}>
            {state.days.map((day) => {
              const items = scheduled.filter((p) => p.dayD === day.d).sort(byTime);
              return (
                <div key={day.d} className="card" style={{ padding: 0, overflow: "hidden", display: "flex" }}>
                  <div style={{ width: 5, background: day.tone, flexShrink: 0 }} />
                  <div style={{ flex: 1, padding: "16px 18px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: items.length ? 12 : 4 }}>
                      <div className="serif tnum" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1, color: day.tone }}>{day.d}<span style={{ fontSize: 12, color: "var(--faint)", fontWeight: 400 }}> {MONTH}</span></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{day.label}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{day.city}</div>
                      </div>
                      <button className="iconbtn warn" title="Add a transfer" onClick={() => openTransfer(day.d)}><Car size={16} /></button>
                      <button className="iconbtn warn" title="Add a place" onClick={() => openPlace(day.d)}><Plus size={17} /></button>
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {items.map((p) => <Item key={p.id} p={p} days={state.days} month={MONTH} onEdit={() => setEditing(p)} dispatch={dispatch} />)}
                      {items.length === 0 && (
                        <button onClick={() => openPlace(day.d)} className="serif" style={{ textAlign: "left", fontSize: 12.5, color: "var(--faint)", fontStyle: "italic", padding: "2px 0" }}>Nothing planned — add a place.</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {editing && <ItemEditor editing={editing} days={state.days} month={MONTH} dispatch={dispatch} onClose={() => setEditing(null)} />}
    </div>
  );
}

function Item({ p, compact, days, month, onEdit, dispatch }) {
  return p.type === "transfer"
    ? <TransferCard p={p} days={days} month={month} onEdit={onEdit} dispatch={dispatch} />
    : <PlaceCard p={p} compact={compact} days={days} month={month} onEdit={onEdit} dispatch={dispatch} />;
}

function MoveControls({ p, days, month, dispatch }) {
  return (
    <div style={{ display: "flex", gap: 2, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
      <select value={p.dayD ?? ""} onChange={(e) => dispatch({ type: "movePlace", id: p.id, dayD: e.target.value === "" ? null : Number(e.target.value) })}
        title="Move to day" style={{ fontSize: 11, border: "1px solid var(--line)", borderRadius: 7, background: "var(--panel)", color: "var(--muted)", padding: "3px 4px", cursor: "pointer", maxWidth: 64 }}>
        {days.map((d) => <option key={d.d} value={d.d}>{d.d} {month}</option>)}
      </select>
      <button className="iconbtn warn" title="Remove" onClick={() => dispatch({ type: "remove", coll: "places", id: p.id })}><Trash2 size={14} /></button>
    </div>
  );
}

function PlaceCard({ p, compact, days, month, onEdit, dispatch }) {
  const Icon = catIcon(p.category);
  const tone = catTone(p.category);
  return (
    <div onClick={onEdit} style={{ display: "flex", gap: 11, padding: "10px 12px", borderRadius: 11, cursor: "pointer", border: "1px solid var(--line)", background: "var(--panel)", alignItems: "flex-start", width: compact ? 248 : "auto", transition: "border-color .15s, box-shadow .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = tone + "66"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.boxShadow = "none"; }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, display: "grid", placeItems: "center", flexShrink: 0, background: tone + "18", color: tone }}><Icon size={16} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
          {p.area && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={11} />{p.area}</span>}
          <span style={{ color: tone, fontWeight: 600 }}>{p.category}</span>
          {Number(p.cost) > 0 && <span className="tnum">{inr(p.cost)}</span>}
        </div>
        {p.notes && !compact && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.4 }}>{p.notes}</div>}
      </div>
      <MoveControls p={p} days={days} month={month} dispatch={dispatch} />
    </div>
  );
}

function TransferCard({ p, days, month, onEdit, dispatch }) {
  const Icon = modeIcon(p.mode);
  return (
    <div onClick={onEdit} style={{ display: "flex", gap: 11, padding: "9px 12px", borderRadius: 11, cursor: "pointer", border: "1px dashed var(--line)", background: "var(--paper)", alignItems: "center" }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, display: "grid", placeItems: "center", flexShrink: 0, background: "var(--lineSoft)", color: "var(--muted)" }}><Icon size={15} /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span>{p.from || "—"}</span><ArrowRight size={12} color="var(--faint)" /><span>{p.to || "—"}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 10px", fontSize: 11.5, color: "var(--muted)", marginTop: 1 }}>
          <span style={{ fontWeight: 600 }}>{p.mode}</span>
          {p.time && (p.mode === "Flight" || p.mode === "Train") && <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} />{p.time}</span>}
          {Number(p.cost) > 0 && <span className="tnum">{inr(p.cost)}</span>}
          {p.notes && <span style={{ color: "var(--faint)" }}>{p.notes}</span>}
        </div>
      </div>
      <MoveControls p={p} days={days} month={month} dispatch={dispatch} />
    </div>
  );
}

function ItemEditor({ editing, days, month, dispatch, onClose }) {
  const [f, setF] = useState({ ...editing });
  const isTransfer = f.type === "transfer";
  // Time only matters for fixed departures — flights and trains.
  const showTime = isTransfer && (f.mode === "Flight" || f.mode === "Train");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = isTransfer ? (f.from.trim() || f.to.trim()) : f.name.trim().length > 0;

  const save = () => {
    if (!valid) return;
    const dayD = f.dayD === "" || f.dayD == null ? null : Number(f.dayD);
    const fields = isTransfer
      ? { type: "transfer", mode: f.mode, from: f.from.trim(), to: f.to.trim(), dayD, time: f.time, cost: Number(f.cost) || 0, notes: (f.notes || "").trim() }
      : { type: "place", name: f.name.trim(), category: f.category, dayD, time: f.time, area: (f.area || "").trim(), cost: Number(f.cost) || 0, notes: (f.notes || "").trim(), booked: !!f.booked, lat: Number.isFinite(f.lat) ? f.lat : null, lng: Number.isFinite(f.lng) ? f.lng : null };
    if (editing._new) dispatch({ type: "add", coll: "places", item: fields });
    else dispatch({ type: "patch", coll: "places", id: editing.id, fields });
    onClose();
  };

  return (
    <Modal title={editing._new ? (isTransfer ? "New transfer" : "New place") : (isTransfer ? "Edit transfer" : "Edit place")} onClose={onClose}
      footer={<>
        {!editing._new && <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "places", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>}
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      {editing._new && (
        <div className="seg" style={{ alignSelf: "flex-start" }}>
          <button className={!isTransfer ? "on" : ""} onClick={() => setF({ ...f, type: "place" })}>Place</button>
          <button className={isTransfer ? "on" : ""} onClick={() => setF({ ...f, type: "transfer" })}>Transfer</button>
        </div>
      )}

      {isTransfer ? (
        <>
          <div>
            <span className="lbl">How</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {TRANSFER_MODE_KEYS.map((m) => {
                const Icon = modeIcon(m); const on = f.mode === m;
                return <button key={m} className={"chip" + (on ? " on" : "")} onClick={() => setF({ ...f, mode: m })} style={on ? { background: "var(--accent)" } : {}}><Icon size={13} /> {m}</button>;
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "end" }}>
            <Field label="From" placeholder="Hanoi" value={f.from} onChange={set("from")} autoFocus />
            <ArrowRight size={16} color="var(--muted)" style={{ marginBottom: 11 }} />
            <Field label="To" placeholder="Hoi An" value={f.to} onChange={set("to")} />
          </div>
        </>
      ) : (
        <>
          <Field label="Place" placeholder="e.g. Train Street coffee" value={f.name} onChange={set("name")} autoFocus />
          <div>
            <span className="lbl">Category</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {PLACE_CATEGORY_KEYS.map((c) => {
                const Icon = catIcon(c); const on = f.category === c;
                return <button key={c} className={"chip" + (on ? " on" : "")} onClick={() => setF({ ...f, category: c })} style={on ? { background: catTone(c) } : { color: catTone(c) }}><Icon size={13} /> {c}</button>;
              })}
            </div>
          </div>
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: showTime ? "1fr 1fr" : "1fr", gap: 12 }}>
        <Field as="select" label="Day" value={f.dayD ?? ""} onChange={set("dayD")}>
          {days.map((d) => <option key={d.d} value={d.d}>{d.d} {month} · {d.label}</option>)}
        </Field>
        {showTime && <Field label="Departure time" type="time" value={f.time} onChange={set("time")} />}
      </div>

      {!isTransfer && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Area" placeholder="Neighbourhood / city" value={f.area} onChange={set("area")} />
          <Field label="Cost (₹)" type="number" min="0" value={f.cost} onChange={set("cost")} />
        </div>
      )}
      {isTransfer && <Field label="Cost (₹)" type="number" min="0" value={f.cost} onChange={set("cost")} />}

      <Field as="textarea" label="Notes" placeholder="A tip for your future self…" value={f.notes} onChange={set("notes")} />

      {!isTransfer && (
        <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13.5 }}>
          <span className={"cbox" + (f.booked ? " on" : "")} style={{ width: 18, height: 18 }}>{f.booked && <Check size={11} color="#fff" strokeWidth={3} />}</span>
          <input type="checkbox" checked={!!f.booked} onChange={(e) => setF({ ...f, booked: e.target.checked })} style={{ display: "none" }} />
          Already booked / reserved
        </label>
      )}
    </Modal>
  );
}
