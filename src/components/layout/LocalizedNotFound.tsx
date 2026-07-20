"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/primitives";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/data/types";

export interface NotFoundMessages {
  eyebrow: string;
  title: string;
  body: string;
  backHome: string;
  exploreHistory: string;
}

/**
 * The 404 body, in the language of the URL that missed.
 *
 * `not-found.tsx` cannot read route params, so the locale is recovered from the
 * pathname on the client. The strings for all editions are passed in from the
 * server — five short strings per locale, far cheaper than pulling the content
 * bundles into the client just to read a dictionary.
 */
export function LocalizedNotFound({
  messages,
}: {
  messages: Record<Locale, NotFoundMessages>;
}) {
  const pathname = usePathname();
  const first = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const text = messages[locale];

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold tracking-[0.18em] text-burgundy uppercase">
        {text.eyebrow}
      </p>
      <h1 className="mt-4 text-3xl text-ink sm:text-4xl">{text.title}</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-3">{text.body}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={`/${locale}`}>{text.backHome}</ButtonLink>
        <ButtonLink href={`/${locale}/history`} variant="secondary">
          {text.exploreHistory}
        </ButtonLink>
      </div>
    </div>
  );
}
