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
 * The six places the journey opens with — re-curated in §53, once the section
 * reached ten.
 *
 * The row is not the six oldest articles and not a ranking. It is a compact
 * answer to "what kind of country is this?", and the six cards are chosen so
 * that a reader who looks at nothing else still learns that Armenia holds a
 * living city, two landscapes that look nothing alike, a pre-Christian monument
 * and monastic architecture in two completely different settings — in six
 * different parts of the country.
 *
 * ## What changed, and why it had to
 *
 * The previous six were Garni, Geghard, Lake Sevan, Khor Virap, the Matenadaran
 * and Erebuni. That was a fair curation of a seven-article section and a poor
 * one of a ten-article section: five of the six sat within about forty
 * kilometres of Yerevan — two in the city, two in the same Kotayk valley eight
 * kilometres apart, one on the Ararat plain — and the row said, without meaning
 * to, that Armenia is the area around its capital.
 *
 * §47, §49 and §51 added the three articles that fix precisely that: Tatev in
 * Syunik, Dilijan in Tavush, Gyumri in Shirak. All three now have artwork, which
 * is what makes them curatable at all — a curated card is a picture card.
 *
 * ## The six, one line each
 *
 * - `khor-virap`   — the Ararat plain, and the single most recognisable view in
 *                    the country. Kept despite being the most "expected" card
 *                    here, because a first impression that omits it is a first
 *                    impression that is trying to prove something.
 * - `gyumri`       — the northwest, the only `settlement`, and the only card
 *                    where the subject is somewhere people live rather than
 *                    somewhere people visit.
 * - `lake-sevan`   — the east, and the natural feature Armenia is defined by.
 * - `garni-temple` — Kotayk, and the whole pre-Christian layer. Without it the
 *                    row begins in the fourth century, which is false.
 * - `dilijan-national-park` — the northeast, and the one landscape in the
 *                    registry that is green and closed rather than open and dry.
 * - `tatev-monastery` — the south, a monastery that looks nothing like the other
 *                    monastery, and the row's second religious card.
 *
 * ## The three that came out, and what each cost
 *
 * - `geghard-monastery` — the cheapest removal and the first one made. It is a
 *   World Heritage property and rock-cut, so it is a real loss, but it is eight
 *   kilometres from Garni in the same valley and it would have been the row's
 *   third monastery.
 * - `erebuni-fortress` — the deep-antiquity card, and the more painful of the
 *   two Yerevan removals. Garni carries "Armenia is older than its churches"
 *   forward alone now, which it can: what is lost is Urartu specifically, and
 *   the eighth century BC.
 * - `matenadaran` — the removal this file is least comfortable with, and the
 *   reason is written down rather than glossed. It is the only `museum` in the
 *   section, the only card about written culture, and the only remaining card in
 *   Yerevan, where nearly every reader of this page actually is. It came out
 *   because §3's five buckets do not include "museum" and do include "historic
 *   monuments", and between the Matenadaran and Garni only one of them answers
 *   that. The row now has no museum and no card in the capital; both are one
 *   click behind the CTA, and both are stated here so the next curator argues
 *   with the decision rather than rediscovering it.
 *
 * Etchmiadzin remains uncurated, as it has since this row was written, and is
 * now one of four places on the map that are not in it. That gap is the point:
 * the map is coverage, this is a selection.
 *
 * ## Order
 *
 * Editorial, not alphabetical, and it survives the responsive grid. At three
 * columns the rows read monastery / city / lake and temple / forest / monastery,
 * so the two monasteries land in opposite corners and the two landscapes never
 * touch; at two columns the pairs are city-beside-monastery, temple-beside-lake
 * and monastery-beside-forest; in a single column no two adjacent cards are the
 * same kind of picture. Six divides evenly into both grids, so there is no
 * orphaned final row.
 *
 * Slugs missing from an edition are dropped rather than rendered as a dead
 * card, on the same rule as `FOOTER_HISTORY` in `navigation.ts`. Today all ten
 * places exist in all three editions, so nothing is dropped.
 */
const VISIT_FEATURED_PLACES = [
  "khor-virap",
  "gyumri",
  "lake-sevan",
  "garni-temple",
  "dilijan-national-park",
  "tatev-monastery",
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
 * one *Places article*, which is the test of whether a connection is real or
 * invented for the sake of a fourth card:
 *
 * - `adoption-of-christianity` — Khor Virap, Geghard and Garni all point at it;
 * - `kingdom-of-urartu` — Erebuni and Lake Sevan point at it;
 * - `mesrop-mashtots-armenian-alphabet` — the Matenadaran points at it;
 * - `tigran-the-great` — Khor Virap and Garni point at it, and it is the
 *   pre-Christian context Garni is most often read against.
 *
 * **The rule was "at least one *curated* place" until §53, and this row is
 * unchanged by that step deliberately.** Three of the four still clear the
 * stricter form through Khor Virap, Garni and Lake Sevan. The alphabet does not:
 * its only carrier is the Matenadaran, which §53 removed from the row above
 * while leaving it in the section, on the map and in the listing. The connection
 * is therefore still declared in the content — which is what this rule was
 * actually for — but it is no longer visible on this page, and a reader now
 * meets the alphabet card without having just seen the building that holds the
 * manuscripts. That is a real cost of the re-curation, recorded here rather than
 * fixed by quietly dropping a Learn card or by re-curating a place to satisfy a
 * comment. Changing this row is a separate editorial decision and belongs in its
 * own step.
 *
 * Nothing was added to reach four. If a fifth were wanted it would have to earn
 * the same way, and `bagratid-armenia` (Lake Sevan and Tatev) is the only other
 * candidate that would.
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
            unavailable: visit.mapUnavailable,
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
