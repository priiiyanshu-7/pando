import { useState } from "react";
import { Plane, Hotel, Car, Compass, Check, ChevronDown, ChevronRight } from "lucide-react";
import { useStore } from "../store.jsx";
import { Ring, Bar } from "../components/Primitives.jsx";
import { computeReadiness } from "../engine/readiness.js";
import { inr, nameOf, settlement } from "../lib/format.js";

const bIcon = (t) => (t === "Flight" ? Plane : t === "Hotel" ? Hotel : t === "Transit" ? Car : Compass);
const sColor = (s) => (s === "Cancelled" ? "var(--dim)" : s === "Planned" ? "var(--warn)" : "var(--ready)");

export default function Overview() {
  const { state, dispatch } = useStore();
  const [why, setWhy] = useState(false);
  const R = computeReadiness(state);
  const spent = state.expenses.reduce((s, e) => s + e.amount, 0);
  const youId = state.members.find((m) => m.you)?.id;
  const net = settlement(state).balances[youId] || 0;
  const open = state.checklist.filter((c) => !c.done);
  const upcoming = state.bookings.filter((b) => b.status !== "Cancelled").slice(0, 3);
  const go = (m) => dispatch({ type: "module", value: m });

  return (
    <div className="ov-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 }}>
      {/* HERO — readiness, explainable */}
      <div className="card" style={{ gridColumn: "1 / -1", padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 28px" }}>
          <Ring size={120} stroke={11} pct={R.score} />
          <div style={{ flex: 1 }}>
            <div className="eyebrow">Readiness</div>
            <div className="serif" style={{ fontSize: 22, fontWeight: 500, margin: "2px 0 6px" }}>
              {R.score >= 90 ? "Nearly there." : R.score >= 70 ? "On track." : R.score >= 40 ? "Coming together." : "Just getting started."}
            </div>
            {R.nextUp && (
              <button onClick={() => setWhy((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" }}>
                <span>Next: <b style={{ color: "var(--ink)", fontWeight: 600 }}>{R.nextUp.label}</b></span>
                <ChevronDown size={14} style={{ transform: why ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>
            )}
          </div>
        </div>

        {/* the breakdown — this is why the number is never arbitrary */}
        <div style={{
          maxHeight: why ? 460 : 0, overflow: "hidden", transition: "max-height .35s ease",
          borderTop: why ? "1px solid var(--line)" : "none", background: "var(--paper)",
        }}>
          <div style={{ padding: "16px 28px 22px" }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Why {R.score}% — every point accounted for</div>
            {R.lines.map((l) => {
              const earned = Math.round(l.weight * l.frac);
              const done = l.frac >= 1;
              return (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0" }}>
                  <span className="cbox" style={{ width: 16, height: 16, borderColor: done ? "var(--ready)" : "var(--faint)", background: done ? "var(--ready)" : "transparent" }}>
                    {done && <Check size={10} color="#fff" strokeWidth={3} />}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {l.label}
                      {l.required && <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, marginLeft: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>required</span>}
                    </div>
                    {(l.detail || l.why) && <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{l.detail || l.why}</div>}
                  </div>
                  {l.frac > 0 && l.frac < 1 && (
                    <div style={{ width: 60 }}><Bar value={l.frac} /></div>
                  )}
                  <span className="tnum" style={{ fontSize: 12.5, fontWeight: 600, width: 64, textAlign: "right", color: done ? "var(--ready)" : "var(--faint)" }}>
                    {earned} / {l.weight}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* what's next */}
      <div className="card">
        <button className="card-head" onClick={() => go("checklist")} style={{ width: "100%", cursor: "pointer" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: 5 }}>What still needs to happen <ChevronRight size={15} color="var(--faint)" /></h3>
          <span className="hint">{open.length} open</span>
        </button>
        {open.slice(0, 5).map((t) => (
          <button key={t.id} className="row" onClick={() => dispatch({ type: "toggleTask", id: t.id })}>
            <span className="cbox" />
            <span style={{ flex: 1, fontSize: 13.5 }}>{t.label}</span>
            <span className="pill owner">{nameOf(state, t.owner)}</span>
          </button>
        ))}
        {open.length === 0 && <div className="serif" style={{ padding: "12px 4px", color: "var(--faint)", fontStyle: "italic" }}>Everything's done. Go pack.</div>}
      </div>

      {/* money snapshot — planned is derived, never preset */}
      <div className="card" onClick={() => go("money")} style={{ cursor: "pointer" }}>
        <div className="card-head"><h3 style={{ display: "flex", alignItems: "center", gap: 5 }}>Money <ChevronRight size={15} color="var(--faint)" /></h3><span className="hint">{state.expenses.length} expenses</span></div>
        <div className="serif tnum" style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-.01em" }}>
          {inr(spent)}<span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "var(--ui)", fontWeight: 500 }}> spent</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: net > 1 ? "var(--ready)" : net < -1 ? "#E0556B" : "var(--muted)" }}>
          {net > 1 ? `You're owed ${inr(net)}` : net < -1 ? `You owe ${inr(-net)}` : "You're all settled up"}
        </div>
      </div>

      {/* upcoming */}
      <div className="card" onClick={() => go("bookings")} style={{ cursor: "pointer" }}>
        <div className="card-head"><h3 style={{ display: "flex", alignItems: "center", gap: 5 }}>Upcoming <ChevronRight size={15} color="var(--faint)" /></h3><span className="hint">next reservations</span></div>
        {upcoming.map((b) => {
          const Icon = bIcon(b.type);
          return (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: "1px solid var(--lineSoft)" }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)" }}><Icon size={15} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{b.date}</div>
              </div>
              <span className="dot" style={{ background: sColor(b.status) }} />
            </div>
          );
        })}
      </div>

      {/* activity */}
      <div className="card" onClick={() => go("activity")} style={{ cursor: "pointer" }}>
        <div className="card-head"><h3 style={{ display: "flex", alignItems: "center", gap: 5 }}>Recent activity <ChevronRight size={15} color="var(--faint)" /></h3><span className="hint" /></div>
        {state.activity.slice(0, 4).map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 9, padding: "7px 0", fontSize: 12.5, alignItems: "baseline" }}>
            <span className="dot" style={{ background: "var(--accent)", marginTop: 6 }} />
            <span style={{ flex: 1 }}><b style={{ fontWeight: 600 }}>{a.who}</b> <span style={{ color: "var(--muted)" }}>{a.what}</span></span>
            <span style={{ color: "var(--faint)", fontSize: 11, whiteSpace: "nowrap" }}>{a.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
