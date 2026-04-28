// This is a server-only file
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { type Database } from "../types/database.types";

// Create a Supabase client for server components with cookie handling
export const createServerComponentClient = () => {
  // In Next.js 15+, cookies() is async.
  const cookieStorePromise = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          // createServerClient accepts async cookie accessors.
          return cookieStorePromise.then((cookieStore) => cookieStore.get(name)?.value);
        },
        set(name: string, value: string, options: CookieOptions) {
          // NextResponse.cookies is used for setting cookies in route handlers
          // In Server Components we typically don't set cookies directly
          // This will throw an error if called from a Server Component
          try {
            cookieStorePromise.then((cookieStore) => cookieStore.set(name, value, options));
          } catch (error) {
            // This is expected when called from a Server Component
            // Cookie setting should be done in Route Handlers or Middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          // Same behavior as set() but with empty value and maxAge=0
          try {
            cookieStorePromise.then((cookieStore) => cookieStore.set(name, "", { ...options, maxAge: 0 }));
          } catch (error) {
            // This is expected when called from a Server Component
          }
        },
      },
    }
  );
};