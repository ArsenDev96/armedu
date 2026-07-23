import { getSources } from "@/data/sources";
import { site } from "@/data/site";
import {
  LOCALE_META,
  SUPPORTED_LOCALES,
  type Article,
  type ArticleSummary,
  type CategoryId,
  type Locale,
  type Source,
} from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { getWorks, getWriters } from "@/lib/content";
import { localePath } from "@/lib/i18n";
import { getArticleImageSrc } from "@/lib/media";
import { estimateReadingTime } from "@/lib/reading-time";

/**
 * Structured data (JSON-LD) for the whole archive.
 *
 * Everything here is derived from content that is already rendered on the page.
 * That is the rule: structured data describes what a reader can see, it never
 * introduces a claim of its own. A crawler and a reader must be able to
 * disagree about presentation but never about facts.
 *
 * Nothing falls back across locales. An Armenian page emits Armenian strings and
 * declares `inLanguage: "hy"`; the untranslated-article page emits no article
 * markup at all, because it is not an article.
 */

/** Stable `@id` anchors, so nodes can reference each other across pages. */
const ORG_ID = `${site.url}/#organization`;
const websiteId = (locale: Locale) => `${site.url}${localePath(locale, "/")}#website`;

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${site.url}${path}`;
}

/**
 * The publisher node, referenced by every page rather than repeated inline.
 *
 * `Organization` and not `EducationalOrganization`: Armat teaches nobody and
 * awards nothing, it publishes. Claiming the stronger type would be the kind of
 * flattering misdescription this project's content rules exist to prevent.
 */
export function organizationLd(ui: UiDictionary) {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: ui.site.name,
    url: site.url,
    description: ui.site.description,
    // No `email` node: the project publishes no address at all, and structured
    // data is the first place a scraper looks. Readers reach us through the
    // contact form.
    logo: {
      "@type": "ImageObject",
      url: absolute("/og-default.png"),
      width: 1200,
      height: 630,
    },
  };
}

/**
 * The compact `WebSite` node every non-home graph carries.
 *
 * Article, listing and plain pages point at the edition through
 * `isPartOf: { "@id": … }`. A graph that only *references* the id leaves the
 * crawler with a dangling pointer unless it happens to have crawled the home
 * page too — so each page carries this minimal definition. The home page
 * replaces it with the full node, which adds the search action.
 */
function websiteNode(locale: Locale, ui: UiDictionary) {
  return {
    "@type": "WebSite",
    "@id": websiteId(locale),
    url: absolute(localePath(locale, "/")),
    name: ui.site.name,
    inLanguage: LOCALE_META[locale].htmlLang,
    publisher: { "@id": ORG_ID },
  };
}

/** Home page: the edition itself, plus the search box Google may surface. */
export function websiteLd(locale: Locale, ui: UiDictionary) {
  const meta = LOCALE_META[locale];

  return graph([
    organizationLd(ui),
    {
      "@type": "WebSite",
      "@id": websiteId(locale),
      url: absolute(localePath(locale, "/")),
      name: ui.site.name,
      description: ui.site.description,
      inLanguage: meta.htmlLang,
      publisher: { "@id": ORG_ID },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${absolute(localePath(locale, "/search"))}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]);
}

/**
 * A citation, mapped to the identifier the bibliography carries.
 *
 * ISBNs and DOIs become `identifier` properties; a URL identifier becomes the
 * work's `url`. Archival references have no web identity at all, so they are
 * emitted as a plain `CreativeWork` with the reference in `identifier` — the
 * honest shape for something you can only obtain at a reading-room desk.
 */
function citationLd(source: Source) {
  const isBook = source.identifier.kind === "isbn";

  return {
    "@type": isBook ? "Book" : "CreativeWork",
    name: source.title,
    ...(source.author ? { author: { "@type": "Person", name: source.author } } : {}),
    ...(source.publisher ? { publisher: { "@type": "Organization", name: source.publisher } } : {}),
    ...(source.year ? { datePublished: source.year } : {}),
    ...(source.identifier.kind === "isbn" ? { isbn: source.identifier.value } : {}),
    ...(source.identifier.kind === "doi"
      ? { identifier: `https://doi.org/${source.identifier.value}` }
      : {}),
    ...(source.identifier.kind === "url" ? { url: source.identifier.value } : {}),
    ...(source.identifier.kind === "archive" ? { identifier: source.identifier.value } : {}),
  };
}

/**
 * The entity a writer or work article is *about*, so a knowledge graph can tie
 * the page to the person or the book rather than filing it as prose about
 * nothing in particular.
 *
 * Everything here restates data the reader already sees — the writer's name and
 * years are on the page and its cards, the work's title, genre and author
 * likewise — in this locale's own strings. Nothing is invented:
 *
 *   - birth/death dates are emitted only when the lifespan is the clean
 *     `YYYY–YYYY` every `Writer` entry uses. A qualified span ("մօտ 387–451")
 *     would need a false precision to fit `birthDate`, so it emits nothing.
 *   - a work's `author` becomes a `Person` only when a writer of exactly that
 *     name exists in this edition. "Անանուն, բանաւոր աւանդութիւն" is not a
 *     person, and typing it as one would be wrong; such works carry no author
 *     node at all.
 *
 * History articles get no `about`: their subject is an era or an event, and the
 * content model records no entity for it — inventing one is the line this file
 * does not cross.
 */
function aboutEntity(locale: Locale, article: Article): object | undefined {
  if (article.category === "writers") {
    const writer = getWriters(locale).find((w) => w.slug === article.slug);
    if (!writer) return undefined;

    const years = /^(\d{3,4})–(\d{3,4})$/.exec(writer.lifespan);
    return {
      "@type": "Person",
      name: writer.name,
      jobTitle: writer.role,
      ...(years ? { birthDate: years[1], deathDate: years[2] } : {}),
    };
  }

  if (article.category === "works") {
    const work = getWorks(locale).find((w) => w.slug === article.slug);
    if (!work) return undefined;

    const author = getWriters(locale).find((w) => w.name === work.author);
    return {
      "@type": "CreativeWork",
      name: work.title,
      genre: work.genre,
      ...(author ? { author: { "@type": "Person", name: author.name } } : {}),
    };
  }

  return undefined;
}

/**
 * An article page: the article, its breadcrumb trail, and its bibliography.
 *
 * `Article` rather than `ScholarlyArticle` — these are encyclopaedia entries for
 * school readers, not peer-reviewed work, and `ScholarlyArticle` would claim a
 * standing the archive has not earned.
 *
 * `article.updated` is a revision date, so it fills `dateModified`. It is also
 * given as `datePublished` because no separate first-publication date is
 * recorded anywhere in the content model; when one exists, split them here.
 */
export function articleLd(
  locale: Locale,
  ui: UiDictionary,
  article: Article,
  crumbs: { label: string; href?: string }[],
) {
  const meta = LOCALE_META[locale];
  const path = localePath(locale, article.href);
  const image = getArticleImageSrc(article);
  const sources = getSources(article.slug);
  const about = aboutEntity(locale, article);

  return graph([
    organizationLd(ui),
    websiteNode(locale, ui),
    {
      "@type": "Article",
      "@id": `${absolute(path)}#article`,
      isPartOf: { "@id": websiteId(locale) },
      mainEntityOfPage: absolute(path),
      url: absolute(path),
      headline: article.title,
      description: article.excerpt,
      abstract: article.intro,
      inLanguage: meta.htmlLang,
      datePublished: article.updated,
      dateModified: article.updated,
      author: { "@type": "Organization", name: article.author },
      publisher: { "@id": ORG_ID },
      articleSection: article.categoryLabel,
      // ISO 8601 duration, from the same word count the visible "min read"
      // figure uses — the two can never disagree.
      timeRequired: `PT${estimateReadingTime(article)}M`,
      ...(about ? { about } : {}),
      // Both properties come from the same authored list, because they say the
      // same thing to two different readers: `alternateName` tells a knowledge
      // graph that "Sasna Tsrer" and "Սասնա ծռեր" denote one entity, while
      // `keywords` is the plain topical list. Neither invents a subject the
      // article does not cover — that is enforced at the content layer.
      ...(article.keywords?.length
        ? { keywords: article.keywords.join(", "), alternateName: article.keywords }
        : {}),
      ...(image
        ? { image: { "@type": "ImageObject", url: absolute(image) } }
        : {}),
      ...(sources.length ? { citation: sources.map(citationLd) } : {}),
    },
    breadcrumbNode(locale, crumbs),
  ]);
}

/**
 * A category listing: the collection, its members in display order, and the
 * breadcrumb trail.
 *
 * The `ItemList` carries only URLs and positions. Repeating each article's title
 * and excerpt here would double the page's payload to restate what the article's
 * own page already declares authoritatively.
 */
export function listingLd(
  locale: Locale,
  ui: UiDictionary,
  listing: { title: string; metaDescription: string },
  path: string,
  items: Pick<ArticleSummary, "href">[],
  crumbs: { label: string; href?: string }[],
) {
  const meta = LOCALE_META[locale];
  const url = absolute(localePath(locale, path));

  return graph([
    organizationLd(ui),
    websiteNode(locale, ui),
    {
      "@type": "CollectionPage",
      "@id": `${url}#collection`,
      isPartOf: { "@id": websiteId(locale) },
      url,
      name: listing.title,
      description: listing.metaDescription,
      inLanguage: meta.htmlLang,
      publisher: { "@id": ORG_ID },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absolute(localePath(locale, item.href)),
        })),
      },
    },
    breadcrumbNode(locale, crumbs),
  ]);
}

/** About, contact and privacy: a plain page plus its breadcrumb trail. */
export function pageLd(
  locale: Locale,
  ui: UiDictionary,
  page: { title: string; metaDescription: string },
  path: string,
  crumbs: { label: string; href?: string }[],
) {
  const meta = LOCALE_META[locale];
  const url = absolute(localePath(locale, path));

  return graph([
    organizationLd(ui),
    websiteNode(locale, ui),
    {
      "@type": "WebPage",
      "@id": `${url}#page`,
      isPartOf: { "@id": websiteId(locale) },
      url,
      name: page.title,
      description: page.metaDescription,
      inLanguage: meta.htmlLang,
      publisher: { "@id": ORG_ID },
    },
    breadcrumbNode(locale, crumbs),
  ]);
}

/**
 * `BreadcrumbList` from the same crumb array the visible `<Breadcrumbs>` renders,
 * so the two can never drift. The final crumb is the current page and carries no
 * href, which is exactly how Schema.org expects the trail to end.
 */
function breadcrumbNode(locale: Locale, crumbs: { label: string; href?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absolute(crumb.href) } : {}),
    })),
  };
}

function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * OG/Twitter image for a slug: its own artwork when the archive ships one,
 * otherwise the site card. Absolute, because several scrapers do not resolve
 * relative image URLs against `metadataBase`.
 */
export function socialImage(slug?: string, alt?: string) {
  const src = slug ? getArticleImageSrc({ slug, image: undefined }) : undefined;
  return [
    {
      url: absolute(src ?? "/og-default.png"),
      ...(src ? {} : { width: 1200, height: 630 }),
      alt: alt ?? "",
    },
  ];
}

/**
 * `og:locale:alternate` values for a page in `locale`: the other editions'
 * Open Graph locales, deduplicated — hy and hyw share `hy_AM`, and a page must
 * not list its own locale as an alternate of itself.
 */
export function alternateOgLocales(locale: Locale): string[] {
  const own = LOCALE_META[locale].ogLocale;
  return [
    ...new Set(
      SUPPORTED_LOCALES.map((l) => LOCALE_META[l].ogLocale).filter((tag) => tag !== own),
    ),
  ];
}

/** Exported for the validation script, which checks the locale tags are real. */
export function getSeoLocales(): { locale: Locale; htmlLang: string }[] {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    htmlLang: LOCALE_META[locale].htmlLang,
  }));
}
