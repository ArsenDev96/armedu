import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";

const title = "About";
const description =
  "ArmEdu is an independent educational platform publishing clear, source-based articles about Armenian history, writers, literary works and cultural heritage.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: "/about",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: title }],
  },
};

const audiences = [
  {
    title: "Students",
    text: "Short, structured articles with key facts, dates and sources that can be cited in homework and presentations.",
  },
  {
    title: "Teachers",
    text: "Material organised by period and topic, written to be assigned directly or adapted into lesson plans.",
  },
  {
    title: "Parents",
    text: "Background reading that makes it easy to answer a child's question about a name, a date or a poem.",
  },
  {
    title: "The diaspora",
    text: "An entry point into Armenian culture for families outside Armenia, in a language everyone at home can read.",
  },
];

const principles = [
  {
    title: "Accuracy before ambition",
    text: "Every article is built from academic histories and standard reference works, and lists its sources at the end. Where historians disagree, we say so rather than choosing a side.",
  },
  {
    title: "Plain language",
    text: "Armenian history is often written in a register that keeps newcomers out. We write for a reader who has never opened a history book — without simplifying the substance.",
  },
  {
    title: "Culture, not symbolism",
    text: "The focus is on what people wrote, built and argued about. Heritage is presented as something to understand, not something to decorate.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              About the platform
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              {site.name} is an independent educational project. We publish clear, carefully sourced
              articles about Armenian history, writers, literary works and cultural heritage, and we
              make them free to read for anyone, anywhere.
            </p>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Who it is for"
          title="Written for four kinds of reader"
          description="The same article should work for a fourteen-year-old writing an essay and for a parent in Los Angeles reading at the kitchen table."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience) => (
            <Card key={audience.title} className="p-6">
              <h3 className="text-lg text-ink">{audience.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{audience.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="How we work" title="Editorial principles" />
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title} className="p-6 md:p-7">
              <h3 className="text-lg text-ink">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">{principle.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="p-7 md:p-9">
            <h2 className="text-2xl text-ink">Languages</h2>
            <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-3">
              The platform launches in English. Eastern Armenian, Western Armenian and Russian
              editions are in preparation: the content structure already supports them, so each
              article will be translated rather than rewritten, and readers will be able to switch
              language without losing their place.
            </p>
          </Card>
          <Card className="p-7 md:p-9">
            <h2 className="text-2xl text-ink">What is next</h2>
            <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-3">
              This is an early version. The article archive will keep growing, images will be
              replaced with licensed photography and museum material, and search and filtering will
              become fully functional. Suggestions from teachers are especially welcome.
            </p>
          </Card>
        </div>
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow="Newsletter"
          title="Receive new Armenian history and literature articles"
          description="One email a month, with the newest articles and classroom material."
        />
        <NewsletterForm />
      </Section>
    </>
  );
}
