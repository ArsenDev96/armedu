import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { WritersListing } from "@/components/listing/WritersListing";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section, SectionHeading } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getLiteraryPeriods, getWriters } from "@/lib/content";
import { listingLd, socialImage } from "@/lib/seo";
import { getStaticAlternates, getUi, localePath, resolveLocale, t } from "@/lib/i18n";
import { getImageSrc } from "@/lib/media";
import { toWriterListingItems } from "@/lib/search";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: ui.listing.writers.title,
    description: ui.listing.writers.metaDescription,
    keywords: ui.listing.writers.keywords,
    alternates: {
      canonical: localePath(locale, "/writers"),
      languages: getStaticAlternates("/writers"),
    },
    openGraph: {
      title: `${ui.listing.writers.title} | ${ui.site.name}`,
      description: ui.listing.writers.metaDescription,
      url: localePath(locale, "/writers"),
      type: "website",
      images: socialImage(undefined, ui.listing.writers.title),
    },
  };
}

export default async function WritersPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const writers = getWriters(locale);
  const periods = getLiteraryPeriods(locale);
  const featured = writers.find((writer) => writer.featured) ?? writers[0];

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: ui.listing.writers.title },
  ];
  const entries = writers.map((writer) => ({ href: `/writers/${writer.slug}` }));

  return (
    <>
      <JsonLd data={listingLd(locale, ui, ui.listing.writers, "/writers", entries, crumbs)} />
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {ui.listing.writers.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{ui.listing.writers.lead}</p>
          </div>
        </div>
      </div>

      <Section>
          <WritersListing items={toWriterListingItems(locale, writers)} filters={periods} ui={ui}>
            {featured ? (
              <div className="mt-10 md:mt-12">
                <SectionHeading
                  eyebrow={ui.listing.writers.featuredEyebrow}
                  title={ui.listing.writers.featuredTitle}
                />
                <FeaturedItem
                  eyebrow={featured.period}
                  title={featured.name}
                  subtitle={featured.lifespan}
                  description={featured.description}
                  href={localePath(locale, `/writers/${featured.slug}`)}
                  linkLabel={ui.listing.writers.readBiography}
                  imageSeed={featured.imageSeed}
                  imageSrc={getImageSrc(featured.slug)}
                  imageAlt={t(
                    getImageSrc(featured.slug)
                      ? ui.article.portraitIllustrationAlt
                      : ui.article.portraitAlt,
                    { name: featured.name },
                  )}
                  variant="portrait"
                  meta={
                    <div>
                      <h3 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-3 uppercase">
                        {ui.listing.writers.notableWorks}
                      </h3>
                      <ul className="mt-2.5 flex flex-wrap gap-2">
                        {featured.notableWorks.map((work) => (
                          <li
                            key={work}
                            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-2"
                          >
                            {work}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                />
              </div>
            ) : null}
          </WritersListing>
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow={ui.listing.writers.newsletterEyebrow}
          title={ui.listing.writers.newsletterTitle}
          description={ui.listing.writers.newsletterDescription}
        />
        <NewsletterForm locale={locale} ui={ui} source="writers-page" />
      </Section>
    </>
  );
}
