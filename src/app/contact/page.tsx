import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { site, socialLinks } from "@/data/site";

const title = "Contact";
const description = `Get in touch with the ${site.name} editorial team about corrections, classroom use, translations or collaboration.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: `${title} | ${site.name}`, description, url: "/contact", type: "website" },
};

const reasons = [
  {
    title: "Corrections",
    text: "Found a date, a name or a spelling that is wrong? Tell us which article and we will check it against our sources.",
  },
  {
    title: "Classroom use",
    text: "Teachers are welcome to use these articles in lessons. Write to us if you need a topic that is not covered yet.",
  },
  {
    title: "Translation and images",
    text: "We are looking for help with Eastern and Western Armenian translation, and for museums and archives willing to share imagery.",
  },
];

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              Contact us
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              This is a small editorial project and we read everything that arrives. The fastest way
              to reach us is by email.
            </p>
            <p className="mt-6">
              <a
                href={`mailto:${site.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-white transition hover:bg-burgundy-dark"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading eyebrow="Why people write to us" title="What we can help with" />
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => (
            <Card key={reason.title} className="p-6 md:p-7">
              <h2 className="text-lg text-ink">{reason.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">{reason.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-sm text-ink-3">Also here:</span>
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-2 transition hover:border-burgundy hover:text-burgundy"
            >
              {social.label}
            </a>
          ))}
        </div>
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow="Newsletter"
          title="Receive new Armenian history and literature articles"
        />
        <NewsletterForm />
      </Section>
    </>
  );
}
