import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, Ticket, Wallet, FileText,
  CheckSquare, Activity, Users, Settings, Compass,
  LogOut, ChevronsUpDown, Check,
} from "lucide-react";
import { useStore, useApp } from "../store.jsx";
import { Ring, Logo } from "./Primitives.jsx";
import { computeReadiness } from "../engine/readiness.js";
import { DESTINATIONS } from "../data/trip.js";

// Six core modules — collapsed from the original fourteen.
//   Money  = Budget + Expenses
//   Documents = Documents + Files
//   Activity = Timeline + Activity
//   Places folded into Itinerary as a layer
const CORE = [
  ["overview",  "Overview",  LayoutDashboard],
  ["itinerary", "Itinerary", CalendarDays],
  ["bookings",  "Bookings",  Ticket],
  ["money",     "Money",     Wallet],
  ["documents", "Documents", FileText],
  ["checklist", "Checklist", CheckSquare],
];
const SECONDARY = [
  ["activity",  "Activity",  Activity],
  ["members",   "Members",   Users],   // group only
  ["settings",  "Settings",  Settings],
];

export default function Sidebar({ open = false, onNavigate }) {
  const { state, dispatch } = useStore();
  const { app } = useApp();
  const [pick, setPick] = useState(false);
  const R = computeReadiness(state);
  const dest = DESTINATIONS[state.trip.destinationKey];
  const go = (key) => { dispatch({ type: "module", value: key }); onNavigate?.(); };

  const Item = ([key, label, Icon]) => (
    <button key={key} className="nav" onClick={() => go(key)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
        borderRadius: 8, fontSize: 13, textAlign: "left", transition: "background .12s",
        background: state.module === key ? "var(--accent-soft)" : "transparent",
        color: state.module === key ? "var(--accent)" : "var(--muted)",
        fontWeight: state.module === key ? 550 : 450,
      }}>
      <Icon size={15} strokeWidth={2} /> {label}
    </button>
  );

  return (
    <aside className={"sidebar" + (open ? " open" : "")}>
      <div style={{ padding: "0 8px 16px", display: "flex", alignItems: "center", gap: 9 }}>
        <Logo size={30} radius={9} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span className="serif" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em" }}>Pando</span>
          <span style={{ fontSize: 10, color: "var(--faint)" }}>every trip is a project</span>
        </div>
      </div>

      {/* trip switcher — pick which project you're in */}
      <div style={{ position: "relative", margin: "0 4px 12px" }}>
        <button onClick={() => setPick((v) => !v)} style={{
          width: "100%", padding: "10px 11px", borderRadius: 12, background: "var(--panel)",
          border: "1px solid var(--line)", boxShadow: "var(--shadow)", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
        }}>
          <Ring size={30} stroke={3.5} pct={R.score} mini />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span>{dest.flag}</span> {state.trip.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{state.members.length} travellers</div>
          </div>
          <ChevronsUpDown size={15} color="var(--faint)" />
        </button>

        {pick && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 25, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "var(--shadow-lg)", padding: 5 }}>
            {app.trips.map((t) => {
              const d = DESTINATIONS[t.trip.destinationKey] || {};
              const active = t.id === app.activeId && app.route === "trip";
              return (
                <button key={t.id} onClick={() => { dispatch({ type: "openTrip", id: t.id }); setPick(false); onNavigate?.(); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 8, fontSize: 13, textAlign: "left", background: active ? "var(--accent-soft)" : "transparent", color: active ? "var(--accent)" : "var(--ink)", fontWeight: active ? 700 : 500 }}>
                  <span>{d.flag || "🧳"}</span>
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.trip.name}</span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
            <div style={{ height: 1, background: "var(--lineSoft)", margin: "5px 4px" }} />
            <button onClick={() => { dispatch({ type: "home" }); setPick(false); onNavigate?.(); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 8, fontSize: 13, color: "var(--muted)" }}>
              <Compass size={15} /> All trips
            </button>
          </div>
        )}
      </div>

      <div style={{ margin: "0 2px" }}>{CORE.map(Item)}</div>
      <div style={{ height: 1, background: "var(--lineSoft)", margin: "8px 10px" }} />
      <div style={{ margin: "0 2px" }}>{SECONDARY.map(Item)}</div>

      {app?.auth && (
        <div style={{ marginTop: 18, padding: "10px 11px", borderTop: "1px solid var(--lineSoft)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {app.auth.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.auth.name}</div>
            <div style={{ fontSize: 10.5, color: "var(--faint)" }}>@{app.auth.username}</div>
          </div>
          <button className="iconbtn" title="Sign out" onClick={() => dispatch({ type: "logout" })}><LogOut size={15} /></button>
        </div>
      )}
    </aside>
  );
}
