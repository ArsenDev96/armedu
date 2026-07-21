import Link from "next/link";
import type { ArticleSummary, CategoryId } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { ClockIcon } from "@/components/ui/icons";
import { ArrowLink, Card, Pill } from "@/components/ui/primitives";
import { t } from "@/lib/i18n";
import { getArticleImageSrc, IMAGE_SIZES } from "@/lib/media";

export function ArticleCard({
  article,
  ui,
  variant = "default",
  headingLevel: Heading = "h3",
}: {
  /** `href` must already carry the locale prefix. */
  article: ArticleSummary;
  ui: UiDictionary;
  /** `compact` is the homepage form: narrow, six to a row, no excerpt footer. */
  variant?: "default" | "compact";
  headingLevel?: "h2" | "h3";
}) {
  /** The compact card is too narrow for the full section name. */
  const shortLabels: Record<CategoryId, string> = {
    history: ui.article.typeHistory,
    writers: ui.article.typeWriters,
    works: ui.article.typeWorks,
  };

  const readingTime = t(ui.article.readingTime, { minutes: article.readingTime });
  const imageAlt = article.image?.alt ?? t(ui.article.imageAlt, { title: article.title });
  const imageSrc = getArticleImageSrc(article);

  if (variant === "compact") {
    return (
      <Card as="article" interactive className="group relative flex h-full flex-col overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-paper-2">
          <ContentPhoto
            src={imageSrc}
            seed={article.imageSeed}
            alt={imageAlt}
            sizes={IMAGE_SIZES.compact}
            className="transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[0.625rem] font-semibold tracking-[0.12em] text-burgundy uppercase">
            {shortLabels[article.category] ?? article.categoryLabel}
          </p>
          <Heading className="mt-2 text-sm leading-snug text-ink">
            <Link href={article.href} className="transition hover:text-burgundy">
              <span className="absolute inset-0" />
              {article.title}
            </Link>
          </Heading>
          {/* No `flex-1` here: growing a `-webkit-box` past its clamp height
              lets a fourth line paint below the ellipsis. */}
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-3">{article.excerpt}</p>
          <p className="mt-auto flex items-center gap-1.5 pt-4 text-[0.6875rem] text-ink-3">
            <ClockIcon className="h-3.5 w-3.5" />
            {readingTime}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden">
      <Link
        href={article.href}
        className="block aspect-[16/9] overflow-hidden bg-paper-2"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ContentPhoto
          src={imageSrc}
          seed={article.imageSeed}
          alt={imageAlt}
          sizes={IMAGE_SIZES.card}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Pill>{article.categoryLabel}</Pill>
          {article.period ? <span className="text-xs text-ink-3">{article.period}</span> : null}
        </div>
        <Heading className="text-lg leading-snug text-ink">
          <Link href={article.href} className="transition hover:text-burgundy">
            {article.title}
          </Link>
        </Heading>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-3">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="text-xs text-ink-3">{readingTime}</span>
          <ArrowLink href={article.href}>{ui.listing.history.readArticle}</ArrowLink>
        </div>
      </div>
    </Card>
  );
}
