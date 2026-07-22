import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/data/types";
import { getPages, getStaticAlternates, getUi, localePath, resolveLocale } from "@/lib/i18n";
import { pageLd, socialImage } from "@/lib/seo";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const { privacy } = getPages(locale);
  const ui = getUi(locale);

  return {
    title: privacy.title,
    description: privacy.metaDescription,
    alternates: {
      canonical: localePath(locale, "/privacy"),
      languages: getStaticAlternates("/privacy"),
    },
    openGraph: {
      title: `${privacy.title} | ${ui.site.name}`,
      description: privacy.metaDescription,
      url: localePath(locale, "/privacy"),
      type: "website",
      images: socialImage(undefined, privacy.title),
    },
  };
}

export default async function PrivacyPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const ui = getUi(locale);
  const { privacy } = getPages(locale);

  const crumbs = [
    { label: ui.nav.home, href: localePath(locale, "/") },
    { label: privacy.title },
  ];

  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page py-8 md:py-12">
        <JsonLd data={pageLd(locale, ui, privacy, "/privacy", crumbs)} />
        <Breadcrumbs label={ui.nav.breadcrumbLabel} items={crumbs} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-[2.1rem] leading-tight text-ink sm:text-4xl">{privacy.title}</h1>
          <p className="mt-4 text-sm text-ink-3">{privacy.lastUpdated}</p>
          <div className="prose-article mt-8">
            <p>{privacy.lead}</p>
            {privacy.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
