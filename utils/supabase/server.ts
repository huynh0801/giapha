import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  if (!supabaseUrl || !supabaseKey) {
    // Return a dummy client to avoid crashing the render if accessed before redirect
    const emptyResult = async () => ({ data: null, error: null });
    const emptyArrayResult = async () => ({ data: [], error: null });
    const queryBuilder = {
      select: () => queryBuilder,
      eq: () => queryBuilder,
      neq: () => queryBuilder,
      gte: () => queryBuilder,
      lte: () => queryBuilder,
      order: () => queryBuilder,
      limit: () => queryBuilder,
      single: emptyResult,
      maybeSingle: emptyResult,
      insert: () => ({ select: () => ({ single: emptyResult }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: emptyResult }) }) }),
      delete: () => ({ eq: emptyResult, neq: emptyResult }),
      then: (resolve: (value: { data: never[]; error: null }) => void) =>
        emptyArrayResult().then(resolve),
    };

    return {
      from: () => queryBuilder,
      rpc: emptyArrayResult,
      storage: {
        from: () => ({
          upload: emptyResult,
          remove: emptyArrayResult,
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as unknown as SupabaseClient;
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
