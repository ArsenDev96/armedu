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
 */
const FOOTER_HISTORY: { slug: string; key: keyof ReturnType<typeof historyLabelKeys> }[] = [
  { slug: "kingdom-of-urartu", key: "ancientArmenia" },
  { slug: "tigran-the-great", key: "armenianKingdoms" },
  { slug: "bagratid-armenia", key: "medievalArmenia" },
  { slug: "first-republic-of-armenia", key: "modernArmenia" },
  { slug: "mesrop-mashtots-armenian-alphabet", key: "importantFigures" },
];

function historyLabelKeys(locale: Locale) {
  const { ui } = getLocaleBundle(locale);
  return {
    ancientArmenia: ui.footer.ancientArmenia,
    armenianKingdoms: ui.footer.armenianKingdoms,
    medievalArmenia: ui.footer.medievalArmenia,
    modernArmenia: ui.footer.modernArmenia,
    importantFigures: ui.footer.importantFigures,
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
