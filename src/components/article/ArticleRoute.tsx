import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CategoryId, Locale } from "@/data/types";
import { ArticleLayout } from "@/components/article/ArticleLayout";
import { UnavailableTranslation } from "@/components/article/UnavailableTranslation";
import { getArticle, getCategoryListing, getRelatedArticles } from "@/lib/content";
import {
  getCanonicalSlugs,
  getContentAlternates,
  getUi,
  hasTranslation,
  localePath,
  t,
} from "@/lib/i18n";

/**
 * Shared plumbing for `/[locale]/history/[slug]`, `/writers/[slug]` and
 * `/works/[slug]`.
 *
 * The three routes differ only in their category, so the lookup, the
 * "not translated in this language" branch and the metadata all live here
 * rather than being written out three times.
 */

/** Every locale × every canonical slug — including the untranslated ones. */
export function articleStaticParams(category: CategoryId, locales: readonly Locale[]) {
  return locales.flatMap((locale) =>
    getCanonicalSlugs(category).map((slug) => ({ locale, slug })),
  );
}

export function articleMetadata(
  locale: Locale,
  category: CategoryId,
  slug: string,
): Metadata {
  const ui = getUi(locale);
  const article = getArticle(locale, category, slug);
  const path = `/${category}/${slug}`;

  // Untranslated: a real page, but not a translation. It must never be offered
  // to a crawler as one, and it must not advertise alternates of its own.
  if (!article) {
    return {
      title: ui.unavailable.metaTitle,
      description: ui.unavailable.body,
      robots: { index: false, follow: true },
      alternates: { canonical: localePath(locale, path) },
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: localePath(locale, path),
      // Only editions that actually exist are advertised.
      languages: getContentAlternates(category, slug),
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: localePath(locale, path),
      publishedTime: article.updated,
      authors: [article.author],
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: article.title }],
    },
  };
}

export function ArticleRoute({
  locale,
  category,
  slug,
}: {
  locale: Locale;
  category: CategoryId;
  slug: string;
}) {
  const ui = getUi(locale);
  const listing = getCategoryListing(locale, category);
  const article = getArticle(locale, category, slug);

  if (!article) {
    // Two very different situations share this branch, and conflating them
    // would be a lie in one direction or the other:
    //   - a real article that this edition has not translated yet → explain
    //   - a slug that exists nowhere → 404
    if (!getCanonicalSlugs(category).includes(slug)) notFound();

    return (
      <UnavailableTranslation
        locale={locale}
        category={category}
        slug={slug}
        categoryTitle={listing.title}
        categoryHref={listing.href}
      />
    );
  }

  return (
    <ArticleLayout
      locale={locale}
      article={article}
      related={getRelatedArticles(locale, article)}
      breadcrumbs={[
        { label: ui.nav.home, href: localePath(locale, "/") },
        { label: listing.title, href: listing.href },
        { label: article.title },
      ]}
    />
  );
}

/** Re-exported so route files can build their own titles without extra imports. */
export { hasTranslation, t };
