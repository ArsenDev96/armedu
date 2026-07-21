import Link from "next/link";
import type { CategoryId } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { Card, Pill } from "@/components/ui/primitives";
import { t } from "@/lib/i18n";
import { getImageSrc, IMAGE_SIZES, PORTRAIT_FOCUS } from "@/lib/media";
import type { SearchResult } from "@/lib/search";

/**
 * One global-search hit. Uses the same card shell and generated artwork as the
 * listings, laid out horizontally so many results fit on one screen.
 */
export function SearchResultCard({ result, ui }: { result: SearchResult; ui: UiDictionary }) {
  const typeLabels: Record<CategoryId, string> = {
    history: ui.search.typeHistory,
    writers: ui.search.typeWriter,
    works: ui.search.typeWork,
  };

  const portrait = result.type === "writers";
  const src = getImageSrc(result.slug);

  return (
    <Card as="li" interactive className="group relative flex overflow-hidden">
      <div className="hidden w-32 shrink-0 overflow-hidden bg-paper-2 sm:block lg:w-40">
        <ContentPhoto
          src={src}
          seed={result.imageSeed}
          variant={portrait ? "portrait" : "motif"}
          label={result.title}
          alt={t(ui.article.imageAlt, { title: result.title })}
          sizes={IMAGE_SIZES.thumb}
          focus={portrait ? PORTRAIT_FOCUS : undefined}
          className="h-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <Pill>{typeLabels[result.type]}</Pill>
          {result.meta ? <span className="text-xs text-ink-3">{result.meta}</span> : null}
        </div>
        <h3 className="text-lg leading-snug text-ink">
          <Link href={result.href} className="transition hover:text-burgundy">
            {/* Full-card hit area; the heading link remains the accessible name. */}
            <span className="absolute inset-0" aria-hidden="true" />
            {result.title}
          </Link>
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-3">{result.description}</p>
      </div>
    </Card>
  );
}
