import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Timeline } from "@/components/sections/Timeline";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { DiasporaBand } from "@/components/sections/DiasporaBand";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { WriterCard } from "@/components/cards/WriterCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLink, RowHeading, Section } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getCategories, getFeaturedArticles, getTimeline, getWriters } from "@/lib/content";
import { getStaticAlternates, getUi, localePath, resolveLocale } from "@/lib/i18n";
import { socialImage, websiteLd } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  return {
    title: `${ui.site.name} — ${ui.site.tagline}`,
    description: ui.site.description,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: getStaticAlternates("/"),
    },
    openGraph: {
      title: `${ui.site.name} — ${ui.site.tagline}`,
      description: ui.site.description,
      url: localePath(locale, "/"),
      images: socialImage(undefined, ui.site.name),
    },
  };
}

/**
 * Editorial pick for the homepage strip. Slugs missing from an edition are
 * dropped, and the row is topped up from that edition's own featured articles,
 * so a partial locale still shows a full row of things it can actually open.
 */
const FEATURED_SLUGS = [
  "tigran-the-great",
  "mesrop-mashtots-armenian-alphabet",
  "battle-of-avarayr",
  "hovhannes-tumanyan",
  "yeghishe-charents",
  "anush",
];

export default async function HomePage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);

  const categories = getCategories(locale);
  const timeline = getTimeline(locale);
  const writers = getWriters(locale).slice(0, 4);
  const all = getFeaturedArticles(locale, 100);

  const picked = FEATURED_SLUGS.map((slug) => all.find((a) => a.slug === slug)).filter(
    (article): article is (typeof all)[number] => Boolean(article),
  );
  const featured = [
    ...picked,
    ...all.filter((article) => !picked.some((item) => item.slug === article.slug)),
  ].slice(0, 6);

  return (
    <>
      <JsonLd data={websiteLd(locale, ui)} />
      <Hero locale={locale} ui={ui} />

      {/* Three ways in — icon-medallion cards, no section heading in the design. */}
      <section id="categories" className="pt-8 pb-5 md:pt-10 md:pb-7">
        <div className="container-page">
          <h2 className="sr-only">{ui.home.categoriesHeading}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                href={localePath(locale, category.href)}
                variant="banner"
              />
            ))}
          </div>
        </div>
      </section>

      <Section id="featured" padding="tight">
        <RowHeading
          title={ui.home.featuredHeading}
          action={
            <ArrowLink href={localePath(locale, "/history")}>{ui.home.featuredAction}</ArrowLink>
          }
        />
        {/* Six across on desktop; a snap-scrolling row below that. */}
        <ul className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
          {featured.map((article) => (
            <li key={article.slug} className="w-[13rem] shrink-0 snap-start lg:w-auto">
              <ArticleCard
                article={{ ...article, href: localePath(locale, article.href) }}
                ui={ui}
                variant="compact"
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="timeline" padding="tight">
        <RowHeading
          title={ui.home.timelineHeading}
          action={
            <ArrowLink href={localePath(locale, "/history")}>{ui.home.timelineAction}</ArrowLink>
          }
        />
        <Timeline entries={timeline} variant="rail" />
      </Section>

      <Section id="writers" padding="tight">
        <RowHeading
          title={ui.home.writersHeading}
          action={
            <ArrowLink href={localePath(locale, "/writers")}>{ui.home.writersAction}</ArrowLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {writers.map((writer) => (
            <WriterCard
              key={writer.slug}
              writer={writer}
              href={localePath(locale, `/writers/${writer.slug}`)}
              ui={ui}
              variant="horizontal"
            />
          ))}
        </div>
      </Section>

      <Section id="diaspora" padding="tight">
        <DiasporaBand locale={locale} ui={ui} />
      </Section>

      <Section id="newsletter" padding="tight" className="pb-12 md:pb-16">
        <h2 className="mx-auto max-w-2xl text-center text-xl leading-tight text-ink sm:text-2xl">
          {ui.home.newsletterHeading}
        </h2>
        <div className="mt-6">
          <NewsletterForm locale={locale} ui={ui} variant="inline" source="homepage" />
        </div>
      </Section>
    </>
  );
}
