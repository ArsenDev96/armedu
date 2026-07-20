import Image from "next/image";
import type { Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { ButtonLink } from "@/components/ui/primitives";
import { localePath } from "@/lib/i18n";

/**
 * Homepage hero: copy on a warm paper field at the left, photography bleeding
 * to the right edge of the viewport.
 *
 * The copy sits in a plain `container-page`, so its left edge lines up with
 * every section below it. The photograph is taken out of flow at `lg` instead
 * of sharing a grid with the copy — nesting a container inside a grid column
 * would gutter it against the column rather than the page.
 */
export function Hero({ locale, ui }: { locale: Locale; ui: UiDictionary }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-paper-2 to-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gold-soft/70 blur-3xl"
      />

      <div className="relative z-10 container-page py-12 sm:py-16 lg:min-h-[26rem] lg:py-20">
        {/* Narrower at `lg` so the copy stops short of the photograph's faded
            edge — past that the picture shows through the text. */}
        <div className="lg:max-w-[26rem] xl:max-w-[34rem]">
          {/* Steps down at `lg`, where the copy is at its narrowest relative to
              the type — otherwise "Discover Armenian" breaks. */}
          <h1 className="text-[2.25rem] leading-[1.1] text-ink sm:text-5xl lg:text-[2.5rem] xl:text-[3.25rem]">
            {ui.home.heroTitleLead}
            <span className="text-burgundy">{ui.home.heroTitleAccent}</span>
            {ui.home.heroTitleTail}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-2">
            {ui.home.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={localePath(locale, "/history")}>
              {ui.home.heroPrimaryCta}
              <span aria-hidden="true" className="text-base leading-none">
                →
              </span>
            </ButtonLink>
            <ButtonLink href={localePath(locale, "/writers")} variant="outline-gold">
              {ui.home.heroSecondaryCta}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Photograph — a banner under the copy on narrow screens, pinned to the
          right half of the section from `lg`. No background colour behind it:
          the masked edge must reveal the section's own paper wash. */}
      <div className="relative h-56 sm:h-72 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]">
        {/* The subject sits right of centre, so the crop is biased that way —
            the monastery stays in frame however tall the column gets. */}
        <Image
          src="/hero-ararat.png"
          alt={ui.home.heroImageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover object-[62%_50%] lg:photo-fade-left"
        />
      </div>
    </section>
  );
}
