import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { SearchPageResults } from "@/components/search/SearchPageResults";
import { Section } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getUi, localePath, resolveLocale, t } from "@/lib/i18n";
import { buildSearchIndex } from "@/lib/search";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: ui.search.title,
    description: ui.search.metaDescription,
    alternates: { canonical: localePath(locale, "/search") },
    // A results page has nothing stable to index, and every query would look
    // like a separate thin page to a crawler.
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  // Built at compile time from this locale's bundle only — an Armenian search
  // never reaches English text.
  const index = buildSearchIndex(locale);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs
            label={ui.nav.breadcrumbLabel}
            items={[
              { label: ui.nav.home, href: localePath(locale, "/") },
              { label: ui.search.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.search.heading}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              {t(ui.search.lead, { count: index.length })}
            </p>
          </div>
        </div>
      </div>

      <Section>
        <Suspense fallback={<div aria-hidden="true" className="h-24" />}>
          <SearchPageResults index={index} ui={ui} locale={locale} />
        </Suspense>
      </Section>
    </>
  );
}
