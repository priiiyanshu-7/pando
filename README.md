# Pando

**Every trip is a project.** A travel manager built like Linear, not like a trip planner.
Pando's one question is *"what still needs to happen before this trip is complete?"* — and the
**Readiness** score answers it, recomputing live as you book, upload, and check things off.

This is a real React application. Clone, install, run.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
```

## Backend (Supabase) — optional, for a shared live trip

With **no** environment variables, Pando runs entirely on `localStorage` — offline, per-device,
with the simple name-based login. Add Supabase to turn on real auth + one shared trip that
syncs live across everyone's devices.

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL editor → run** [`supabase/schema.sql`](supabase/schema.sql) (creates the `trips` table, RLS, realtime).
3. **Authentication → Providers → Email**: enable it and **turn OFF "Confirm email"** (so first
   sign-in creates the account instantly).
4. **Settings → API**: copy the Project URL and the `anon` public key into a local `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. `npm run dev`. Each traveller signs in with their name creds (`firstname.lastname` /
   `firstname123`); the first sign-in creates their account. All edits now sync to everyone.

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project → import the repo**. Vercel
   auto-detects Vite (Build: `npm run build`, Output: `dist`).
3. If using Supabase, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under
   **Project → Settings → Environment Variables**, then deploy.

That's it — no server to run; the build is a static site.

Requires Node 18+.

## What's inside

Two forks are wired into the top control bar, so you can feel both products:

- **Planning <-> Execution** — the desktop planning surface vs. the mobile execution app
  (a phone with a "What's next" home, boarding pass, offline docs, one-tap currency converter).
- **Solo <-> Group** — the audience fork. Group mode reveals Members, task owners, and Money
  settlement (who owes whom); solo mode hides all of it. A fork made at trip creation, not a
  buried setting.

### The Readiness engine

`src/engine/readiness.js` is the heart. The score is **never a magic number** — it's a sum of
named, weighted line items switched on by the destination's rules (an international trip asks for
a passport, visa, and insurance; a domestic one doesn't). The Overview's "Why 71%" panel shows
every point, so the number is always explainable.

### Collapsed module architecture

The original fourteen modules had real overlaps. Collapsed to six core + three secondary:

| Now | Folds in |
|-----|----------|
| Money | Budget + Expenses (planned/actual toggle, group settlement) |
| Documents | Documents + Files |
| Activity | Timeline + Activity |
| Itinerary | absorbs Places as a per-day layer |
| Overview, Bookings, Checklist | core |
| Activity, Members*, Settings | secondary (*group only) |

## Structure

```
src/
  data/trip.js          destination rules + seed trip
  engine/readiness.js   the explainable, destination-aware score
  lib/format.js         money, currency, group settlement math
  store.jsx             reducer + context
  components/           Sidebar, Ring, Bar, Intro
  modules/              Overview, Itinerary, Bookings, Money, Documents,
                        Checklist, Activity, Members, Settings
  mobile/MobileApp.jsx  the execution-mode phone experience
  App.jsx               shell, forks, module router
```

## Notable next builds

Drag-and-drop itinerary stamps - email-forward booking ingest - trip templates
(invisible scaffolding chosen at creation) - real auth + sync - PWA offline service worker.
