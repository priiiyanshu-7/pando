import { useState } from "react";
import { Menu } from "lucide-react";
import { StoreProvider, useStore, useApp } from "./store.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import { computeReadiness, daysUntil } from "./engine/readiness.js";
import { DESTINATIONS } from "./data/trip.js";

import Overview from "./modules/Overview.jsx";
import Itinerary from "./modules/Itinerary.jsx";
import Bookings from "./modules/Bookings.jsx";
import Money from "./modules/Money.jsx";
import Documents from "./modules/Documents.jsx";
import Checklist from "./modules/Checklist.jsx";
import Activity from "./modules/Activity.jsx";
import { Members, Settings } from "./modules/MembersSettings.jsx";

const MODULES = { overview: Overview, itinerary: Itinerary, bookings: Bookings, money: Money, documents: Documents, checklist: Checklist, activity: Activity, members: Members, settings: Settings };
const TITLES = { overview: "Overview", itinerary: "Itinerary", bookings: "Bookings", money: "Money", documents: "Documents", checklist: "Checklist", activity: "Activity", members: "Members", settings: "Settings" };

function Shell() {
  const { state } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const dest = DESTINATIONS[state.trip.destinationKey];
  const R = computeReadiness(state);
  const days = daysUntil(state.trip.start);
  const Active = MODULES[state.module] || Overview;
  const fmt = (d) => { const x = new Date(d); return Number.isNaN(+x) ? d : x.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  const range = `${fmt(state.trip.start)} → ${fmt(state.trip.end)}`;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div className={"nav-backdrop" + (navOpen ? " show" : "")} onClick={() => setNavOpen(false)} />
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
      <main className="app-main" style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <header className="app-header" style={{ padding: "26px 44px 20px", borderBottom: "1px solid var(--line)", background: "var(--paper)", position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <button className="nav-toggle iconbtn" onClick={() => setNavOpen(true)} aria-label="Menu" style={{ width: 36, height: 36 }}><Menu size={20} /></button>
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{TITLES[state.module]}</div>
              <h1 className="serif" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>
                {state.trip.name} <span style={{ fontSize: 28 }}>{dest.flag}</span>
              </h1>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="serif tnum" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1 }}>{days}<span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--ui)", fontWeight: 450 }}> days out</span></div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{range} · {R.score}% ready</div>
          </div>
        </header>
        <div className="app-content" style={{ padding: "26px 44px 80px", maxWidth: 1040 }}>
          <Active />
        </div>
      </main>
    </div>
  );
}

function Router() {
  const { app } = useApp();
  if (!app.auth) return <Login />;
  return app.route === "home" ? <Home /> : <Shell />;
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
}
