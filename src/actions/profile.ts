"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthAction } from "@/lib/proxy";
import { ProfileInput } from "@/types/invoice";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema to sanitize and validate profile settings inputs
const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .nullable(),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Email is too long"),
});

/**
 * Fetch the profile of the current authenticated user.
 */
export async function getProfile() {
  try {
    const userId = await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[Database Error] Fetch Profile failed:", error);
      throw new Error("Unable to load profile data.");
    }

    return data;
  } catch (err: unknown) {
    console.error("[Server Error] getProfile crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Update the profile details of the current authenticated user.
 */
export async function updateProfile(input: ProfileInput) {
  try {
    // Perform strict schema validation
    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    const { full_name, email } = parsed.data;

    const userId = await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error(`[Database Error] Update Profile for user #${userId} failed:`, error);
      throw new Error("Database transaction failed. Could not save profile changes.");
    }

    revalidatePath("/profile");
    return data;
  } catch (err: unknown) {
    console.error("[Server Error] updateProfile crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}
