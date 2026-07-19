import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { WorkCard } from "@/components/cards/WorkCard";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { ListingControls } from "@/components/sections/ListingControls";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { getLiteraryPeriods, getWorks } from "@/lib/content";

const title = "Literary Works";
const description =
  "Summaries, historical context, characters and key ideas from important Armenian literary works, including Anush, Wounds of Armenia, The Fool and David of Sassoun.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/works" },
  openGraph: {
    title: `${title} | ArmEdu`,
    description,
    url: "/works",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
  },
};

export default function WorksPage() {
  const works = getWorks();
  const periods = getLiteraryPeriods();
  const featured = works[0];

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
              What happens in the story, who the characters are, when it was written and what it is
              really about. Each article gives the context a reader needs before opening the book —
              and the arguments a student needs after finishing it.
            </p>
          </div>
        </div>
      </div>

      <Section>
        <ListingControls
          filters={periods}
          searchLabel="Search literary works"
          placeholder="Search poems, novels and epics…"
        />

        <div className="mt-10 md:mt-12">
          <SectionHeading eyebrow="Featured work" title="Armenia's best-known love story" />
          <FeaturedItem
            eyebrow={featured.genre}
            title={featured.title}
            subtitle={`${featured.author} · ${featured.publicationPeriod}`}
            description={featured.summary}
            href={`/works/${featured.slug}`}
            linkLabel="Read the summary"
            imageSeed={featured.imageSeed}
            imageAlt={`Cover placeholder for ${featured.title}`}
          />
        </div>

        <div className="mt-14 md:mt-16">
          <SectionHeading
            eyebrow="All works"
            title="The books Armenian students read"
            description="Poems, novels and epics that shaped the modern Armenian literary language."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {works.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
