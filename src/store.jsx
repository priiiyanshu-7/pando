import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { initialState, STATUS_CYCLE, makeTrip } from "./data/trip.js";
import { supabase, supaEnabled } from "./lib/supabase.js";

const StoreContext = createContext(null);
const AppContext = createContext(null);
const KEY = "pando.app.v7";

const uid = (p) => p + Math.random().toString(36).slice(2, 8);

// Only the admin may delete/remove things.
const ADMIN_NAME = "Priyanshu Gupta";
const isAdminUser = (auth) => auth?.name === ADMIN_NAME;
const DESTRUCTIVE = new Set(["remove", "deleteTrip"]);

// Hydrate the local cache (all trip folders + which one is open + who's logged in).
function load() {
  const fresh = { auth: null, route: "home", activeId: "trip1", trips: [{ ...initialState, id: "trip1" }] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw);
    if (!saved.trips?.length) return fresh;
    return { auth: saved.auth || null, route: saved.route || "home", activeId: saved.activeId || saved.trips[0].id, trips: saved.trips };
  } catch {
    return fresh;
  }
}

// ---- generic collection helpers (operate on one trip) ----
const add = (s, key, item) => ({ ...s, [key]: [...s[key], item] });
const patch = (s, key, id, fields) => ({ ...s, [key]: s[key].map((it) => (it.id === id ? { ...it, ...fields } : it)) });
const remove = (s, key, id) => ({ ...s, [key]: s[key].filter((it) => it.id !== id) });

// mark the logged-in member (by name) as "you" in a trip
const withYou = (trip, auth) => (auth ? { ...trip, members: trip.members.map((m) => ({ ...m, you: m.name === auth.name })) } : trip);

// Reducer for a single trip's document.
function tripReducer(s, a) {
  switch (a.type) {
    case "module": return { ...s, module: a.value };
    case "ui":     return { ...s, ui: { ...s.ui, ...a.value } };
    case "editTrip": return { ...s, trip: { ...s.trip, ...a.fields } };

    case "add":    return add(s, a.coll, { id: uid(a.coll[0]), ...a.item });
    case "patch":  return patch(s, a.coll, a.id, a.fields);
    case "remove": return remove(s, a.coll, a.id);

    case "toggleTask":   return patch(s, "checklist", a.id, { done: !s.checklist.find((c) => c.id === a.id)?.done });
    case "addTask":      return add(s, "checklist", { id: uid("c"), section: a.section || "Before you go", label: a.label, done: false, owner: a.owner || "u1", essential: false });
    case "toggleDoc":    return patch(s, "docs", a.id, { uploaded: !s.docs.find((d) => d.id === a.id)?.uploaded });
    case "addExpense":   return add(s, "expenses", { id: uid("e"), ...a.expense });
    case "cycleBooking":
      return patch(s, "bookings", a.id, {
        status: STATUS_CYCLE[(STATUS_CYCLE.indexOf(s.bookings.find((b) => b.id === a.id).status) + 1) % STATUS_CYCLE.length],
      });
    case "movePlace":    return patch(s, "places", a.id, { dayD: a.dayD });
    default: return s;
  }
}

// Workspace reducer — routing + folders + auth, delegating everything else to the active trip.
function appReducer(s, a) {
  // Guard: destructive actions are admin-only, whatever the UI shows.
  if (DESTRUCTIVE.has(a.type) && !isAdminUser(s.auth)) return s;
  switch (a.type) {
    case "openTrip": return { ...s, route: "trip", activeId: a.id, trips: s.trips.map((t) => (t.id === a.id ? { ...t, module: "overview" } : t)) };
    case "home":     return { ...s, route: "home" };
    case "newTrip": {
      const t = { ...makeTrip(a.trip), id: uid("trip") };
      return { ...s, trips: [...s.trips, t], activeId: t.id, route: "trip" };
    }
    case "deleteTrip": {
      const trips = s.trips.filter((t) => t.id !== a.id);
      return { ...s, trips, activeId: trips[0]?.id, route: "home" };
    }
    case "login":
      return { ...s, auth: a.user, trips: s.trips.map((t) => withYou(t, a.user)) };
    case "logout":
      return { ...s, auth: null };
    // Replace local trips with the live copy from Supabase (re-apply who "you" is).
    case "hydrateTrips": {
      const trips = a.trips.map((t) => withYou(t, s.auth));
      const activeId = trips.find((t) => t.id === s.activeId)?.id || trips[0]?.id;
      return { ...s, trips, activeId };
    }
    default:
      return { ...s, trips: s.trips.map((t) => (t.id === s.activeId ? tripReducer(t, a) : t)) };
  }
}

// supabase user -> our auth shape
const toUser = (u) => ({ id: u.id, name: u.user_metadata?.name || u.email, username: u.user_metadata?.username || (u.email || "").split("@")[0] });

export function StoreProvider({ children }) {
  const [app, dispatch] = useReducer(appReducer, undefined, load);
  const lastSync = useRef("");   // last trips JSON we sent/received — breaks the realtime echo loop
  const pushTimer = useRef(null);

  // always keep a local cache (offline + instant boot)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(app)); } catch { /* quota */ }
  }, [app]);

  // ---- Supabase auth session ----
  useEffect(() => {
    if (!supaEnabled) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) dispatch({ type: "login", user: toUser(data.session.user) });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) dispatch({ type: "login", user: toUser(session.user) });
      else dispatch({ type: "logout" });
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // ---- Supabase trip sync (fetch + realtime) ----
  useEffect(() => {
    if (!supaEnabled || !app.auth) return;
    let live = true;
    const pull = async () => {
      const { data, error } = await supabase.from("trips").select("id,data").order("id");
      if (error || !live || !data) return;
      if (data.length === 0) {
        // first run on an empty backend — seed it with whatever we have locally
        await supabase.from("trips").upsert(app.trips.map((t) => ({ id: t.id, data: t })));
        return;
      }
      const trips = data.map((r) => ({ ...r.data, id: r.id }));
      const json = JSON.stringify(trips);
      if (json === lastSync.current) return;   // our own echo or no change
      lastSync.current = json;
      dispatch({ type: "hydrateTrips", trips });
    };
    pull();
    const channel = supabase.channel("trips-sync").on("postgres_changes", { event: "*", schema: "public", table: "trips" }, pull).subscribe();
    return () => { live = false; supabase.removeChannel(channel); };
  }, [app.auth]);

  // ---- push local edits up (debounced) ----
  useEffect(() => {
    if (!supaEnabled || !app.auth) return;
    const trips = app.trips.map((t) => ({ ...t }));
    const json = JSON.stringify(trips.slice().sort((a, b) => a.id.localeCompare(b.id)));
    if (json === lastSync.current) return;     // nothing new vs last sync
    clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(async () => {
      lastSync.current = json;
      await supabase.from("trips").upsert(app.trips.map((t) => ({ id: t.id, data: t, updated_at: new Date().toISOString() })));
    }, 700);
    return () => clearTimeout(pushTimer.current);
  }, [app.trips, app.auth]);

  const active = app.trips.find((t) => t.id === app.activeId) || app.trips[0];
  return (
    <AppContext.Provider value={{ app, dispatch }}>
      <StoreContext.Provider value={{ state: active, dispatch }}>{children}</StoreContext.Provider>
    </AppContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
export const useApp = () => useContext(AppContext);
export const useIsAdmin = () => isAdminUser(useContext(AppContext)?.app?.auth);
