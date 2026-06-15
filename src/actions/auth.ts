"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = authSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
});

export async function signIn(formData: FormData) {
  try {
    const rawEmail = formData.get("email");
    const rawPassword = formData.get("password");

    // Perform validation
    const parsed = authSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[Auth Error] signIn failed:", error.message);
      return { error: "Invalid login credentials." };
    }
  } catch (err: unknown) {
    console.error("[Server Error] signIn crashed:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  try {
    const rawEmail = formData.get("email");
    const rawPassword = formData.get("password");
    const rawFullName = formData.get("fullName");

    // Perform validation
    const parsed = signUpSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
      fullName: rawFullName,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { email, password, fullName } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("[Auth Error] signUp failed:", error.message);
      return { error: error.message };
    }

    return { success: "Check your email to confirm registration!" };
  } catch (err: unknown) {
    console.error("[Server Error] signUp crashed:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err: unknown) {
    console.error("[Server Error] signOut crashed:", err);
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
