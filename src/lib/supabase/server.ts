import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client designed to be used in Server Components,
 * Server Actions, and Route Handlers.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Partial<{
                domain?: string;
                path?: string;
                expires?: Date | number;
                maxAge?: number;
                secure?: boolean;
                httpOnly?: boolean;
                sameSite?: "lax" | "strict" | "none" | boolean;
              }>)
            );
          } catch {
            // The `setAll` method can be called from a Server Component.
            // In Next.js App Router, writing cookies during rendering is restricted.
            // This error can be ignored if a Middleware is refreshing sessions.
          }
        },
      },
    }
  );
}
