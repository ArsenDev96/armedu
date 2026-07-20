import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import type { Locale } from "@/data/types";
import { getPages, getStaticAlternates, getUi, localePath, resolveLocale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const { about } = getPages(locale);
  const ui = getUi(locale);

  return {
    title: about.title,
    description: about.metaDescription,
    alternates: {
      canonical: localePath(locale, "/about"),
      languages: getStaticAlternates("/about"),
    },
    openGraph: {
      title: `${about.title} | ${ui.site.name}`,
      description: about.metaDescription,
      url: localePath(locale, "/about"),
      type: "website",
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: about.title }],
    },
  };
}

export default async function AboutPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const { about } = getPages(locale);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs
            label={ui.nav.breadcrumbLabel}
            items={[
              { label: ui.nav.home, href: localePath(locale, "/") },
              { label: about.title },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {about.heading}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{about.lead}</p>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow={about.audiencesEyebrow}
          title={about.audiencesTitle}
          description={about.audiencesDescription}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.audiences.map((audience) => (
            <Card key={audience.title} className="p-6">
              <h3 className="text-lg text-ink">{audience.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{audience.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow={about.principlesEyebrow} title={about.principlesTitle} />
        <div className="grid gap-6 md:grid-cols-3">
          {about.principles.map((principle) => (
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
            <h2 className="text-2xl text-ink">{about.languagesHeading}</h2>
            <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-3">
              {about.languagesBody}
            </p>
          </Card>
          <Card className="p-7 md:p-9">
            <h2 className="text-2xl text-ink">{about.nextHeading}</h2>
            <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-3">{about.nextBody}</p>
          </Card>
        </div>
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow={about.newsletterEyebrow}
          title={about.newsletterTitle}
          description={about.newsletterDescription}
        />
        <NewsletterForm locale={locale} ui={ui} source="article-page" />
      </Section>
    </>
  );
}
