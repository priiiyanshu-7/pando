import { useState } from "react";
import {
  LayoutDashboard, CheckSquare, CalendarDays, Wallet, MoreHorizontal,
  Ticket, FileText, Activity, Users, Settings, Compass, LogOut, Check,
} from "lucide-react";
import { useStore, useApp } from "../store.jsx";
import { DESTINATIONS } from "../data/trip.js";

// 4 primary tabs in the bar; everything else lives in the "More" sheet.
const TABS = [
  ["overview",  "Overview",  LayoutDashboard],
  ["checklist", "Checklist", CheckSquare],
  ["itinerary", "Itinerary", CalendarDays],
  ["money",     "Money",     Wallet],
];
const MORE = [
  ["bookings",  "Bookings",  Ticket],
  ["documents", "Documents", FileText],
  ["activity",  "Activity",  Activity],
  ["members",   "Members",   Users],
  ["settings",  "Settings",  Settings],
];

export function BottomNav() {
  const { state, dispatch } = useStore();
  const [sheet, setSheet] = useState(null); // "more" | "account" | null
  const go = (key) => { dispatch({ type: "module", value: key }); setSheet(null); };
  const moreActive = MORE.some(([k]) => k === state.module);

  return (
    <>
      <nav className="bottomnav">
        {TABS.map(([key, label, Icon]) => (
          <button key={key} className={state.module === key ? "on" : ""} onClick={() => go(key)}>
            <Icon size={21} strokeWidth={2} /> {label}
          </button>
        ))}
        <button className={moreActive ? "on" : ""} onClick={() => setSheet("more")}>
          <MoreHorizontal size={21} strokeWidth={2} /> More
        </button>
      </nav>

      {sheet === "more" && (
        <Sheet onClose={() => setSheet(null)} title="More">
          {MORE.map(([key, label, Icon]) => (
            <button key={key} className={"sheet-item" + (state.module === key ? " on" : "")} onClick={() => go(key)}>
              <Icon size={19} strokeWidth={2} /> {label}
            </button>
          ))}
        </Sheet>
      )}
    </>
  );
}

// The profile button (used in the mobile top bar) + its account sheet.
export function MobileProfile() {
  const { dispatch } = useStore();
  const { app } = useApp();
  const [open, setOpen] = useState(false);
  if (!app?.auth) return null;
  const initials = app.auth.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <span className="only-mobile">
        <button onClick={() => setOpen(true)} aria-label="Account"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {initials}
        </button>
      </span>

      {open && (
        <Sheet onClose={() => setOpen(false)} title={app.auth.name}>
          <div style={{ fontSize: 11.5, color: "var(--faint)", padding: "0 12px 8px" }}>Switch trip</div>
          {app.trips.map((t) => {
            const d = DESTINATIONS[t.trip.destinationKey] || {};
            const active = t.id === app.activeId && app.route === "trip";
            return (
              <button key={t.id} className={"sheet-item" + (active ? " on" : "")} onClick={() => { dispatch({ type: "openTrip", id: t.id }); setOpen(false); }}>
                <span style={{ fontSize: 18 }}>{d.flag || "🧳"}</span>
                <span style={{ flex: 1 }}>{t.trip.name}</span>
                {active && <Check size={16} />}
              </button>
            );
          })}
          <button className="sheet-item" onClick={() => { dispatch({ type: "home" }); setOpen(false); }}>
            <Compass size={19} /> All trips
          </button>
          <div style={{ height: 1, background: "var(--lineSoft)", margin: "6px 8px" }} />
          <button className="sheet-item" style={{ color: "#E0556B" }} onClick={() => dispatch({ type: "logout" })}>
            <LogOut size={19} /> Sign out
          </button>
        </Sheet>
      )}
    </>
  );
}

function Sheet({ title, children, onClose }) {
  return (
    <div className="sheet-overlay" onMouseDown={onClose}>
      <div className="sheet" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {title && <div className="serif" style={{ fontSize: 18, fontWeight: 800, padding: "0 12px 10px" }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}
