import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { PlacesListing } from "@/components/listing/PlacesListing";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { getArticlesByCategory, getPlaceTypes } from "@/lib/content";
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
    title: ui.listing.places.title,
    description: ui.listing.places.metaDescription,
    keywords: ui.listing.places.keywords,
    alternates: {
      canonical: localePath(locale, "/places"),
      languages: getStaticAlternates("/places"),
    },
    openGraph: {
      title: `${ui.listing.places.title} | ${ui.site.name}`,
      description: ui.listing.places.metaDescription,
      url: localePath(locale, "/places"),
      type: "website",
      images: socialImage(undefined, ui.listing.places.title),
    },
  };
}

export default async function PlacesPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const articles = getArticlesByCategory(locale, "places");
  const types = getPlaceTypes(locale);
  // The flag, not a hard-coded slug: the section's entry point is an editorial
  // decision that belongs on the article, and a slug written here would fail
  // silently the day that article is renamed.
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const items = toArticleListingItems(locale, articles);

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: ui.listing.places.title },
  ];

  return (
    <>
      <JsonLd data={listingLd(locale, ui, ui.listing.places, "/places", articles, crumbs)} />
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.listing.places.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{ui.listing.places.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <PlacesListing items={items} filters={types} ui={ui}>
          {featured ? (
            <div className="mt-10 md:mt-12">
              <SectionHeading
                eyebrow={ui.listing.places.featuredEyebrow}
                title={ui.listing.places.featuredTitle}
              />
              <FeaturedItem
                eyebrow={ui.listing.places.title}
                title={featured.title}
                description={featured.excerpt}
                href={localePath(locale, featured.href)}
                linkLabel={ui.listing.places.readArticle}
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
        </PlacesListing>
      </Section>
    </>
  );
}
