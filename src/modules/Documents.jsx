import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { useStore } from "../store.jsx";
import { Intro, Modal, Field } from "../components/Primitives.jsx";

const TYPES = ["Passport", "Visa", "Insurance", "Arrival card", "Health form", "Ticket", "Booking", "File"];

export default function Documents() {
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <Intro kicker="Findable in two seconds"
        right={<button className="btn dark sm" onClick={() => setEditing({ _new: true, type: "File", label: "", uploaded: false, essential: false })}><Plus size={14} /> Add document</button>}>
        Passports, visas, tickets — and everything else.
      </Intro>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {state.docs.map((d) => (
          <div key={d.id} style={{ position: "relative", padding: "16px 18px", borderRadius: 12, background: "var(--panel)", display: "flex", alignItems: "center", gap: 14, boxShadow: "var(--shadow)", border: `1px solid ${d.uploaded ? "var(--line)" : "rgba(184,118,46,.34)"}` }}>
            <button onClick={() => dispatch({ type: "toggleDoc", id: d.id })} title={d.uploaded ? "Mark not uploaded" : "Mark uploaded"}
              style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, background: d.uploaded ? "rgba(59,122,87,.13)" : "rgba(184,118,46,.13)", color: d.uploaded ? "var(--ready)" : "var(--warn)" }}>
              {d.uploaded ? <Check size={18} strokeWidth={2.5} /> : <Plus size={18} />}
            </button>
            <button onClick={() => setEditing(d)} style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
              <div className="eyebrow">{d.type}</div>
              <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 1 }}>{d.label}</div>
            </button>
            {d.essential && !d.uploaded && <span style={{ fontSize: 10, color: "var(--warn)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" }}>needed</span>}
            <button className="iconbtn warn" onClick={() => dispatch({ type: "remove", coll: "docs", id: d.id })}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      {editing && <DocEditor editing={editing} dispatch={dispatch} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DocEditor({ editing, dispatch, onClose }) {
  const [f, setF] = useState({ ...editing });
  const valid = f.label.trim().length > 0;
  const save = () => {
    if (!valid) return;
    const fields = { type: f.type, label: f.label.trim(), uploaded: !!f.uploaded, essential: !!f.essential };
    if (editing._new) dispatch({ type: "add", coll: "docs", item: fields });
    else dispatch({ type: "patch", coll: "docs", id: editing.id, fields });
    onClose();
  };
  return (
    <Modal title={editing._new ? "Add document" : "Edit document"} onClose={onClose}
      footer={<>
        {!editing._new && <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "docs", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>}
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      <Field as="select" label="Slot" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} hint="Passport, Visa & Insurance feed Readiness directly.">
        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </Field>
      <Field label="Label" placeholder="e.g. Vietnam e-visa" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} autoFocus />
      <div style={{ display: "flex", gap: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13 }}>
          <span className={"cbox" + (f.uploaded ? " on" : "")} style={{ width: 18, height: 18 }}>{f.uploaded && <Check size={11} color="#fff" strokeWidth={3} />}</span>
          <input type="checkbox" checked={!!f.uploaded} onChange={(e) => setF({ ...f, uploaded: e.target.checked })} style={{ display: "none" }} /> Uploaded
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13 }}>
          <span className={"cbox" + (f.essential ? " on" : "")} style={{ width: 18, height: 18 }}>{f.essential && <Check size={11} color="#fff" strokeWidth={3} />}</span>
          <input type="checkbox" checked={!!f.essential} onChange={(e) => setF({ ...f, essential: e.target.checked })} style={{ display: "none" }} /> Essential
        </label>
      </div>
    </Modal>
  );
}
