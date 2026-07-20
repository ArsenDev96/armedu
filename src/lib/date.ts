import { LOCALE_META, type Locale } from "@/data/types";

/**
 * Formats an ISO date (YYYY-MM-DD) for a locale.
 *
 * `Intl` is used rather than a hand-written month table so Armenian months and
 * ordering come out right; the UTC timezone is pinned so the same ISO date
 * never renders as two different days on two machines.
 */
export function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));

  return new Intl.DateTimeFormat(LOCALE_META[locale].intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
