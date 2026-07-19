import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Timeline } from "@/components/sections/Timeline";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { DiasporaBand } from "@/components/sections/DiasporaBand";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { WriterCard } from "@/components/cards/WriterCard";
import { ArrowLink, RowHeading, Section } from "@/components/ui/primitives";
import {
  getCategories,
  getFeaturedArticles,
  getTimeline,
  getWriters,
} from "@/lib/content";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: site.name }],
  },
};

const FEATURED_SLUGS = [
  "tigran-the-great",
  "mesrop-mashtots-armenian-alphabet",
  "battle-of-avarayr",
  "hovhannes-tumanyan",
  "yeghishe-charents",
  "anush",
];

export default function HomePage() {
  const categories = getCategories();
  const timeline = getTimeline();
  const writers = getWriters().slice(0, 4);
  const all = getFeaturedArticles(100);
  const featured = FEATURED_SLUGS.map((slug) => all.find((a) => a.slug === slug)).filter(
    (article): article is (typeof all)[number] => Boolean(article),
  );

  return (
    <>
      <Hero />

      {/* Three ways in — icon-medallion cards, no section heading in the design. */}
      <section id="categories" className="pt-8 pb-5 md:pt-10 md:pb-7">
        <div className="container-page">
          <h2 className="sr-only">Explore the platform</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} variant="banner" />
            ))}
          </div>
        </div>
      </section>

      <Section id="featured" padding="tight">
        <RowHeading
          title="Featured Articles"
          action={<ArrowLink href="/history">View all articles</ArrowLink>}
        />
        {/* Six across on desktop; a snap-scrolling row below that. */}
        <ul className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
          {featured.map((article) => (
            <li key={article.slug} className="w-[13rem] shrink-0 snap-start lg:w-auto">
              <ArticleCard article={article} variant="compact" />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="timeline" padding="tight">
        <RowHeading
          title="Explore Armenian History"
          action={<ArrowLink href="/history">View full timeline</ArrowLink>}
        />
        <Timeline entries={timeline} variant="rail" />
      </Section>

      <Section id="writers" padding="tight">
        <RowHeading
          title="Popular Writers"
          action={<ArrowLink href="/writers">View all writers</ArrowLink>}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {writers.map((writer) => (
            <WriterCard key={writer.slug} writer={writer} variant="horizontal" />
          ))}
        </div>
      </Section>

      <Section id="diaspora" padding="tight">
        <DiasporaBand />
      </Section>

      <Section id="newsletter" padding="tight" className="pb-12 md:pb-16">
        <h2 className="mx-auto max-w-2xl text-center text-xl leading-tight text-ink sm:text-2xl">
          Receive new Armenian history and literature articles
        </h2>
        <div className="mt-6">
          <NewsletterForm variant="inline" />
        </div>
      </Section>
    </>
  );
}
