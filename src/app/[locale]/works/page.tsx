import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { WorksListing } from "@/components/listing/WorksListing";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { ListingFallback } from "@/components/sections/ListingFallback";
import { Section, SectionHeading } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getWorkGenres, getWorks } from "@/lib/content";
import { getStaticAlternates, getUi, localePath, resolveLocale, t } from "@/lib/i18n";
import { getImageSrc } from "@/lib/media";
import { toWorkListingItems } from "@/lib/search";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: ui.listing.works.title,
    description: ui.listing.works.metaDescription,
    alternates: {
      canonical: localePath(locale, "/works"),
      languages: getStaticAlternates("/works"),
    },
    openGraph: {
      title: `${ui.listing.works.title} | ${ui.site.name}`,
      description: ui.listing.works.metaDescription,
      url: localePath(locale, "/works"),
      type: "website",
      images: [
        { url: "/og-default.png", width: 1200, height: 630, alt: ui.listing.works.title },
      ],
    },
  };
}

export default async function WorksPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const works = getWorks(locale);
  const genres = getWorkGenres(locale);
  const featured = works[0];

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs
            label={ui.nav.breadcrumbLabel}
            items={[
              { label: ui.nav.home, href: localePath(locale, "/") },
              { label: ui.listing.works.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.listing.works.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{ui.listing.works.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <Suspense fallback={<ListingFallback />}>
          <WorksListing items={toWorkListingItems(locale, works)} filters={genres} ui={ui}>
            {featured ? (
              <div className="mt-10 md:mt-12">
                <SectionHeading
                  eyebrow={ui.listing.works.featuredEyebrow}
                  title={ui.listing.works.featuredTitle}
                />
                <FeaturedItem
                  eyebrow={featured.genre}
                  title={featured.title}
                  subtitle={`${featured.author} · ${featured.publicationPeriod}`}
                  description={featured.summary}
                  href={localePath(locale, `/works/${featured.slug}`)}
                  linkLabel={ui.listing.works.readSummary}
                  imageSeed={featured.imageSeed}
                  imageSrc={getImageSrc(featured.slug)}
                  imageAlt={t(ui.article.imageAlt, { title: featured.title })}
                />
              </div>
            ) : null}
          </WorksListing>
        </Suspense>
      </Section>
    </>
  );
}
