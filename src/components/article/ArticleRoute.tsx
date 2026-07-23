import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CategoryId, Locale } from "@/data/types";
import { ArticleLayout } from "@/components/article/ArticleLayout";
import { UnavailableTranslation } from "@/components/article/UnavailableTranslation";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticle, getCategoryListing, getRelatedArticles } from "@/lib/content";
import { alternateOgLocales, articleLd, socialImage } from "@/lib/seo";
import {
  getCanonicalSlugs,
  getContentAlternates,
  getLocaleMeta,
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
    // Transliterations and alternative spellings for this subject only. Absent
    // on articles that have no other name, rather than padded with the
    // category's keywords — a page claiming every term its section covers is
    // exactly the pattern that got the tag ignored in the first place.
    ...(article.keywords?.length ? { keywords: article.keywords } : {}),
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
      locale: getLocaleMeta(locale).ogLocale,
      alternateLocale: alternateOgLocales(locale),
      // `updated` is a revision date. It fills both fields because the content
      // model records no separate first-publication date; when one exists, this
      // is where they split.
      publishedTime: article.updated,
      modifiedTime: article.updated,
      authors: [article.author],
      section: article.categoryLabel,
      // `article:tag`, from the same authored list `keywords` uses.
      ...(article.keywords?.length ? { tags: article.keywords } : {}),
      images: socialImage(article.slug, article.title),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: socialImage(article.slug, article.title).map((image) => image.url),
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

    // Deliberately no structured data: this page is not an article, and
    // describing it as one is exactly the claim the `noindex` above denies.
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

  const breadcrumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: listing.title, href: listing.href },
    { label: article.title },
  ];

  return (
    <>
      <JsonLd data={articleLd(locale, ui, article, breadcrumbs)} />
      <ArticleLayout
        locale={locale}
        article={article}
        related={getRelatedArticles(locale, article)}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}

/** Re-exported so route files can build their own titles without extra imports. */
export { hasTranslation, t };
