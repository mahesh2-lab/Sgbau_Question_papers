import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Schema validation for incoming payment request
const PaymentRequestSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  amount: z.number().positive().max(100000),
  credits: z.number().int().positive().max(100000),
  paymentID: z.string().min(3).max(128),
  imgurl: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export async function POST(request: Request) {
  try {
    // Auth check
    const { userId: authUserId } = await auth();
    if (!authUserId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json().catch(() => null);
    if (!json) {
      return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = PaymentRequestSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, name, email, amount, credits, paymentID, imgurl } =
      parsed.data;

    // Ensure the user is only creating a request for themselves
    if (userId !== authUserId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Insert with explicit column allow-list
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        user_id: userId,
        name,
        email,
        amount,
        credits,
        payment_id: paymentID,
        img_url: imgurl,
        status: "pending",
      })
      .select("user_id, amount, credits, payment_id, status, created_at")
      .single();

    if (error) {
      console.error("payment_requests insert error", error);
      return Response.json(
        { error: "Failed to create payment request" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Payment request created successfully", data },
      { status: 201 }
    );
  } catch (e) {
    console.error("Unhandled payment request error", e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
