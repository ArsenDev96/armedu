import { getLocaleBundle } from "@/data";
import { estimateReadingTime } from "@/lib/reading-time";
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

/**
 * Card-shaped projection of a full article.
 *
 * `readingTime` is computed here rather than stored on the article, so the card
 * and the article header always show the same number — they call the same
 * function on the same prose.
 */
export function toArticleSummary(article: Article): ArticleSummary {
  return { ...article, readingTime: estimateReadingTime(article) };
}

export function getFeaturedArticles(locale: Locale, limit = 6): ArticleSummary[] {
  const all = getAllArticles(locale);
  const featured = all.filter((article) => article.featured);
  const rest = all.filter((article) => !article.featured);
  return [...featured, ...rest].slice(0, limit).map(toArticleSummary);
}

/**
 * Related articles, restricted to the current edition.
 *
 * `relatedSlugs` that have no translation in this locale are dropped rather than
 * linked, so a reader on `/hyw` is never sent to a page they cannot read. If
 * that leaves fewer than three, the gap is filled from the same locale.
 *
 * The filler is confined to the article's **own category**. An authored
 * `relatedSlugs` entry may deliberately cross categories — the First Republic
 * links to the poet of that generation, and that is an editorial judgement worth
 * honouring — but a *filler* has made no judgement at all, and until August 2026
 * one deleted slug was all it took for a history article to recommend a recipe.
 * If the same-category pool cannot fill three, fewer than three are returned:
 * a short row is honest, an irrelevant one is not.
 */
export function getRelatedArticles(locale: Locale, article: Article): ArticleSummary[] {
  const all = getAllArticles(locale);
  const related = article.relatedSlugs
    .map((slug) => all.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is Article => Boolean(candidate));

  if (related.length >= 3) return related.slice(0, 3).map(toArticleSummary);

  const fillers = all.filter(
    (candidate) =>
      candidate.category === article.category &&
      candidate.slug !== article.slug &&
      !related.some((item) => item.slug === candidate.slug),
  );
  return [...related, ...fillers].slice(0, 3).map(toArticleSummary);
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

/** The history listing's second filter axis: what kind of subject an article has. */
export function getHistoryTopicTypes(locale: Locale) {
  return getLocaleBundle(locale).historyTopicTypes;
}

export function getLiteraryPeriods(locale: Locale) {
  return getLocaleBundle(locale).literaryPeriods;
}

export function getWorkGenres(locale: Locale) {
  return getLocaleBundle(locale).workGenres;
}

export function getCuisineTypes(locale: Locale) {
  return getLocaleBundle(locale).cuisineTypes;
}

/**
 * The article before and after this one within its category.
 *
 * Navigation never crosses categories or locales: a writer biography is only
 * ever followed by another writer biography in the same edition.
 *
 * Order comes from `chronoOrder` when the category declares it, and from the
 * authored array order when it does not. Until August 2026 it was always the
 * array position, and the array is not chronological — so «Տիգրան Մեծ» (first
 * century BC) offered «Ուրարտուի թագավորությունը» (ninth century BC) as the
 * *next* article, which is the one thing a Previous/Next pair promises not to do.
 *
 * Sorting a copy is the point. The listing, the featured fallback and the
 * `ItemList` in the category's structured data all read the array directly and
 * are deliberately left in the order an editor chose.
 */
export function getAdjacentArticles(
  locale: Locale,
  article: Article,
): { previous?: ArticleSummary; next?: ArticleSummary } {
  const unordered = getArticlesByCategory(locale, article.category);

  // Mixed or absent `chronoOrder` would give a partial ordering that reads as a
  // bug rather than as a fallback, so a category opts in as a whole or not at all.
  const chronological = unordered.every((candidate) => typeof candidate.chronoOrder === "number");
  const siblings = chronological
    ? [...unordered].sort((a, b) => (a.chronoOrder ?? 0) - (b.chronoOrder ?? 0))
    : unordered;

  const index = siblings.findIndex((candidate) => candidate.slug === article.slug);
  if (index === -1) return {};

  const previous = siblings[index - 1];
  const next = siblings[index + 1];
  return {
    previous: previous ? toArticleSummary(previous) : undefined,
    next: next ? toArticleSummary(next) : undefined,
  };
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
