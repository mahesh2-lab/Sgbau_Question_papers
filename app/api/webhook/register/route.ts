import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.NEXT_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing required headers", { status: 400 });
  }

  const payload = await req.json();

  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Invalid webhook signature", { status: 401 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created") {
    try {
      const { email_addresses, primary_email_address_id } = evt.data;

      const primary_email = email_addresses.find(
        (email: { id: string }) => email.id === primary_email_address_id
      );

      if (!primary_email) {
        return new Response("Primary email not found", { status: 400 });
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: id,
          email: primary_email.email_address,
          name: evt.data.first_name || "",
          credits: 0,
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting profile:", error);
        return new Response("Error processing webhook event", { status: 500 });
      }

    } catch (error) {
      console.error("Error handling user.created event:", error);
      return new Response("Error processing webhook event", { status: 500 });
    }
  }

    return new Response("Webhook processed successfully", { status: 200 });
}
