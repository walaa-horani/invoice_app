import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client designed to be used in client components
 * running in the browser.
 */
export function createClient(): SupabaseClient<Database> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
