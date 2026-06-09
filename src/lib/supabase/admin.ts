import { createClient } from "@supabase/supabase-js";

/**
 * Privileged service-role client for trusted server code only (Route Handlers,
 * Server Actions). NEVER import this into a Client Component. Returns null when
 * the service-role key is not configured.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
