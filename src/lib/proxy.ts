import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

/**
 * Route guard helper for Server Pages and Layouts.
 * If the user does not have an active session, redirects to /login.
 * Returns the authenticated user record.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Security guard for Server Actions.
 * Throws a authorization error if the user is not logged in.
 * Returns the user's ID.
 */
export async function requireAuthAction(): Promise<string> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: You must be logged in to perform this action.");
  }

  return user.id;
}

/**
 * Validates that the logged-in user is the owner of a specific invoice.
 * Used to prevent ID-guessing / ID-harvesting attacks.
 */
export async function validateInvoiceOwnership(invoiceId: string): Promise<void> {
  const userId = await requireAuthAction();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select("user_id")
    .eq("id", invoiceId)
    .single();

  if (error || !data) {
    throw new Error("Invoice not found.");
  }

  if (data.user_id !== userId) {
    throw new Error("Forbidden: You do not have permission to access this invoice.");
  }
}
