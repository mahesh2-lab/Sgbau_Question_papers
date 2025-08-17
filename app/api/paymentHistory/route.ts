import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return new Response("Error fetching credits", { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
