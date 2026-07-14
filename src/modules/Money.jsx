import { useState } from "react";
import { ArrowRight, Plus, Trash2, Check, Handshake, Receipt } from "lucide-react";
import { useStore, useIsAdmin } from "../store.jsx";
import { Intro, Modal, Field } from "../components/Primitives.jsx";
import { inr, settlement, shareFor, nameOf } from "../lib/format.js";

export default function Money() {
  const { state, dispatch } = useStore();
  const isAdmin = useIsAdmin();
  const [editExp, setEditExp] = useState(null);
  const [editPay, setEditPay] = useState(null);
  const members = state.members;
  const expenses = state.expenses;
  const set = settlement(state);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const newExpense = () => ({ _new: true, label: "", amount: 0, paidBy: members[0]?.id, splitMode: "equal", split: members.map((m) => m.id), amounts: {} });

  return (
    <div>
      <Intro kicker="Shared money"
        right={<button className="btn dark sm" onClick={() => setEditExp(newExpense())}><Plus size={14} /> Add expense</button>}>
        Who paid, who owes whom — split and settled.
      </Intro>

      {/* total + per-person balances */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
          <div className="serif tnum" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{inr(totalSpent)}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>spent across {expenses.length} expenses</div>
        </div>
        <div className="lbl" style={{ marginBottom: 8 }}>Per person</div>
        <div style={{ display: "grid", gap: 4 }}>
          {members.map((m) => {
            const paid = expenses.filter((e) => e.paidBy === m.id).reduce((s, e) => s + e.amount, 0);
            const share = expenses.reduce((s, e) => s + shareFor(e, m.id), 0);
            const net = set.balances[m.id] || 0;
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--lineSoft)" }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{m.initials}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}{m.you && <span style={{ color: "var(--faint)", fontWeight: 400 }}> · you</span>}</div>
                  <div className="tnum" style={{ fontSize: 11.5, color: "var(--muted)" }}>paid {inr(paid)} · share {inr(share)}</div>
                </div>
                <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: net > 1 ? "var(--ready)" : net < -1 ? "#E0556B" : "var(--faint)" }}>
                  {net > 1 ? `gets ${inr(net)}` : net < -1 ? `owes ${inr(-net)}` : "settled"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* who owes whom + settle-up */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="kicker">Settle up</div>
        <button className="btn ghost sm" onClick={() => setEditPay({ _new: true, from: members[0]?.id, to: members[1]?.id, amount: 0, note: "", date: "" })}><Handshake size={13} /> Record payment</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
        {set.transfers.length === 0 && <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>All square. Nobody owes anyone.</div>}
        {set.transfers.map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid var(--lineSoft)" }}>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{nameOf(state, t.from)}</span>
            <ArrowRight size={15} color="var(--muted)" />
            <span style={{ fontSize: 13.5, fontWeight: 700, flex: 1 }}>{nameOf(state, t.to)}</span>
            <span className="serif tnum" style={{ fontSize: 16, fontWeight: 700 }}>{inr(t.amt)}</span>
            <button className="btn ghost sm" onClick={() => setEditPay({ _new: true, from: t.from, to: t.to, amount: Math.round(t.amt), note: "Settle up", date: "" })}>Settle</button>
          </div>
        ))}
        {(state.payments || []).map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderTop: i === 0 ? "1px solid var(--line)" : "1px solid var(--lineSoft)", background: "var(--paper)", cursor: "pointer" }} onClick={() => setEditPay(p)}>
            <Handshake size={14} color="var(--ready)" />
            <span style={{ fontSize: 12.5, color: "var(--muted)", flex: 1 }}>
              <b style={{ color: "var(--ink)", fontWeight: 700 }}>{nameOf(state, p.from)}</b> paid <b style={{ color: "var(--ink)", fontWeight: 700 }}>{nameOf(state, p.to)}</b>{p.note && ` · ${p.note}`}
            </span>
            <span className="tnum" style={{ fontSize: 13, fontWeight: 700, color: "var(--ready)" }}>{inr(p.amount)}</span>
            {isAdmin && <button className="iconbtn warn" onClick={(ev) => { ev.stopPropagation(); dispatch({ type: "remove", coll: "payments", id: p.id }); }}><Trash2 size={12} /></button>}
          </div>
        ))}
      </div>

      {/* the expenses themselves */}
      <div className="kicker" style={{ marginBottom: 10 }}>Expenses</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {expenses.map((e, i) => {
          const involved = e.splitMode === "unequal" ? Object.keys(e.amounts || {}).filter((k) => e.amounts[k] > 0) : e.split;
          return (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < expenses.length - 1 ? "1px solid var(--lineSoft)" : "none", cursor: "pointer" }} onClick={() => setEditExp(e)}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 }}><Receipt size={15} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{e.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                  <b style={{ fontWeight: 700, color: "var(--ink)" }}>{nameOf(state, e.paidBy)}</b> paid · split {e.splitMode === "unequal" ? "unequally" : "equally"} between {involved.length}
                </div>
              </div>
              <span className="tnum" style={{ fontSize: 14, fontWeight: 700 }}>{inr(e.amount)}</span>
              {isAdmin && <button className="iconbtn warn" onClick={(ev) => { ev.stopPropagation(); dispatch({ type: "remove", coll: "expenses", id: e.id }); }}><Trash2 size={13} /></button>}
            </div>
          );
        })}
        {expenses.length === 0 && <div style={{ padding: 16, fontSize: 13, color: "var(--muted)" }}>No expenses yet — add one when money goes out.</div>}
        <button className="add-row" style={{ border: "none", borderTop: "1px dashed var(--line)", borderRadius: 0 }} onClick={() => setEditExp(newExpense())}><Plus size={15} /> Add expense</button>
      </div>

      {editExp && <ExpenseEditor editing={editExp} members={members} dispatch={dispatch} onClose={() => setEditExp(null)} />}
      {editPay && <PaymentEditor editing={editPay} members={members} dispatch={dispatch} onClose={() => setEditPay(null)} />}
    </div>
  );
}

function ExpenseEditor({ editing, members, dispatch, onClose }) {
  const isAdmin = useIsAdmin();
  const [f, setF] = useState({ ...editing, amounts: { ...(editing.amounts || {}) }, split: editing.split || members.map((m) => m.id) });
  const amount = Number(f.amount) || 0;
  const involved = f.split;
  const toggle = (id) => setF({ ...f, split: involved.includes(id) ? involved.filter((x) => x !== id) : [...involved, id] });
  const setAmt = (id, v) => setF({ ...f, amounts: { ...f.amounts, [id]: Number(v) || 0 } });
  const splitEvenly = () => setF({ ...f, amounts: Object.fromEntries(involved.map((id) => [id, Math.round((amount / (involved.length || 1)) * 100) / 100])) });

  const customSum = involved.reduce((s, id) => s + (Number(f.amounts[id]) || 0), 0);
  const off = f.splitMode === "unequal" && Math.abs(customSum - amount) > 1;
  const valid = f.label.trim() && amount > 0 && involved.length > 0 && !off;

  const save = () => {
    if (!valid) return;
    const fields = {
      label: f.label.trim(), amount, paidBy: f.paidBy, splitMode: f.splitMode,
      split: involved, amounts: f.splitMode === "unequal" ? Object.fromEntries(involved.map((id) => [id, Number(f.amounts[id]) || 0])) : {},
    };
    if (editing._new) dispatch({ type: "add", coll: "expenses", item: fields });
    else dispatch({ type: "patch", coll: "expenses", id: editing.id, fields });
    onClose();
  };

  return (
    <Modal title={editing._new ? "Add expense" : "Edit expense"} onClose={onClose}
      footer={<>
        {!editing._new && isAdmin && <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "expenses", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>}
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      <Field label="What was it for?" placeholder="e.g. Bun cha dinner" value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} autoFocus />
      <Field label="How much (₹)" type="number" min="0" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
      <Field as="select" label="Who paid?" value={f.paidBy} onChange={(e) => setF({ ...f, paidBy: e.target.value })}>
        {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
      </Field>

      <div>
        <span className="lbl">Who's involved?</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {members.map((m) => {
            const on = involved.includes(m.id);
            return (
              <button key={m.id} className={"chip" + (on ? " on" : "")} onClick={() => toggle(m.id)} style={on ? { background: "var(--accent)" } : {}}>
                {on && <Check size={12} />} {m.name}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
          <span className="lbl" style={{ margin: 0 }}>How to split</span>
          <div className="seg" style={{ padding: 3 }}>
            <button className={f.splitMode === "equal" ? "on" : ""} style={{ padding: "5px 12px" }} onClick={() => setF({ ...f, splitMode: "equal" })}>Equal</button>
            <button className={f.splitMode === "unequal" ? "on" : ""} style={{ padding: "5px 12px" }} onClick={() => setF({ ...f, splitMode: "unequal" })}>Unequal</button>
          </div>
        </div>
        {f.splitMode === "equal" ? (
          involved.length > 0 && <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{inr(amount / involved.length)} each · {involved.length} {involved.length === 1 ? "person" : "people"}</div>
        ) : (
          <>
            <div style={{ display: "grid", gap: 8 }}>
              {members.filter((m) => involved.includes(m.id)).map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flex: 1, fontSize: 13 }}>{m.name}</span>
                  <input className="fld" type="number" min="0" value={f.amounts[m.id] ?? ""} placeholder="0" onChange={(e) => setAmt(m.id, e.target.value)} style={{ width: 120 }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <button className="btn ghost sm" onClick={splitEvenly}>Split evenly</button>
              <span className="tnum" style={{ fontSize: 12, color: off ? "#E0556B" : "var(--muted)" }}>
                {inr(customSum)} of {inr(amount)}{off ? ` · ${inr(Math.abs(customSum - amount))} ${customSum > amount ? "over" : "short"}` : " ✓"}
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function PaymentEditor({ editing, members, dispatch, onClose }) {
  const isAdmin = useIsAdmin();
  const [f, setF] = useState({ ...editing });
  const valid = f.from && f.to && f.from !== f.to && Number(f.amount) > 0;
  const save = () => {
    if (!valid) return;
    const fields = { from: f.from, to: f.to, amount: Number(f.amount) || 0, note: (f.note || "").trim(), date: f.date || "" };
    if (editing._new) dispatch({ type: "add", coll: "payments", item: fields });
    else dispatch({ type: "patch", coll: "payments", id: editing.id, fields });
    onClose();
  };
  return (
    <Modal title={editing._new ? "Record a payment" : "Edit payment"} onClose={onClose}
      footer={<>
        {!editing._new && isAdmin && <button className="btn danger sm" style={{ marginRight: "auto" }} onClick={() => { dispatch({ type: "remove", coll: "payments", id: editing.id }); onClose(); }}><Trash2 size={14} /> Delete</button>}
        <button className="btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn dark sm" onClick={save} disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }}><Check size={14} /> Save</button>
      </>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end" }}>
        <Field as="select" label="From (payer)" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })}>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Field>
        <ArrowRight size={16} color="var(--muted)" style={{ marginBottom: 11 }} />
        <Field as="select" label="To (received)" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })}>
          {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </Field>
      </div>
      {f.from === f.to && <div style={{ fontSize: 11.5, color: "#E0556B" }}>Pick two different people.</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Amount (₹)" type="number" min="0" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} />
        <Field label="Date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
      </div>
      <Field label="Note" placeholder="e.g. UPI settle-up" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
    </Modal>
  );
}
