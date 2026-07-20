import Link from "next/link";
import type { CategoryId, Locale } from "@/data/types";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { Card, Section } from "@/components/ui/primitives";
import { getArticle } from "@/lib/content";
import {
  getAvailableLocalesForContent,
  getLocaleMeta,
  getUi,
  localePath,
  t,
} from "@/lib/i18n";

/**
 * Shown when an article exists in the project but not in the language being
 * read.
 *
 * The alternative — quietly rendering the English text under `/hyw` — would tell
 * the reader that Western Armenian coverage is more complete than it is. This
 * page is honest about the gap and hands over the editions that do exist.
 */
export function UnavailableTranslation({
  locale,
  category,
  slug,
  categoryTitle,
  categoryHref,
}: {
  locale: Locale;
  category: CategoryId;
  slug: string;
  categoryTitle: string;
  categoryHref: string;
}) {
  const ui = getUi(locale);

  const elsewhere = getAvailableLocalesForContent(category, slug)
    .filter((candidate) => candidate !== locale)
    .map((candidate) => {
      const meta = getLocaleMeta(candidate);
      // Title in the target language, so the link shows what the reader will get.
      const article = getArticle(candidate, category, slug);
      return {
        locale: candidate,
        label: meta.label,
        htmlLang: meta.htmlLang,
        title: article?.title ?? slug,
        href: localePath(candidate, `/${category}/${slug}`),
      };
    });

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs
            label={ui.nav.breadcrumbLabel}
            items={[
              { label: ui.nav.home, href: localePath(locale, "/") },
              { label: categoryTitle, href: categoryHref },
              { label: ui.unavailable.eyebrow },
            ]}
          />
        </div>
      </div>

      <Section>
        <Card className="mx-auto max-w-2xl px-6 py-12 text-center md:py-16">
          <p className="text-xs font-semibold tracking-[0.18em] text-burgundy uppercase">
            {ui.unavailable.eyebrow}
          </p>
          <h1 className="mt-4 text-2xl leading-tight text-ink sm:text-3xl">
            {ui.unavailable.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-3">
            {ui.unavailable.body}
          </p>

          {elsewhere.length > 0 ? (
            <ul className="mt-8 flex flex-col gap-3">
              {elsewhere.map((entry) => (
                <li key={entry.locale}>
                  <Link
                    href={entry.href}
                    hrefLang={entry.htmlLang}
                    lang={entry.htmlLang}
                    className="flex flex-col items-center gap-1 rounded-2xl border border-line px-5 py-4 transition hover:border-burgundy"
                  >
                    <span className="text-xs font-semibold tracking-[0.14em] text-ink-3 uppercase">
                      {t(ui.unavailable.readInOther, { language: entry.label })}
                    </span>
                    <span className="font-serif text-base text-ink">{entry.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-8">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy transition hover:text-burgundy-dark"
            >
              <span aria-hidden="true">←</span>
              {t(ui.unavailable.backToCategory, { category: categoryTitle })}
            </Link>
          </p>
        </Card>
      </Section>
    </>
  );
}
