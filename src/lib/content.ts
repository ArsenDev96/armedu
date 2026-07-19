import { getContent } from "@/data";
import type {
  Article,
  ArticleSummary,
  CategoryId,
  Locale,
  LiteraryWork,
  Writer,
} from "@/data/types";

export function getAllArticles(locale?: Locale): Article[] {
  return getContent(locale).articles;
}

export function getArticlesByCategory(category: CategoryId, locale?: Locale): Article[] {
  return getAllArticles(locale).filter((article) => article.category === category);
}

export function getArticle(category: CategoryId, slug: string, locale?: Locale): Article | undefined {
  return getAllArticles(locale).find(
    (article) => article.category === category && article.slug === slug,
  );
}

export function findArticleBySlug(slug: string, locale?: Locale): Article | undefined {
  return getAllArticles(locale).find((article) => article.slug === slug);
}

export function getFeaturedArticles(limit = 6, locale?: Locale): ArticleSummary[] {
  const all = getAllArticles(locale);
  const featured = all.filter((article) => article.featured);
  const rest = all.filter((article) => !article.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedArticles(article: Article, locale?: Locale): ArticleSummary[] {
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

export function getWriters(locale?: Locale): Writer[] {
  return getContent(locale).writers;
}

export function getWriter(slug: string, locale?: Locale): Writer | undefined {
  return getWriters(locale).find((writer) => writer.slug === slug);
}

export function getWorks(locale?: Locale): LiteraryWork[] {
  return getContent(locale).works;
}

export function getTimeline(locale?: Locale) {
  return getContent(locale).timeline;
}

export function getCategories(locale?: Locale) {
  return getContent(locale).categories;
}

export function getHistoryPeriods(locale?: Locale) {
  return getContent(locale).historyPeriods;
}

export function getLiteraryPeriods(locale?: Locale) {
  return getContent(locale).literaryPeriods;
}
