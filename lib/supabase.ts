import { createClient } from "@supabase/supabase-js";
import "dotenv/config";


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!; // URL can be public
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // MUST stay server-side

if (!SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL env variable");
}

export const supabase = (() => {
  if (typeof window !== "undefined") {
    throw new Error("supabase (admin) client should only be used server-side");
  }
  return createClient('https://qpwpsejnepuavovtvpfg.supabase.co', SERVICE_ROLE_KEY);
})();
