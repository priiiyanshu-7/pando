import { createClient } from "@supabase/supabase-js";

// Supabase is OPTIONAL. With no env keys the whole app runs on localStorage exactly as
// before (offline, per-device). Add the two VITE_ vars (locally in .env, on Vercel in
// project settings) to switch on real auth + a single shared, live-synced trip.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supaEnabled = !!(url && key);
export const supabase = supaEnabled ? createClient(url, key) : null;
