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
    { href: path("/"), label: ui.nav.home },
    {
      href: path("/history"),
      label: ui.nav.history,
      children: [
        ...articleLinks(locale, "history", DROPDOWN_LIMIT),
        { href: path("/history"), label: ui.nav.allHistoryArticles },
      ],
    },
    {
      href: path("/writers"),
      label: ui.nav.writers,
      children: [
        ...articleLinks(locale, "writers", DROPDOWN_LIMIT),
        { href: path("/writers"), label: ui.nav.allWriters },
      ],
    },
    {
      href: path("/works"),
      label: ui.nav.works,
      children: [
        ...articleLinks(locale, "works", DROPDOWN_LIMIT),
        { href: path("/works"), label: ui.nav.allWorks },
      ],
    },
    {
      href: path("/cuisine"),
      label: ui.nav.cuisine,
      children: [
        ...articleLinks(locale, "cuisine", DROPDOWN_LIMIT),
        { href: path("/cuisine"), label: ui.nav.allCuisineArticles },
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

  return [
    {
      title: ui.footer.exploreTitle,
      links: [
        { href: path("/history"), label: ui.nav.history },
        { href: path("/writers"), label: ui.nav.writers },
        { href: path("/works"), label: ui.nav.works },
        { href: path("/cuisine"), label: ui.nav.cuisine },
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
      links: [
        { href: path("/writers"), label: ui.nav.allWriters },
        ...articleLinks(locale, "writers", 4),
      ],
    },
    {
      title: ui.footer.resourcesTitle,
      links: [
        { href: path("/about"), label: ui.nav.about },
        { href: path("/works"), label: ui.nav.works },
        { href: "/sitemap.xml", label: ui.nav.sitemap },
        { href: path("/contact"), label: ui.nav.contact },
        { href: path("/privacy"), label: ui.nav.privacy },
      ],
    },
  ];
}
