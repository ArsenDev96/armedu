/**
 * Content model for the platform.
 *
 * All content lives in local TypeScript files under `src/data/locales/<locale>`.
 * A locale bundle is a plain object, so adding Armenian (hy), Western Armenian
 * (hyw) or Russian (ru) later means adding a folder — no database, no API.
 */

export type Locale = "en" | "hy" | "hyw" | "ru";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "hy", label: "Հայերեն", short: "ՀԱՅ" },
  { code: "en", label: "English", short: "EN" },
];

export const DEFAULT_LOCALE: Locale = "en";

export type CategoryId = "history" | "writers" | "works";

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  imageSeed: string;
  /** Photograph in `public/`. Falls back to the generated artwork when absent. */
  image?: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface KeyFact {
  label: string;
  value: string;
}

export interface DateEntry {
  year: string;
  event: string;
}

export interface Source {
  title: string;
  publisher: string;
  href?: string;
}

/** Card-level article data used across listings and the homepage. */
export interface ArticleSummary {
  slug: string;
  href: string;
  category: CategoryId;
  categoryLabel: string;
  title: string;
  excerpt: string;
  readingTime: number;
  period?: string;
  periodId?: string;
  imageSeed: string;
  featured?: boolean;
}

/** Full article payload for a detail page. */
export interface Article extends ArticleSummary {
  intro: string;
  author: string;
  updated: string;
  sections: ArticleSection[];
  keyFacts: KeyFact[];
  importantDates: DateEntry[];
  significance: {
    heading: string;
    paragraphs: string[];
  };
  interestingFacts: string[];
  relatedFigures: {
    name: string;
    lifespan: string;
    description: string;
  }[];
  relatedSlugs: string[];
  sources: Source[];
}

export interface Writer {
  slug: string;
  name: string;
  lifespan: string;
  period: string;
  periodId: string;
  role: string;
  description: string;
  imageSeed: string;
  notableWorks: string[];
  featured?: boolean;
}

export interface LiteraryWork {
  slug: string;
  title: string;
  author: string;
  publicationPeriod: string;
  genre: string;
  summary: string;
  imageSeed: string;
}

export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  description: string;
}

export interface Filter {
  id: string;
  label: string;
}

export interface LocaleContent {
  categories: Category[];
  articles: Article[];
  writers: Writer[];
  works: LiteraryWork[];
  timeline: TimelineEntry[];
  historyPeriods: Filter[];
  literaryPeriods: Filter[];
}
