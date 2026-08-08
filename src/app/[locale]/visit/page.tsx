import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { VisitMap } from "@/components/visit/VisitMap";
import { ArrowLink, ButtonLink, Section, SectionHeading } from "@/components/ui/primitives";
import { ALL_FILTER_ID, type CategoryId } from "@/data/types";
import { getArticlesByCategory, getPlaceTypes, toArticleSummary } from "@/lib/content";
import { getPages, getStaticAlternates, getUi, localePath, resolveLocale } from "@/lib/i18n";
import { pageLd, socialImage } from "@/lib/seo";
import { getVisitMapPoints } from "@/lib/visit-map";

/**
 * The Visit journey — the archive's second entry point.
 *
 * `/history`, `/places` and the rest answer "what is this?". This page answers
 * "what would I go and see?", and then hands the reader straight back to those
 * listings. It is a *curation layer*, not a section: it owns no articles, no
 * images and no prose about any subject. Everything on it is resolved from the
 * article registry at render time, which is why the three arrays below hold
 * slugs and nothing else.
 *
 * The rule that keeps it honest: if a card's title, excerpt or picture could be
 * wrong here while being right on `/places`, the data has been duplicated and
 * the duplication is the bug. There is no `/visit/<slug>` route and there must
 * not be one — a place has exactly one canonical URL, under `/places`.
 *
 * Deliberately absent, and not oversights: no map (`geo.ts` is not read here),
 * no hotels, bookings, tours, prices or opening hours, and no hero image. The
 * page is a discovery index for an educational archive, not a travel portal.
 */

/**
 * The six places the journey opens with.
 *
 * Chosen for spread rather than rank: a classical temple, a rock-cut monastery,
 * a lake, a monastery on the Ararat plain, a manuscript institute and an
 * Urartian fortress — which is every one of the four place types, with the two
 * that have a second article each contributing one.
 *
 * Etchmiadzin is the deliberate omission. It is the third `monastery` and would
 * have made half the row one type; it stays one click away behind the "all
 * places" link, which is the difference between a curated row and a copy of the
 * listing.
 *
 * Slugs missing from an edition are dropped rather than rendered as a dead
 * card, on the same rule as `FOOTER_HISTORY` in `navigation.ts`. Today all seven
 * places exist in all three editions, so nothing is dropped.
 */
const VISIT_FEATURED_PLACES = [
  "garni-temple",
  "geghard-monastery",
  "lake-sevan",
  "khor-virap",
  "matenadaran",
  "erebuni-fortress",
] as const;

/**
 * Four dishes of four different kinds.
 *
 * The point is variety, not the first four entries of the array: these are
 * `bread`, `main`, `meat` and `dessert` — four distinct `dishTypeId` values out
 * of the five the section defines. Taking the array's own order would have given
 * lavash, dolma, khorovats and harissa, which is the same spread minus the sweet.
 *
 * `ceremonial` is the one kind not represented, and it is the kind with two
 * articles (harissa and ghapama). Picking either would have spent a quarter of
 * the row on a type the reader can meet in full behind the cuisine link.
 */
const VISIT_FEATURED_DISHES = ["lavash", "dolma", "khorovats", "gata"] as const;

/**
 * The bridge back into the archive.
 *
 * Every one of these four is already declared in the `relatedSlugs` of at least
 * one place in `VISIT_FEATURED_PLACES`, which is the test of whether a
 * connection is real or invented for the sake of a fourth card:
 *
 * - `adoption-of-christianity` — Khor Virap, Geghard and Garni all point at it;
 * - `kingdom-of-urartu` — Erebuni and Lake Sevan point at it;
 * - `mesrop-mashtots-armenian-alphabet` — the Matenadaran points at it;
 * - `tigran-the-great` — Khor Virap and Garni point at it, and it is the
 *   pre-Christian context Garni is most often read against.
 *
 * Nothing was added to reach four. If a fifth were wanted it would have to earn
 * the same way, and `bagratid-armenia` (Lake Sevan) is the only other candidate
 * that would.
 */
const VISIT_LEARN_ARTICLES = [
  "adoption-of-christianity",
  "kingdom-of-urartu",
  "mesrop-mashtots-armenian-alphabet",
  "tigran-the-great",
] as const;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const { visit } = getPages(locale);
  const ui = getUi(locale);

  return {
    title: visit.title,
    description: visit.metaDescription,
    alternates: {
      canonical: localePath(locale, "/visit"),
      languages: getStaticAlternates("/visit"),
    },
    openGraph: {
      title: `${visit.title} | ${ui.site.name}`,
      description: visit.metaDescription,
      url: localePath(locale, "/visit"),
      type: "website",
      images: socialImage(undefined, visit.title),
    },
  };
}

export default async function VisitPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const { visit } = getPages(locale);

  /**
   * Resolve curated slugs against this edition's own articles.
   *
   * `href` is rewritten through `localePath` because `ArticleCard` renders it
   * verbatim and expects the locale prefix to be there already. Everything else
   * — title, excerpt, image, reading time — comes off the article untouched.
   */
  const pick = (category: CategoryId, slugs: readonly string[]) => {
    const articles = getArticlesByCategory(locale, category);
    return slugs
      .map((slug) => articles.find((article) => article.slug === slug))
      .filter((article): article is (typeof articles)[number] => Boolean(article))
      .map(toArticleSummary)
      .map((article) => ({ ...article, href: localePath(locale, article.href) }));
  };

  const places = pick("places", VISIT_FEATURED_PLACES);
  const dishes = pick("cuisine", VISIT_FEATURED_DISHES);
  const learn = pick("history", VISIT_LEARN_ARTICLES);

  /**
   * The place-type pills, read from the same `placeTypes` the listing filters
   * by — not a second taxonomy, and not re-translated here. `all` is dropped
   * because "all places" is the section's CTA, not one of its kinds.
   */
  const types = getPlaceTypes(locale).filter((type) => type.id !== ALL_FILTER_ID);

  /*
    The map's points, derived from `places articles ∩ PLACE_COORDINATES` — not
    from the curated six above. The map answers "where can I already read about
    something?", so it shows every place the archive has, Etchmiadzin included.
    The two lists differing is the intent, not a bug: one is an editorial pick,
    the other is coverage.

    Resolved on the server, so the list of places, their names, their types and
    their article links are all in the prerendered HTML before Leaflet exists.
  */
  const mapPoints = getVisitMapPoints(locale);

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: visit.heading },
  ];

  return (
    <>
      <JsonLd data={pageLd(locale, ui, visit, "/visit", crumbs)} />

      {/*
        A compact hero: breadcrumb, one H1, one paragraph. No image — the page
        gets its visual weight from the cards below, and the homepage hero is
        the homepage's, not a generic tourism asset.
      */}
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {visit.heading}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{visit.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow={visit.placesEyebrow}
          title={visit.placesTitle}
          description={visit.placesDescription}
          action={<ArrowLink href={localePath(locale, "/places")}>{visit.placesCta}</ArrowLink>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((article) => (
            <ArticleCard key={article.slug} article={article} ui={ui} />
          ))}
        </div>
      </Section>

      {/*
        The geographic index, between the curated row and the type controls: it
        answers "where are these?" about the section just above, and hands the
        reader into the listing controls just below.

        The heading and copy live here, on the server, rather than inside the
        client component — so the section has a title and an explanation even if
        Leaflet never loads. `VisitMap` renders its own accessible list of the
        same places for the same reason.
      */}
      <Section tone="surface">
        <SectionHeading
          eyebrow={visit.mapEyebrow}
          title={visit.mapTitle}
          description={visit.mapDescription}
        />
        <VisitMap
          points={mapPoints}
          types={getPlaceTypes(locale)}
          copy={{
            regionLabel: visit.mapRegionLabel,
            listTitle: visit.mapListTitle,
            selectPrompt: visit.mapSelectPrompt,
            cta: visit.mapCta,
            filterLabel: visit.mapFilterLabel,
          }}
        />
      </Section>

      {/*
        Deliberately not cards: these are four links into one listing, and giving
        them the same weight as an article card would say they were four more
        things to read. A tinted band and a row of link chips is the smallest
        thing that reads as a control rather than as content.
      */}
      <Section tone="tinted">
        <SectionHeading
          eyebrow={visit.typesEyebrow}
          title={visit.typesTitle}
          description={visit.typesDescription}
        />
        <ul className="flex flex-wrap gap-3">
          {types.map((type) => (
            <li key={type.id}>
              <ButtonLink
                href={`${localePath(locale, "/places")}?type=${type.id}`}
                variant="secondary"
              >
                {type.label}
              </ButtonLink>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading
          eyebrow={visit.foodEyebrow}
          title={visit.foodTitle}
          description={visit.foodDescription}
          action={<ArrowLink href={localePath(locale, "/cuisine")}>{visit.foodCta}</ArrowLink>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((article) => (
            <ArticleCard key={article.slug} article={article} ui={ui} variant="compact" />
          ))}
        </div>
      </Section>

      {/*
        The return leg of the journey, and the reason this page exists inside an
        educational archive rather than beside one.

        Its CTA is a `ButtonLink` where the two above are `ArrowLink`s: this is
        the end of the page and the one action that leads out of the journey and
        back into the archive, so it carries more weight than a "see the rest of
        this section" link. That, the `surface` tone and the compact cards are
        what keep it from reading as a second list of destinations.
      */}
      <Section tone="surface">
        <SectionHeading
          eyebrow={visit.learnEyebrow}
          title={visit.learnTitle}
          description={visit.learnDescription}
          action={
            <ButtonLink href={localePath(locale, "/history")}>{visit.learnCta}</ButtonLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {learn.map((article) => (
            <ArticleCard key={article.slug} article={article} ui={ui} variant="compact" />
          ))}
        </div>
      </Section>
    </>
  );
}
