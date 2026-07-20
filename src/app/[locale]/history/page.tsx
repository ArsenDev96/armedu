import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { HistoryListing } from "@/components/listing/HistoryListing";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { ListingFallback } from "@/components/sections/ListingFallback";
import { Timeline } from "@/components/sections/Timeline";
import { Section, SectionHeading } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getArticlesByCategory, getHistoryPeriods, getTimeline } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { getStaticAlternates, getUi, localePath, resolveLocale, t } from "@/lib/i18n";
import { toHistoryListingItems } from "@/lib/search";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: ui.listing.history.title,
    description: ui.listing.history.metaDescription,
    alternates: {
      canonical: localePath(locale, "/history"),
      languages: getStaticAlternates("/history"),
    },
    openGraph: {
      title: `${ui.listing.history.title} | ${ui.site.name}`,
      description: ui.listing.history.metaDescription,
      url: localePath(locale, "/history"),
      type: "website",
      images: [
        { url: "/og-default.png", width: 1200, height: 630, alt: ui.listing.history.title },
      ],
    },
  };
}

export default async function HistoryPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const articles = getArticlesByCategory(locale, "history");
  const periods = getHistoryPeriods(locale);
  const timeline = getTimeline(locale);
  const featured = articles.find((article) => article.slug === "tigran-the-great") ?? articles[0];
  const items = toHistoryListingItems(locale, articles);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs
            label={ui.nav.breadcrumbLabel}
            items={[
              { label: ui.nav.home, href: localePath(locale, "/") },
              { label: ui.listing.history.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.listing.history.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{ui.listing.history.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <Suspense fallback={<ListingFallback />}>
          <HistoryListing items={items} filters={periods} ui={ui}>
            {featured ? (
              <div className="mt-10 md:mt-12">
                <SectionHeading
                  eyebrow={ui.listing.history.featuredEyebrow}
                  title={ui.listing.history.featuredTitle}
                />
                <FeaturedItem
                  eyebrow={featured.period ?? ui.listing.history.title}
                  title={featured.title}
                  description={featured.excerpt}
                  href={localePath(locale, featured.href)}
                  linkLabel={ui.listing.history.readArticle}
                  imageSeed={featured.imageSeed}
                  imageAlt={t(ui.article.imageAlt, { title: featured.title })}
                  meta={
                    <p className="text-sm text-ink-3">
                      {t(ui.article.readingTime, { minutes: featured.readingTime })} ·{" "}
                      {ui.article.updated} {formatDate(featured.updated, locale)}
                    </p>
                  }
                />
              </div>
            ) : null}
          </HistoryListing>
        </Suspense>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow={ui.listing.history.timelineEyebrow}
          title={ui.listing.history.timelineTitle}
          description={ui.listing.history.timelineDescription}
        />
        <Timeline entries={timeline} />
      </Section>
    </>
  );
}
