import { DESTINATIONS } from "../data/trip.js";

export const inr = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");

export function localCurrency(state, rupees) {
  const rule = DESTINATIONS[state.trip.destinationKey];
  if (rule.currency === "INR") return null;
  const v = rupees * rule.fx;
  return `${Math.round(v).toLocaleString()} ${rule.currency}`;
}

// The money model: there is no budget, only things you PLAN for, and money you SPEND.
//   Planned = what you expect a thing to cost (bookings + extras you add).
//   Spent   = real expenses you log when money actually leaves your pocket.
// They're two independent sums — no confusing "committed" in between.
const RES_CATEGORY = { Flight: "Transport", Transit: "Transport", Hotel: "Stay", Activity: "Activities" };

export function ledger(state) {
  const things = [];

  state.bookings
    .filter((b) => b.status !== "Cancelled")
    .forEach((b) =>
      things.push({ id: b.id, label: b.title, category: RES_CATEGORY[b.type] || "Other", estimate: b.cost, kind: "booking", status: b.status })
    );

  state.extras.forEach((x) =>
    things.push({ id: x.id, label: x.label, category: x.category, estimate: x.estimate, kind: "extra" })
  );

  // planned grouped by category
  const byCat = {};
  things.forEach((t) => {
    (byCat[t.category] ||= { estimate: 0, things: [] });
    byCat[t.category].estimate += t.estimate;
    byCat[t.category].things.push(t);
  });

  // spent grouped by category (from logged expenses)
  const spentByCat = {};
  (state.expenses || []).forEach((e) => { spentByCat[e.category] = (spentByCat[e.category] || 0) + e.amount; });

  const planned = things.reduce((s, t) => s + t.estimate, 0);
  const spent = (state.expenses || []).reduce((s, e) => s + e.amount, 0);

  return { things, byCat, spentByCat, totals: { planned, spent } };
}

// What each member owes for a single expense, given its split mode.
export function shareFor(e, memberId) {
  if (e.splitMode === "unequal") return Number(e.amounts?.[memberId]) || 0;
  if (!e.split?.includes(memberId)) return 0;
  return e.amount / (e.split.length || 1);
}

// Group settlement, Splitwise-style. Balance = (paid for the group) − (your fair shares)
// + (settle-up payments you made) − (payments you received). Positive = you're owed.
export function settlement(state) {
  const balances = {};
  state.members.forEach((m) => (balances[m.id] = 0));

  (state.expenses || []).forEach((e) => {
    if (balances[e.paidBy] !== undefined) balances[e.paidBy] += e.amount;
    state.members.forEach((m) => { balances[m.id] -= shareFor(e, m.id); });
  });

  (state.payments || []).forEach((p) => {
    if (balances[p.from] !== undefined) balances[p.from] += p.amount; // paying down what you owe
    if (balances[p.to] !== undefined) balances[p.to] -= p.amount;
  });

  // Resolve net balances to the fewest "X owes Y" transfers.
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
    debtors[i].amt -= pay; creditors[j].amt -= pay;
    if (debtors[i].amt < 1) i++;
    if (creditors[j].amt < 1) j++;
  }
  return { balances, transfers };
}

export const nameOf = (state, id) => state.members.find((m) => m.id === id)?.name || "—";

// Simple name-based credentials for each traveller (client-side demo login).
// username = first.last  ·  password = first + 123  (e.g. priyanshu.gupta / priyanshu123)
export function credsFor(member) {
  const parts = (member.name || "").trim().split(/\s+/);
  const first = (parts[0] || "user").toLowerCase();
  const last = (parts[parts.length - 1] || first).toLowerCase();
  return { username: `${first}.${last}`, password: `${first}123` };
}
