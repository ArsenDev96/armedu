import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { ListingControls } from "@/components/sections/ListingControls";
import { Timeline } from "@/components/sections/Timeline";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { getArticlesByCategory, getHistoryPeriods, getTimeline } from "@/lib/content";
import { formatDate } from "@/lib/date";

const title = "Armenian History";
const description =
  "Explore important periods, kingdoms, people, battles and events in Armenian history — from the Kingdom of Urartu to the First Republic of Armenia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/history" },
  openGraph: {
    title: `${title} | ArmEdu`,
    description,
    url: "/history",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
  },
};

export default function HistoryPage() {
  const articles = getArticlesByCategory("history");
  const periods = getHistoryPeriods();
  const timeline = getTimeline();
  const featured = articles.find((article) => article.slug === "tigran-the-great") ?? articles[0];
  const rest = articles.filter((article) => article.slug !== featured.slug);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              Three thousand years of history on the Armenian Highland, told in short, readable
              articles. Every topic includes key facts, a timeline of dates and the sources behind
              it, so it can be used for homework, lesson planning or simple curiosity.
            </p>
          </div>
        </div>
      </div>

      <Section>
        <ListingControls
          filters={periods}
          searchLabel="Search history articles"
          placeholder="Search historical events, kingdoms and people…"
        />

        <div className="mt-10 md:mt-12">
          <SectionHeading eyebrow="Featured topic" title="Where most readers begin" />
          <FeaturedItem
            eyebrow={featured.period ?? "Armenian History"}
            title={featured.title}
            description={featured.excerpt}
            href={featured.href}
            linkLabel="Read the article"
            imageSeed={featured.imageSeed}
            imageAlt={`Illustration for the article ${featured.title}`}
            meta={
              <p className="text-sm text-ink-3">
                {featured.readingTime} min read · Updated {formatDate(featured.updated)}
              </p>
            }
          />
        </div>

        <div className="mt-14 md:mt-16">
          <SectionHeading
            eyebrow="All history articles"
            title="Periods, people and events"
            description="Articles are added regularly. Filters above will become active as the archive grows."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Timeline"
          title="Armenian history at a glance"
          description="A quick overview of the periods covered on the platform."
        />
        <Timeline entries={timeline} />
      </Section>
    </>
  );
}
