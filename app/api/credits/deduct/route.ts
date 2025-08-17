import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export const dynamic = "force-dynamic"; // disable caching

const BodySchema = z.object({
  amount: z.number().int().positive().max(10_000),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { amount } = parsed.data;

    // Fetch current credits
    const { data: profile, error: fetchErr } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (fetchErr || !profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.credits < amount) {
      return Response.json({ error: "Insufficient credits" }, { status: 400 });
    }

    const newCredits = profile.credits - amount;
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", userId);

    if (updateErr) {
      return Response.json(
        { error: "Failed to deduct credits" },
        { status: 500 }
      );
    }

    return Response.json({ credits: newCredits }, { status: 200 });
  } catch (e) {
    console.error("/api/credits/deduct error", e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
