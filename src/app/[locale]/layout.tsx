import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import { SUPPORTED_LOCALES, type Locale } from "@/data/types";
import {
  getLocaleMeta,
  getStaticAlternates,
  getUi,
  localePath,
  resolveLocaleOrDefault,
} from "@/lib/i18n";
import { getFooterNav, getMainNav } from "@/lib/navigation";
import { alternateOgLocales, socialImage } from "@/lib/seo";
import "../globals.css";

/**
 * This is the application's root layout.
 *
 * Every public page lives under `/[locale]`, which lets `<html lang>` carry the
 * real language of the page — impossible if the locale sat below a hard-coded
 * root layout. `/` is redirected to the default locale in `next.config.ts`.
 */

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * Any first segment that is not a supported locale 404s instead of being
 * rendered on demand. This is what makes `/ru` and `/foo` safe without
 * middleware, and it keeps every locale statically generated.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocaleOrDefault(raw);
  const ui = getUi(locale);
  const meta = getLocaleMeta(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${ui.site.name} — ${ui.site.tagline}`,
      template: `%s | ${ui.site.name}`,
    },
    description: ui.site.description,
    // Inherited by every page that declares no set of its own. Next replaces
    // rather than merges, so a page that overrides this must be self-sufficient.
    keywords: ui.site.keywords,
    applicationName: ui.site.name,
    openGraph: {
      type: "website",
      siteName: ui.site.name,
      locale: meta.ogLocale,
      alternateLocale: alternateOgLocales(locale),
      title: `${ui.site.name} — ${ui.site.tagline}`,
      description: ui.site.description,
      url: localePath(locale, "/"),
      images: socialImage(undefined, ui.site.name),
    },
    twitter: {
      card: "summary_large_image",
      title: `${ui.site.name} — ${ui.site.tagline}`,
      description: ui.site.description,
      images: socialImage(undefined, ui.site.name).map((image) => image.url),
    },
    alternates: {
      canonical: localePath(locale, "/"),
      languages: getStaticAlternates("/"),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = resolveLocaleOrDefault(raw);
  const ui = getUi(locale);
  const meta = getLocaleMeta(locale);

  return (
    // `data-scroll-behavior` tells the router that the smooth scrolling declared
    // in globals.css is intentional, so it can suppress it during navigations.
    <html lang={meta.htmlLang} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-burgundy focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          {ui.site.skipToContent}
        </a>
        <Header locale={locale} nav={getMainNav(locale)} ui={ui} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} groups={getFooterNav(locale)} ui={ui} />
      </body>
    </html>
  );
}
