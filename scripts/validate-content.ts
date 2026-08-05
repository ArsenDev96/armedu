/**
 * Content validation for the local TypeScript content bundles.
 *
 * All educational content lives in `src/data/locales/<locale>` as plain typed
 * objects. TypeScript guarantees the *shape* of that data; this script checks
 * what a type cannot: that slugs are unique, cross-references resolve, filter
 * ids match a filter that exists, translations are declared rather than
 * silently missing, and no English has leaked into an Armenian dictionary.
 *
 * It never edits content. It prints what is wrong and exits 1.
 *
 *   npm run validate:content
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { getLocaleBundle } from "../src/data";
import { getSourceRegistry } from "../src/data/sources";
import {
  ALL_FILTER_ID,
  CATEGORY_IDS,
  DEFAULT_LOCALE,
  LOCALE_META,
  SUPPORTED_LOCALES,
  type Article,
  type ArticleSection,
  type CategoryId,
  type Filter,
  type LiteraryWork,
  type Locale,
  type LocaleContent,
  type Writer,
} from "../src/data/types";
import type { UiDictionary } from "../src/data/ui";
import { getImageRegistry, PENDING_ARTWORK } from "../src/lib/media";
import { estimateReadingTime } from "../src/lib/reading-time";

/** The editions expected by the product spec. Russian must not come back. */
const EXPECTED_LOCALES: Locale[] = ["hy", "hyw", "en"];
const FORBIDDEN_LOCALES = ["ru", "fr", "de"];

/** Editions that must carry a translation of every canonical article. */
const COMPLETE_LOCALES: Locale[] = ["hy", "en"];

/**
 * Western Armenian is an explicitly partial MVP. Anything listed here is a
 * *declared* gap: the site renders a localized "not translated" page for it.
 * Anything missing from a locale and NOT declared here is a validation error,
 * which is what stops a translation quietly disappearing.
 */
/**
 * Articles whose `hy` edition has been revised and whose `hyw` and `en` editions
 * are waiting for the adaptation pass.
 *
 * `validateCrossLocaleNumbers` compares the three editions against each other,
 * which is exactly right when they are meant to agree and exactly wrong while one
 * is deliberately ahead. Revising `hy` first is the intended order — the Armenian
 * edition is the reference text and the other two are adapted from it, not
 * mechanically translated — so the alternative to declaring the gap is either
 * three simultaneous rewrites or a switched-off check.
 *
 * This list is a debt, not a setting. Every entry is printed at the end of a run,
 * and an entry that outlives its adaptation pass is a divergence nobody is
 * checking any more.
 *
 * August 2026: emptied. `adoption-of-christianity` and `kingdom-of-urartu` were
 * declared here during the first SEO batch and adapted into `hyw` and `en` in the
 * pass that follows it, so the cross-edition check applies to all 23 articles
 * again. It is left in place, like `DECLARED_UNAVAILABLE`, because it is the right
 * mechanism for the next batch rather than a one-off.
 */
const AWAITING_TRANSLATION: string[] = [];

const DECLARED_UNAVAILABLE: Partial<Record<Locale, Record<CategoryId, string[]>>> = {
  hyw: {
    history: [],
    writers: [],
    works: [],
    cuisine: [],
    places: [],
  },
};

interface Problem {
  locale: Locale | "global";
  kind: string;
  id: string;
  field?: string;
  message: string;
}

class Report {
  readonly problems: Problem[] = [];

  add(locale: Locale | "global", kind: string, id: string, message: string, field?: string): void {
    this.problems.push({ locale, kind, id, field, message });
  }

  check(
    condition: boolean,
    locale: Locale | "global",
    kind: string,
    id: string,
    message: string,
    field?: string,
  ): void {
    if (!condition) this.add(locale, kind, id, message, field);
  }

  print(): void {
    if (this.problems.length === 0) return;

    const byLocale = new Map<string, Problem[]>();
    for (const problem of this.problems) {
      const list = byLocale.get(problem.locale) ?? [];
      list.push(problem);
      byLocale.set(problem.locale, list);
    }

    for (const [locale, problems] of byLocale) {
      console.error(`\n  [${locale}] — ${problems.length} problem(s):\n`);
      for (const problem of problems) {
        const where = problem.id ? `${problem.kind} "${problem.id}"` : problem.kind;
        const field = problem.field ? ` → ${problem.field}` : "";
        console.error(`   ✖ ${where}${field}\n     ${problem.message}`);
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                              */
/* -------------------------------------------------------------------------- */

function filled(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function isValidHref(href: string): boolean {
  return /^https?:\/\//.test(href) || href.startsWith("/");
}

function filterIds(filters: Filter[]): Set<string> {
  return new Set(filters.map((filter) => filter.id));
}

/** id → label, for checking that a card's eyebrow says what its filter chip says. */
function filterLabels(filters: Filter[]): Map<string, string> {
  return new Map(filters.map((filter) => [filter.id, filter.label]));
}

/** Every leaf path in the UI dictionary, e.g. `nav.home`. */
function flattenKeys(value: unknown, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof child === "string") out.set(path, child);
      else for (const [k, v] of flattenKeys(child, path)) out.set(k, v);
    }
  }
  return out;
}

/** `{token}` placeholders inside a dictionary string. */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

/** Armenian editions must be in Armenian script. */
const ARMENIAN_RANGE = /[԰-֏ﬓ-ﬗ]/;
const LATIN_WORD = /[A-Za-z]{2,}/;

/**
 * Detects reformed (Eastern) Armenian spelling inside a Western Armenian
 * string, which is the signature of a translation done by find-and-replace
 * rather than actually written in Western Armenian.
 *
 * Only two markers are used, both unambiguous:
 *  - `և`, the Eastern ligature; Western Armenian always spells it `եւ`.
 *  - `ություն`, the Eastern abstract-noun suffix (Western: `ութիւն`).
 *
 * The Eastern passive participle `-ված` is deliberately NOT checked. It cannot
 * be told apart by spelling alone from correct Western forms whose stem ends in
 * `վ` (`սորվիլ` → `սորված`) or from words like `ժողովածու`. A heuristic that
 * flags correct Western Armenian is worse than a narrower one, because it
 * trains an editor to ignore the validator.
 *
 * Returns the offending fragment, or `null` when the string is clean.
 */
function easternOrthographyMarker(value: string): string | null {
  const patterns: RegExp[] = [/և/, /ություն/];
  for (const pattern of patterns) {
    const match = pattern.exec(value);
    if (match) return match[0];
  }
  return null;
}

/** Every translatable string in an article, for orthography scanning. */
function articleStrings(article: Article): string[] {
  return [
    article.title,
    article.excerpt,
    article.intro,
    article.categoryLabel,
    article.period ?? "",
    article.dishType ?? "",
    ...(article.cuisine
      ? [
          ...article.cuisine.ingredients,
          article.cuisine.preparation,
          ...article.cuisine.occasions,
          ...article.cuisine.regions,
          article.cuisine.serving,
        ]
      : []),
    ...article.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
    ...article.keyFacts.flatMap((fact) => [fact.label, fact.value]),
    ...article.importantDates.map((entry) => entry.event),
    article.significance.heading,
    ...article.significance.paragraphs,
    ...article.interestingFacts,
    ...article.relatedFigures.map((figure) => figure.description),
  ];
}

/**
 * Strings that legitimately stay Latin in an Armenian dictionary: proper names,
 * technical identifiers, and sample values a reader is meant to copy.
 */
const LATIN_ALLOWED_KEYS = new Set([
  "site.name",
  "site.homeLinkLabel",
  "newsletter.placeholder",
  "newsletter.unconfigured",
  "newsletter.devNote",
  "contactForm.emailPlaceholder",
  "article.copyFailed",
  "footer.copyright",
]);

/* -------------------------------------------------------------------------- */
/*  UI dictionary                                                              */
/* -------------------------------------------------------------------------- */

function validateDictionaries(report: Report): void {
  const reference = flattenKeys(getLocaleBundle("en").ui as unknown as UiDictionary);

  for (const locale of SUPPORTED_LOCALES) {
    const keys = flattenKeys(getLocaleBundle(locale).ui as unknown as UiDictionary);

    // Key parity in both directions.
    for (const key of reference.keys()) {
      report.check(keys.has(key), locale, "ui", key, "translation key is missing.", key);
    }
    for (const key of keys.keys()) {
      report.check(
        reference.has(key),
        locale,
        "ui",
        key,
        "translation key does not exist in the reference (en) dictionary.",
        key,
      );
    }

    for (const [key, value] of keys) {
      report.check(filled(value), locale, "ui", key, "translation is empty.", key);

      // Placeholders must survive translation or interpolation silently breaks.
      const expected = reference.get(key);
      if (expected !== undefined) {
        const a = placeholders(expected).join(",");
        const b = placeholders(value).join(",");
        report.check(
          a === b,
          locale,
          "ui",
          key,
          `placeholder mismatch — reference has [${a || "none"}], this locale has [${b || "none"}].`,
          key,
        );
      }

      // Untranslated English left inside an Armenian dictionary.
      if (locale !== "en" && !LATIN_ALLOWED_KEYS.has(key)) {
        const looksEnglish = LATIN_WORD.test(value) && !ARMENIAN_RANGE.test(value);
        report.check(
          !looksEnglish,
          locale,
          "ui",
          key,
          `appears to be untranslated English: "${value.slice(0, 60)}".`,
          key,
        );
      }
    }

    // Orthography: the two Armenian editions must not be confused for each other.
    if (locale === "hyw") {
      for (const [key, value] of keys) {
        const marker = easternOrthographyMarker(value);
        report.check(
          marker === null,
          locale,
          "ui",
          key,
          `uses reformed (Eastern) orthography ("${marker}") — Western Armenian requires -ութիւն, -ուած and a spelled-out եւ.`,
          key,
        );
      }
    }

    // `flattenKeys` walks objects and strings only, so the keyword arrays are
    // invisible to every check above — including key parity. Without this they
    // could silently go missing from an edition and nothing would complain.
    validateKeywordList(locale, "site.keywords", getLocaleBundle(locale).ui.site.keywords, report);
    for (const category of CATEGORY_IDS) {
      validateKeywordList(
        locale,
        `listing.${category}.keywords`,
        getLocaleBundle(locale).ui.listing[category].keywords,
        report,
      );
    }
  }
}

/** Shared shape rules for every authored keyword array, UI-level or article-level. */
function validateKeywordList(
  locale: Locale,
  key: string,
  words: string[] | undefined,
  report: Report,
): void {
  report.check(Array.isArray(words), locale, "ui", key, "keyword list is missing.", key);
  if (!Array.isArray(words)) return;

  report.check(words.length > 0, locale, "ui", key, "keyword list is empty.", key);
  report.check(
    words.every((word) => filled(word)),
    locale,
    "ui",
    key,
    "keyword list contains a blank entry.",
    key,
  );

  const seen = new Set(words.map((word) => word.trim().toLowerCase()));
  report.check(
    seen.size === words.length,
    locale,
    "ui",
    key,
    "keyword list contains duplicate entries (compared case-insensitively).",
    key,
  );
}

/* -------------------------------------------------------------------------- */
/*  Articles and collections                                                   */
/* -------------------------------------------------------------------------- */

function validateArticle(
  locale: Locale,
  article: Article,
  report: Report,
  context: {
    slugs: Set<string>;
    historyPeriods: Set<string>;
    historyTopicTypes: Set<string>;
    literaryPeriods: Set<string>;
    cuisineTypes: Set<string>;
    historyPeriodLabels: Map<string, string>;
    cuisineTypeLabels: Map<string, string>;
  },
): void {
  const id = article.slug || "(no slug)";
  const check = (ok: boolean, message: string, field?: string) =>
    report.check(ok, locale, "article", id, message, field);

  check(filled(article.slug), "slug is missing or empty.", "slug");
  check(filled(article.title), "title is missing or empty.", "title");
  check(filled(article.excerpt), "excerpt (summary) is missing or empty.", "excerpt");
  check(filled(article.intro), "intro is missing or empty.", "intro");
  check(filled(article.author), "author is missing or empty.", "author");
  check(filled(article.categoryLabel), "categoryLabel is missing or empty.", "categoryLabel");

  check(
    CATEGORY_IDS.includes(article.category),
    `category "${article.category}" is not one of ${CATEGORY_IDS.join(", ")}.`,
    "category",
  );

  // Hrefs are stored locale-free; a locale prefix here would be double-applied.
  check(
    article.href === `/${article.category}/${article.slug}`,
    `href "${article.href}" must be the locale-free path "/${article.category}/${article.slug}" — the locale prefix is added at render time.`,
    "href",
  );
  check(
    !SUPPORTED_LOCALES.some((code) => article.href.startsWith(`/${code}/`)),
    `href "${article.href}" is locale-prefixed; content must store locale-free paths.`,
    "href",
  );

  // `readingTime` is derived from the prose, not authored, so there is nothing
  // to validate here — only that the prose is long enough to produce a number.
  check(
    estimateReadingTime(article) > 0,
    "has too little prose to produce a reading time.",
    "sections",
  );
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(article.updated),
    `updated "${article.updated}" is not an ISO date (YYYY-MM-DD).`,
    "updated",
  );

  // `keywords` is optional, but an author who supplies it must supply something
  // usable. These entries reach a meta tag, the schema.org `keywords` property
  // and the search haystack, so a blank or repeated string is not a harmless
  // typo — it is a claim published three times.
  //
  // Note what is deliberately *not* checked: Latin script. Armenian editions
  // carry romanised forms on purpose, because "sasna tsrer" is exactly the
  // query this field exists to answer. The general "untranslated English"
  // rule must not be extended here.
  if (article.keywords) {
    check(article.keywords.length > 0, "keywords is present but empty; omit it instead.", "keywords");
    check(
      article.keywords.every((word) => filled(word)),
      "keywords contains a blank entry.",
      "keywords",
    );

    const seen = new Set(article.keywords.map((word) => word.trim().toLowerCase()));
    check(
      seen.size === article.keywords.length,
      "keywords contains duplicate entries (compared case-insensitively).",
      "keywords",
    );
  }

  if (article.periodId) {
    const allowed =
      article.category === "history" ? context.historyPeriods : context.literaryPeriods;
    check(
      allowed.has(article.periodId),
      `periodId "${article.periodId}" does not match any filter for the ${article.category} listing.`,
      "periodId",
    );
    check(filled(article.period), "periodId is set but the period label is empty.", "period");

    // The history listing filters on these ids and shows `period` on the card, so
    // the two must read the same: a reader who clicks «Նոր ժամանակների Հայաստան»
    // and lands on a card labelled «Ժամանակակից Հայաստան» has no way to tell they
    // are the same era. That drift is exactly what happened in `hy`.
    //
    // Only history is checked. Works articles also carry a periodId, but the works
    // listing filters on genre, so their `period` is free prose ("1890-ական
    // թվականներ") that deliberately says more than a filter chip can.
    if (article.category === "history") {
      const label = context.historyPeriodLabels.get(article.periodId);
      check(
        label === undefined || article.period === label,
        `period "${article.period}" does not match the "${article.periodId}" filter label "${label}"; the listing chip and the card would disagree.`,
        "period",
      );
    }
  }

  // The second, independent history axis. Unlike `periodId` it carries no label
  // on the article — the label lives once in `historyTopicTypes` — so there is no
  // chip-versus-card drift to check here, only that the id is real.
  if (article.category === "history") {
    check(
      filled(article.topicTypeId),
      "is a history article but declares no topicTypeId, so it cannot be found on the type axis.",
      "topicTypeId",
    );
    if (article.topicTypeId) {
      check(
        context.historyTopicTypes.has(article.topicTypeId),
        `topicTypeId "${article.topicTypeId}" does not match any filter in historyTopicTypes.`,
        "topicTypeId",
      );
      check(
        article.topicTypeId !== ALL_FILTER_ID,
        `topicTypeId is "${ALL_FILTER_ID}", which is the "no filter applied" option and not a real type.`,
        "topicTypeId",
      );
    }
    check(
      article.periodId !== ALL_FILTER_ID,
      `periodId is "${ALL_FILTER_ID}", which is the "no filter applied" option and not a real era.`,
      "periodId",
    );
  } else {
    check(
      !article.topicTypeId,
      `is a ${article.category} article but declares a topicTypeId, which only the history listing filters on.`,
      "topicTypeId",
    );
  }

  if (article.chronoOrder !== undefined) {
    check(
      Number.isInteger(article.chronoOrder) && article.chronoOrder > 0,
      `chronoOrder "${article.chronoOrder}" is not a positive integer.`,
      "chronoOrder",
    );
  }

  // Optional SEO overrides. Each exists to be *different* from the field it
  // overrides — one that merely restates it is a second copy to keep in sync for
  // no gain, so an exact duplicate is an error rather than a harmless no-op.
  if (article.seoTitle !== undefined) {
    check(filled(article.seoTitle), "seoTitle is present but empty.", "seoTitle");
    check(
      article.seoTitle !== article.title,
      "seoTitle repeats the title exactly; omit it and the title is used.",
      "seoTitle",
    );
    // 60 characters is the conventional budget for the whole `<title>`, and the
    // layout appends " | Armat" (8) to whatever this field holds.
    check(
      article.seoTitle.length <= 60 - " | Armat".length,
      `seoTitle is ${article.seoTitle.length} characters; with " | Armat" appended that exceeds the 60-character budget.`,
      "seoTitle",
    );
  }

  if (article.metaDescription !== undefined) {
    check(filled(article.metaDescription), "metaDescription is present but empty.", "metaDescription");
    check(
      article.metaDescription !== article.excerpt,
      "metaDescription repeats the excerpt exactly; omit it and the excerpt is used.",
      "metaDescription",
    );
    check(
      article.metaDescription.length >= 70 && article.metaDescription.length <= 165,
      `metaDescription is ${article.metaDescription.length} characters; aim for 70–165 so a results page shows it whole.`,
      "metaDescription",
    );
  }

  if (article.summary !== undefined) {
    check(filled(article.summary), "summary is present but empty.", "summary");
    check(
      article.summary !== article.intro && article.summary !== article.excerpt,
      "summary repeats the intro or the excerpt; it exists to state the outcome those two do not.",
      "summary",
    );
    // Long enough to answer the question, short enough that a reader who wanted
    // only the answer has not been handed a second article.
    const words = article.summary.trim().split(/\s+/).length;
    check(
      words >= 40 && words <= 140,
      `summary is ${words} words; aim for 40–140.`,
      "summary",
    );
  }

  // `period`/`periodId` names an era and `dishType`/`dishTypeId` a kind of dish.
  // They are alternatives, not companions: an article carrying both would appear
  // under two different filter vocabularies and render two eyebrows.
  if (article.dishTypeId) {
    check(
      context.cuisineTypes.has(article.dishTypeId),
      `dishTypeId "${article.dishTypeId}" does not match any filter in cuisineTypes.`,
      "dishTypeId",
    );
    check(filled(article.dishType), "dishTypeId is set but the dishType label is empty.", "dishType");
    check(
      !article.periodId,
      "declares both a periodId and a dishTypeId; an article belongs to one filter vocabulary.",
      "dishTypeId",
    );
    // Same rule as `period` above: the cuisine listing filters on these ids and
    // prints `dishType` on the card.
    const label = context.cuisineTypeLabels.get(article.dishTypeId);
    check(
      label === undefined || article.dishType === label,
      `dishType "${article.dishType}" does not match the "${article.dishTypeId}" filter label "${label}"; the listing chip and the card would disagree.`,
      "dishType",
    );
  }

  if (article.category === "cuisine") {
    check(
      Boolean(article.dishTypeId),
      "is a cuisine article but declares no dishTypeId, so it can never be filtered.",
      "dishTypeId",
    );
    validateCuisineDetails(locale, article, report);
  } else {
    check(
      article.cuisine === undefined,
      `is a ${article.category} article but carries a cuisine detail block.`,
      "cuisine",
    );
    check(
      !article.dishTypeId,
      `is a ${article.category} article but declares a dishTypeId, which only the cuisine listing filters on.`,
      "dishTypeId",
    );
  }

  check(article.sections.length > 0, "has no sections.", "sections");
  for (const section of article.sections) {
    const label = section.id || "(no id)";
    check(filled(section.id), `a section has no id (heading: "${section.heading}").`, "sections");
    check(filled(section.heading), `section "${label}" has no heading.`, `sections.${label}`);
    check(
      section.paragraphs.length > 0 && section.paragraphs.every(filled),
      `section "${label}" has no paragraphs, or contains an empty paragraph.`,
      `sections.${label}.paragraphs`,
    );
    if (section.bullets) {
      check(
        section.bullets.length > 0 && section.bullets.every(filled),
        `section "${label}" declares bullets but one is empty.`,
        `sections.${label}.bullets`,
      );
    }
    validateSectionLinks(locale, article, section, report, context.slugs);
  }
  // A whole article's worth of links, capped together. A page whose prose is a
  // field of underlines is harder to read than one with none, and the point of
  // these links is to be followed rather than to be counted.
  const linkCount = article.sections.reduce((n, s) => n + (s.links?.length ?? 0), 0);
  check(
    linkCount <= MAX_LINKS_PER_ARTICLE,
    `declares ${linkCount} contextual prose links; at most ${MAX_LINKS_PER_ARTICLE} per article.`,
    "sections.links",
  );
  for (const duplicate of findDuplicates(
    article.sections.flatMap((s) => (s.links ?? []).map((link) => link.slug)),
  )) {
    report.add(
      locale,
      "article",
      id,
      `links to "${duplicate}" from more than one section; one contextual link per target is enough.`,
      "sections.links",
    );
  }
  for (const duplicate of findDuplicates(article.sections.map((s) => s.id))) {
    report.add(
      locale,
      "article",
      id,
      `duplicate section id "${duplicate}" — anchors and the table of contents would collide.`,
      "sections",
    );
  }

  check(
    filled(article.significance.heading) && article.significance.paragraphs.length > 0,
    "significance section is missing a heading or has no paragraphs.",
    "significance",
  );

  check(article.keyFacts.length > 0, "has no key facts.", "keyFacts");
  for (const fact of article.keyFacts) {
    check(
      filled(fact.label) && filled(fact.value),
      `key fact { label: "${fact.label}" } has an empty label or value.`,
      "keyFacts",
    );
  }

  check(article.importantDates.length > 0, "has no important dates.", "importantDates");
  for (const entry of article.importantDates) {
    check(
      filled(entry.year) && filled(entry.event),
      `important date { year: "${entry.year}" } has an empty year or event.`,
      "importantDates",
    );
  }

  check(
    article.interestingFacts.length > 0 && article.interestingFacts.every(filled),
    "has no interesting facts, or one of them is empty.",
    "interestingFacts",
  );

  for (const figure of article.relatedFigures) {
    check(
      filled(figure.name) && filled(figure.lifespan) && filled(figure.description),
      `related figure "${figure.name}" is missing a name, lifespan or description.`,
      "relatedFigures",
    );
  }

  // Related content must resolve *within this locale* — the site never links a
  // reader to a page in another language.
  check(article.relatedSlugs.length > 0, "has no relatedSlugs.", "relatedSlugs");
  for (const slug of article.relatedSlugs) {
    check(
      context.slugs.has(slug),
      `relatedSlugs points at "${slug}", which is not published in this locale.`,
      "relatedSlugs",
    );
    check(slug !== article.slug, "relatedSlugs includes the article itself.", "relatedSlugs");
  }

  // Western Armenian prose must actually be Western Armenian. Catching this in
  // validation is the difference between a partial edition and a wrong one.
  if (locale === "hyw") {
    for (const text of articleStrings(article)) {
      const marker = easternOrthographyMarker(text);
      if (marker) {
        check(
          false,
          `contains reformed (Eastern) orthography "${marker}" in: "${text.slice(0, 70)}…". Western Armenian requires -ութիւն, -ուած and a spelled-out եւ.`,
          "orthography",
        );
        break; // One report per article is enough to send an editor to the file.
      }
    }
  }

  check(filled(article.imageSeed), "imageSeed is missing or empty.", "imageSeed");
  if (article.image) {
    check(filled(article.image.src), "declares an image object with no src.", "image.src");
    check(filled(article.image.alt), "declares an image object with empty alt text.", "image.alt");
    if (article.image.credit !== undefined) {
      check(
        filled(article.image.credit),
        "declares an image credit that is empty — omit the field instead.",
        "image.credit",
      );
    }
  }
}

/**
 * The cuisine at-a-glance panel.
 *
 * Every field is rendered as a labelled row, so a blank one prints a heading
 * over nothing. The lists are required rather than optional because the panel is
 * the article's answer to "what is in it, when is it made, where" — a cuisine
 * article that cannot answer those is not finished.
 */
/** Caps on contextual prose links. See `SectionLink` for why they exist at all. */
const MAX_LINKS_PER_SECTION = 3;
const MAX_LINKS_PER_ARTICLE = 6;
/**
 * Shortest phrase an editor may declare.
 *
 * The renderer matches a plain substring, and nothing in it can tell an Armenian
 * word from a word fragment. A three-letter phrase would sooner or later light up
 * inside an unrelated word, so the safeguard has to be the length of what can be
 * declared in the first place.
 */
const MIN_LINK_PHRASE_LENGTH = 6;

/**
 * Contextual prose links for one section.
 *
 * The renderer is deliberately unable to fail loudly — a phrase it cannot find is
 * simply left as text, and a slug missing from this edition is skipped so the
 * other editions still read correctly. That makes this function the only place a
 * mistake surfaces, so it checks every precondition the renderer relies on.
 */
function validateSectionLinks(
  locale: Locale,
  article: Article,
  section: ArticleSection,
  report: Report,
  slugs: Set<string>,
): void {
  if (!section.links?.length) return;

  const id = article.slug || "(no slug)";
  const field = `sections.${section.id || "(no id)"}.links`;
  const check = (ok: boolean, message: string) =>
    report.check(ok, locale, "article", id, message, field);

  check(
    section.links.length <= MAX_LINKS_PER_SECTION,
    `section "${section.id}" declares ${section.links.length} contextual links; at most ${MAX_LINKS_PER_SECTION} per section.`,
  );

  const prose = section.paragraphs.join("\n");

  for (const link of section.links) {
    check(filled(link.phrase), `section "${section.id}" has a link with an empty phrase.`);
    check(filled(link.slug), `section "${section.id}" has a link with an empty slug.`);
    if (!filled(link.phrase) || !filled(link.slug)) continue;

    check(
      link.phrase.length >= MIN_LINK_PHRASE_LENGTH,
      `link phrase "${link.phrase}" is shorter than ${MIN_LINK_PHRASE_LENGTH} characters; a short phrase matches inside other words and the renderer cannot tell.`,
    );
    // The phrase must be in *this* section's prose. A link declared against a
    // paragraph that was later reworded renders as nothing at all, which is the
    // silent failure this rule exists to prevent.
    check(
      prose.includes(link.phrase),
      `link phrase "${link.phrase}" does not appear in section "${section.id}", so nothing would be linked.`,
    );
    // Never to a page that does not exist. `slugs` is this edition's own set, so
    // a link to an article that has not been written yet fails here rather than
    // shipping as a 404 — and one that exists only in `hy` fails in `hyw` and
    // `en`, where the renderer would have silently dropped it.
    check(
      slugs.has(link.slug),
      `link target "${link.slug}" is not an article in the "${locale}" edition.`,
    );
    check(
      link.slug !== article.slug,
      `link target "${link.slug}" is the article's own slug.`,
    );
  }

  for (const duplicate of findDuplicates(section.links.map((link) => link.phrase))) {
    report.add(
      locale,
      "article",
      id,
      `section "${section.id}" declares the phrase "${duplicate}" twice; only the first occurrence is ever linked.`,
      field,
    );
  }
}

function validateCuisineDetails(locale: Locale, article: Article, report: Report): void {
  const id = article.slug || "(no slug)";
  const check = (ok: boolean, message: string, field?: string) =>
    report.check(ok, locale, "article", id, message, field);

  const details = article.cuisine;
  if (!details) {
    check(false, "is a cuisine article but has no cuisine detail block.", "cuisine");
    return;
  }

  const lists: [keyof typeof details, string[]][] = [
    ["ingredients", details.ingredients],
    ["occasions", details.occasions],
    ["regions", details.regions],
  ];
  for (const [field, values] of lists) {
    check(
      Array.isArray(values) && values.length > 0 && values.every(filled),
      `cuisine.${field} is empty or contains a blank entry.`,
      `cuisine.${field}`,
    );
  }

  check(filled(details.preparation), "cuisine.preparation is empty.", "cuisine.preparation");
  check(filled(details.serving), "cuisine.serving is empty.", "cuisine.serving");
}

function validateWriter(
  locale: Locale,
  writer: Writer,
  report: Report,
  periods: Set<string>,
  periodLabels: Map<string, string>,
  articleSlugs: Set<string>,
): void {
  const id = writer.slug || "(no slug)";
  const check = (ok: boolean, message: string, field?: string) =>
    report.check(ok, locale, "writer", id, message, field);

  check(filled(writer.slug), "slug is missing or empty.", "slug");
  check(filled(writer.name), "name is missing or empty.", "name");
  check(filled(writer.description), "description is missing or empty.", "description");
  check(filled(writer.lifespan), "lifespan is missing or empty.", "lifespan");
  check(filled(writer.role), "role is missing or empty.", "role");
  check(filled(writer.imageSeed), "imageSeed is missing or empty.", "imageSeed");
  check(
    writer.notableWorks.length > 0 && writer.notableWorks.every(filled),
    "has no notable works, or one of them is empty.",
    "notableWorks",
  );
  // The writers listing filters on these ids and prints `period` on the card, so
  // the chip and the card must read the same. See the note in `validateArticle`.
  const periodLabel = periodLabels.get(writer.periodId);
  check(
    periodLabel === undefined || writer.period === periodLabel,
    `period "${writer.period}" does not match the "${writer.periodId}" filter label "${periodLabel}"; the listing chip and the card would disagree.`,
    "period",
  );
  check(
    periods.has(writer.periodId),
    `periodId "${writer.periodId}" does not match any literary period filter.`,
    "periodId",
  );
  check(filled(writer.period), "period label is missing or empty.", "period");
  check(
    articleSlugs.has(writer.slug),
    "has no matching biography article in this locale — the card would link to a page that is not translated.",
    "slug",
  );
}

function validateWork(
  locale: Locale,
  work: LiteraryWork,
  report: Report,
  genres: Set<string>,
  articleSlugs: Set<string>,
): void {
  const id = work.slug || "(no slug)";
  const check = (ok: boolean, message: string, field?: string) =>
    report.check(ok, locale, "work", id, message, field);

  check(filled(work.slug), "slug is missing or empty.", "slug");
  check(filled(work.title), "title is missing or empty.", "title");
  check(filled(work.summary), "summary is missing or empty.", "summary");
  check(filled(work.author), "author is missing or empty.", "author");
  check(filled(work.genre), "genre label is missing or empty.", "genre");
  check(filled(work.publicationPeriod), "publicationPeriod is missing or empty.", "publicationPeriod");
  check(filled(work.imageSeed), "imageSeed is missing or empty.", "imageSeed");
  check(
    genres.has(work.genreId),
    `genreId "${work.genreId}" does not match any genre filter in workGenres.`,
    "genreId",
  );
  check(
    articleSlugs.has(work.slug),
    "has no matching article in this locale — the card would link to a page that is not translated.",
    "slug",
  );
}

function validateFilters(locale: Locale, name: string, filters: Filter[], report: Report): void {
  report.check(filters.length > 0, locale, "filters", name, "list is empty.");
  report.check(
    filters.some((filter) => filter.id === "all"),
    locale,
    "filters",
    name,
    'is missing the "all" option that clears the filter.',
  );
  for (const filter of filters) {
    report.check(
      filled(filter.id) && filled(filter.label),
      locale,
      "filters",
      name,
      `an entry has an empty id or label (id: "${filter.id}").`,
    );
  }
  for (const duplicate of findDuplicates(filters.map((filter) => filter.id))) {
    report.add(locale, "filters", name, `duplicate filter id "${duplicate}".`);
  }
}

/**
 * Every filter must actually match something.
 *
 * This is the rule that was missing. The history listing shipped a «Կարևոր
 * դեմքեր» pill for months: `historyPeriods` declared `people`, no article ever
 * carried it, and clicking it produced the empty-results page on a listing that
 * had seven articles in it. Nothing in the type system can catch that — the id
 * was a valid string in a valid list — so it has to be counted here.
 *
 * `all` is exempt: it is the "no filter applied" option and matches by clearing
 * itself rather than by matching a field.
 */
function validateFilterCoverage(
  locale: Locale,
  name: string,
  filters: Filter[],
  used: (string | undefined)[],
  report: Report,
): void {
  const present = new Set(used.filter((value): value is string => Boolean(value)));
  for (const filter of filters) {
    if (filter.id === ALL_FILTER_ID) continue;
    report.check(
      present.has(filter.id),
      locale,
      "filters",
      name,
      `filter "${filter.id}" (“${filter.label}”) matches no content, so selecting it always shows the empty state. Remove the filter or file an entry under it.`,
    );
  }
}

function validateStaticPages(locale: Locale, content: LocaleContent, report: Report): void {
  const { about, contact, privacy } = content.pages;
  const check = (ok: boolean, id: string, message: string, field?: string) =>
    report.check(ok, locale, "page", id, message, field);

  check(filled(about.title) && filled(about.metaDescription), "about", "missing title or metaDescription.");
  check(about.audiences.length > 0, "about", "has no audience entries.", "audiences");
  check(about.principles.length > 0, "about", "has no editorial principles.", "principles");
  check(
    filled(contact.title) && filled(contact.metaDescription),
    "contact",
    "missing title or metaDescription.",
  );
  check(contact.reasons.length > 0, "contact", "has no contact reasons.", "reasons");
  check(
    filled(privacy.title) && filled(privacy.metaDescription),
    "privacy",
    "missing title or metaDescription.",
  );
  check(privacy.sections.length > 0, "privacy", "has no sections.", "sections");
  for (const section of privacy.sections) {
    check(
      filled(section.heading) && filled(section.body),
      "privacy",
      `section "${section.heading}" is missing a heading or body.`,
      "sections",
    );
  }
}

function validateLocale(locale: Locale, content: LocaleContent, report: Report): void {
  const articleSlugs = new Set(content.articles.map((article) => article.slug));

  for (const duplicate of findDuplicates(content.articles.map((a) => a.slug))) {
    report.add(locale, "article", duplicate, "duplicate slug — one route would be unreachable.");
  }
  for (const duplicate of findDuplicates(content.writers.map((w) => w.slug))) {
    report.add(locale, "writer", duplicate, "duplicate slug.");
  }
  for (const duplicate of findDuplicates(content.works.map((w) => w.slug))) {
    report.add(locale, "work", duplicate, "duplicate slug.");
  }
  for (const duplicate of findDuplicates(content.categories.map((c) => c.id))) {
    report.add(locale, "category", duplicate, "duplicate id.");
  }
  for (const duplicate of findDuplicates(content.timeline.map((t) => t.id))) {
    report.add(locale, "timeline", duplicate, "duplicate id.");
  }

  validateFilters(locale, "historyPeriods", content.historyPeriods, report);
  validateFilters(locale, "historyTopicTypes", content.historyTopicTypes, report);
  validateFilters(locale, "literaryPeriods", content.literaryPeriods, report);
  validateFilters(locale, "workGenres", content.workGenres, report);
  validateFilters(locale, "cuisineTypes", content.cuisineTypes, report);

  // No filter may match nothing. Every listing's pills are checked against the
  // field they actually filter on, in this edition.
  const historyArticles = content.articles.filter((article) => article.category === "history");
  const cuisineArticles = content.articles.filter((article) => article.category === "cuisine");
  validateFilterCoverage(
    locale,
    "historyPeriods",
    content.historyPeriods,
    historyArticles.map((article) => article.periodId),
    report,
  );
  validateFilterCoverage(
    locale,
    "historyTopicTypes",
    content.historyTopicTypes,
    historyArticles.map((article) => article.topicTypeId),
    report,
  );
  validateFilterCoverage(
    locale,
    "cuisineTypes",
    content.cuisineTypes,
    cuisineArticles.map((article) => article.dishTypeId),
    report,
  );
  // `literaryPeriods` is one vocabulary serving two content types: the writers
  // listing renders it as pills, and works articles file themselves under it too
  // (the works *listing* filters on genre instead). Both count, or the check
  // would call «Միջնադար» dead when the epic is filed under it.
  validateFilterCoverage(
    locale,
    "literaryPeriods",
    content.literaryPeriods,
    [
      ...content.writers.map((writer) => writer.periodId),
      ...content.articles
        .filter((article) => article.category === "works" || article.category === "writers")
        .map((article) => article.periodId),
    ],
    report,
  );
  validateFilterCoverage(
    locale,
    "workGenres",
    content.workGenres,
    content.works.map((work) => work.genreId),
    report,
  );

  validateStaticPages(locale, content, report);

  // Previous/next sorts on `chronoOrder`, and a category opts in as a whole: a
  // partial ordering would silently fall back to the array order, which is the
  // bug the field exists to fix. So it must be either absent from every article
  // in a category or present, unique and gapless across all of them.
  for (const category of CATEGORY_IDS) {
    const inCategory = content.articles.filter((article) => article.category === category);
    if (inCategory.length === 0) continue;

    const orders = inCategory.map((article) => article.chronoOrder);
    const declared = orders.filter((order): order is number => order !== undefined);
    if (declared.length === 0) continue;

    report.check(
      declared.length === inCategory.length,
      locale,
      "articles",
      category,
      `${declared.length} of ${inCategory.length} articles declare chronoOrder; previous/next would fall back to the authored order for the whole category. Declare it on all of them or none.`,
      "chronoOrder",
    );
    const expected = Array.from({ length: inCategory.length }, (_, i) => i + 1).join(",");
    report.check(
      [...declared].sort((a, b) => a - b).join(",") === expected,
      locale,
      "articles",
      category,
      `chronoOrder values are ${[...declared].sort((a, b) => a - b).join(", ")}; expected exactly 1–${inCategory.length}, each once.`,
      "chronoOrder",
    );
  }

  const context = {
    slugs: articleSlugs,
    historyPeriods: filterIds(content.historyPeriods),
    historyTopicTypes: filterIds(content.historyTopicTypes),
    literaryPeriods: filterIds(content.literaryPeriods),
    cuisineTypes: filterIds(content.cuisineTypes),
    historyPeriodLabels: filterLabels(content.historyPeriods),
    cuisineTypeLabels: filterLabels(content.cuisineTypes),
  };

  for (const article of content.articles) validateArticle(locale, article, report, context);
  for (const writer of content.writers) {
    validateWriter(
      locale,
      writer,
      report,
      context.literaryPeriods,
      filterLabels(content.literaryPeriods),
      articleSlugs,
    );
  }
  for (const work of content.works) {
    validateWork(locale, work, report, filterIds(content.workGenres), articleSlugs);
  }

  // Categories — every edition needs all three, with localized names.
  for (const id of CATEGORY_IDS) {
    report.check(
      content.categories.some((category) => category.id === id),
      locale,
      "category",
      id,
      "is missing from this locale — the listing would have no localized name.",
    );
  }
  for (const category of content.categories) {
    const id = category.id || "(no id)";
    const check = (ok: boolean, message: string, field?: string) =>
      report.check(ok, locale, "category", id, message, field);

    check(CATEGORY_IDS.includes(category.id), `id "${category.id}" is not a known category.`, "id");
    check(filled(category.title), "title is missing or empty.", "title");
    check(filled(category.description), "description is missing or empty.", "description");
    check(filled(category.linkLabel), "linkLabel is missing or empty.", "linkLabel");
    check(
      filled(category.href) && isValidHref(category.href),
      `href "${category.href}" is not a valid path.`,
      "href",
    );
    check(
      !SUPPORTED_LOCALES.some((code) => category.href.startsWith(`/${code}/`)),
      `href "${category.href}" is locale-prefixed; categories must store locale-free paths.`,
      "href",
    );
    if (category.image !== undefined) {
      check(filled(category.image), "declares an image but its source is empty.", "image");
    }
  }

  for (const entry of content.timeline) {
    const id = entry.id || "(no id)";
    const check = (ok: boolean, message: string, field?: string) =>
      report.check(ok, locale, "timeline", id, message, field);
    check(filled(entry.id), "id is missing or empty.", "id");
    check(filled(entry.title), "title is missing or empty.", "title");
    check(filled(entry.period), "period is missing or empty.", "period");
    check(filled(entry.description), "description is missing or empty.", "description");
  }
}

/* -------------------------------------------------------------------------- */
/*  Cross-locale checks                                                        */
/* -------------------------------------------------------------------------- */

function validateLocaleModel(report: Report): void {
  const configured = [...SUPPORTED_LOCALES];

  report.check(
    DEFAULT_LOCALE === "hy",
    "global",
    "locales",
    "DEFAULT_LOCALE",
    `default locale must be "hy" (Armenian is the primary edition), found "${DEFAULT_LOCALE}".`,
  );

  for (const expected of EXPECTED_LOCALES) {
    report.check(
      configured.includes(expected),
      "global",
      "locales",
      expected,
      "expected locale is not in SUPPORTED_LOCALES.",
    );
  }
  for (const forbidden of FORBIDDEN_LOCALES) {
    report.check(
      !configured.includes(forbidden as Locale),
      "global",
      "locales",
      forbidden,
      "locale is not part of the MVP and must not be active.",
    );
  }

  for (const locale of configured) {
    const meta = LOCALE_META[locale];
    report.check(
      Boolean(meta) && filled(meta.label) && filled(meta.htmlLang) && filled(meta.ogLocale),
      "global",
      "locales",
      locale,
      "is missing metadata (label, htmlLang or ogLocale).",
    );
    // Open Graph accepts `xx_YY` only; an invented tag would be silently dropped.
    report.check(
      /^[a-z]{2}_[A-Z]{2}$/.test(meta.ogLocale),
      "global",
      "locales",
      locale,
      `ogLocale "${meta.ogLocale}" is not a valid xx_YY Open Graph locale.`,
    );
  }
}

/**
 * Translation coverage.
 *
 * The primary edition defines which articles exist. Complete editions must have
 * all of them; partial editions may omit articles only if the omission is
 * declared in `DECLARED_UNAVAILABLE`, which is what the site renders its
 * "not translated" page from.
 */
function validateCoverage(report: Report): void {
  const canonical = new Map<CategoryId, string[]>();
  for (const category of CATEGORY_IDS) {
    canonical.set(
      category,
      getLocaleBundle(DEFAULT_LOCALE)
        .articles.filter((article) => article.category === category)
        .map((article) => article.slug),
    );
  }

  for (const locale of SUPPORTED_LOCALES) {
    const bundle = getLocaleBundle(locale);
    const declared = DECLARED_UNAVAILABLE[locale];

    for (const category of CATEGORY_IDS) {
      const expected = canonical.get(category) ?? [];
      const present = new Set(
        bundle.articles.filter((a) => a.category === category).map((a) => a.slug),
      );
      const declaredMissing = new Set(declared?.[category] ?? []);

      for (const slug of expected) {
        if (present.has(slug)) {
          report.check(
            !declaredMissing.has(slug),
            locale,
            "coverage",
            slug,
            `is declared unavailable in DECLARED_UNAVAILABLE but a ${category} translation exists — remove the declaration.`,
            category,
          );
          continue;
        }

        if (COMPLETE_LOCALES.includes(locale)) {
          report.add(
            locale,
            "coverage",
            slug,
            `${category} article is missing. "${locale}" must be a complete edition.`,
            category,
          );
        } else {
          report.check(
            declaredMissing.has(slug),
            locale,
            "coverage",
            slug,
            `${category} article is missing and the gap is not declared in DECLARED_UNAVAILABLE — a translation may have been lost.`,
            category,
          );
        }
      }

      // A locale may never introduce a slug the primary edition lacks.
      for (const slug of present) {
        report.check(
          expected.includes(slug),
          locale,
          "coverage",
          slug,
          `${category} article does not exist in the primary edition ("${DEFAULT_LOCALE}"); slugs must be shared across locales.`,
          category,
        );
      }
    }
  }
}

/**
 * `hreflang` alternates must only ever point at translations that exist, or a
 * crawler is told the "not translated" page is a real translation.
 */
function validateAlternates(report: Report): void {
  for (const category of CATEGORY_IDS) {
    const slugs = new Set(
      SUPPORTED_LOCALES.flatMap((locale) =>
        getLocaleBundle(locale)
          .articles.filter((article) => article.category === category)
          .map((article) => article.slug),
      ),
    );

    for (const slug of slugs) {
      for (const locale of SUPPORTED_LOCALES) {
        const exists = getLocaleBundle(locale).articles.some(
          (article) => article.category === category && article.slug === slug,
        );
        if (exists) continue;
        // Nothing to assert beyond "we know it is missing"; the alternates map
        // is generated from this same predicate, so the check is that the
        // predicate has an answer for every (locale, slug) pair.
        report.check(
          typeof exists === "boolean",
          locale,
          "alternates",
          slug,
          "translation availability could not be determined.",
          category,
        );
      }
    }
  }
}

/**
 * Every registered image must exist on disk and belong to a real slug.
 *
 * A missing file is invisible in development — Next serves a 404 for the image
 * and the card simply renders an empty box — so it has to be caught here. Two
 * filenames intentionally differ from their slug, which is exactly the kind of
 * drift a convention-based path would hide.
 */
function validateImages(report: Report): void {
  const registry = getImageRegistry();
  const publicDir = join(process.cwd(), "public");

  const knownSlugs = new Set(
    SUPPORTED_LOCALES.flatMap((locale) =>
      getLocaleBundle(locale).articles.map((article) => article.slug),
    ),
  );

  for (const [slug, src] of Object.entries(registry)) {
    report.check(
      knownSlugs.has(slug),
      "global",
      "image",
      slug,
      "is registered in src/lib/media.ts but matches no article slug in any edition.",
    );

    report.check(
      src.startsWith("/"),
      "global",
      "image",
      slug,
      `path "${src}" must be absolute from the public directory.`,
    );

    report.check(
      existsSync(join(publicDir, src)),
      "global",
      "image",
      slug,
      `file "public${src}" does not exist.`,
    );
  }

  // `PENDING_ARTWORK` is the declared version of the note below: slugs whose
  // artwork is expected but has not arrived. It has to name real articles, and
  // it must not name one that already has a file — a stale entry would say the
  // archive is waiting for something it already has.
  for (const slug of PENDING_ARTWORK) {
    report.check(
      knownSlugs.has(slug),
      "global",
      "image",
      slug,
      "is listed in PENDING_ARTWORK but matches no article slug in any edition.",
    );
    report.check(
      registry[slug] === undefined,
      "global",
      "image",
      slug,
      "is listed in PENDING_ARTWORK but already has a registered image — remove it from the pending list.",
    );
  }

  // The reverse direction: an article with no artwork is allowed (it falls back
  // to the generated placeholder), but it is worth surfacing which ones.
  const missing = [...knownSlugs].filter((slug) => !registry[slug]).sort();
  if (missing.length > 0) {
    console.log(`  note: ${missing.length} slug(s) render generated artwork: ${missing.join(", ")}`);
  }
}

/**
 * The bibliography: one entry per article slug, every citation identifiable.
 *
 * The identifier requirement is the substantive check. An audit of the first
 * bibliography found 18 of 48 citations named works that do not exist —
 * plausible titles on real publishers, each linked to a publisher homepage that
 * always resolved. A fabricated work cannot supply an ISBN or a DOI, so this
 * check fails at the moment the citation is written rather than in front of a
 * reader who trusted it.
 */
function validateSources(report: Report): void {
  const registry = getSourceRegistry();
  const slugs = new Set(
    SUPPORTED_LOCALES.flatMap((locale) =>
      getLocaleBundle(locale).articles.map((article) => article.slug),
    ),
  );

  for (const slug of slugs) {
    const sources = registry[slug];
    report.check(
      Array.isArray(sources) && sources.length > 0,
      "global",
      "source",
      slug,
      "has no bibliography entry in src/data/sources.ts.",
    );
  }

  for (const [slug, sources] of Object.entries(registry)) {
    report.check(
      slugs.has(slug),
      "global",
      "source",
      slug,
      "is listed in the bibliography but matches no article slug in any edition.",
    );

    for (const source of sources) {
      const id = `${slug} — ${source.title}`;
      report.check(source.title.trim().length > 0, "global", "source", id, "has an empty title.");
      report.check(
        source.publisher.trim().length > 0,
        "global",
        "source",
        id,
        "has an empty publisher.",
      );

      const { kind, value } = source.identifier;
      const valid =
        kind === "isbn"
          ? /^97[89]\d{10}$|^\d{9}[\dX]$/.test(value.replace(/-/g, ""))
          : kind === "doi"
            ? /^10\.\d{4,9}\/\S+$/.test(value)
            : kind === "url"
              ? /^https:\/\/\S+$/.test(value)
              : value.trim().length > 0;

      report.check(
        valid,
        "global",
        "source",
        id,
        `has an invalid ${kind} identifier: "${value}".`,
      );
    }
  }

  // One identifier must not name two different works. Reusing a citation across
  // articles is normal and expected — the same survey supports several — but two
  // *titles* sharing an ISBN means one of them is wrong. This check exists
  // because it caught exactly that: volumes I and II of the same series were
  // entered with a single ISBN copied between them.
  const titlesByIdentifier = new Map<string, Set<string>>();
  for (const sources of Object.values(registry)) {
    for (const source of sources) {
      const key = `${source.identifier.kind}:${source.identifier.value}`;
      const titles = titlesByIdentifier.get(key) ?? new Set<string>();
      titles.add(source.title);
      titlesByIdentifier.set(key, titles);
    }
  }

  for (const [key, titles] of titlesByIdentifier) {
    report.check(
      titles.size === 1,
      "global",
      "source",
      key,
      `identifies ${titles.size} different works: ${[...titles].map((t) => `"${t}"`).join(", ")}.`,
    );
  }
}

/**
 * The three editions must state the same numbers.
 *
 * Armenian uses Arabic numerals, so a year, a troop count or a page total
 * survives translation unchanged. Comparing the multiset of numbers per field
 * therefore catches the one failure that every other check here is blind to: a
 * correction applied to one edition and forgotten in another. Twenty factual
 * errors were fixed across three editions in July 2026, and "fixed in English
 * only" is the obvious way for that work to go wrong.
 *
 * Centuries are excluded because the editions legitimately differ in style:
 * English writes "Nineteenth century", Armenian writes `XIX դար`.
 */
function validateCrossLocaleNumbers(report: Report): void {
  const numbersIn = (text: string): string[] => (text.match(/\d{2,}/g) ?? []).sort();
  const pending = new Set(AWAITING_TRANSLATION);

  const fieldsOf = (locale: Locale, slug: string): Map<string, string[]> | null => {
    const article = getLocaleBundle(locale).articles.find((a) => a.slug === slug);
    if (!article) return null;
    return new Map<string, string[]>([
      ["intro", numbersIn(article.intro)],
      // The three SEO fields are prose too, and the summary in particular is where
      // a date is most likely to be restated — it is the block written to state the
      // outcome. They are optional per edition, so an absent field compares as no
      // numbers at all rather than crashing; what this catches is an edition that
      // authors one and gets a year wrong in it.
      ["summary", numbersIn(article.summary ?? "")],
      ["seoTitle", numbersIn(article.seoTitle ?? "")],
      ["metaDescription", numbersIn(article.metaDescription ?? "")],
      ["keyFacts", article.keyFacts.flatMap((f) => numbersIn(f.value)).sort()],
      ["importantDates", article.importantDates.flatMap((d) => numbersIn(`${d.year} ${d.event}`)).sort()],
      ["sections", article.sections.flatMap((s) => s.paragraphs.flatMap(numbersIn)).sort()],
      ["interestingFacts", article.interestingFacts.flatMap(numbersIn).sort()],
      ["relatedFigures", article.relatedFigures.flatMap((f) => numbersIn(f.lifespan)).sort()],
    ]);
  };

  for (const article of getLocaleBundle(DEFAULT_LOCALE).articles) {
    // Declared as mid-revision: the `hy` edition is deliberately ahead and the
    // other two have not been adapted yet. Skipped here and reported by name at
    // the end of the run, so it is a visible debt rather than a silent one.
    if (pending.has(article.slug)) continue;

    const base = fieldsOf(DEFAULT_LOCALE, article.slug);
    if (!base) continue;

    for (const locale of SUPPORTED_LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const other = fieldsOf(locale, article.slug);
      if (!other) continue; // declared translation gap, handled elsewhere

      for (const [field, expected] of base) {
        const actual = other.get(field) ?? [];
        const missing = expected.filter((n) => !actual.includes(n));
        const added = actual.filter((n) => !expected.includes(n));
        if (missing.length === 0 && added.length === 0) continue;

        const detail = [
          missing.length ? `missing ${missing.join(", ")}` : "",
          added.length ? `unexpected ${added.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join("; ");

        report.check(
          false,
          locale,
          "numbers",
          article.slug,
          `states different numbers from the "${DEFAULT_LOCALE}" edition — ${detail}.`,
          field,
        );
      }
    }
  }
}

/**
 * The structural taxonomy is shared, not translated, so the three editions must
 * agree on it exactly.
 *
 * `periodId`, `topicTypeId` and `chronoOrder` are ids and an ordinal — the labels
 * are per-locale, these are not. A divergence would mean the same article sits in
 * a different era or a different place in the chronology depending on which
 * language a reader chose, which is a factual disagreement between editions and
 * not a translation choice.
 *
 * Deliberately not covered by `AWAITING_TRANSLATION`: prose can legitimately be
 * ahead in one edition, an id cannot.
 */
function validateCrossLocaleTaxonomy(report: Report): void {
  for (const base of getLocaleBundle(DEFAULT_LOCALE).articles) {
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;

      const other = getLocaleBundle(locale).articles.find((a) => a.slug === base.slug);
      if (!other) continue; // declared translation gap, handled by validateCoverage

      const fields: [string, unknown, unknown][] = [
        ["periodId", base.periodId, other.periodId],
        ["topicTypeId", base.topicTypeId, other.topicTypeId],
        ["chronoOrder", base.chronoOrder, other.chronoOrder],
        ["dishTypeId", base.dishTypeId, other.dishTypeId],
        ["href", base.href, other.href],
        ["category", base.category, other.category],
        // Navigation, not prose. `getRelatedArticles` already drops a target that
        // this edition has not translated, so the list itself is shared — and
        // three editions quietly recommending three different things is how the
        // First Republic ended up pointing out of its own section in all of them.
        ["relatedSlugs", base.relatedSlugs.join(","), other.relatedSlugs.join(",")],
      ];

      for (const [field, expected, actual] of fields) {
        report.check(
          expected === actual,
          locale,
          "taxonomy",
          base.slug,
          `${field} is ${JSON.stringify(actual)} but the "${DEFAULT_LOCALE}" edition has ${JSON.stringify(expected)}; this field is shared across editions, not translated.`,
          field,
        );
      }
    }
  }
}

function validateNewsletterLocales(report: Report): void {
  // The form writes the active route locale; anything outside this set would
  // land in Supabase as an unusable segment value.
  for (const locale of SUPPORTED_LOCALES) {
    report.check(
      EXPECTED_LOCALES.includes(locale),
      "global",
      "newsletter",
      locale,
      "is not a valid newsletter locale value.",
    );
  }
}

/* -------------------------------------------------------------------------- */

function main(): void {
  const report = new Report();

  console.log(
    `Validating ${SUPPORTED_LOCALES.length} locale(s): ${SUPPORTED_LOCALES.join(", ")} (default: ${DEFAULT_LOCALE})`,
  );

  validateLocaleModel(report);
  validateDictionaries(report);
  validateCoverage(report);
  validateAlternates(report);
  validateImages(report);
  validateSources(report);
  validateCrossLocaleNumbers(report);
  validateCrossLocaleTaxonomy(report);
  validateNewsletterLocales(report);

  let items = 0;
  for (const locale of SUPPORTED_LOCALES) {
    const content = getLocaleBundle(locale);
    items += content.articles.length + content.writers.length + content.works.length;
    validateLocale(locale, content, report);
  }

  report.print();

  if (AWAITING_TRANSLATION.length > 0) {
    console.log(
      `\n  note: ${AWAITING_TRANSLATION.length} article(s) are declared as awaiting the hyw/en adaptation pass, ` +
        `so the cross-edition number check is skipped for them: ${AWAITING_TRANSLATION.join(", ")}.`,
    );
  }

  if (report.problems.length > 0) {
    console.error(`\n✖ Content validation failed — ${report.problems.length} problem(s).\n`);
    process.exit(1);
  }

  console.log(`✓ Content is valid — ${items} entries across ${SUPPORTED_LOCALES.length} locales.`);
}

main();
