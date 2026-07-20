import { getLocaleBundle } from "@/data";
import type {
  Article,
  ArticleSummary,
  CategoryId,
  Locale,
  LiteraryWork,
  Writer,
} from "@/data/types";
import { localePath } from "@/lib/i18n";

/**
 * Content read helpers.
 *
 * `locale` is a required first argument on every function — there is no default
 * and no fallback. That is deliberate: an optional locale is exactly how English
 * would leak onto an Armenian page.
 */

export function getAllArticles(locale: Locale): Article[] {
  return getLocaleBundle(locale).articles;
}

export function getArticlesByCategory(locale: Locale, category: CategoryId): Article[] {
  return getAllArticles(locale).filter((article) => article.category === category);
}

export function getArticle(
  locale: Locale,
  category: CategoryId,
  slug: string,
): Article | undefined {
  return getAllArticles(locale).find(
    (article) => article.category === category && article.slug === slug,
  );
}

export function getFeaturedArticles(locale: Locale, limit = 6): ArticleSummary[] {
  const all = getAllArticles(locale);
  const featured = all.filter((article) => article.featured);
  const rest = all.filter((article) => !article.featured);
  return [...featured, ...rest].slice(0, limit);
}

/**
 * Related articles, restricted to the current edition.
 *
 * `relatedSlugs` that have no translation in this locale are dropped rather than
 * linked, so a reader on `/hyw` is never sent to a page they cannot read. If
 * that leaves fewer than three, the gap is filled from the same locale.
 */
export function getRelatedArticles(locale: Locale, article: Article): ArticleSummary[] {
  const all = getAllArticles(locale);
  const related = article.relatedSlugs
    .map((slug) => all.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Article => Boolean(candidate));

  if (related.length >= 3) return related.slice(0, 3);

  const fillers = all.filter(
    (candidate) =>
      candidate.slug !== article.slug && !related.some((item) => item.slug === candidate.slug),
  );
  return [...related, ...fillers].slice(0, 3);
}

export function getWriters(locale: Locale): Writer[] {
  return getLocaleBundle(locale).writers;
}

export function getWorks(locale: Locale): LiteraryWork[] {
  return getLocaleBundle(locale).works;
}

export function getTimeline(locale: Locale) {
  return getLocaleBundle(locale).timeline;
}

export function getCategories(locale: Locale) {
  return getLocaleBundle(locale).categories;
}

export function getHistoryPeriods(locale: Locale) {
  return getLocaleBundle(locale).historyPeriods;
}

export function getLiteraryPeriods(locale: Locale) {
  return getLocaleBundle(locale).literaryPeriods;
}

export function getWorkGenres(locale: Locale) {
  return getLocaleBundle(locale).workGenres;
}

/**
 * The article before and after this one, in the order its category is authored.
 * Navigation never crosses categories or locales: a writer biography is only
 * ever followed by another writer biography in the same edition.
 */
export function getAdjacentArticles(
  locale: Locale,
  article: Article,
): { previous?: ArticleSummary; next?: ArticleSummary } {
  const siblings = getArticlesByCategory(locale, article.category);
  const index = siblings.findIndex((candidate) => candidate.slug === article.slug);
  if (index === -1) return {};

  return { previous: siblings[index - 1], next: siblings[index + 1] };
}

/** Where a category's listing lives in this locale, for the "back to" link. */
export function getCategoryListing(
  locale: Locale,
  category: CategoryId,
): { href: string; title: string } {
  const match = getCategories(locale).find((entry) => entry.id === category);
  return {
    href: localePath(locale, match?.href ?? `/${category}`),
    title: match?.title ?? category,
  };
}
