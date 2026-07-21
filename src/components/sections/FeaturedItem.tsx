import type { ReactNode } from "react";
import { ContentPhoto } from "@/components/ui/ContentPhoto";
import { ArrowLink, Card, Pill } from "@/components/ui/primitives";
import { IMAGE_SIZES, PORTRAIT_FOCUS } from "@/lib/media";

/** Large highlight block used at the top of listing pages. */
export function FeaturedItem({
  eyebrow,
  title,
  subtitle,
  description,
  href,
  linkLabel,
  imageSeed,
  imageSrc,
  imageAlt,
  variant = "motif",
  meta,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  linkLabel: string;
  imageSeed: string;
  /** Shipped artwork; the generated fallback renders when it is absent. */
  imageSrc?: string;
  imageAlt: string;
  variant?: "motif" | "portrait";
  meta?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[16/10] bg-paper-2 md:aspect-auto md:min-h-[19rem]">
          <ContentPhoto
            src={imageSrc}
            seed={imageSeed}
            alt={imageAlt}
            variant={variant}
            label={title}
            sizes={IMAGE_SIZES.featured}
            focus={variant === "portrait" ? PORTRAIT_FOCUS : undefined}
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:p-10">
          <Pill tone="gold" className="self-start">
            {eyebrow}
          </Pill>
          <h2 className="mt-4 text-2xl leading-tight text-ink md:text-3xl">{title}</h2>
          {subtitle ? <p className="mt-1.5 font-medium text-burgundy">{subtitle}</p> : null}
          <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-3">{description}</p>
          {meta ? <div className="mt-5">{meta}</div> : null}
          <ArrowLink href={href} className="mt-6">
            {linkLabel}
          </ArrowLink>
        </div>
      </div>
    </Card>
  );
}
