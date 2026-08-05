import type {
  Article,
  ArticleSummary,
  CategoryId,
  LiteraryWork,
  Locale,
  Writer,
} from "@/data/types";
import { ALL_FILTER_ID } from "@/data/types";
import { getAllArticles, getArticlesByCategory, getWorks, getWriters } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { estimateReadingTime } from "@/lib/reading-time";

/**
 * Client-side search over one locale's content bundle.
 *
 * There is no index, no API route and no external service: each edition is a few
 * dozen entries held in TypeScript files, so a substring scan over pre-joined
 * haystacks is both simpler and faster than anything with infrastructure behind
 * it. Every helper is pure and works identically on the server (during static
 * generation) and in the browser.
 *
 * Search never crosses locales. An Armenian query searches Armenian text only.
 */

/** Lowercases and collapses runs of whitespace so " Տիգրան  Մեծ " matches "տիգրան մեծ". */
export function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * True when every whitespace-separated term in `query` appears somewhere in the
 * haystack. Multi-term queries therefore behave as AND, matching across fields.
 */
export function matches(haystack: string, query: string): boolean {
  const needle = normalize(query);
  if (!needle) return true;
  return needle.split(" ").every((term) => haystack.includes(term));
}

function haystack(...parts: (string | string[] | undefined)[]): string {
  return normalize(
    parts
      .flatMap((part) => (Array.isArray(part) ? part : [part]))
      .filter((part): part is string => Boolean(part))
      .join(" "),
  );
}

/* -------------------------------------------------------------------------- */
/*  Listing projections                                                        */
/* -------------------------------------------------------------------------- */

/**
 * What a listing needs on the client: the card fields plus pre-joined searchable
 * text. The full `sections` prose is deliberately left behind so the payload
 * handed to the browser stays small.
 *
 * `href` is already locale-prefixed here — cards link straight to it.
 *
 * One shape serves every article-backed listing (history and cuisine today).
 * They differ only in which fields the filter pills key off — `periodId` and
 * `topicTypeId` for history, `dishTypeId` for a kind of dish — and that is the
 * listing component's business, not this projection's.
 */
export interface ArticleListingItem extends ArticleSummary {
  haystack: string;
}

export function toArticleListingItems(
  locale: Locale,
  articles: Article[],
): ArticleListingItem[] {
  return articles.map((article) => ({
    slug: article.slug,
    href: localePath(locale, article.href),
    category: article.category,
    categoryLabel: article.categoryLabel,
    title: article.title,
    excerpt: article.excerpt,
    // Derived here, and by `ArticleLayout` for the article header, from the one
    // function — so a card and the page it opens can never disagree.
    readingTime: estimateReadingTime(article),
    period: article.period,
    periodId: article.periodId,
    topicTypeId: article.topicTypeId,
    dishType: article.dishType,
    dishTypeId: article.dishTypeId,
    // The projection is written field by field rather than spread, so a new
    // filter key is invisible to the compiler here — every field is optional on
    // `ArticleSummary`. Omitting this one left the places listing rendering its
    // pills and matching nothing.
    placeTypeId: article.placeTypeId,
    imageSeed: article.imageSeed,
    image: article.image,
    featured: article.featured,
    haystack: haystack(
      article.title,
      article.excerpt,
      article.intro,
      // Visible prose, so it belongs in the haystack: a reader who searches a
      // phrase they can see on the page should find the page.
      article.summary,
      article.period,
      article.dishType,
      article.categoryLabel,
      article.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
      // A dish is searched for by what is in it, where it is made and when it
      // is eaten at least as often as by its name, and none of the three is
      // anywhere else in this payload.
      //
      // `occasions` was missing here until August 2026 while the global index
      // below carried it, so the cuisine listing answered "Christmas" with an
      // empty grid and the search page answered it with ghapama — from a search
      // box whose own placeholder offers "dishes, ingredients and occasions".
      article.cuisine?.ingredients,
      article.cuisine?.regions,
      article.cuisine?.occasions,
      // The reason the field exists: "sasna tsrer" appears in no other field of
      // the Armenian edition, and a reader typing it should still find the epic.
      article.keywords,
    ),
  }));
}

export interface WriterListingItem extends Writer {
  href: string;
  haystack: string;
}

export function toWriterListingItems(locale: Locale, writers: Writer[]): WriterListingItem[] {
  return writers.map((writer) => ({
    ...writer,
    href: localePath(locale, `/writers/${writer.slug}`),
    haystack: haystack(
      writer.name,
      writer.lifespan,
      writer.description,
      writer.period,
      writer.role,
      writer.notableWorks,
    ),
  }));
}

export interface WorkListingItem extends LiteraryWork {
  href: string;
  haystack: string;
}

export function toWorkListingItems(locale: Locale, works: LiteraryWork[]): WorkListingItem[] {
  return works.map((work) => ({
    ...work,
    href: localePath(locale, `/works/${work.slug}`),
    haystack: haystack(
      work.title,
      work.author,
      work.summary,
      work.genre,
      work.publicationPeriod,
    ),
  }));
}

/* -------------------------------------------------------------------------- */
/*  Filtering                                                                  */
/* -------------------------------------------------------------------------- */

export interface FilterableItem {
  haystack: string;
}

/**
 * One filter axis: the id the reader selected, and how to read the matching
 * field off an item. `all` (or an empty string) means the axis is not filtering.
 */
export interface FilterCriterion<T> {
  selected: string;
  keyOf: (item: T) => string | undefined;
}

/**
 * Applies the search term and every filter axis together — an item must satisfy
 * all of them (AND), not any.
 *
 * Takes a list of axes rather than one, because the history listing has two:
 * an era and a kind of subject. Passing a single-element list is the normal case
 * and reads the same as the old single-filter signature did.
 */
export function filterItems<T extends FilterableItem>(
  items: T[],
  query: string,
  criteria: FilterCriterion<T>[],
): T[] {
  const needle = normalize(query);
  const active = criteria.filter(
    (criterion) => Boolean(criterion.selected) && criterion.selected !== ALL_FILTER_ID,
  );

  return items.filter((item) => {
    for (const criterion of active) {
      if (criterion.keyOf(item) !== criterion.selected) return false;
    }
    if (needle && !matches(item.haystack, needle)) return false;
    return true;
  });
}

/* -------------------------------------------------------------------------- */
/*  Global search                                                              */
/* -------------------------------------------------------------------------- */

export interface SearchResult {
  type: CategoryId;
  slug: string;
  /** Already locale-prefixed. */
  href: string;
  title: string;
  /** One-line context under the title: lifespan, author, period. */
  meta?: string;
  description: string;
  imageSeed: string;
  haystack: string;
}

/**
 * Flat, searchable projection of one edition's content. Writers and works are
 * represented by their article entry, so a result always links to a page that
 * renders the full biography or summary — and only pages that exist in this
 * locale are indexed.
 */
export function buildSearchIndex(locale: Locale): SearchResult[] {
  const articles = getAllArticles(locale);
  const writerBySlug = new Map(getWriters(locale).map((writer) => [writer.slug, writer]));
  const workBySlug = new Map(getWorks(locale).map((work) => [work.slug, work]));

  return articles.map((article) => {
    const writer = writerBySlug.get(article.slug);
    const work = workBySlug.get(article.slug);

    const meta =
      writer?.lifespan ??
      (work
        ? `${work.author} · ${work.publicationPeriod}`
        : (article.period ?? article.dishType));

    return {
      type: article.category,
      slug: article.slug,
      href: localePath(locale, article.href),
      title: article.title,
      meta,
      description: article.excerpt,
      imageSeed: article.imageSeed,
      haystack: haystack(
        article.title,
        article.excerpt,
        article.intro,
        article.summary,
        article.period,
        article.dishType,
        article.categoryLabel,
        article.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
        article.keywords,
        article.cuisine?.ingredients,
        article.cuisine?.regions,
        article.cuisine?.occasions,
        writer?.name,
        writer?.role,
        writer?.notableWorks,
        work?.author,
        work?.genre,
        work?.summary,
      ),
    };
  });
}

/** The history listing items for one edition, ready for the client component. */
export function getHistoryListingItems(locale: Locale): ArticleListingItem[] {
  return toArticleListingItems(locale, getArticlesByCategory(locale, "history"));
}

/** The cuisine listing items for one edition, ready for the client component. */
export function getCuisineListingItems(locale: Locale): ArticleListingItem[] {
  return toArticleListingItems(locale, getArticlesByCategory(locale, "cuisine"));
}
