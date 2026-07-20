import {
  LocalizedNotFound,
  type NotFoundMessages,
} from "@/components/layout/LocalizedNotFound";
import { SUPPORTED_LOCALES, type Locale } from "@/data/types";
import { getUi } from "@/lib/i18n";
import "./globals.css";

/**
 * Localised 404.
 *
 * This has to live at the app root: Next resolves `notFound()` to the root
 * `not-found.tsx`, not to one nested under `[locale]`, and it renders it
 * outside the locale layout — so the stylesheet is imported here explicitly.
 *
 * Because a not-found file cannot read route params, every edition's copy is
 * gathered here and the client component picks the right one from the URL.
 */
export default function NotFound() {
  const messages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => {
      const { notFound } = getUi(locale);
      return [
        locale,
        {
          eyebrow: notFound.eyebrow,
          title: notFound.title,
          body: notFound.body,
          backHome: notFound.backHome,
          exploreHistory: notFound.exploreHistory,
        } satisfies NotFoundMessages,
      ];
    }),
  ) as Record<Locale, NotFoundMessages>;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <LocalizedNotFound messages={messages} />
    </div>
  );
}
