import { useState } from "react";
import { Plus, Check, Trash2, Pencil } from "lucide-react";
import { useStore } from "../store.jsx";
import { Intro, Ring, Modal, Field } from "../components/Primitives.jsx";
import { computeReadiness } from "../engine/readiness.js";
import { nameOf } from "../lib/format.js";

export default function Checklist() {
  const { state, dispatch } = useStore();
  const [val, setVal] = useState("");
  const [section, setSection] = useState("Before you go");
  const [editing, setEditing] = useState(null);
  const R = computeReadiness(state);
  const sections = [...new Set([...state.checklist.map((c) => c.section), "Before you go", "Pack", "There"])];

  const add = () => {
    if (!val.trim()) return;
    dispatch({ type: "addTask", label: val.trim(), section });
    setVal("");
  };

  return (
    <div>
      <Intro kicker="Get ready" right={<Ring size={62} stroke={6} pct={R.score} />}>
        Tick things off. <b>Essential</b> items count for more.
      </Intro>

      <div style={{ display: "flex", gap: 8, maxWidth: 560, flexWrap: "wrap", marginBottom: 22 }}>
        <select className="fld" value={section} onChange={(e) => setSection(e.target.value)} style={{ width: 150, flex: "0 0 auto" }}>
          {sections.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="fld" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task…" style={{ flex: 1, minWidth: 160 }} />
        <button className="btn dark" onClick={add}><Plus size={14} /> Add</button>
      </div>

      {sections.filter((sec) => state.checklist.some((c) => c.section === sec)).map((sec) => {
        const items = state.checklist.filter((c) => c.section === sec);
        const done = items.filter((i) => i.done).length;
        return (
          <div key={sec} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
              <h3 className="serif" style={{ fontSize: 17, fontWeight: 500 }}>{sec}</h3>
              <span className="tnum" style={{ fontSize: 12, color: "var(--faint)" }}>{done}/{items.length}</span>
            </div>
            <div className="card" style={{ padding: "6px 8px" }}>
              {items.map((t) => (
                <div key={t.id} className="row" style={{ paddingRight: 4 }}>
                  <button onClick={() => dispatch({ type: "toggleTask", id: t.id })} style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, textAlign: "left" }}>
                    <span className={"cbox" + (t.done ? " on" : "")}>{t.done && <Check size={11} color="#fff" strokeWidth={3} />}</span>
                    <span style={{ flex: 1, fontSize: 13.5, color: t.done ? "var(--faint)" : "var(--ink)", textDecoration: t.done ? "line-through" : "none" }}>{t.label}</span>
                  </button>
                  {t.essential && <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" }}>essential</span>}
                  <button className="pill owner" onClick={() => setEditing(t)}>{nameOf(state, t.owner)}</button>
                  <button className="iconbtn warn" onClick={() => setEditing(t)} title="Edit" style={{ width: 24, height: 24 }}><Pencil size={12} /></button>
                  <button className="iconbtn warn" onClick={() => dispatch({ type: "remove", coll: "checklist", id: t.id })} title="Delete" style={{ width: 24, height: 24 }}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {editing && <TaskEditor editing={editing} members={state.members} group sections={sections} dispatch={dispatch} onClose={() => setEditing(null)} />}
    </div>
  );
}

function TaskEditor({ editing, members, group, sections, dispatch, onClose }) {
  const [f, setF] = useState({ ...editing });
  const valid = f.label.trim().length > 0;
  const save = () => {
    if (!valid) return;
    dispatch({ type: "patch", coll: "checklist", id: editing.id, fields: { label: f.label.trim(), section: f.section, essential: !!f.essential, owner: f.owner } });
    onClose();
  };
  return (
    <Modal title="Edit task" onClose={onClose}
      footer={<>
        <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "checklist", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      <Field label="Task" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} autoFocus />
      <div style={{ display: "grid", gridTemplateColumns: group ? "1fr 1fr" : "1fr", gap: 12 }}>
        <Field as="select" label="Section" value={f.section} onChange={(e) => setF({ ...f, section: e.target.value })}>
          {sections.map((s) => <option key={s} value={s}>{s}</option>)}
        </Field>
        {group && (
          <Field as="select" label="Owner" value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })}>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Field>
        )}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13 }}>
        <span className={"cbox" + (f.essential ? " on" : "")} style={{ width: 18, height: 18 }}>{f.essential && <Check size={11} color="#fff" strokeWidth={3} />}</span>
        <input type="checkbox" checked={!!f.essential} onChange={(e) => setF({ ...f, essential: e.target.checked })} style={{ display: "none" }} />
        Essential — weighted heavier in Readiness
      </label>
    </Modal>
  );
}
