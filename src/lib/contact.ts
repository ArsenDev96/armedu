import "server-only";

/**
 * Whether `/api/contact` can actually deliver a message.
 *
 * Server-only: these variables carry no `NEXT_PUBLIC_` prefix precisely so they
 * never reach the browser. The contact page reads this to decide whether to
 * show the development notice under the form, the same way the newsletter form
 * checks `isSupabaseConfigured()`.
 *
 * Note this is evaluated when the page is prerendered, not per request, so a
 * `.env.local` edit needs a dev-server restart to take effect — the same
 * restart the Supabase variables already require.
 */
export function isContactConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.trim();
  return Boolean(host && user && password);
}
