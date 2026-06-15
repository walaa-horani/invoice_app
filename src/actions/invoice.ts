"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAuthAction } from "@/lib/proxy";
import { InvoiceFormInput } from "@/types/invoice";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema to sanitize and validate invoice input at runtime
const invoiceSchema = z.object({
  client_name: z
    .string()
    .trim()
    .min(1, "Client name is required")
    .max(100, "Client name cannot exceed 100 characters"),
  client_email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(255, "Client email is too long"),
  status: z.enum(["PAID", "PENDING", "OVERDUE"]),
  total_amount: z
    .number({ message: "Amount must be a number" })
    .nonnegative("Total amount cannot be negative")
    .max(9999999999.99, "Amount exceeds maximum allowed limit"),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
});

/**
 * Fetch all invoices for the authenticated user.
 */
export async function getInvoices() {
  try {
    const userId = await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      // Log the actual detailed error in the terminal for the developer
      console.error("[Database Error] Fetch Invoices failed:", error);
      throw new Error("Unable to retrieve invoices. Please try again later.");
    }

    return data || [];
  } catch (err: unknown) {
    console.error("[Server Error] getInvoices crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Fetch a single invoice by ID.
 * (RLS automatically prevents users from reading invoices they do not own)
 */
export async function getInvoiceById(id: string) {
  try {
    // Validate UUID format of ID input to prevent SQL injection or path traversal attempts
    const validatedId = z.string().uuid("Invalid invoice ID format").parse(id);

    await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", validatedId)
      .single();

    if (error) {
      console.error(`[Database Error] Fetch Invoice #${validatedId} failed:`, error);
      throw new Error("Invoice not found or access denied.");
    }

    return data;
  } catch (err: unknown) {
    console.error("[Server Error] getInvoiceById crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Create a new invoice.
 */
export async function createInvoiceAction(input: InvoiceFormInput) {
  try {
    // Perform strict schema validation
    const parsed = invoiceSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    const { client_name, client_email, status, total_amount, due_date } = parsed.data;

    const userId = await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invoices")
      .insert([
        {
          user_id: userId,
          client_name,
          client_email,
          status,
          total_amount,
          due_date,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[Database Error] Create Invoice failed:", error);
      throw new Error("Database transaction failed. Could not save the invoice.");
    }

    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return data;
  } catch (err: unknown) {
    console.error("[Server Error] createInvoiceAction crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Update an existing invoice.
 * (RLS automatically prevents updating other users' invoices)
 */
export async function updateInvoiceAction(id: string, input: InvoiceFormInput) {
  try {
    const validatedId = z.string().uuid("Invalid invoice ID format").parse(id);

    // Perform strict schema validation
    const parsed = invoiceSchema.safeParse(input);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(`Validation Error: ${errorMsg}`);
    }

    const { client_name, client_email, status, total_amount, due_date } = parsed.data;

    await requireAuthAction();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("invoices")
      .update({
        client_name,
        client_email,
        status,
        total_amount,
        due_date,
        updated_at: new Date().toISOString(),
      })
      .eq("id", validatedId)
      .select()
      .single();

    if (error) {
      console.error(`[Database Error] Update Invoice #${validatedId} failed:`, error);
      throw new Error("Database transaction failed. Could not update the invoice.");
    }

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${validatedId}`);
    revalidatePath("/dashboard");
    return data;
  } catch (err: unknown) {
    console.error("[Server Error] updateInvoiceAction crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}

/**
 * Delete an invoice.
 * (RLS automatically prevents deleting other users' invoices)
 */
export async function deleteInvoiceAction(id: string) {
  try {
    const validatedId = z.string().uuid("Invalid invoice ID").parse(id);

    await requireAuthAction();
    const supabase = await createClient();

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", validatedId);

    if (error) {
      console.error(`[Database Error] Delete Invoice #${validatedId} failed:`, error);
      throw new Error("Database transaction failed. Could not delete the invoice.");
    }

    revalidatePath("/invoices");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("[Server Error] deleteInvoiceAction crashed:", err);
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    throw new Error(message);
  }
}
