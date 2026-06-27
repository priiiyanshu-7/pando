// Pando — self-contained build (auto-bundled from the multi-file project).
(function(){
  if(typeof document==="undefined")return;
  if(document.getElementById("pando-styles"))return;
  const el=document.createElement("style");el.id="pando-styles";
  el.textContent="@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;450;500;600&display=swap');\n\n:root{\n  --paper:#FAF8F4; --panel:#FFFFFF; --ink:#1B1A17; --muted:#76726A;\n  --faint:#B8B3A8; --line:#EBE6DC; --lineSoft:#F2EEE6;\n  --accent:#2E3FB0; --accent-soft:rgba(46,63,176,.08);\n  --ready:#3B7A57; --warn:#B8762E; --dim:#9C9D9F;\n  --serif:'Fraunces', Georgia, serif;\n  --ui:'Inter', system-ui, -apple-system, sans-serif;\n  --shadow:0 1px 2px rgba(20,18,14,.04);\n}\n*{ box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }\nhtml,body,#root{ height:100%; }\nbody{ font-family:var(--ui); background:var(--paper); color:var(--ink); font-size:14px; line-height:1.5; }\nbutton{ font-family:inherit; cursor:pointer; border:none; background:none; color:inherit; }\ninput{ font-family:inherit; }\n.serif{ font-family:var(--serif); }\n.tnum{ font-variant-numeric:tabular-nums; }\n::-webkit-scrollbar{ width:9px; height:9px; }\n::-webkit-scrollbar-thumb{ background:var(--line); border-radius:9px; }\n::-webkit-scrollbar-track{ background:transparent; }\n\n.eyebrow{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--faint); }\n.kicker{ font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); }\n\n.card{ background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:20px; box-shadow:var(--shadow); }\n.card-head{ display:flex; align-items:baseline; justify-content:space-between; margin-bottom:14px; }\n.card-head h3{ font-size:14px; font-weight:600; }\n.card-head .hint{ font-size:11.5px; color:var(--faint); }\n\n.row{ display:flex; align-items:center; gap:11px; padding:9px 8px; border-radius:9px; width:100%; text-align:left; }\n.row:hover{ background:rgba(27,26,23,.03); }\n.cbox{ width:18px; height:18px; border-radius:6px; flex-shrink:0; display:grid; place-items:center;\n  border:1.5px solid var(--faint); transition:all .15s; }\n.cbox.on{ background:var(--ready); border-color:var(--ready); }\n.pill{ font-size:11px; padding:2px 9px; border-radius:20px; font-weight:500; white-space:nowrap; }\n.pill.owner{ color:var(--muted); background:var(--lineSoft); }\n.dot{ width:6px; height:6px; border-radius:50%; flex-shrink:0; }\n\n.bar{ height:7px; border-radius:7px; background:var(--lineSoft); overflow:hidden; }\n.bar>i{ display:block; height:100%; border-radius:7px; transition:width .5s cubic-bezier(.4,0,.2,1); }\n\n.btn{ padding:9px 15px; border-radius:9px; font-size:13px; font-weight:500; display:inline-flex; align-items:center; gap:7px; }\n.btn.dark{ background:var(--ink); color:#fff; }\n.btn.ghost{ border:1px solid var(--line); background:var(--panel); }\n.btn.ghost.on{ border-color:var(--accent); color:var(--accent); background:var(--accent-soft); }\n\n.seg{ display:inline-flex; background:var(--lineSoft); border-radius:10px; padding:3px; gap:2px; }\n.seg button{ padding:6px 13px; border-radius:8px; font-size:12.5px; font-weight:500; color:var(--muted); }\n.seg button.on{ background:var(--panel); color:var(--ink); box-shadow:var(--shadow); }\n\n.intro{ margin-bottom:24px; display:flex; align-items:flex-start; justify-content:space-between; gap:24px; }\n.intro p{ font-family:var(--serif); font-size:18px; line-height:1.5; max-width:580px; margin-top:6px; }\n";
  document.head.appendChild(el);
})();

import React from "react";

// src/App.jsx
import { Monitor, Smartphone } from "lucide-react";

// src/store.jsx
import { createContext, useContext, useReducer } from "react";

// src/data/trip.js
var DESTINATIONS = {
  vietnam: {
    label: "Vietnam",
    flag: "\u{1F1FB}\u{1F1F3}",
    international: true,
    visaRequired: true,
    currency: "VND",
    fx: 305
    /* ₹1 ≈ 305 VND */
  },
  japan: { label: "Japan", flag: "\u{1F1EF}\u{1F1F5}", international: true, visaRequired: false, currency: "JPY", fx: 1.8 },
  goa: { label: "Goa", flag: "\u{1F3D6}\uFE0F", international: false, visaRequired: false, currency: "INR", fx: 1 },
  udaipur: { label: "Udaipur", flag: "\u{1F3F0}", international: false, visaRequired: false, currency: "INR", fx: 1 }
};
var initialState = {
  view: "desktop",
  // desktop = planning · mobile = execution
  mode: "solo",
  // solo | group   (the fork, not a setting buried in options)
  module: "overview",
  trip: {
    name: "Vietnam",
    destinationKey: "vietnam",
    cities: "Hanoi \xB7 H\u1ED9i An \xB7 H\u1ED3 Ch\xED Minh",
    start: "2026-10-02",
    end: "2026-10-14",
    nights: 12,
    planningWindowDays: 30,
    // "comfortable lead time" target
    homeCurrency: "\u20B9"
    // No preset "budget". The planned total is derived: it's the sum of every
    // thing you've added (below). The budget emerges from reality, not a slider.
  },
  members: [
    { id: "u1", name: "You", initials: "Y", you: true },
    { id: "u2", name: "Rahul", initials: "R" },
    { id: "u3", name: "Aman", initials: "A" }
  ],
  // Documents and Files are one module now. type drives the structured slots; everything else is "file".
  docs: [
    { id: "d1", type: "Passport", label: "Passport \u2014 valid to 2029", uploaded: true, essential: true },
    { id: "d2", type: "Visa", label: "Vietnam e-visa", uploaded: false, essential: true },
    { id: "d3", type: "Insurance", label: "Travel insurance policy", uploaded: false, essential: true },
    { id: "d4", type: "Ticket", label: "Boarding pass \u2014 BLR\u2192HAN", uploaded: true, essential: false }
  ],
  bookings: [
    { id: "b1", type: "Flight", title: "BLR \u2192 HAN \xB7 Vietnam Airlines", date: "2 Oct", cost: 31400, status: "Booked", outbound: true, essential: true },
    { id: "b2", type: "Hotel", title: "Hanoi \xB7 La Sinfon\xEDa del Rey", date: "2\u20135 Oct", cost: 9200, status: "Planned", nights: 3, essential: true },
    { id: "b3", type: "Hotel", title: "H\u1ED9i An \xB7 Little Riverside", date: "5\u20139 Oct", cost: 11800, status: "Booked", nights: 4, essential: true },
    { id: "b4", type: "Activity", title: "H\u1EA1 Long Bay overnight cruise", date: "3 Oct", cost: 7600, status: "Paid", nights: 1, essential: false },
    { id: "b5", type: "Transit", title: "Scooter \xB7 H\u1ED9i An (3 days)", date: "6 Oct", cost: 1500, status: "Planned", essential: false },
    { id: "b6", type: "Flight", title: "DAD \u2192 SGN \xB7 VietJet", date: "9 Oct", cost: 4200, status: "Planned", essential: true }
  ],
  checklist: [
    { id: "c1", section: "Before you go", label: "Apply for e-visa", done: true, owner: "u1", essential: true },
    { id: "c2", section: "Before you go", label: "Buy travel insurance", done: false, owner: "u1", essential: true },
    { id: "c3", section: "Before you go", label: "Notify bank of travel", done: false, owner: "u1", essential: false },
    { id: "c4", section: "Before you go", label: "Vaccinations (Hep A, Typhoid)", done: true, owner: "u2", essential: false },
    { id: "c5", section: "Pack", label: "Universal power adapter", done: false, owner: "u1", essential: false },
    { id: "c6", section: "Pack", label: "Rain shell (monsoon tail)", done: false, owner: "u3", essential: false },
    { id: "c7", section: "There", label: "Book H\u1ED9i An lantern workshop", done: false, owner: "u2", essential: false }
  ],
  // "Things" come in two kinds. Reservations are the bookings above.
  // EXTRAS are the things you'll spend on that aren't reservations — each with a
  // planned amount. There is no separate budget; planned = sum of all estimates.
  extras: [
    { id: "x1", label: "Food & drink", category: "Food", estimate: 6e3 },
    { id: "x2", label: "Getting around (taxis, fuel)", category: "Getting around", estimate: 3e3 },
    { id: "x3", label: "SIM & data", category: "Connectivity", estimate: 800 },
    { id: "x4", label: "Shopping & souvenirs", category: "Shopping", estimate: 5e3 }
  ],
  // Actual spend on the ground. Each expense is a real thing that happened.
  // It supplies the "actual" for its category, and (in a group) drives settlement.
  expenses: [
    { id: "e1", label: "Airport taxi", amount: 1200, paidBy: "u1", split: ["u1", "u2", "u3"], category: "Getting around" },
    { id: "e2", label: "B\xFAn ch\u1EA3 dinner", amount: 1800, paidBy: "u3", split: ["u1", "u2", "u3"], category: "Food" },
    { id: "e3", label: "SIM card", amount: 800, paidBy: "u2", split: ["u1", "u2", "u3"], category: "Connectivity" }
  ],
  // Day plan. Places live here as a layer rather than a separate module.
  days: [
    { d: 2, label: "Arrive Hanoi", tone: "#C9543D", places: ["Old Quarter", "Ho\xE0n Ki\u1EBFm Lake"] },
    { d: 3, label: "H\u1EA1 Long cruise", tone: "#2E6F8E", places: ["H\u1EA1 Long Bay"] },
    { d: 4, label: "Hanoi streets", tone: "#6B7A3A", places: ["Train Street", "Temple of Literature"] },
    { d: 5, label: "Fly to H\u1ED9i An", tone: "#C99A3D", places: ["An B\xE0ng Beach"] },
    { d: 6, label: "Lantern town", tone: "#A03D5E", places: ["Japanese Bridge", "Night Market"] },
    { d: 7, label: "My Son ruins", tone: "#4A6B5A", places: ["My Son Sanctuary"] },
    { d: 8, label: "Beach + tailor", tone: "#2E6F8E", places: ["An B\xE0ng Beach", "Yaly Couture"] },
    { d: 9, label: "Fly to Saigon", tone: "#C9543D", places: ["B\u1EBFn Th\xE0nh Market"] }
  ],
  activity: [
    { who: "Rahul", what: "logged \u20B97,600 \u2014 H\u1EA1 Long cruise", when: "2h ago", kind: "money" },
    { who: "Aman", what: "uploaded boarding pass", when: "5h ago", kind: "doc" },
    { who: "You", what: "booked H\u1ED9i An hotel", when: "Yesterday", kind: "booking" },
    { who: "Rahul", what: "added Train Street to day 4", when: "2 days ago", kind: "plan" }
  ],
  ui: { moneyTab: "actual", showWhy: false }
};
var BOOKED = ["Booked", "Paid", "Completed"];
var STATUS_CYCLE = ["Planned", "Booked", "Paid", "Completed", "Cancelled"];

// src/store.jsx
var StoreContext = createContext(null);
function reducer(s, a) {
  switch (a.type) {
    case "view":
      return { ...s, view: a.value };
    case "mode":
      return { ...s, mode: a.value, module: a.value === "solo" && s.module === "members" ? "overview" : s.module };
    case "module":
      return { ...s, module: a.value };
    case "ui":
      return { ...s, ui: { ...s.ui, ...a.value } };
    case "toggleTask":
      return { ...s, checklist: s.checklist.map((c) => c.id === a.id ? { ...c, done: !c.done } : c) };
    case "addTask":
      return { ...s, checklist: [...s.checklist, {
        id: "n" + Date.now(),
        section: a.section || "Before you go",
        label: a.label,
        done: false,
        owner: "u1",
        essential: false
      }] };
    case "cycleBooking":
      return { ...s, bookings: s.bookings.map((b) => b.id === a.id ? { ...b, status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(b.status) + 1) % STATUS_CYCLE.length] } : b) };
    case "toggleDoc":
      return { ...s, docs: s.docs.map((d) => d.id === a.id ? { ...d, uploaded: !d.uploaded } : d) };
    case "addExpense":
      return { ...s, expenses: [...s.expenses, { id: "e" + Date.now(), ...a.expense }] };
    default:
      return s;
  }
}
function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return /* @__PURE__ */ React.createElement(StoreContext.Provider, { value: { state, dispatch } }, children);
}
var useStore = () => useContext(StoreContext);

// src/components/Sidebar.jsx
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Wallet,
  FileText,
  CheckSquare,
  Activity,
  Users,
  Settings,
  MapPin,
  Folder,
  Compass
} from "lucide-react";

// src/components/Primitives.jsx
function Ring({ size = 120, stroke = 11, pct = 0, mini = false }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - pct / 100);
  const col = pct >= 70 ? "var(--ready)" : pct >= 40 ? "var(--warn)" : "var(--accent)";
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: size, height: size, flexShrink: 0 } }, /* @__PURE__ */ React.createElement("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--lineSoft)", strokeWidth: stroke }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: size / 2,
      cy: size / 2,
      r,
      fill: "none",
      stroke: col,
      strokeWidth: stroke,
      strokeDasharray: circ,
      strokeDashoffset: off,
      strokeLinecap: "round",
      style: { transition: "stroke-dashoffset .6s cubic-bezier(.4,0,.2,1), stroke .3s" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "serif tnum", style: { fontWeight: 500, lineHeight: 1, fontSize: mini ? size * 0.42 : size * 0.3 } }, pct, !mini && /* @__PURE__ */ React.createElement("span", { style: { fontSize: size * 0.13, color: "var(--muted)" } }, "%"))));
}
function Bar({ value }) {
  const v = Math.max(0, Math.min(1, value));
  const col = v > 0.92 ? "var(--warn)" : "var(--ready)";
  return /* @__PURE__ */ React.createElement("div", { className: "bar" }, /* @__PURE__ */ React.createElement("i", { style: { width: `${v * 100}%`, background: col } }));
}
function Intro({ kicker, children, right }) {
  return /* @__PURE__ */ React.createElement("div", { className: "intro" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "kicker" }, kicker), /* @__PURE__ */ React.createElement("p", null, children)), right);
}

// src/engine/readiness.js
function daysUntil(dateStr) {
  return Math.max(0, Math.round((new Date(dateStr) - /* @__PURE__ */ new Date()) / 864e5));
}
function computeReadiness(state) {
  const { trip, checklist, bookings, docs } = state;
  const rule = DESTINATIONS[trip.destinationKey];
  const doc = (t) => docs.find((d) => d.type === t);
  const passport = doc("Passport");
  const visa = doc("Visa");
  const insurance = doc("Insurance");
  const coveredNights = Math.min(
    trip.nights,
    bookings.filter((b) => b.type === "Hotel" && BOOKED.includes(b.status)).reduce((s, b) => s + (b.nights || 0), 0)
  );
  const accomFrac = trip.nights ? coveredNights / trip.nights : 1;
  const outbound = bookings.find((b) => b.outbound);
  const flightFrac = outbound && BOOKED.includes(outbound.status) ? 1 : 0;
  const essTasks = checklist.filter((t) => t.essential);
  const essDone = essTasks.filter((t) => t.done).length;
  const taskFrac = essTasks.length ? essDone / essTasks.length : 1;
  const days = daysUntil(trip.start);
  const bufferFrac = Math.min(1, days / trip.planningWindowDays);
  const lines = [];
  const add = (label, weight, frac, opts = {}) => lines.push({ label, weight, frac: Math.max(0, Math.min(1, frac)), ...opts });
  if (rule.international)
    add("Passport valid 6+ months", 14, passport?.uploaded ? 1 : 0, {
      required: true,
      why: "International trip"
    });
  if (rule.visaRequired)
    add("Visa obtained", 15, visa?.uploaded ? 1 : 0, {
      required: true,
      why: `${rule.label} requires a visa`
    });
  if (rule.international)
    add("Travel insurance", 11, insurance?.uploaded ? 1 : 0, {
      required: true,
      why: "Recommended for any international trip"
    });
  add("Outbound flight booked", 18, flightFrac, {
    detail: outbound ? outbound.title : "No outbound leg yet"
  });
  add("Every night has a bed", 18, accomFrac, {
    detail: `${coveredNights} of ${trip.nights} nights covered`
  });
  add("Essential tasks done", 14, taskFrac, {
    detail: `${essDone} of ${essTasks.length} complete`
  });
  add("Comfortable lead time", 10, bufferFrac, {
    detail: `${days} days out \xB7 target ${trip.planningWindowDays}`
  });
  const totalWeight = lines.reduce((s, l) => s + l.weight, 0);
  const earned = lines.reduce((s, l) => s + l.weight * l.frac, 0);
  const score = Math.round(earned / totalWeight * 100);
  const next = [...lines].filter((l) => l.frac < 1).sort((a, b) => b.weight * (1 - b.frac) - a.weight * (1 - a.frac))[0];
  return { score, lines, totalWeight, nextUp: next };
}

// src/components/Sidebar.jsx
var CORE = [
  ["overview", "Overview", LayoutDashboard],
  ["itinerary", "Itinerary", CalendarDays],
  ["bookings", "Bookings", Ticket],
  ["money", "Money", Wallet],
  ["documents", "Documents", FileText],
  ["checklist", "Checklist", CheckSquare]
];
var SECONDARY = [
  ["activity", "Activity", Activity],
  ["members", "Members", Users],
  // group only
  ["settings", "Settings", Settings]
];
function Sidebar() {
  const { state, dispatch } = useStore();
  const R = computeReadiness(state);
  const dest = DESTINATIONS[state.trip.destinationKey];
  const secondary = SECONDARY.filter(([k]) => k !== "members" || state.mode === "group");
  const Item = ([key, label, Icon]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key,
      className: "nav",
      onClick: () => dispatch({ type: "module", value: key }),
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: 8,
        fontSize: 13,
        textAlign: "left",
        transition: "background .12s",
        background: state.module === key ? "var(--accent-soft)" : "transparent",
        color: state.module === key ? "var(--accent)" : "var(--muted)",
        fontWeight: state.module === key ? 550 : 450
      }
    },
    /* @__PURE__ */ React.createElement(Icon, { size: 15, strokeWidth: 2 }),
    " ",
    label
  );
  return /* @__PURE__ */ React.createElement("aside", { style: {
    width: 244,
    flexShrink: 0,
    borderRight: "1px solid var(--line)",
    background: "var(--paper)",
    height: "100vh",
    position: "sticky",
    top: 0,
    overflowY: "auto",
    padding: "20px 14px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 8px 16px", display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { className: "serif", style: { fontSize: 23, fontWeight: 500, letterSpacing: "-.01em" } }, "Pando"), /* @__PURE__ */ React.createElement("span", { className: "serif", style: { fontSize: 11, color: "var(--faint)", fontStyle: "italic" } }, "every trip is a project")), /* @__PURE__ */ React.createElement("button", { className: "nav", style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", fontSize: 13, color: "var(--muted)" } }, /* @__PURE__ */ React.createElement(Compass, { size: 15 }), " All trips"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10.5, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)", padding: "12px 10px 6px", fontWeight: 600 } }, "Active trip"), /* @__PURE__ */ React.createElement("div", { style: {
    margin: "0 4px 10px",
    padding: "10px 11px",
    borderRadius: 10,
    background: "var(--panel)",
    border: "1px solid var(--line)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "var(--shadow)"
  } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 } }, /* @__PURE__ */ React.createElement("span", null, dest.flag), " ", state.trip.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--muted)", marginTop: 1 } }, state.mode === "group" ? `${state.members.length} travellers` : "Solo")), /* @__PURE__ */ React.createElement(Ring, { size: 30, stroke: 3.5, pct: R.score, mini: true })), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 2px" } }, CORE.map(Item)), /* @__PURE__ */ React.createElement("div", { style: { height: 1, background: "var(--lineSoft)", margin: "8px 10px" } }), /* @__PURE__ */ React.createElement("div", { style: { margin: "0 2px" } }, secondary.map(Item)));
}

// src/mobile/MobileApp.jsx
import { useState } from "react";
import {
  Plane,
  Wallet as Wallet2,
  FileText as FileText2,
  Plus,
  Clock,
  MapPin as MapPin2,
  Check,
  WifiOff,
  ArrowRight,
  ChevronRight,
  QrCode
} from "lucide-react";

// src/lib/format.js
var inr = (n) => "\u20B9" + Number(Math.round(n)).toLocaleString("en-IN");
function localCurrency(state, rupees) {
  const rule = DESTINATIONS[state.trip.destinationKey];
  if (rule.currency === "INR") return null;
  const v = rupees * rule.fx;
  return `${Math.round(v).toLocaleString()} ${rule.currency}`;
}
var RES_CATEGORY = { Flight: "Transport", Transit: "Transport", Hotel: "Stay", Activity: "Activities" };
function ledger(state) {
  const things = [];
  state.bookings.filter((b) => b.status !== "Cancelled").forEach(
    (b) => things.push({
      id: b.id,
      label: b.title,
      category: RES_CATEGORY[b.type] || "Other",
      estimate: b.cost,
      actual: BOOKED.includes(b.status) ? b.cost : 0,
      kind: "booking",
      status: b.status
    })
  );
  state.extras.forEach((x) => {
    const actual = state.expenses.filter((e) => e.category === x.category).reduce((s, e) => s + e.amount, 0);
    things.push({ id: x.id, label: x.label, category: x.category, estimate: x.estimate, actual, kind: "extra" });
  });
  const byCat = {};
  things.forEach((t) => {
    byCat[t.category] ||= { estimate: 0, actual: 0, things: [] };
    byCat[t.category].estimate += t.estimate;
    byCat[t.category].actual += t.actual;
    byCat[t.category].things.push(t);
  });
  const totals = things.reduce(
    (a, t) => ({ estimate: a.estimate + t.estimate, actual: a.actual + t.actual }),
    { estimate: 0, actual: 0 }
  );
  return { things, byCat, totals };
}
function settlement(state) {
  const balances = {};
  state.members.forEach((m) => balances[m.id] = 0);
  state.expenses.forEach((e) => {
    const share = e.amount / e.split.length;
    balances[e.paidBy] += e.amount;
    e.split.forEach((id) => balances[id] -= share);
  });
  const debtors = [], creditors = [];
  Object.entries(balances).forEach(([id, bal]) => {
    if (bal < -1) debtors.push({ id, amt: -bal });
    else if (bal > 1) creditors.push({ id, amt: bal });
  });
  debtors.sort((a, b) => b.amt - a.amt);
  creditors.sort((a, b) => b.amt - a.amt);
  const transfers = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt);
    transfers.push({ from: debtors[i].id, to: creditors[j].id, amt: pay });
    debtors[i].amt -= pay;
    creditors[j].amt -= pay;
    if (debtors[i].amt < 1) i++;
    if (creditors[j].amt < 1) j++;
  }
  return { balances, transfers };
}
var nameOf = (state, id) => state.members.find((m) => m.id === id)?.name || "\u2014";

// src/mobile/MobileApp.jsx
var TABS = [
  ["today", "Today", Clock],
  ["trip", "Trip", MapPin2],
  ["money", "Money", Wallet2],
  ["docs", "Docs", FileText2]
];
function MobileApp() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("today");
  const R = computeReadiness(state);
  const days = daysUntil(state.trip.start);
  const dest = DESTINATIONS[state.trip.destinationKey];
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px 16px", background: "var(--paper)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 380, height: 760, borderRadius: 42, background: "#111", padding: 11, boxShadow: "0 30px 70px rgba(20,18,14,.28)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: "100%", borderRadius: 32, background: "var(--paper)", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 20px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, color: "var(--ink)" } }, "9:41"), /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, color: "var(--ready)" } }, /* @__PURE__ */ React.createElement(WifiOff, { size: 12 }), " Offline-ready")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "4px 18px 16px" } }, tab === "today" && /* @__PURE__ */ React.createElement(Today, { state, R, days, dispatch }), tab === "trip" && /* @__PURE__ */ React.createElement(Trip, { state }), tab === "money" && /* @__PURE__ */ React.createElement(Money, { state, dest }), tab === "docs" && /* @__PURE__ */ React.createElement(Docs, { state, dispatch })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 8px 16px", borderTop: "1px solid var(--line)", background: "var(--panel)" } }, TABS.slice(0, 2).map(([k, l, Icon]) => /* @__PURE__ */ React.createElement(NavBtn, { key: k, k, l, Icon, tab, setTab })), /* @__PURE__ */ React.createElement("button", { style: { width: 46, height: 46, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "grid", placeItems: "center", marginTop: -6, boxShadow: "0 6px 16px rgba(20,18,14,.25)" } }, /* @__PURE__ */ React.createElement(Plus, { size: 22 })), TABS.slice(2).map(([k, l, Icon]) => /* @__PURE__ */ React.createElement(NavBtn, { key: k, k, l, Icon, tab, setTab }))))));
}
function NavBtn({ k, l, Icon, tab, setTab }) {
  const on = tab === k;
  return /* @__PURE__ */ React.createElement("button", { onClick: () => setTab(k), style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? "var(--accent)" : "var(--faint)", width: 56 } }, /* @__PURE__ */ React.createElement(Icon, { size: 20, strokeWidth: on ? 2.3 : 2 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: on ? 600 : 500 } }, l));
}
function Today({ state, R, days, dispatch }) {
  const next = state.bookings.find((b) => b.status !== "Cancelled");
  const openTasks = state.checklist.filter((c) => !c.done).slice(0, 2);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 2px 14px" } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, days, " days out \xB7 ", R.score, "% ready"), /* @__PURE__ */ React.createElement("h1", { className: "serif", style: { fontSize: 30, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.05, marginTop: 4 } }, "What's next")), /* @__PURE__ */ React.createElement("div", { style: { borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 24px rgba(20,18,14,.12)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--ink)", color: "#fff", padding: "16px 18px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, opacity: 0.7, letterSpacing: ".1em", textTransform: "uppercase" } }, /* @__PURE__ */ React.createElement(Plane, { size: 12, style: { verticalAlign: "middle", marginRight: 6 } }), "Boarding pass"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, opacity: 0.7 } }, "2 Oct \xB7 06:15")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, marginTop: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 28, fontWeight: 500 } }, "BLR")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, borderTop: "1px dashed rgba(255,255,255,.35)", position: "relative" } }, /* @__PURE__ */ React.createElement(Plane, { size: 15, style: { position: "absolute", right: -2, top: -8, color: "#fff" } })), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 28, fontWeight: 500 } }, "HAN")))), /* @__PURE__ */ React.createElement("div", { style: { background: "var(--panel)", padding: "13px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "SEAT"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, "14A")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "GATE"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, "B22")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "BOARDING"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, "05:45")), /* @__PURE__ */ React.createElement(QrCode, { size: 34, color: "var(--ink)" }))), /* @__PURE__ */ React.createElement(SectionLabel, null, "Up next"), next && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 14, marginBottom: 14, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 38, height: 38, borderRadius: 10, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)" } }, /* @__PURE__ */ React.createElement(Plane, { size: 17 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600 } }, next.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)" } }, next.date)), /* @__PURE__ */ React.createElement(ChevronRight, { size: 18, color: "var(--faint)" })), /* @__PURE__ */ React.createElement(SectionLabel, null, "Before you fly"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "4px 8px" } }, openTasks.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, className: "row", onClick: () => dispatch({ type: "toggleTask", id: t.id }) }, /* @__PURE__ */ React.createElement("span", { className: "cbox" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13.5 } }, t.label))), openTasks.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 12, fontSize: 13, color: "var(--muted)" } }, "You're all set.")));
}
function Trip({ state }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "serif", style: { fontSize: 24, fontWeight: 500, padding: "8px 2px 14px" } }, "Itinerary"), state.days.slice(0, 6).map((d) => /* @__PURE__ */ React.createElement("div", { key: d.d, className: "card", style: { padding: 14, marginBottom: 10, display: "flex", gap: 13, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, borderRadius: 9, background: d.tone, color: "#fff", display: "grid", placeItems: "center" } }, /* @__PURE__ */ React.createElement("span", { className: "serif", style: { fontSize: 18, fontWeight: 500 } }, d.d)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 600 } }, d.label), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--muted)" } }, d.places.join(" \xB7 "))))));
}
function Money({ state, dest }) {
  const [amt, setAmt] = useState("1000");
  const local = localCurrency(state, Number(amt) || 0);
  const L = ledger(state);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "serif", style: { fontSize: 24, fontWeight: 500, padding: "8px 2px 6px" } }, "Money"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 14, padding: "0 2px 14px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "SPENT"), /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 18, fontWeight: 500, color: "var(--ready)" } }, inr(L.totals.actual))), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--faint)" } }, "/"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "PLANNED"), /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 18, fontWeight: 500 } }, inr(L.totals.estimate)))), /* @__PURE__ */ React.createElement("div", { className: "card", style: { marginBottom: 16, padding: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow", style: { marginBottom: 10 } }, "Quick convert"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, "\u20B9 INR"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: amt,
      onChange: (e) => setAmt(e.target.value.replace(/[^0-9]/g, "")),
      style: { width: "100%", border: "none", outline: "none", fontFamily: "var(--serif)", fontSize: 24, fontWeight: 500, background: "transparent" }
    }
  )), /* @__PURE__ */ React.createElement(ArrowRight, { size: 18, color: "var(--faint)" }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--faint)" } }, dest.currency), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 24, fontWeight: 500 } }, local || amt)))), /* @__PURE__ */ React.createElement(SectionLabel, null, "Recent spend"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "4px 14px" } }, state.expenses.map((e, i) => /* @__PURE__ */ React.createElement("div", { key: e.id, style: { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < state.expenses.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13.5 } }, e.label), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 13.5, fontWeight: 600 } }, inr(e.amount))))));
}
function Docs({ state, dispatch }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "serif", style: { fontSize: 24, fontWeight: 500, padding: "8px 2px 6px" } }, "Documents"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--ready)", display: "flex", alignItems: "center", gap: 6, padding: "0 2px 14px" } }, /* @__PURE__ */ React.createElement(WifiOff, { size: 12 }), " Saved on this phone \u2014 works offline"), state.docs.map((d) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d.id,
      onClick: () => dispatch({ type: "toggleDoc", id: d.id }),
      className: "card",
      style: { width: "100%", textAlign: "left", padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }
    },
    /* @__PURE__ */ React.createElement("span", { style: { width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: d.uploaded ? "rgba(59,122,87,.13)" : "rgba(184,118,46,.13)", color: d.uploaded ? "var(--ready)" : "var(--warn)" } }, d.uploaded ? /* @__PURE__ */ React.createElement(Check, { size: 17, strokeWidth: 2.5 }) : /* @__PURE__ */ React.createElement(Plus, { size: 17 })),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, d.type), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 500 } }, d.label))
  )));
}
function SectionLabel({ children }) {
  return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--faint)", fontWeight: 600, margin: "6px 2px 8px" } }, children);
}

// src/modules/Overview.jsx
import { useState as useState2 } from "react";
import { Plane as Plane2, Hotel, Car, Compass as Compass2, Check as Check2, ChevronDown, ArrowRight as ArrowRight2, Sun } from "lucide-react";
var bIcon = (t) => t === "Flight" ? Plane2 : t === "Hotel" ? Hotel : t === "Transit" ? Car : Compass2;
var sColor = (s) => s === "Cancelled" ? "var(--dim)" : s === "Planned" ? "var(--warn)" : "var(--ready)";
function Overview() {
  const { state, dispatch } = useStore();
  const [why, setWhy] = useState2(false);
  const R = computeReadiness(state);
  const L = ledger(state);
  const open = state.checklist.filter((c) => !c.done);
  const upcoming = state.bookings.filter((b) => b.status !== "Cancelled").slice(0, 3);
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { gridColumn: "1 / -1", padding: 0, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 30, padding: "24px 28px" } }, /* @__PURE__ */ React.createElement(Ring, { size: 120, stroke: 11, pct: R.score }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "Readiness"), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 22, fontWeight: 500, margin: "2px 0 6px" } }, R.score >= 90 ? "Nearly there." : R.score >= 70 ? "On track." : R.score >= 40 ? "Coming together." : "Just getting started."), R.nextUp && /* @__PURE__ */ React.createElement("button", { onClick: () => setWhy((v) => !v), style: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted)" } }, /* @__PURE__ */ React.createElement("span", null, "Next: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--ink)", fontWeight: 600 } }, R.nextUp.label)), /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, style: { transform: why ? "rotate(180deg)" : "none", transition: "transform .2s" } })))), /* @__PURE__ */ React.createElement("div", { style: {
    maxHeight: why ? 460 : 0,
    overflow: "hidden",
    transition: "max-height .35s ease",
    borderTop: why ? "1px solid var(--line)" : "none",
    background: "var(--paper)"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 28px 22px" } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow", style: { marginBottom: 12 } }, "Why ", R.score, "% \u2014 every point accounted for"), R.lines.map((l) => {
    const earned = Math.round(l.weight * l.frac);
    const done = l.frac >= 1;
    return /* @__PURE__ */ React.createElement("div", { key: l.label, style: { display: "flex", alignItems: "center", gap: 12, padding: "7px 0" } }, /* @__PURE__ */ React.createElement("span", { className: "cbox", style: { width: 16, height: 16, borderColor: done ? "var(--ready)" : "var(--faint)", background: done ? "var(--ready)" : "transparent" } }, done && /* @__PURE__ */ React.createElement(Check2, { size: 10, color: "#fff", strokeWidth: 3 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500 } }, l.label, l.required && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--accent)", fontWeight: 600, marginLeft: 8, letterSpacing: ".05em", textTransform: "uppercase" } }, "required")), (l.detail || l.why) && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--muted)" } }, l.detail || l.why)), l.frac > 0 && l.frac < 1 && /* @__PURE__ */ React.createElement("div", { style: { width: 60 } }, /* @__PURE__ */ React.createElement(Bar, { value: l.frac })), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 12.5, fontWeight: 600, width: 64, textAlign: "right", color: done ? "var(--ready)" : "var(--faint)" } }, earned, " / ", l.weight));
  })))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("h3", null, "What still needs to happen"), /* @__PURE__ */ React.createElement("span", { className: "hint" }, open.length, " open")), open.slice(0, 5).map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, className: "row", onClick: () => dispatch({ type: "toggleTask", id: t.id }) }, /* @__PURE__ */ React.createElement("span", { className: "cbox" }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13.5 } }, t.label), state.mode === "group" && /* @__PURE__ */ React.createElement("span", { className: "pill owner" }, nameOf(state, t.owner)))), open.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "serif", style: { padding: "12px 4px", color: "var(--faint)", fontStyle: "italic" } }, "Everything's done. Go pack.")), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("h3", null, "Money"), /* @__PURE__ */ React.createElement("span", { className: "hint" }, L.things.length, " things")), /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 30, fontWeight: 500, letterSpacing: "-.01em" } }, inr(L.totals.actual), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "var(--muted)", fontFamily: "var(--ui)" } }, " of ", inr(L.totals.estimate), " planned")), /* @__PURE__ */ React.createElement("div", { style: { margin: "14px 0 8px" } }, /* @__PURE__ */ React.createElement(Bar, { value: L.totals.estimate ? L.totals.actual / L.totals.estimate : 0 })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)" } }, inr(L.totals.estimate - L.totals.actual), " still to commit")), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("h3", null, "Upcoming"), /* @__PURE__ */ React.createElement("span", { className: "hint" }, "next reservations")), upcoming.map((b) => {
    const Icon = bIcon(b.type);
    return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: "1px solid var(--lineSoft)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 30, height: 30, borderRadius: 8, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)" } }, /* @__PURE__ */ React.createElement(Icon, { size: 15 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, b.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "var(--muted)" } }, b.date)), /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: sColor(b.status) } }));
  })), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("h3", null, state.trip.cities.split("\xB7")[0].trim()), /* @__PURE__ */ React.createElement("span", { className: "hint" }, "on arrival")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14 } }, /* @__PURE__ */ React.createElement(Sun, { size: 30, color: "var(--warn)", strokeWidth: 1.6 }), /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 30, fontWeight: 500 } }, "29\xB0"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12.5, color: "var(--muted)", lineHeight: 1.4 } }, "Warm, humid", /* @__PURE__ */ React.createElement("br", null), "tail of monsoon"))), /* @__PURE__ */ React.createElement("div", { className: "card" }, /* @__PURE__ */ React.createElement("div", { className: "card-head" }, /* @__PURE__ */ React.createElement("h3", null, "Recent activity"), /* @__PURE__ */ React.createElement("span", { className: "hint" })), state.activity.slice(0, 4).map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 9, padding: "7px 0", fontSize: 12.5, alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: "var(--accent)", marginTop: 6 } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("b", { style: { fontWeight: 600 } }, a.who), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--muted)" } }, a.what)), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--faint)", fontSize: 11, whiteSpace: "nowrap" } }, a.when)))));
}

// src/modules/Itinerary.jsx
function Itinerary() {
  const { state } = useStore();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Day by day" }, "Each day is a stamp. Places live here as a layer \u2014 drag a saved place onto a day to schedule it. This is where the editorial soul of the trip lives."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 } }, state.days.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.d }, /* @__PURE__ */ React.createElement("div", { style: {
    aspectRatio: "0.82",
    borderRadius: 4,
    padding: 7,
    background: "#fff",
    filter: "drop-shadow(0 2px 6px rgba(20,18,14,.1))",
    WebkitMaskImage: "radial-gradient(circle at 4px 4px, transparent 3px, #000 3.5px)",
    maskImage: "radial-gradient(circle at 4px 4px, transparent 3px, #000 3.5px)",
    WebkitMaskSize: "9px 9px",
    maskSize: "9px 9px"
  } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", borderRadius: 2, background: day.tone, padding: 11, display: "flex", flexDirection: "column", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { className: "serif", style: { fontSize: 26, fontWeight: 500, color: "#fff", lineHeight: 1 } }, day.d), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11.5, color: "rgba(255,255,255,.94)", fontWeight: 500 } }, day.label))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--muted)", marginBottom: 4 } }, day.d, " Oct"), day.places.map((p) => /* @__PURE__ */ React.createElement("div", { key: p, style: { fontSize: 11.5, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, padding: "2px 0" } }, /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: day.tone } }), p)))))));
}

// src/modules/Bookings.jsx
import { Plane as Plane3, Hotel as Hotel2, Car as Car2, Compass as Compass3 } from "lucide-react";
var bIcon2 = (t) => t === "Flight" ? Plane3 : t === "Hotel" ? Hotel2 : t === "Transit" ? Car2 : Compass3;
var sColor2 = (s) => s === "Cancelled" ? "var(--dim)" : s === "Planned" ? "var(--warn)" : "var(--ready)";
function Bookings() {
  const { state, dispatch } = useStore();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Every reservation, one place" }, "Click any status to advance it: Planned \u2192 Booked \u2192 Paid \u2192 Completed \u2192 Cancelled. Essential bookings \u2014 your flights and beds \u2014 feed Readiness directly."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden" } }, state.bookings.map((b, i) => {
    const Icon = bIcon2(b.type);
    return /* @__PURE__ */ React.createElement("div", { key: b.id, style: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < state.bookings.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 34, height: 34, borderRadius: 9, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { size: 16 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, b.title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)" } }, b.type, " \xB7 ", b.date, b.essential && " \xB7 essential")), /* @__PURE__ */ React.createElement("div", { className: "tnum", style: { fontSize: 13.5, color: "var(--muted)", marginRight: 4 } }, inr(b.cost)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => dispatch({ type: "cycleBooking", id: b.id }),
        className: "pill",
        style: { display: "flex", alignItems: "center", gap: 7, padding: "5px 11px", minWidth: 96, justifyContent: "center", fontWeight: 600, fontSize: 12, border: `1px solid ${sColor2(b.status)}33`, background: `${sColor2(b.status)}12`, color: sColor2(b.status) }
      },
      /* @__PURE__ */ React.createElement("span", { className: "dot", style: { background: sColor2(b.status) } }),
      b.status
    ));
  })));
}

// src/modules/Money.jsx
import { ArrowRight as ArrowRight3, Ticket as Ticket2, ShoppingBag } from "lucide-react";
function Money2() {
  const { state } = useStore();
  const L = ledger(state);
  const set = settlement(state);
  const cats = Object.entries(L.byCat);
  const pctActual = L.totals.estimate ? L.totals.actual / L.totals.estimate : 0;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "No budget. Only things." }, "Pando doesn't ask you to guess a budget. You add the ", /* @__PURE__ */ React.createElement("b", null, "things"), " a trip needs \u2014 flights, beds, food, a SIM \u2014 each with what you expect to pay. The planned total is just their sum; spend is what you've actually committed.", state.mode === "group" && " In a group, Pando settles who owes whom."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { marginBottom: 20, display: "flex", gap: 36, alignItems: "flex-end", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "Planned \xB7 sum of ", L.things.length, " things"), /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 34, fontWeight: 500, lineHeight: 1.1 } }, inr(L.totals.estimate))), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--faint)", fontSize: 22, paddingBottom: 4 } }, "\xB7"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, "Committed so far"), /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 34, fontWeight: 500, lineHeight: 1.1, color: "var(--ready)" } }, inr(L.totals.actual))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 180 } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6 } }, /* @__PURE__ */ React.createElement(Bar, { value: pctActual })), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)" } }, inr(L.totals.estimate - L.totals.actual), " still to commit"))), cats.map(([cat, g]) => /* @__PURE__ */ React.createElement("div", { key: cat, style: { marginBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "serif", style: { fontSize: 16, fontWeight: 500 } }, cat), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 12, color: "var(--muted)" } }, inr(g.actual), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--faint)" } }, "of"), " ", inr(g.estimate), " planned")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden" } }, g.things.map((t, i) => {
    const Icon = t.kind === "booking" ? Ticket2 : ShoppingBag;
    const paid = t.actual >= t.estimate && t.estimate > 0;
    return /* @__PURE__ */ React.createElement("div", { key: t.id, style: { display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", borderBottom: i < g.things.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 30, height: 30, borderRadius: 8, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { size: 14 })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13.5, fontWeight: 500 } }, t.label), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", minWidth: 150, display: "flex", justifyContent: "flex-end", gap: 18 } }, /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 13, color: "var(--muted)" } }, inr(t.estimate), " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--faint)" } }, "planned")), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 13, fontWeight: 600, width: 84, color: t.actual > 0 ? "var(--ready)" : "var(--faint)" } }, t.actual > 0 ? inr(t.actual) : "\u2014", " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 400, color: "var(--faint)" } }, paid ? "paid" : t.actual > 0 ? "so far" : "unpaid"))));
  })))), state.mode === "group" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 26 } }, /* @__PURE__ */ React.createElement("div", { className: "kicker", style: { marginBottom: 10 } }, "Settlement"), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden" } }, set.transfers.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 18, color: "var(--muted)", fontSize: 13 } }, "All square. Nobody owes anyone."), set.transfers.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < set.transfers.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13.5, fontWeight: 600 } }, nameOf(state, t.from)), /* @__PURE__ */ React.createElement(ArrowRight3, { size: 15, color: "var(--muted)" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13.5, fontWeight: 600, flex: 1 } }, nameOf(state, t.to)), /* @__PURE__ */ React.createElement("span", { className: "serif tnum", style: { fontSize: 17, fontWeight: 500 } }, inr(t.amt)))))));
}

// src/modules/Documents.jsx
import { Check as Check3, Plus as Plus2, FileText as FileText3 } from "lucide-react";
function Documents() {
  const { state, dispatch } = useStore();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Findable in two seconds" }, "Structured slots for what matters \u2014 passport, visa, insurance, tickets \u2014 plus everything else as files. Missing essentials hold your Readiness down, and stay cached offline on your phone."), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 } }, state.docs.map((d) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d.id,
      onClick: () => dispatch({ type: "toggleDoc", id: d.id }),
      style: { textAlign: "left", padding: "16px 18px", borderRadius: 12, background: "var(--panel)", display: "flex", alignItems: "center", gap: 14, width: "100%", boxShadow: "var(--shadow)", border: `1px solid ${d.uploaded ? "var(--line)" : "rgba(184,118,46,.34)"}` }
    },
    /* @__PURE__ */ React.createElement("span", { style: { width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, background: d.uploaded ? "rgba(59,122,87,.13)" : "rgba(184,118,46,.13)", color: d.uploaded ? "var(--ready)" : "var(--warn)" } }, d.uploaded ? /* @__PURE__ */ React.createElement(Check3, { size: 18, strokeWidth: 2.5 }) : /* @__PURE__ */ React.createElement(Plus2, { size: 18 })),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "eyebrow" }, d.type), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13.5, fontWeight: 500, marginTop: 1 } }, d.label)),
    d.essential && !d.uploaded && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--warn)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em" } }, "needed")
  ))));
}

// src/modules/Checklist.jsx
import { useState as useState3 } from "react";
import { Plus as Plus3, Check as Check4 } from "lucide-react";
function Checklist() {
  const { state, dispatch } = useStore();
  const [val, setVal] = useState3("");
  const R = computeReadiness(state);
  const sections = [...new Set(state.checklist.map((c) => c.section))];
  const add = () => {
    if (!val.trim()) return;
    dispatch({ type: "addTask", label: val.trim() });
    setVal("");
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "The engine of Readiness", right: /* @__PURE__ */ React.createElement(Ring, { size: 62, stroke: 6, pct: R.score }) }, "Every item you tick moves the score above. Items marked ", /* @__PURE__ */ React.createElement("b", null, "essential"), " are weighted heavier \u2014 they're what stands between you and the airport."), sections.map((sec) => {
    const items = state.checklist.filter((c) => c.section === sec);
    const done = items.filter((i) => i.done).length;
    return /* @__PURE__ */ React.createElement("div", { key: sec, style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("h3", { className: "serif", style: { fontSize: 17, fontWeight: 500 } }, sec), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 12, color: "var(--faint)" } }, done, "/", items.length)), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "6px 8px" } }, items.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, className: "row", onClick: () => dispatch({ type: "toggleTask", id: t.id }) }, /* @__PURE__ */ React.createElement("span", { className: "cbox" + (t.done ? " on" : "") }, t.done && /* @__PURE__ */ React.createElement(Check4, { size: 11, color: "#fff", strokeWidth: 3 })), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 13.5, color: t.done ? "var(--faint)" : "var(--ink)", textDecoration: t.done ? "line-through" : "none" } }, t.label), t.essential && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--accent)", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase" } }, "essential"), state.mode === "group" && /* @__PURE__ */ React.createElement("span", { className: "pill owner" }, nameOf(state, t.owner))))));
  }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, maxWidth: 440 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: val,
      onChange: (e) => setVal(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && add(),
      placeholder: "Add a task\u2026",
      style: { flex: 1, padding: "10px 13px", borderRadius: 9, border: "1px solid var(--line)", background: "var(--panel)", fontSize: 13.5, outline: "none" }
    }
  ), /* @__PURE__ */ React.createElement("button", { className: "btn dark", onClick: add }, /* @__PURE__ */ React.createElement(Plus3, { size: 14 }), " Add")));
}

// src/modules/Activity.jsx
import { Wallet as Wallet3, FileText as FileText4, Ticket as Ticket3, MapPin as MapPin3 } from "lucide-react";
var kindIcon = { money: Wallet3, doc: FileText4, booking: Ticket3, plan: MapPin3 };
function Activity2() {
  const { state } = useStore();
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Everything that happened" }, "One feed, like a GitHub history for your trip. Before departure it's an audit log; after you're home, it becomes the story of the trip."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "8px 4px" } }, state.activity.map((a, i) => {
    const Icon = kindIcon[a.kind] || MapPin3;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", gap: 13, padding: "12px 14px", borderBottom: i < state.activity.length - 1 ? "1px solid var(--lineSoft)" : "none", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 32, height: 32, borderRadius: 9, background: "var(--lineSoft)", display: "grid", placeItems: "center", color: "var(--muted)", flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Icon, { size: 15 })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, fontSize: 13.5 } }, /* @__PURE__ */ React.createElement("b", { style: { fontWeight: 600 } }, a.who), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--muted)" } }, a.what)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11.5, color: "var(--faint)", whiteSpace: "nowrap" } }, a.when));
  })));
}

// src/modules/MembersSettings.jsx
function Members() {
  const { state } = useStore();
  const set = settlement(state);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Who's on this trip" }, "Group trips give every task an owner and every expense a payer. Roles decide who can edit what."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 0, overflow: "hidden" } }, state.members.map((m, i) => {
    const bal = set.balances[m.id] || 0;
    return /* @__PURE__ */ React.createElement("div", { key: m.id, style: { display: "flex", alignItems: "center", gap: 13, padding: "14px 18px", borderBottom: i < state.members.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 36, height: 36, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 14 } }, m.initials), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 500 } }, m.name, m.you && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--faint)", fontWeight: 400 } }, " \xB7 you")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)" } }, m.you ? "Owner" : "Editor")), /* @__PURE__ */ React.createElement("span", { className: "tnum", style: { fontSize: 13, fontWeight: 600, color: bal > 1 ? "var(--ready)" : bal < -1 ? "var(--warn)" : "var(--muted)" } }, bal > 1 ? `is owed ${inr(bal)}` : bal < -1 ? `owes ${inr(-bal)}` : "settled"));
  })));
}
function Settings2() {
  const { state } = useStore();
  const t = state.trip;
  const rows = [
    ["Trip name", t.name],
    ["Destination", t.cities],
    ["Dates", "2 Oct \u2192 14 Oct 2026"],
    ["Mode", state.mode === "group" ? "Group trip" : "Solo trip"],
    ["Home currency", "\u20B9 INR"],
    ["Planned total", inr(ledger(state).totals.estimate) + " \xB7 derived from things"]
  ];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Intro, { kicker: "Trip settings" }, "Dates, cover, currency, and the housekeeping \u2014 archive, duplicate, or save this trip as a template."), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "4px 20px" } }, rows.map(([k, v], i) => /* @__PURE__ */ React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--lineSoft)" : "none" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--muted)" } }, k), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13.5, fontWeight: 500 } }, v)))));
}

// src/App.jsx
var MODULES = { overview: Overview, itinerary: Itinerary, bookings: Bookings, money: Money2, documents: Documents, checklist: Checklist, activity: Activity2, members: Members, settings: Settings2 };
var TITLES = { overview: "Overview", itinerary: "Itinerary", bookings: "Bookings", money: "Money", documents: "Documents", checklist: "Checklist", activity: "Activity", members: "Members", settings: "Settings" };
function Shell() {
  const { state, dispatch } = useStore();
  const dest = DESTINATIONS[state.trip.destinationKey];
  const R = computeReadiness(state);
  const days = daysUntil(state.trip.start);
  const Active = MODULES[state.module] || Overview;
  const Controls = /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "seg" }, /* @__PURE__ */ React.createElement("button", { className: state.mode === "solo" ? "on" : "", onClick: () => dispatch({ type: "mode", value: "solo" }) }, "Solo"), /* @__PURE__ */ React.createElement("button", { className: state.mode === "group" ? "on" : "", onClick: () => dispatch({ type: "mode", value: "group" }) }, "Group")), /* @__PURE__ */ React.createElement("div", { className: "seg" }, /* @__PURE__ */ React.createElement("button", { className: state.view === "desktop" ? "on" : "", onClick: () => dispatch({ type: "view", value: "desktop" }) }, /* @__PURE__ */ React.createElement(Monitor, { size: 14, style: { verticalAlign: "middle", marginRight: 5 } }), "Planning"), /* @__PURE__ */ React.createElement("button", { className: state.view === "mobile" ? "on" : "", onClick: () => dispatch({ type: "view", value: "mobile" }) }, /* @__PURE__ */ React.createElement(Smartphone, { size: 14, style: { verticalAlign: "middle", marginRight: 5 } }), "Execution")));
  if (state.view === "mobile") {
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 18, right: 22, zIndex: 20 } }, Controls), /* @__PURE__ */ React.createElement(MobileApp, null));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(Sidebar, null), /* @__PURE__ */ React.createElement("main", { style: { flex: 1, height: "100vh", overflowY: "auto" } }, /* @__PURE__ */ React.createElement("header", { style: { padding: "26px 44px 20px", borderBottom: "1px solid var(--line)", background: "var(--paper)", position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "flex-end", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "eyebrow", style: { marginBottom: 4 } }, TITLES[state.module]), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 12 } }, /* @__PURE__ */ React.createElement("h1", { className: "serif", style: { fontSize: 36, fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1 } }, state.trip.name, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28 } }, dest.flag)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--muted)" } }, state.trip.cities))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 22 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("div", { className: "serif tnum", style: { fontSize: 28, fontWeight: 500, lineHeight: 1 } }, days, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--muted)", fontFamily: "var(--ui)", fontWeight: 450 } }, " days out")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--muted)", marginTop: 3 } }, "2 Oct \u2192 14 Oct 2026 \xB7 ", R.score, "% ready")), Controls)), /* @__PURE__ */ React.createElement("div", { style: { padding: "26px 44px 80px", maxWidth: 1040 } }, /* @__PURE__ */ React.createElement(Active, null))));
}
function App() {
  return /* @__PURE__ */ React.createElement(StoreProvider, null, /* @__PURE__ */ React.createElement(Shell, null));
}
export {
  App as default
};
