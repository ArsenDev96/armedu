import type { Locale } from "@/data/types";
import type { UiDictionary } from "@/data/ui";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GlobeIcon } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/primitives";
import { localePath } from "@/lib/i18n";

/**
 * Full-width call-out addressed to the Armenian diaspora. The artwork sits
 * behind the copy behind a warm scrim, so a photograph can replace
 * `PlaceholderImage` without changing the contrast of the text above it.
 */
export function DiasporaBand({ locale, ui }: { locale: Locale; ui: UiDictionary }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line">
      <div aria-hidden="true" className="absolute inset-0">
        <PlaceholderImage seed="diaspora-band" alt="" variant="wide" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-paper-2/95 via-paper-2/80 to-paper-2/40"
      />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
        <span
          aria-hidden="true"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-burgundy text-white"
        >
          <GlobeIcon className="h-6 w-6" />
        </span>

        <div className="flex-1">
          <h2 className="text-xl leading-tight text-ink sm:text-2xl">{ui.home.diasporaTitle}</h2>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink-2">
            {ui.home.diasporaText}
          </p>
        </div>

        <ButtonLink
          href={localePath(locale, "/history")}
          className="shrink-0 self-start md:self-center"
        >
          {ui.home.diasporaCta}
          <span aria-hidden="true">→</span>
        </ButtonLink>
      </div>
    </div>
  );
}
