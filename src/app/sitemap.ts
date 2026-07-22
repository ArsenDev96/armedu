import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { CATEGORY_IDS, LOCALE_META, SUPPORTED_LOCALES } from "@/data/types";
import { getAllArticles } from "@/lib/content";
import { getContentAlternates, getStaticAlternates, localePath } from "@/lib/i18n";

/**
 * Locale-aware sitemap.
 *
 * Every edition gets its own entries, each carrying `alternates.languages` so a
 * crawler can see which translations exist. Articles that are not translated in
 * a locale are simply absent from that locale's entries and from everyone
 * else's alternates — the "not translated" page is never advertised as a
 * translation.
 *
 * `/` is excluded on purpose: it is a redirect to the default locale, not a
 * content edition of its own.
 */
const STATIC_PATHS = ["/", "/about", "/contact", "/privacy"];

function absolute(path: string): string {
  return `${site.url}${path}`;
}

/** `hreflang` map with absolute URLs, as the sitemap protocol requires. */
function toAbsolute(alternates: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternates).map(([lang, path]) => [lang, absolute(path)]),
  );
}

/**
 * `lastModified` for a page that has no revision date of its own.
 *
 * A listing is as fresh as the newest article in it, and the home page as fresh
 * as the newest article anywhere. About, contact and privacy carry their own
 * dates in prose, not in the content model, so they get nothing — an invented
 * date is worse than none, because a crawler told that nothing changed has no
 * reason to come back and check.
 */
function withLastModified(
  path: string,
  articles: ReturnType<typeof getAllArticles>,
): { lastModified?: Date } {
  const category = CATEGORY_IDS.find((id) => path === `/${id}`);
  if (!category && path !== "/") return {};

  const scope = category ? articles.filter((a) => a.category === category) : articles;
  const newest = scope.map((a) => a.updated).sort().at(-1);

  return newest ? { lastModified: new Date(newest) } : {};
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    // Static pages and the three category listings exist in every edition.
    const paths = [...STATIC_PATHS, ...CATEGORY_IDS.map((id) => `/${id}`)];

    const articles = getAllArticles(locale);

    for (const path of paths) {
      entries.push({
        url: absolute(localePath(locale, path)),
        ...withLastModified(path, articles),
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : 0.8,
        alternates: { languages: toAbsolute(getStaticAlternates(path)) },
      });
    }

    // Only articles that actually exist in this edition.
    for (const article of getAllArticles(locale)) {
      entries.push({
        url: absolute(localePath(locale, article.href)),
        lastModified: new Date(article.updated),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: toAbsolute(getContentAlternates(article.category, article.slug)),
        },
      });
    }
  }

  return entries;
}

/** Exported for the validation script, which checks the locale tags are real. */
export const SITEMAP_LOCALE_TAGS = SUPPORTED_LOCALES.map(
  (locale) => LOCALE_META[locale].htmlLang,
);
