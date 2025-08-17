import { createClient } from "@supabase/supabase-js";

// IMPORTANT:
// Never expose the service role key to the browser. Only import `supabaseAdmin`
// inside server-only (Route Handlers, Server Actions, etc.).
// For client components use an anon/public key via a separate client (not yet implemented here).

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!; // URL can be public
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // MUST stay server-side

const SUPABASE_PUBLIC_ANON_KEY = process.env.SUPABASE_PUBLIC_ANON_KEY!; // Optional, for public client

if (!SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL env variable");
}

// Create an admin client (server-side ONLY). Add a runtime guard to reduce accidental leakage.
export const supabase = (() => {
  if (typeof window !== "undefined") {
    throw new Error("supabase (admin) client should only be used server-side");
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
})();
