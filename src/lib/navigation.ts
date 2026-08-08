import { getLocaleBundle } from "@/data";
import type { CategoryId, Locale } from "@/data/types";
import { localePath } from "@/lib/i18n";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavItem extends NavLink {
  /** Rendered as a dropdown under the header item. Every entry is a real page. */
  children?: NavLink[];
  /**
   * What the header bar shows instead of `label`. The full names qualify
   * themselves ("Armenian History") because breadcrumbs and the footer show
   * them out of context; the header bar sits under a logo that already says
   * whose history this is, so it uses the bare noun and saves the width.
   */
  shortLabel?: string;
  /**
   * Offered in the drawer but not the header bar. Home is the only one: the
   * logo immediately to its left is already a link home, so the item is a
   * duplicate on desktop — but on a phone the drawer is the whole map of the
   * site, and leaving home off it would be a hole.
   */
  drawerOnly?: boolean;
  /**
   * A journey rather than a section of the archive.
   *
   * The bar carries the five content categories plus About and is already at its
   * width budget (see the note above the nav in `Header.tsx`); a seventh item
   * there would have to be shortened into something that no longer reads as an
   * invitation. So the header renders this item apart from the list, as an
   * action in the right-hand cluster, and `barNav` filters it out.
   *
   * It still appears in the drawer, where the full `nav` array is rendered and
   * there is room for it — which is why it lives here rather than being built
   * separately by the header.
   */
  journey?: boolean;
}

/** How many articles each header dropdown lists before the "all …" link. */
const DROPDOWN_LIMIT = 5;

function articleLinks(locale: Locale, category: CategoryId, limit: number): NavLink[] {
  return getLocaleBundle(locale)
    .articles.filter((article) => article.category === category)
    .slice(0, limit)
    .map((article) => ({
      href: localePath(locale, article.href),
      label: article.title,
    }));
}

/**
 * Header navigation for one edition.
 *
 * Built from the locale's own bundle rather than a hard-coded list, so the
 * Western Armenian menu lists exactly the articles that exist in Western
 * Armenian — a dropdown never offers a page the reader cannot open.
 */
export function getMainNav(locale: Locale): NavItem[] {
  const { ui } = getLocaleBundle(locale);
  const path = (p: string) => localePath(locale, p);

  return [
    { href: path("/"), label: ui.nav.home, drawerOnly: true },
    /*
     * Second in the array so the drawer opens with the two journeys — read the
     * archive, or go and see it — before the six sections. `journey: true` keeps
     * it off the horizontal bar, where it renders as an action instead.
     *
     * No `children`: `/visit` is a curation layer over `/places`, `/cuisine` and
     * `/history`, so a dropdown listing "articles under Visit" would advertise
     * routes that deliberately do not exist.
     */
    {
      href: path("/visit"),
      label: ui.nav.visit,
      // The bar's width budget applies to the action too — see `nav.visitShort`.
      // The drawer reads `label`, so it keeps the full name.
      shortLabel: ui.nav.visitShort,
      journey: true,
    },
    {
      href: path("/history"),
      label: ui.nav.history,
      shortLabel: ui.nav.historyShort,
      children: [
        ...articleLinks(locale, "history", DROPDOWN_LIMIT),
        { href: path("/history"), label: ui.nav.allHistoryArticles },
      ],
    },
    {
      href: path("/writers"),
      label: ui.nav.writers,
      shortLabel: ui.nav.writersShort,
      children: [
        ...articleLinks(locale, "writers", DROPDOWN_LIMIT),
        { href: path("/writers"), label: ui.nav.allWriters },
      ],
    },
    {
      href: path("/works"),
      label: ui.nav.works,
      shortLabel: ui.nav.worksShort,
      children: [
        ...articleLinks(locale, "works", DROPDOWN_LIMIT),
        { href: path("/works"), label: ui.nav.allWorks },
      ],
    },
    {
      href: path("/cuisine"),
      label: ui.nav.cuisine,
      shortLabel: ui.nav.cuisineShort,
      children: [
        ...articleLinks(locale, "cuisine", DROPDOWN_LIMIT),
        { href: path("/cuisine"), label: ui.nav.allCuisineArticles },
      ],
    },
    {
      href: path("/places"),
      // No `shortLabel`: this label is already the bare noun the four above had
      // to be shortened into, so there is nothing to shorten.
      label: ui.nav.places,
      children: [
        ...articleLinks(locale, "places", DROPDOWN_LIMIT),
        { href: path("/places"), label: ui.nav.allPlaces },
      ],
    },
    { href: path("/about"), label: ui.nav.about },
  ];
}

export interface FooterGroup {
  title: string;
  links: NavLink[];
}

/**
 * Thematic history links in the footer. Each points at a specific article; any
 * whose slug is not translated in this locale is dropped rather than linked.
 *
 * These labels are the footer's own editorial vocabulary, not a mirror of the
 * listing filters — but they must not contradict them either. Until August 2026
 * Tigran the Great was labelled «Հայկական թագավորություններ» here, which was the
 * `kingdoms` period label his article also carried. When that period was removed
 * as naming no era (§21) the two fell out of step: the footer would have offered
 * a link under a heading the article itself no longer used anywhere.
 *
 * So Tigran now takes `importantFigures`, which is what he is on the new type
 * axis, and Mashtots takes a label naming what his article is actually about. All
 * five labels are now true of the article they point at.
 */
const FOOTER_HISTORY: { slug: string; key: keyof ReturnType<typeof historyLabelKeys> }[] = [
  { slug: "kingdom-of-urartu", key: "ancientArmenia" },
  { slug: "tigran-the-great", key: "importantFigures" },
  { slug: "adoption-of-christianity", key: "christianity" },
  { slug: "mesrop-mashtots-armenian-alphabet", key: "armenianAlphabet" },
  { slug: "bagratid-armenia", key: "medievalArmenia" },
  { slug: "first-republic-of-armenia", key: "modernArmenia" },
];

function historyLabelKeys(locale: Locale) {
  const { ui } = getLocaleBundle(locale);
  return {
    ancientArmenia: ui.footer.ancientArmenia,
    importantFigures: ui.footer.importantFigures,
    christianity: ui.footer.christianity,
    armenianAlphabet: ui.footer.armenianAlphabet,
    medievalArmenia: ui.footer.medievalArmenia,
    modernArmenia: ui.footer.modernArmenia,
  };
}

export function getFooterNav(locale: Locale): FooterGroup[] {
  const bundle = getLocaleBundle(locale);
  const { ui } = bundle;
  const path = (p: string) => localePath(locale, p);
  const labels = historyLabelKeys(locale);

  const historySlugs = new Set(
    bundle.articles.filter((a) => a.category === "history").map((a) => a.slug),
  );

  /*
    Every href below appears exactly once in the footer.

    It used to not: `/works` sat in both Explore and Resources, and `/writers`
    in Explore *and* again as "all writers" atop the Writers column — 27 links
    covering 23 destinations. Repeating a link in the block that renders on all
    thirteen routes buys nothing for a reader and spends internal-link weight
    saying the same thing twice, so each column now owns its targets: Explore
    holds the section indexes, History and Writers go straight to articles
    nothing else links to, and Resources keeps the site-level pages.

    `/sitemap.xml` is gone with them. It was raw XML behind a human-facing
    label; crawlers find it through `robots.txt` regardless.
  */
  return [
    {
      title: ui.footer.exploreTitle,
      links: [
        { href: path("/history"), label: ui.nav.history },
        { href: path("/writers"), label: ui.nav.writers },
        { href: path("/works"), label: ui.nav.works },
        { href: path("/cuisine"), label: ui.nav.cuisine },
        { href: path("/places"), label: ui.nav.places },
        // The journey belongs in Explore rather than Resources: it is a way into
        // the archive, not a page about the project. Once here and nowhere else,
        // per the rule above.
        { href: path("/visit"), label: ui.nav.visit },
        { href: `${path("/")}#timeline`, label: ui.footer.timeline },
        { href: path("/search"), label: ui.nav.search },
      ],
    },
    {
      title: ui.footer.historyTitle,
      links: FOOTER_HISTORY.filter((entry) => historySlugs.has(entry.slug)).map((entry) => ({
        href: path(`/history/${entry.slug}`),
        label: labels[entry.key],
      })),
    },
    {
      title: ui.footer.writersTitle,
      links: articleLinks(locale, "writers", 5),
    },
    {
      title: ui.footer.resourcesTitle,
      links: [
        { href: path("/about"), label: ui.nav.about },
        { href: path("/contact"), label: ui.nav.contact },
        { href: path("/privacy"), label: ui.nav.privacy },
      ],
    },
  ];
}
