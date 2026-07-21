import Link from "next/link";
import type { Article, ArticleSummary, Locale, SourceIdentifier } from "@/data/types";
import { getSources } from "@/data/sources";
import type { UiDictionary } from "@/data/ui";
import { ArticleNav } from "@/components/article/ArticleNav";
import { Breadcrumbs, type Crumb } from "@/components/article/Breadcrumbs";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { TableOfContents } from "@/components/article/TableOfContents";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { ClockIcon } from "@/components/ui/icons";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Card, Pill } from "@/components/ui/primitives";
import { getAdjacentArticles, getCategoryListing } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { getUi, localePath, t } from "@/lib/i18n";
import { getArticleImageSrc, IMAGE_SIZES } from "@/lib/media";
import { estimateReadingTime } from "@/lib/reading-time";

/**
 * Renders a citation's identifier as something a reader can follow.
 *
 * ISBNs get a WorldCat search and DOIs a doi.org resolver, so a book with no
 * publisher page is still reachable; archival references are printed as-is,
 * because a fonds reference is how you request the material at the reading room
 * desk and there is no URL that stands in for it.
 */
function SourceIdentifierLink({
  identifier,
  label,
}: {
  identifier: SourceIdentifier;
  label: string;
}) {
  if (identifier.kind === "archive") {
    return <span className="text-ink-3"> · {identifier.value}</span>;
  }

  const href =
    identifier.kind === "isbn"
      ? `https://search.worldcat.org/search?q=bn:${identifier.value}`
      : identifier.kind === "doi"
        ? `https://doi.org/${identifier.value}`
        : identifier.value;

  const shown = identifier.kind === "isbn" ? `ISBN ${identifier.value}` : label;

  return (
    <>
      {" "}
      <a
        href={href}
        className="text-burgundy underline underline-offset-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        {shown}
      </a>
    </>
  );
}

export function ArticleLayout({
  locale,
  article,
  breadcrumbs,
  related,
}: {
  locale: Locale;
  article: Article;
  breadcrumbs: Crumb[];
  related: ArticleSummary[];
}) {
  const ui: UiDictionary = getUi(locale);
  const listing = getCategoryListing(locale, article.category);
  const { previous, next } = getAdjacentArticles(locale, article);
  const readingTime = estimateReadingTime(article);
  // The bibliography is locale-independent: the same book serves every edition.
  const sources = getSources(article.slug);

  // Three distinct cases, and the caption has to tell them apart honestly:
  // content-declared photography (credited), the artwork shipped in `public/`
  // (an illustration, and the caption says so), and no artwork at all.
  const heroSrc = getArticleImageSrc(article);
  const heroAlt = article.image?.alt ?? t(ui.article.imageAlt, { title: article.title });
  const heroCaption = article.image
    ? article.image.credit
      ? t(ui.article.imageCredit, { credit: article.image.credit })
      : article.image.alt
    : t(heroSrc ? ui.article.imageIllustrationCaption : ui.article.imagePlaceholderCaption, {
        title: article.title,
      });

  const extraToc = [
    { id: "important-dates", heading: ui.article.importantDates },
    { id: "significance", heading: article.significance.heading },
    { id: "interesting-facts", heading: ui.article.interestingFacts },
    { id: "related-figures", heading: ui.article.relatedFigures },
    { id: "sources", heading: ui.article.sources },
  ];

  return (
    <article>
      <header className="border-b border-line bg-surface">
        <div className="container-page py-8 md:py-12">
          <Breadcrumbs label={ui.nav.breadcrumbLabel} items={breadcrumbs} />

          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Pill>{article.categoryLabel}</Pill>
              {article.period ? (
                <span className="text-sm text-ink-3">{article.period}</span>
              ) : null}
            </div>
            <h1 className="mt-4 text-[2rem] leading-[1.15] text-ink sm:text-4xl lg:text-[2.9rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">{article.intro}</p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
              <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-3">
                <div className="flex gap-1.5">
                  <dt className="sr-only">{ui.article.author}</dt>
                  <dd>{article.author}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>{ui.article.updated}</dt>
                  <dd>
                    <time dateTime={article.updated}>{formatDate(article.updated, locale)}</time>
                  </dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <dt className="sr-only">{ui.article.readingTimeLabel}</dt>
                  <dd className="flex items-center gap-1.5">
                    <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t(ui.article.readingTime, { minutes: readingTime })}
                  </dd>
                </div>
              </dl>
              <CopyLinkButton
                labels={{
                  idle: ui.article.copyLink,
                  copied: ui.article.copied,
                  failed: ui.article.copyFailed,
                  copiedAnnouncement: ui.article.copiedAnnouncement,
                  failedAnnouncement: ui.article.copyFailedAnnouncement,
                }}
              />
            </div>

            <p className="mt-5">
              <Link
                href={listing.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy transition hover:text-burgundy-dark"
              >
                <span aria-hidden="true">←</span>
                {t(ui.article.backToCategory, { category: listing.title })}
              </Link>
            </p>
          </div>

          <figure className="mt-8 md:mt-10">
            <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-line bg-paper-2">
              <ContentPhoto
                src={heroSrc}
                seed={article.imageSeed}
                variant="wide"
                alt={heroAlt}
                sizes={IMAGE_SIZES.hero}
                priority
              />
            </div>
            <figcaption className="mt-3 text-sm text-ink-3">{heroCaption}</figcaption>
          </figure>
        </div>
      </header>

      <div className="container-page py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
          {/* On mobile this block sits directly below the introduction; on desktop it
              becomes a sticky right sidebar. */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:order-2 lg:self-start">
            <TableOfContents
              sections={article.sections}
              extra={extraToc}
              heading={ui.article.tableOfContents}
            />

            <Card className="p-5">
              <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-3 uppercase">
                {ui.article.keyFacts}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {article.keyFacts.map((fact) => (
                  <div key={fact.label} className="border-b border-line pb-3 last:border-0 last:pb-0">
                    <dt className="text-ink-3">{fact.label}</dt>
                    <dd className="mt-0.5 font-medium text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-5">
              <h2 className="font-sans text-xs font-semibold tracking-[0.16em] text-ink-3 uppercase">
                {ui.article.relatedTopics}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={localePath(locale, item.href)}
                      className="inline-flex rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-burgundy hover:text-burgundy"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>

          <div className="lg:order-1">
            <div className="prose-article max-w-none">
              {article.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <section id="important-dates" className="mt-14 scroll-mt-28">
              <h2 className="text-2xl text-ink">{ui.article.importantDates}</h2>
              <ol className="mt-6 space-y-0 border-l-2 border-line pl-6">
                {article.importantDates.map((entry) => (
                  <li key={entry.year + entry.event} className="relative pb-6 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute top-1.5 -left-[31px] h-3.5 w-3.5 rounded-full border-2 border-burgundy bg-paper"
                    />
                    <p className="font-serif text-base font-semibold text-burgundy">{entry.year}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">{entry.event}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="significance" className="mt-14 scroll-mt-28">
              <Card className="bg-burgundy-soft p-6 md:p-8">
                <h2 className="text-2xl text-ink">{article.significance.heading}</h2>
                <div className="prose-article mt-4">
                  {article.significance.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </Card>
            </section>

            <section id="interesting-facts" className="mt-14 scroll-mt-28">
              <h2 className="text-2xl text-ink">{ui.article.interestingFacts}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {article.interestingFacts.map((fact, index) => (
                  <li
                    key={fact}
                    className="rounded-2xl border border-line bg-surface p-5 text-[0.95rem] leading-relaxed text-ink-2"
                  >
                    <span className="mb-2 block font-serif text-lg text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {fact}
                  </li>
                ))}
              </ul>
            </section>

            <section id="related-figures" className="mt-14 scroll-mt-28">
              <h2 className="text-2xl text-ink">{ui.article.relatedFigures}</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {article.relatedFigures.map((figure) => (
                  <li key={figure.name} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-paper-2">
                      <PlaceholderImage
                        seed={figure.name}
                        variant="portrait"
                        label={figure.name}
                        alt={t(ui.article.portraitAlt, { name: figure.name })}
                      />
                    </div>
                    <h3 className="text-base text-ink">{figure.name}</h3>
                    <p className="text-xs font-medium text-burgundy">{figure.lifespan}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-3">{figure.description}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section id="sources" className="mt-14 scroll-mt-28">
              <h2 className="text-2xl text-ink">{ui.article.sources}</h2>
              <ul className="mt-5 space-y-3 text-sm text-ink-2">
                {sources.map((source) => (
                  <li key={source.title} className="border-b border-line pb-3 last:border-0">
                    {source.author ? <span>{source.author}. </span> : null}
                    <span className="font-medium text-ink">{source.title}</span>
                    <span className="text-ink-3">
                      {" — "}
                      {source.publisher}
                      {source.year ? `, ${source.year}` : ""}
                    </span>
                    {/* The identifier is the part a reader can act on: it is what
                        turns a citation into something findable in a library
                        catalogue rather than a name to take on trust. */}
                    <SourceIdentifierLink identifier={source.identifier} label={ui.article.visitSource} />
                    {source.note ? (
                      <span className="mt-1 block text-ink-3 italic">{source.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <ArticleNav
              locale={locale}
              ui={ui}
              previous={previous}
              next={next}
              categoryLabel={article.categoryLabel}
            />
          </div>
        </div>
      </div>

      <RelatedArticles
        locale={locale}
        ui={ui}
        articles={related}
        title={ui.article.relatedArticles}
      />
    </article>
  );
}
