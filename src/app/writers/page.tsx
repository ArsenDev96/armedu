import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { WriterCard } from "@/components/cards/WriterCard";
import { FeaturedItem } from "@/components/sections/FeaturedItem";
import { ListingControls } from "@/components/sections/ListingControls";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { getLiteraryPeriods, getWriters } from "@/lib/content";

const title = "Armenian Writers";
const description =
  "Biographies of the poets and novelists who shaped Armenian literature — Hovhannes Tumanyan, Yeghishe Charents, Raffi, Avetik Isahakyan, Khachatur Abovyan and Paruyr Sevak.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/writers" },
  openGraph: {
    title: `${title} | ArmEdu`,
    description,
    url: "/writers",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
  },
};

export default function WritersPage() {
  const writers = getWriters();
  const periods = getLiteraryPeriods();
  const featured = writers.find((writer) => writer.featured) ?? writers[0];

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
              Armenian literature is carried by a small number of writers whose work almost every
              Armenian family knows by heart. These biographies explain who they were, what they
              wrote, and why their books still matter — in language students can actually use.
            </p>
          </div>
        </div>
      </div>

      <Section>
        <ListingControls
          filters={periods}
          searchLabel="Search Armenian writers"
          placeholder="Search writers, poems and novels…"
        />

        <div className="mt-10 md:mt-12">
          <SectionHeading eyebrow="Featured writer" title="The poet of all Armenians" />
          <FeaturedItem
            eyebrow={featured.period}
            title={featured.name}
            subtitle={featured.lifespan}
            description={featured.description}
            href={`/writers/${featured.slug}`}
            linkLabel="Read the biography"
            imageSeed={featured.imageSeed}
            imageAlt={`Portrait placeholder of ${featured.name}`}
            variant="portrait"
            meta={
              <div>
                <h3 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-3 uppercase">
                  Notable works
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

        <div className="mt-14 md:mt-16">
          <SectionHeading
            eyebrow="All writers"
            title="From Abovyan to Sevak"
            description="Six writers who span two centuries of Armenian literature, each with a full biography."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {writers.map((writer) => (
              <WriterCard key={writer.slug} writer={writer} />
            ))}
          </div>
        </div>
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow="Newsletter"
          title="Receive new Armenian history and literature articles"
          description="New biographies and article summaries, once a month."
        />
        <NewsletterForm />
      </Section>
    </>
  );
}
