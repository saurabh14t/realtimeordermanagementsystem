import { createClient } from "@supabase/supabase-js"

/**
 * When running in a preview without env vars, we still want the UI to render.
 * We create a stub Supabase client that returns empty data instead of
 * crashing the whole app.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

type SupabaseClient = ReturnType<typeof createClient>

// ────────────────────────────────────────────────────────────────────────────────
// 1.  Helper to create a no-op stub (all methods return a resolved promise).
// ────────────────────────────────────────────────────────────────────────────────
function createStubClient(): SupabaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noOp: any = async () => ({ data: null, error: new Error("Stub Supabase client: env vars missing") })

  // A VERY light mock that covers the handful of methods we call.
  // Add more as you expand your usage.
  return {
    from: () => ({
      select: noOp,
      insert: noOp,
      update: noOp,
      delete: noOp,
      eq: () => ({ select: noOp, update: noOp, delete: noOp, single: noOp }),
      order: () => ({ select: noOp }),
      single: noOp,
    }),
    rpc: noOp,
  } as unknown as SupabaseClient
}

// ────────────────────────────────────────────────────────────────────────────────
// 2.  Export the proper client (or stub) so the rest of the code keeps working.
// ────────────────────────────────────────────────────────────────────────────────
export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (() => {
        console.warn(
          "%c[Supabase] Environment variables missing – using stub client. " +
            "Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real data.",
          "color: orange; font-weight: bold;",
        )
        return createStubClient()
      })()

export const supabaseAdmin: SupabaseClient =
  supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey) : supabase
