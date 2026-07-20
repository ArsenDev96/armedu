import type { Article } from "@/data/types";

/**
 * Average adult reading speed for non-technical prose. Erring low is kinder: an
 * article that reads faster than promised is a pleasant surprise.
 */
const WORDS_PER_MINUTE = 200;

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Every piece of prose a reader actually moves through, in reading order. */
function collectProse(article: Article): string[] {
  return [
    article.intro,
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
    article.significance.heading,
    ...article.significance.paragraphs,
    ...article.interestingFacts,
    ...article.importantDates.map((entry) => `${entry.year} ${entry.event}`),
    ...article.keyFacts.map((fact) => `${fact.label} ${fact.value}`),
    ...article.relatedFigures.map((figure) => `${figure.name} ${figure.description}`),
  ];
}

/**
 * Estimated minutes to read an article, rounded up, never below one.
 *
 * Computed from the content itself rather than trusting `article.readingTime`,
 * so the figure cannot drift as an article is edited. The stored value is kept
 * as the card-level hint and as a fallback.
 */
export function estimateReadingTime(article: Article): number {
  const words = collectProse(article).reduce((total, text) => total + countWords(text), 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Formats a minute count for display, e.g. `8 min read`. */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
