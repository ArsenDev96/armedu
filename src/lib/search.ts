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
 */
export interface HistoryListingItem extends ArticleSummary {
  haystack: string;
}

export function toHistoryListingItems(
  locale: Locale,
  articles: Article[],
): HistoryListingItem[] {
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
    imageSeed: article.imageSeed,
    image: article.image,
    featured: article.featured,
    haystack: haystack(
      article.title,
      article.excerpt,
      article.intro,
      article.period,
      article.categoryLabel,
      article.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
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
 * Applies the search term and the selected filter together — an item must
 * satisfy both (AND), not either.
 */
export function filterItems<T extends FilterableItem>(
  items: T[],
  query: string,
  filterId: string,
  filterKeyOf: (item: T) => string | undefined,
): T[] {
  const needle = normalize(query);
  const filtering = Boolean(filterId) && filterId !== ALL_FILTER_ID;

  return items.filter((item) => {
    if (filtering && filterKeyOf(item) !== filterId) return false;
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
      (work ? `${work.author} · ${work.publicationPeriod}` : article.period);

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
        article.period,
        article.categoryLabel,
        article.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
        article.keywords,
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
export function getHistoryListingItems(locale: Locale): HistoryListingItem[] {
  return toHistoryListingItems(locale, getArticlesByCategory(locale, "history"));
}
