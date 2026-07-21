import Link from "next/link";
import type { LiteraryWork } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { ArrowLink, Card, Pill } from "@/components/ui/primitives";
import { t } from "@/lib/i18n";
import { getImageSrc, IMAGE_SIZES } from "@/lib/media";

export function WorkCard({
  work,
  href,
  ui,
}: {
  work: LiteraryWork;
  /** Locale-prefixed destination. */
  href: string;
  ui: UiDictionary;
}) {
  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden sm:flex-row">
      <div className="aspect-[16/9] shrink-0 overflow-hidden bg-paper-2 sm:aspect-auto sm:w-44 lg:w-52">
        <ContentPhoto
          src={getImageSrc(work.slug)}
          seed={work.imageSeed}
          alt={t(ui.article.imageAlt, { title: work.title })}
          sizes={IMAGE_SIZES.side}
          className="h-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill tone="gold">{work.genre}</Pill>
          <span className="text-xs text-ink-3">{work.publicationPeriod}</span>
        </div>
        <h3 className="text-lg leading-snug text-ink">
          <Link href={href} className="transition hover:text-burgundy">
            {work.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-burgundy">{work.author}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-3">{work.summary}</p>
        <ArrowLink href={href} className="mt-5">
          {ui.listing.works.readSummary}
        </ArrowLink>
      </div>
    </Card>
  );
}
