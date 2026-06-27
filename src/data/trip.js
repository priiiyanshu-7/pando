// Destination intelligence — this is what makes Readiness destination-aware.
// In production this comes from a maintained dataset; here, a representative slice.
export const DESTINATIONS = {
  vietnam: { label: "Vietnam", flag: "🇻🇳", international: true,  visaRequired: true,  currency: "VND", fx: 305 /* ₹1 ≈ 305 VND */ },
  japan:   { label: "Japan",   flag: "🇯🇵", international: true,  visaRequired: false, currency: "JPY", fx: 1.8 },
  goa:     { label: "Goa",     flag: "🏖️", international: false, visaRequired: false, currency: "INR", fx: 1 },
  udaipur: { label: "Udaipur", flag: "🏰", international: false, visaRequired: false, currency: "INR", fx: 1 },
};

// The real trip — Vietnam with the boys, 7–16 Oct 2026 (out of BLR via a KL layover).
export const initialState = {
  mode: "group",
  module: "overview",

  trip: {
    name: "Vietnam",
    destinationKey: "vietnam",
    cities: "Kuala Lumpur · Ha Noi · Ninh Binh · Da Nang · Hoi An · Ho Chi Minh",
    start: "2026-10-07",
    end: "2026-10-16",
    nights: 8,                // beds needed: 8,9,10,11,12(train),13,14,15 Oct
    planningWindowDays: 30,
    homeCurrency: "₹",
  },

  // The 8 travellers (from the booking PDFs).
  members: [
    { id: "u1", name: "Priyanshu Gupta",    initials: "PG", you: true },
    { id: "u2", name: "Omm Animesh Mishra", initials: "OM" },
    { id: "u3", name: "Hemakesh Behara",    initials: "HB" },
    { id: "u4", name: "Priyanshu Mehra",    initials: "PM" },
    { id: "u5", name: "Barun Sethi",        initials: "BS" },
    { id: "u6", name: "Prakhar Khatri",     initials: "PK" },
    { id: "u7", name: "Aakash Singh",       initials: "AS" },
    { id: "u8", name: "Mayur Singh",        initials: "MS" },
  ],

  docs: [
    { id: "d1", type: "Passport",  label: "Passports — all 8 (valid 6+ months, to Apr 2027)", uploaded: false, essential: true },
    { id: "d2", type: "Visa",      label: "Vietnam e-visa (x8) — evisa.gov.vn",                 uploaded: false, essential: true },
    { id: "d3", type: "Insurance", label: "Travel insurance (x8)",                              uploaded: false, essential: true },
    { id: "d4", type: "Arrival card", label: "Malaysia Digital Arrival Card (MDAC) — if leaving KL airport", uploaded: false, essential: false },
    { id: "d7", type: "Health form", label: "Vietnam health declaration (mandatory from 1 Jul 2026)", uploaded: false, essential: true },
    { id: "d5", type: "Ticket",    label: "AirAsia BLR→HAN · OKWHHR",                           uploaded: true,  essential: false },
    { id: "d6", type: "Ticket",    label: "VietJet SGN→BLR · WHFNX5",                           uploaded: true,  essential: false },
  ],

  bookings: [
    // CONFIRMED
    { id: "b1", type: "Flight", title: "BLR → HAN · AirAsia AK52/AK518 via KUL · OKWHHR", date: "7–8 Oct", cost: 157112, status: "Booked",  outbound: true, essential: true },
    { id: "b2", type: "Flight", title: "SGN → BLR · VietJet VJ1801 · WHFNX5",             date: "16 Oct",  cost: 100848, status: "Booked",  essential: true },
    // STILL TO BOOK
    { id: "b3", type: "Flight",  title: "DAD → SGN · internal — NOT BOOKED",                     date: "15 Oct",  cost: 26000, status: "Planned", essential: true },
    { id: "b4", type: "Transit", title: "Ninh Binh → Da Nang · overnight train SE19 — NOT BOOKED", date: "12–13 Oct", cost: 18400, status: "Planned", nights: 1, essential: true },
    // STAYS (none booked yet — rough group totals)
    { id: "b5", type: "Hotel", title: "Ha Noi · Old Quarter social hostel", date: "8–11 Oct",  cost: 18000, status: "Planned", nights: 3, essential: true },
    { id: "b6", type: "Hotel", title: "Ninh Binh · Tam Coc homestay",       date: "11–12 Oct", cost: 7800,  status: "Planned", nights: 1, essential: true },
    { id: "b7", type: "Hotel", title: "Hoi An · Ancient Town hostel",        date: "13–14 Oct", cost: 7800,  status: "Planned", nights: 1, essential: true },
    { id: "b8", type: "Hotel", title: "Da Nang · An Thuong villa (for 8)",   date: "14–15 Oct", cost: 10200, status: "Planned", nights: 1, essential: true },
    { id: "b9", type: "Hotel", title: "HCMC · Pham Ngu Lao hostel",          date: "15–16 Oct", cost: 6800,  status: "Planned", nights: 1, essential: true },
  ],

  checklist: [
    // Visas & entry — researched for Indian passports on this routing
    { id: "c1",  section: "Visas & entry", label: "Apply Vietnam e-visa for all 8 (evisa.gov.vn, $25 single-entry, ~3 working days)", done: false, owner: "u1", essential: true },
    { id: "c19", section: "Visas & entry", label: "File Vietnam health declaration — NEW & MANDATORY from 1 Jul 2026, within 7 days of travel (Decree 165/2026)", done: false, owner: "u1", essential: true },
    { id: "c5",  section: "Visas & entry", label: "Confirm OKWHHR is a real AirAsia Fly-Thru (bags through-checked) — decides airside transit vs MDAC", done: false, owner: "u1", essential: true },
    { id: "c2",  section: "Visas & entry", label: "Fill Malaysia MDAC online (free, within 3 days of 8 Oct) — only if leaving KLIA2", done: false, owner: "u2", essential: false },
    { id: "c3",  section: "Visas & entry", label: "Confirm passports valid 6+ months (to Apr 2027)", done: false, owner: "u3", essential: true },
    { id: "c4",  section: "Visas & entry", label: "Buy travel insurance for all 8", done: false, owner: "u4", essential: true },
    { id: "c6",  section: "Visas & entry", label: "Save offline copies: e-visas + boarding passes", done: false, owner: "u5", essential: false },
    // Book the gaps
    { id: "c7",  section: "Book the gaps", label: "Book DAD → SGN internal flight (15 Oct)", done: false, owner: "u1", essential: true },
    { id: "c8",  section: "Book the gaps", label: "Book SE19 overnight train Ninh Binh → Da Nang (12 Oct, 4-berth x2)", done: false, owner: "u6", essential: true },
    { id: "c9",  section: "Book the gaps", label: "Book Ha Noi hostel (3 nights)", done: false, owner: "u7", essential: true },
    { id: "c10", section: "Book the gaps", label: "Book Ninh Binh homestay (Tam Coc)", done: false, owner: "u8", essential: false },
    { id: "c11", section: "Book the gaps", label: "Book Hoi An hostel", done: false, owner: "u2", essential: false },
    { id: "c12", section: "Book the gaps", label: "Book Da Nang villa (8 pax)", done: false, owner: "u3", essential: false },
    { id: "c13", section: "Book the gaps", label: "Book HCMC hostel", done: false, owner: "u4", essential: false },
    // Before you go
    { id: "c14", section: "Before you go", label: "Notify banks of foreign travel", done: false, owner: "u5", essential: false },
    { id: "c15", section: "Before you go", label: "Get VND + Wise/forex card", done: false, owner: "u6", essential: false },
    { id: "c16", section: "Before you go", label: "Vietnam eSIM / SIM sorted", done: false, owner: "u7", essential: false },
    // Pack
    { id: "c17", section: "Pack", label: "Universal adapter (VN uses Type A/C/G)", done: false, owner: "u8", essential: false },
    { id: "c18", section: "Pack", label: "Rain shell — Oct is the tail of central VN's rainy season", done: false, owner: "u2", essential: false },
  ],

  extras: [],

  // Both flights are shared. ₹157,112 + ₹100,848 = ₹257,960 ÷ 8 = ₹32,245 each.
  expenses: [
    { id: "e1", label: "Flights BLR → Ha Noi (AirAsia · OKWHHR)", amount: 157112, paidBy: "u1", category: "Transport", splitMode: "equal", split: ["u1","u2","u3","u4","u5","u6","u7","u8"], amounts: {} },
    { id: "e2", label: "Return flights SGN → BLR (VietJet · WHFNX5)", amount: 100848, paidBy: "u1", category: "Transport", splitMode: "equal", split: ["u1","u2","u3","u4","u5","u6","u7","u8"], amounts: {} },
  ],

  // The group already settled the flights between themselves — each paid their ₹32,245
  // share back, so balances net to zero while the cost-per-person stays on record.
  payments: [
    { id: "pay1", from: "u2", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay2", from: "u3", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay3", from: "u4", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay4", from: "u5", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay5", from: "u6", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay6", from: "u7", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
    { id: "pay7", from: "u8", to: "u1", amount: 32245, note: "Settled — flights", date: "2026-06-25" },
  ],

  // Day plan, 7–16 Oct.
  days: [
    { d: 7,  label: "Fly out · BLR → KUL",   city: "In transit",            tone: "#6C5CE7" },
    { d: 8,  label: "KL layover → Ha Noi",   city: "Kuala Lumpur → Ha Noi", tone: "#1FA98C" },
    { d: 9,  label: "Ha Noi",                city: "Ha Noi",                tone: "#E08A2B" },
    { d: 10, label: "Ha Noi",                city: "Ha Noi",                tone: "#C9543D" },
    { d: 11, label: "→ Ninh Binh",           city: "Ninh Binh",             tone: "#4A6B5A" },
    { d: 12, label: "Ninh Binh · night train", city: "Ninh Binh",           tone: "#2E6F8E" },
    { d: 13, label: "Hoi An / Da Nang",      city: "Hoi An",                tone: "#A03D5E" },
    { d: 14, label: "Da Nang / Hoi An",      city: "Da Nang",               tone: "#8E5A2E" },
    { d: 15, label: "→ Ho Chi Minh",         city: "Ho Chi Minh",           tone: "#6C5CE7" },
    { d: 16, label: "HCMC → home",           city: "Ho Chi Minh → BLR",     tone: "#1FA98C" },
  ],

  places: [
    // 7 Oct — fly out
    { id: "t1", type: "transfer", mode: "Flight", from: "Bengaluru (BLR)", to: "Kuala Lumpur (KUL)", dayD: 7, time: "23:25", cost: 0, notes: "AirAsia AK52 · dep 23:25 · KLIA2 · OKWHHR" },
    // 8 Oct — KL layover then Hanoi
    { id: "p1", type: "place", name: "Kuala Lumpur layover (12h)", category: "Culture", dayD: 8, time: "06:10", area: "KLIA2", cost: 0, notes: "Stay airside, or clear immigration (visa-free + MDAC) to nip into KL. Bags through-checked? Confirm Fly-Thru.", booked: false, lat: 2.7456, lng: 101.6958 },
    { id: "t2", type: "transfer", mode: "Flight", from: "Kuala Lumpur (KUL)", to: "Ha Noi (HAN)", dayD: 8, time: "18:10", cost: 0, notes: "AirAsia AK518 · arr 20:30" },
    { id: "t3", type: "transfer", mode: "Taxi", from: "Noi Bai Airport", to: "Old Quarter", dayD: 8, time: "21:00", cost: 250, notes: "Grab, split ~₹250pp" },
    // 9 Oct — Hanoi
    { id: "p2", type: "place", name: "Old Quarter + egg coffee", category: "Culture", dayD: 9, time: "09:00", area: "Ha Noi", cost: 0, notes: "Giang Cafe for the original egg coffee.", booked: false, lat: 21.0341, lng: 105.8510 },
    { id: "p3", type: "place", name: "Hoan Kiem Lake", category: "Sight", dayD: 9, time: "17:00", area: "Ha Noi", cost: 0, notes: "Ngoc Son temple on the red bridge.", booked: false, lat: 21.0287, lng: 105.8524 },
    { id: "p4", type: "place", name: "Train Street", category: "Sight", dayD: 9, time: "19:30", area: "Ha Noi", cost: 200, notes: "Train passes ~19:30 — get a coffee seat early.", booked: false, lat: 21.0245, lng: 105.8412 },
    // 10 Oct — Hanoi
    { id: "p5", type: "place", name: "Temple of Literature", category: "Culture", dayD: 10, time: "09:00", area: "Ha Noi", cost: 70, notes: "Vietnam's first university, 1070.", booked: false, lat: 21.0293, lng: 105.8355 },
    { id: "p6", type: "place", name: "Bun cha lunch — Huong Lien", category: "Food", dayD: 10, time: "13:00", area: "Ha Noi", cost: 300, notes: "The Obama + Bourdain spot.", booked: false, lat: 21.0185, lng: 105.8510 },
    { id: "p7", type: "place", name: "Old Quarter street-food crawl", category: "Food", dayD: 10, time: "19:00", area: "Ha Noi", cost: 600, notes: "Bia hoi on Ta Hien.", booked: false, lat: 21.0363, lng: 105.8516 },
    // 11 Oct — Ninh Binh
    { id: "t4", type: "transfer", mode: "Bus", from: "Ha Noi", to: "Ninh Binh", dayD: 11, time: "06:00", cost: 994, notes: "6am limousine (12go) ~₹994pp" },
    { id: "p8", type: "place", name: "Trang An boat tour", category: "Nature", dayD: 11, time: "11:00", area: "Ninh Binh", cost: 250, notes: "3hr sampan through the caves.", booked: false, lat: 20.2530, lng: 105.9270 },
    { id: "p9", type: "place", name: "Hang Mua viewpoint", category: "Nature", dayD: 11, time: "16:00", area: "Ninh Binh", cost: 100, notes: "500 steps for the Tam Coc panorama.", booked: false, lat: 20.2333, lng: 105.9450 },
    // 12 Oct — Ninh Binh + overnight train
    { id: "p10", type: "place", name: "Cycle the Tam Coc rice fields", category: "Nature", dayD: 12, time: "09:00", area: "Ninh Binh", cost: 150, notes: "Bike rental ₹100–200.", booked: false, lat: 20.2206, lng: 105.9412 },
    { id: "t5", type: "transfer", mode: "Train", from: "Ninh Binh", to: "Da Nang", dayD: 12, time: "22:00", cost: 2300, notes: "SE19 overnight sleeper — 4-berth x2 cabins · NOT BOOKED" },
    // 13 Oct — Hoi An / Da Nang
    { id: "t6", type: "transfer", mode: "Taxi", from: "Da Nang station", to: "Hoi An", dayD: 13, time: "10:00", cost: 325, notes: "Grab, split ~₹325pp" },
    { id: "p11", type: "place", name: "Hoi An Ancient Town", category: "Culture", dayD: 13, time: "16:00", area: "Hoi An", cost: 0, notes: "Japanese Bridge + lanterns at dusk.", booked: false, lat: 15.8770, lng: 108.3268 },
    { id: "p12", type: "place", name: "An Bang Beach sunset", category: "Beach", dayD: 13, time: "18:00", area: "Hoi An", cost: 0, notes: "Soul Kitchen for sundowners.", booked: false, lat: 15.9078, lng: 108.3370 },
    // 14 Oct — Da Nang / Hoi An
    { id: "p13", type: "place", name: "My Khe Beach", category: "Beach", dayD: 14, time: "09:00", area: "Da Nang", cost: 0, notes: "Long golden-sand beach.", booked: false, lat: 16.0606, lng: 108.2470 },
    { id: "p14", type: "place", name: "Marble Mountains", category: "Nature", dayD: 14, time: "11:00", area: "Da Nang", cost: 120, notes: "Caves + pagodas + city views.", booked: false, lat: 16.0036, lng: 108.2630 },
    { id: "p15", type: "place", name: "Hoi An lantern night market", category: "Shopping", dayD: 14, time: "19:00", area: "Hoi An", cost: 1500, notes: "Float a lantern on the Thu Bon.", booked: false, lat: 15.8765, lng: 108.3290 },
    // 15 Oct — fly to HCMC
    { id: "t7", type: "transfer", mode: "Taxi", from: "Hoi An", to: "Da Nang (DAD)", dayD: 15, time: "10:00", cost: 325, notes: "Grab to the airport." },
    { id: "t8", type: "transfer", mode: "Flight", from: "Da Nang (DAD)", to: "Ho Chi Minh (SGN)", dayD: 15, time: "14:00", cost: 3250, notes: "NOT BOOKED · ~₹2.5–4k pp" },
    { id: "t9", type: "transfer", mode: "Taxi", from: "Tan Son Nhat", to: "District 1", dayD: 15, time: "16:30", cost: 150, notes: "Grab, split." },
    { id: "p16", type: "place", name: "Bui Vien walking street", category: "Nightlife", dayD: 15, time: "20:00", area: "Ho Chi Minh", cost: 0, notes: "Backpacker street — loud and fun.", booked: false, lat: 10.7670, lng: 106.6930 },
    // 16 Oct — HCMC then home
    { id: "p17", type: "place", name: "Ben Thanh Market", category: "Shopping", dayD: 16, time: "10:00", area: "Ho Chi Minh", cost: 0, notes: "Haggle for last-minute gifts.", booked: false, lat: 10.7725, lng: 106.6980 },
    { id: "t10", type: "transfer", mode: "Flight", from: "Ho Chi Minh (SGN)", to: "Bengaluru (BLR)", dayD: 16, time: "19:20", cost: 0, notes: "VietJet VJ1801 · arr 22:35 · WHFNX5" },
  ],

  activity: [
    { who: "Priyanshu Gupta", what: "booked the return flights (VietJet)", when: "2 days ago", kind: "booking" },
    { who: "Aakash Singh",    what: "added Trang An boat tour to 11 Oct",  when: "3 days ago", kind: "plan" },
    { who: "Mayur Singh",     what: "flagged DAD→SGN still unbooked",       when: "4 days ago", kind: "booking" },
  ],

  ui: { moneyTab: "actual", showWhy: false },
};

export const BOOKED = ["Booked", "Paid", "Completed"];
export const STATUS_CYCLE = ["Planned", "Booked", "Paid", "Completed", "Cancelled"];

const DAY_PALETTE = ["#6C5CE7", "#1FA98C", "#E08A2B", "#C9543D", "#2E6F8E", "#A03D5E", "#4A6B5A", "#8E5A2E"];

// Build a fresh, empty trip folder from a few basics. Days are generated from the dates.
export function makeTrip({ name, destinationKey = "goa", cities = "", start, end }) {
  const s = new Date(start), e = new Date(end);
  const nights = Math.max(1, Math.round((e - s) / 86400000) || 1);
  const days = [];
  for (let i = 0; i <= nights; i++) {
    const d = new Date(s.getTime() + i * 86400000);
    days.push({ d: d.getDate(), label: `Day ${i + 1}`, city: cities.split("·")[0]?.trim() || "", tone: DAY_PALETTE[i % DAY_PALETTE.length] });
  }
  return {
    mode: "group", module: "overview",
    trip: { name: name || "New trip", destinationKey, cities, start, end, nights, planningWindowDays: 30, homeCurrency: "₹" },
    members: [{ id: "u1", name: "You", initials: "Y", you: true }],
    docs: [], bookings: [], checklist: [], extras: [], expenses: [], payments: [], places: [], days,
    activity: [], ui: { moneyTab: "actual", showWhy: false },
  };
}

// Place categories — each carries an icon name (resolved to a lucide icon in the UI)
// and a tone. They're what make the itinerary feel place-centric instead of a calendar grid.
export const PLACE_CATEGORIES = {
  Sight:     { icon: "Landmark",   tone: "#2E6F8E" },
  Food:      { icon: "Utensils",   tone: "#C9543D" },
  Culture:   { icon: "Building2",  tone: "#8E5A2E" },
  Nature:    { icon: "Mountain",   tone: "#4A6B5A" },
  Beach:     { icon: "Waves",      tone: "#2E8E8E" },
  Shopping:  { icon: "ShoppingBag", tone: "#A03D5E" },
  Nightlife: { icon: "Wine",       tone: "#6B4A8E" },
  Stay:      { icon: "BedDouble",  tone: "#3B7A57" },
  Transport: { icon: "Car",        tone: "#76726A" },
};
export const PLACE_CATEGORY_KEYS = Object.keys(PLACE_CATEGORIES);

// How you commute between places — transfers in the itinerary.
export const TRANSFER_MODES = {
  Flight:  { icon: "Plane" },
  Train:   { icon: "TrainFront" },
  Bus:     { icon: "Bus" },
  Car:     { icon: "Car" },
  Taxi:    { icon: "Car" },
  Scooter: { icon: "Bike" },
  Ferry:   { icon: "Ship" },
  Walk:    { icon: "Footprints" },
};
export const TRANSFER_MODE_KEYS = Object.keys(TRANSFER_MODES);
