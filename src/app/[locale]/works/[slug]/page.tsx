import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n";
import { SUPPORTED_LOCALES, type Locale } from "@/data/types";
import {
  ArticleRoute,
  articleMetadata,
  articleStaticParams,
} from "@/components/article/ArticleRoute";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return articleStaticParams("works", SUPPORTED_LOCALES);
}

/**
 * Every real slug is prerendered by `generateStaticParams`. Dynamic params stay
 * enabled so that an unknown slug reaches the page, which calls `notFound()` —
 * that is what renders the *localized* 404 inside this locale's layout. With
 * them disabled Next short-circuits to its own untranslated error page.
 */
export const dynamicParams = true;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  return articleMetadata(locale, "works", slug);
}

export default async function WorkArticlePage({ params }: Params) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  return <ArticleRoute locale={locale} category="works" slug={slug} />;
}
