import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { CuisineListing } from "@/components/listing/CuisineListing";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHeading } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getArticlesByCategory, getCuisineTypes } from "@/lib/content";
import { listingLd, socialImage } from "@/lib/seo";
import { formatDate } from "@/lib/date";
import { getStaticAlternates, getUi, localePath, resolveLocale, t } from "@/lib/i18n";
import { getArticleImageSrc } from "@/lib/media";
import { estimateReadingTime } from "@/lib/reading-time";
import { toArticleListingItems } from "@/lib/search";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: ui.listing.cuisine.title,
    description: ui.listing.cuisine.metaDescription,
    keywords: ui.listing.cuisine.keywords,
    alternates: {
      canonical: localePath(locale, "/cuisine"),
      languages: getStaticAlternates("/cuisine"),
    },
    openGraph: {
      title: `${ui.listing.cuisine.title} | ${ui.site.name}`,
      description: ui.listing.cuisine.metaDescription,
      url: localePath(locale, "/cuisine"),
      type: "website",
      images: socialImage(undefined, ui.listing.cuisine.title),
    },
  };
}

export default async function CuisinePage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const articles = getArticlesByCategory(locale, "cuisine");
  const types = getCuisineTypes(locale);
  // Lavash is the section's entry point in every edition: it is the one dish
  // here that a cultural-heritage body has documented in its own right.
  const featured = articles.find((article) => article.slug === "lavash") ?? articles[0];
  const items = toArticleListingItems(locale, articles);

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: ui.listing.cuisine.title },
  ];

  return (
    <>
      <JsonLd data={listingLd(locale, ui, ui.listing.cuisine, "/cuisine", articles, crumbs)} />
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.listing.cuisine.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{ui.listing.cuisine.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <CuisineListing items={items} filters={types} ui={ui}>
          {featured ? (
            <div className="mt-10 md:mt-12">
              <SectionHeading
                eyebrow={ui.listing.cuisine.featuredEyebrow}
                title={ui.listing.cuisine.featuredTitle}
              />
              <FeaturedItem
                eyebrow={featured.dishType ?? ui.listing.cuisine.title}
                title={featured.title}
                description={featured.excerpt}
                href={localePath(locale, featured.href)}
                linkLabel={ui.listing.cuisine.readArticle}
                imageSeed={featured.imageSeed}
                imageSrc={getArticleImageSrc(featured)}
                imageAlt={featured.image?.alt ?? t(ui.article.imageAlt, { title: featured.title })}
                meta={
                  <p className="text-sm text-ink-3">
                    {t(ui.article.readingTime, { minutes: estimateReadingTime(featured) })} ·{" "}
                    {ui.article.updated} {formatDate(featured.updated, locale)}
                  </p>
                }
              />
            </div>
          ) : null}
        </CuisineListing>
      </Section>
    </>
  );
}
