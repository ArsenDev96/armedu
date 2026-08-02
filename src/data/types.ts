/**
 * Content model for the platform.
 *
 * All content lives in local TypeScript files under `src/data/locales/<locale>`.
 * A locale bundle is a plain object, so a new edition means a new folder — no
 * database, no API, no CMS.
 *
 * There is deliberately **no fallback between locales**. A reader on `/hy` sees
 * Armenian or an explicit "not available in this language" state; they never see
 * English text leaking through a gap in the Armenian edition.
 */

import type { UiDictionary } from "@/data/ui";

export type Locale = "hy" | "hyw" | "en";

export const SUPPORTED_LOCALES = ["hy", "hyw", "en"] as const;

/** Armenian is the primary edition and the site default. */
export const DEFAULT_LOCALE: Locale = "hy";

export interface LocaleMeta {
  code: Locale;
  /** Endonym, shown in the language selector. */
  label: string;
  /** Compact form for the header chip. */
  short: string;
  /** Value for the `lang` attribute and `hreflang`. */
  htmlLang: string;
  /**
   * Open Graph locale. Western Armenian has no `xx_YY` territory form in the
   * OG/Facebook list, so `hy_AM` is used for both Armenian editions — the
   * closest valid standard value. The precise variety is still carried by the
   * BCP 47 `htmlLang` (`hyw`), which is where it belongs.
   */
  ogLocale: string;
  /** Locale tag for `Intl` date formatting. */
  intlLocale: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  hy: {
    code: "hy",
    label: "Հայերեն",
    short: "ՀԱՅ",
    htmlLang: "hy",
    ogLocale: "hy_AM",
    intlLocale: "hy-AM",
  },
  hyw: {
    code: "hyw",
    label: "Արեւմտահայերէն",
    short: "ԱՐԵՒ",
    htmlLang: "hyw",
    ogLocale: "hy_AM",
    intlLocale: "hy-AM",
  },
  en: {
    code: "en",
    label: "English",
    short: "EN",
    htmlLang: "en",
    ogLocale: "en_US",
    intlLocale: "en-GB",
  },
};

/** Ordered for display: primary edition first. */
export const LOCALES: LocaleMeta[] = SUPPORTED_LOCALES.map((code) => LOCALE_META[code]);

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export type CategoryId = "history" | "writers" | "works" | "cuisine";

export const CATEGORY_IDS: CategoryId[] = ["history", "writers", "works", "cuisine"];

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  /** Locale-free path segment; the locale prefix is added at render time. */
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

/**
 * How a source can be identified. Every citation must carry one.
 *
 * This field is the whole point of the type. An audit of the first bibliography
 * found that 18 of 48 citations named books that do not exist — plausible titles
 * attached to real publishers, linked to publisher homepages that always
 * resolved and so always looked convincing. An invented work has no ISBN and no
 * DOI to supply, so requiring an identifier is what makes the fabrication fail
 * at the point of writing rather than in front of a student.
 *
 * `archive` is for record groups (fonds/series/piece) that have no ISBN and are
 * not a publication at all; it carries the archival reference, not a URL.
 */
export type SourceIdentifier =
  | { kind: "isbn"; value: string }
  | { kind: "doi"; value: string }
  | { kind: "url"; value: string }
  | { kind: "archive"; value: string };

export interface Source {
  /** Omitted only for institutional records and archival series with no author. */
  author?: string;
  title: string;
  publisher: string;
  /** Year of the cited edition, or a range for multi-volume works. */
  year?: string;
  identifier: SourceIdentifier;
  /** Anything a reader needs in order to use the citation correctly. */
  note?: string;
}

/**
 * Licensed photography for an article. Optional: when it is absent the layout
 * falls back to the generated `PlaceholderImage`, which is what every article
 * uses today. When present, `credit` is rendered under the figure.
 */
export interface ContentImage {
  src: string;
  alt: string;
  credit?: string;
}

/** Card-level article data used across listings and the homepage. */
export interface ArticleSummary {
  slug: string;
  /** Locale-free path, e.g. `/history/tigran-the-great`. */
  href: string;
  category: CategoryId;
  categoryLabel: string;
  title: string;
  excerpt: string;
  readingTime: number;
  period?: string;
  periodId?: string;
  imageSeed: string;
  /**
   * Cuisine listing only: what kind of dish this is, and the filter id it
   * matches in `cuisineTypes`.
   *
   * Deliberately not folded into `period`/`periodId` above. Those name an era —
   * a historical one for history articles, a literary one for writers and works
   * — and a dish has no era; filing "Bread" under a field called `period` would
   * make the content model state something untrue in order to save two lines.
   * The two pairs are mutually exclusive: an article carries one or the other.
   */
  dishType?: string;
  dishTypeId?: string;
  /** Licensed cover photograph. Falls back to the generated artwork when absent. */
  image?: ContentImage;
  featured?: boolean;
  /**
   * Names this subject is also known by: transliterations, native spellings,
   * alternative romanisations, older titles.
   *
   * Not a ranking device — search engines have ignored `<meta name="keywords">`
   * for over a decade, and stuffing it would be the kind of flattering
   * misdescription the content rules exist to prevent. It exists because a
   * reader who types "Sasna Tsrer" or "Verk Hayastani" in Latin letters is
   * looking for an article whose title carries neither string, and nothing else
   * in the content model can match them.
   *
   * Three consumers read it, which is what keeps it honest: the on-site search
   * haystack (where it works today), the schema.org `keywords` property, and
   * the meta tag. Every entry must be a name a real person would actually type
   * for *this* subject — never a topic the article does not cover.
   */
  keywords?: string[];
}

/**
 * At-a-glance panel for a cuisine article: the handful of facts a reader wants
 * before the prose, in the same role `keyFacts` plays for the other categories.
 *
 * It exists because the alternative was worse in both directions — forcing a
 * dish into `relatedFigures` and `importantDates` alone would leave its
 * ingredients and occasions unstated, while giving cuisine its own article type
 * would fork the layout, the citation block, the reading time and the
 * translation machinery for one category.
 *
 * What it is **not** is a recipe. `preparation` is one short paragraph
 * describing how the dish is traditionally made, not quantities and steps: this
 * archive publishes cultural articles, and a page whose centre of gravity is a
 * method is a recipe page whatever the surrounding prose says. Every list here
 * is authored per locale, like all other prose.
 */
export interface CuisineDetails {
  /** Common ingredients. "Common", not "the" — regional versions differ. */
  ingredients: string[];
  /** One-paragraph overview of the traditional method. Never a recipe. */
  preparation: string;
  /** Occasions the dish is associated with: feasts, fasts, commemorations. */
  occasions: string[];
  /** Regions or communities where a documented version is prepared. */
  regions: string[];
  /** How it reaches the table and what it is eaten with. */
  serving: string;
}

/**
 * Full article payload for a detail page.
 *
 * `readingTime` is deliberately omitted: it is derived from this object's own
 * prose by `estimateReadingTime`, never authored. When it was a stored field,
 * the card and the article header disagreed on 28 of the 51 articles, because
 * one rendered the stored number and the other recomputed it.
 */
export interface Article extends Omit<ArticleSummary, "readingTime"> {
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
  /**
   * People whose lives the subject runs through. Categories that have no such
   * people — a dish does not — leave it empty, and the section is not rendered
   * rather than rendered blank.
   */
  relatedFigures: {
    name: string;
    lifespan: string;
    description: string;
  }[];
  /** Cuisine articles only; see `CuisineDetails`. */
  cuisine?: CuisineDetails;
  relatedSlugs: string[];
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
  /** Human-readable genre shown on the card, e.g. "Narrative poem". */
  genre: string;
  /** Filter key for the genre, matching an id in `workGenres`. */
  genreId: string;
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

/** Long-form copy for the supporting pages, translated per locale. */
export interface StaticPagesContent {
  about: {
    title: string;
    metaDescription: string;
    heading: string;
    lead: string;
    audiencesEyebrow: string;
    audiencesTitle: string;
    audiencesDescription: string;
    audiences: { title: string; text: string }[];
    principlesEyebrow: string;
    principlesTitle: string;
    principles: { title: string; text: string }[];
    languagesHeading: string;
    languagesBody: string;
    nextHeading: string;
    nextBody: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterDescription: string;
  };
  contact: {
    title: string;
    metaDescription: string;
    heading: string;
    lead: string;
    reasonsEyebrow: string;
    reasonsTitle: string;
    reasons: { title: string; text: string }[];
    alsoHere: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
  };
  privacy: {
    title: string;
    metaDescription: string;
    lastUpdated: string;
    lead: string;
    sections: { heading: string; body: string }[];
  };
}

export interface LocaleContent {
  /** Every visible interface string for this edition. */
  ui: UiDictionary;
  pages: StaticPagesContent;
  categories: Category[];
  articles: Article[];
  writers: Writer[];
  works: LiteraryWork[];
  timeline: TimelineEntry[];
  historyPeriods: Filter[];
  literaryPeriods: Filter[];
  /** Genre filters for the literary works listing. */
  workGenres: Filter[];
  /** Dish-type filters for the cuisine listing. Ids are shared across locales. */
  cuisineTypes: Filter[];
}

/** The id every filter list uses for its "no filter applied" option. */
export const ALL_FILTER_ID = "all";
