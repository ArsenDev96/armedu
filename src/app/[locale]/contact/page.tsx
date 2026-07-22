import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, Section, SectionHeading } from "@/components/ui/primitives";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { getAvailableSocialLinks, site } from "@/data/site";
import type { Locale } from "@/data/types";
import { getPages, getStaticAlternates, getUi, localePath, resolveLocale } from "@/lib/i18n";
import { pageLd, socialImage } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const { contact } = getPages(locale);
  const ui = getUi(locale);

  return {
    title: contact.title,
    description: contact.metaDescription,
    alternates: {
      canonical: localePath(locale, "/contact"),
      languages: getStaticAlternates("/contact"),
    },
    openGraph: {
      title: `${contact.title} | ${ui.site.name}`,
      description: contact.metaDescription,
      url: localePath(locale, "/contact"),
      type: "website",
      images: socialImage(undefined, contact.title),
    },
  };
}

export default async function ContactPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const { contact } = getPages(locale);
  const socials = getAvailableSocialLinks();

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: contact.title },
  ];

  return (
    <>
      <JsonLd data={pageLd(locale, ui, contact, "/contact", crumbs)} />
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl lg:text-[3rem]">
              {contact.heading}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{contact.lead}</p>
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
        <SectionHeading eyebrow={contact.reasonsEyebrow} title={contact.reasonsTitle} />
        <div className="grid gap-6 md:grid-cols-3">
          {contact.reasons.map((reason) => (
            <Card key={reason.title} className="p-6 md:p-7">
              <h2 className="text-lg text-ink">{reason.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-3">{reason.text}</p>
            </Card>
          ))}
        </div>

        {socials.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink-3">{contact.alsoHere}</span>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                rel="noopener noreferrer"
                target="_blank"
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-2 transition hover:border-burgundy hover:text-burgundy"
              >
                {social.label}
              </a>
            ))}
          </div>
        ) : null}
      </Section>

      <Section tone="tinted">
        <SectionHeading
          align="center"
          eyebrow={contact.newsletterEyebrow}
          title={contact.newsletterTitle}
        />
        <NewsletterForm locale={locale} ui={ui} source="contact-page" />
      </Section>
    </>
  );
}
