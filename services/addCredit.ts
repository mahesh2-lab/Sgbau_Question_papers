import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export const addCredit = async (amount: number) => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        // Fetch current credits for the user
        const { data: profile, error: fetchError } = await supabase
            .from("profiles")
            .select("id, credits")
            .eq("id", userId)
            .single();

        if (fetchError) {
            throw new Error(`Error fetching profile: ${fetchError.message}`);
        }

        const newCredits = (profile?.credits ?? 0) + amount;

        // Update credits for the user
        const { data, error } = await supabase
            .from("profiles")
            .update({ credits: newCredits })
            .eq("id", userId)
            .single();

        if (error) {
            throw new Error(`Error adding credit: ${error.message}`);
        }

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};