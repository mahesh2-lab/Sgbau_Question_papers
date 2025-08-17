// Lightweight public Supabase client for browser (anon key only)
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const publicSupabase: SupabaseClient | null = (() => {
  if (typeof window === "undefined") return null; // only for client side
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLIC_ANON_KEY;
    if (!url || !anon) return null;
    if (!client) {
      client = createClient(url, anon, {
        auth: { persistSession: false },
        realtime: { params: { eventsPerSecond: 5 } },
      });
    }
    return client;
  } catch (e) {
    console.warn("Failed to init publicSupabase", e);
    return null;
  }
})();

export function getPublicSupabase() {
  return publicSupabase;
}
