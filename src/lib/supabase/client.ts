import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/data/types";

/**
 * Supabase is used for exactly one thing: collecting newsletter email addresses.
 *
 * No educational content, no authentication, no profiles and no search go
 * through it — all of that stays in local TypeScript files. The only table the
 * browser ever touches is `newsletter_subscribers`, and the only permission the
 * anon key carries is INSERT (see `docs/supabase-newsletter.sql`).
 *
 * Both variables are `NEXT_PUBLIC_` because the anon key is designed to be
 * published; row level security, not secrecy, is what protects the table. The
 * service-role key must never appear in this directory or anywhere else the
 * client bundle can reach.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

/**
 * False on a fresh clone with no `.env.local`. Callers check this and show a
 * development notice instead of attempting a request that cannot succeed —
 * localhost development must never crash because credentials are absent.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

let cached: SupabaseClient | null = null;

/** The shared browser client, or `null` when the environment is not configured. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: {
        // Nobody signs in: skip session storage and token refresh entirely.
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return cached;
}

/** The single table this project is allowed to write to. */
export const NEWSLETTER_TABLE = "newsletter_subscribers";

export interface NewsletterSubscriberInsert {
  email: string;
  source: string;
  /** One of the supported route locales: "hy", "hyw" or "en". */
  locale: Locale;
}
