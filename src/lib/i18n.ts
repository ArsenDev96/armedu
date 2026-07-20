import { getLocaleBundle } from "@/data";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  isLocale,
  type CategoryId,
  type Locale,
  type LocaleContent,
  type LocaleMeta,
} from "@/data/types";
import type { UiDictionary } from "@/data/ui";

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale };
export type { Locale };

/**
 * Narrows a route parameter to a `Locale`.
 *
 * Next.js types dynamic segments as `string`, so this is the single place the
 * widening is undone. `dynamicParams = false` on the `[locale]` segment means an
 * unsupported locale already 404s before a page renders, so reaching the throw
 * would mean the route config and this function had drifted apart — worth
 * failing loudly rather than rendering the wrong edition.
 */
export function resolveLocale(value: string): Locale {
  if (isLocale(value)) return value;
  throw new Error(
    `Unsupported locale segment "${value}". Expected one of: ${SUPPORTED_LOCALES.join(", ")}.`,
  );
}

/**
 * Same narrowing, but falls back to the default edition instead of throwing.
 *
 * Only the root layout uses this. When a page calls `notFound()`, Next re-renders
 * the layout to wrap the not-found boundary, and the locale param is not always
 * present in that pass — a throw there would replace our localized 404 with
 * Next's built-in error page. Pages keep the strict `resolveLocale`.
 */
export function resolveLocaleOrDefault(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/* -------------------------------------------------------------------------- */
/*  Paths                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Prefixes a locale-free content path with the active locale.
 *
 * Content stores paths without a locale (`/history/tigran-the-great`) so a slug
 * is identical in every edition; the prefix is added here at render time. That
 * keeps a single canonical slug per article and makes switching language a
 * matter of swapping one path segment.
 */
export function localePath(locale: Locale, path = "/"): string {
  if (!path || path === "/") return `/${locale}`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

/** Strips the locale prefix from a pathname, returning the locale-free part. */
export function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const match = /^\/([^/]+)(\/.*)?$/.exec(pathname);
  if (!match) return { locale: null, path: pathname };

  const [, first, rest] = match;
  if (!isLocale(first)) return { locale: null, path: pathname };

  return { locale: first, path: rest && rest !== "/" ? rest : "/" };
}

/* -------------------------------------------------------------------------- */
/*  Bundles and UI strings                                                     */
/* -------------------------------------------------------------------------- */

export function getBundle(locale: Locale): LocaleContent {
  return getLocaleBundle(locale);
}

export function getUi(locale: Locale): UiDictionary {
  return getLocaleBundle(locale).ui;
}

export function getPages(locale: Locale) {
  return getLocaleBundle(locale).pages;
}

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return LOCALE_META[locale];
}

/**
 * Substitutes `{token}` placeholders in a dictionary string.
 *
 * Deliberately tiny: the alternative is an i18n library, and this project needs
 * exactly one feature from one — named interpolation.
 */
export function t(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Picks the singular or plural template by count, then interpolates it. */
export function plural(
  one: string,
  other: string,
  count: number,
  values: Record<string, string | number> = {},
): string {
  return t(count === 1 ? one : other, { count, ...values });
}

/* -------------------------------------------------------------------------- */
/*  Content availability                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The canonical slug set, taken from the primary edition.
 *
 * Armenian is the complete edition, so it defines which articles exist at all.
 * Other locales may translate a subset; they may never introduce a slug the
 * primary edition does not have.
 */
export function getCanonicalSlugs(category: CategoryId): string[] {
  return getLocaleBundle(DEFAULT_LOCALE)
    .articles.filter((article) => article.category === category)
    .map((article) => article.slug);
}

export function getArticleBySlug(locale: Locale, category: CategoryId, slug: string) {
  return getLocaleBundle(locale).articles.find(
    (article) => article.category === category && article.slug === slug,
  );
}

/** True when this exact article is published in this exact language. */
export function hasTranslation(locale: Locale, category: CategoryId, slug: string): boolean {
  return Boolean(getArticleBySlug(locale, category, slug));
}

/** Every locale in which this article can actually be read, in display order. */
export function getAvailableLocalesForContent(category: CategoryId, slug: string): Locale[] {
  return SUPPORTED_LOCALES.filter((locale) => hasTranslation(locale, category, slug));
}

/**
 * `hreflang` alternates for one article — only the editions that exist.
 *
 * An article with no Western Armenian translation must not advertise a `hyw`
 * alternate, or a crawler would treat the "not translated" page as a full
 * translation.
 */
export function getContentAlternates(
  category: CategoryId,
  slug: string,
): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of getAvailableLocalesForContent(category, slug)) {
    alternates[LOCALE_META[locale].htmlLang] = localePath(locale, `/${category}/${slug}`);
  }
  return alternates;
}

/** `hreflang` alternates for a page that exists in every edition. */
export function getStaticAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    alternates[LOCALE_META[locale].htmlLang] = localePath(locale, path);
  }
  return alternates;
}
