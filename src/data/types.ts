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

export type CategoryId = "history" | "writers" | "works" | "cuisine" | "places";

export const CATEGORY_IDS: CategoryId[] = ["history", "writers", "works", "cuisine", "places"];

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

/**
 * One contextual in-prose link.
 *
 * Prose stays plain typed strings — there is no markup language in the content
 * model and this does not introduce one. Instead a section declares, out of
 * band, that one phrase appearing in its own paragraphs should link to one
 * article. The renderer links the **first** occurrence of `phrase` in the
 * section and nothing else.
 *
 * The alternative shapes were both worse. Markup inside the strings would mean
 * every translator hand-edits HTML, and a site-wide keyword map would silently
 * link the same word on every page it ever appears — including pages where the
 * link is wrong, and including words inside quotations.
 *
 * `validate:content` enforces the invariants that make this safe: the phrase
 * must actually occur in this section, the slug must resolve to an article that
 * exists **in this same edition**, and the counts are capped. A link to an
 * article that has not been written yet therefore fails the build rather than
 * shipping as a 404.
 */
export interface SectionLink {
  /**
   * Exact substring of one of this section's paragraphs. Must be long enough to
   * be unambiguous — a two-letter phrase would match inside other words, which
   * no validator can detect for us.
   */
  phrase: string;
  /** Target article slug, in this same locale. Never the article's own slug. */
  slug: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Contextual links into this section's own prose. See `SectionLink`. */
  links?: SectionLink[];
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
  /**
   * The era this article belongs to, and the filter id it matches in
   * `historyPeriods` (history) or `literaryPeriods` (works).
   *
   * **Chronology only.** Until August 2026 this one field carried two different
   * taxonomies at once: four eras (`ancient`, `kingdoms`, `medieval`, `modern`)
   * alongside two content types (`people`, `battles`). Because an article holds
   * exactly one value, filing the Battle of Avarayr under `battles` removed a
   * fifth-century event from every chronological filter, and `people` matched no
   * history article at all — a pill that always returned an empty listing. The
   * content-type axis now lives in `topicTypeId`, and the two are independent.
   */
  period?: string;
  periodId?: string;
  /**
   * History listing only: what *kind* of subject the article has — a state, a
   * person, an event, a battle — as a filter id in `historyTopicTypes`.
   *
   * Only the id is authored; the label lives once in the locale's filter list
   * and is rendered from there. That is deliberately unlike `period`/`periodId`
   * and `dishType`/`dishTypeId`, which each keep a second copy of the label on
   * every article and therefore each need a validator rule to catch the drift.
   *
   * Orthogonal to `periodId` on purpose: Tigran the Great is *ancient* **and** a
   * *person*, and a reader browsing either axis should find him.
   */
  topicTypeId?: string;
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
  /**
   * Places listing only: what kind of site this is, as a filter id in
   * `placeTypes`.
   *
   * Id-only, following `topicTypeId` above rather than the `period`/`periodId`
   * and `dishType`/`dishTypeId` pairs beside it. Those each keep a second copy
   * of the translated label on every article, and each therefore needs its own
   * validator rule to catch the two copies drifting apart. The label for a place
   * type lives once, in the locale's `placeTypes` list, and is rendered from
   * there — so there is nothing to drift and no rule to write.
   *
   * Never author a `placeType` label field to sit beside this one.
   */
  placeTypeId?: string;
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
  /**
   * `<title>` for this page, when the visible headline is not the best one.
   *
   * `title` is the H1 and stays exactly what a reader sees at the top of the
   * article. A `<title>` has a different job and a different audience: it is
   * read in a results list with no page around it, so «Քրիստոնեության
   * ընդունումը» — unambiguous under its own H1 — needs to say *in Armenia* and
   * *301* to mean anything on its own. Absent on articles whose headline already
   * works standalone; `articleMetadata` then falls back to `title`.
   *
   * Not used for `og:title` or the JSON-LD `headline`. Those are share and
   * knowledge-graph surfaces where the clean human headline is the honest value,
   * and structured data in this project restates what the reader can see.
   */
  seoTitle?: string;
  /**
   * `<meta name="description">`, when the card excerpt is the wrong length or
   * the wrong emphasis for a results page.
   *
   * `excerpt` is authored for the listing card, where it sits under a title with
   * an image beside it and can run long. Several run past 170 characters, which
   * a results page truncates mid-clause. Absent by default; `articleMetadata`
   * then falls back to `excerpt`.
   */
  metaDescription?: string;
  /**
   * A short standalone answer to the article's own question, rendered above the
   * body as a visible block.
   *
   * This is not a second `intro`. The intro sets a scene in prose; the summary
   * states the outcome — who, when, what changed — in the handful of sentences a
   * reader who needs only that can stop after. It exists because the commonest
   * way this archive's subjects are searched for is a request for exactly this
   * («համառոտ»), and the archive answered it only by making the reader read a
   * whole article.
   */
  summary?: string;
  /**
   * Position in this category's real chronology, `1` = earliest.
   *
   * Separate from the array order, which drives the listing and the featured
   * fallback and is not chronological. Previous/next used the array position
   * until August 2026, so «Տիգրան Մեծ» (first century BC) offered «Ուրարտուի
   * թագավորությունը» (ninth century BC) as its *next* article. Sorting the
   * listing by this instead would be the other bug: it would reorder a page
   * nobody asked to have reordered.
   */
  chronoOrder?: number;
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
  /**
   * The Visit journey page.
   *
   * It sits beside `about`/`contact`/`privacy` rather than in `UiDictionary`
   * because it is page copy, not interface chrome — the same reason those three
   * live here — and because `pageLd` reads `{ title, metaDescription }` off this
   * shape directly.
   *
   * Every field is a heading, a lead or a call to action. There is deliberately
   * no `places`, `dishes` or `articles` array: the page curates by slug in
   * `visit/page.tsx` and resolves every title, excerpt and image from the
   * article registry, so nothing here can drift from the articles it points at.
   */
  visit: {
    title: string;
    metaDescription: string;
    heading: string;
    lead: string;
    placesEyebrow: string;
    placesTitle: string;
    placesDescription: string;
    placesCta: string;
    typesEyebrow: string;
    typesTitle: string;
    typesDescription: string;
    foodEyebrow: string;
    foodTitle: string;
    foodDescription: string;
    foodCta: string;
    learnEyebrow: string;
    learnTitle: string;
    learnDescription: string;
    learnCta: string;
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
  /** Chronological era filters for the history listing. Ids shared across locales. */
  historyPeriods: Filter[];
  /**
   * Content-type filters for the history listing — the second, independent axis
   * beside `historyPeriods`. Ids shared across locales.
   */
  historyTopicTypes: Filter[];
  literaryPeriods: Filter[];
  /** Genre filters for the literary works listing. */
  workGenres: Filter[];
  /** Dish-type filters for the cuisine listing. Ids are shared across locales. */
  cuisineTypes: Filter[];
  /**
   * Site-type filters for the places listing. Ids are shared across locales.
   *
   * Deliberately short: a filter that matches no article is a pill that always
   * returns an empty listing, which `validateFilterCoverage` fails the build
   * over. A type id is added in the same change as the first article that uses
   * it, never ahead of one.
   */
  placeTypes: Filter[];
}

/** The id every filter list uses for its "no filter applied" option. */
export const ALL_FILTER_ID = "all";
