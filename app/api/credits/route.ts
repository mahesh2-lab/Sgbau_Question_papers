import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

// Always dynamic (avoid any accidental caching)
export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, credits")
    .eq("id", userId)
    .single();
  
  if (error) {
    return new Response(JSON.stringify({ error: "Error fetching credits" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
