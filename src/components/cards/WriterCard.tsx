import Link from "next/link";
import type { Writer } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { ArrowLink, Card } from "@/components/ui/primitives";
import { t } from "@/lib/i18n";
import { getImageSrc, IMAGE_SIZES, PORTRAIT_FOCUS } from "@/lib/media";

export function WriterCard({
  writer,
  href,
  ui,
  variant = "default",
}: {
  writer: Writer;
  /** Locale-prefixed destination. */
  href: string;
  ui: UiDictionary;
  /** `horizontal` is the homepage form: portrait left, copy right. */
  variant?: "default" | "horizontal";
}) {
  const src = getImageSrc(writer.slug);
  // The generated fallback really is a placeholder; the shipped artwork is a
  // drawn portrait. Saying "placeholder" over the latter would be wrong.
  const alt = t(src ? ui.article.portraitIllustrationAlt : ui.article.portraitAlt, {
    name: writer.name,
  });

  if (variant === "horizontal") {
    return (
      <Card as="article" interactive className="group relative flex h-full overflow-hidden">
        <div className="w-[38%] shrink-0 overflow-hidden bg-paper-2">
          <ContentPhoto
            src={src}
            seed={writer.imageSeed}
            variant="portrait"
            label={writer.name}
            alt={alt}
            sizes={IMAGE_SIZES.thumb}
            focus={PORTRAIT_FOCUS}
            className="h-full transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-base leading-snug text-ink">
            <Link href={href} className="transition hover:text-burgundy">
              <span className="absolute inset-0" />
              {writer.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-ink-3">{writer.lifespan}</p>
          {/* No `flex-1` here: growing a `-webkit-box` past its clamp height
              lets a fourth line paint below the ellipsis. */}
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-3">
            {writer.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-burgundy">
            {ui.listing.writers.readBiography}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Card>
    );
  }

  return (
    <Card as="article" interactive className="group flex h-full flex-col overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-paper-2">
        <ContentPhoto
          src={src}
          seed={writer.imageSeed}
          variant="portrait"
          label={writer.name}
          alt={alt}
          sizes={IMAGE_SIZES.card}
          focus={PORTRAIT_FOCUS}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-lg leading-snug text-ink">
          <Link href={href} className="transition hover:text-burgundy">
            {writer.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-burgundy">{writer.lifespan}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-3">{writer.description}</p>
        <ArrowLink href={href} className="mt-5">
          {ui.listing.writers.readBiography}
        </ArrowLink>
      </div>
    </Card>
  );
}
